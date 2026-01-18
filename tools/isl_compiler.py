import os
import re
import sys

def resolve_references(file_path, base_dir=None, depth=0):
    """
    Reads an ISL file and recursively resolves external references defined via:
    > **Reference**: ... in [path](path)
    """
    if depth > 5: # Prevent infinite recursion
        return f"\n[ERROR: Maximum recursion depth exceeded for {file_path}]\n"

    if base_dir is None:
        base_dir = os.path.dirname(file_path)

    if not os.path.exists(file_path):
        return f"\n[ERROR: File not found: {file_path}]\n"

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        return f"\n[ERROR: Could not read file {file_path}: {str(e)}]\n"

    resolved_content = []
    # Regex to capture the path in markdown link: [text](path) inside a Reference block
    ref_pattern = re.compile(r'^>\s*\*\*Reference\*\*.*\[.*?\]\((.*?)\)')

    for line in lines:
        match = ref_pattern.search(line)
        if match:
            rel_path = match.group(1)
            # Resolve path relative to the current file
            abs_path = os.path.normpath(os.path.join(base_dir, rel_path))
            
            resolved_content.append(line) # Keep the reference line for context
            resolved_content.append(f"\n<!-- START EXTERNAL CONTEXT: {rel_path} -->\n")
            
            # Recursively resolve
            external_content = resolve_references(abs_path, os.path.dirname(abs_path), depth + 1)
            resolved_content.append(external_content)
            
            resolved_content.append(f"\n<!-- END EXTERNAL CONTEXT -->\n")
        else:
            resolved_content.append(line)

    return "".join(resolved_content)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python isl_compiler.py <input_file.isl.md>")
        sys.exit(1)

    input_file = sys.argv[1]
    # Print to stdout so it can be piped or copied
    print(resolve_references(os.path.abspath(input_file)))