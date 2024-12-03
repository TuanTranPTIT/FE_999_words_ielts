class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="/css/header.css">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
            <div id="header" class="header">
                <div class="logo" id="logo">
                    <img src="/img/logo.png" alt="999IELTS">
                </div>
                <nav class="navigation">
                    <a href="homepage.html" class="nav-link" id="home">Home</a>
                    <a href="translate.html" class="nav-link" id="translate">Translate</a>
                    <a href="chatbot.html" class="nav-link" id="chatbot">Chatbot</a>
                </nav>
                <div class="user-menu">
                    <div class="user-icon" id="userMenuToggle">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="change-password.html">Change Password</a>
                        <a href="#" id="logoutButton">Logout</a>
                    </div>
                </div>
            </div>  
        `;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.getElementById("logo").addEventListener("click", () => {
            window.location.href = "homepage.html";
        });

        // Lấy tất cả các thẻ a trong menu
        const links = this.shadowRoot.querySelectorAll('.nav-link');

        // Lấy đường dẫn hiện tại
        const currentPath = window.location.pathname;

        // Lặp qua các thẻ a
        links.forEach(link => {
            const href = link.getAttribute('href'); // Lấy giá trị href của thẻ a

            // Kiểm tra nếu href khớp với đường dẫn hiện tại
            if (currentPath.includes(href)) {
                link.classList.add('active'); // Thêm class active
            } else {
                link.classList.remove('active'); // Xóa class active (nếu có)
            }
        });

        // Handle user menu toggle
        const userMenuToggle = this.shadowRoot.getElementById("userMenuToggle");
        const userDropdown = this.shadowRoot.getElementById("userDropdown");

        userMenuToggle.addEventListener("click", () => {
            userDropdown.style.display =
                userDropdown.style.display === "block" ? "none" : "block";
        });

        // Handle logout
        this.shadowRoot.getElementById("logoutButton").addEventListener("click", () => {
            const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
            if (!token) {
                alert("You are not logged in!");
                window.location.href = "login.html";
                return;
            }

            // Gửi yêu cầu logout tới API
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({ token });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:8080/user/logout", requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Logout failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then((result) => {
                    console.log(result);
                    if (result.code === "1000") {
                        alert("Logged out successfully!");
                        localStorage.removeItem("authToken"); // Xóa token khỏi localStorage
                        window.location.href = "login.html";
                    } else {
                        alert("Logout failed! Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred. Please try again.");
                });
        });
    }
}

customElements.define('header-component', HeaderComponent);