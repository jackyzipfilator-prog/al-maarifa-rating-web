
// Firebase modular imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, runTransaction, where, limit, increment, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUPW2VwfF9Ae5KQMelYGfLnjYbz6eFmG4",
  authDomain: "al-maarifa-3fc45.firebaseapp.com",
  projectId: "al-maarifa-3fc45",
  storageBucket: "al-maarifa-3fc45.firebasestorage.app",
  messagingSenderId: "936309588942",
  appId: "1:936309588942:web:68aec7b0f200710576a19f",
  measurementId: "G-X6JBCW26JC"
};

// HARD-CODED OWNERS (Only these two accounts have admin, publishing, and moderation privileges)
// Note: Emails stay 100% PRIVATE and are never displayed publicly on the website!
const OWNER_EMAILS = [
  "anaflousoussama555@gmail.com",
  "yagsahz@gmail.com"
];

const EMAILJS_SERVICE = "service_1fhaybp";
const EMAILJS_TEMPLATE = "template_6sawp8f";
const EMAILJS_PUBLIC_KEY = "fHmQh5YYJUM89W6jc";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const FB = {
  app, auth, db,
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, runTransaction, where, limit, increment, getDoc, setDoc
};
window.FB = FB;

// ==========================================
// 🌌 PARALLAX GALAXY CANVAS BACKGROUND
// ==========================================
const galaxyCanvas = document.getElementById('galaxyCanvas');
const gCtx = galaxyCanvas.getContext('2d');
let stars = [];
let targetMouseX = 0, targetMouseY = 0;
let currentMouseX = 0, currentMouseY = 0;
let soundEnabled = localStorage.getItem('sound_enabled') === 'true';
let reducedMotion = localStorage.getItem('reduced_motion') === 'true';

function initGalaxy() {
  galaxyCanvas.width = window.innerWidth;
  galaxyCanvas.height = window.innerHeight;
  stars = [];
  const starCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * galaxyCanvas.width,
      y: Math.random() * galaxyCanvas.height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      baseAlpha: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.02 + 0.005
    });
  }
}
window.addEventListener('resize', initGalaxy);
initGalaxy();

window.addEventListener('mousemove', (e) => {
  if (reducedMotion) return;
  targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
  targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
});

