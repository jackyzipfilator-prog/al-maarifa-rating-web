import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add modUsersView panel inside modModal (before closing </div></div>)
old_mod_end = '    <div id="reportsList" class="space-y-3"></div>\n    <div id="ideasModList" class="space-y-3 hidden"></div>\n  </div>\n</div>'

new_mod_end = '''    <div id="reportsList" class="space-y-3"></div>
    <div id="ideasModList" class="space-y-3 hidden"></div>

    <!-- User Moderation & Counter Tab View (Owners Only) -->
    <div id="modUsersView" class="hidden space-y-4">
      <!-- Counter Reset -->
      <div class="p-4 rounded-2xl bg-[#0b1120] border border-[#27354f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-bold text-white">📊 Joined Classmates Counter</h4>
          <p class="text-xs text-muted2 mt-0.5">Reset the displayed student / visitor counter to 0.</p>
        </div>
        <button id="resetCounterBtn" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30">
          🔄 Reset Counter to 0
        </button>
      </div>
      <!-- Manual User Action -->
      <div class="p-4 rounded-2xl bg-[#0b1120] border border-[#27354f] space-y-3">
        <h4 class="text-sm font-bold text-white">🛡️ Moderate User (Warn / Timeout / Ban)</h4>
        <div class="flex flex-col sm:flex-row gap-2">
          <input id="userModTargetUid" type="text" placeholder="Enter User UID or Nickname…" class="flex-1 rounded-xl px-3 py-2 text-xs font-bold bg-[#070a12] border border-[#334155] text-white" />
          <button id="btnModWarnManual" class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30">⚠️ Warn</button>
          <button id="btnModTimeoutManual" class="px-3 py-2 rounded-xl text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30">⏳ Timeout (24h)</button>
          <button id="btnModBanManual" class="px-3 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30">🚫 Ban User</button>
        </div>
      </div>
      <!-- Active Restrictions List -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-muted2">Active Restrictions & Warnings</h4>
        <div id="restrictedUsersList" class="space-y-2 max-h-60 overflow-y-auto scrollbar">
          <p class="text-xs text-muted2 text-center py-4">Loading…</p>
        </div>
      </div>
    </div>
  </div>
</div>'''

if 'id="modUsersView"' not in text:
    text = text.replace(old_mod_end, new_mod_end, 1)
    print("Added modUsersView to modModal.")
else:
    print("modUsersView already exists.")

# 2. Add warnUser / timeoutUser / banUser / resetJoinedCounter / loadRestrictedUsers JS
user_mod_js = """
// ==========================================
// USER MODERATION TOOLS (OWNERS ONLY)
// ==========================================
async function warnUser(uid, name) {
  if (!isAdmin()) return;
  const reason = prompt('Enter warning reason for ' + name + ':', 'Please follow community rules.');
  if (reason === null) return;
  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
      warned: true, warnReason: reason, warnedAt: FB.serverTimestamp(), warnedBy: currentUser.email
    });
    showToast('⚠️ Warning issued to ' + name);
    loadRestrictedUsers();
  } catch (e) { showToast('Failed: ' + e.message); }
}

async function timeoutUser(uid, name, hours) {
  if (!isAdmin()) return;
  const h = parseFloat(prompt('Timeout duration in hours for ' + name + ':', String(hours || 24))) || 24;
  if (!h) return;
  const timeoutUntil = Date.now() + (h * 3600 * 1000);
  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
      timeoutUntil, timedOutAt: FB.serverTimestamp(), timedOutBy: currentUser.email
    });
    showToast('⏳ ' + name + ' timed out for ' + h + 'h');
    loadRestrictedUsers();
  } catch (e) { showToast('Failed: ' + e.message); }
}

async function banUser(uid, name) {
  if (!isAdmin()) return;
  if (!confirm('Permanently BAN ' + name + '? They cannot vote or comment.')) return;
  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
      banned: true, suspended: true, bannedAt: FB.serverTimestamp(), bannedBy: currentUser.email
    });
    showToast('🚫 ' + name + ' has been banned.');
    loadRestrictedUsers();
  } catch (e) { showToast('Failed: ' + e.message); }
}

async function unrestrictUser(uid, name) {
  if (!isAdmin()) return;
  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', uid), {
      warned: false, warnReason: '', timeoutUntil: null, banned: false, suspended: false
    });
    showToast('✅ Restrictions lifted for ' + (name || 'user'));
    loadRestrictedUsers();
  } catch (e) { showToast('Failed: ' + e.message); }
}

async function resetJoinedCounter() {
  if (!isAdmin()) return;
  if (!confirm('Reset the Joined Classmates counter to 0?')) return;
  try {
    await FB.setDoc(FB.doc(FB.db, 'stats', 'counters'), { userCount: 0 });
    const jc = $('joinCount');
    if (jc) jc.textContent = '0';
    showToast('Counter reset to 0! 🔄');
  } catch (e) { showToast('Error: ' + e.message); }
}

async function loadRestrictedUsers() {
  const el = $('restrictedUsersList');
  if (!el || !isAdmin()) return;
  try {
    const snap = await FB.getDocs(FB.collection(FB.db, 'users'));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(u => u.banned || u.suspended || u.warned || (u.timeoutUntil && Date.now() < u.timeoutUntil));
    if (!list.length) {
      el.innerHTML = '<p class="text-xs text-muted2 text-center py-4">No active restrictions.</p>';
      return;
    }
    el.innerHTML = list.map(u => {
      const isBanned = u.banned || u.suspended;
      const isTimedOut = u.timeoutUntil && Date.now() < u.timeoutUntil;
      const statusBadge = isBanned ? '<span class="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">Banned</span>' :
        isTimedOut ? '<span class="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">Timeout</span>' :
        '<span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">Warned</span>';
      const displayName = escapeHtml(u.nickname || u.email || 'User');
      const uid = u.id;
      const nickAttr = (u.nickname || 'User').replace(/'/g, "\\'");
      return '<div class="p-3 bg-bg border border-c rounded-xl flex items-center justify-between text-xs"><div><div class="flex items-center gap-2"><span class="font-bold text-white">' + displayName + '</span>' + statusBadge + '</div><p class="text-[10px] text-muted2 mt-0.5">' + (u.warnReason ? escapeHtml(u.warnReason) : 'UID: ' + uid) + '</p></div><button onclick="unrestrictUser(' + "'" + uid + "', '" + nickAttr + "'" + ')" class="px-2.5 py-1 rounded-lg border border-lime-500/40 text-lime-400 hover:bg-lime-500/10 text-xs font-semibold">Lift</button></div>';
    }).join('');
  } catch (e) {
    el.innerHTML = '<p class="text-xs text-red-400 py-2">Error: ' + e.message + '</p>';
  }
}
"""

