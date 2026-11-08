import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

broken_body = (
    "async function addComment() {\n"
    "  if (!currentUser) { openModal('authModal'); showToast('Please sign in to comment!'); return; }\n"
    "  if (userProfile && (userProfile.banned || userProfile.suspended)) {\n"
    "    showToast('Your account is banned from commenting.');\n"
    "    return;\n"
    "  }\n"
    "  if (userProfile && userProfile.timeoutUntil && Date.now() < userProfile.timeoutUntil) {\n"
    "    const mins = Math.ceil((userProfile.timeoutUntil - Date.now()) / 60000);\n"
    "    showToast(`You are in timeout for ${mins} more minutes.`);\n"
    "    return;\n"
    "  }\n"
    "  currentReportContext = { type: 'image', id: currentProfileId };\n"
    "  $('reportDetails').value = '';\n"
    "  openModal('reportModal');\n"
    "});"
)

fixed_body = (
    "async function addComment() {\n"
    "  if (!currentUser) { openModal('authModal'); showToast('Please sign in to comment!'); return; }\n"
    "  if (userProfile && (userProfile.banned || userProfile.suspended)) {\n"
    "    showToast('Your account is banned from commenting.');\n"
    "    return;\n"
    "  }\n"
    "  if (userProfile && userProfile.timeoutUntil && Date.now() < userProfile.timeoutUntil) {\n"
    "    const mins = Math.ceil((userProfile.timeoutUntil - Date.now()) / 60000);\n"
    "    showToast(`You are in timeout for ${mins} more minutes.`);\n"
    "    return;\n"
    "  }\n"
    "  const text = $('commentInput').value.trim();\n"
    "  if (!text) return;\n"
    "  try {\n"
    "    const payload = {\n"
    "      uid: currentUser.uid,\n"
    "      name: nickname(),\n"
    "      email: currentUser.email || '',\n"
    "      text,\n"
    "      createdAt: FB.serverTimestamp(),\n"
    "      likeCount: 0,\n"
    "      pinned: false\n"
    "    };\n"
    "    if (currentReplyTarget) {\n"
    "      payload.replyToId = currentReplyTarget.cid;\n"
    "      payload.replyToNick = currentReplyTarget.nick;\n"
    "    }\n"
    "    await FB.addDoc(FB.collection(FB.db, 'profiles', currentProfileId, 'comments'), payload);\n"
    "    const pRef = FB.doc(FB.db, 'profiles', currentProfileId);\n"
    "    await FB.updateDoc(pRef, { commentCount: FB.increment(1) });\n"
    "    $('commentInput').value = '';\n"
    "    currentReplyTarget = null;\n"
    "    $('replyTargetBanner').classList.add('hidden');\n"
    "    playSuccessChime();\n"
    "  } catch (e) {\n"
    "    showToast('Comment error: ' + e.message);\n"
    "  }\n"
    "}\n"
    "\n"
    "$('reportBtn').addEventListener('click', () => {"
)

if broken_body in text:
    text = text.replace(broken_body, fixed_body, 1)
    print("Fixed addComment successfully!")
else:
    print("EXACT MATCH NOT FOUND - searching...")
    idx = text.find("async function addComment()")
    print(f"Position: {idx}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
