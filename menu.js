// menu.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAlHN3EWZnMOXfa0RNWN6WpE9nrkivACs0",
  authDomain: "cafe-menu-5358e.firebaseapp.com",
  projectId: "cafe-menu-5358e",
  storageBucket: "cafe-menu-5358e.firebasestorage.app",
  messagingSenderId: "665214189728",
  appId: "1:665214189728:web:d9ba3ff01681c06124c9c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // --- Element references ---
  const langSelect = document.getElementById("langSelect");
  const fastToggle = document.getElementById("fastToggle");
  const fastToggleLabel = document.getElementById("fastToggleLabel");
  const searchInput = document.getElementById("searchInput");

  const menuList = document.getElementById("menuList");
  const lunchList = document.getElementById("lunchList");
  const drinkList = document.getElementById("drinkList");
  const fastingList = document.getElementById("fastingList");
  const hotdrinkList = document.getElementById("hotdrinkList");
  const breakfastList = document.getElementById("breakefastList");

  let menuItems = [];  // Store fetched items
  let fastMode = false;

  // --- Language Labels ---
  const LANG = {
    en: { fastMode: "Fast Mode" },
    am: { fastMode: "ፋስት ሞድ" }
  };
  let currentLang = "en";
  fastToggleLabel.textContent = LANG[currentLang].fastMode;

  // --- Fetch menu from Firebase in real-time ---
  function subscribeMenuUpdates() {
    const menuCol = collection(db, "menu");
    onSnapshot(menuCol, snapshot => {
      menuItems = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        // 🔹 FILTER OUT INACTIVE ITEMS
        if (data.active === false) return;  // <-- FIXED: skip OFF items
        menuItems.push({
          id: docSnap.id,
          category: data.category,
          name: data.name,
          desc: data.desc || "",
          price: data.price + " Birr",
          fastAllowed: data.fastAllowed || false,
          img: data.img
        });
      });
      renderMenu(); // Re-render menu when data changes
    });
  }

  // --- Render menu function ---
  function renderMenu() {
    const searchTerm = searchInput.value.toLowerCase();

    // Clear all sections
    [menuList, lunchList, drinkList, fastingList, hotdrinkList, breakfastList].forEach(list => {
      if (list) list.innerHTML = "";
    });

    menuItems.forEach(item => {
      if (fastMode && !item.fastAllowed) return;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return;

      const el = document.createElement("div");
      el.className = "menu-item";
      el.innerHTML = `
        <img src="images/${item.img}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <span>${item.price}</span>
        </div>
      `;

      // Append to all menu
      menuList.appendChild(el.cloneNode(true));

      // Append to category
      switch (item.category) {
        case "lunch": lunchList.appendChild(el.cloneNode(true)); break;
        case "drink": drinkList.appendChild(el.cloneNode(true)); break;
        case "fasting": fastingList.appendChild(el.cloneNode(true)); break;
        case "hotdrink": hotdrinkList.appendChild(el.cloneNode(true)); break;
        case "breakfast": breakfastList.appendChild(el.cloneNode(true)); break;
      }
    });
  }

  // --- Event listeners ---
  langSelect.addEventListener("change", () => {
    currentLang = langSelect.value;
    fastToggleLabel.textContent = LANG[currentLang].fastMode;
    renderMenu();
  });

  fastToggle.addEventListener("change", () => {
    fastMode = fastToggle.checked;
    renderMenu();
  });

  searchInput.addEventListener("input", renderMenu);

  // Smooth scroll helper
  window.scrollToSection = id => {
    const sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  // --- Start subscription ---
  subscribeMenuUpdates();
});
 