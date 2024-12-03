// Hàm kiểm tra email hợp lệ
function validateEmail(email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailPattern.test(email);
}

// Hàm kiểm tra mật khẩu hợp lệ
function validatePassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

// Hàm kiểm tra email ngay khi người dùng nhập vào
document.getElementById("email").addEventListener("input", function() {
    const email = this.value.trim();
    const emailError = document.getElementById("emailError");

    emailError.textContent = ""; // Reset lỗi mỗi khi người dùng thay đổi email

    if (email !== "" && !validateEmail(email)) {
        emailError.textContent = "Email không hợp lệ.";
    }
});

// Hàm kiểm tra mật khẩu ngay khi người dùng nhập vào
document.getElementById("password").addEventListener("input", function() {
    const password = this.value.trim();
    const passwordError = document.getElementById("passwordError");

    passwordError.textContent = ""; // Reset lỗi mỗi khi người dùng thay đổi mật khẩu

    if (password !== "" && !validatePassword(password)) {
        passwordError.textContent = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }
});

// Hàm kiểm tra mật khẩu nhập lại ngay khi người dùng nhập vào
document.getElementById("confirmPassword").addEventListener("input", function() {
    const confirmPassword = this.value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    confirmPasswordError.textContent = ""; // Reset lỗi mỗi khi người dùng thay đổi mật khẩu nhập lại

    if (confirmPassword !== "" && confirmPassword !== password) {
        confirmPasswordError.textContent = "Mật khẩu nhập lại không khớp.";
    }
});

// Hàm xử lý đăng ký
async function handleRegister(event) {
    event.preventDefault(); // Ngăn hành động submit mặc định

    // Lấy giá trị từ các input
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Lấy các thẻ hiển thị lỗi
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    // Reset thông báo lỗi
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Kiểm tra email hợp lệ
    if (!validateEmail(email)) {
        emailError.textContent = "Email không hợp lệ.";
        return;
    }

    // Kiểm tra mật khẩu hợp lệ
    if (!validatePassword(password)) {
        passwordError.textContent =
            "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Mật khẩu nhập lại không khớp.";
        return;
    }

    // Tạo headers và payload
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        email: email,
        password: password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        // Gọi API
        const response = await fetch("http://localhost:8080/user/register", requestOptions);
        if (response.ok) {
            const result = await response.json(); // Giả sử API trả về JSON

            // Lưu email vào localStorage
            localStorage.setItem("registeredEmail", email);

            // Thông báo và chuyển hướng
            alert("Đăng ký thành công! Chuyển sang trang đăng nhập.");
            window.location.href = "login.html";
        } else {
            const errorResponse = await response.json();
            if (errorResponse.code === "USER0000") {
                emailError.textContent = "Email đã tồn tại.";
            } else if (errorResponse.code === "USER0004") {
                passwordError.textContent = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
            } else {
                alert("Đăng ký thất bại: " + errorResponse.message);
            }
        }
    } catch (error) {
        const errorResponse = await response.json();
        alert("Đăng ký thất bại: " + errorResponse.message);
    }
}

// Gắn hàm xử lý vào sự kiện submit
document.getElementById("registerForm").addEventListener("submit", handleRegister);

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Thay đổi icon khi hiển thị mật khẩu
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Quay lại icon ban đầu khi ẩn mật khẩu
    }
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('confirmPassword');
    const icon = this;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Thay đổi icon khi hiển thị mật khẩu
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Quay lại icon ban đầu khi ẩn mật khẩu
    }
});