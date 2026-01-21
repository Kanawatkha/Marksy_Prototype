/* =========================================
   MOCK DATABASE (ฐานข้อมูลจำลอง - Updated for Customer & Multi-Market)
   สำหรับ Marksy Prototype (Upgraded)
   ========================================= */

// 1. ข้อมูลรายชื่อตลาด (Markets Data)
const marketsData = [
    {
        id: 1,
        name: "ตลาดนัด 18 คอร์ด ราชพฤกษ์",
        location: "14/54 หมู่ 18 ถ.ราชพฤกษ์ ต.บางพลับ อ.ปากเกร็ด จ.นนทบุรี",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80",
        description: "ตลาดนัดยอดฮิตย่านราชพฤกษ์ ที่จอดรถกว้างขวาง รองรับคนเดินกว่า 1,000 คน/วัน มีดนตรีสดและลานเบียร์",
        openHours: "16:00 - 23:00 น.",
        totalStalls: 40,
        availableStalls: 18
    },
    {
        id: 2,
        name: "ตลาดเป็นกันเอง ปากเกร็ด",
        location: "19 ซอยแจ้งวัฒนะ-ปากเกร็ด 19 จ.นนทบุรี",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
        description: "ตลาดชุมชน บรรยากาศอบอุ่น เน้นของกินและเสื้อผ้า ราคาประหยัด",
        openHours: "15:00 - 21:00 น.",
        totalStalls: 30,
        availableStalls: 5
    },
    {
        id: 3,
        name: "ตลาดนัดลุงชิน อ่อนนุช 39",
        location: "อ่อนนุช 39 เขตสวนหลวง กทม.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        description: "แหล่งรวม Street Food ยอดนิยมในย่านอ่อนนุช เดินทางสะดวก",
        openHours: "17:00 - 23:00 น.",
        totalStalls: 80,
        availableStalls: 25
    }
];

