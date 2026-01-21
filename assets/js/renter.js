/* =========================================
   RENTER LOGIC (ระบบผู้เช่า - Dynamic Version)
   รองรับการเลือกตลาดและจองพื้นที่แบบหลายตลาด
   ========================================= */

// เมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // 1. รับค่า ID ตลาดจาก URL (เช่น ?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const marketIdParam = parseInt(urlParams.get('id'));

    // ถ้าไม่มี ID ส่งมา หรือหาไม่เจอ ให้ใช้ ID 1 เป็นค่าเริ่มต้น
    const marketId = marketIdParam || 1;
    window.currentMarketId = marketId;

    // 2. โหลดข้อมูลตลาดมาแสดง (Header)
    loadMarketInfo(marketId);

    // 3. เรียกฟังก์ชันระบายสีแผนที่ (Map Engine)
    refreshMapStatus(marketId);
});

/* -----------------------------------------
   0. โหลดข้อมูลตลาด (New Feature)
   ----------------------------------------- */
function loadMarketInfo(id) {
    // ค้นหาข้อมูลตลาดจาก marketsData (ใน data.js)
    const market = marketsData.find(m => m.id === id);

    if (market) {
        // อัปเดตชื่อตลาด
        const nameEl = document.getElementById('map-market-name');
        if (nameEl) nameEl.innerText = market.name;

        // อัปเดตสถานที่และเวลา (ใช้ querySelector หาจากโครงสร้าง HTML)
        const headerContainer = document.querySelector('.bg-success .container');
        if (headerContainer) {
            // หา <p> ที่เป็น location
            const locationEl = headerContainer.querySelector('p.opacity-75');
            if (locationEl) locationEl.innerHTML = `<i class="fa-solid fa-location-dot me-1"></i> ${market.location}`;

            // หา <span> ที่เป็นเวลาเปิดปิด
            const timeEl = headerContainer.querySelector('.badge:first-child');
            if (timeEl) timeEl.innerHTML = `<i class="fa-regular fa-clock me-1"></i> ${market.openHours}`;
        }
    } else {
        console.error("Market not found!");
    }
}

/* -----------------------------------------
   1. ฟังก์ชันระบายสีและจัดการแผนที่ (Map Engine)
   ----------------------------------------- */
function refreshMapStatus(marketId) {
    const layout = marketLayouts[marketId]; // ดึงข้อมูลผังตาม ID ตลาด

    if (!layout) {
        console.error("Layout not found for market ID:", marketId);
        return;
    }

    // เคลียร์สถานะเก่าก่อนเสมอ (กรณีสลับตลาดไปมาในอนาคต)
    document.querySelectorAll('.zone-box').forEach(el => {
        el.className = 'zone-box'; // รีเซ็ตเหลือแค่ class พื้นฐาน
        // คืนค่าสีพื้นฐานตามโซน (Logic นี้อาจต้องปรับถ้า HTML ซับซ้อนขึ้น แต่ใน Prototype เราใช้ ID เดิม)
        if (el.id.includes('stall-a')) el.classList.add('zone-a-style');
        else if (el.id.includes('stall-b')) el.classList.add('zone-b-style');
        else if (el.id.includes('stall-m')) el.classList.add('zone-m-style');

        el.onclick = null;
        el.style.cursor = 'default';
        el.title = '';
    });

    // วนลูปข้อมูลร้านค้าเพื่อระบายสี
    layout.forEach(stall => {
        const stallElement = document.getElementById(stall.id);

        if (stallElement) {
            // ล้าง Class สถานะเก่า
            stallElement.classList.remove('status-free', 'status-booked', 'status-pending', 'status-selected');

            // ใส่ Class สถานะปัจจุบัน
            stallElement.classList.add(`status-${stall.status}`);

            // Logic เดิม: ใส่ Tooltip และ Event Click
            if (stall.status === 'free') {
                stallElement.title = `ว่าง (${stall.price} บาท/วัน) - คลิกเพื่อจอง`;
                stallElement.style.cursor = 'pointer';
                stallElement.onclick = () => openBookingModal(stall);
            } else {
                const statusText = stall.status === 'booked' ? 'จองแล้ว' : 'รออนุมัติ';
                stallElement.title = `${stall.label}: ${statusText}`;
                stallElement.style.cursor = 'not-allowed';
            }
        }
    });
}

