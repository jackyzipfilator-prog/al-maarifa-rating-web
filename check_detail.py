import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

needle = 'id="modModal"'
idx = text.find(needle)
print(f"Found at: {idx}")
print(text[idx:idx+3200])
