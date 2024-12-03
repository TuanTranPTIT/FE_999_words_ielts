// Xử lý hiển thị/ẩn mật khẩu
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordInput = document.getElementById("loginPassword");
    const icon = this;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash"); // Hiển thị icon khác
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye"); // Quay lại icon ban đầu
    }
});

// Hàm kiểm tra email hợp lệ
function validateEmail(email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailPattern.test(email);
}

// Kiểm tra email ngay khi người dùng nhập vào
document.getElementById("loginEmail").addEventListener("input", function() {
    const email = this.value.trim();
    const emailError = document.getElementById("emailError");

    emailError.textContent = ""; // Xóa lỗi cũ

    if (email !== "" && !validateEmail(email)) {
        emailError.textContent = "Email không hợp lệ.";
    }
});

// Hàm xử lý logic tự động điền email và đăng nhập
function handleLogin() {
    // Tự động điền email nếu có lưu trong localStorage
    const registeredEmail = localStorage.getItem("registeredEmail");
    if (registeredEmail) {
        document.getElementById("loginEmail").value = registeredEmail;
    }

    // Sự kiện submit form đăng nhập
    document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault(); // Ngăn submit mặc định

        // Lấy giá trị từ input
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        // Lấy các thẻ hiển thị lỗi
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        // Reset lỗi cũ
        emailError.textContent = "";
        passwordError.textContent = "";

        // Kiểm tra đầu vào
        if (!validateEmail(email)) {
            emailError.textContent = "Email không hợp lệ.";
            return;
        }
        if (!password) {
            passwordError.textContent = "Vui lòng nhập mật khẩu.";
            return;
        }

        // Gửi API đăng nhập
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        };

        try {
            const response = await fetch("http://localhost:8080/user/login", requestOptions);

            if (response.ok) {
                const result = await response.json();
                console.log("Đăng nhập thành công:", result);

                // Lưu thông tin token và user vào localStorage
                localStorage.setItem("authToken", result.result.token); // Token để xác thực

                // Xóa email khỏi localStorage nếu có
                localStorage.removeItem("registeredEmail");

                // Chuyển hướng người dùng đến trang chính
                window.location.href = "homepage.html";
            } else {
                const errorResponse = await response.json();
                if (errorResponse.code === "USER0000") {
                    emailError.textContent = errorResponse.message; // Lỗi email
                } else if (errorResponse.code === "USER0007") {
                    passwordError.textContent = errorResponse.message; // Lỗi mật khẩu
                } else {
                    alert("Đăng nhập thất bại: " + errorResponse.message);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    });
}

// Kiểm tra trạng thái đăng nhập trên các trang cần thiết
function checkAuthentication() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("Bạn cần đăng nhập để truy cập trang này!");
        window.location.href = "login.html"; // Chuyển hướng về trang đăng nhập
    }
}

// Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", () => {
    // Chỉ gọi `handleLogin` nếu là trang login
    if (document.getElementById("loginForm")) {
        handleLogin();
    }

    // Kiểm tra đăng nhập nếu là trang cần bảo vệ
    if (window.location.pathname.includes("homepage.html")) {
        checkAuthentication();
    }
});