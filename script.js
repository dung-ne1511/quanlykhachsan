
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const searchForm = document.getElementById("searchForm");
const roomCards = document.querySelectorAll(".room-card");
const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("bookingModal");
const selectedRoom = document.getElementById("selectedRoom");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");

let currentRoom = "";
let currentPrice = 0;

// Đặt ngày nhận phòng tối thiểu là hôm nay
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

checkin.min = localToday;
checkout.min = localToday;

// Ngày trả phòng phải sau ngày nhận phòng
checkin.addEventListener("change", function () {
    checkout.min = checkin.value || localToday;

    if (checkout.value && checkout.value <= checkin.value) {
        checkout.value = "";
    }
});

// Tìm phòng theo số khách và ngày
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkin.value < localToday) {
        alert("Ngày nhận phòng không được ở trong quá khứ.");
        return;
    }

    if (checkout.value <= checkin.value) {
        alert("Ngày trả phòng phải sau ngày nhận phòng.");
        return;
    }

    const guests = Number(document.getElementById("guests").value);
    let visibleCount = 0;

    roomCards.forEach(function (card) {
        const capacity = Number(card.dataset.capacity);
        const suitable = capacity >= guests;

        card.hidden = !suitable;

        if (suitable) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;

    document.getElementById("rooms").scrollIntoView({
        behavior: "smooth"
    });
});

// Mở biểu mẫu đặt phòng
document.querySelectorAll(".book-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        currentRoom = button.dataset.name;
        currentPrice = Number(button.dataset.price);

        selectedRoom.textContent =
            "Bạn chọn: " + currentRoom +
            " — " + currentPrice.toLocaleString("vi-VN") + "đ/đêm";

        bookingMessage.textContent = "";
        bookingForm.reset();
        modal.hidden = false;
    });
});

// Đóng biểu mẫu
document.getElementById("closeModal").addEventListener("click", function () {
    modal.hidden = true;
});

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.hidden = true;
    }
});

// Xác nhận đặt phòng mô phỏng
bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !/^[0-9]{10,11}$/.test(phone)) {
        alert("Vui lòng nhập họ tên và số điện thoại hợp lệ.");
        return;
    }

    const nights = Math.round(
        (new Date(checkout.value) - new Date(checkin.value)) /
        (1000 * 60 * 60 * 24)
    );

    if (!checkin.value || !checkout.value || nights <= 0) {
        bookingMessage.textContent =
            "Vui lòng chọn ngày nhận phòng và trả phòng hợp lệ ở phần tìm kiếm.";
        return;
    }

    const total = nights * currentPrice;

    bookingMessage.textContent =
        "Đặt phòng mô phỏng thành công! " +
        "Phòng: " + currentRoom +
        ". Số đêm: " + nights +
        ". Tổng tiền dự kiến: " +
        total.toLocaleString("vi-VN") + "đ.";

    bookingForm.querySelector("button[type='submit']").textContent =
        "Đã xác nhận mô phỏng";
});
