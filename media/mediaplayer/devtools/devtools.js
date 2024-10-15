(function() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    let devToolsOpened = false;
    let consecutiveDetections = 0;
    const MAX_CONSECUTIVE_DETECTIONS = 3;

    // Only trigger detection on right-click (desktop only)
    if (!isMobile) {
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            console.log("Right-click detected");
            handleDetection();
        });
    }

    // Redirect Function with confirmation (only for non-mobile users and only on right-click)
    const redirectToGoogle = () => {
        if (!isMobile) {
            if (confirm("Right-clicking is not allowed. Redirect to Google?")) {
                window.location.replace("https://www.google.com");
            } else {
                devToolsOpened = false;
                consecutiveDetections = 0;
            }
        } else {
            // For mobile users, do nothing
            devToolsOpened = false;
            consecutiveDetections = 0;
        }
    };

    // Handle detection with consecutive checks
    function handleDetection() {
        consecutiveDetections++;
        if (consecutiveDetections >= MAX_CONSECUTIVE_DETECTIONS) {
            if (!devToolsOpened) {
                devToolsOpened = true;
                redirectToGoogle();
            }
        } else {
            setTimeout(() => {
                consecutiveDetections = 0;
            }, 5000);
        }
    }

    // Disable selection and drag-drop (optional, as it might affect user experience)
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
})();
