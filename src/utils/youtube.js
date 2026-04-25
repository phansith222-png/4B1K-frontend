/**
 * Extract YouTube video ID from various YouTube URL formats.
 * @param {string} url - YouTube URL
 * @returns {string|null} YouTube video ID or null
 */
export const extractYouTubeID = (url) => {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();
    
    // 1. Check if it's already a raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    
    // 2. Comprehensive YouTube Regex
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    
    return (match && match[1].length === 11) ? match[1] : null;
};

/**
 * Format seconds into m:ss string.
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};


export const loadYouTubeAPI = (onReadyCallback) => {
    if (window.YT && window.YT.Player) {
        onReadyCallback();
        return;
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }

    const previousOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
        if (previousOnReady) previousOnReady();
        onReadyCallback();
    };
};