function drawGalaxy() {
  if (!reducedMotion) {
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;
  } else {
    currentMouseX = 0;
    currentMouseY = 0;
  }

  gCtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

  // Deep space subtle nebula gradients
  const g1 = gCtx.createRadialGradient(
    galaxyCanvas.width * 0.2 + currentMouseX * 2,
    galaxyCanvas.height * 0.3 + currentMouseY * 2,
    50,
    galaxyCanvas.width * 0.2,
    galaxyCanvas.height * 0.3,
    galaxyCanvas.width * 0.4
  );
  g1.addColorStop(0, 'rgba(163, 230, 53, 0.06)');
  g1.addColorStop(1, 'transparent');
  gCtx.fillStyle = g1;
  gCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

  const g2 = gCtx.createRadialGradient(
    galaxyCanvas.width * 0.8 - currentMouseX * 1.5,
    galaxyCanvas.height * 0.7 - currentMouseY * 1.5,
    50,
    galaxyCanvas.width * 0.8,
    galaxyCanvas.height * 0.7,
    galaxyCanvas.width * 0.45
  );
  g2.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
  g2.addColorStop(1, 'transparent');
  gCtx.fillStyle = g2;
  gCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

  // Stars rendering
  for (let s of stars) {
    const shiftX = s.x + currentMouseX * s.depth;
    const shiftY = s.y + currentMouseY * s.depth;
    
    // Twinkle
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;

    gCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha)})`;
    gCtx.beginPath();
    gCtx.arc(shiftX, shiftY, s.radius, 0, Math.PI * 2);
    gCtx.fill();
  }

  requestAnimationFrame(drawGalaxy);
}
requestAnimationFrame(drawGalaxy);

// Synthesizer Web Audio API (Zero audio files needed, pure clean synthesizer)
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playPop() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (_) {}
}

function playSuccessChime() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.06);
      osc.stop(audioCtx.currentTime + idx * 0.06 + 0.2);
    });
  } catch (_) {}
}

// Particle Canvas Burst
const burstCanvas = document.getElementById('burstCanvas');
const bCtx = burstCanvas.getContext('2d');
let particles = [];

function resizeBurstCanvas() {
  burstCanvas.width = window.innerWidth;
  burstCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBurstCanvas);
resizeBurstCanvas();

function triggerBurst(x, y) {
  if (reducedMotion) return;
  const colors = ['#a3e635', '#ffffff', '#10b981', '#38bdf8', '#fb923c'];
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.02 + Math.random() * 0.02
    });
  }
}

function updateParticles() {
  if (particles.length > 0) {
    bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      bCtx.globalAlpha = p.alpha;
      bCtx.fillStyle = p.color;
      bCtx.beginPath();
      bCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bCtx.fill();
    }
    bCtx.globalAlpha = 1;
  }
  requestAnimationFrame(updateParticles);
}
requestAnimationFrame(updateParticles);

const EMOJIS = ['❤️','🔥','😂','😮','👍','🎉'];

const T = {
  en: {
    app_name: "2BAC-PC-11 Rating",
    search_placeholder: "Search by name, class, tag… (Ctrl+K)",
    create_profile: "+ Post Photo",
    tab_recommended: "Recommended",
    tab_foryou: "For You",
    tab_saved: "Saved",
    tab_leaderboard: "Leaderboard",
    joined: "Joined:",
    users: "classmates",
    no_recs: "No photos posted yet.",
    recs_empty_sub: "Check back soon when owners post photos for the class to rate!",
    no_fy: "Nothing personalized yet.",
    fy_empty_sub: "Rate and react to some photos first to build your profile!",
    lb_title: "Top Baddies & Icons Leaderboard",
    lb_subtitle: "Ranked by community looks, outfit, and vibe score",
    signin_prompt: "Sign in with Google to explore, rate looks & vibe, share reactions, and join the conversation.",
    signin_google: "Continue with Google",
    welcome_onboard: "Welcome to 2BAC-PC-11 Rating",
    nickname: "Nickname (Mandatory)",
    avatar_choice: "Profile Picture",
    use_google_photo: "Use Google photo",
    use_url_photo: "Direct image URL",
    enter_site: "Enter 2BAC-PC-11 Rating",
    new_profile: "Post New Photo",
    name: "Subject Name / Title",
    grade: "Category / Class",
    description: "Context / Outfit & Vibe Description",
    image_url: "Direct Image URL",
    img_help_toggle: "⚡ How to get a direct image URL (Free conversion)",
    create: "Publish to Feed",
    your_rating: "Your Rating",
    rate: "Submit Vote",
    reactions: "Reactions",
    comments: "Comments & Discussion",
    add_comment: "Add a comment or hype up the look…",
    send: "Post",
    report_image: "Report Photo",
    report_title: "Report Content",
    report_reason: "Reason",
    r_harassment: "Extreme disrespect / Harassment",
    r_inappropriate: "Inappropriate content",
    r_spam: "Spam or troll",
    r_other: "Other rule violation",
    report_details: "Details (optional)",
    submit_report: "Submit Report to Owners",
    report_sent: "Report submitted to owners. Thank you for keeping 2BAC PC-11 safe.",
    settings: "Settings",
    theme: "Theme",
    light_mode: "Light",
    dark_mode: "Dark (Default)",
    language: "Language",
    image_size: "Card Image Size",
    size_small: "Compact",
    size_medium: "Standard",
    size_large: "Large Preview",
    moderation: "Owner Moderation Queue",
    own_profile: "You cannot vote on your own photo"
  },
  fr: {
    app_name: "2BAC-PC-11 Rating",
    search_placeholder: "Rechercher par nom, classe, tag… (Ctrl+K)",
    create_profile: "+ Publier photo",
    tab_recommended: "Recommandés",
    tab_foryou: "Pour vous",
    tab_saved: "Enregistrés",
    tab_leaderboard: "Classement",
    joined: "Inscrits :",
    users: "élèves",
    no_recs: "Aucune photo publiée pour l'instant.",
    recs_empty_sub: "Revenez bientôt lorsque les propriétaires publieront de nouvelles photos !",
    no_fy: "Rien de personnalisé pour l'instant.",
    fy_empty_sub: "Notez et réagissez à quelques photos pour créer votre profil !",
    lb_title: "Top Classement Baddies",
    lb_subtitle: "Classé selon le style, le look et les votes",
    signin_prompt: "Connectez-vous avec Google pour explorer, voter sur les looks et réagir.",
    signin_google: "Continuer avec Google",
    welcome_onboard: "Bienvenue sur 2BAC-PC-11 Rating",
    nickname: "Pseudo (Obligatoire)",
    avatar_choice: "Photo de profil",
    use_google_photo: "Photo Google",
    use_url_photo: "URL d'image directe",
    enter_site: "Entrer sur 2BAC-PC-11",
    new_profile: "Publier une photo",
    name: "Titre / Nom",
    grade: "Classe / Catégorie",
    description: "Description / Style & Vibe",
    image_url: "URL directe de l'image",
    img_help_toggle: "⚡ Comment obtenir un lien direct d'image",
    create: "Publier",
    your_rating: "Votre note",
    rate: "Voter",
    reactions: "Réactions",
    comments: "Commentaires & Discussion",
    add_comment: "Ajouter un commentaire…",
    send: "Envoyer",
    report_image: "Signaler la photo",
    report_title: "Signaler le contenu",
    report_reason: "Raison",
    r_harassment: "Manque de respect / Harcèlement",
    r_inappropriate: "Contenu inapproprié",
    r_spam: "Spam",
    r_other: "Autre violation",
    report_details: "Détails (facultatif)",
    submit_report: "Envoyer aux propriétaires",
    report_sent: "Signalement transmis aux propriétaires. Merci.",
    settings: "Paramètres",
    theme: "Thème",
    light_mode: "Clair",
    dark_mode: "Sombre (Par défaut)",
    language: "Langue",
    image_size: "Taille des cartes",
    size_small: "Compact",
    size_medium: "Standard",
    size_large: "Grand",
    moderation: "Modération Propriétaires"
  },
  ar: {
    app_name: "2BAC-PC-11 Rating",
    search_placeholder: "ابحث بالاسم أو القسم… (Ctrl+K)",
    create_profile: "+ نشر صورة",
    tab_recommended: "موصى به",
    tab_foryou: "لك",
    tab_saved: "المحفوظات",
    tab_leaderboard: "الترتيب",
    joined: "المشتركون:",
    users: "تلميذ",
    no_recs: "لا توجد صور منشورة بعد.",
    recs_empty_sub: "زرنا قريباً عند نشر صور جديدة من قبل المشرفين!",
    no_fy: "لا يوجد محتوى مخصص بعد.",
    fy_empty_sub: "قيّم وتفاعل مع بعض الصور أولاً!",
    lb_title: "قائمة الأفضل تقييماً",
    lb_subtitle: "ترتيب حسب المظهر والستايل وتصويت الزملاء",
    signin_prompt: "سجل الدخول بGoogle للاستكشاف والتقييم والتفاعل.",
    signin_google: "المتابعة بحساب Google",
    welcome_onboard: "مرحباً بك في 2BAC-PC-11 Rating",
    nickname: "اللقب (إجباري)",
    avatar_choice: "صورة الملف الشخصي",
    use_google_photo: "صورة حساب Google",
    use_url_photo: "رابط صورة مباشر",
    enter_site: "دخول 2BAC-PC-11",
    new_profile: "نشر صورة جديدة",
    name: "العنوان أو الاسم",
    grade: "القسم / الصنف",
    description: "الوصف / تفاصيل الستايل",
    image_url: "رابط الصورة المباشر",
    img_help_toggle: "⚡ كيفية تحويل الصورة إلى رابط مباشر",
    create: "نشر في الصفحة",
    your_rating: "تقييمك",
    rate: "إرسال التقييم",
    reactions: "ردود الفعل",
    comments: "التعليقات والمناقشة",
    add_comment: "أضف تعليقاً…",
    send: "إرسال",
    report_image: "الإبلاغ عن صورة",
    report_title: "الإبلاغ عن محتوى",
    report_reason: "السبب",
    r_harassment: "إساءة شديدة / تنمر",
    r_inappropriate: "محتوى غير لائق",
    r_spam: "سبام أو تكرار",
    r_other: "مخالفة أخرى",
    report_details: "تفاصيل (اختياري)",
    submit_report: "إرسال الإبلاغ للمشرفين",
    report_sent: "تم إرسال الإبلاغ بنجاح إلى المشرفين. شكراً لحرصك.",
    settings: "الإعدادات",
    theme: "المظهر",
    light_mode: "فاتح",
    dark_mode: "داكن (افتراضي)",
    language: "اللغة",
    image_size: "حجم الصور",
    size_small: "مضغوط",
    size_medium: "قياسي",
    size_large: "كبير",
    moderation: "إشراف أصحاب الموقع"
  }
};

let currentLang = localStorage.getItem('lang') || 'en';
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const dict = T[lang] || T.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k] !== undefined) el.textContent = dict[k];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const k = el.getAttribute('data-i18n-placeholder');
    if (dict[k] !== undefined) el.setAttribute('placeholder', dict[k]);
  });
  const html = document.documentElement;
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', lang === 'fr' ? 'fr' : 'en');
  }
  const sel = $('langSelect');
  if (sel) sel.value = lang;

  // Highlight all matching language buttons on desktop and mobile
  document.querySelectorAll('[data-lang-btn]').forEach(b => {
    const active = b.dataset.langBtn === lang;
    b.classList.toggle('lang-choice-active', active);
    b.classList.toggle('border-lime-400', active);
  });
}

// Dark theme is default
function applyTheme(t) {
  localStorage.setItem('theme', t);
  document.documentElement.classList.toggle('light', t === 'light');
  document.documentElement.classList.toggle('dark', t !== 'light');
}
applyTheme(localStorage.getItem('theme') || 'dark');

let currentUser = null, userProfile = null, profiles = [];
let profilesUnsub = null, commentsUnsub = null, myRatingUnsub = null, reactionsUnsub = null;
let myRating = null, currentProfileId = null;
let currentReplyTarget = null;
let currentCommentSort = 'top';
let currentReportContext = null;
let rawComments = [];
let savedIds = new Set(JSON.parse(localStorage.getItem('saved_images') || '[]'));
let viewedIds = new Set(JSON.parse(localStorage.getItem('viewed') || '[]'));
let readNotifs = new Set(JSON.parse(localStorage.getItem('read_notifs') || '[]'));
let imgSize = localStorage.getItem('imgSize') || 'medium';

function $(id) { return document.getElementById(id); }
function openModal(id) { const m = $(id); m.classList.remove('hidden'); m.classList.add('flex'); }
function closeModal(id) { const m = $(id); m.classList.add('hidden'); m.classList.remove('flex'); }
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(window._t);
  window._t = setTimeout(() => t.classList.add('hidden'), 2800);
}
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

function isOwner(user) {
  if (!user) return false;
  const em = (user.email || userProfile?.email || '').toLowerCase().trim();
  if (OWNER_EMAILS.includes(em)) return true;
  if (userProfile && userProfile.role === 'owner') return true;
  return false;
}
function isAdmin() { return isOwner(currentUser); }

// Generates the prominent green Owner Badge (EMAILS REMAIN 100% PRIVATE)
function getOwnerBadge(user) {
  const em = (user?.email || userProfile?.email || '').toLowerCase().trim();
  if (em === 'anaflousoussama555@gmail.com' || (userProfile && userProfile.nickname && userProfile.nickname.toLowerCase().includes('oussama'))) {
    return `<span class="badge-owner px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 shadow-sm flex-shrink-0">👑 Owner / CEO</span>`;
  }
  if (em === 'yagsahz@gmail.com' || (userProfile && userProfile.nickname && userProfile.nickname.toLowerCase().includes('yasser'))) {
    return `<span class="badge-owner px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 shadow-sm flex-shrink-0">👑 Co-Owner / VP</span>`;
  }
  if (isOwner(user)) {
    return `<span class="badge-owner px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 shadow-sm flex-shrink-0">👑 Owner</span>`;
  }
  return '';
}

function nickname() {
  return (userProfile && userProfile.nickname) || (currentUser && (currentUser.displayName || currentUser.email.split('@')[0])) || 'Guest';
}
function avatarUrl() {
  return (userProfile && userProfile.avatarUrl) || (currentUser && currentUser.photoURL) || '';
}

// Check Cutscene Sequence on first visit
function checkCutscene() {
  const introSeen = localStorage.getItem('cutscene_seen_v3');
  if (!introSeen) {
    openModal('cutsceneModal');
    $('cutsceneStep1').classList.remove('hidden');
    $('cutsceneStep2').classList.add('hidden');
  }
}

$('cutsceneNextBtn').addEventListener('click', () => {
  playPop();
  $('cutsceneStep1').classList.add('hidden');
  $('cutsceneStep2').classList.remove('hidden');
});

$('cutsceneAcceptCheck').addEventListener('change', (e) => {
  const btn = $('cutsceneEnterBtn');
  if (e.target.checked) {
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
  }
});

$('cutsceneEnterBtn').addEventListener('click', () => {
  localStorage.setItem('cutscene_seen_v3', 'true');
  playSuccessChime();
  closeModal('cutsceneModal');
  showToast('Welcome to 2BAC-PC-11 Rating! ✨');
  if (!currentUser) openModal('authModal');
});

// Boot application
async function boot() {
  // Always load profiles, join counter and verify cutscene on startup (public feed)
  if (!profilesUnsub) loadProfiles();
  loadJoinCount();
  checkCutscene();

  FB.onAuthStateChanged(FB.auth, async (user) => {
    currentUser = user;
    renderAuth();

    if (user) {
      await loadUserProfile(user);
      if (userProfile && (userProfile.suspended || userProfile.banned)) {
        await FB.signOut(FB.auth);
        showToast('Your guest account has been banned by owners.');
        return;
      }
      if (!userProfile || !userProfile.onboarded) {
        openModal('onboardModal');
        setupOnboarding(user);
      } else {
        closeModal('onboardModal');
        closeModal('authModal');
        checkNotifications();
      }
    } else {
      userProfile = null;
      renderAuth();
    }
  });

  wireUI();
  updateSavedBadge();
  applyLang(currentLang);
}

async function loadUserProfile(user) {
  try {
    const snap = await FB.getDoc(FB.doc(FB.db, 'users', user.uid));
    if (snap.exists()) {
      userProfile = snap.data();
      if (userProfile.savedImages && Array.isArray(userProfile.savedImages)) {
        savedIds = new Set(userProfile.savedImages);
        localStorage.setItem('saved_images', JSON.stringify([...savedIds]));
        updateSavedBadge();
      }
    } else {
      userProfile = null;
    }
    renderAuth();
  } catch (e) {
    console.error('Error loading profile:', e);
  }
}

function setupOnboarding(user) {
  const avGoogle = $('avGoogle'), avUrl = $('avUrl'), avUrlInput = $('avUrlInput'), avPreview = $('avPreview');
  let chosenAvatar = user.photoURL || '';

  avGoogle.classList.add('border-lime-400', 'bg-lime-500/10');
  avGoogle.onclick = () => {
    chosenAvatar = user.photoURL || '';
    avUrlInput.classList.add('hidden');
    avPreview.classList.toggle('hidden', !chosenAvatar);
    if (chosenAvatar) avPreview.querySelector('img').src = chosenAvatar;
    avGoogle.classList.add('border-lime-400', 'bg-lime-500/10');
    avUrl.classList.remove('border-lime-400', 'bg-lime-500/10');
  };

  avUrl.onclick = () => {
    avUrlInput.classList.remove('hidden');
    avUrl.classList.add('border-lime-400', 'bg-lime-500/10');
    avGoogle.classList.remove('border-lime-400', 'bg-lime-500/10');
  };

  avUrlInput.addEventListener('input', () => {
    const val = avUrlInput.value.trim();
    if (/^https?:\/\/.+/i.test(val)) {
      chosenAvatar = val;
      avPreview.classList.remove('hidden');
      avPreview.querySelector('img').src = val;
    } else {
      avPreview.classList.add('hidden');
    }
  });

  $('onboardSubmit').onclick = async () => {
    const nick = $('nickInput').value.trim();
    const bio = ($('bioInput').value || '').trim();
    const err = $('onboardErr');
    err.classList.add('hidden');

    if (!nick || nick.length < 2) {
      err.textContent = 'Please choose a nickname (at least 2 characters).';
      err.classList.remove('hidden');
      return;
    }

    try {
      const defaultAv = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nick) + '&background=a3e635&color=000';
      const finalAvatar = chosenAvatar || defaultAv;
      const role = isOwner(user) ? 'owner' : 'guest';

      await FB.setDoc(FB.doc(FB.db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        nickname: nick,
        bio: bio,
        avatarUrl: finalAvatar,
        role: role,
        savedImages: [...savedIds],
        onboarded: true,
        acceptedDisclaimer: true,
        joinedAt: FB.serverTimestamp()
      });

      await FB.runTransaction(FB.db, async (t) => {
        const cRef = FB.doc(FB.db, 'stats', 'counters');
        const snap = await t.get(cRef);
        if (snap.exists()) t.update(cRef, { userCount: FB.increment(1) });
        else t.set(cRef, { userCount: 1 });
      });

      userProfile = { uid: user.uid, email: user.email, nickname: nick, avatarUrl: finalAvatar, bio, role, savedImages: [...savedIds], onboarded: true };
      closeModal('onboardModal');
      closeModal('authModal');
      if (!profilesUnsub) loadProfiles();
      loadJoinCount();
      renderAuth();
      playSuccessChime();
      showToast('Welcome, ' + nick + '!');
    } catch (e) {
      err.textContent = e.message;
      err.classList.remove('hidden');
    }
  };
}

async function loadJoinCount() {
  FB.onSnapshot(FB.doc(FB.db, 'stats', 'counters'), (snap) => {
    const c = snap.exists() ? (snap.data().userCount || 0) : 0;
    $('joinCount').textContent = c;
  });
}

// Full Profile Edit Functionality (Accessible Anytime)
function openProfileEditModal() {
  if (!currentUser) { openModal('authModal'); return; }
  playPop();
  $('editNickInput').value = nickname();
  $('editNickLabel').textContent = nickname();
  $('editBioInput').value = userProfile?.bio || '';
  $('editAvatarUrlInput').value = userProfile?.avatarUrl || '';
  $('editAvPreview').src = avatarUrl() || 'logo.jpg';
  $('profileEditErr').classList.add('hidden');
  openModal('profileEditModal');
}

$('editAvatarUrlInput').addEventListener('input', () => {
  const url = $('editAvatarUrlInput').value.trim();
  if (/^https?:\/\/.+/i.test(url)) {
    $('editAvPreview').src = url;
  }
});

$('useGoogleAvBtn').onclick = () => {
  if (currentUser && currentUser.photoURL) {
    $('editAvatarUrlInput').value = currentUser.photoURL;
    $('editAvPreview').src = currentUser.photoURL;
  }
};

$('saveProfileBtn').onclick = async () => {
  const newNick = $('editNickInput').value.trim();
  const newBio = $('editBioInput').value.trim();
  const newAvatar = $('editAvatarUrlInput').value.trim() || avatarUrl();
  const err = $('profileEditErr');
  err.classList.add('hidden');

  if (!newNick || newNick.length < 2) {
    err.textContent = 'Nickname must be at least 2 characters.';
    err.classList.remove('hidden');
    return;
  }

  try {
    await FB.updateDoc(FB.doc(FB.db, 'users', currentUser.uid), {
      nickname: newNick,
      bio: newBio,
      avatarUrl: newAvatar,
      updatedAt: FB.serverTimestamp()
    });

    if (userProfile) {
      userProfile.nickname = newNick;
      userProfile.bio = newBio;
      userProfile.avatarUrl = newAvatar;
    }

    renderAuth();
    closeModal('profileEditModal');
    playSuccessChime();
    showToast('Profile updated! ✨');
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  }
};

// Render Navbar Auth Area (Prominent Green Badge ALWAYS visible for Owners)
function renderAuth() {
  const area = $('authArea');
  const createBtn = $('createBtn');

  if (currentUser) {
    if (isAdmin()) {
      createBtn.classList.remove('hidden');
    } else {
      createBtn.classList.add('hidden');
    }

    const av = avatarUrl();
    const ownerBadge = isOwner(currentUser) ? getOwnerBadge(currentUser) : '';

    area.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 p-1 rounded-full hover:bg-card2 cursor-pointer transition-colors" id="headerProfileTrigger" title="Click to edit profile">
          ${av ? `<img src="${escapeAttr(av)}" class="w-8 h-8 rounded-full border border-lime-400 object-cover flex-shrink-0" />` : `<div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style="background:var(--accent);color:#000">${escapeHtml(nickname().charAt(0).toUpperCase())}</div>`}
          <span class="text-xs font-bold text-white max-w-[110px] truncate">${escapeHtml(nickname())}</span>
          ${ownerBadge}
        </div>
        <button id="signOutBtn" title="Sign out" class="p-1.5 rounded-full hover:bg-card2 text-muted2 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>`;

    $('headerProfileTrigger').addEventListener('click', openProfileEditModal);
    $('signOutBtn').addEventListener('click', async () => {
      await FB.signOut(FB.auth);
      showToast('Signed out.');
    });
  } else {
    createBtn.classList.add('hidden');
    area.innerHTML = `<button id="signInBtn" class="px-4 py-2 rounded-full text-xs font-bold btn-primary">${T[currentLang].signin_google}</button>`;
    $('signInBtn').addEventListener('click', () => openModal('authModal'));
  }
}

