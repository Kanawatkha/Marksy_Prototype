/* =========================================
   OWNER LOGIC (ระบบเจ้าของตลาด - เวอร์ชันอัปเกรด)
   รองรับ Complex Map & Approval System
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // กำหนดตลาดปัจจุบัน (Fix ไว้ที่ ID 1 สำหรับ Prototype)
    window.currentMarketId = 1;

    initOwnerDashboard();
});

function initOwnerDashboard() {
    refreshMapStatus(window.currentMarketId);
    updateDashboardStats();
}

/* -----------------------------------------
   1. จัดการแสดงผลแผนที่ (Map Engine)
   ----------------------------------------- */
function refreshMapStatus(marketId) {
    const layout = marketLayouts[marketId];
    if (!layout) return;

    // เคลียร์ Event เก่าและสีเก่าก่อน
    layout.forEach(stall => {
        const el = document.getElementById(stall.id);
        if (el) {
            // ล้าง Class สถานะเดิม
            el.classList.remove('status-booked', 'status-pending', 'status-free');

            // ล้าง Event Click เดิม
            el.onclick = null;
            el.style.cursor = 'default';
            el.removeAttribute('title');

            // ใส่สถานะใหม่
            if (stall.status === 'booked') {
                el.classList.add('status-booked');
                // หาชื่อคนจองมาใส่ใน Tooltip
                const booking = bookingsData.find(b => b.stallId === stall.id && b.status === 'confirmed');
                const renterName = booking ? booking.renterName : 'ไม่ระบุชื่อ';
                el.title = `จองแล้ว: ${renterName}`;

            } else if (stall.status === 'pending') {
                el.classList.add('status-pending');
                el.style.cursor = 'pointer';
                el.title = 'รออนุมัติ (คลิกเพื่อจัดการ)';

                // *** ไฮไลท์: คลิกเพื่อเปิดหน้าต่างอนุมัติ ***
                el.onclick = () => openApprovalModal(stall);

            } else {
                // สถานะว่าง (ในหน้า Owner ไม่ต้องทำอะไรกับล็อกว่าง)
                el.classList.add('status-free');
                el.title = 'ว่าง';
            }
        }
    });
}

/* -----------------------------------------
   2. คำนวณตัวเลขสถิติ (Real-time Stats)
   ----------------------------------------- */
function updateDashboardStats() {
    // 1. รายได้รวม (เฉพาะที่ Confirm แล้ว)
    const totalIncome = bookingsData
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0);

    // 2. จำนวนรายการรออนุมัติ
    const pendingCount = bookingsData.filter(b => b.status === 'pending').length;

    // 3. อัตราการเช่า (Occupancy Rate)
    const layout = marketLayouts[window.currentMarketId];
    const totalStalls = layout.length;
    const occupiedStalls = layout.filter(s => s.status === 'booked').length;
    const occupancyRate = Math.round((occupiedStalls / totalStalls) * 100);

    // อัปเดต UI พร้อม Animation ตัวเลขนิดหน่อย
    animateValue("stat-income", totalIncome, " ฿");
    document.getElementById("stat-pending").innerText = `${pendingCount} รายการ`;
    document.getElementById("stat-occupancy").innerText = `${occupancyRate}%`;
}

// ฟังก์ชันวิ่งตัวเลขสวยๆ (Utility)
function animateValue(id, end, suffix) {
    const obj = document.getElementById(id);
    // แปลงตัวเลขปัจจุบันเป็น int (ถ้าไม่มีให้เริ่ม 0)
    let start = parseInt(obj.innerText.replace(/,/g, '')) || 0;
    if (start === end) return;

    let duration = 500;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerText = value.toLocaleString() + suffix;
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    requestAnimationFrame(animation);
}

/* -----------------------------------------
   3. ระบบอนุมัติ (Approval System)
   ----------------------------------------- */
function openApprovalModal(stall) {
    // 1. หาข้อมูล Booking ของล็อกนี้
    const booking = bookingsData.find(b => b.stallId === stall.id && b.status === 'pending');

    if (!booking) {
        Swal.fire('Error', 'ไม่พบข้อมูลการจอง', 'error');
        return;
    }

    // 2. แสดง Popup ตรวจสอบ (ใช้ SweetAlert2 แบบ Custom HTML)
    Swal.fire({
        title: `<h4 class="font-heading">คำขอเช่า: ${stall.label}</h4>`,
        html: `
            <div class="text-start bg-light p-3 rounded mb-3">
                <p class="mb-1"><strong>ร้านค้า:</strong> ${booking.renterName}</p>
                <p class="mb-1"><strong>เบอร์โทร:</strong> ${booking.renterPhone}</p>
                <p class="mb-1"><strong>ราคา:</strong> <span class="text-primary fw-bold">${booking.price} บ.</span></p>
                <p class="mb-0"><strong>วันที่จอง:</strong> ${booking.date}</p>
            </div>
            <div class="text-center">
                <p class="small text-muted mb-2">หลักฐานการโอนเงิน</p>
                <img src="${booking.slipImage}" class="img-fluid border rounded shadow-sm" style="max-height: 200px;">
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#2e7d32',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="fa-solid fa-check me-1"></i> อนุมัติ',
        cancelButtonText: '<i class="fa-solid fa-xmark me-1"></i> ปฏิเสธ',
        focusConfirm: true
    }).then((result) => {
        if (result.isConfirmed) {
            approveBooking(booking);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // กรณีปฏิเสธ (Prototype ยังไม่ต้องทำ Logic ลึก)
            Swal.fire('ปฏิเสธคำขอแล้ว', 'สถานะล็อกจะกลับเป็นว่าง', 'info');
        }
    });
}

function approveBooking(booking) {
    // 1. อัปเดตสถานะใน bookingsData
    booking.status = 'confirmed';

    // 2. อัปเดตสถานะใน marketLayouts (ผังตลาด)
    const layout = marketLayouts[window.currentMarketId];
    const stallIndex = layout.findIndex(s => s.id === booking.stallId);
    if (stallIndex !== -1) {
        layout[stallIndex].status = 'booked';
    }

    // 3. แจ้งเตือนสำเร็จ
    Swal.fire({
        icon: 'success',
        title: 'อนุมัติเรียบร้อย!',
        text: 'อัปเดตสถานะล็อกและยอดเงินเข้าระบบแล้ว',
        timer: 1500,
        showConfirmButton: false
    });

    // 4. รีเฟรชหน้าจอทันที (เปลี่ยนสี + อัปเดตตัวเลข)
    initOwnerDashboard();
}