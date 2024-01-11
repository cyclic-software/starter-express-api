function getYesterdaysDate() {
    const today = new Date();
    const yesterday = new Date(today);

    // Trừ đi một ngày
    yesterday.setDate(yesterday.getDate() - 1);

    // Kiểm tra ngày trong tuần (0 là Chủ nhật, 6 là Thứ bảy)
    if (yesterday.getDay() === 0) {
        // Nếu là Chủ nhật, trả về thứ Sáu (trừ thêm 2 ngày)
        yesterday.setDate(yesterday.getDate() - 2);
    } else if (yesterday.getDay() === 6) {
        // Nếu là Thứ bảy, trả về thứ Sáu (trừ thêm 1 ngày)
        yesterday.setDate(yesterday.getDate() - 1);
    }

    // Định dạng ngày
    const dd = String(yesterday.getDate()).padStart(2, "0");
    const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yyyy = yesterday.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}
module.exports = getYesterdaysDate 