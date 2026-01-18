// menu.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAlHN3EWZnMOXfa0RNWN6WpE9nrkivACs0",
  authDomain: "cafe-menu-5358e.firebaseapp.com",
  projectId: "cafe-menu-5358e",
  storageBucket: "cafe-menu-5358e.firebasestorage.app",
  messagingSenderId: "665214189728",
  appId: "1:665214189728:web:d9ba3ff01681c06124c9c5"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const menuList = document.getElementById("menuList");
const sections = {
  lunch: document.getElementById("lunchList"),
  fasting: document.getElementById("fastingList"),
  drink: document.getElementById("drinkList"),
  hotdrink: document.getElementById("hotdrinkList"),
  breakfast: document.getElementById("breakefastList"),
};

let menuData = [];
let currentLang = "en";
let fastMode = false;

// Load menu from Firestore
async function loadMenu() {
  const snapshot = await getDocs(collection(db, "menu"));
  menuData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderMenu();
}

function renderMenu() {
  Object.values(sections).forEach(s => s.innerHTML = "");
  menuList.innerHTML = "";

  menuData.forEach(item => {
    if (fastMode && !item.fastAllowed) return;

    const name = item.name[currentLang];
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="images/${item.img}" />
      <div>
        <h3>${name}</h3>
        <p>${item.desc?.[currentLang] || ""}</p>
        <span>${item.price} Birr</span>
      </div>
    `;

    menuList.appendChild(div);
    sections[item.category]?.appendChild(div.cloneNode(true));
  });
}

// Events
document.getElementById("langSelect").addEventListener("change", e => {
  currentLang = e.target.value;
  renderMenu();
});

document.getElementById("fastToggle").addEventListener("change", e => {
  fastMode = e.target.checked;
  renderMenu();
});

loadMenu();
