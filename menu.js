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

  const langSelect = document.getElementById("langSelect");
  const fastToggle = document.getElementById("fastToggle");
  const fastToggleLabel = document.getElementById("fastToggleLabel");
  const searchInput = document.getElementById("searchInput");
  const navButtons = document.querySelectorAll(".bottom-nav button");

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
  let currentLang = "en";

  /* ---------- LANGUAGE TEXT ---------- */
  const LANG = {
    en: {
      fastMode: "Fast Mode",
      section: {
        lunch: "Lunch",
        fasting: "Fasting",
        drink: "Drinks",
        hotdrink: "Hot Drinks",
        breakfast: "Breakfast"
      },
      aboutTitle: "About Us",
      aboutDesc: "We offer a seamless QR-based digital menu experience. Browse, order, and enjoy — all from your device.",
      paymentTitle: "Payment Methods"
    },
    am: {
      fastMode: "የጾም ምግቦች",
      section: {
        lunch: "ምሳ",
        fasting: "የጾም ምግቦች",
        drink: "መጠጦች",
        hotdrink: "ትኩስ መጠጦች",
        breakfast: "ቁርስ"
        
        
        
      },
      aboutTitle: "ስለ እኛ",
      paymentTitle: "የክፍያ ዘዴዎች"
    }
  };

  /* ---------- CATEGORY NORMALIZER ---------- */
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
    return CATEGORY_MAP[raw.trim().toLowerCase()] || null;
  }

  /* ---------- FIRESTORE ---------- */
  function subscribeMenuUpdates() {
    onSnapshot(collection(db, "menu"), snapshot => {
      menuItems = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.active === false) return;

        const category = normalizeCategory(data.category);
        if (!category) return;

        menuItems.push({
          id: docSnap.id,
          category,
          name: { en: data.name || "", am: data.nameAm || data.name || "" },
          desc: { en: data.desc || "", am: data.descAm || data.desc || "" },
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

    Object.values(sections).forEach(sec => sec.innerHTML = "");

    menuItems.forEach(item => {
      if (fastMode && !item.fastAllowed) return;
      if (searchTerm && !item.name[currentLang].toLowerCase().includes(searchTerm)) return;

      const card = document.createElement("div");
      card.className = "menu-item";
      card.innerHTML = `
        <img src="images/${item.img}" alt="${item.name[currentLang]}" loading="lazy">
        <div class="menu-info">
          <h3>${item.name[currentLang]}</h3>
          <p>${item.desc[currentLang]}</p>
          <span class="price">${item.price}</span>
        </div>
      `;

      sections.all?.appendChild(card.cloneNode(true));
      sections[item.category]?.appendChild(card);
    });

    // Update section buttons
    navButtons.forEach(btn => {
      const key = btn.dataset.key;
      btn.textContent = LANG[currentLang].section[key] || key;
    });

    // Update footer
    document.querySelector("[data-key='aboutTitle']").textContent = LANG[currentLang].aboutTitle;
    document.querySelector("[data-key='aboutDesc']").textContent = LANG[currentLang].aboutDesc;
    document.querySelector("[data-key='paymentTitle']").textContent = LANG[currentLang].paymentTitle;
  }

  /* ---------- EVENTS ---------- */
  langSelect?.addEventListener("change", () => {
    currentLang = langSelect.value;
    fastToggleLabel.textContent = LANG[currentLang].fastMode;
    renderMenu();
  });

  fastToggle?.addEventListener("change", () => {
    fastMode = fastToggle.checked;
    renderMenu();
  });

  searchInput?.addEventListener("input", renderMenu);

  /* ---------- SCROLL ---------- */
  window.scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const headerHeight = document.querySelector(".menu-header")?.offsetHeight || 0;
    const navHeight = document.querySelector(".bottom-nav")?.offsetHeight || 0;
    const y = section.getBoundingClientRect().top + window.pageYOffset - (headerHeight + navHeight + 10);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* ---------- START ---------- */
  subscribeMenuUpdates();
});
