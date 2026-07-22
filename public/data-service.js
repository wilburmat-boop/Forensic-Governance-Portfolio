/**
 * EthicHawks Data Service
 * ------------------------------------------------------------------
 * Non-destructive data-loading layer.
 *
 * What it does:
 *   1. Loads the three fresh JSON files at startup.
 *   2. Builds a lookup map keyed by filename (and by a couple of
 *      other likely keys) so evidence links can be matched even if
 *      we're not 100% sure yet which field the HTML uses.
 *   3. Intercepts clicks on evidence links/buttons (event delegation
 *      — no changes to existing tab markup required).
 *   4. Looks up the correct path + SHA-256 hash from fresh data.
 *   5. Calls whichever PDF-modal function it finds on `window`
 *      (tries several common names) with the corrected values.
 *
 * It does NOT modify index.html structure. The only integration
 * point is a single <script src="/public/data-service.js"></script>
 * tag (or /data-service.js, adjust to wherever you place it).
 *
 * ASSUMPTIONS TO VERIFY (flagged clearly so we can tighten this):
 *   - JSON file names: tab_data_by_date.json, tab_data_by_folder.json,
 *     tab_data_master.json, all served from /public/ alongside the
 *     other data files. Adjust DATA_FILES below if paths differ.
 *   - Each JSON record has SOME identifying field for the evidence
 *     item (filename, id, path) and a `hash` or `sha256` field.
 *     The service tries several common field names — check the
 *     console warnings on load to see what it actually found.
 *   - The click target is an <a> or element with an href/data
 *     attribute pointing at a PDF, OR has a data-evidence-id /
 *     data-filename attribute. Adjust EVIDENCE_SELECTOR below.
 *   - The modal open function is one of: openPdfModal, showPdfModal,
 *     openEvidenceModal, viewEvidence, openModal — first one found
 *     on window is used. If none match, it logs the click payload
 *     to console instead of failing silently.
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const DATA_FILES = [
    '/tab_data_by_date.json',
    '/tab_data_by_folder.json',
    '/tab_data_master.json'
  ];

  const EVIDENCE_SELECTOR = [
    'a[href$=".pdf"]',
    'a[data-evidence-id]',
    'a[data-filename]',
    '[data-evidence]',
    '[onclick*="Modal"]',
    '[onclick*="modal"]'
  ].join(', ');

  const MODAL_FN_CANDIDATES = [
    'openPdfModal',
    'showPdfModal',
    'openEvidenceModal',
    'viewEvidence',
    'openModal'
  ];

  const HASH_FIELD_CANDIDATES = ['hash', 'sha256', 'sha256_hash', 'fileHash'];
  const PATH_FIELD_CANDIDATES = ['path', 'filepath', 'file_path', 'url', 'src'];
  const KEY_FIELD_CANDIDATES = ['filename', 'file', 'name', 'id'];

  const lookupByFilename = new Map();
  const lookupById = new Map();
  let loaded = false;
  let loadErrors = [];

  function firstPresentField(obj, candidates) {
    for (const key of candidates) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
        return { key, value: obj[key] };
      }
    }
    return null;
  }

  function basename(p) {
    if (!p) return null;
    return String(p).split('/').pop();
  }

  function indexRecord(record) {
    if (!record || typeof record !== 'object') return;

    const keyField = firstPresentField(record, KEY_FIELD_CANDIDATES);
    const pathField = firstPresentField(record, PATH_FIELD_CANDIDATES);
    const hashField = firstPresentField(record, HASH_FIELD_CANDIDATES);

    const entry = {
      raw: record,
      path: pathField ? pathField.value : null,
      hash: hashField ? hashField.value : null
    };

    if (keyField) {
      lookupById.set(String(keyField.value), entry);
      const bn = basename(keyField.value);
      if (bn) lookupByFilename.set(bn, entry);
    }
    if (entry.path) {
      const bn = basename(entry.path);
      if (bn) lookupByFilename.set(bn, entry);
    }
  }

  function walkAndIndex(data) {
    // Handles both flat arrays and nested { tabName: [...] } / { date: [...] } shapes.
    if (Array.isArray(data)) {
      data.forEach(indexRecord);
    } else if (data && typeof data === 'object') {
      Object.values(data).forEach((val) => {
        if (Array.isArray(val)) {
          val.forEach(indexRecord);
        } else if (val && typeof val === 'object') {
          indexRecord(val);
        }
      });
    }
  }

  async function loadAll() {
    const results = await Promise.allSettled(
      DATA_FILES.map((url) =>
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
          return r.json();
        })
      )
    );

    results.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        walkAndIndex(res.value);
      } else {
        loadErrors.push(`${DATA_FILES[i]}: ${res.reason}`);
      }
    });

    loaded = true;

    console.log(
      `[data-service] Indexed ${lookupByFilename.size} filename keys, ${lookupById.size} id keys.`
    );
    if (loadErrors.length) {
      console.warn('[data-service] Some data files failed to load:', loadErrors);
    }
    if (lookupByFilename.size === 0 && lookupById.size === 0) {
      console.warn(
        '[data-service] No records indexed. Check DATA_FILES paths and JSON shape — dumping first loaded payload keys above may help.'
      );
    }
  }

  function findModalFn() {
    for (const name of MODAL_FN_CANDIDATES) {
      if (typeof window[name] === 'function') return { name, fn: window[name] };
    }
    return null;
  }

  function resolveEntryFromElement(el) {
    const dataId = el.getAttribute('data-evidence-id') || el.getAttribute('data-filename');
    if (dataId) {
      const byId = lookupById.get(dataId) || lookupByFilename.get(basename(dataId));
      if (byId) return byId;
    }
    const href = el.getAttribute('href');
    if (href) {
      const bn = basename(href);
      if (bn && lookupByFilename.has(bn)) return lookupByFilename.get(bn);
    }
    // Fallback: try to pull a filename out of any onclick attribute text.
    const onclick = el.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/['"]([^'"]+\.pdf)['"]/i);
      if (match) {
        const bn = basename(match[1]);
        if (bn && lookupByFilename.has(bn)) return lookupByFilename.get(bn);
      }
    }
    return null;
  }

  function onDocumentClick(e) {
    const el = e.target.closest(EVIDENCE_SELECTOR);
    if (!el) return;
    if (!loaded) {
      console.warn('[data-service] Click received before data finished loading; letting default behavior run.');
      return;
    }

    const entry = resolveEntryFromElement(el);
    if (!entry) {
      console.warn('[data-service] No fresh-data match for clicked element:', el);
      return; // let existing onclick/href behavior run as fallback
    }

    const modal = findModalFn();
    if (!modal) {
      console.warn(
        '[data-service] No known modal function found on window. Resolved entry was:',
        entry,
        '— update MODAL_FN_CANDIDATES with the correct function name.'
      );
      return;
    }

    e.preventDefault();
    console.log(`[data-service] Opening via ${modal.name}():`, entry.path, entry.hash);
    modal.fn(entry.path, entry.hash, entry.raw);
  }

  document.addEventListener('click', onDocumentClick, true);

  document.addEventListener('DOMContentLoaded', () => {
    loadAll();
  });
  // In case the script loads after DOMContentLoaded already fired.
  if (document.readyState !== 'loading') {
    loadAll();
  }

  // Exposed for manual testing from the browser console.
  window.EthicHawksDataService = {
    reload: loadAll,
    lookupByFilename,
    lookupById,
    isLoaded: () => loaded,
    errors: () => loadErrors
  };
})();