async function signIn() {
  try {
    await FB.signInWithPopup(FB.auth, new FB.GoogleAuthProvider());
  } catch (e) {
    showToast(e.message);
  }
}

function loadProfiles() {
  const q = FB.query(FB.collection(FB.db, 'profiles'), FB.orderBy('createdAt', 'desc'));
  profilesUnsub = FB.onSnapshot(q, (snap) => {
    profiles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderRecommended();
    renderForYou();
    renderSaved();
    renderLeaderboard();
  }, (err) => showToast(err.message));
}

function cardSizeClass() {
  return imgSize === 'small' ? 'h-40' : imgSize === 'large' ? 'h-80' : 'h-60';
}

function viralityScore(p) {
  const ratings = p.ratingCount || 0;
  const comments = p.commentCount || 0;
  const reactions = p.reactionCount || 0;
  const avg = ratings > 0 ? (p.ratingSum / ratings) : 0;

  let recencyBoost = 0;
  if (p.createdAt) {
    const createdMs = p.createdAt.toDate ? p.createdAt.toDate().getTime() : new Date(p.createdAt).getTime();
    const ageHours = (Date.now() - createdMs) / (1000 * 60 * 60);
    if (ageHours < 24) recencyBoost = 20;
    else if (ageHours < 72) recencyBoost = 12;
    else if (ageHours < 168) recencyBoost = 6;
  }

  return (ratings * 2) + (comments * 3) + (reactions * 1.5) + (avg * 5) + recencyBoost;
}

