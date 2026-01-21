// menu.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* ---------------- FIREBASE CONFIG ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAlHN3EWZnMOXfa0RNWN6WpE9nrkivACs0",
  authDomain: "cafe-menu-5358e.firebaseapp.com",
  projectId: "cafe-menu-5358e",
  storageBucket: "cafe-menu-5358e.appspot.com", // ✅ FIXED
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
    drink: document.getElementById("drinkList"),
    fasting: document.getElementById("fastingList"),
    hotdrink: document.getElementById("hotdrinkList"),
    breakfast: document.getElementById("breakfastList") // ✅ FIXED ID
  };

  let menuItems = [];
  let fastMode = false;

  /* ---------- LANGUAGE ---------- */
  const LANG = {
    en: { fastMode: "Fast Mode" },
    am: { fastMode: "ፋስት ሞድ" }
  };

  let currentLang = "en";
  fastToggleLabel.textContent = LANG[currentLang].fastMode;

  /* ---------- FIREBASE LISTENER ---------- */
  function subscribeMenuUpdates() {
    const menuCol = collection(db, "menu");

    onSnapshot(menuCol, snapshot => {
      menuItems = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.active === false) return;

        menuItems.push({
          id: docSnap.id,
          category: data.category,
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

  /* ---------- RENDER ---------- */
  function renderMenu() {
    const searchTerm = searchInput.value.toLowerCase();

    Object.values(sections).forEach(sec => {
      if (sec) sec.innerHTML = "";
    });

    menuItems.forEach(item => {
      if (fastMode && !item.fastAllowed) return;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return;

      const el = document.createElement("div");
      el.className = "menu-item";
      el.innerHTML = `
        <img src="images/${item.img}" alt="${item.name}" loading="lazy">
        <div class="menu-info">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <span class="price">${item.price}</span>
        </div>
      `;

      if (sections.all) sections.all.appendChild(el.cloneNode(true));
      if (sections[item.category]) sections[item.category].appendChild(el);
    });
  }

  /* ---------- EVENTS ---------- */
  langSelect?.addEventListener("change", () => {
    currentLang = langSelect.value;
    fastToggleLabel.textContent = LANG[currentLang].fastMode;
  });

  fastToggle?.addEventListener("change", () => {
    fastMode = fastToggle.checked;
    renderMenu();
  });

  searchInput?.addEventListener("input", renderMenu);

  window.scrollToSection = id => {
    const sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- START ---------- */
  subscribeMenuUpdates();
});
