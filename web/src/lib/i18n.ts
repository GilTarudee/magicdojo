// Translations + design tokens ported verbatim from the Magic Dojo design prototype.

export type Lang = "th" | "en";

export const TR = {
  th: {
    cart: "ตะกร้า", heroKicker: "Single · สต๊อกจริง", heroTitle: "Magic Dojo", heroSub: "ขาย Single Magic: The Gathering พร้อมส่งทั่วไทย", heroCta: "เลือกซื้อการ์ด", heroCta2: "จัดการสต๊อก", featured: "การ์ดแนะนำ", seeAll: "ดูทั้งหมด", from: "เริ่มต้น",
    shopTitle: "ค้นหาการ์ด", results: "รายการ", search: "ค้นหาชื่อการ์ด…", colors: "สี", condition: "ระดับ", set: "เซ็ต", searchSet: "ค้นหาเซ็ต หรือพิมพ์ตัวย่อ…", sort: "เรียงตาม", reset: "ล้างตัวกรอง", allSets: "ทุกเซ็ต", noResults: "ไม่พบการ์ดที่ตรงกับเงื่อนไข",
    sortFeatured: "แนะนำ", sortLow: "ราคาน้อย→มาก", sortHigh: "ราคามาก→น้อย", sortName: "ชื่อ A→Z", allWord: "ทั้งหมด",
    add: "หยิบใส่ตะกร้า", addShort: "เพิ่ม", sold: "หมด", backToShop: "กลับไปหน้าร้าน", chooseCondition: "เลือกสภาพการ์ด", each: "/ใบ",
    cartTitle: "ตะกร้าสินค้า", summary: "สรุปคำสั่งซื้อ", subtotal: "ยอดรวมสินค้า", shipping: "ค่าจัดส่ง", total: "รวมทั้งสิ้น", checkout: "ชำระเงิน", continue: "เลือกซื้อต่อ", remove: "ลบ", free: "ฟรี",
    emptyCart: "ตะกร้ายังว่างอยู่", emptyCartSub: "ลองเลือกการ์ดที่อยากได้แล้วเพิ่มลงตะกร้า",
    orderPlaced: "สั่งซื้อสำเร็จ", orderThanks: "ขอบคุณที่อุดหนุน Magic Dojo — ทีมงานจะติดต่อยืนยันเร็วๆ นี้", orderId: "เลขที่คำสั่งซื้อ",
    coContact: "ข้อมูลผู้รับ", coName: "ชื่อ-นามสกุล", coPhone: "เบอร์โทรศัพท์", coEmail: "อีเมล", coAddress: "ที่อยู่จัดส่ง", coNote: "หมายเหตุถึงร้าน",
    coPay: "วิธีชำระเงิน", payTransfer: "โอนเงินผ่านธนาคาร", payPromptPay: "พร้อมเพย์ (PromptPay)",
    coPlace: "ยืนยันสั่งซื้อ", coPlacing: "กำลังบันทึก…", optional: "(ไม่บังคับ)",
    coErrName: "กรุณากรอกชื่อและเบอร์โทร", coErrStock: "สินค้าบางรายการมีไม่พอ กรุณากลับไปปรับจำนวนในตะกร้า", coErrGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่",
    payNote: "หลังยืนยัน ทางร้านจะแจ้งเลขบัญชี / QR พร้อมเพย์ และยืนยันออเดอร์ให้ทาง LINE หรืออีเมล",
    orderItems: "รายการสั่งซื้อ", orderStatus: "สถานะ", statusPending: "รอชำระเงิน", backHome: "กลับหน้าแรก", viewShop: "เลือกซื้อต่อ",
    ppTitle: "สแกนเพื่อจ่ายพร้อมเพย์", ppNumber: "พร้อมเพย์", bankTitle: "โอนเข้าบัญชี", payAmount: "ยอดที่ต้องชำระ", ppNotSet: "ร้านยังไม่ได้ตั้งค่าพร้อมเพย์",
    ordersTitle: "ออเดอร์", ordersSub: "คำสั่งซื้อที่เข้ามา — กดเปลี่ยนสถานะได้", noOrders: "ยังไม่มีออเดอร์", manageOrders: "ดูออเดอร์",
    colOrder: "ออเดอร์", colCustomer: "ลูกค้า", colItems: "รายการ", colTotal: "ยอดรวม", colStatus: "สถานะ", colAction: "จัดการ",
    statusPaid: "จ่ายแล้ว", statusShipped: "ส่งแล้ว", statusCancelled: "ยกเลิก", markPaid: "รับชำระ", markShipped: "ส่งของแล้ว", cancelOrder: "ยกเลิก", reopen: "เปิดใหม่",
    shopSettings: "ตั้งค่าร้าน", fldPromptpay: "เลขพร้อมเพย์ (เบอร์/บัตรปชช.)", fldBank: "ข้อมูลบัญชีธนาคาร", saved: "บันทึกแล้ว",
    costLabel: "ทุน", marginLabel: "กำไร", noCost: "ยังไม่ตั้งทุน",
    profitTitle: "กำไร-ขาดทุน", profitSub: "สรุปยอดขาย ต้นทุน และกำไรสุทธิ", viewProfit: "กำไร-ขาดทุน",
    revenue: "ยอดขายรวม", cogs: "ต้นทุนสินค้า", grossProfit: "กำไรขั้นต้น", opExpenses: "ค่าใช้จ่ายร้าน", netProfit: "กำไรสุทธิ", ordersCounted: "ออเดอร์ที่นับ (จ่าย/ส่งแล้ว)",
    expensesTitle: "ค่าใช้จ่ายร้าน", addExpense: "เพิ่มค่าใช้จ่าย", expLabel: "รายการ", expCategory: "หมวด", expAmount: "จำนวนเงิน", noExpenses: "ยังไม่มีค่าใช้จ่ายในช่วงนี้",
    thisMonth: "เดือนนี้", last30: "30 วันล่าสุด", thisYear: "ปีนี้",
    login: "เข้าสู่ระบบ", signup: "สมัครสมาชิก", logout: "ออกจากระบบ", account: "บัญชีของฉัน", password: "รหัสผ่าน",
    toSignup: "ยังไม่มีบัญชี? สมัครสมาชิก", toLogin: "มีบัญชีแล้ว? เข้าสู่ระบบ", hello: "สวัสดี",
    myOrders: "ประวัติการสั่งซื้อ", noMyOrders: "ยังไม่มีคำสั่งซื้อ", profileTitle: "ข้อมูลส่วนตัว",
    authErrMissing: "กรุณากรอกข้อมูลให้ครบ", authErrEmail: "อีเมลไม่ถูกต้อง", authErrShort: "รหัสผ่านอย่างน้อย 6 ตัว", authErrExists: "อีเมลนี้ถูกใช้แล้ว", authErrInvalid: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    adminTitle: "จัดการสต๊อก", adminSub: "ปรับราคาและจำนวนคงเหลือแยกตามสภาพการ์ด — บันทึกอัตโนมัติ", card: "การ์ด", status: "สถานะ", adminNote: "แก้ตัวเลขในช่องเพื่ออัปเดตทันที สต๊อกจะตัดอัตโนมัติเมื่อมีการสั่งซื้อ",
    catalogTitle: "เพิ่มการ์ดเข้าสต๊อก", catalogSub: "เลือกชุดแล้วกดเพิ่มการ์ดที่ต้องการเข้าสต๊อกของร้าน", backToAdmin: "กลับไปหน้าจัดการสต๊อก", searchName: "ค้นหาชื่อการ์ด…", setsHeading: "ชุดการ์ด", showing: "แสดง", ofWord: "จาก", cardsWord: "ใบ", pagePrev: "ก่อนหน้า", pageNext: "ถัดไป", inStockShort: "ในสต๊อก", rateTitle: "เรทแลกเปลี่ยน", rateNote: "ราคาตั้งต้นดึงจากราคาตลาดสากล (USD) × เรท — กดที่ราคาในตารางเพื่อแก้ได้เอง (* = แก้ราคาเอง)", fetchRate: "ดึงเรทล่าสุด", resetMarket: "รีเซ็ตราคาตามตลาด", rateUpdated: "อัปเดตเรทล่าสุด", marketReset: "รีเซ็ตราคาตามตลาดแล้ว",
    stTitles: ["รายการทั้งหมด", "สต๊อกรวม", "ใกล้หมด"],
    inStock: "พร้อมส่ง", low: "เหลือน้อย", out: "ของหมด", onlyLeft: "เหลือ", unitsLeft: "ใบ",
    vNonFoil: "ปกติ", vFoil: "ฟอยล์", marketShort: "ตลาด",
    featAdd: "ติดแนะนำ", featOn: "แนะนำอยู่", perDollar: "/ $1",
    addedToast: "เพิ่มลงตะกร้าแล้ว",
    factSet: "เซ็ต", factRarity: "ความหายาก", factType: "ประเภท",
    rar: { M: "มิธิค", R: "แรร์", U: "อันคอมมอน", C: "คอมมอน" } as Record<string, string>,
    cn: { W: "ขาว", U: "น้ำเงิน", B: "ดำ", R: "แดง", G: "เขียว", M: "หลายสี", C: "ไร้สี" } as Record<string, string>,
    footAddr: "สาทร กรุงเทพฯ · หยุดวันจันทร์", footHours: "เปิด 15:00 – 23:00 น. (อังคาร–ศุกร์)", footHours2: "เปิด 12:00 – 23:00 น. (เสาร์–อาทิตย์)", footPay: "รับโอน / พร้อมเพย์",
    shipFree: "ฟรีเมื่อครบ ฿1,000",
    heroStats: [{ num: "200+", label: "การ์ดในสต๊อก" }, { num: "24hr.", label: "จัดส่งเร็ว" }],
    valueProps: [
      { no: "01", title: "ขายเฉพาะใบเดี่ยว", desc: "ไม่มีกล่องสุ่ม เลือกได้ตรงใบที่ต้องการ" },
      { no: "02", title: "สต๊อกจริงทุกใบ", desc: "จำนวนคงเหลืออัปเดตจริง ตัดสต๊อกทันที" },
      { no: "03", title: "มีทั้งฟอยล์และแบบปกติ", desc: "แยกราคาตามสภาพการ์ดอย่างชัดเจน" },
    ],
  },
  en: {
    cart: "Cart", heroKicker: "Singles · Live stock", heroTitle: "Magic Dojo", heroSub: "We sell Magic: The Gathering. Pickup in store or ship across Thailand.", heroCta: "Browse singles", heroCta2: "Stock admin", featured: "Featured singles", seeAll: "See all", from: "from",
    shopTitle: "Browse cards", results: "results", search: "Search card name…", colors: "Colors", condition: "Condition", set: "Set", searchSet: "Search set or type code…", sort: "Sort by", reset: "Clear filters", allSets: "All sets", noResults: "No cards match your filters",
    sortFeatured: "Featured", sortLow: "Price: low→high", sortHigh: "Price: high→low", sortName: "Name A→Z", allWord: "All",
    add: "Add to cart", addShort: "Add", sold: "Sold out", backToShop: "Back to shop", chooseCondition: "Choose condition", each: "each",
    cartTitle: "Your cart", summary: "Order summary", subtotal: "Subtotal", shipping: "Shipping", total: "Total", checkout: "Checkout", continue: "Continue shopping", remove: "Remove", free: "Free",
    emptyCart: "Your cart is empty", emptyCartSub: "Find a card you want and add it to your cart",
    orderPlaced: "Order placed", orderThanks: "Thanks for shopping at Magic Dojo — we will confirm with you shortly.", orderId: "Order number",
    coContact: "Your details", coName: "Full name", coPhone: "Phone", coEmail: "Email", coAddress: "Shipping address", coNote: "Note to shop",
    coPay: "Payment method", payTransfer: "Bank transfer", payPromptPay: "PromptPay",
    coPlace: "Place order", coPlacing: "Placing…", optional: "(optional)",
    coErrName: "Please enter your name and phone number", coErrStock: "Some items are out of stock — please adjust quantities in your cart", coErrGeneric: "Something went wrong, please try again",
    payNote: "After you confirm, we'll send our bank account / PromptPay QR and confirm your order via LINE or email.",
    orderItems: "Order items", orderStatus: "Status", statusPending: "Awaiting payment", backHome: "Back home", viewShop: "Continue shopping",
    ppTitle: "Scan to pay with PromptPay", ppNumber: "PromptPay", bankTitle: "Bank transfer", payAmount: "Amount to pay", ppNotSet: "Shop has not set up PromptPay yet",
    ordersTitle: "Orders", ordersSub: "Incoming orders — click to change status", noOrders: "No orders yet", manageOrders: "Orders",
    colOrder: "Order", colCustomer: "Customer", colItems: "Items", colTotal: "Total", colStatus: "Status", colAction: "Action",
    statusPaid: "Paid", statusShipped: "Shipped", statusCancelled: "Cancelled", markPaid: "Mark paid", markShipped: "Mark shipped", cancelOrder: "Cancel", reopen: "Reopen",
    shopSettings: "Shop settings", fldPromptpay: "PromptPay ID (phone / national ID)", fldBank: "Bank account details", saved: "Saved",
    costLabel: "Cost", marginLabel: "Margin", noCost: "No cost set",
    profitTitle: "Profit & Loss", profitSub: "Revenue, costs and net profit", viewProfit: "P&L",
    revenue: "Revenue", cogs: "Cost of goods", grossProfit: "Gross profit", opExpenses: "Operating expenses", netProfit: "Net profit", ordersCounted: "Orders counted (paid/shipped)",
    expensesTitle: "Operating expenses", addExpense: "Add expense", expLabel: "Item", expCategory: "Category", expAmount: "Amount", noExpenses: "No expenses in this period",
    thisMonth: "This month", last30: "Last 30 days", thisYear: "This year",
    login: "Log in", signup: "Sign up", logout: "Log out", account: "My account", password: "Password",
    toSignup: "No account? Sign up", toLogin: "Have an account? Log in", hello: "Hi",
    myOrders: "Order history", noMyOrders: "No orders yet", profileTitle: "Profile",
    authErrMissing: "Please fill in all fields", authErrEmail: "Invalid email", authErrShort: "Password must be at least 6 characters", authErrExists: "This email is already registered", authErrInvalid: "Incorrect email or password",
    adminTitle: "Stock admin", adminSub: "Adjust price and quantity per condition — saves automatically", card: "Card", status: "Status", adminNote: "Edit any field to update instantly. Stock auto-decrements on checkout.",
    catalogTitle: "Add cards to stock", catalogSub: "Pick a set, then add the cards you want to your store stock", backToAdmin: "Back to stock admin", searchName: "Search card name…", setsHeading: "Sets", showing: "Showing", ofWord: "of", cardsWord: "cards", pagePrev: "Prev", pageNext: "Next", inStockShort: "in stock", rateTitle: "Exchange rate", rateNote: "Default prices pull from global market (USD) × rate. Click any price below to edit; * = manually set.", fetchRate: "Fetch latest", resetMarket: "Reset to market", rateUpdated: "Rate updated", marketReset: "Prices reset to market",
    stTitles: ["Total SKUs", "Total stock", "Low stock"],
    inStock: "In stock", low: "Low stock", out: "Out of stock", onlyLeft: "Only", unitsLeft: "left",
    vNonFoil: "Non-foil", vFoil: "Foil", marketShort: "mkt",
    featAdd: "Feature", featOn: "Featured", perDollar: "/ $1",
    addedToast: "Added to cart",
    factSet: "Set", factRarity: "Rarity", factType: "Type",
    rar: { M: "Mythic", R: "Rare", U: "Uncommon", C: "Common" } as Record<string, string>,
    cn: { W: "White", U: "Blue", B: "Black", R: "Red", G: "Green", M: "Multicolor", C: "Colorless" } as Record<string, string>,
    footAddr: "Sathorn, Bangkok · Closed Mondays", footHours: "Open 15:00 – 23:00 (Tue–Fri)", footHours2: "Open 12:00 – 23:00 (Sat–Sun)", footPay: "Bank transfer / PromptPay",
    shipFree: "Free over ฿1,000",
    heroStats: [{ num: "200+", label: "cards in stock" }, { num: "24hr.", label: "fast dispatch" }],
    valueProps: [
      { no: "01", title: "Singles only", desc: "No sealed boxes — pick the exact card you need" },
      { no: "02", title: "Live stock counts", desc: "Real quantities, decremented at checkout" },
      { no: "03", title: "Foil & Non-foil", desc: "Clear price per card condition" },
    ],
  },
} as const;

