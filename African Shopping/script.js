let products = [];
let cart = JSON.parse(localStorage.getItem("afroCrownCart") || "[]");
let currentFilter = "all", currentTerm = "";

const grid = document.getElementById("productGrid");
const pills = document.getElementById("filterPills");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

function money(n) { return Number(n).toFixed(2); }

// ==========================================
// 👑 THREE.JS 3D GOLDEN BRACELET ENGINE
// ==========================================
function init3DBracelet() {
  const canvas = document.getElementById('hero3DCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Twisted Golden Bracelet (Torus Knot Geometry)
  const geometry = new THREE.TorusKnotGeometry(1, 0.35, 120, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0xd8ad45,
    metalness: 0.85,
    roughness: 0.15,
    wireframe: false
  });
  
  const bracelet = new THREE.Mesh(geometry, material);
  scene.add(bracelet);

  // Lighting
  const light1 = new THREE.DirectionalLight(0xfff0d0, 1.5);
  light1.position.set(3, 3, 5);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(-3, -3, -2);
  scene.add(light2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  camera.position.z = 4;

  // Interactive Cursor Rotation
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Render Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    bracelet.rotation.x += 0.01 + mouseY * 0.05;
    bracelet.rotation.y += 0.015 + mouseX * 0.05;
    renderer.render(scene, camera);
  }
  animate();
}

// ==========================================
// 🔊 AUDIO ENGINE (Synthesizer Audio)
// ==========================================
let audioCtx = null;
let audioUnlocked = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audioUnlocked = true;
  const hint = document.getElementById('audioHint');
  if (hint) {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 500);
  }
}

['click', 'touchstart', 'keydown', 'mousemove'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (!audioUnlocked) initAudio();
  }, { once: true });
});

function playHoverSound() {
  if (!audioCtx || !audioUnlocked) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch(e){}
}

function playClickSound() {
  if (!audioCtx || !audioUnlocked) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch(e){}
}

function playSuccessChime() {
  if (!audioCtx || !audioUnlocked) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = audioCtx.currentTime + (idx * 0.05);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  } catch(e){}
}

function playPopSound() {
  if (!audioCtx || !audioUnlocked) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e){}
}

// ==========================================
// 🕹️ CATALOGUE & RENDERING
// ==========================================
async function loadProducts() {
  try {
    const r = await fetch("products.json");
    products = await r.json();
    const hash = location.hash.replace("#", "");
    if (["kids", "teens", "fashion", "accessories", "home"].includes(hash)) currentFilter = hash;
    render();
    updateCart();
    attachGlobalSoundEffects();
    createAudioBanner();
    init3DBracelet();
  } catch(e) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:60px;text-align:center">Could not load catalogue. Please run using VS Code Live Server.</div>';
    init3DBracelet();
  }
}

function getList() {
  const q = currentTerm.trim().toLowerCase();
  let list = products.filter(p => {
    const categoryOK = currentFilter === "all" || p.category === currentFilter;
    const text = (p.name + " " + p.category + " African Kente Ankara cultural handmade kids teens").toLowerCase();
    return categoryOK && (!q || text.includes(q));
  });
  if (sortSelect.value === "low") list.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "high") list.sort((a,b) => b.price - a.price);
  return list;
}

function render() {
  const list = getList();
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="badge">${p.badge}</span>
        <button class="heart" onclick="heart(this)" aria-label="Add to wishlist">♡</button>
      </div>
      <div class="product-body">
        <div class="category-tag">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="price-row">
          <div><span class="price">£${money(p.price)}</span> ${p.old ? `<span class="old-price">£${money(p.old)}</span>` : ''}</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("#filterPills .pill").forEach(p => {
    p.classList.toggle("active", p.dataset.cat === currentFilter);
  });
  if (categorySelect) categorySelect.value = currentFilter;

  apply3DTilt();
  attachDynamicSoundEffects();
}

function apply3DTilt() {
  const cards = document.querySelectorAll('.product, .category-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    });
  });
}

function addToCart(id) {
  playSuccessChime();
  const p = products.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  updateCart();
  toast(`Added "${p.name}" to cart ✨`);
  openCart();
}

function changeQty(id, delta) {
  playClickSound();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCart();
}

