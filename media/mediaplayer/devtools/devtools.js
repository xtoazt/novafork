(function() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    let devToolsOpened = false;
    let consecutiveDetections = 0;
    const MAX_CONSECUTIVE_DETECTIONS = 3;
    const DEBOUNCE_DELAY = 250;

    // Redirect Function with confirmation (only for non-mobile users)
    const redirectToGoogle = () => {
        if (!isMobile) {
            if (confirm("This action is not allowed. Redirect to Google?")) {
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

    // Keyboard Shortcuts Detection (Desktop only)
    if (!isMobile) {
        document.addEventListener('keydown', (event) => {
            if (
                (event.key === 'F12') ||
                (event.ctrlKey && event.shiftKey && event.key === 'I') ||
                (event.ctrlKey && event.shiftKey && event.key === 'C') ||
                (event.ctrlKey && event.shiftKey && event.key === 'J') ||
                (event.ctrlKey && event.key === 'U')
            ) {
                event.preventDefault();
                handleDetection();
            }
        });
    }

    // DevTools Detection
    const detectDevTools = () => {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            handleDetection();
        }
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(detectDevTools, DEBOUNCE_DELAY);
    });
    detectDevTools(); // Initial check on load

    // Debugger Detection
    const detectDebugger = () => {
        setInterval(() => {
            const start = Date.now();
            debugger;
            if (Date.now() - start > 100) {
                handleDetection();
            }
        }, 1000);
    };
    detectDebugger();

    // Console Detection
    const detectConsole = () => {
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
        }, 1000);
    };
    detectConsole();

    // Element.prototype.remove detection
    const originalRemove = Element.prototype.remove;
    Element.prototype.remove = function() {
        handleDetection();
        return originalRemove.apply(this, arguments);
    };

    // Performance API detection
    if (window.performance && performance.getEntriesByType) {
        setInterval(() => {
            const entries = performance.getEntriesByType("resource");
            if (entries.some(entry => entry.name.includes("devtools"))) {
                handleDetection();
            }
        }, 1000);
    }

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

    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable selection
    document.addEventListener('selectstart', (e) => e.preventDefault());

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => e.preventDefault());
})();
