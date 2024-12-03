async function checkAuthentication() {
    if (!localStorage.getItem("authToken"))
        window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
})

// Ghi đè fetch để xử lý tự động refresh token
const originalFetch = window.fetch;

let isRefreshing = false; // Kiểm soát trạng thái làm mới token
let refreshSubscribers = []; // Danh sách các yêu cầu chờ token mới

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

window.fetch = async(url, options = {}) => {
    // Kiểm tra nếu là endpoint không cần Authorization
    const noAuthEndpoints = ["http://localhost:8080/user/logout"];
    const isNoAuth = noAuthEndpoints.some(endpoint => url.startsWith(endpoint));

    if (!isNoAuth) {
        // Lấy token từ localStorage
        let token = localStorage.getItem("authToken");

        // Thêm Authorization vào headers
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    try {
        // Gửi yêu cầu API
        const response = await originalFetch(url, options);

        if (response.status === 401) {
            console.warn("Token expired. Refreshing...");

            // Nếu đang làm mới token, đợi token mới
            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeTokenRefresh(newToken => {
                        options.headers.Authorization = `Bearer ${newToken}`;
                        resolve(originalFetch(url, options));
                    });
                });
            }

            isRefreshing = true;
            try {
                const newToken = await refreshToken();
                if (newToken) {
                    options.headers.Authorization = `Bearer ${newToken}`;
                    return originalFetch(url, options); // Gửi lại yêu cầu
                }
            } catch (error) {
                console.error("Failed to refresh token:", error);
                throw error;
            } finally {
                isRefreshing = false;
            }
        }

        return response; // Trả về phản hồi nếu không có lỗi 401
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
};

// Hàm làm mới token
async function refreshToken() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ token: localStorage.getItem("authToken") });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    try {
        const response = await originalFetch("http://localhost:8080/user/refresh", requestOptions);
        if (response.ok) {
            const result = await response.json();
            const newToken = result.result.token;
            localStorage.setItem("authToken", newToken);
            onTokenRefreshed(newToken); // Thông báo các yêu cầu đang chờ
            console.log("Token refreshed successfully!");
            return newToken;
        } else {
            console.error("Failed to refresh token:", response.status);
            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            localStorage.clear();
            window.location.href = "login.html";
            throw new Error("Session expired");
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        window.location.href = "login.html";
        throw error;
    }
}