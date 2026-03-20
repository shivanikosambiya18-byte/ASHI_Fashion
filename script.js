/* ===== SCROLL REVEAL ENGINE ===== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve - allow re-animation on some elements
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ===== ANIMATED COUNTER ===== */
function animateCounter() {
  const counterEl = document.getElementById('counter');
  if (!counterEl) return;

  const target = 10000;
  const duration = 2500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    counterEl.textContent = current.toLocaleString('en-IN');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  // Start counter when trust section is visible
  const trustSection = document.querySelector('.trust-section');
  if (trustSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(update);
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(trustSection);
  }
}

/* ===== HEADER SHADOW ON SCROLL ===== */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ===== BACK TO TOP BUTTON ===== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== SEARCH BAR ===== */
document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchIcon = document.getElementById("searchIcon");
  const searchInput = document.getElementById("searchInput");

  if (searchIcon && searchBox && searchInput) {
    searchIcon.addEventListener("click", function () {
      searchBox.classList.toggle("open");
      if (searchBox.classList.contains("open")) {
        searchInput.focus();
      }
    });

    // Close search on scroll
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        searchBox.classList.remove("open");
      }
    });

    // Close on click outside
    document.addEventListener("click", function (e) {
      if (!searchBox.contains(e.target)) {
        searchBox.classList.remove("open");
      }
    });
  }
});

/* ===== LIKE BUTTON (WISHLIST) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const hearts = document.querySelectorAll(".heart-icon");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  hearts.forEach(heart => {
    const id = heart.getAttribute("data-id");

    if (favorites.includes(id)) {
      heart.classList.add("active");
    }

    heart.addEventListener("click", function (e) {
      e.stopPropagation();
      heart.classList.toggle("active");

      if (heart.classList.contains("active")) {
        if (!favorites.includes(id)) favorites.push(id);
        // Micro-feedback
        showToast("Added to wishlist ♥");
      } else {
        favorites = favorites.filter(item => item !== id);
        showToast("Removed from wishlist");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });
});

/* ===== TOAST NOTIFICATION ===== */
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 30px;
    background: rgba(26,26,26,0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 13px;
    letter-spacing: 0.5px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(toast);

  // Add animation keyframes if not already added
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastIn { from { opacity:0; transform:translateY(20px) scale(0.9); } to { opacity:1; transform:translateY(0) scale(1); } }
      @keyframes toastOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-10px); } }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/* ===== RIGHT SIDE AUTO SLIDER (Ken Burns) ===== */
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function changeSlide() {
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

if (slides.length) {
  setInterval(changeSlide, 4000);
}

/* ===== VIDEO SLIDER (Shop The Look) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".look-item");
  const nextBtn = document.querySelector(".arrow.right");
  const prevBtns = document.querySelectorAll(".arrow.left");

  if (!items.length || !nextBtn) return;

  let current = 3;

  function updateSlider() {
    items.forEach((item, i) => {
      item.classList.remove("active");
      const video = item.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    items[current].classList.add("active");
    const activeVideo = items[current].querySelector("video");
    if (activeVideo) {
      activeVideo.play().catch(() => { });
    }
  }

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % items.length;
    updateSlider();
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      current = (current - 1 + items.length) % items.length;
      updateSlider();
    });
  });

  updateSlider();

  // Auto-advance video slider every 5 seconds
  setInterval(() => {
    current = (current + 1) % items.length;
    updateSlider();
  }, 5000);
});

/* ===== SHOW USERNAME AFTER REGISTER ===== */
document.addEventListener("DOMContentLoaded", function () {
  let user = localStorage.getItem("userName");
  let registerBtn = document.getElementById("registerBtn");
  let userNameSpan = document.getElementById("userName");
  let logoutBtn = document.querySelector(".logout");

  if (!registerBtn || !userNameSpan || !logoutBtn) return;

  if (user) {
    registerBtn.style.display = "none";
    userNameSpan.style.display = "inline";
    userNameSpan.innerText = "Hello, " + user;
    logoutBtn.style.display = "block";
  } else {
    registerBtn.style.display = "inline";
    userNameSpan.style.display = "none";
    logoutBtn.style.display = "none";
  }
});

/* ===== LOGOUT BUTTON ===== */
function logout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("authToken");
  location.reload();
}

