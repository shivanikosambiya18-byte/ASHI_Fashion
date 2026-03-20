const cartEl = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');
const checkoutBtn = document.getElementById('checkoutBtn');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  cartEl.innerHTML = '';
  if (cart.length === 0) {
    cartEl.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3></div>';
    cartSummary.innerHTML = '';
    checkoutBtn.style.display = 'none';
    return;
  }

  checkoutBtn.style.display = 'inline-block';
  let total = 0;
  cart.forEach((item, index) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    total += price * item.quantity;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-detail">
        <img src="${item.image}" alt="${item.title}" width="70">
        <div>
          <h5>${item.title}</h5>
          <p>${item.price} × ${item.quantity}</p>
        </div>
      </div>
      <div class="cart-item-actions">
        <button data-index="${index}" class="minus-btn">-</button>
        <span>${item.quantity}</span>
        <button data-index="${index}" class="plus-btn">+</button>
        <button data-index="${index}" class="remove-btn">Remove</button>
      </div>
    `;
    cartEl.appendChild(row);
  });

  cartSummary.innerHTML = `<h4>Total: ₹${total.toFixed(2)}</h4>`;
}

cartEl.addEventListener('click', function (e) {
  const idx = e.target.getAttribute('data-index');
  if (idx === null) return;

  if (e.target.classList.contains('plus-btn')) {
    cart[idx].quantity++;
  } else if (e.target.classList.contains('minus-btn')) {
    if (cart[idx].quantity > 1) cart[idx].quantity--;
  } else if (e.target.classList.contains('remove-btn')) {
    cart.splice(idx, 1);
  }

  saveCart();
  renderCart();
});

checkoutBtn.addEventListener('click', function () {
  window.location.href = '../Checkout/checkout.html';
});

renderCart();
