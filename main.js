let productsData = [];
let cartData = JSON.parse(localStorage.getItem("cart")) || [];
let wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];

const themeToggle = document.getElementById("themeToggle");
const homeLink = document.getElementById("homeLink");
const cartBtn = document.getElementById("cartBtn");
const wishlistHeaderBtn = document.getElementById("wishlistHeaderBtn");
const searchInput = document.getElementById("search-input");
const heroSection = document.getElementById("heroSection");
const productsSection = document.getElementById("productsSection");
const cartSection = document.getElementById("cartSection");
const wishlistSection = document.getElementById("wishlistSection");
const productsGrid = document.getElementById("productsGrid");
const productsLoading = document.getElementById("productsLoading");
const cartContent = document.getElementById("cartContent");
const wishlistGrid = document.getElementById("wishlistGrid");
const cartTotalSpan = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");
const headerWishlistBadge = document.getElementById("headerWishlistBadge");
const mobileWishlistBadge = document.getElementById("mobileWishlistBadge");
const mobileCartBadge = document.getElementById("mobileCartBadge");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const categoriesScroll = document.getElementById("categoriesScroll");
const shopNowHeroBtn = document.getElementById("shopNowHeroBtn");
const footerShopLink = document.getElementById("footerShopLink");
const footerWishlistLink = document.getElementById("footerWishlistLink");
const footerCartLink = document.getElementById("footerCartLink");
const trendingScroll = document.getElementById("trendingScroll");
const justForYouScroll = document.getElementById("justForYouScroll");
const homeCategoryIcons = document.getElementById("homeCategoryIcons");
const viewAllTrending = document.getElementById("viewAllTrending");
const viewAllJustForYou = document.getElementById("viewAllJustForYou");

let currentCategory = "all";

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.innerHTML = isLight
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

function showSection(section) {
  heroSection.style.display = "none";
  productsSection.classList.remove("active");
  cartSection.classList.remove("active");
  wishlistSection.classList.remove("active");

  if (section === "hero") {
    heroSection.style.display = "block";
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    document
      .querySelector(".nav-item[data-section='hero']")
      ?.classList.add("active");
    if (productsData.length > 0) {
      renderHomeSections();
    }
  } else if (section === "products") {
    productsSection.classList.add("active");
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    document
      .querySelector(".nav-item[data-section='products']")
      ?.classList.add("active");
    if (productsData.length === 0) fetchProducts();
  } else if (section === "cart") {
    cartSection.classList.add("active");
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    document
      .querySelector(".nav-item[data-section='cart']")
      ?.classList.add("active");
  } else if (section === "wishlist") {
    wishlistSection.classList.add("active");
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
    document
      .querySelector(".nav-item[data-section='wishlist']")
      ?.classList.add("active");
  }
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.dataset.section;
    showSection(section);
  });
});

homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("hero");
});

cartBtn.addEventListener("click", () => {
  showSection("cart");
});

wishlistHeaderBtn.addEventListener("click", () => {
  showSection("wishlist");
});

shopNowHeroBtn.addEventListener("click", () => {
  showSection("products");
});

footerShopLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("products");
});

footerWishlistLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("wishlist");
});

footerCartLink.addEventListener("click", (e) => {
  e.preventDefault();
  showSection("cart");
});

viewAllTrending.addEventListener("click", () => {
  showSection("products");
});

viewAllJustForYou.addEventListener("click", () => {
  showSection("products");
});

const fetchProducts = async () => {
  productsLoading.style.display = "flex";
  productsGrid.style.display = "none";
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    productsData = await res.json();
    renderCategories();
    renderProducts();
    renderHomeSections();
    renderHomeCategories();
    productsLoading.style.display = "none";
    productsGrid.style.display = "grid";
  } catch (err) {
    productsLoading.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load products</p><button class="add-to-cart" style="margin-top:16px; width:auto; padding:10px 24px;" id="retryBtn">Retry</button></div>`;
    document.getElementById("retryBtn")?.addEventListener("click", () => {
      productsLoading.innerHTML = `<div class="spinner"></div><p>Loading products...</p>`;
      fetchProducts();
    });
  }
};

const renderHomeCategories = () => {
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];
  const icons = {
    electronics: "fas fa-microchip",
    jewelery: "fas fa-gem",
    "men's clothing": "fas fa-tshirt",
    "women's clothing": "fas fa-female",
  };

  homeCategoryIcons.innerHTML = categories
    .map(
      (cat) => `
    <div class="category-icon-item" data-cat="${cat}">
      <i class="${icons[cat]}"></i>
      <span>${cat.split(" ")[0]}</span>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".category-icon-item").forEach((item) => {
    item.addEventListener("click", () => {
      currentCategory = item.dataset.cat;
      showSection("products");
      renderCategories();
      renderProducts();
    });
  });
};