function updateCart() {
  localStorage.setItem("afroCrownCart", JSON.stringify(cart));
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const sub = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  
  document.getElementById("cartCount").textContent = count;
  document.getElementById("subtotal").textContent = money(sub);
  
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    cartEmpty.style.display = "block";
    cartTotal.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartTotal.style.display = "block";
    cartItems.innerHTML = cart.map(i => `
      <div class="cart-item" style="display:flex;gap:12px;margin-bottom:12px;align-items:center;">
        <img src="${i.image}" alt="${i.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">
        <div style="flex:1;">
          <h4 style="margin:0;font-size:13px;">${i.name}</h4>
          <div style="font-weight:bold;font-size:12px;">£${money(i.price)}</div>
        </div>
        <div>
          <button onclick="changeQty(${i.id}, -1)">-</button>
          <span style="padding:0 4px;">${i.qty}</span>
          <button onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }
}

function heart(btn) {
  playPopSound();
  btn.textContent = btn.textContent === "♡" ? "♥" : "♡";
  btn.style.color = btn.textContent === "♥" ? "#a33429" : "";
  toast(btn.textContent === "♥" ? "Saved to wishlist ❤️" : "Removed from wishlist");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function attachGlobalSoundEffects() {
  document.querySelectorAll('button, a, select, input').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
  });
}

function attachDynamicSoundEffects() {
  document.querySelectorAll('.product, .add-btn, .heart').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
  });
}

function createAudioBanner() {
  if (document.getElementById('audioHint')) return;
  const banner = document.createElement('div');
  banner.id = 'audioHint';
  banner.className = 'audio-hint';
  banner.innerHTML = '🔊 Click anywhere to activate 3D Sound & Motion';
  banner.onclick = () => initAudio();
  document.body.appendChild(banner);
}

// ... (code above) ...

function createAudioBanner() {
  if (document.getElementById('audioHint')) return;
  const banner = document.createElement('div');
  banner.id = 'audioHint';
  banner.className = 'audio-hint';
  banner.innerHTML = '🔊 Click anywhere to activate 3D Sound & Motion';
  banner.onclick = () => initAudio();
  document.body.appendChild(banner);
}

// ==========================================
// 🛒 POP-UP CART CONTROLE LOGIC
// ==========================================
const panel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function openCart() { 
  playClickSound(); 
  panel.classList.add("open"); 
  overlay.classList.add("show"); 
}

function closeCart() { 
  playClickSound(); 
  panel.classList.remove("open"); 
  overlay.classList.remove("show"); 
}

document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
overlay.onclick = closeCart;

// Close pop-up when ESC key is pressed
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panel.classList.contains("open")) {
    closeCart();
  }
});

document.getElementById("checkout").onclick = () => { playSuccessChime(); toast("Demo checkout — connect Stripe/PayPal."); };

// ... (rest of code below) ...

document.getElementById("checkout").onclick = () => { playSuccessChime(); toast("Demo checkout — connect Stripe/PayPal."); };
document.getElementById("newsletterForm").onsubmit = e => { e.preventDefault(); playSuccessChime(); toast("Welcome to The Crown Letter ✦"); e.target.reset(); };

if (document.getElementById("mobileMenu")) {
  document.getElementById("mobileMenu").onclick = () => { playClickSound(); document.getElementById("nav").scrollIntoView({ behavior: "smooth" }); };
}

pills.addEventListener("click", e => {
  const pill = e.target.closest(".pill");
  if (!pill) return;
  playClickSound();
  currentFilter = pill.dataset.cat;
  render();
});

if (categorySelect) categorySelect.onchange = e => { playClickSound(); currentFilter = e.target.value; render(); };
if (sortSelect) sortSelect.onchange = () => { playClickSound(); render(); };
searchInput.oninput = e => { currentTerm = e.target.value; render(); };

let end = Date.now() + 8 * 3600000 + 42 * 60000 + 19000;
setInterval(() => {
  let d = Math.max(0, end - Date.now());
  let h = Math.floor(d / 3600000), m = Math.floor(d % 3600000 / 60000), s = Math.floor(d % 60000 / 1000);
  const clock = document.getElementById("dealClock");
  if (clock) clock.textContent = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}, 1000);

loadProducts();