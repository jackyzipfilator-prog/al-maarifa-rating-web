import re
import subprocess

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script(?:\s+type="[^"]*")?>([\s\S]*?)<\/script>', html, re.I)
print(f"Found {len(scripts)} scripts.")
for i, s in enumerate(scripts):
    fname = f"test_syntax_{i}.js"
    with open(fname, 'w', encoding='utf-8') as sf:
        sf.write(s)
    res = subprocess.run(["node", "-c", fname], capture_output=True, text=True)
    if res.returncode == 0:
        print(f"{fname}: SYNTAX OK!")
    else:
        print(f"{fname}: SYNTAX ERROR:\n{res.stderr}")
