import os
import json
import argparse
from jsonschema import validate, exceptions

# Configuration
SCHEMA_DIR = 'schemas'
DATA_DIR = 'data'

def load_json_file(filepath):
    """Loads a JSON file from the given path."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {filepath}: {e}")
        return None

def find_files(directory, extension):
    """Recursively finds all files with the given extension."""
    files = []
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(extension):
                files.append(os.path.join(root, filename))
    return files

def validate_data_against_schema(data_file, schema_file):
    """Validates a data file against a schema file."""
    schema = load_json_file(schema_file)
    data = load_json_file(data_file)
    
    if not schema or not data:
        return False

    print(f"Validating {data_file} against {schema_file}...")
    try:
        validate(instance=data, schema=schema)
        print(f"SUCCESS: {data_file} is valid.")
        return True
    except exceptions.ValidationError as e:
        print(f"FAILURE: {data_file} is INVALID.")
        print(f"  Schema Error: {e.message}")
        print(f"  Path: {list(e.path)}")
        return False
    except Exception as e:
        print(f"FAILURE: An unexpected error occurred during validation of {data_file}: {e}")
        return False

def main():
    """Main function to find and validate all JSON data files."""
    parser = argparse.ArgumentParser(description="JSON Schema Validator for Monorepo.")
    parser.add_argument('--schema-dir', default=SCHEMA_DIR, help='Directory containing JSON schema files.')
    parser.add_argument('--data-dir', default=DATA_DIR, help='Directory containing JSON data files to validate.')
    args = parser.parse_args()

    # Ensure jsonschema is installed
    try:
        import jsonschema
    except ImportError:
        print("Error: 'jsonschema' library not found. Please install it with 'pip install jsonschema'")
        return 1

    # Find all schema and data files
    schema_files = find_files(args.schema_dir, '.json')
    data_files = find_files(args.data_dir, '.json')
    
    if not schema_files:
        print(f"Warning: No schema files found in {args.schema_dir}. Skipping validation.")
        return 0
    
    if not data_files:
        print(f"Warning: No data files found in {args.data_dir}. Skipping validation.")
        return 0

    # Simple mapping: assume data file path is relative to DATA_DIR, and schema file has same name in SCHEMA_DIR
    # e.g., data/users/user1.json -> schemas/users.json
    
    # For a more robust monorepo, we'll assume a single 'master' schema for now, or a mapping file.
    # Since we don't have the repo structure, we'll create a simple one-to-one mapping for demonstration.
    
    # Let's assume the user will create a 'master.schema.json' in the 'schemas' directory.
    master_schema_path = os.path.join(args.schema_dir, 'master.schema.json')
    if not os.path.exists(master_schema_path):
        print(f"Error: Master schema file not found at {master_schema_path}. Please create it.")
        return 1
        
    all_valid = True
    for data_file in data_files:
        if not validate_data_against_schema(data_file, master_schema_path):
            all_valid = False
            
    if all_valid:
        print("\nAll JSON data files passed validation against the master schema.")
        return 0
    else:
        print("\nOne or more JSON data files failed validation.")
        return 1

if __name__ == '__main__':
    # Create dummy directories and files for testing
    os.makedirs(SCHEMA_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Create a dummy master schema
    dummy_schema = {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "active": {"type": "boolean"}
        },
        "required": ["id", "name"]
    }
    with open(os.path.join(SCHEMA_DIR, 'master.schema.json'), 'w') as f:
        json.dump(dummy_schema, f, indent=2)
        
    # Create a dummy valid data file
    dummy_data_valid = {"id": 1, "name": "Test User", "active": True}
    with open(os.path.join(DATA_DIR, 'user_valid.json'), 'w') as f:
        json.dump(dummy_data_valid, f, indent=2)
        
    # Create a dummy invalid data file
    dummy_data_invalid = {"id": "one", "active": True} # 'id' should be integer, 'name' is missing
    with open(os.path.join(DATA_DIR, 'user_invalid.json'), 'w') as f:
        json.dump(dummy_data_invalid, f, indent=2)
        
    exit_code = main()
    # Clean up dummy files/dirs
    os.remove(os.path.join(SCHEMA_DIR, 'master.schema.json'))
    os.rmdir(SCHEMA_DIR)
    os.remove(os.path.join(DATA_DIR, 'user_valid.json'))
    os.remove(os.path.join(DATA_DIR, 'user_invalid.json'))
    os.rmdir(DATA_DIR)
    
    if exit_code != 0:
        exit(exit_code)
