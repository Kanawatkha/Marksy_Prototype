/* =========================================
   CUSTOMER LOGIC (ระบบลูกค้า - Read Only)
   ดูแผนที่ เช็คชื่อร้าน และข้อมูลสินค้า
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. รับ ID ตลาดจาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const marketIdParam = parseInt(urlParams.get('id'));
    const marketId = marketIdParam || 1;

    // 2. โหลด Header และ Map
    loadCustomerMarketInfo(marketId);
    renderCustomerMap(marketId);
});

// โหลดข้อมูลส่วนหัว (ชื่อตลาด)
function loadCustomerMarketInfo(id) {
    const market = marketsData.find(m => m.id === id);
    if (market) {
        document.getElementById('cust-market-name').innerText = market.name;
        document.getElementById('cust-market-loc').innerHTML = `<i class="fa-solid fa-location-dot me-1"></i> ${market.location}`;
    }
}

// เรนเดอร์แผนที่ (ระบายสีตามสถานะ)
function renderCustomerMap(marketId) {
    const layout = marketLayouts[marketId];
    if (!layout) return;

    layout.forEach(stall => {
        const el = document.getElementById(stall.id);
        if (el) {
            // ล้าง Class เดิม
            el.className = 'zone-box';

            // คืนค่าพื้นหลังเดิมตาม ID (A/B/M)
            if (el.id.includes('stall-a')) el.classList.add('zone-a-style');
            else if (el.id.includes('stall-b')) el.classList.add('zone-b-style');
            else if (el.id.includes('stall-m')) el.classList.add('zone-m-style');

            // --- Logic การแสดงผลสำหรับลูกค้า ---
            if (stall.status === 'booked') {
                // ถ้าจองแล้ว = เป็นร้านค้า (สีแดง)
                el.classList.add('status-booked');
                el.style.cursor = 'pointer';
                el.title = stall.shopName || 'ร้านค้า';
                el.onclick = () => showShopDetails(stall); // กดเพื่อดูข้อมูล
            } else {
                // ถ้าว่าง หรือ รออนุมัติ = ว่างสำหรับลูกค้า (สีเขียว)
                el.classList.add('status-free');
                el.style.opacity = '0.5'; // ทำให้ดูจางๆ หน่อย จะได้ไม่เด่นเท่าร้านค้า
                el.title = 'พื้นที่ว่าง';
                el.style.cursor = 'default';
                el.onclick = null;
            }
        }
    });
}

// แสดง Popup ข้อมูลร้านค้า (SweetAlert2)
function showShopDetails(stall) {
    // ดึงข้อมูลร้าน (ถ้าไม่มีให้ใช้ Default)
    const shopName = stall.shopName || "ร้านค้าทั่วไป";
    const products = stall.products || "สินค้าหลากหลาย";
    const zone = stall.zone || "ทั่วไป";
    const image = stall.image || "https://placehold.co/300x200?text=Shop+Image";

    Swal.fire({
        title: `<h4 class="font-heading fw-bold">${shopName}</h4>`,
        html: `
            <div class="mb-3">
                <img src="${image}" class="img-fluid rounded shadow-sm" style="width: 100%; height: 180px; object-fit: cover;">
            </div>
            <div class="text-start px-2">
                <p class="mb-1"><span class="badge bg-danger me-2">โซน ${zone}</span> <strong>ล็อก:</strong> ${stall.label}</p>
                <p class="mb-0 text-muted small"><i class="fa-solid fa-tag me-1"></i> <strong>สินค้าแนะนำ:</strong></p>
                <p class="mb-0 fw-bold text-dark">${products}</p>
            </div>
        `,
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#333',
        showClass: { popup: 'animate__animated animate__fadeInUp' },
        hideClass: { popup: 'animate__animated animate__fadeOutDown' }
    });
}

// ฟังก์ชันเช็คที่จอดรถ (จำลอง)
function checkParking() {
    const free = Math.floor(Math.random() * 20) + 5;
    Swal.fire({
        title: 'สถานะที่จอดรถ',
        html: `<h1 class="text-success fw-bold" style="font-size: 4rem;">${free}</h1><p>ที่ว่าง (คัน)</p>`,
        confirmButtonColor: '#2e7d32'
    });
}