function cardHtml(p) {
  const avg = p.ratingCount ? (p.ratingSum / p.ratingCount).toFixed(1) : '—';
  const count = p.ratingCount || 0;
  const warned = p.warned ? `<span class="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">⚠️ Warned</span>` : '';
  const banned = p.banned ? `<span class="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">Hidden</span>` : '';
  const isSaved = savedIds.has(p.id);
  const bookmarkIcon = isSaved ? '★' : '☆';
  const bookmarkClass = isSaved ? 'text-lime-400 border-lime-400' : 'text-muted2 hover:text-white border-c';

  const vScore = viralityScore(p);
  const hotBadge = vScore > 40 ? `<span class="badge-trending text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">🔥 Hot</span>` : '';

  // Framing aspect fit
  const imgFit = p.frameMode === 'contain' ? 'object-contain bg-black' : p.frameMode === 'square' ? 'aspect-square object-cover' : 'object-cover';

  return `
  <div class="bg-card2 border border-c rounded-2xl overflow-hidden card-click fade-in shadow-lg flex flex-col justify-between" data-open="${p.id}">
    <div>
      <div class="relative overflow-hidden bg-black/80 shimmer-box flex items-center justify-center">
        <img src="${escapeAttr(p.imageUrl)}" alt="${escapeAttr(p.name)}" class="w-full ${cardSizeClass()} ${imgFit} opacity-90 transition-opacity duration-300" loading="lazy"
          onload="this.style.opacity=1"
          onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect width=%22400%22 height=%22200%22 fill=%22%23111%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%23555%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22>Broken link</text></svg>'" />
        ${banned}
        
        <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button data-quick-save="${p.id}" class="bg-black/75 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold border ${bookmarkClass} transition-colors" title="Bookmark">
            ${bookmarkIcon}
          </button>
          <div class="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-lime-400 border border-lime-500/30 flex items-center gap-1 shadow-md">
            <span>★</span> <span>${avg}</span><span class="text-[10px] text-muted2">/10</span>
          </div>
        </div>
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between gap-1">
          <h3 class="font-bold text-white text-base truncate">${escapeHtml(p.name)}</h3>
          ${hotBadge}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted2 mt-1">
          <span>${escapeHtml(p.grade || '2BAC PC-11')}</span>
          <span>·</span>
          <span>${count} vote${count === 1 ? '' : 's'}</span>
          ${p.reactionCount ? `<span>· ${p.reactionCount} react${p.reactionCount===1?'':'s'}</span>` : ''}
        </div>
        ${p.description ? `<p class="text-xs mt-2 line-clamp-2 text-muted2 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
      </div>
    </div>
    <div class="px-4 pb-3 pt-1 flex items-center justify-between text-[11px] text-muted2 border-t border-c/50">
      <span></span>
      <div class="flex items-center gap-2">
        <button data-quick-share="${escapeAttr(p.imageUrl)}" class="hover:text-white p-1" title="Share link">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6-4-4-4 4m4-4v13"/></svg>
        </button>
        <span class="text-lime-400 font-bold group-hover:underline">Rate & Discuss →</span>
      </div>
    </div>
  </div>`;
}

// Recommended Tab
function renderRecommended() {
  const grid = $('recGrid');
  const empty = $('recEmpty');
  const q = (($('search').value || $('searchMobile').value) || '').trim().toLowerCase();

  let list = [...profiles].filter(p => !p.banned || isAdmin());
  if (q) {
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.grade || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }

  list.sort((a, b) => viralityScore(b) - viralityScore(a));

  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(cardHtml).join('');
  attachCardEvents(grid);
}

// For You Tab
function renderForYou() {
  const grid = $('fyGrid');
  const empty = $('fyEmpty');
  const viewed = viewedIds;

  let candidates = profiles.filter(p => !p.banned && !viewed.has(p.id));
  const gradeWeights = {};
  profiles.forEach(p => {
    if (viewed.has(p.id) && p.grade) gradeWeights[p.grade] = (gradeWeights[p.grade] || 0) + 1;
  });

  candidates.sort((a, b) => {
    const ga = gradeWeights[a.grade] || 0, gb = gradeWeights[b.grade] || 0;
    if (gb !== ga) return gb - ga;
    return viralityScore(b) - viralityScore(a);
  });

  if (candidates.length < 4) {
    candidates = [...profiles].filter(p => !p.banned).sort(() => Math.random() - .5);
  }

  if (!candidates.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = candidates.slice(0, 24).map(cardHtml).join('');
  attachCardEvents(grid);
}

// Saved / Bookmarks Tab
function renderSaved() {
  const grid = $('savedGrid');
  const empty = $('savedEmpty');
  const list = profiles.filter(p => savedIds.has(p.id));

  updateSavedBadge();

  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(cardHtml).join('');
  attachCardEvents(grid);
}

function updateSavedBadge() {
  $('savedTabCount').textContent = savedIds.size;
}

function toggleSavePhoto(pid) {
  playPop();
  if (savedIds.has(pid)) {
    savedIds.delete(pid);
    showToast('Removed from Saved.');
  } else {
    savedIds.add(pid);
    showToast('Photo saved to Bookmarks! 🔖');
  }
  localStorage.setItem('saved_images', JSON.stringify([...savedIds]));
  updateSavedBadge();

  if (currentUser) {
    FB.updateDoc(FB.doc(FB.db, 'users', currentUser.uid), {
      savedImages: [...savedIds]
    }).catch(() => {});
  }

  renderSaved();
  renderRecommended();
  renderForYou();

  const dBtn = $('dBookmarkBtn');
  if (dBtn && currentProfileId === pid) {
    dBtn.classList.toggle('text-lime-400', savedIds.has(pid));
  }
}

function attachCardEvents(container) {
  container.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-quick-save]') || e.target.closest('[data-quick-share]')) return;
      openDetail(el.dataset.open);
    });
  });
  container.querySelectorAll('[data-quick-save]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSavePhoto(btn.dataset.quickSave);
    });
  });
  container.querySelectorAll('[data-quick-share]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyPhotoLink(btn.dataset.quickShare);
    });
  });
}

function copyPhotoLink(url) {
  playPop();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Image link copied to clipboard! 📋');
    });
  } else {
    showToast('Link: ' + url);
  }
}

// Leaderboard Tab
function renderLeaderboard() {
  const list = [...profiles].filter(p => !p.banned && (p.ratingCount || 0) > 0)
    .sort((a, b) => {
      const av = a.ratingSum / a.ratingCount, bv = b.ratingSum / b.ratingCount;
      if (bv !== av) return bv - av;
      return (b.ratingCount || 0) - (a.ratingCount || 0);
    })
    .slice(0, 15);

  const el = $('lbList');
  if (!list.length) {
    el.innerHTML = `<div class="text-center py-12 text-muted2"><p class="text-sm">No ratings submitted yet. Be the first to rate a photo!</p></div>`;
    return;
  }

  el.innerHTML = list.map((p, i) => {
    const avg = (p.ratingSum / p.ratingCount).toFixed(1);
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `<span class="text-muted2 font-mono font-bold text-sm">#${i + 1}</span>`;
    return `
    <div class="flex items-center gap-4 bg-card2 border border-c rounded-2xl p-4 fade-in card-click shadow-md" data-open="${p.id}">
      <div class="w-8 text-center text-xl font-bold flex-shrink-0">${medal}</div>
      <img src="${escapeAttr(p.imageUrl)}" class="w-14 h-14 rounded-xl object-cover border border-c bg-black flex-shrink-0" onerror="this.style.opacity=.3" />
      <div class="flex-1 min-w-0">
        <div class="font-bold text-white text-sm sm:text-base truncate">${escapeHtml(p.name)}</div>
        <div class="text-xs text-muted2 truncate">${escapeHtml(p.grade || '2BAC PC-11')} · ${p.ratingCount} vote${p.ratingCount === 1 ? '' : 's'}</div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-2xl font-black text-lime-400">${avg}</div>
        <div class="text-[10px] text-muted2">Community Score</div>
      </div>
    </div>`;
  }).join('');
  el.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openDetail(el.dataset.open)));
}

