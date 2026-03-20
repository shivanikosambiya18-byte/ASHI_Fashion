let cart = JSON.parse(localStorage.getItem("cart")) || [];

let checkoutItems = document.getElementById("checkoutItems");
let totalAmount = document.getElementById("totalAmount");

function loadCheckout(){
  checkoutItems.innerHTML = "";
  if(cart.length === 0){
    checkoutItems.innerHTML = "<p>Your cart is empty</p>";
    totalAmount.innerText = "";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    let price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
    total += price * item.quantity;

    checkoutItems.innerHTML += `
      <div class="border p-2 mb-2" style="border-radius:8px;">
        <img src="${item.image}" width="60" style="border-radius:6px;"> 
        <strong>${item.title}</strong>
        <p>${item.price} x ${item.quantity}</p>
      </div>
    `;
  });
  totalAmount.innerText = "Total: " + total.toFixed(2);
}

loadCheckout();

const checkoutForm = document.getElementById("checkoutForm");
const fullName = document.getElementById("fullName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const pincode = document.getElementById("pincode");
const phone = document.getElementById("phone");

const nameError = document.getElementById("nameError");
const addressError = document.getElementById("addressError");
const cityError = document.getElementById("cityError");
const pinError = document.getElementById("pinError");
const phoneError = document.getElementById("phoneError");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    nameError.innerText = "";
    addressError.innerText = "";
    cityError.innerText = "";
    pinError.innerText = "";
    phoneError.innerText = "";

    if (fullName.value.trim() === "") {
      nameError.innerText = "Full name required";
      valid = false;
    }

    if (address.value.trim() === "") {
      addressError.innerText = "Address required";
      valid = false;
    }

    if (city.value.trim() === "") {
      cityError.innerText = "City required";
      valid = false;
    }

    if (pincode.value.trim().length !== 6) {
      pinError.innerText = "Enter valid pincode";
      valid = false;
    }

    if (phone.value.trim().length !== 10) {
      phoneError.innerText = "Enter valid phone number";
      valid = false;
    }

    if (!valid) {
      return;
    }

    let total = cart.reduce((sum, item) => {
      let price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let newOrder = {
      id: "ORD-" + Date.now(),
      date: new Date().toLocaleString("en-IN"),
      customer: {
        name: fullName.value.trim(),
        address: address.value.trim(),
        city: city.value.trim(),
        pincode: pincode.value.trim(),
        phone: phone.value.trim()
      },
      items: cart,
      total: total.toFixed(2),
      status: "Confirmed"
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");
    alert("Order placed successfully! Order ID: " + newOrder.id);
    window.location.href = "../Women/index.html";
  });
}
