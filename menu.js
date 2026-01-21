import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* ---------------- FIREBASE CONFIG ---------------- */
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

/* ---------------- DOM READY ---------------- */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- ELEMENTS ---------- */
  const langSelect = document.getElementById("langSelect");
  const fastToggle = document.getElementById("fastToggle");
  const fastToggleLabel = document.getElementById("fastToggleLabel");
  const searchInput = document.getElementById("searchInput");

  const sections = {
    all: document.getElementById("menuList"),
    lunch: document.getElementById("lunchList"),
    fasting: document.getElementById("fastingList"),
    drink: document.getElementById("drinkList"),
    hotdrink: document.getElementById("hotdrinkList"),
    breakfast: document.getElementById("breakfastList")
  };

  let menuItems = [];
  let fastMode = false;

  /* ---------- LANGUAGE ---------- */
  const LANG = {
    en: { fastMode: "Fast Mode" },
    am: { fastMode: "ፋስት ሞድ" }
  };

  fastToggleLabel.textContent = LANG.en.fastMode;

  /* ---------- CATEGORY NORMALIZER (CRITICAL FIX) ---------- */
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

  function normalizeCategory(raw) {
    if (!raw) return null;
    const key = raw.trim().toLowerCase();
    return CATEGORY_MAP[key] || null;
  }

  /* ---------- FIRESTORE LISTENER ---------- */
  function subscribeMenuUpdates() {
    const menuCol = collection(db, "menu");

    onSnapshot(menuCol, snapshot => {
      menuItems = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();

        // ✅ SAFE active check (does NOT hide missing field)
        if (data.active === false) return;

        const category = normalizeCategory(data.category);
        if (!category) return; // skip invalid categories

        menuItems.push({
          id: docSnap.id,
          category,
          name: data.name || "",
          desc: data.desc || "",
          price: typeof data.price === "number" ? `${data.price} Birr` : "",
          fastAllowed: Boolean(data.fastAllowed),
          img: data.img || "placeholder.jpg"
        });
      });

      renderMenu();
    });
  }

  /* ---------- RENDER MENU ---------- */
  function renderMenu() {
    const searchTerm = searchInput.value.toLowerCase();

    Object.values(sections).forEach(sec => {
      if (sec) sec.innerHTML = "";
    });

    menuItems.forEach(item => {
      if (fastMode && !item.fastAllowed) return;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return;

      const card = document.createElement("div");
      card.className = "menu-item";
      card.innerHTML = `
        <img src="images/${item.img}" alt="${item.name}" loading="lazy">
        <div class="menu-info">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <span class="price">${item.price}</span>
        </div>
      `;

      // All menu
      sections.all?.appendChild(card.cloneNode(true));

      // Category menu
      sections[item.category]?.appendChild(card);
    });
  }

  /* ---------- EVENTS ---------- */
  langSelect?.addEventListener("change", () => {
    fastToggleLabel.textContent = LANG[langSelect.value].fastMode;
  });

  fastToggle?.addEventListener("change", () => {
    fastMode = fastToggle.checked;
    renderMenu();
  });

  searchInput?.addEventListener("input", renderMenu);

  /* ---------- SCROLL FIX ---------- */
  window.scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const headerHeight = document.querySelector(".menu-header")?.offsetHeight || 0;
    const navHeight = document.querySelector(".bottom-nav")?.offsetHeight || 0;

    const y =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      (headerHeight + navHeight + 10);

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* ---------- START ---------- */
  subscribeMenuUpdates();
});
