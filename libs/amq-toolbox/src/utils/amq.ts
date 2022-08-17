export function onStartPageLoaded (callback: () => void) {
    if (document.getElementById('startPage')) return;
    const loadInterval = setInterval(() => {
        if ($('#loadingScreen').hasClass('hidden')) {
            clearInterval(loadInterval);
            callback();
        }
    }, 500);
}

// TODO: add amq type declration
/* declare global {
} */