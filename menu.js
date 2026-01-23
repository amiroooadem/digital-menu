import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* FIREBASE */
const app = initializeApp({
  apiKey: "AIzaSyAlHN3EWZnMOXfa0RNWN6WpE9nrkivACs0",
  authDomain: "cafe-menu-5358e.firebaseapp.com",
  projectId: "cafe-menu-5358e"
});
const db = getFirestore(app);

/* STATE */
let menuItems = [];
let fastMode = false;
let currentLang = "en";

/* DOM */
const pages = document.querySelectorAll(".page");
const categoryGrid = document.getElementById("categoryGrid");
const searchInput = document.getElementById("searchInput");
const backBtn = document.getElementById("backBtn");
const breadcrumb = document.getElementById("breadcrumb");

const sections = {
  lunch: document.getElementById("lunchList"),
  drink: document.getElementById("drinkList"),
  breakfast: document.getElementById("breakfastList"),
  hotdrink: document.getElementById("hotdrinkList"),
  fasting: document.getElementById("fastingList"),
  dessert: document.getElementById("dessertList")
};

const CATEGORY_NAMES = {
  lunch: { en: "Lunch", am: "ምሳ" },
  drink: { en: "Drinks", am: "መጠጦች" },
  breakfast: { en: "Breakfast", am: "ቁርስ" },
  hotdrink: { en: "Hot Drinks", am: "ትኩስ መጠጦች" },
  fasting: { en: "Fasting", am: "የጾም" },  
  dessert: { en: "Desserts", am: "ኬክ" }
};

/* NORMALIZE CATEGORY */
const CATEGORY_MAP = {
  lunch:"lunch", lunches:"lunch",
  breakfast:"breakfast", "break fast":"breakfast",
  drink:"drink", drinks:"drink",
  hotdrink:"hotdrink", "hot drink":"hotdrink", "hot drinks":"hotdrink",
  fasting:"fasting", fast:"fasting",
  dessert:"dessert", desserts:"dessert", sweet:"dessert"
};

/* TRANSLATIONS */
const translations = {
  en: {}, // English is default from Firebase
  am: {}  // Fill dynamically after fetch
};

/* OPEN CATEGORY */
window.openCategory = (cat)=>{
  pages.forEach(p=>p.classList.remove("active"));
  const page = document.getElementById(cat);
  if(!page) return;
  page.classList.add("active");

  backBtn.style.display = (cat==="home") ? "none":"flex";
  breadcrumb.textContent = (cat==="home") ? "" : "Home / " + CATEGORY_NAMES[cat][currentLang];

  if(cat!=="home") renderMenu();
};

/* SMART BACK */
window.smartBack = ()=>{
  const active = document.querySelector(".page.active").id;
  if(active!=="home") openCategory("home");
};

/* BACK BUTTON EVENT */
backBtn.addEventListener("click", smartBack);

/* SWIPE RIGHT TO GO BACK */
let startX=0;
document.addEventListener("touchstart", e=> startX=e.touches[0].clientX);
document.addEventListener("touchend", e=>{
  if(e.changedTouches[0].clientX - startX > 80){
    const active = document.querySelector(".page.active");
    if(active.id!=="home") smartBack();
  }
});

/* FIREBASE FETCH */
onSnapshot(collection(db,"menu"), snapshot=>{
  menuItems = [];
  snapshot.forEach(doc=>{
    const d = doc.data();
    if(d.active===false) return;
    const cat = CATEGORY_MAP[d.category?.toLowerCase()] || null;
    if(!cat) return;

    // Store translations
    translations.am[d.name] = d.amName || d.name; // fallback to English if Amharic missing
    translations.am[d.desc] = d.amDesc || d.desc;

    menuItems.push({
      category: cat,
      name: d.name || "Unnamed",
      desc: d.desc || "",
      price: d.price || 0,
      fastAllowed: !!d.fastAllowed,
      img: d.img || "default.jpg",
      amName: d.amName || d.name,
      amDesc: d.amDesc || d.desc
    });
  });
  renderHome();
});

/* RENDER HOME GRID */
function renderHome(){
  categoryGrid.innerHTML="";
  Object.keys(CATEGORY_NAMES).forEach(cat=>{
    const firstItem = menuItems.find(m=>m.category===cat);
    const card=document.createElement("div");
    card.className="category-card";
    card.innerHTML=`<img src="images/${firstItem?.img || 'default.jpg'}" alt=""><span>${CATEGORY_NAMES[cat][currentLang]}</span>`;
    card.onclick=()=>openCategory(cat);
    categoryGrid.appendChild(card);
  });
}

/* RENDER MENU ITEMS */
function renderMenu(){
  const active = document.querySelector(".page.active").id;
  const container = sections[active];
  container.innerHTML="";
  const term = searchInput.value.toLowerCase();

  menuItems.forEach(item=>{
    if(item.category!==active) return;
    if(fastMode && !item.fastAllowed) return;

    // search in correct language
    const nameToCheck = currentLang==="am" ? item.amName : item.name;
    if(term && !nameToCheck.toLowerCase().includes(term)) return;

    const el = document.createElement("div");
    el.className="menu-item";
    el.innerHTML=`
      <img src="images/${item.img}">
      <div class="item-details">
        <h3>${currentLang==="am" ? item.amName : item.name}</h3>
        <p>${currentLang==="am" ? item.amDesc : item.desc}</p>
        <span class="price">${item.price} Birr</span>
      </div>
    `;
    container.appendChild(el);
  });
}

/* SEARCH + FAST MODE EVENTS */
searchInput.addEventListener("input", ()=>renderMenu());
document.getElementById("fastToggle").addEventListener("change", e=>{
  fastMode=e.target.checked;
  renderMenu();
});
document.getElementById("langSelect").addEventListener("change", e=>{
  currentLang=e.target.value;
  renderHome(); // update home grid
  renderMenu(); // update category page
});