// Live Image URL input handler
const imgUrlInput = $('pImageUrl');
imgUrlInput.addEventListener('input', () => {
  const v = imgUrlInput.value.trim();
  const box = $('imgPreview');
  if (/^https?:\/\/.+/i.test(v)) {
    box.querySelector('img').src = v;
    box.classList.remove('hidden');
  } else {
    box.classList.add('hidden');
  }
});
const descInput = $('pDesc');
descInput.addEventListener('input', () => {
  $('descCount').textContent = descInput.value.length;
  const hint = $('descHint');
  hint.style.color = descInput.value.length < 15 ? '#f87171' : 'var(--muted)';
});

// Create Profile (OWNERS ONLY)
async function createProfile() {
  if (!isAdmin()) {
    showToast('Permission denied: Only owners can publish images.');
    return;
  }

  const btn = $('submitProfile');
  const err = $('createErr');
  err.classList.add('hidden');

  const name = $('pName').value.trim();
  const grade = $('pGrade').value.trim() || '2BAC PC-11';
  const description = descInput.value.trim();
  const imageUrl = imgUrlInput.value.trim();
  const frameMode = $('pFrameMode').value;

  if (!name) { err.textContent = 'Please provide a name/title.'; err.classList.remove('hidden'); return; }
  if (description.length < 15) { err.textContent = 'Description should be at least 15 characters.'; err.classList.remove('hidden'); return; }
  if (!/^https?:\/\/.+/i.test(imageUrl)) { err.textContent = 'Valid HTTP or HTTPS image URL required.'; err.classList.remove('hidden'); return; }

  btn.disabled = true;
  btn.textContent = 'Publishing…';

  try {
    await FB.addDoc(FB.collection(FB.db, 'profiles'), {
      name,
      grade,
      description,
      imageUrl,
      frameMode,
      createdBy: currentUser.uid,
      createdByName: nickname(),
      createdByEmail: currentUser.email,
      createdAt: FB.serverTimestamp(),
      ratingSum: 0,
      ratingCount: 0,
      reactionCount: 0,
      commentCount: 0,
      warned: false,
      banned: false
    });

    closeModal('createModal');
    resetCreateForm();
    playSuccessChime();
    showToast('Photo successfully published!');
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = T[currentLang].create || 'Publish to Feed';
  }
}

function resetCreateForm() {
  $('pName').value = '';
  $('pGrade').value = '2BAC PC-11';
  descInput.value = '';
  imgUrlInput.value = '';
  $('descCount').textContent = '0';
  $('imgPreview').classList.add('hidden');
}

// Lightbox Open
function openLightbox(url, title) {
  playPop();
  $('lightboxImg').src = url;
  $('lightboxCaption').textContent = title || 'Full Size View';
  openModal('lightboxModal');
}
$('lightboxClose').onclick = () => closeModal('lightboxModal');

// Open Detail Modal (Full Aspect Ratio + Lightbox Trigger)
async function openDetail(id) {
  currentProfileId = id;
  currentReplyTarget = null;
  const replyBanner = $('replyTargetBanner');
  if (replyBanner) replyBanner.classList.add('hidden');

  viewedIds.add(id);
  localStorage.setItem('viewed', JSON.stringify([...viewedIds]));

  let p = profiles.find(x => x.id === id);
  if (!p) {
    try {
      const snap = await FB.getDoc(FB.doc(FB.db, 'profiles', id));
      if (snap.exists()) p = { id: snap.id, ...snap.data() };
    } catch (_) {}
  }
  if (!p) {
    showToast('Photo not found');
    return;
  }

  // 1. Immediately open modal so user sees feedback right away!
  openModal('detailModal');

  // 2. Populate Header & Image (Original aspect ratio preserved, no crop)
  $('dName').textContent = p.name;
  $('dImg').src = p.imageUrl;
  $('dImg').onclick = () => openLightbox(p.imageUrl, p.name);
  $('dLightboxBtn').onclick = () => openLightbox(p.imageUrl, p.name);
  $('dGrade').textContent = p.grade || '2BAC PC-11';
  $('dDesc').textContent = p.description || '';

  // Show official owner tag if created by an owner UID or owner email
  const isOwnerPost = (p.createdByEmail && OWNER_EMAILS.includes(p.createdByEmail.toLowerCase().trim())) ||
                      (p.createdByName && (p.createdByName.toLowerCase().includes('oussama') || p.createdByName.toLowerCase().includes('yasser'))) ||
                      (currentUser && isOwner(currentUser) && p.createdBy === currentUser.uid);
  $('dOwnerTag').classList.toggle('hidden', !isOwnerPost);

  // Bookmark & Share buttons
  const dBtn = $('dBookmarkBtn');
  if (dBtn) {
    dBtn.classList.toggle('text-lime-400', savedIds.has(id));
    dBtn.onclick = () => toggleSavePhoto(id);
  }
  const dShare = $('dShareBtn');
  if (dShare) dShare.onclick = () => copyPhotoLink(p.imageUrl);

  // 3. Render Current Average Score & Count
  renderScore(p);

  // 4. Rating Input & State
  $('ratingInput').value = myRating !== null ? myRating : '';
  $('ratingErr').classList.add('hidden');
  if (myRating !== null) {
    $('ratingMsg').textContent = `Your vote: ${myRating}/10`;
    $('ratingBtnText').textContent = 'Update Vote';
  } else {
    $('ratingMsg').textContent = '';
    $('ratingBtnText').textContent = 'Submit Vote';
  }

  // 5. Admin Controls for Owners
  $('adminBox').classList.toggle('hidden', !isAdmin());

  // 6. Comments Form vs Sign-in Hint
  const form = $('commentForm');
  const hint = $('commentHint');
  if (currentUser) {
    form.classList.remove('hidden');
    hint.innerHTML = '';
  } else {
    form.classList.add('hidden');
    hint.innerHTML = `<div class="p-3 bg-[#0d1527] border border-[#27354f] rounded-xl flex items-center justify-between text-xs mt-2">
      <span class="text-slate-300 font-medium">Sign in to vote, rate looks & join comments!</span>
      <button onclick="openModal('authModal')" class="px-3.5 py-1.5 rounded-full btn-primary font-bold text-xs shadow-md">Sign In</button>
    </div>`;
  }

  // 7. Social Reactions (Resilient listener with error callback)
  if (reactionsUnsub) reactionsUnsub();
  reactionsUnsub = FB.onSnapshot(FB.collection(FB.db, 'profiles', id, 'reactions'), (snap) => {
    const counts = {};
    let myEmoji = null;
    snap.forEach(d => {
      const r = d.data();
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      if (currentUser && r.uid === currentUser.uid) myEmoji = r.emoji;
    });
    renderReactions(counts, myEmoji);
  }, (err) => console.warn('Reactions error:', err));

  // 8. User's personal rating (Resilient listener with error callback)
  if (myRatingUnsub) myRatingUnsub();
  if (currentUser) {
    myRatingUnsub = FB.onSnapshot(FB.doc(FB.db, 'profiles', id, 'ratings', currentUser.uid), (d) => {
      myRating = d.exists() ? d.data().value : null;
      if (myRating !== null) {
        $('ratingInput').value = myRating;
        $('ratingMsg').textContent = `Your vote: ${myRating}/10`;
        $('ratingBtnText').textContent = 'Update Vote';
      } else {
        $('ratingMsg').textContent = '';
        $('ratingBtnText').textContent = 'Submit Vote';
      }
    }, (err) => console.warn('Rating error:', err));
  }

  // 9. Comments & Threaded replies (Resilient query with error callback & fallback)
  if (commentsUnsub) commentsUnsub();
  commentsUnsub = FB.onSnapshot(
    FB.query(FB.collection(FB.db, 'profiles', id, 'comments'), FB.orderBy('createdAt', 'asc')),
    (snap) => {
      rawComments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      $('commentBadgeCount').textContent = rawComments.length;
      renderSortedComments();
    },
    (err) => {
      console.warn('Comments query error:', err);
      // Fallback in case orderBy requires index
      FB.onSnapshot(FB.collection(FB.db, 'profiles', id, 'comments'), (snap) => {
        rawComments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        $('commentBadgeCount').textContent = rawComments.length;
        renderSortedComments();
      }, (e2) => console.warn('Fallback comments error:', e2));
    }
  );
}

