// script.js
/* Konfigurasi: ganti nomor WA di bawah sesuai nomor bengkel (format internasional tanpa +, contoh: 6281234567890) */
const WA_NUMBER = "6281234567890"; // <-- ganti dengan nomor WhatsApp tujuan

const PRODUCTS = [
  {
    id: "aki-ns60",
    title: "Aki NS60L 12V 45Ah (Mobil)",
    price: 820000,
    type: "mobil",
    image: "https://images.unsplash.com/photo-1583876373270-6a6d9f1b7f79?q=80&w=800&auto=format&fit=crop&crop=entropy",
    desc: "Aki maintenance-free, cocok untuk kendaraan penumpang. Garansi 12 bulan."
  },
  {
    id: "aki-mf-ctz7s",
    title: "Aki MF CTZ7S 12V 6Ah (Motor)",
    price: 145000,
    type: "motor",
    image: "https://images.unsplash.com/photo-1511376777868-611b54f68947?q=80&w=800&auto=format&fit=crop&crop=entropy",
    desc: "Aki MF untuk motor matic dan bebek. Performa stabil dan umur pakai baik."
  },
  {
    id: "aki-mf-46b24r",
    title: "Aki 46B24R 12V 45Ah (Mobil)",
    price: 760000,
    type: "mobil",
    image: "https://images.unsplash.com/photo-1604490332394-1d1a7f3a0a9a?q=80&w=800&auto=format&fit=crop&crop=entropy",
    desc: "Aki tipe basah dengan kapasitas besar, cocok untuk audio dan penggunaan berat."
  },
  {
    id: "aki-gel-12v",
    title: "Aki Gel 12V 7Ah (Motor Khusus)",
    price: 320000,
    type: "motor",
    image: "https://images.unsplash.com/photo-1582719478179-2b0b2f4f6f4a?q=80&w=800&auto=format&fit=crop&crop=entropy",
    desc: "Aki gel untuk aplikasi khusus yang butuh ketahanan getaran tinggi."
  }
];

