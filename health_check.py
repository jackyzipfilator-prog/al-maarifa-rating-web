import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

checks = [
    ('openDetail function', 'async function openDetail', True),
    ('addComment function', 'async function addComment', True),
    ('warnUser function', 'async function warnUser', True),
    ('banUser function', 'async function banUser', True),
    ('resetJoinedCounter', 'async function resetJoinedCounter', True),
    ('modUsersView HTML', 'id="modUsersView"', True),
    ('resetCounterBtn HTML', 'id="resetCounterBtn"', True),
    ('lang-btn desktop', 'data-lang-btn="en"', True),
    ('Mobile lang bar', 'Mobile Quick Language', True),
    ('size-choice buttons', 'data-size-choice="small"', True),
    ('input contrast CSS', 'High contrast inputs', True),
    ('boot function', 'async function boot', True),
    ('dAuthor NOT in JS', 'dAuthor', False),
    ('Warn Flag removed from adminBox', 'Warn Flag', False),
]

print('=== Quick Health Check ===')
for label, needle, should_exist in checks:
    found = needle in text
    ok = found if should_exist else not found
    status = 'OK' if ok else 'PROBLEM!'
    print(status + ' -- ' + label)