const renderHomeSections = () => {
  const shuffled = [...productsData];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const trending = shuffled.slice(0, 8);
  const justForYou = shuffled.slice(8, 16);

  renderHorizontalScroll(trendingScroll, trending, "trending");
  renderHorizontalScroll(justForYouScroll, justForYou, "justforyou");
};

const renderHorizontalScroll = (container, products, type) => {
  if (!products || products.length === 0) {
    container.innerHTML =
      '<div class="loading-small">No products available</div>';
    return;
  }

  container.innerHTML = products
    .map((product) => {
      const isWishlisted = wishlistData.some((w) => w.id === product.id);
      return `
      <div class="horizontal-product">
        <button class="wishlist-btn ${isWishlisted ? "active" : ""}" data-id="${product.id}" data-type="${type}">
          <i class="fas fa-heart"></i>
        </button>
        <img src="${product.image}" alt="${product.title}" class="horizontal-product-img" />
        <div class="horizontal-product-info">
          <h4 class="horizontal-product-title">${shortenTitle(product.title)}</h4>
          <p class="horizontal-product-price">$${product.price.toFixed(2)}</p>
          <button class="horizontal-add-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    })
    .join("");

  container.querySelectorAll(".horizontal-add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = productsData.find((p) => p.id === id);
      addToCart(product);
    });
  });

  container.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = productsData.find((p) => p.id === id);
      toggleWishlist(product);
      renderHomeSections();
    });
  });
};

const renderCategories = () => {
  const categories = ["all", ...new Set(productsData.map((p) => p.category))];
  categoriesScroll.innerHTML = categories
    .map(
      (cat) => `
    <button class="cat-btn ${cat === currentCategory ? "active" : ""}" data-category="${cat}">
      ${cat === "all" ? "All" : cat.split(" ").slice(0, 2).join(" ")}
    </button>
  `,
    )
    .join("");
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
};

const shortenTitle = (title) => {
  if (!title || typeof title !== "string") return "Product";
  const words = title.split(" ");
  if (words.length === 0) return "Product";
  if (words[1] === "-") {
    return `${words[0]} ${words[1]} ${words[2] || ""}`;
  }
  return `${words[0]} ${words[1] || ""}`;
};

const renderProducts = () => {
  let filtered =
    currentCategory === "all"
      ? productsData
      : productsData.filter((p) => p.category === currentCategory);
  if (searchInput.value) {
    filtered = filtered.filter((p) =>
      shortenTitle(p.title)
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()),
    );
  }
  if (filtered.length === 0) {
    productsGrid.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><p>No products found</p></div>`;
    return;
  }
  productsGrid.innerHTML = filtered
    .map((product) => {
      const isWishlisted = wishlistData.some((w) => w.id === product.id);
      return `
      <div class="product-card">
        <button class="wishlist-btn ${isWishlisted ? "active" : ""}" data-id="${product.id}">
          <i class="fas fa-heart"></i>
        </button>
        <img src="${product.image}" alt="${product.title}" class="product-img" />
        <div class="product-info">
          <h3 class="product-title">${shortenTitle(product.title)}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    })
    .join("");
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      const product = productsData.find((p) => p.id === id);
      addToCart(product);
    });
  });
  document.querySelectorAll(".product-card .wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = productsData.find((p) => p.id === id);
      toggleWishlist(product);
    });
  });
};

const addToCart = (product) => {
  if (!product) return;
  const existing = cartData.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cartData.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
  Swal.fire({
    title: "Added to cart!",
    icon: "success",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
  });
};

const toggleWishlist = (product) => {
  if (!product) return;
  const index = wishlistData.findIndex((w) => w.id === product.id);
  if (index === -1) {
    wishlistData.push(product);
    Swal.fire({
      title: "Added to wishlist!",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1200,
    });
  } else {
    wishlistData.splice(index, 1);
    Swal.fire({
      title: "Removed from wishlist",
      icon: "info",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1200,
    });
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlistData));
  renderProducts();
  renderWishlist();
  renderHomeSections();
  updateBadges();
};

const renderCart = () => {
  if (!cartData || cartData.length === 0) {
    cartContent.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p><button class="add-to-cart" style="margin-top:16px; width:auto; padding:10px 24px;" id="shopNowBtn">Shop Now</button></div>`;
    document.getElementById("shopNowBtn")?.addEventListener("click", () => {
      showSection("products");
      if (productsData.length === 0) fetchProducts();
    });
    updateCartTotal();
    return;
  }
  cartContent.innerHTML = cartData
    .map((item) => {
      if (!item || !item.title) return "";
      return `
      <div class="cart-item">
        <img src="${item.image || ""}" alt="${item.title || "Product"}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${shortenTitle(item.title)}</h4>
          <p class="cart-item-price">$${(item.price || 0).toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
          <span class="cart-item-qty">${item.quantity || 1}</span>
          <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
    })
    .join("");
  document.querySelectorAll(".dec-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = cartData.find((i) => i.id === id);
      if (item) {
        if (item.quantity > 1) item.quantity--;
        else cartData = cartData.filter((i) => i.id !== id);
        saveCart();
        renderCart();
      }
    });
  });
  document.querySelectorAll(".inc-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = cartData.find((i) => i.id === id);
      if (item) {
        item.quantity++;
        saveCart();
        renderCart();
      }
    });
  });
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      cartData = cartData.filter((i) => i.id !== id);
      saveCart();
      renderCart();
    });
  });
  updateCartTotal();
};

const renderWishlist = () => {
  if (!wishlistData || wishlistData.length === 0) {
    wishlistGrid.innerHTML = `<div class="empty-state"><i class="fas fa-heart-broken"></i><p>Your wishlist is empty</p></div>`;
    return;
  }
  wishlistGrid.innerHTML = wishlistData
    .map((product) => {
      if (!product || !product.title) return "";
      return `
      <div class="wishlist-card">
        <button class="wishlist-btn active" data-id="${product.id}"><i class="fas fa-heart"></i></button>
        <img src="${product.image || ""}" alt="${product.title}" class="product-img" />
        <div class="product-info">
          <h3 class="product-title">${shortenTitle(product.title)}</h3>
          <p class="product-price">$${(product.price || 0).toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    })
    .join("");
  document.querySelectorAll(".wishlist-card .wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = wishlistData.find((w) => w.id === id);
      toggleWishlist(product);
    });
  });
  document.querySelectorAll(".wishlist-card .add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const product = wishlistData.find((w) => w.id === id);
      addToCart(product);
    });
  });
};