/* Utility */
function formatRupiah(num){
  return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* Render products */
const productsGrid = document.getElementById("productsGrid");
function renderProducts(list){
  productsGrid.innerHTML = "";
  if(!list.length){
    productsGrid.innerHTML = `<div class="center text-muted">Tidak ada produk</div>`;
    return;
  }
  list.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <div class="img-wrap"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
      <h4>${p.title}</h4>
      <div class="small-note">${p.desc}</div>
      <div class="price-row">
        <div class="price">${formatRupiah(p.price)}</div>
        <div class="badge">${p.type}</div>
      </div>
      <div class="actions">
        <a class="btn-sm btn-ghost" href="#" data-id="${p.id}" data-action="details">Detail</a>
        <a class="btn-sm btn-order" href="#" data-id="${p.id}" data-action="order">Pesan via WhatsApp</a>
      </div>
    `;
    productsGrid.appendChild(el);
  });
}

/* Modal management */
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function openModal(contentHtml){
  modalBody.innerHTML = contentHtml;
  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden","false");
}
function closeModal(){
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("aria-hidden","true");
}
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e)=>{
  if(e.target === modalOverlay) closeModal();
});

/* Generate WhatsApp link */
function buildWhatsAppLink({productTitle, price, buyerName, buyerAddress}){
  const mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(buyerAddress || "");
  const message = `Halo Bengkel Family Teknik,%0A%0ASaya mau pesan:%0A- Produk: ${productTitle}%0A- Harga: ${formatRupiah(price)}%0A%0AData Pemesan:%0A- Nama: ${buyerName || "[isi nama]"}%0A- Alamat: ${buyerAddress || "[isi alamat lengkap]"}%0A%0ALink lokasi: ${mapsLink}%0A%0ATerima kasih.`;
  return "https://wa.me/" + WA_NUMBER + "?text=" + message;
}

/* Event delegation for product actions */
productsGrid.addEventListener("click", (e)=>{
  e.preventDefault();
  const btn = e.target.closest("a");
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const product = PRODUCTS.find(x=>x.id===id);
  if(!product) return;
  if(action === "details"){
    openModal(`
      <div>
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div>
        <h2 id="modalTitle">${product.title}</h2>
        <p class="small-note">${product.desc}</p>
        <p><strong>Harga:</strong> ${formatRupiah(product.price)}</p>
        <hr />
        <form id="quickOrderForm" class="order-form">
          <label>Nama Pemesan</label>
          <input id="buyerName" type="text" placeholder="Nama lengkap" required />
          <label>Alamat Lengkap</label>
          <textarea id="buyerAddress" rows="3" placeholder="Alamat lengkap (untuk link Google Maps)"></textarea>
          <div style="display:flex;gap:8px;">
            <button id="waOrderBtn" class="btn btn-order" type="button">Pesan via WhatsApp</button>
            <button id="waCopyBtn" class="btn btn-ghost" type="button">Salin Pesan</button>
          </div>
          <div class="small-note">Semua konfirmasi & pembayaran melalui WhatsApp. Kami akan konfirmasi stok & estimasi kedatangan.</div>
        </form>
      </div>
    `);
    // attach handlers after modal opens
    setTimeout(()=>{
      const waOrderBtn = document.getElementById("waOrderBtn");
      const waCopyBtn = document.getElementById("waCopyBtn");
      waOrderBtn.addEventListener("click", ()=>{
        const name = document.getElementById("buyerName").value.trim();
        const address = document.getElementById("buyerAddress").value.trim();
        const link = buildWhatsAppLink({productTitle: product.title, price: product.price, buyerName: name, buyerAddress: address});
        window.open(link,"_blank");
      });
      waCopyBtn.addEventListener("click", ()=>{
        const name = document.getElementById("buyerName").value.trim();
        const address = document.getElementById("buyerAddress").value.trim();
        const mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address || "");
        const plain = `Halo Bengkel Ikonik,\n\nSaya mau pesan:\n- Produk: ${product.title}\n- Harga: ${formatRupiah(product.price)}\n\nData Pemesan:\n- Nama: ${name || "[isi nama]"}\n- Alamat: ${address || "[isi alamat lengkap]"}\n\nLink lokasi: ${mapsLink}\n\nTerima kasih.`;
        navigator.clipboard?.writeText(plain).then(()=>{
          alert("Pesan disalin ke clipboard. Silakan tempel di WhatsApp.");
        }).catch(()=>{ alert("Gagal menyalin pesan. Silakan ketik manual."); });
      });
    },50);
  } else if(action === "order"){
    // quick redirect to WA with minimal info (asks user to fill name & address in WA message)
    const basicMsg = `Halo Bengkel Family Teknik,%0ASaya ingin pesan produk: ${product.title} - ${formatRupiah(product.price)}%0A%0ASilakan bantu konfirmasi stok & instruksi pengiriman.%0A%0ATerima kasih.`;
    const waLink = "https://wa.me/" + WA_NUMBER + "?text=" + basicMsg;
    window.open(waLink,"_blank");
  }
});

/* Search & filter */
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
function filterAndRender(){
  const q = searchInput.value.trim().toLowerCase();
  const t = filterType.value;
  const out = PRODUCTS.filter(p=>{
    const matchQ = q ? (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : true;
    const matchT = t ? p.type === t : true;
    return matchQ && matchT;
  });
  renderProducts(out);
}
searchInput.addEventListener("input", filterAndRender);
filterType.addEventListener("change", filterAndRender);

/* Header WA quick contact */
const waContact = document.getElementById("waContact");
waContact.addEventListener("click", (e)=>{
  e.preventDefault();
  const msg = encodeURIComponent("Halo Bengkel Family Teknik, saya ingin konsultasi & booking layanan. Terima kasih.");
  const link = "https://wa.me/" + WA_NUMBER + "?text=" + msg;
  window.open(link,"_blank");
});

/* Menu toggle for small screens */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", ()=>{
  if(mainNav.style.display === "flex") mainNav.style.display = "none";
  else mainNav.style.display = "flex";
});

/* Initialize */
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts(PRODUCTS);

/* Optional: preload images to smooth UX */
PRODUCTS.forEach(p=>{
  const img = new Image();
  img.src = p.image;
});