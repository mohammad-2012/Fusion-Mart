// Elements
const cartButton = document.getElementById("header-cart-btn");
const productContainer = document.getElementById("product-list-container");
const cartContainer = document.querySelector(".cart-container");
const headerLink = document.querySelector(".header-link");
const conditionText = document.querySelector(".condition-text");
const productList = document.getElementById("product-list");
const cartTable = document.getElementById("cart-table");
const checkoutBox = document.querySelector(".checkout-box");
const quantityText = document.querySelector(".quantity-text");
const cartTotal = document.getElementById("cart-total");
const clearAllButton = document.getElementById("clear-all-btn");
const checkoutButton = document.getElementById("checkout-btn");
const categoryButtonsParent = document.getElementById("category-buttons");
const categoryuButtonsContainer = document.querySelector(
  ".category-buttons-wrapper"
);
const searchInput = document.getElementById("search-input");

let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// Show basket cart
cartButton.addEventListener("click", () => {
  productContainer.classList.remove("show-section");
  cartContainer.classList.add("show-section");
});

// Show products list
headerLink.addEventListener("click", (e) => {
  e.preventDefault();
  cartContainer.classList.remove("show-section");
  productContainer.classList.add("show-section");
});

