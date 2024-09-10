document.addEventListener('DOMContentLoaded', function() {
    const noticeButton = document.getElementById('noticeButton');
    const noticeModal = document.getElementById('noticeModal');
    const closeNoticeButton = document.getElementById('closeNoticeButton');

    if (noticeButton && noticeModal && closeNoticeButton) {
        noticeButton.addEventListener('click', function() {
            noticeModal.classList.remove('hidden');
        });

        closeNoticeButton.addEventListener('click', function() {
            noticeModal.classList.add('hidden');
        });
    }
});