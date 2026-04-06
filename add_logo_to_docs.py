"""
Add Ujamaa transparent logo to all documentation HTML pages:
1. Replace sidebar "U" icon with logo image
2. Add logo header at top of each page
"""
import os
import shutil
import re

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO_SRC = os.path.join(PROJECT_ROOT, 'frontend', 'public', 'assets', 'images', 'logo-transparent.png')
DOC_DIR = os.path.join(PROJECT_ROOT, 'documentation')
LOGO_DEST = os.path.join(DOC_DIR, 'assets', 'logo-transparent.png')

os.makedirs(os.path.join(DOC_DIR, 'assets'), exist_ok=True)

if os.path.exists(LOGO_SRC):
    shutil.copy2(LOGO_SRC, LOGO_DEST)
    print(f'✅ Logo copied to {LOGO_DEST}')
else:
    print(f'❌ Logo not found at {LOGO_SRC}')
    exit(1)

def get_prefix(filepath):
    rel_path = os.path.relpath(filepath, DOC_DIR)
    depth = rel_path.count(os.sep)
    return '../' * depth

LOGO_HEADER_TEMPLATE = '''
<!-- Ujamaa Logo Header -->
<div style="text-align:center; padding:16px 0 8px 0; background:#F9F6ED; border-bottom:1px solid #e0e0e0;">
  <a href="{prefix}index.html" style="display:inline-block;">
    <img src="{prefix}assets/logo-transparent.png" alt="Ujamaa DeFi" style="height:64px; width:auto; object-fit:contain;" />
  </a>
</div>
<!-- /Ujamaa Logo Header -->
'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    updated = False
    prefix = get_prefix(filepath)

    # 1. Replace sidebar "U" icon with logo image
    old_icon = '<div class="docs-logo-icon">U</div>'
    new_icon = f'<img src="{prefix}assets/logo-transparent.png" alt="Ujamaa DeFi" class="docs-logo-icon" />'
    if old_icon in content:
        content = content.replace(old_icon, new_icon)
        updated = True

    # 2. Add top logo header if not already present
    if 'Ujamaa Logo Header' not in content:
        header = LOGO_HEADER_TEMPLATE.format(prefix=prefix)
        body_match = re.search(r'(<body[^>]*>)', content)
        if body_match:
            content = content[:body_match.end()] + '\n' + header + content[body_match.end():]
            updated = True

    if updated:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return 'updated'
    return 'skipped'

updated = 0
skipped = 0
errors = 0

for root, dirs, files in os.walk(DOC_DIR):
    for fname in files:
        if fname.endswith('.html'):
            fpath = os.path.join(root, fname)
            try:
                result = process_file(fpath)
                if result == 'updated':
                    updated += 1
                else:
                    skipped += 1
            except Exception as e:
                errors += 1
                print(f'❌ Error processing {fpath}: {e}')

print(f'\n📊 Summary:')
print(f'   ✅ Updated: {updated}')
print(f'   ⏭️  Skipped (already done): {skipped}')
print(f'   ❌ Errors: {errors}')
print(f'   📁 Total files: {updated + skipped + errors}')
