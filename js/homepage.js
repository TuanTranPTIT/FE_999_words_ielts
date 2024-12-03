// Constants
const API_BASE_URL = "http://localhost:8080";
const AUTH_HEADERS = new Headers({
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
});

// Fetch Topics
async function fetchTopics() {
    try {
        const response = await fetch(`${API_BASE_URL}/topic/topics`, {
            method: "GET",
            headers: AUTH_HEADERS,
        });

        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();

        if (data.code === "1000" && data.result) {
            renderTopics(data.result);
        }
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
}

// Fetch Topic Score
async function fetchTopicScore(topicId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/userLearnedCount/topic?topicId=${topicId}`, { method: "GET", headers: AUTH_HEADERS }
        );

        if (!response.ok) throw new Error("Failed to fetch topic score");
        const data = await response.json();

        if (data.code === "1000" && data.result) {
            return data.result.learnedWordCount || 0;
        }
    } catch (error) {
        console.error(`Error fetching score for topic ${topicId}:`, error);
        return 0;
    }
}

// Render Topics
async function renderTopics(topics) {
    const topicsList = document.getElementById("topicsList");
    topicsList.innerHTML = ""; // Clear previous content

    for (const topic of topics) {
        const score = await fetchTopicScore(topic.id);

        const topicCard = document.createElement("a");
        topicCard.href = `detail-topic.html?topicId=${topic.id}`;
        topicCard.className = "topic-card";
        topicCard.innerHTML = `
            <img src="${topic.image}" alt="${topic.name}">
            <div class="topic-card-content">
                <div class="topic-card-title">${topic.name}</div>
                <div class="topic-card-score">Score: ${score}</div>
            </div>
        `;

        topicsList.appendChild(topicCard);
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchTopics();
});