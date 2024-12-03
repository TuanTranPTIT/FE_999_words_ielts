const API_BASE_URL = "http://localhost:8080";
const AUTH_HEADERS = new Headers({
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
});

// Lấy topicId từ URL
const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get("topicId");

// Fetch Topic
async function fetchTopic() {
    try {
        const response = await fetch(`${API_BASE_URL}/topic?id=${topicId}`, {
            method: "GET",
            headers: AUTH_HEADERS,
        });

        if (!response.ok) throw new Error("Failed to fetch topic");
        const data = await response.json();

        if (data.code === "1000" && data.result) {
            document.getElementById("sectionTitle").textContent = data.result.name;
        }
    } catch (error) {
        console.error("Error fetching topic:", error);
    }
}

// Fetch Topic Words
async function fetchTopicWords() {
    if (!topicId) {
        console.error("Topic ID is missing");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/word/topic?topicId=${topicId}`, {
            method: "GET",
            headers: AUTH_HEADERS,
        });

        if (!response.ok) throw new Error("Failed to fetch words");
        const data = await response.json();

        if (data.code === "1000" && data.result) {
            renderTopicWords(data.result);
        }
    } catch (error) {
        console.error("Error fetching words:", error);
    }
}

// Render Topic Words
function renderTopicWords(words) {
    const wordList = document.getElementById("wordList");
    wordList.innerHTML = ""; // Clear previous content
    words.forEach((word) => {
        const wordCard = document.createElement("div");
        wordCard.className = "word-card";
        wordCard.innerHTML = `
            <img src="${word.image}" alt="${word.name}" class="word-card-image">
            <div class="word-card-title">${word.name}</div>
        `;
        wordCard.addEventListener("click", () => {
            window.location.href = `word.html?topicId=${topicId}&&id=${word.id}`;
        });
        wordList.appendChild(wordCard);
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchTopic();
    fetchTopicWords();
});