(function() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    let devToolsOpened = false;
    let consecutiveDetections = 0;
    const MAX_CONSECUTIVE_DETECTIONS = 3;
    const DEBOUNCE_DELAY = 250;

    // Always active detection for DevTools based on window size differences
    const detectDevTools = () => {
        const threshold = 200;  // Adjusted threshold
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        // Only trigger if there's a substantial size difference (and not on mobile)
        if (!isMobile && (widthDiff > threshold || heightDiff > threshold)) {
            handleDetection();
        }
    };

    // Set interval for constant DevTools detection
    setInterval(detectDevTools, 1000); // Check every 1 second

    // Debugger Detection (also constantly active)
    const detectDebugger = () => {
        setInterval(() => {
            const start = Date.now();
            debugger; // Pauses script, triggers detection
            if (Date.now() - start > 100) {
                handleDetection();
            }
        }, 2000); // Check every 2 seconds
    };
    detectDebugger();

    // Console Detection (also constantly active)
    const detectConsole = () => {
        if (isMobile) return;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        Object.defineProperty(iframe.contentWindow, 'console', {
            get: () => {
                handleDetection();
                return {};
            }
        });

        setInterval(() => {
            try {
                console.profile();
                console.profileEnd();
                if (console.clear) console.clear();
            } catch (e) {
                handleDetection();
            }
        }, 2000); // Check every 2 seconds
    };
    detectConsole();

    // Redirect Function with confirmation (only for non-mobile users)
    const redirectToGoogle = () => {
        if (!isMobile) {
            if (confirm("DevTools usage is not allowed. Redirect to Google?")) {
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

    // Disable text selection and drag-drop
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    document.addEventListener('contextmenu', (e) => {
        if (!isMobile) {
            e.preventDefault();
            redirectToGoogle();
        }
    });
})();
