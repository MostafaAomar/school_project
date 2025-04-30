
// /js/components/advice_display.js

/**
 * @fileoverview Renders the study advice content into the designated area.
 */

import { getCurrentState } from '../core/state_manager.js';
import { DATA_PATH } from '../config/constants.js';

/**
 * Displays the loaded study advice data in the UI.
 * @param {object} adviceData - The advice data object loaded from JSON.
 * @param {HTMLElement} containerElement - The DOM element to render the advice into.
 */
export function displayAdviceContent(adviceData, containerElement) {
    const state = getCurrentState();
    const currentLang = state.currentLanguage || 'ar';

    if (!containerElement) {
        console.error("[Advice Display] Error: Container element not provided.");
        return;
    }

    containerElement.innerHTML = ''; // Clear previous content (e.g., loading message)

    if (!adviceData || Object.keys(adviceData).length === 0) {
        console.warn("[Advice Display] Warning: No advice data available to display.");
        containerElement.innerHTML = '<p class="info-message">لا توجد نصائح متاحة حالياً.</p>';
        return;
    }

    console.log("[Advice Display] Rendering advice categories...");

    // Iterate through the categories in the advice data
    for (const categoryKey in adviceData) {
        // Ensure it's a direct property, not from the prototype chain
        if (Object.hasOwnProperty.call(adviceData, categoryKey)) {
            const category = adviceData[categoryKey];

            // Validate category structure
            if (!category || typeof category !== 'object' || !category.title || !category.tips || !Array.isArray(category.tips)) {
                console.warn(`[Advice Display] Skipping invalid category data for key "${categoryKey}":`, category);
                continue; // Skip this category
            }

            console.log(`[Advice Display] Processing category: ${categoryKey}`);

            // Create elements for the category
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'advice-category'; // Use class from CSS

            const categoryTitleElement = document.createElement('h3');
            categoryTitleElement.className = 'advice-category-title';
            // Get title in current language, fallback to English, then formatted key
            categoryTitleElement.textContent = category.title[currentLang]
                || category.title['en']
                || categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format key nicely
            categoryDiv.appendChild(categoryTitleElement);

            // Process tips within the category
            if (category.tips.length > 0) {
                category.tips.forEach((tip, index) => {
                    // Validate tip structure
                    if (!tip || typeof tip !== 'object' || !tip.title || !tip.text) {
                        console.warn(`[Advice Display] Skipping invalid tip in category "${categoryKey}", index ${index}:`, tip);
                        return; // Continue to next tip
                    }

                    const tipDiv = document.createElement('div');
                    tipDiv.className = 'advice-tip'; // Use class from CSS

                    const tipTitleElement = document.createElement('h4');
                    tipTitleElement.textContent = tip.title[currentLang] || tip.title['en'] || `نصيحة ${index + 1}`;
                    tipDiv.appendChild(tipTitleElement);

                    const tipTextElement = document.createElement('p');
                    tipTextElement.classList.add('advice-tip-text', 'auto-direction'); // Apply auto-direction
                    // Handle text object or plain string
                    if (typeof tip.text === 'object' && tip.text !== null) {
                        tipTextElement.textContent = tip.text[currentLang] || tip.text['en'] || '...';
                    } else if (typeof tip.text === 'string') {
                        tipTextElement.textContent = tip.text;
                    } else {
                        tipTextElement.textContent = 'محتوى غير متوفر.';
                    }
                    tipDiv.appendChild(tipTextElement);
                    categoryDiv.appendChild(tipDiv);
                });
            } else {
                // If a category has no tips
                const noTipsMessage = document.createElement('p');
                noTipsMessage.className = 'info-message';
                noTipsMessage.textContent = 'لا توجد نصائح محددة في هذا القسم حالياً.';
                categoryDiv.appendChild(noTipsMessage);
            }

            // Add the completed category to the main container
            containerElement.appendChild(categoryDiv);
        }
    }
    console.log("[Advice Display] Finished rendering advice.");
}

console.log('[Advice Display] Module Initialized.');