function renderScore(p) {
  const score = p.ratingCount ? (p.ratingSum / p.ratingCount).toFixed(1) : '—';
  $('dScore').textContent = score;
  $('dCount').textContent = p.ratingCount ? `(${p.ratingCount} vote${p.ratingCount === 1 ? '' : 's'})` : '(no votes yet)';
}

function renderReactions(counts, myEmoji) {
  const row = $('reactionRow');
  row.innerHTML = EMOJIS.map(e => {
    const c = counts[e] || 0;
    const active = myEmoji === e ? 'active' : '';
    return `<button class="emoji-btn ${active} px-3 py-1.5 rounded-xl text-xs border border-c flex items-center gap-1.5 bg-bg text-white hover:border-lime-400" data-emoji="${e}">
      <span>${e}</span>
      <span class="text-[11px] font-bold text-muted2">${c}</span>
    </button>`;
  }).join('');
  row.querySelectorAll('[data-emoji]').forEach(b => b.addEventListener('click', (e) => {
    reactEmoji(b.dataset.emoji, e.clientX, e.clientY);
  }));
}

// React Emoji
async function reactEmoji(emoji, clientX, clientY) {
  if (!currentUser) { openModal('authModal'); return; }
  playPop();
  if (emoji === '🎉' || emoji === '🔥' || emoji === '❤️') {
    triggerBurst(clientX || window.innerWidth / 2, clientY || window.innerHeight / 2);
  }

  const rRef = FB.doc(FB.db, 'profiles', currentProfileId, 'reactions', currentUser.uid);
  const pRef = FB.doc(FB.db, 'profiles', currentProfileId);

  try {
    await FB.runTransaction(FB.db, async (t) => {
      const snap = await t.get(rRef);
      const pSnap = await t.get(pRef);
      let count = (pSnap.data().reactionCount || 0);

      if (snap.exists() && snap.data().emoji === emoji) {
        t.delete(rRef);
        t.update(pRef, { reactionCount: Math.max(0, count - 1) });
      } else {
        const isNew = !snap.exists();
        t.set(rRef, { emoji, uid: currentUser.uid, createdAt: FB.serverTimestamp() });
        if (isNew) t.update(pRef, { reactionCount: count + 1 });
      }
    });
  } catch (e) {
    showToast(e.message);
  }
}

// Rate Profile with Immediate Edit Support
async function rateProfile(overrideVal, evt) {
  if (!currentUser) { openModal('authModal'); showToast('Please sign in to rate!'); return; }
  if (userProfile && (userProfile.banned || userProfile.suspended)) {
    showToast('Your account is banned from voting.');
    return;
  }
  if (userProfile && userProfile.timeoutUntil && Date.now() < userProfile.timeoutUntil) {
    const mins = Math.ceil((userProfile.timeoutUntil - Date.now()) / 60000);
    showToast(`You are in timeout for ${mins} more minutes.`);
    return;
  }

  const p = profiles.find(x => x.id === currentProfileId);
  if (p && p.createdBy === currentUser.uid) {
    $('ratingErr').textContent = T[currentLang].own_profile || "You cannot vote on your own photo";
    $('ratingErr').classList.remove('hidden');
    return;
  }

  const raw = overrideVal !== undefined ? String(overrideVal) : $('ratingInput').value.trim();
  if (!/^\d{1,2}(\.\d)?$/.test(raw)) {
    $('ratingErr').textContent = 'Please enter a valid number (e.g. 8.5).';
    $('ratingErr').classList.remove('hidden');
    return;
  }

  const v = parseFloat(raw);
  if (v < 0.1 || v > 10.0) {
    $('ratingErr').textContent = 'Rating must be between 0.1 and 10.0.';
    $('ratingErr').classList.remove('hidden');
    return;
  }

  $('ratingErr').classList.add('hidden');
  const profileRef = FB.doc(FB.db, 'profiles', currentProfileId);
  const ratingRef = FB.doc(FB.db, 'profiles', currentProfileId, 'ratings', currentUser.uid);

  try {
    await FB.runTransaction(FB.db, async (t) => {
      const pSnap = await t.get(profileRef);
      const rSnap = await t.get(ratingRef);
      const data = pSnap.data();

      let sum = data.ratingSum || 0;
      let count = data.ratingCount || 0;

      if (rSnap.exists()) {
        sum = sum - rSnap.data().value + v;
      } else {
        sum += v;
        count += 1;
      }

      t.set(ratingRef, { value: v, updatedAt: FB.serverTimestamp() });
      t.update(profileRef, { ratingSum: sum, ratingCount: count });
    });

    $('ratingInput').value = v;
    $('ratingBtnText').textContent = 'Update Vote';
    $('ratingMsg').textContent = `Your vote: ${v}/10`;
    playSuccessChime();
    const x = evt ? evt.clientX : window.innerWidth / 2;
    const y = evt ? evt.clientY : window.innerHeight / 2;
    triggerBurst(x, y);
    showToast('Vote saved: ' + v + '/10 ✨');
  } catch (e) {
    $('ratingErr').textContent = e.message;
    $('ratingErr').classList.remove('hidden');
  }
}

// Comments UI Tree Renderer
function renderSortedComments() {
  const list = $('commentsList');
  if (!rawComments.length) {
    list.innerHTML = `<p class="text-xs text-muted2 py-4 text-center">No comments yet. Be the first to drop a comment!</p>`;
    return;
  }

  let sorted = [...rawComments];
  if (currentCommentSort === 'top') {
    sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  } else if (currentCommentSort === 'newest') {
    sorted.sort((a, b) => {
      const at = a.createdAt ? (a.createdAt.seconds || 0) : 0;
      const bt = b.createdAt ? (b.createdAt.seconds || 0) : 0;
      return bt - at;
    });
  } else {
    sorted.sort((a, b) => {
      const at = a.createdAt ? (a.createdAt.seconds || 0) : 0;
      const bt = b.createdAt ? (b.createdAt.seconds || 0) : 0;
      return at - bt;
    });
  }

  sorted.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  list.innerHTML = renderCommentsTree(sorted);

  list.querySelectorAll('[data-like-cid]').forEach(btn => {
    btn.addEventListener('click', () => toggleCommentLike(btn.dataset.likeCid));
  });
  list.querySelectorAll('[data-reply-cid]').forEach(btn => {
    btn.addEventListener('click', () => setReplyTarget(btn.dataset.replyCid, btn.dataset.replyNick));
  });
  list.querySelectorAll('[data-pin-cid]').forEach(btn => {
    btn.addEventListener('click', () => togglePinComment(btn.dataset.pinCid));
  });
  list.querySelectorAll('[data-edit-cid]').forEach(btn => {
    btn.addEventListener('click', () => editCommentPrompt(btn.dataset.editCid));
  });
  list.querySelectorAll('[data-report-cid]').forEach(btn => {
    btn.addEventListener('click', () => reportCommentPrompt(btn.dataset.reportCid, btn.dataset.reportText));
  });
  list.querySelectorAll('[data-delete-cid]').forEach(btn => {
    btn.addEventListener('click', () => deleteComment(btn.dataset.deleteCid));
  });
  list.querySelectorAll('[data-open-author-edit]').forEach(btn => {
    btn.addEventListener('click', openProfileEditModal);
  });
  list.querySelectorAll('[data-mod-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.modUser;
      const uid = btn.dataset.uid;
      const uname = btn.dataset.uname;
      if (act === 'warn') warnUser(uid, uname);
      else if (act === 'timeout') timeoutUser(uid, uname, 24);
      else if (act === 'ban') banUser(uid, uname);
    });
  });
}

