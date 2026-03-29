"""
Documentation Link Audit and Fix Script
Ujamaa DeFi Platform - documentation/ folder
"""

import os
import re
from pathlib import Path

# Base documentation folder
DOC_BASE = r"C:\Users\aziz_\PycharmProjects\2026\INTELLI_BRIDGE_ANALYTICS\UJAMAA DeFi PlatForm\documentation"

def get_all_html_files():
    """Get all HTML files in documentation"""
    html_files = []
    for root, dirs, files in os.walk(DOC_BASE):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def get_existing_files_in_folder(folder):
    """Get list of existing HTML files in a folder"""
    files = []
    for f in os.listdir(folder):
        if f.endswith('.html'):
            files.append(f)
    return files

def extract_links_from_html(filepath):
    """Extract all href links from HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all href links
    links = re.findall(r'href="([^"]+)"', content)
    return links

def check_link_exists(link, base_folder):
    """Check if a link points to an existing file"""
    # Skip external links
    if link.startswith('http') or link.startswith('#') or link.startswith('mailto:'):
        return True, "external/special"
    
    # Resolve the link path
    if link.startswith('../'):
        # Go up one level
        check_path = os.path.normpath(os.path.join(base_folder, link))
    elif link.startswith('./'):
        check_path = os.path.normpath(os.path.join(base_folder, link[2:]))
    else:
        check_path = os.path.normpath(os.path.join(base_folder, link))
    
    # Check if file exists
    if os.path.exists(check_path):
        return True, check_path
    else:
        return False, check_path

def audit_folder(folder_path):
    """Audit all links in a folder's README.html and index.html"""
    print(f"\n{'='*60}")
    print(f"Auditing: {folder_path}")
    print('='*60)
    
    existing_files = get_existing_files_in_folder(folder_path)
    print(f"Existing files ({len(existing_files)}): {sorted(existing_files)[:10]}...")
    
    # Check README.html and index.html
    for check_file in ['README.html', 'index.html']:
        check_path = os.path.join(folder_path, check_file)
        if not os.path.exists(check_path):
            continue
        
        print(f"\n  Checking {check_file}...")
        links = extract_links_from_html(check_path)
        
        broken_links = []
        for link in links:
            # Only check relative links within documentation
            if not link.startswith('http') and not link.startswith('#') and not link.startswith('..'):
                exists, path = check_link_exists(link, folder_path)
                if not exists:
                    broken_links.append((link, path))
        
        if broken_links:
            print(f"  ⚠️  Found {len(broken_links)} broken links:")
            for link, path in broken_links[:10]:  # Show first 10
                print(f"     - {link} → {path}")
        else:
            print(f"  ✅ All links valid")

def main():
    """Main audit function"""
    print("🔍 Ujamaa Documentation Link Audit")
    print("="*60)
    
    # Get all subfolders
    folders = []
    for item in os.listdir(DOC_BASE):
        item_path = os.path.join(DOC_BASE, item)
        if os.path.isdir(item_path) and not item.startswith('.'):
            folders.append(item_path)
    
    # Audit each folder
    for folder in sorted(folders):
        audit_folder(folder)
    
    print("\n" + "="*60)
    print("Audit Complete!")
    print("="*60)

if __name__ == '__main__':
    main()
