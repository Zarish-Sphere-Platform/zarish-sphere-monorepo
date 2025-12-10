import os
import re
from collections import defaultdict

# Configuration
DOCS_DIR = 'docs'
MASTER_INDEX_FILE = os.path.join(DOCS_DIR, 'INDEX.md')
BACKLINKS_HEADER = "## Backlinks"

def get_markdown_files(directory):
    """Recursively finds all markdown files in the given directory."""
    md_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.md', '.markdown')) and file != os.path.basename(MASTER_INDEX_FILE):
                md_files.append(os.path.join(root, file))
    return md_files

def extract_metadata(filepath):
    """Extracts title and relative path for a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Extract Title (H1 or YAML frontmatter)
    title_match = re.search(r'^#\s+(.*)', content, re.MULTILINE)
    if title_match:
        title = title_match.group(1).strip()
    else:
        # Fallback to filename
        title = os.path.basename(filepath).replace('.md', '').replace('-', ' ').title()

    # 2. Get relative path for linking
    relative_path = os.path.relpath(filepath, DOCS_DIR).replace('\\', '/')
    
    return title, relative_path, content

def find_links_and_backlinks(md_files):
    """Finds all internal links and builds a backlink map."""
    all_files_data = {}
    backlinks = defaultdict(set)
    
    for filepath in md_files:
        title, relative_path, content = extract_metadata(filepath)
        all_files_data[relative_path] = {'title': title, 'content': content}
        
        # Find all Markdown links: [text](path)
        # We only care about links that point to other markdown files in the docs folder
        link_pattern = re.compile(r'\[.*?\]\((.*?)\)')
        
        for match in link_pattern.finditer(content):
            link_target = match.group(1)
            
            # Normalize link target to a relative path within DOCS_DIR
            # This is a simplification, a robust solution would handle all path types
            if link_target.endswith(('.md', '.markdown')):
                # Simple relative path resolution
                target_path = os.path.normpath(os.path.join(os.path.dirname(relative_path), link_target)).replace('\\', '/')
                
                # Check if the target file exists in our list of files (a bit of a hack, but works for simple cases)
                # A more robust check would involve checking the filesystem
                if target_path in all_files_data or os.path.exists(os.path.join(DOCS_DIR, target_path)):
                    backlinks[target_path].add(relative_path)
                    
    return all_files_data, backlinks

def generate_master_index(all_files_data):
    """Generates the content for the MASTER_INDEX_FILE."""
    index_content = "# Master Documentation Index\n\n"
    index_content += "This index is automatically generated and updated on every push to the repository.\n\n"
    
    # Sort files alphabetically by title
    sorted_files = sorted(all_files_data.items(), key=lambda item: item[1]['title'])
    
    for relative_path, data in sorted_files:
        index_content += f"- [{data['title']}]({relative_path})\n"
        
    return index_content

def update_backlinks(all_files_data, backlinks):
    """Updates each markdown file with a Backlinks section."""
    for relative_path, data in all_files_data.items():
        filepath = os.path.join(DOCS_DIR, relative_path)
        
        # 1. Remove existing Backlinks section
        content_without_backlinks = re.split(r'\n{1,2}##\s+Backlinks', data['content'], 1)[0].strip()
        
        # 2. Generate new Backlinks section
        backlinks_list = []
        if relative_path in backlinks:
            for source_path in sorted(backlinks[relative_path]):
                source_title = all_files_data.get(source_path, {}).get('title', source_path)
                backlinks_list.append(f"- [{source_title}](../{source_path})") # Use relative path from the current file
        
        new_content = content_without_backlinks
        if backlinks_list:
            new_content += f"\n\n{BACKLINKS_HEADER}\n\n"
            new_content += "\n".join(backlinks_list)
            
        # 3. Write the updated content back to the file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content + '\n') # Ensure trailing newline

def main():
    """Main function to orchestrate index and backlink generation."""
    print(f"Starting index and backlink generation from {DOCS_DIR}...")
    
    md_files = get_markdown_files(DOCS_DIR)
    all_files_data, backlinks = find_links_and_backlinks(md_files)
    
    # 1. Generate Master Index
    index_content = generate_master_index(all_files_data)
    with open(MASTER_INDEX_FILE, 'w', encoding='utf-8') as f:
        f.write(index_content)
    print(f"Successfully generated Master Index at {MASTER_INDEX_FILE}")
    
    # 2. Update Backlinks in all files
    update_backlinks(all_files_data, backlinks)
    print("Successfully updated backlinks in all documentation files.")

if __name__ == '__main__':
    # Ensure the docs directory exists before running
    if not os.path.isdir(DOCS_DIR):
        os.makedirs(DOCS_DIR)
        print(f"Created missing directory: {DOCS_DIR}")
    
    # Create a dummy file for the index if it doesn't exist to avoid errors
    if not os.path.exists(MASTER_INDEX_FILE):
        with open(MASTER_INDEX_FILE, 'w') as f:
            f.write("# Master Index Placeholder\n")
            
    main()