// ฟังก์ชัน Helper เพื่อสร้างข้อมูลล็อก (จะได้ไม่ต้องก๊อปวางเยอะ)
// เพิ่ม shopName และ products สำหรับล็อกที่จองแล้ว
function createLayout(marketId) {
    return [
        // --- Zone A (Left Column) ---
        { id: 'stall-a01', label: 'A-01', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'คาเฟ่/เครื่องดื่ม', shopName: 'ร้านกาแฟโบราณ ลุงสม', products: 'กาแฟโบราณ, โอเลี้ยง, ชาเนส', image: 'https://placehold.co/150x150?text=Coffee' },
        { id: 'stall-a02', label: 'A-02', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'อาหารจานเดียว', shopName: 'ข้าวมันไก่เจ๊ไก่', products: 'ข้าวมันไก่ต้ม, ไก่ทอด', image: 'https://placehold.co/150x150?text=Chicken' },
        { id: 'stall-a03', label: 'A-03', price: 300, size: '2.5x2.5 ม.', status: 'free', zone: 'อาหารจานเดียว' },
        { id: 'stall-a04', label: 'A-04', price: 300, size: '2.5x2.5 ม.', status: 'free', zone: 'ของทานเล่น' },
        { id: 'stall-a05', label: 'A-05', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'ยำ/ส้มตำ', shopName: 'ยำแซ่บเวอร์', products: 'ยำรวมมิตร, ยำวุ้นเส้น', image: 'https://placehold.co/150x150?text=Yum' },

        // --- Zone B (Center Pink - เสื้อผ้า 12 ล็อก) ---
        { id: 'stall-b01', label: 'B1', price: 150, size: '2x2 ม.', status: 'booked', zone: 'เสื้อผ้าแฟชั่น', shopName: 'Vintage Style', products: 'เสื้อยืดวินเทจ, กางเกงยีนส์' },
        { id: 'stall-b02', label: 'B2', price: 150, size: '2x2 ม.', status: 'pending', zone: 'เสื้อผ้าแฟชั่น', shopName: 'NB Clothes (รออนุมัติ)', products: 'เสื้อผ้าแฟชั่นหญิง' },
        { id: 'stall-b03', label: 'B3', price: 150, size: '2x2 ม.', status: 'booked', zone: 'กระเป๋า/รองเท้า', shopName: 'Bag Shop', products: 'กระเป๋าผ้า, กระเป๋าถือ' },
        { id: 'stall-b04', label: 'B4', price: 150, size: '2x2 ม.', status: 'free', zone: 'เสื้อผ้าแฟชั่น' },
        { id: 'stall-b05', label: 'B5', price: 150, size: '2x2 ม.', status: 'free', zone: 'เครื่องประดับ' },
        { id: 'stall-b06', label: 'B6', price: 150, size: '2x2 ม.', status: 'booked', zone: 'เสื้อผ้ามือสอง', shopName: '2nd Hand Good', products: 'เดรสเกาหลีมือสอง' },
        { id: 'stall-b07', label: 'B7', price: 150, size: '2x2 ม.', status: 'booked', zone: 'เสื้อผ้าแฟชั่น', shopName: 'Fashion Week', products: 'เสื้อครอป, กระโปรง' },
        { id: 'stall-b08', label: 'B8', price: 150, size: '2x2 ม.', status: 'booked', zone: 'เคสโทรศัพท์', shopName: 'Case D', products: 'เคส iPhone, Samsung' },
        { id: 'stall-b09', label: 'B9', price: 150, size: '2x2 ม.', status: 'free', zone: 'กิ๊ฟช็อป' },
        { id: 'stall-b10', label: 'B10', price: 150, size: '2x2 ม.', status: 'free', zone: 'เสื้อผ้าแฟชั่น' },
        { id: 'stall-b11', label: 'B11', price: 150, size: '2x2 ม.', status: 'booked', zone: 'ทำเล็บ', shopName: 'Nail Art', products: 'บริการทำเล็บเจล' },
        { id: 'stall-b12', label: 'B12', price: 150, size: '2x2 ม.', status: 'booked', zone: 'เสื้อผ้าแฟชั่น', shopName: 'Dress Up', products: 'ชุดเดรสทำงาน' },

        // --- Zone M (Center Green - อาหาร 15 ล็อก) ---
        { id: 'stall-m01', label: 'M1', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m02', label: 'M2', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m03', label: 'M3', price: 200, size: '2x2 ม.', status: 'pending', zone: 'หม่าล่า', shopName: 'หม่าล่าไฟลุก (รออนุมัติ)', products: 'หม่าล่าปิ้งย่าง' },
        { id: 'stall-m04', label: 'M4', price: 200, size: '2x2 ม.', status: 'booked', zone: 'ลูกชิ้นทอด', shopName: 'ลูกชิ้นปลาระเบิด', products: 'ลูกชิ้นทอด, ไส้กรอก' },
        { id: 'stall-m05', label: 'M5', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m06', label: 'M6', price: 200, size: '2x2 ม.', status: 'free', zone: 'เครื่องดื่ม' },
        { id: 'stall-m07', label: 'M7', price: 200, size: '2x2 ม.', status: 'booked', zone: 'บาบีคิว', shopName: 'BBQ King', products: 'บาร์บีคิวหมู, ไก่' },
        { id: 'stall-m08', label: 'M8', price: 200, size: '2x2 ม.', status: 'pending', zone: 'ขนมหวาน', shopName: 'บัวลอย (รออนุมัติ)', products: 'บัวลอยไข่หวาน' },
        { id: 'stall-m09', label: 'M9', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m10', label: 'M10', price: 200, size: '2x2 ม.', status: 'free', zone: 'ผลไม้' },
        { id: 'stall-m11', label: 'M11', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m12', label: 'M12', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },
        { id: 'stall-m13', label: 'M13', price: 200, size: '2x2 ม.', status: 'free', zone: 'ยำ/ส้มตำ' },
        { id: 'stall-m14', label: 'M14', price: 200, size: '2x2 ม.', status: 'free', zone: 'ไก่ทอด' },
        { id: 'stall-m15', label: 'M15', price: 200, size: '2x2 ม.', status: 'free', zone: 'Street Food' },

        // --- Zone A (Bottom Row) ---
        { id: 'stall-a07', label: 'A-07', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'สเต็ก', shopName: 'สเต็กนายพล', products: 'สเต็กหมู, ไก่, ปลา' },
        { id: 'stall-a08', label: 'A-08', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'อาหารญี่ปุ่น', shopName: 'Sushi Express', products: 'ซูชิ, ข้าวหน้าปลา' },
        { id: 'stall-a09', label: 'A-09', price: 300, size: '2.5x2.5 ม.', status: 'free', zone: 'ทั่วไป' },
        { id: 'stall-a10', label: 'A-10', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'เครื่องดื่ม', shopName: 'Smoothie Healthy', products: 'น้ำผลไม้ปั่น' },
        { id: 'stall-a11', label: 'A-11', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'หมูกระทะ', shopName: 'หมูกระทะชุดเล็ก', products: 'หมูกระทะพร้อมทาน' },
        { id: 'stall-a12', label: 'A-12', price: 300, size: '2.5x2.5 ม.', status: 'booked', zone: 'จิ้มจุ่ม', shopName: 'จิ้มจุ่มแซ่บ', products: 'ชุดจิ้มจุ่มหมู/ทะเล' }
    ];
}

// 2. ข้อมูลผังตลาด (Market Layout & Stalls)
// สร้าง Layout ให้ครบทั้ง 3 ตลาด (ใน Prototype นี้ใช้ Layout เดียวกันไปก่อนเพื่อความง่าย)
const marketLayouts = {
    1: createLayout(1),
    2: createLayout(2), // Clone ข้อมูลสำหรับตลาด 2
    3: createLayout(3)  // Clone ข้อมูลสำหรับตลาด 3
};

// 3. ข้อมูลการจอง (Bookings) - สำหรับหน้า Owner
const bookingsData = [
    {
        bookingId: 'BK-001',
        marketId: 1,
        marketName: "ตลาดนัด 18 คอร์ด ราชพฤกษ์",
        stallId: 'stall-a01',
        stallLabel: 'A-01 (คาเฟ่)',
        renterName: "ร้านกาแฟโบราณ ลุงสม",
        renterPhone: "081-234-5678",
        price: 300,
        date: "2025-01-20",
        status: 'confirmed',
        slipImage: 'assets/img/qr-payment.png'
    },
    {
        bookingId: 'BK-002',
        marketId: 1,
        marketName: "ตลาดนัด 18 คอร์ด ราชพฤกษ์",
        stallId: 'stall-b02',
        stallLabel: 'B2 (เสื้อผ้า)',
        renterName: "ร้านเสื้อยืดวินเทจ",
        renterPhone: "099-876-5432",
        price: 150,
        date: "2025-01-21",
        status: 'pending',
        slipImage: 'assets/img/qr-payment.png'
    },
    {
        bookingId: 'BK-003',
        marketId: 1,
        marketName: "ตลาดนัด 18 คอร์ด ราชพฤกษ์",
        stallId: 'stall-m03',
        stallLabel: 'M3 (หม่าล่า)',
        renterName: "หม่าล่าไฟลุก",
        renterPhone: "089-999-8888",
        price: 200,
        date: "2025-01-21",
        status: 'pending',
        slipImage: 'assets/img/qr-payment.png'
    },
    {
        bookingId: 'BK-004',
        marketId: 1,
        marketName: "ตลาดนัด 18 คอร์ด ราชพฤกษ์",
        stallId: 'stall-m08',
        stallLabel: 'M8 (ขนมหวาน)',
        renterName: "บัวลอยไข่หวาน",
        renterPhone: "086-555-4444",
        price: 200,
        date: "2025-01-21",
        status: 'pending',
        slipImage: 'assets/img/qr-payment.png'
    }
];

// 4. Global State
let currentSelectedStall = null;
let currentCart = {};
let currentMarketId = null;