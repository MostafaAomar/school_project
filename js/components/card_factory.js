// /js/components/card_factory.js

import { DEFAULT_ICON_PATH } from '../config/constants.js';
// --- IMPORT THE PROCESSOR FROM ITS NEW FILE ---
import { processSimpleMarkdown } from '../utils/markdown_processor.js';

/**
 * Creates a card element for display in grids. Processes simple markdown in the title.
 * @param {string} title - The main text/title (can contain **bold**, \n markdown).
 * @param {string | null | undefined} iconUrl - The URL for the card's icon. Uses default if missing/invalid.
 * @param {string | null} dataAttributeName - Optional data attribute name (e.g., 'data-subject-id').
 * @param {string | number | null} dataAttributeValue - Optional value for the data attribute.
 * @returns {HTMLElement} The created card div element.
 */
export function createCardElement(title, iconUrl, dataAttributeName = null, dataAttributeValue = null) {
    const card = document.createElement('div');
    card.className = 'card'; // Use class from CSS

    // Basic error handling and default for icon
    const iconSource = (iconUrl && typeof iconUrl === 'string') ? iconUrl : DEFAULT_ICON_PATH;

    // Create and process title element
    const titleElement = document.createElement('h3');
    // ** Process the title using the imported function **
    const processedTitle = processSimpleMarkdown(title || '');
    // ** Use innerHTML to render potentially processed HTML **
    titleElement.innerHTML = processedTitle;

    // Create image element with error handling
    const imgElement = document.createElement('img');
    imgElement.src = iconSource;
    imgElement.alt = title || 'Card Image'; // Use original (unprocessed) title for alt text
    imgElement.onerror = () => {
        // Fallback if the provided icon fails to load
        console.warn(`[Card Factory] Icon failed to load: ${iconSource}. Using default.`);
        imgElement.onerror = null; // Prevent infinite loop if default also fails
        imgElement.src = DEFAULT_ICON_PATH;
    };

    // Append elements to the card
    card.appendChild(imgElement);
    card.appendChild(titleElement);

    // Add accessibility and data attributes
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0'); // Make it keyboard focusable
    if (dataAttributeName && (dataAttributeValue !== null && dataAttributeValue !== undefined)) {
        card.setAttribute(dataAttributeName, dataAttributeValue);
    }

    return card;
}

console.log('[Card Factory] Module Initialized (with Markdown title processing).');