/* ===== CART FEATURE ===== */
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCount = document.getElementById("cartCount");
  let cartItemsContainer = document.getElementById("cartItems");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    if (!cartCount || !cartItemsContainer) return;

    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
      <div class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h3>Your Cart is Empty</h3>
      <p>Add items to start shopping</p>
      </div>
   `;
      return;
    }

    cart.forEach((item, index) => {
      cartItemsContainer.innerHTML += `
      <div class="border p-2 mb-3" style="border-radius:8px;">
         <img src="${item.image}" width="60" class="mb-2" style="border-radius:6px;">
         <h6>${item.title}</h6>
         <p style="color:var(--gold); font-weight:600;">${item.price}</p>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-dark minus-btn" data-index="${index}">-</button>
            <span style="font-weight:600;">${item.quantity}</span>
            <button class="btn btn-sm btn-dark plus-btn" data-index="${index}">+</button>
          </div>

          <button class="btn btn-sm btn-outline-dark mt-2 remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
    });
  }

  document.addEventListener("click", function (e) {
    // ADD TO CART
    if (e.target.classList.contains("add-cart-btn")) {
      let card = e.target.closest(".product-card");
      if (!card) return;

      let title = card.querySelector("h4").innerText;
      let price = card.querySelector(".price").innerText.split(" ")[0];
      let img = card.querySelector("img").src;

      let existing = cart.find(item => item.title === title);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({
          title: title,
          price: price,
          image: img,
          quantity: 1
        });
      }

      showToast("Added to cart ✓");

      saveCart();
      updateCartUI();
    }

    // PLUS
    if (e.target.classList.contains("plus-btn")) {
      let index = e.target.dataset.index;
      cart[index].quantity++;
      saveCart();
      updateCartUI();
    }

    // MINUS
    if (e.target.classList.contains("minus-btn")) {
      let index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      }
      saveCart();
      updateCartUI();
    }

    // REMOVE
    if (e.target.classList.contains("remove-btn")) {
      let index = e.target.dataset.index;
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
      showToast("Item removed from cart");
    }
  });

  updateCartUI();
});

/* ===== SEARCH BAR + SORT ===== */
const productSearchInput = document.getElementById("productSearch");
const sortSelect = document.getElementById("sort");
const products = document.querySelectorAll(".product-card");
const noProducts = document.getElementById("noProducts");

if (productSearchInput) {
  productSearchInput.addEventListener("keyup", filterProducts);
}

if (sortSelect) {
  sortSelect.addEventListener("change", sortProducts);
}

function filterProducts() {
  if (!productSearchInput) return;
  let value = productSearchInput.value.toLowerCase();
  let visible = 0;

  products.forEach(product => {
    let name = product.dataset.name.toLowerCase();
    if (name.includes(value)) {
      product.style.display = "block";
      visible++;
    } else {
      product.style.display = "none";
    }
  });

  if (noProducts) {
    noProducts.style.display = visible === 0 ? "block" : "none";
  }
}

function sortProducts() {
  if (!sortSelect) return;
  let container = document.querySelector(".product-track");
  let items = Array.from(products);

  if (sortSelect.value === "low") {
    items.sort((a, b) => a.dataset.price - b.dataset.price);
  }

  if (sortSelect.value === "high") {
    items.sort((a, b) => b.dataset.price - a.dataset.price);
  }

  if (sortSelect.value === "az") {
    items.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
  }

  items.forEach(item => container.appendChild(item));
}

/* ===== NEWSLETTER SUBSCRIPTION ===== */
function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  if (!emailInput) return;

  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    showToast("Please enter a valid email");
    return;
  }

  emailInput.value = '';
  showToast("Thank you for subscribing! ✦");
}

/* ===== SMOOTH PARALLAX ON CARDS (subtle) ===== */
function initCardParallax() {
  const cards = document.querySelectorAll('.card, .collection-card, .product-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ===== HORIZONTAL DRAG SCROLL for Carousels ===== */
function initDragScroll() {
  const containers = document.querySelectorAll('.customer-product, .jewellery-container');

  containers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor
    container.style.cursor = 'grab';
  });
}

/* ===== CATEGORY BAR ACTIVE STATE ===== */
document.addEventListener("DOMContentLoaded", function () {
  const categoryLinks = document.querySelectorAll('.category-bar a:not(.badge):not(.dark)');
  categoryLinks.forEach(link => {
    link.addEventListener('click', function () {
      categoryLinks.forEach(l => l.style.color = '');
      this.style.color = '#b08d57';
    });
  });
});

/* ===== INITIALIZE ALL ===== */
document.addEventListener("DOMContentLoaded", function () {
  initScrollReveal();
  animateCounter();
  initBackToTop();
  initCardParallax();
  initDragScroll();
});

/* ===== BACK TO TOP BUTTON ===== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}script