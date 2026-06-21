import os
import PyPDF2
from docx import Document

def get_text_content(filepath):
    if filepath.endswith('.pdf'):
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            return " ".join([page.extract_text() for page in reader.pages])
    elif filepath.endswith('.docx'):
        doc = Document(filepath)
        return " ".join([p.text for p in doc.paragraphs])
    return ""

def classify(text):
    text = text.lower()
    if "notice of motion" in text: return "02O_High_Court" # Or Labour_Court
    if "affidavit" in text: return "02M_Department_of_Justice"
    return "Uncategorized"

# Main loop to read all files in 02_Evidence_Core and move them
# ... logic to iterate and move ...