export type Dict = (typeof TR)[Lang];

// Mana / color swatches and card-art gradients (from the prototype)
export const MANA: Record<string, { bg: string; fg: string }> = {
  W: { bg: "#efe7c8", fg: "#3a2f12" }, U: { bg: "#2f6fb0", fg: "#ffffff" }, B: { bg: "#2b2b30", fg: "#ffffff" }, R: { bg: "#c23b2e", fg: "#ffffff" }, G: { bg: "#2f8f4f", fg: "#ffffff" },
};
export const GRAD: Record<string, [string, string]> = {
  W: ["#e9dfbe", "#bdb084"], U: ["#3f7fbe", "#1c4a80"], B: ["#41414a", "#16161a"], R: ["#cc4636", "#7e1b14"], G: ["#36975a", "#185a31"], C: ["#c2bcad", "#8d8678"], M: ["#cda94e", "#8a6a22"],
};

export const COLOR_CHIPS = ["all", "W", "U", "B", "R", "G", "M", "C"] as const;

export function colorKey(colors: string[]): string {
  return colors.length > 1 ? "M" : colors[0] || "C";
}

export function glyphFor(ck: string): string {
  return ck === "M" ? "✦" : ck === "C" ? "◇" : ck;
}

export function artBgFor(ck: string): string {
  const g = GRAD[ck] || GRAD.C;
  return `radial-gradient(120% 95% at 50% -8%, ${g[0]}, ${g[1]})`;
}

export type Badge = { kind: "in" | "low" | "out"; text: string; bg: string; fg: string; border: string };

export function badgeFor(total: number, L: Dict): Badge {
  if (total <= 0)
    return { kind: "out", text: L.out, bg: "var(--panel2)", fg: "var(--muted)", border: "var(--bw) solid var(--line)" };
  if (total <= 3)
    return { kind: "low", text: L.low, bg: "var(--accent)", fg: "var(--accentInk)", border: "none" };
  return { kind: "in", text: L.inStock, bg: "transparent", fg: "var(--ink)", border: "var(--bw) solid var(--line)" };
}

// Round up to nearest 5 baht, like the prototype's fmt()
export function fmtBaht(n: number): string {
  return (Math.ceil(n / 5) * 5).toLocaleString("en-US");
}
export function roundBaht(n: number): number {
  return Math.ceil(n / 5) * 5;
}

export const SHIPPING_FEE = 50;
export const FREE_SHIPPING_THRESHOLD = 1000;
export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}
