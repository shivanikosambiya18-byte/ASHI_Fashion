// SEARCH
document.getElementById('searchIcon').addEventListener('click', function(){
  document.getElementById('searchBox').classList.toggle('open');
  document.getElementById('searchInput').focus();
});

// USER
document.addEventListener("DOMContentLoaded", function(){
  let user = localStorage.getItem("userName");
  if(user){
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("userName").style.display = "inline";
    document.getElementById("userName").innerText = "Hello, " + user;
    document.querySelector(".logout").style.display = "block";
  }
  updateCartUI();
});
function logout(){ localStorage.removeItem("userName"); location.reload(); }

// OCCASION TABS
function setOccasion(el, type){
  document.querySelectorAll('.occ-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const map = { wedding:'sherwani', sangeet:'kurta', haldi:'kurta', reception:'indo', festival:'kurta', casual:'kurta', party:'indo', all:'all' };
  filterProducts(map[type] || 'all', null);
}

// FILTER
function filterProducts(cat, btn){
  if(btn){
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const cards = document.querySelectorAll('.men-product-card');
  let count = 0;
  cards.forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? 'block' : 'none';
    if(show) count++;
  });
  document.getElementById('productCount').innerText = count;
}

// CATEGORY BAR
function filterByCategory(cat){
  filterProducts(cat, null);
  document.getElementById('mens-products').scrollIntoView({behavior:'smooth'});
}

// SORT
function sortMenProducts(val){
  const grid = document.getElementById('menProductGrid');
  const cards = Array.from(grid.querySelectorAll('.men-product-card'));
  if(val === 'low') cards.sort((a,b) => +a.dataset.price - +b.dataset.price);
  if(val === 'high') cards.sort((a,b) => +b.dataset.price - +a.dataset.price);
  if(val === 'az') cards.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
  cards.forEach(c => grid.appendChild(c));
}

// WISHLIST HEART
function toggleHeart(el){
  el.classList.toggle('active');
  el.style.color = el.classList.contains('active') ? '#e74c3c' : '#888';
}

// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartUI(){
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  if(cartCount) cartCount.innerText = cart.reduce((t,i) => t + i.quantity, 0);
  if(!cartItems) return;
  if(cart.length === 0){
    cartItems.innerHTML = `<div style="text-align:center;margin-top:80px;color:#888;"><div style="font-size:50px;">🛒</div><h4>Cart is Empty</h4><p>Add items to start shopping</p></div>`;
    return;
  }
  cartItems.innerHTML = cart.map((item,i) => `
    <div class="cart-item-row">
      <img class="cart-item-img" src="${item.image}">
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:500;">${item.title}</div>
        <div style="font-size:14px;color:#b77b4b;font-weight:700;">${item.price}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <button onclick="changeQty(${i},-1)" style="width:24px;height:24px;border:1px solid #ddd;background:#f5f5f5;cursor:pointer;">-</button>
          <span style="font-weight:600;">${item.quantity}</span>
          <button onclick="changeQty(${i},1)" style="width:24px;height:24px;border:1px solid #ddd;background:#f5f5f5;cursor:pointer;">+</button>
        </div>
      </div>
      <span onclick="removeItem(${i})" style="cursor:pointer;color:#aaa;font-size:18px;">✕</span>
    </div>
  `).join('');
}

function addToCart(e, title, price, image){
  e.stopPropagation();
  let existing = cart.find(i => i.title === title);
  if(existing) existing.quantity++;
  else cart.push({title, price, image, quantity:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
  const btn = e.target;
  const orig = btn.innerText;
  btn.innerText = "✓ ADDED!";
  btn.style.background = "#b77b4b";
  btn.style.color = "white";
  setTimeout(() => { btn.innerText = orig; btn.style.background = "white"; btn.style.color = "black"; }, 1500);
}

function changeQty(i, d){
  cart[i].quantity += d;
  if(cart[i].quantity <= 0) cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function removeItem(i){
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// SCROLL SHADOW
window.addEventListener('scroll', () => {
  document.querySelector('.header').style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
});
