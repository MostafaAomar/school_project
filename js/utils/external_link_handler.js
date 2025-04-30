
// /js/utils/external_link_handler.js

/**
 * @fileoverview Handles redirection for external links found in the data structure.
 */

/**
 * Attempts to redirect the user to a given URL if it's valid.
 * Logs the redirection attempt.
 * @param {string | undefined | null} url - The URL to redirect to.
 * @returns {boolean} True if redirection was attempted (URL was valid), false otherwise.
 */
export function handleExternalLink(url) {
    if (url && typeof url === 'string' && url.trim() !== '') {
        try {
            // Basic validation: Check if it looks like a plausible URL
            // This doesn't guarantee it's a working URL, just prevents obviously bad data.
            new URL(url); // This will throw if the URL format is invalid
            console.log("[External Link] Redirecting to:", url);
            window.location.href = url;
            return true; // Indicate redirection was attempted
        } catch (e) {
            console.error("[External Link] Invalid URL format provided:", url, e);
            return false; // Invalid URL format
        }
    }
    // console.log("[External Link] No valid URL provided for redirection.");
    return false; // No valid URL provided
}

console.log('[External Link Handler] Module Initialized.');