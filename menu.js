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

  // --- Data ---
  const LANG = { 
    en: {
      fastMode: "Fast Mode", 
      items: [
        // --- Lunch ---
        { id: 1, category: "lunch", name: "goredgored", desc: "ethiopian raw meat.", price: "80 birr", fastAllowed: false, img: "gordgord.jpg" },
        { id: 2, category: "lunch", name: "Tibs", desc: "Sautéed beef or lamb with onions and spices.", price: "140 Birr", fastAllowed: false, img: "tibes.jpg" },
        { id: 3, category: "lunch", name: "Doro Wot", desc: "Spicy chicken stew with boiled egg.", price: "160 Birr", fastAllowed: false, img: "doro wote.jpg" },
        { id: 4, category: "lunch", name: "minchet", desc: "Beef stew simmered in berbere sauce.", price: "130 Birr", fastAllowed: false, img: "menchet.jpg" },
        { id: 5, category: "lunch", name: "Kitfo", desc: "Minced raw beef seasoned with mitmita and butter.", price: "180 Birr", fastAllowed: false, img: "kitfo.jpg" },
        { id: 6, category: "lunch", name: "dulet", desc: "Minced raw beef seasoned with mitmita and butter.", price: "180 Birr", fastAllowed: false, img: "dulet.jpg" },
        { id: 7, category: "lunch", name: "tibes", desc: "Minced raw beef seasoned with mitmita and butter.", price: "180 Birr", fastAllowed: false, img: "tibes.jpg" },
        { id: 8, category: "lunch", name: "agelgel", desc: "Minced raw beef seasoned with mitmita and butter.", price: "180 Birr", fastAllowed: false, img: "agelgel.jpg" },




        // --- Fasting / Vegetarian ---
        { id: 9, category: "fasting", name: "shiro", desc: "Collard greens cooked with mild spices.", price: "70 Birr", fastAllowed: true, img: "shiro.jpg" },
        { id: 10, category: "fasting", name: "tegabino", desc: "Cabbage, carrots, and potatoes stew.", price: "80 Birr", fastAllowed: true, img: "tegabino.jpg" },
        { id: 11, category: "fasting", name: "Miser", desc: "Spicy red lentil stew with berbere.", price: "90 Birr", fastAllowed: true, img: "miser.jpg" },
        { id: 12, category: "fasting", name: "enjera firfir", desc: "Green beans and carrots cooked in tomato sauce.", price: "75 Birr", fastAllowed: true, img: "enjera fifir.jpg" },
        { id: 13, category: "fasting", name: "telba", desc: "Mild chickpea stew without berbere.", price: "70 Birr", fastAllowed: true, img: "telba.jpg" },

        // --- Drinks ---
        { id: 14, category: "drink", name: "cocacola", desc: "", price: "90 Birr", fastAllowed: true, img: "cola.jpg" },
        { id: 15, category: "drink", name: "ambo water", desc: "", price: "40 Birr", fastAllowed: true, img: "ambo water.jpg" },
        { id: 16, category: "drink", name: "sofi", desc: "", price: "20 Birr", fastAllowed: true, img: "sofi.jpg" },
        { id: 17, category: "drink", name: "water", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        { id: 18, category: "drink", name: "carrot juice", desc: "", price: "20 Birr", fastAllowed: true, img: "carrot juice.jpg" },
        { id: 19, category: "drink", name: "avaocado juice", desc: "", price: "20 Birr", fastAllowed: true, img: "avocado juice.jpg" },
        { id: 20, category: "drink", name: "papaya juice", desc: "", price: "20 Birr", fastAllowed: true, img: "papaya juice.jpg" },
        { id: 21, category: "drink", name: "orange juice", desc: "", price: "20 Birr", fastAllowed: true, img: "orange juice.jpg" },
        { id: 22, category: "drink", name: "water melon juice", desc: "", price: "20 Birr", fastAllowed: true, img: "melon.jpg" },
        { id: 23, category: "drink", name: "mango juice", desc: "", price: "20 Birr", fastAllowed: true, img: "mango juice.jpg" },
        { id: 24, category: "drink", name: "banana shake", desc: "", price: "20 Birr", fastAllowed: false, img: "banan shake.jpg" },
        { id: 25, category: "drink", name: "orange milk shake", desc: "", price: "20 Birr", fastAllowed: false, img: "orange milkshake.jpg" },
        { id: 26, category: "drink", name: "vanila milk shake", desc: "", price: "20 Birr", fastAllowed: false, img: "vanila milk sake.jpg" },

         // ---{ id: 27, category: "drink", name: "Water", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        // --- { id: 28, category: "drink", name: "Water", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        
        
        

        // --- Hot Drinks ---
        { id: 29, category: "hotdrink", name: "Coffee", desc: "Traditional Ethiopian coffee.", price: "25 Birr", fastAllowed: true, img: "coffee.jpg" },
        { id: 30, category: "hotdrink", name: "Tea", desc: "Black tea served with or without sugar.", price: "20 Birr", fastAllowed: true, img: "tea.jpg" },
        { id: 31, category: "hotdrink", name: "Macchiato", desc: "Espresso with milk foam.", price: "35 Birr", fastAllowed: false, img: "machaito.jpg" },
        { id: 32, category: "hotdrink", name: "coffee", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "coffee.jpg" },
        { id: 33, category: "hotdrink", name: "espreso", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "espresso.jpg" },
        { id: 34, category: "hotdrink", name: "ginger tea", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "ginger tea.jpg" },
        { id: 35, category: "hotdrink", name: "peanut", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "peanut tea.jpg" },
        { id: 36, category: "hotdrink", name: "milk", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: false, img: "milk.jpg" },
        

        // --- Breakfast ---
        { id: 20, category: "breakfast", name: "Chechebsa", desc: "Flatbread mixed with spiced butter and berbere.", price: "70 Birr", fastAllowed: true, img: "chechebesa.jpg" },
        { id: 21, category: "breakfast", name: "Fetira", desc: "Shredded injera mixed with spicy sauce.", price: "90 Birr", fastAllowed: false, img: "fetira.jpg" },
        { id: 22, category: "breakfast", name: "Ful", desc: "Mashed fava beans with olive oil and peppers.", price: "80 Birr", fastAllowed: false, img: "ful.jpg" },
        { id: 23, category: "breakfast", name: "Scrambled", desc: "Eggs cooked with tomato and onion.", price: "70 Birr", fastAllowed: false, img: "scrambled.jpg" }
      ]
    },

    // --- Amharic Version ---
    am: {
      fastMode: "ፋስት ሞድ",
      items: [
        // --- Lunch ---
        { id: 1, category: "lunch", name: "ጎረድጎድ", desc: "", price: "80 birr", fastAllowed: false, img: "gordgord.jpg" },
        { id: 2, category: "lunch", name: "ጥብስ", desc: "", price: "140 Birr", fastAllowed: false, img: "tibes.jpg" },
        { id: 3, category: "lunch", name: "ዶሮ ወጥ", desc: "", price: "160 Birr", fastAllowed: false, img: "doro wote.jpg" },
        { id: 4, category: "lunch", name: "ምንቸት ", desc: "", price: "130 Birr", fastAllowed: false, img: "menchet.jpg" },
        { id: 5, category: "lunch", name: "ክትፎ", desc: "", price: "180 Birr", fastAllowed: false, img: "kitfo.jpg" },
        { id: 6, category: "lunch", name: "ዱለት", desc: "", price: "180 Birr", fastAllowed: false, img: "dulet.jpg" },
        { id: 7, category: "lunch", name: "tibes", desc: "", price: "180 Birr", fastAllowed: false, img: "tibes.jpg" },
        { id: 8, category: "lunch", name: "አግልግል", desc: "", price: "180 Birr", fastAllowed: false, img: "agelgel.jpg" },




        // --- Fasting / Vegetarian ---
        { id: 9, category: "fasting", name: "ሽሮ", desc: "", price: "70 Birr", fastAllowed: true, img: "shiro.jpg" },
        { id: 10, category: "fasting", name: "ተጋቢኖ", desc: "", price: "80 Birr", fastAllowed: true, img: "tegabino.jpg" },
        { id: 11, category: "fasting", name: "ምስር", desc: "", price: "90 Birr", fastAllowed: true, img: "miser.jpg" },
        { id: 12, category: "fasting", name: "እንጀራ ፍርፍር", desc: "", price: "75 Birr", fastAllowed: true, img: "enjera fifir.jpg" },
        { id: 13, category: "fasting", name: "ተልባ", desc: "", price: "70 Birr", fastAllowed: true, img: "telba.jpg" },

        // --- Drinks ---
        { id: 14, category: "drink", name: "ኮካ", desc: "", price: "90 Birr", fastAllowed: true, img: "cola.jpg" },
        { id: 15, category: "drink", name: "አምቦ ውሃ", desc: "", price: "40 Birr", fastAllowed: true, img: "ambo water.jpg" },
        { id: 16, category: "drink", name: "ሶፊ", desc: "", price: "40 Birr", fastAllowed: true, img: "sofi.jpg" },
        { id: 17, category: "drink", name: "ዉሃ", desc: "", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        { id: 18, category: "drink", name: "ካሮት ጁስ", desc: "", price: "20 Birr", fastAllowed: true, img: "carrot juice.jpg" },
        { id: 19, category: "drink", name: "አቮካዶ ጁስ", desc: "", price: "100 Birr", fastAllowed: true, img: "avocado juice.jpg" },
        { id: 20, category: "drink", name: "ፓፓዬ ጁስ", desc: "", price: "100 Birr", fastAllowed: true, img: "papaya juice.jpg" },
        { id: 21, category: "drink", name: "ብርቱካን ጁስ", desc: "", price: "20 Birr", fastAllowed: true, img: "orange juice.jpg" },
        { id: 22, category: "drink", name: "ሀብሀብ ጁስ", desc: "", price: "100 Birr", fastAllowed: true, img: "melon.jpg" },
        { id: 23, category: "drink", name: "ማንጎ ጅስ", desc: "", price: "100 Birr", fastAllowed: true, img: "mango juice.jpg" },
        { id: 24, category: "drink", name: "ሙዝ ሸክ", desc: "", price: "100 Birr", fastAllowed: false, img: "banan shake.jpg" },
        { id: 25, category: "drink", name: "ብርቱካን ሸክ", desc: "", price: "100 Birr", fastAllowed: false, img: "orange milkshake.jpg" },
        { id: 26, category: "drink", name: "ቫኒላ ሸክ", desc: "", price: "100 Birr", fastAllowed: false, img: "vanila milk sake.jpg" },

         // ---{ id: 27, category: "drink", name: "Water", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        // --- { id: 28, category: "drink", name: "Water", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "water.jpg" },
        
        
        

        // --- Hot Drinks ---
        { id: 29, category: "hotdrink", name: "ቡና", desc: "", price: "35 Birr", fastAllowed: true, img: "coffee.jpg" },
        { id: 30, category: "hotdrink", name: "ሻይ", desc: "", price: "20 Birr", fastAllowed: true, img: "tea.jpg" },
        { id: 31, category: "hotdrink", name: "ማኪያቶ", desc: "", price: "35 Birr", fastAllowed: false, img: "machaito.jpg" },
        // ---{ id: 32, category: "hotdrink", name: "coffee", desc: "Bottled mineral water.", price: "20 Birr", fastAllowed: true, img: "coffee.jpg" } ---
        { id: 33, category: "hotdrink", name: "እስፕሬሶ", desc: "", price: "40 Birr", fastAllowed: true, img: "espresso.jpg" },
        { id: 34, category: "hotdrink", name: "ዝንጅብል ሻይ", desc: "", price: "20 Birr", fastAllowed: true, img: "ginger tea.jpg" },
        { id: 35, category: "hotdrink", name: "ለውዝ", desc: "", price: "20 Birr", fastAllowed: true, img: "peanut tea.jpg" },
        { id: 36, category: "hotdrink", name: "ወተት", desc: "ወተት", price: "20 Birr", fastAllowed: false, img: "milk.jpg" },
        

        // --- Breakfast ---
        { id: 20, category: "breakfast", name: "ጨጨብሳ", desc: "", price: "70 Birr", fastAllowed: true, img: "chechebesa.jpg" },
        { id: 21, category: "breakfast", name: "ፈጢራ", desc: "", price: "90 Birr", fastAllowed: false, img: "fetira.jpg" },
        { id: 22, category: "breakfast", name: "ፉል", desc: "", price: "80 Birr", fastAllowed: false, img: "ful.jpg" },
        { id: 23, category: "breakfast", name: "እንቁላል", desc: "", price: "70 Birr", fastAllowed: false, img: "scrambled.jpg" }
      ]
    }
  };

  let currentLang = "en";
  let fastMode = false;

  function renderMenu() {
  const data = LANG[currentLang].items;
  const searchTerm = searchInput.value.toLowerCase();

  // ✅ Clear all sections before rendering
  [menuList, lunchList, drinkList, fastingList, hotdrinkList, breakfastList].forEach(list => {
    if (list) list.innerHTML = "";
  });

  // ✅ Define this only once outside the loop
  function createMenuItem(item) {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="images/${item.img}" alt="${item.name}" class="images-img"/>
      <div class="menu-text">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <span class="price">${item.price}</span>
      </div>
    `;
    return div;
  }

  // ✅ Loop through each item only once
  data.forEach(item => {
    if (fastMode && !item.fastAllowed) return;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return;

    const allMenuItem = createMenuItem(item);
    menuList.appendChild(allMenuItem); // Add to All Menu

    const categoryItem = createMenuItem(item); // For individual category
    switch (item.category) {
      case "lunch":
        lunchList.appendChild(categoryItem);
        break;
      case "drink":
        drinkList.appendChild(categoryItem);
        break;
      case "fasting":
        fastingList.appendChild(categoryItem);
        break;
      case "hotdrink":
        hotdrinkList.appendChild(categoryItem);
        break;
      case "breakfast":
        breakfastList.appendChild(categoryItem);
        break;
    }
  });
}


  // --- Event Listeners ---
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

  // --- Smooth Scroll ---
  window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // --- Initial Render ---
  renderMenu();
});




import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const menuCol = collection(db, "menu");

getDocs(menuCol).then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    const container = document.getElementById("menuContainer");
    container.innerHTML += `
      <div class="menu-item">
        <h3>${data.name}</h3>
        <p>${data.price} ETB</p>
      </div>
    `;
  });
});















