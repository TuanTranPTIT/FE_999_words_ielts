// URL API và Headers
const API_BASE_URL = "http://localhost:8080";
const AUTH_HEADERS = new Headers({
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
});

// Lấy topicId từ URL
const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get("topicId");

// Hàm gọi API và xử lý dữ liệu
async function fetchUserLearnedData() {
    const requestOptions = {
        method: "GET",
        headers: AUTH_HEADERS,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${API_BASE_URL}/userLearnedCount/topic?topicId=${topicId}`, requestOptions);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === "1000") {
            console.log("API Data:", data.result); // Kiểm tra kết quả từ API
            updateGameRatings(data.result);
        } else {
            console.error("Unexpected API response:", data);
        }
    } catch (error) {
        console.error("Failed to fetch user learned data:", error);
    }
}

// Hàm cập nhật giao diện theo số sao
function updateGameRatings(result) {
    // Mapping game keys và số sao
    const games = {
        gameImage: "Tìm hình ảnh",
        gameListen: "Luyện nghe",
        gameSpeak: "Luyện nói",
        gameWord: "Khớp từ",
        gameListenAndWrite: "Nghe & Viết",
    };

    Object.keys(games).forEach((gameKey) => {
        const ratingValue = convertEnumToStars(result[gameKey]); // Chuyển enum thành số sao
        const gameElement = document.querySelector(`[data-game="${gameKey}"]`);

        if (gameElement) {
            // Xóa các sao cũ
            gameElement.innerHTML = "";

            // Tạo 5 sao với màu sắc tương ứng
            for (let i = 0; i < 5; i++) {
                const star = document.createElement("i");
                star.classList.add('fa-star', 'star');
                if (i < ratingValue) {
                    star.classList.add('fas', 'filled'); // Sao sáng
                } else {
                    star.classList.add('far'); // Sao viền mờ
                }
                gameElement.appendChild(star);
            }
        }
    });
}

// Hàm chuyển enum ("ZERO", "ONE", ...) sang số sao
function convertEnumToStars(enumValue) {
    const mapping = {
        ZERO: 0,
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
    };

    return mapping[enumValue] || 0; // Nếu không có giá trị, trả về 0 sao
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    fetchUserLearnedData();
});