/* -----------------------------------------
   2. ส่วนการจอง (Booking Modal) - เหมือนเดิม
   ----------------------------------------- */
let tempStallData = null;

function openBookingModal(stall) {
    tempStallData = stall;

    // ไฮไลท์ล็อกที่เลือก
    document.querySelectorAll('.status-selected').forEach(el => el.classList.remove('status-selected'));
    const el = document.getElementById(stall.id);
    if (el) el.classList.add('status-selected');

    // อัปเดตข้อมูลใน Modal
    document.getElementById('modalStallId').innerText = `ล็อก ${stall.label}`;
    document.getElementById('modalStallSize').innerText = stall.size;

    const zoneEl = document.getElementById('modalStallZone');
    zoneEl.innerText = stall.zone;
    if (stall.id.includes('stall-b')) zoneEl.className = 'fw-bold text-danger';
    else if (stall.id.includes('stall-m')) zoneEl.className = 'fw-bold text-success';
    else zoneEl.className = 'fw-bold text-dark';

    const durationSelect = document.getElementById('rentDuration');
    durationSelect.value = 'daily';
    updatePriceDisplay(stall.price, 'daily');

    durationSelect.onchange = (e) => updatePriceDisplay(stall.price, e.target.value);

    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

function updatePriceDisplay(basePrice, duration) {
    let finalPrice = basePrice;
    let unit = 'วัน';
    if (duration === 'monthly') {
        finalPrice = basePrice * 25;
        unit = 'เดือน';
    }
    document.getElementById('modalPrice').innerText = `${finalPrice.toLocaleString()} บ. / ${unit}`;

    if (tempStallData) {
        tempStallData.selectedPrice = finalPrice;
        tempStallData.selectedDuration = (duration === 'daily') ? '1 วัน' : '1 เดือน';
    }
}

/* -----------------------------------------
   3. ยืนยันการจอง (Payment & Save)
   ----------------------------------------- */
function confirmPayment() {
    const fileInput = document.getElementById('slip-upload');

    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'กรุณาแนบสลิป',
            text: 'เพื่อยืนยันการจอง โปรดอัปโหลดหลักฐานการโอนเงินครับ',
            confirmButtonColor: '#2e7d32'
        });
        return;
    }

    // สร้างข้อมูล Booking ใหม่
    const newBooking = {
        bookingId: `BK-${Math.floor(Math.random() * 9000) + 1000}`,
        marketId: window.currentMarketId,
        // ดึงชื่อตลาดจากหน้าจอโดยตรง เพื่อความถูกต้อง
        marketName: document.getElementById('map-market-name').innerText,
        stallId: tempStallData.id,
        stallLabel: tempStallData.label,
        renterName: "คุณแม่ค้า (จำลอง)",
        price: tempStallData.selectedPrice,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        slipImage: 'assets/img/qr-payment.png'
    };

    bookingsData.push(newBooking);

    // อัปเดตสถานะล็อกใน Memory
    const layout = marketLayouts[window.currentMarketId];
    const stallIndex = layout.findIndex(s => s.id === tempStallData.id);
    if (stallIndex !== -1) {
        layout[stallIndex].status = 'pending';
    }

    // ปิด Modal
    const modalEl = document.getElementById('bookingModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Success Message
    Swal.fire({
        icon: 'success',
        title: 'ส่งคำขอจองสำเร็จ!',
        html: `
            <p>ส่งข้อมูลไปยังตลาดเรียบร้อยแล้ว</p>
            <small class="text-muted">โปรดรอการอนุมัติจากเจ้าของตลาด</small>
        `,
        confirmButtonColor: '#2e7d32'
    }).then(() => {
        refreshMapStatus(window.currentMarketId);
        fileInput.value = '';
    });
}