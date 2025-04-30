
// /js/utils/language_direction.js

/**
 * @fileoverview Applies automatic text direction (dir="auto") to elements.
 * Helps display text correctly whether it's LTR or RTL.
 */

/**
 * Applies dir="auto" and text-align="start" to an element.
 * @param {HTMLElement} element - The element to modify.
 */
function applyAutoDirection(element) {
    if (element && element.setAttribute) {
        element.setAttribute('dir', 'auto');
        // 'start' aligns text based on the detected direction (left for LTR, right for RTL)
        element.style.textAlign = 'start';
    }
}

/**
 * Initializes the auto-direction functionality.
 * Applies it to existing elements and sets up a MutationObserver
 * to handle dynamically added content or text changes.
 */
export function initializeAutoDirection() {
    console.log('[Language Direction] Initializing auto-direction observer.');

    // Apply to all elements initially present with the class
    document.querySelectorAll('.auto-direction').forEach(applyAutoDirection);

    // Use MutationObserver to watch for future changes
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            // Handle newly added elements
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node itself needs the class applied
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('.auto-direction')) {
                            applyAutoDirection(node);
                        }
                        // Check descendants of the added node
                        if (node.querySelectorAll) {
                            node.querySelectorAll('.auto-direction').forEach(applyAutoDirection);
                        }
                    }
                });
            }
            // Handle direct text changes within an observed element
            // Note: This might be overly sensitive depending on the application.
            // It checks if the parent of the text node has the class.
            /*
            if (mutation.type === 'characterData') {
                const parentElement = mutation.target.parentElement;
                if (parentElement && parentElement.classList.contains('auto-direction')) {
                    // Re-apply to the parent in case direction changed
                    applyAutoDirection(parentElement);
                }
            }
            */
        }
    });

    // Configuration for the observer:
    const config = {
        childList: true, // Observe direct children additions/removals
        subtree: true,   // Observe all descendants
        // characterData: true // Observe text changes (optional, can be performance intensive)
    };

    // Start observing the document body for changes
    observer.observe(document.body, config);

     console.log('[Language Direction] Observer started.');
}

// Expose the initialization function
console.log('[Language Direction] Module Initialized.');