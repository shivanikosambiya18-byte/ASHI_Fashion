const products = {
  1: {
    title: "Sky Blue Chikankari Saree",
    price: "₹6,997",
    desc: "Premium chikankari work with lightweight fabric — festive & elegant look.",
    image: "../Women/images/p1.jpg"
  },

  2: {
    title: "Purple Silk Bandhani Saree",
    price: "₹7,996",
    desc: "Traditional bandhani design with rich silk texture in pure silk.",
    image: "../Women/images/p2.jpg"
  },

  3: {
    title: "Black Kurta Palazzo Set",
    price: "₹12,400",
    desc: "Elegant ethnic set with modern style — perfect for occasions.",
    image: "../Women/images/p3.jpg"
  },

  4: {
    title: "Wine Embroidered Set",
    price: "₹11,996",
    desc: "Beautiful embroidery with premium finish and rich look.",
    image: "../Women/images/p4.jpg"
  },

  5: {
    title: "Pashmina Kurta Set",
    price: "₹4,059",
    desc: "Soft pashmina fabric with stylish ethnic design.",
    image: "../Women/images/p5.jpg"
  }
};

// GET ID FROM URL
const url = new URLSearchParams(window.location.search);
const id = url.get("id");

const product = products[id];

if (product) {
  document.getElementById("detailTitle").innerText = product.title;
  document.getElementById("detailPrice").innerText = product.price;
  document.getElementById("detailDesc").innerText = product.desc;
  document.getElementById("detailImage").src = product.image;
}

// ADD TO CART
document.getElementById("addToCartBtn").addEventListener("click", function () {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find(item => item.title === product.title);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
});
