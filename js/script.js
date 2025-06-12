// toggle class active untuk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
// ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Toggle class active untuk search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart1 = document.querySelector(".shopping-cart");
document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

// klik di luar elemen
const hamburger = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");
const sc = document.querySelector("#shopping-cart-button");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});


const container = document.querySelector(".container-input");
const inputs = container.querySelectorAll("input[type='text'], input[type='email'], input[type='number']");
const btn = container.querySelector(".btn");

function checkInputs() {
  // Cek apakah semua input punya value yang tidak kosong
  const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
  btn.disabled = !allFilled;
  // Bisa juga styling btn di disabled lewat CSS
}

// Pasang event listener ke semua input supaya cek setiap kali ada perubahan
inputs.forEach(input => input.addEventListener("input", checkInputs));

// Jalankan sekali pas load halaman untuk set state awal tombol
checkInputs();


document.getElementById("pay-button").addEventListener("click", function () {
  const name = document.querySelector(".name").value.trim();
  const email = document.querySelector(".email").value.trim();
  const phone = document.querySelector(".phone").value.trim();
  const total = document.querySelector(".total-amount").textContent.trim();

  if (!name || !email || !phone) {
    alert("Lengkapi semua data terlebih dahulu.");
    return;
  }

  // Ambil daftar item di keranjang
  let itemsText = "";
  const items = document.querySelectorAll(".cart-item");
  items.forEach(item => {
    const itemName = item.querySelector("h3").textContent.trim();
    const qty = item.querySelector(".item-quantity").textContent.trim();
    itemsText += `- ${itemName} x ${qty}\n`;
  });

  const message = `Halo, saya mau order:\n\n${itemsText}\nTotal: ${total}\n\nData Saya:\nNama: ${name}\nEmail: ${email}\nHP: ${phone}`;

  const whatsappNumber = "6285601157349"; // Ganti dengan nomor WA kamu (gunakan format internasional, tanpa +)

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
});

const shoppingCart = document.querySelector(".shopping-cart");
let cartItemsContainer = shoppingCart.querySelector(".cart-items");
if (!cartItemsContainer) {
  cartItemsContainer = document.createElement("div");
  cartItemsContainer.classList.add("cart-items");
  shoppingCart.appendChild(cartItemsContainer);
}


function addToCart(event) {
  const button = event.currentTarget;
  const productCard = button.closest(".product-card");

  if (!productCard) return;

  const name = productCard.querySelector(".product-content h3").textContent.trim();
  const price = productCard.querySelector(".product-price").textContent.trim();
  const imgSrc = productCard.querySelector(".product-image img").src;

  addItemToCart(name, price, imgSrc);
  shoppingCart.classList.add("active");
}

function addItemToCart(name, price, imgSrc) {
  let cartItemsContainer = document.querySelector(".cart-items");
  if (!cartItemsContainer) {
    cartItemsContainer = document.createElement("div");
    cartItemsContainer.classList.add("cart-items");
    document.querySelector(".shopping-cart").appendChild(cartItemsContainer);
  }

  const existingItem = cartItemsContainer.querySelector(`.cart-item[data-name="${name}"]`);

  if (existingItem) {
    const confirmed = confirm(`${name} sudah ada di keranjang. Tambahkan lagi?`);
    if (!confirmed) return;

    // Update quantity
    const qtyElem = existingItem.querySelector(".item-quantity");
    let quantity = parseInt(qtyElem.textContent);
    quantity++;
    qtyElem.textContent = quantity;

  } else {
    // Buat elemen baru dengan quantity = 1
    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.setAttribute("data-name", name);
    item.innerHTML = `
  <img src="${imgSrc}" alt="${name}" />
  <div class="item-detail">
    <h3>${name}</h3>
    <div class="item-quantity-container">
      <div class="item-price">${price}</div> x
      <div class="item-minus" style="cursor:pointer;">-</div>
      <div class="item-quantity">1</div>
      <div class="item-plus" style="cursor:pointer;">+</div> =
      <div class="item-total-price">${formatCurrency(parseFloat(price.replace(/[^\d.]/g, '')))}</div>
    </div>
  </div>
  <i data-feather="trash-2" class="remove-item" style="cursor:pointer;"></i>
`;

// Tombol tambah
item.querySelector(".item-plus").addEventListener("click", () => {
  const qtyElem = item.querySelector(".item-quantity");
  let quantity = parseInt(qtyElem.textContent);
  quantity++;
  qtyElem.textContent = quantity;
  updateTotalPrice(item, price);
  updateQuantityBadge();
  updateCartTotal();
});

// Tombol kurang
item.querySelector(".item-minus").addEventListener("click", () => {
  const qtyElem = item.querySelector(".item-quantity");
  let quantity = parseInt(qtyElem.textContent);
  if (quantity > 1) {
    quantity--;
    qtyElem.textContent = quantity;
    updateTotalPrice(item, price);
  } else {
    item.remove(); // Hapus item kalau quantity 1 dan dikurangi
  }
  updateQuantityBadge();
  updateCartTotal();
});

function updateTotalPrice(item, priceText) {
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Hilangkan "Rp"/non-digit
  const qty = parseInt(item.querySelector(".item-quantity").textContent);
  const total = price * qty;
  item.querySelector(".item-total-price").textContent = formatCurrency(total);
}

function updateCartTotal() {
  const cartItems = document.querySelectorAll(".cart-item");
  let total = 0;

  cartItems.forEach(item => {
    const qty = parseInt(item.querySelector(".item-quantity").textContent);
    const priceText = item.querySelector(".item-price").textContent;
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
    total += qty * price;
  });

  const totalDisplay = document.querySelector(".total-amount");
  if (totalDisplay) {
    totalDisplay.textContent = formatCurrency(total);
  }
}


function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(value);
}


function updateTotalPrice(item, priceText) {
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Hilangkan simbol mata uang
  const qty = parseInt(item.querySelector(".item-quantity").textContent);
  const total = price * qty;
  item.querySelector(".item-total-price").textContent = formatCurrency(total);
}


    cartItemsContainer.appendChild(item);

    if (typeof feather !== "undefined") feather.replace();

    item.querySelector(".remove-item").addEventListener("click", (e) => {
       e.stopPropagation();
      const qtyElem = item.querySelector(".item-quantity");
      let quantity = parseInt(qtyElem.textContent);

      if (quantity > 1) {
        quantity--;
        qtyElem.textContent = quantity;
      } else {
        item.remove();
      }
      updateQuantityBadge();
      updateCartTotal();
      updateTotalPrice(item, price);
    });
  }

  updateQuantityBadge();
  updateCartTotal();
  // updateTotalPrice(item, price);
}

