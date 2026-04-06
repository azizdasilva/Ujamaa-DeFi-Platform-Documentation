"""
Add Ujamaa transparent logo header to all documentation HTML pages.
Simple, non-fancy - just the logo at the top of each page.
"""
import os
import shutil
import re

# Paths (script is in project root, not documentation/)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO_SRC = os.path.join(PROJECT_ROOT, 'frontend', 'public', 'assets', 'images', 'logo-transparent.png')
DOC_DIR = os.path.join(PROJECT_ROOT, 'documentation')
LOGO_DEST = os.path.join(DOC_DIR, 'assets', 'logo-transparent.png')

# Ensure assets folder exists
os.makedirs(os.path.join(DOC_DIR, 'assets'), exist_ok=True)

# Copy logo
if os.path.exists(LOGO_SRC):
    shutil.copy2(LOGO_SRC, LOGO_DEST)
    print(f'✅ Logo copied to {LOGO_DEST}')
else:
    print(f'❌ Logo not found at {LOGO_SRC}')
    exit(1)

# HTML header snippet to inject
LOGO_HEADER = '''
<!-- Ujamaa Logo Header -->
<div style="text-align:center; padding:16px 0 8px 0; background:#F9F6ED; border-bottom:1px solid #e0e0e0;">
  <a href="../index.html" style="display:inline-block;">
    <img src="../assets/logo-transparent.png" alt="Ujamaa DeFi" style="height:64px; width:auto; object-fit:contain;" />
  </a>
</div>
<!-- /Ujamaa Logo Header -->
'''

def add_logo_to_html(filepath):
    """Add logo header to an HTML file if not already present."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has logo header
    if 'Ujamaa Logo Header' in content:
        return 'skipped'

    # Adjust logo path depth based on file nesting level
    rel_path = os.path.relpath(filepath, DOC_DIR)
    depth = rel_path.count(os.sep)  # number of subdirectories

    # Build correct relative path to logo
    prefix = '../' * depth
    header = LOGO_HEADER.replace('src="../assets/', f'src="{prefix}assets/')
    header = header.replace('href="../index.html"', f'href="{prefix}index.html"')

    # Try to insert after <body> tag (with optional attributes)
    body_match = re.search(r'(<body[^>]*>)', content)
    if body_match:
        insert_pos = body_match.end()
        new_content = content[:insert_pos] + '\n' + header + content[insert_pos:]
    else:
        # Fallback: insert after <html...> and head
        html_match = re.search(r'(</head>)', content)
        if html_match:
            insert_pos = html_match.end()
            # If there's a body tag later, it's fine; otherwise prepend
            new_content = content[:insert_pos] + '\n<body>\n' + header + content[insert_pos:]
        else:
            # Last resort: prepend
            new_content = header + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return 'updated'

# Process all HTML files
updated = 0
skipped = 0
errors = 0

for root, dirs, files in os.walk(DOC_DIR):
    for fname in files:
        if fname.endswith('.html'):
            fpath = os.path.join(root, fname)
            try:
                result = add_logo_to_html(fpath)
                if result == 'updated':
                    updated += 1
                else:
                    skipped += 1
            except Exception as e:
                errors += 1
                print(f'❌ Error processing {fpath}: {e}')

print(f'\n📊 Summary:')
print(f'   ✅ Updated: {updated}')
print(f'   ⏭️  Skipped (already has logo): {skipped}')
print(f'   ❌ Errors: {errors}')
print(f'   📁 Total files: {updated + skipped + errors}')