function renderCommentsTree(comments) {
  const rootComments = comments.filter(c => !c.replyToId);
  const repliesByParent = {};
  comments.forEach(c => {
    if (c.replyToId) {
      if (!repliesByParent[c.replyToId]) repliesByParent[c.replyToId] = [];
      repliesByParent[c.replyToId].push(c);
    }
  });

  return rootComments.map(c => {
    const replies = repliesByParent[c.id] || [];
    return renderCommentCard(c, false) + (replies.length ? `<div class="ml-6 pl-3 border-l-2 border-c space-y-2 mt-2">${replies.map(r => renderCommentCard(r, true)).join('')}</div>` : '');
  }).join('');
}

function renderCommentCard(c, isReply) {
  const isOwnerComment = (c.email && OWNER_EMAILS.includes(c.email.toLowerCase().trim())) ||
                         (c.name && (c.name.toLowerCase().includes('oussama') || c.name.toLowerCase().includes('yasser')));
  const ownerBadge = isOwnerComment ? getOwnerBadge({ email: c.email }) : '';
  const isMine = currentUser && currentUser.uid === c.uid;
  const canDelete = isAdmin() || isMine;
  const likes = c.likeCount || 0;
  const pinnedTag = c.pinned ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-md border border-lime-500/30">📌 Pinned</span>` : '';
  const editedTag = c.edited ? `<span class="text-[10px] text-muted2 italic">(edited)</span>` : '';

  return `
  <div class="bg-bg border border-c ${c.pinned ? 'border-lime-500/50 bg-lime-500/5' : ''} rounded-2xl p-3 text-xs space-y-1.5 shadow-sm" id="comment-${c.id}">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-bold text-white text-xs sm:text-sm ${isMine ? 'cursor-pointer hover:underline text-lime-400' : ''}" ${isMine ? 'data-open-author-edit="true"' : ''}>${escapeHtml(c.name || 'Student')}</span>
        ${ownerBadge}
        ${pinnedTag}
        <span class="text-[10px] text-muted2">${timeAgo(c.createdAt)} ${editedTag}</span>
      </div>
      <div class="flex items-center gap-1.5">
        ${isAdmin() ? `<button data-pin-cid="${c.id}" class="text-[10px] text-muted2 hover:text-lime-400" title="${c.pinned ? 'Unpin' : 'Pin to top'}">${c.pinned ? 'Unpin' : 'Pin'}</button>` : ''}
        ${isMine ? `<button data-edit-cid="${c.id}" class="text-[10px] text-muted2 hover:text-lime-400" title="Edit">Edit</button>` : ''}
        <button data-report-cid="${c.id}" data-report-text="${escapeAttr(c.text)}" class="text-[10px] text-muted2 hover:text-red-400" title="Report">Report</button>
        ${canDelete ? `<button data-delete-cid="${c.id}" class="text-[10px] text-muted2 hover:text-red-400 p-0.5" title="Delete">✕</button>` : ''}
      </div>
    </div>
    <div id="commentText-${c.id}" class="text-xs text-white/90 leading-relaxed whitespace-pre-wrap">${escapeHtml(c.text)}</div>
    <div class="flex items-center gap-3 pt-1 text-[11px] text-muted2">
      <button data-like-cid="${c.id}" class="flex items-center gap-1 hover:text-lime-400 transition-colors">
        <span>❤️</span> <span>${likes}</span>
      </button>
      <button data-reply-cid="${c.id}" data-reply-nick="${escapeAttr(c.name || 'Student')}" class="hover:text-lime-400 font-semibold transition-colors">
        Reply
      </button>
    
    ${isAdmin() && c.uid !== (currentUser && currentUser.uid) ? `
    <div class="flex items-center gap-1.5 border-t border-[#1e293b]/70 pt-1.5 mt-1 text-[10px]">
      <span class="text-lime-400 font-bold">👑 Mod User:</span>
      <button data-mod-user="warn" data-uid="${c.uid}" data-uname="${escapeAttr(c.name || 'User')}" class="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold">⚠️ Warn</button>
      <button data-mod-user="timeout" data-uid="${c.uid}" data-uname="${escapeAttr(c.name || 'User')}" class="px-2 py-0.5 rounded bg-orange-500/15 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 font-bold">⏳ Timeout (24h)</button>
      <button data-mod-user="ban" data-uid="${c.uid}" data-uname="${escapeAttr(c.name || 'User')}" class="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/30 font-bold">🚫 Ban</button>
    </div>` : ''}
  </div>`;
}

$('sortTop').addEventListener('click', () => setCommentSort('top'));
$('sortNewest').addEventListener('click', () => setCommentSort('newest'));
$('sortOldest').addEventListener('click', () => setCommentSort('oldest'));

function setCommentSort(s) {
  playPop();
  currentCommentSort = s;
  ['sortTop', 'sortNewest', 'sortOldest'].forEach(id => {
    $(id).classList.remove('border-lime-400', 'text-lime-400', 'font-semibold');
    $(id).classList.add('border-c', 'text-muted2');
  });
  const map = { top: 'sortTop', newest: 'sortNewest', oldest: 'sortOldest' };
  $(map[s]).classList.add('border-lime-400', 'text-lime-400', 'font-semibold');
  $(map[s]).classList.remove('border-c', 'text-muted2');
  renderSortedComments();
}

async function togglePinComment(cid) {
  if (!isAdmin()) return;
  playPop();
  const c = rawComments.find(x => x.id === cid);
  if (!c) return;
  const cRef = FB.doc(FB.db, 'profiles', currentProfileId, 'comments', cid);
  try {
    await FB.updateDoc(cRef, { pinned: !c.pinned });
    showToast(c.pinned ? 'Comment unpinned.' : 'Comment pinned to top! 📌');
  } catch (e) {
    showToast(e.message);
  }
}

function editCommentPrompt(cid) {
  const c = rawComments.find(x => x.id === cid);
  if (!c) return;
  const container = $(`commentText-${cid}`);
  if (!container) return;

  container.innerHTML = `
    <div class="mt-1 space-y-2">
      <textarea id="editInput-${cid}" rows="2" maxlength="300" class="w-full rounded-xl p-2 text-xs ring-accent bg-bg border border-c text-white">${escapeHtml(c.text)}</textarea>
      <div class="flex gap-2 justify-end">
        <button class="px-2.5 py-1 rounded-lg border border-c text-[11px] text-muted2 hover:text-white" onclick="renderSortedComments()">Cancel</button>
        <button class="px-3 py-1 rounded-lg text-[11px] font-semibold btn-primary" onclick="saveEditedComment('${cid}')">Save</button>
      </div>
    </div>`;
}

window.saveEditedComment = async (cid) => {
  const input = $(`editInput-${cid}`);
  if (!input) return;
  const newText = input.value.trim();
  if (!newText) return;

  const cRef = FB.doc(FB.db, 'profiles', currentProfileId, 'comments', cid);
  try {
    await FB.updateDoc(cRef, {
      text: newText,
      edited: true,
      updatedAt: FB.serverTimestamp()
    });
    playPop();
    showToast('Comment updated.');
  } catch (e) {
    showToast(e.message);
  }
};

function reportCommentPrompt(cid, text) {
  currentReportContext = { type: 'comment', id: cid, text };
  $('reportDetails').value = `Reporting comment: "${text}"`;
  openModal('reportModal');
}

function setReplyTarget(cid, nick) {
  playPop();
  currentReplyTarget = { cid, nick };
  $('replyTargetName').textContent = '@' + nick;
  $('replyTargetBanner').classList.remove('hidden');
  $('commentInput').focus();
}

$('cancelReplyBtn').addEventListener('click', () => {
  currentReplyTarget = null;
  $('replyTargetBanner').classList.add('hidden');
});

async function toggleCommentLike(cid) {
  if (!currentUser) { openModal('authModal'); return; }
  playPop();
  const likeRef = FB.doc(FB.db, 'profiles', currentProfileId, 'comments', cid, 'likes', currentUser.uid);
  const cRef = FB.doc(FB.db, 'profiles', currentProfileId, 'comments', cid);

  try {
    await FB.runTransaction(FB.db, async (t) => {
      const snap = await t.get(likeRef);
      const cSnap = await t.get(cRef);
      let count = cSnap.data().likeCount || 0;

      if (snap.exists()) {
        t.delete(likeRef);
        t.update(cRef, { likeCount: Math.max(0, count - 1) });
      } else {
        t.set(likeRef, { uid: currentUser.uid, createdAt: FB.serverTimestamp() });
        t.update(cRef, { likeCount: count + 1 });
      }
    });
  } catch (e) {
    showToast(e.message);
  }
}

