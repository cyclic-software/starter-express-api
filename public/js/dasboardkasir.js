function increaseQuantity(button) {
  const quantityElement =
    button.parentNode.previousElementSibling.querySelector(".fs-7");
  let quantity = parseInt(quantityElement.textContent);
  quantity++;
  quantityElement.textContent = quantity;

  const index = button.parentNode.dataset.index;
  // Menggunakan DOM traversal untuk mencari elemen dengan atribut data-item-id
const get=button.parentNode.parentNode.parentNode.parentNode;
const childElement = get.firstElementChild;
const itemId = childElement.value;


  const inputHidden = document.querySelector(
    `input[name="jumlah[${index}]"]`
  );
  inputHidden.value = quantity;

  dashboardSocket.emit("increaseJumlah", {
    itemId: itemId,
  });


  updateSubtotal();
}

function decreaseQuantity(button) {
  const quantityElement =
    button.parentNode.nextElementSibling.querySelector(".fs-7");

  let quantity = parseInt(quantityElement.textContent);
  if (quantity > 0) {
    quantity--;
    quantityElement.textContent = quantity;

    const index = button.parentNode.dataset.index;
    const get=button.parentNode.parentNode.parentNode.parentNode;
    const childElement = get.firstElementChild;
    const itemId = childElement.value;

    const inputHidden = document.querySelector(
      `input[name="jumlah[${index}]"]`
    );
    inputHidden.value = quantity;

    dashboardSocket.emit("decreaseJumlah", {
      itemId: itemId,
    });
    

    updateSubtotal();
  }
}

function updateSubtotal() {
  const quantityElements = document.querySelectorAll(".fs-7");
  const prices = document.querySelectorAll("#currentOrder .text-warning");

  const diskonInput = document.getElementById("diskon");
  const diskon = parseInt(diskonInput.value) || 0;

  let subtotal = 0;
  for (let i = 0; i < quantityElements.length; i++) {
    const quantity = parseInt(quantityElements[i].textContent);
    const price = parseInt(prices[i].textContent);
    subtotal += quantity * price;
  }

  // Kode update totalBayar
  const totalSales = subtotal - diskon;

  const subtotalElement = document.querySelector("#subtotal");
  subtotalElement.textContent = `Rp. ${subtotal}`;

  const subtotalInput = document.querySelector("#subTotalInput"); 
  subtotalInput.value = subtotal;
  subtotalInput.dispatchEvent(new Event("change"));

  const totalBayarElement = document.querySelector("#totalBayar");
  totalBayarElement.textContent = `Rp. ${totalSales}`;

  const totalBayarInput = document.querySelector("#totalBayarInput");
  totalBayarInput.value = totalSales;
  totalBayarInput.dispatchEvent(new Event("change"));
}

function removeFromCurrentOrder(button) {
  const orderItem = button.closest(".row");
  const target = button.parentNode.parentNode;
  const gett = target.dataset.itemId;
  dashboardSocket.emit("removeFromCurrentOrder", {
    itemId: gett,
  });
  orderItem.remove();
  updateSubtotal();
}

document
  .querySelector("#currentOrder")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("fa-arrow-left")) {
      removeFromCurrentOrder(event.target);
    }
  });

const diskonInput = document.getElementById("diskon");
diskonInput.addEventListener("input", updateSubtotal);

// Menangkap klik pada tombol addToCartBtn
let index = 0;
document.querySelectorAll(".addToCartBtn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Mengambil data produk dari card terkait
    const card = this.closest(".product-box");
    const productName = card.querySelector("h5").innerText;
    const productPrice = card.querySelector(".text-warning").innerText;
    const gambarElement = card.querySelector("img");
    const gambar = gambarElement.getAttribute("src");

    const itemId =
      this.closest(".product-box").querySelector("[data-item-id]").dataset
        .itemId;

    // Memeriksa apakah produk sudah ada dalam daftar pesanan berdasarkan itemId
    const orderItems = document.querySelectorAll("#currentOrder .row");
    let existingItem = null;
    for (let i = 0; i < orderItems.length; i++) {
      const existingItemId = orderItems[i].dataset.itemId;
      if (existingItemId === itemId) {
        existingItem = orderItems[i];
        break;
      }
    }

    // Menambahkan console.log untuk memantau nilai
    // console.log("productName:", productName);
    // console.log("itemName:", itemName);
    if (existingItem) {
      // Jika produk sudah ada, tambahkan jumlahnya
      const quantityElement = existingItem.querySelector(".fs-7");
      let quantity = parseInt(quantityElement.textContent);
      quantity++;
      quantityElement.textContent = quantity;
    } else {
      // Jika produk belum ada, buat elemen baru dan tambahkan ke dalam current order
      const newOrderItem = document.createElement("div");
      newOrderItem.classList.add("row", "mt-3");
      newOrderItem.dataset.itemId = itemId; // Menambahkan itemId sebagai atribut data
      newOrderItem.innerHTML = `
            <div class="col-2 mt-1 me-3">
                <img src="${gambar}" alt="" width="105" height="105">
            </div>
            <div class="col">
                <input type="hidden" name="idProduk[${index}].produk" value="${itemId}">
                <input type="hidden" name="jumlah[${index}]" value="1">
                <h5 class="ms-4" data-product-name="${productName}">${productName}</h5>
                <p class="fw-bold text-warning ms-4 mt-1 fs-4">${productPrice}</p>
                <div class="ms-4 col-12">
                    <div class="row">
                        <div class="col" data-index="${index}">
                            <button type="button" class="btn btn-xs btn-warning" onclick="decreaseQuantity(this)">-</button>
                        </div>
                        <div class="col text-center">
                            <p class="fs-7">1</p>
                        </div>
                        <div class="col" data-index="${index}">
                            <button type="button" class="btn btn-xs btn-warning" onclick="increaseQuantity(this)">+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-2 mt-2 text-end">
            <button type="button" class="btn btn-xs btn-warning" onclick="removeFromCurrentOrder(this)">
            <i class="fa-solid fa-times fa-lg" style="color: #fffff;"></i>
            </button>
        </div>

        `;

      // Menambahkan elemen baru ke dalam current order
      const currentOrder = document.querySelector("#currentOrder");
      currentOrder.appendChild(newOrderItem);
      index++;
    }
            // Kirim data produk melalui WebSocket saat produk ditambahkan
            const quantity = existingItem ? parseInt(existingItem.querySelector(".fs-7").textContent) : 1;
            dashboardSocket.emit("addProductToCart", {
              itemId: itemId,
              productName: productName,
              productPrice: productPrice
            });
    updateSubtotal();
  });
});

// Mendapatkan tanggal saat ini
var today = new Date();

// Mengambil referensi elemen input tanggal
var inputTanggal = document.getElementById("tglPesan");

// Mengatur nilai atribut value dengan tanggal saat ini
inputTanggal.value = formatDate(today);

// Fungsi untuk mengubah format tanggal menjadi "YYYY-MM-DD"
function formatDate(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}