function toggleEmptyMessage() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const emptyMessage = document.querySelector(".empty-message");
  const totalContainer = document.querySelector(".shopping-cart .total");

  if (!cartItemsContainer || !emptyMessage) return;

  if (cartItemsContainer.children.length === 0) {
    emptyMessage.style.display = "block";
    totalContainer.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    totalContainer.style.display = "block";
  }
}


function updateQuantityBadge() {
  const cartItems = document.querySelectorAll(".cart-item");
  let totalQuantity = 0;

  cartItems.forEach(item => {
    const qtyElem = item.querySelector(".item-quantity");
    const quantity = qtyElem ? parseInt(qtyElem.textContent) : 1;
    totalQuantity += quantity;
  });

  const badge = document.querySelector(".item-quantity");
  if (badge) {
    badge.textContent = totalQuantity;
    badge.style.display = totalQuantity > 0 ? "inline-block" : "none";
  }
  toggleEmptyMessage();
}

document.addEventListener("DOMContentLoaded", () => {
  toggleEmptyMessage();
});






//Modal Box detail
const itemDetailModal1 = document.querySelector("#item-detail-modal1");
const itemDetailButtons1 = document.querySelectorAll(".item-detail-button1");

itemDetailButtons1.forEach((btn) => {
  btn.onclick = (e) => {
    itemDetailModal1.style.display = "flex";
    e.preventDefault();
  };
});

//klik tombol close modal
document.querySelector(".modal .close-icon1").onclick = (e) => {
  itemDetailModal1.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon2").onclick = (e) => {
  itemDetailModal2.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon3").onclick = (e) => {
  itemDetailModal3.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon4").onclick = (e) => {
  itemDetailModal4.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon5").onclick = (e) => {
  itemDetailModal5.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon6").onclick = (e) => {
  itemDetailModal6.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon7").onclick = (e) => {
  itemDetailModal7.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon8").onclick = (e) => {
  itemDetailModal8.style.display = "none";
  e.preventDefault();
};
document.querySelector(".modal .close-icon9").onclick = (e) => {
  itemDetailModal9.style.display = "none";
  e.preventDefault();
};

//klik di luar modal
const itemDetailModal = document.querySelector(".item-detail-modal");

window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product .open-modal");
  const modal = document.getElementById("item-detail-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-description");
  const modalPrice = document.getElementById("modal-price");

  products.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const product = this.closest(".product");

      modalImage.src = product.dataset.image;
      modalTitle.textContent = product.dataset.title;
      modalDesc.textContent = product.dataset.description;
      modalPrice.innerHTML = `${product.dataset.price} <span>${product.dataset["oldPrice"]}</span>`;

      modal.classList.add("show");
    });
  });

  // Close modal
  document.querySelector(".close-icon").addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.remove("show");
  });
});
