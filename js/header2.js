document.querySelectorAll('.header2-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
        const href = this.getAttribute('href'); // Lấy URL gốc từ thẻ a
        const newUrl = `${href}?topicId=${topicId}`; // Thêm topicId vào URL
        window.location.href = newUrl; // Chuyển hướng sang URL mới
    });
});