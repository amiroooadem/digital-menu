import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* ---------------- FIREBASE ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAlHN3EWZnMOXfa0RNWN6WpE9nrkivACs0",
  authDomain: "cafe-menu-5358e.firebaseapp.com",
  projectId: "cafe-menu-5358e",
  storageBucket: "cafe-menu-5358e.appspot.com",
  messagingSenderId: "665214189728",
  appId: "1:665214189728:web:d9ba3ff01681c06124c9c5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ---------------- STATE ---------------- */
let menuItems = [];
let fastMode = false;
let currentLang = "en";
let searchTimeout = null; // For debouncing search

/* ---------------- DOM ---------------- */
const pages = document.querySelectorAll(".page");

const sections = {
  lunch: document.getElementById("lunchList"),
  drink: document.getElementById("drinkList"),
  breakfast: document.getElementById("breakfastList"),
  hotdrink: document.getElementById("hotdrinkList"),
  fasting: document.getElementById("fastingList")
};

const categoryGrid = document.getElementById("categoryGrid");
const searchInput = document.getElementById("searchInput");
const fastToggle = document.getElementById("fastToggle");
const langSelect = document.getElementById("langSelect");

const CATEGORY_MAP = {
  lunch: "lunch",
  lunches: "lunch",
  breakfast: "breakfast",
  "break fast": "breakfast",
  drink: "drink",
  drinks: "drink",
  hotdrink: "hotdrink",
  "hot drink": "hotdrink",
  "hot drinks": "hotdrink",
  fasting: "fasting",
  fast: "fasting"
};

const CATEGORY_NAMES = {
  lunch: "Lunch",
  drink: "Drinks",
  breakfast: "Breakfast",
  hotdrink: "Hot Drinks",
  fasting: "Fasting"
};

/* ---------------- IMAGE SAFETY ---------------- */
function safeImage(img) {
  if (img && typeof img === "string" && img.trim() !== "") {
    return `images/${img}`;
  }
  return "images/default.jpg";
}

/* ---------------- PAGE NAV ---------------- */
window.openCategory = (id) => {
  pages.forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  if (page) page.classList.add("active");
  if (id !== "home") renderMenu(); // Render menu only for category pages
};

/* ---------------- NORMALIZE ---------------- */
function normalizeCategory(raw) {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return CATEGORY_MAP[key] || null;
}

/* ---------------- FIREBASE LISTENER ---------------- */
onSnapshot(collection(db, "menu"), snapshot => {
  menuItems = [];

  snapshot.forEach(doc => {
    const d = doc.data();
    if (d.active === false) return; // Skip inactive items

    const category = normalizeCategory(d.category);
    if (!category) return; // Skip invalid categories

    // Ensure name and desc have en and am keys with defaults
    const nameEn = d.name || "Unnamed Item";
    const nameAm = d.nameAm || nameEn;
    const descEn = d.desc || "";
    const descAm = d.descAm || descEn;

    menuItems.push({
      category,
      name: { en: nameEn, am: nameAm },
      desc: { en: descEn, am: descAm },
      price: parseFloat(d.price) || 0, // Ensure price is a number
      fastAllowed: !!d.fastAllowed,
      img: d.img || ""
    });
  });

  renderHome();
}, error => {
  console.error("Error fetching menu data:", error);
});

/* ---------------- HOME GRID ---------------- */
function renderHome() {
  categoryGrid.innerHTML = "";

  Object.keys(CATEGORY_NAMES).forEach(cat => {
    const firstItem = menuItems.find(m => m.category === cat);

    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <img src="${safeImage(firstItem?.img)}"
           onerror="this.onerror=null;this.src='images/default.jpg';">
      <span>${CATEGORY_NAMES[cat]}</span>
    `;

    card.onclick = () => openCategory(cat);
    categoryGrid.appendChild(card);
  });
}

/* ---------------- MENU ITEMS ---------------- */
function renderMenu() {
  const term = searchInput.value.toLowerCase();
  const lang = currentLang === "am" ? "am" : "en"; // Default to "en" if invalid

  // Get the active page (category)
  const activePage = document.querySelector(".page.active");
  const activeCat = activePage ? activePage.id : null;
  if (!activeCat || !sections[activeCat]) return;

  const container = sections[activeCat];
  container.innerHTML = "";

  let hasItems = false;
  menuItems.forEach(item => {
    if (item.category !== activeCat) return;
    if (fastMode && !item.fastAllowed) return;
    if (term && !item.name[lang].toLowerCase().includes(term)) return;

    hasItems = true;
    const card = document.createElement("div");
    card.className = "menu-item";
    card.innerHTML = `
      <img src="${safeImage(item.img)}"
           alt="${item.name[lang]}"
           onerror="this.onerror=null;this.src='images/default.jpg';">
      <div class="item-details">
        <h3>${item.name[lang]}</h3>
        <p>${item.desc[lang]}</p>
        <span class="price">${item.price.toFixed(2)} Birr</span>
      </div>
    `;

    container.appendChild(card);
  });

  if (!hasItems) {
    container.innerHTML = "<p>No items found matching your filters.</p>";
  }
}

/* ---------------- EVENTS ---------------- */
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(renderMenu, 300); // Debounce: wait 300ms
});

fastToggle.addEventListener("change", e => {
  fastMode = e.target.checked;
  renderMenu();
});

langSelect.addEventListener("change", e => {
  currentLang = e.target.value;
  renderMenu();
});