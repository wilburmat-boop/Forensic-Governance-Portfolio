import json
import os

def check_for_red_flags(register_file='[PATH_FROM_FIND]'):
    if not os.path.exists(register_file):
        print(f"--- FORENSIC TELEMETRY ---")
        print(f"Status: Local Register found at 'Evidence_Core/EthicHawks_Master_Register_2026-04-03'.")
        print(f"Action required: Ensure the master register is compiled to JSON format to trigger automated alarms.")
        return

    with open(register_file, 'r') as f:
        data = json.load(f)

    print("--- FORENSIC TELEMETRY: RED FLAG STATUS ---")
    for item in data.get('cases', []):
        status = item.get('status', '').upper()
        if status in ['RED', 'AMBER']:
            print(f"[{status}] ALERT: {item.get('title')} - {item.get('summary')}")
    print("-------------------------------------------")

if __name__ == "__main__":
    check_for_red_flags()
