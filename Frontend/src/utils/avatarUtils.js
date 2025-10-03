// Utility functions for handling avatar data

/**
 * Check if an avatar URL is valid (not a placeholder)
 * @param {string} url - The avatar URL to check
 * @returns {boolean} - True if the URL is valid, false otherwise
 */
export const isValidAvatarUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Check for placeholder values
    const placeholderValues = ['PicURL', 'sample', 'placeholder', 'default'];
    const isPlaceholder = placeholderValues.some(placeholder => 
        url.toLowerCase().includes(placeholder.toLowerCase())
    );
    
    if (isPlaceholder) return false;
    
    // Check if it's a valid URL format
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Check if an avatar object has a valid URL
 * @param {Object} avatar - The avatar object
 * @returns {boolean} - True if the avatar has a valid URL, false otherwise
 */
export const hasValidAvatar = (avatar) => {
    if (!avatar || typeof avatar !== 'object') return false;
    return isValidAvatarUrl(avatar.url);
};

/**
 * Get the appropriate avatar source for display
 * @param {Object} avatar - The avatar object
 * @param {string} fallbackUrl - Fallback URL if avatar is invalid
 * @returns {string|null} - The avatar URL or null if invalid
 */
export const getAvatarSource = (avatar, fallbackUrl = null) => {
    if (hasValidAvatar(avatar)) {
        return avatar.url;
    }
    return fallbackUrl;
};
