import sys
import os
from google import genai

def review_file(file_path):
    # Ensure the API key is set
    if not os.environ.get("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY environment variable not found.")
        sys.exit(1)

    # Check if the target file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)

    # Read the target file's code
    with open(file_path, 'r') as f:
        source_code = f.read()

    print(f"Analyzing {file_path} via Gemini API...")

    # Initialize the standard GenAI client
    client = genai.Client()

    # Construct a clear prompt for the code review
    prompt = f"""
    You are an expert AI code reviewer. Analyze the following code for any architectural flaws, 
    bugs, or deployment risks. Provide an optimized version of the code and briefly explain 
    the improvements.

    File Content:
    {source_code}
    """

    # Generate the response using the fast, programming-optimized model
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )

    print("\n=== AI Analysis & Optimized Code ===\n")
    print(response.text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python review_code.py <path_to_code_file>")
        sys.exit(1)
        
    review_file(sys.argv[1])

