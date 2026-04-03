"""Export local SQLite to PostgreSQL-compatible SQL"""

import sqlite3
from pathlib import Path

db_path = Path(__file__).parent / 'data' / 'ujamaa.db'
output_path = Path(__file__).parent / 'neon_data.sql'

print(f"Reading: {db_path}")
print(f"Output: {output_path}")

conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [row[0] for row in cursor.fetchall() if not row[0].startswith('sqlite_')]

print(f"Tables: {tables}")

with open(output_path, 'w', encoding='utf-8') as f:
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [col[1] for col in cursor.fetchall()]
        
        if not rows:
            print(f"  {table}: empty, skipping")
            continue
        
        f.write(f"\n-- Data for {table}\n")
        for row in rows:
            values = []
            for v in row:
                if v is None:
                    values.append('NULL')
                elif isinstance(v, str):
                    escaped = v.replace("'", "''")
                    values.append(f"'{escaped}'")
                else:
                    values.append(str(v))
            
            cols_str = ', '.join(columns)
            vals_str = ', '.join(values)
            f.write(f"INSERT INTO {table} ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;\n")
        
        print(f"  {table}: {len(rows)} rows exported")

conn.close()
print(f"\n✅ Exported to: {output_path}")
print("Upload this file to Neon SQL Editor: https://console.neon.tech/")