const updateCartTotal = () => {
  const total = cartData.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  cartTotalSpan.textContent = total.toLocaleString();
};

const updateBadges = () => {
  const totalItems = cartData.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  cartBadge.textContent = totalItems;
  mobileCartBadge.textContent = totalItems;
  headerWishlistBadge.textContent = wishlistData.length;
  mobileWishlistBadge.textContent = wishlistData.length;

  if (totalItems === 0) {
    cartBadge.style.display = "none";
    mobileCartBadge.style.display = "none";
  } else {
    cartBadge.style.display = "flex";
    mobileCartBadge.style.display = "flex";
  }
  if (wishlistData.length === 0) {
    headerWishlistBadge.style.display = "none";
    mobileWishlistBadge.style.display = "none";
  } else {
    headerWishlistBadge.style.display = "flex";
    mobileWishlistBadge.style.display = "flex";
  }
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cartData));
  updateBadges();
};

clearCartBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    Swal.fire("Cart empty", "Nothing to clear", "info");
    return;
  }
  Swal.fire({
    title: "Clear cart?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Clear",
  }).then((result) => {
    if (result.isConfirmed) {
      cartData = [];
      saveCart();
      renderCart();
      Swal.fire("Cleared!", "Your cart is empty", "success");
    }
  });
});

checkoutBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    Swal.fire("Cart empty", "Add some items first", "info");
    return;
  }
  Swal.fire({
    title: "Checkout Successful!",
    text: `Total: $${cartTotalSpan.textContent}`,
    icon: "success",
    confirmButtonColor: "#00d26a",
  });
  cartData = [];
  saveCart();
  renderCart();
});

searchInput.addEventListener("input", () => {
  if (productsSection.classList.contains("active") && productsData.length > 0) {
    renderProducts();
  }
});

renderCart();
renderWishlist();
updateBadges();
fetchProducts();
