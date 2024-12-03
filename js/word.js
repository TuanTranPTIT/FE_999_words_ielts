const API_BASE_URL = "http://localhost:8080";
const AUTH_HEADERS = new Headers({
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
});

// Lấy wordId và topicId từ URL
const urlParams = new URLSearchParams(window.location.search);
const wordId = parseInt(urlParams.get("id"), 10);
const topicId = parseInt(urlParams.get("topicId"), 10);

// Biến lưu danh sách các từ trong topic
let wordsInTopic = [];

// Hàm fetch danh sách các từ trong topic
async function fetchWordsInTopic() {
    try {
        const response = await fetch(`${API_BASE_URL}/word/topic?topicId=${topicId}`, {
            headers: AUTH_HEADERS,
        });
        const data = await response.json();

        if (data.code === "1000") {
            wordsInTopic = data.result; // Lưu danh sách từ
            setupNavigation(); // Thiết lập điều hướng sau khi có danh sách
        } else {
            console.error("Failed to fetch words in topic:", data.message);
        }
    } catch (error) {
        console.error("Error fetching words in topic:", error);
    }
}

// Hàm fetch chi tiết từ
async function fetchWordDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/word?id=${wordId}`, {
            headers: AUTH_HEADERS,
        });
        const data = await response.json();

        if (data.code === "1000") {
            renderWordDetails(data.result);
        } else {
            console.error("Failed to fetch word details:", data.message);
        }
    } catch (error) {
        console.error("Error fetching word details:", error);
    }
}

// Hàm render chi tiết từ
function renderWordDetails(word) {
    // Gán thông tin từ vào giao diện
    document.querySelector(".word-image").src = word.image;
    console.log(word.name)
    document.querySelector(".word-name").textContent = word.name;
    document.querySelector(".word-pronunciation span").textContent = word.pronunciation;
    document.querySelector(".word-type").textContent = word.type;
    document.querySelector(".word-meaning").textContent = word.definition;

    // Xử lý phát âm
    const pronunciationIcon = document.querySelector(".word-pronunciation i");
    pronunciationIcon.addEventListener("click", () => {
        const audio = new Audio(word.audio);
        audio.play();
    });
}

// Hàm fetch ví dụ
async function fetchExamples() {
    try {
        const response = await fetch(`${API_BASE_URL}/example/word?wordId=${wordId}`, {
            headers: AUTH_HEADERS,
        });
        const data = await response.json();

        if (data.code === "1000") {
            renderExamples(data.result);
        } else {
            console.error("Failed to fetch examples:", data.message);
        }
    } catch (error) {
        console.error("Error fetching examples:", error);
    }
}

// Hàm render ví dụ
function renderExamples(examples) {
    const examplesContainer = document.querySelector(".examples");
    examplesContainer.innerHTML = ""; // Xóa nội dung cũ

    if (examples.length > 0) {
        examples.forEach(example => {
            const exampleItem = document.createElement("div");
            exampleItem.classList.add("example-item");

            exampleItem.innerHTML = `
                <span>${example.name}</span>
                <i class="fas fa-volume-up play-example-audio" data-audio="${example.audio}"></i>
            `;

            examplesContainer.appendChild(exampleItem);
        });

        // Thêm sự kiện click cho các nút phát âm
        document.querySelectorAll(".play-example-audio").forEach(icon => {
            icon.addEventListener("click", () => {
                const audioSrc = icon.getAttribute("data-audio");
                if (audioSrc) {
                    const audio = new Audio(audioSrc);
                    audio.play();
                }
            });
        });
    } else {
        examplesContainer.innerHTML = "<p>Không có ví dụ nào cho từ này.</p>";
    }
}

// Hàm điều hướng giữa các từ
function setupNavigation() {
    const prevButton = document.querySelector(".btn-prev");
    const nextButton = document.querySelector(".btn-next");

    // Lấy vị trí hiện tại của từ trong danh sách
    const currentIndex = wordsInTopic.findIndex(word => word.id === wordId);

    // Cập nhật trạng thái của nút
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= wordsInTopic.length - 1;

    // Xử lý sự kiện click cho nút Quay lại
    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            const prevWordId = wordsInTopic[currentIndex - 1].id;
            window.location.href = `word.html?id=${prevWordId}&topicId=${topicId}`;
        }
    });

    // Xử lý sự kiện click cho nút Tiếp
    nextButton.addEventListener("click", () => {
        if (currentIndex < wordsInTopic.length - 1) {
            const nextWordId = wordsInTopic[currentIndex + 1].id;
            window.location.href = `word.html?id=${nextWordId}&topicId=${topicId}`;
        }
    });
}

// Hàm khởi chạy
function init() {
    if (!wordId || !topicId) {
        alert("Không tìm thấy thông tin từ cần hiển thị!");
        return;
    }

    fetchWordsInTopic();
    fetchWordDetails();
    fetchExamples();
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", init);