async function addComment() {
  if (!currentUser) { openModal('authModal'); showToast('Please sign in to comment!'); return; }
  if (userProfile && (userProfile.banned || userProfile.suspended)) {
    showToast('Your account is banned from commenting.');
    return;
  }
  if (userProfile && userProfile.timeoutUntil && Date.now() < userProfile.timeoutUntil) {
    const mins = Math.ceil((userProfile.timeoutUntil - Date.now()) / 60000);
    showToast(`You are in timeout for ${mins} more minutes.`);
    return;
  }
  const text = $('commentInput').value.trim();
  if (!text) return;
  try {
    const payload = {
      uid: currentUser.uid,
      name: nickname(),
      email: currentUser.email || '',
      text,
      createdAt: FB.serverTimestamp(),
      likeCount: 0,
      pinned: false
    };
    if (currentReplyTarget) {
      payload.replyToId = currentReplyTarget.cid;
      payload.replyToNick = currentReplyTarget.nick;
    }
    await FB.addDoc(FB.collection(FB.db, 'profiles', currentProfileId, 'comments'), payload);
    const pRef = FB.doc(FB.db, 'profiles', currentProfileId);
    await FB.updateDoc(pRef, { commentCount: FB.increment(1) });
    $('commentInput').value = '';
    currentReplyTarget = null;
    $('replyTargetBanner').classList.add('hidden');
    playSuccessChime();
  } catch (e) {
    showToast('Comment error: ' + e.message);
  }
}

$('reportBtn').addEventListener('click', () => {

$('reportSubmit').addEventListener('click', async () => {
  const err = $('reportErr');
  const ok = $('reportOk');
  err.classList.add('hidden');
  ok.classList.add('hidden');

  const p = profiles.find(x => x.id === currentProfileId);

  try {
    const reportData = {
      type: currentReportContext ? currentReportContext.type : 'image',
      profileId: currentProfileId,
      reason: $('reportReason').value,
      details: $('reportDetails').value.trim(),
      reporterUid: currentUser.uid,
      reporterNickname: nickname(),
      createdAt: FB.serverTimestamp(),
      status: 'open'
    };

    if (p) {
      reportData.imageUrl = p.imageUrl;
      reportData.reportedNickname = p.name;
      reportData.createdBy = p.createdBy;
    }

    await FB.addDoc(FB.collection(FB.db, 'reports'), reportData);

    if (EMAILJS_SERVICE && window.emailjs) {
      try {
        window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
          to_email: 'anaflousoussama555@gmail.com',
          image_url: p ? p.imageUrl : 'Comment Report',
          post_id: currentProfileId,
          reason: $('reportReason').value,
          details: $('reportDetails').value.trim(),
          reported_user: p ? p.name : 'Unknown',
          reporter: nickname()
        }, EMAILJS_PUBLIC_KEY);
      } catch (_) {}
    }

    ok.classList.remove('hidden');
    $('reportDetails').value = '';
    setTimeout(() => closeModal('reportModal'), 2000);
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  }
});

// Student Feedback / Idea Box
$('suggestBtn').onclick = () => {
  if (!currentUser) { openModal('authModal'); return; }
  playPop();
  $('fbDetails').value = '';
  $('fbErr').classList.add('hidden');
  $('fbOk').classList.add('hidden');
  openModal('feedbackModal');
};

$('fbSubmit').onclick = async () => {
  const details = $('fbDetails').value.trim();
  const category = $('fbCategory').value;
  const err = $('fbErr');
  const ok = $('fbOk');
  err.classList.add('hidden');
  ok.classList.add('hidden');

  if (!details || details.length < 5) {
    err.textContent = 'Please provide a bit more detail about your idea.';
    err.classList.remove('hidden');
    return;
  }

  try {
    await FB.addDoc(FB.collection(FB.db, 'feedback'), {
      uid: currentUser.uid,
      nickname: nickname(),
      category: category,
      details: details,
      createdAt: FB.serverTimestamp()
    });
    playSuccessChime();
    ok.classList.remove('hidden');
    $('fbDetails').value = '';
    setTimeout(() => closeModal('feedbackModal'), 2200);
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  }
};

// Settings Handlers
$('settingsBtn').addEventListener('click', () => {
  playPop();
  $('soundToggle').checked = soundEnabled;
  $('motionToggle').checked = reducedMotion;
  openModal('settingsModal');
});
$('themeLight').addEventListener('click', () => applyTheme('light'));
$('themeDark').addEventListener('click', () => applyTheme('dark'));
$('langSelect').addEventListener('change', (e) => applyLang(e.target.value));
$('imgSizeSelect').addEventListener('change', (e) => {
  imgSize = e.target.value;
  localStorage.setItem('imgSize', imgSize);
  renderRecommended();
  renderForYou();
  renderSaved();
});

$('soundToggle').addEventListener('change', (e) => {
  soundEnabled = e.target.checked;
  localStorage.setItem('sound_enabled', String(soundEnabled));
  if (soundEnabled) playSuccessChime();
});

$('motionToggle').addEventListener('change', (e) => {
  reducedMotion = e.target.checked;
  localStorage.setItem('reduced_motion', String(reducedMotion));
});

$('testSoundBtn').onclick = () => {
  initAudio();
  playSuccessChime();
};

$('settingsEditProfileBtn').onclick = () => {
  closeModal('settingsModal');
  openProfileEditModal();
};

// About, FAQ & Changelog Triggers
$('aboutBtn').onclick = () => { playPop(); openModal('aboutModal'); };
$('footerAboutBtn').onclick = () => { playPop(); openModal('aboutModal'); };
$('footerFaqBtn').onclick = () => { playPop(); openModal('aboutModal'); };
$('changelogBtn').onclick = () => { playPop(); openModal('changelogModal'); };

// Wire Up Global UI Listeners
function wireUI() {
  $('search').addEventListener('input', renderRecommended);
  $('searchMobile').addEventListener('input', (e) => {
    $('search').value = e.target.value;
    renderRecommended();
  });

  document.querySelectorAll('.tabBtn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  $('createBtn').addEventListener('click', () => openModal('createModal'));
  $('submitProfile').addEventListener('click', createProfile);
  $('commentSend').addEventListener('click', addComment);
  $('googleSignIn').addEventListener('click', signIn);

  document.querySelectorAll('.quick-rate').forEach(b => {
    b.addEventListener('click', (e) => rateProfile(parseFloat(b.dataset.val), e));
  });

  document.querySelectorAll('[data-admin]').forEach(b => b.addEventListener('click', () => adminAction(b.dataset.admin)));
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.close)));

  document.querySelectorAll('.fixed.inset-0').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.add('hidden');
        m.classList.remove('flex');
      }
    });
  });

  // Keyboard navigation: Escape closes modal; Ctrl+K / '/' focuses search
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fixed.inset-0.flex').forEach(m => {
        m.classList.add('hidden');
        m.classList.remove('flex');
      });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      $('search').focus();
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      $('search').focus();
    }
  });

  $('ratingSubmit').addEventListener('click', (e) => rateProfile(undefined, e));
}

// Switch Tab Navigation
function switchTab(tab) {
  playPop();
  ['recommendedView', 'foryouView', 'savedView', 'lbView'].forEach(id => $(id).classList.add('hidden'));
  const map = { recommended: 'recommendedView', foryou: 'foryouView', saved: 'savedView', leaderboard: 'lbView' };
  if ($(map[tab])) $(map[tab]).classList.remove('hidden');

  document.querySelectorAll('.tabBtn').forEach(b => {
    const on = b.dataset.tab === tab;
    if (on) {
      b.classList.add('btn-primary');
      b.classList.remove('text-muted2');
    } else {
      b.classList.remove('btn-primary');
      b.classList.add('text-muted2');
    }
  });

  if (tab === 'recommended') renderRecommended();
  if (tab === 'foryou') renderForYou();
  if (tab === 'saved') renderSaved();
  if (tab === 'leaderboard') renderLeaderboard();
}

if (EMAILJS_SERVICE) {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => { try { window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch (_) {} };
  document.head.appendChild(s);
}

$('logoArea').addEventListener('click', () => {
  switchTab('recommended');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

boot().catch(err => {
  const b = document.getElementById('fatalErr');
  if (b) {
    b.textContent = 'Application Initialization Error: ' + (err && err.message ? err.message : err);
    b.classList.remove('hidden');
  }
  console.error(err);
});