if 'async function warnUser' not in text:
    # Insert before adminAction
    text = text.replace('async function adminAction(action) {', user_mod_js + '\nasync function adminAction(action) {', 1)
    print("Added user moderation JS.")
else:
    print("warnUser already exists.")

# 3. Wire UI for size buttons, lang buttons, modTabUsers, resetCounter, manual mod
wire_extra = """
  // Quick Language Buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      playPop();
      applyLang(btn.dataset.langBtn);
    });
  });

  // Card Size Segmented Buttons
  document.querySelectorAll('[data-size-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      playPop();
      imgSize = btn.dataset.sizeChoice;
      localStorage.setItem('imgSize', imgSize);
      document.querySelectorAll('[data-size-choice]').forEach(b => {
        const a = b.dataset.sizeChoice === imgSize;
        b.classList.toggle('size-choice-active', a);
        b.classList.toggle('border-lime-400', a);
      });
      renderRecommended(); renderForYou(); renderSaved();
    });
  });

  // User Moderation Tab
  const tabRep = $('modTabReports'), tabIde = $('modTabIdeas'), tabUsr = $('modTabUsers');
  const usrView = $('modUsersView'), repRow = $('reportsFilterRow'), repList = $('reportsList'), ideList = $('ideasModList');
  if (tabUsr && usrView) {
    tabUsr.addEventListener('click', () => {
      playPop();
      [tabRep, tabIde, tabUsr].forEach(t => { if (t) { t.classList.remove('btn-primary', 'font-bold'); t.classList.add('border', 'border-c', 'text-muted2'); }});
      tabUsr.classList.add('btn-primary', 'font-bold');
      if (repRow) repRow.classList.add('hidden');
      if (repList) repList.classList.add('hidden');
      if (ideList) ideList.classList.add('hidden');
      usrView.classList.remove('hidden');
      loadRestrictedUsers();
    });
    if (tabRep) tabRep.addEventListener('click', () => { if (usrView) usrView.classList.add('hidden'); });
    if (tabIde) tabIde.addEventListener('click', () => { if (usrView) usrView.classList.add('hidden'); });
  }

  // Reset Counter
  const resetBtn = $('resetCounterBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetJoinedCounter);

  // Manual Mod Buttons
  const warnManual = $('btnModWarnManual'), tmManual = $('btnModTimeoutManual'), banManual = $('btnModBanManual'), uidInput = $('userModTargetUid');
  if (warnManual && uidInput) {
    warnManual.addEventListener('click', () => { const v = uidInput.value.trim(); if (v) warnUser(v, v); });
    tmManual.addEventListener('click', () => { const v = uidInput.value.trim(); if (v) timeoutUser(v, v, 24); });
    banManual.addEventListener('click', () => { const v = uidInput.value.trim(); if (v) banUser(v, v); });
  }
"""

if 'data-size-choice' not in text:
    text = text.replace(
        "$('ratingSubmit').addEventListener('click', (e) => rateProfile(undefined, e));\n}",
        "$('ratingSubmit').addEventListener('click', (e) => rateProfile(undefined, e));\n" + wire_extra + "\n}",
        1
    )
    print("Added wire_extra to wireUI().")
else:
    print("wire_extra already applied.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done!")
