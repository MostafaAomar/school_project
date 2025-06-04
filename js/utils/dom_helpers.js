// /js/utils/dom_helpers.js

/**
 * @fileoverview Helper functions for common DOM manipulations and rendering tasks.
 */

import { getCurrentState } from '../core/state_manager.js';
// --- IMPORT THE PROCESSOR FROM ITS NEW FILE ---
import { processSimpleMarkdown } from './markdown_processor.js';

/**
 * Renders bilingual text content safely into a container element.
 * Handles 'en' and 'ar' keys within the textObject.
 * Processes simple markdown (**bold**, \n) using the imported function before setting innerHTML.
 * @param {HTMLElement} container - The DOM element to render into.
 * @param {object|null} textObject - The object containing 'en' and 'ar' keys { en: "...", ar: "..." } or null/undefined.
 * @param {string} baseClass - The base CSS class to apply (e.g., 'question-text', 'option-text').
 * @returns {boolean} True if any text content was successfully rendered, false otherwise.
 */
export function renderBilingualText(container, textObject, baseClass) {
    if (!container) {
        console.error(`[DOM Helpers] renderBilingualText: Invalid container element provided for baseClass '${baseClass}'.`);
        return false;
    }
    container.innerHTML = ''; // Clear previous content
    let contentAdded = false;
    const state = getCurrentState();
    const currentLang = state.currentLanguage || 'ar'; // Use state or default

    // Check if the textObject itself is valid
    if (!textObject || typeof textObject !== 'object') {
        console.warn(`[DOM Helpers] renderBilingualText: Invalid or missing textObject for baseClass '${baseClass}'. Rendering empty.`);
        return false; // Indicate no content was meaningfully rendered
    }

    const textEn = textObject.en;
    const textAr = textObject.ar;

    // Determine primary and secondary text based on current language
    const primaryText = (currentLang === 'en' ? textEn : textAr);
    const secondaryText = (currentLang === 'en' ? textAr : textEn);
    const primaryLang = currentLang;
    const secondaryLang = (currentLang === 'en' ? 'ar' : 'en');

    // Display primary language content if valid
    if (primaryText && typeof primaryText === 'string' && primaryText.trim() !== '') {
        // ** Process the string using the imported function **
        const processedPrimary = processSimpleMarkdown(primaryText);
        const elPrimary = document.createElement('div');
        elPrimary.className = `${baseClass} ${baseClass}-${primaryLang}`;
        elPrimary.dir = (primaryLang === 'ar') ? 'rtl' : 'ltr';
        elPrimary.style.textAlign = (primaryLang === 'ar') ? 'right' : 'left';
        // ** Use innerHTML to render the processed HTML **
        elPrimary.innerHTML = processedPrimary;
        container.appendChild(elPrimary);
        contentAdded = true;
    }

    // Display secondary language content if valid and different from primary
    if (secondaryText && typeof secondaryText === 'string' && secondaryText.trim() !== '' && primaryText !== secondaryText) {
         // ** Process the string using the imported function **
        const processedSecondary = processSimpleMarkdown(secondaryText);
        const elSecondary = document.createElement('div');
        elSecondary.className = `${baseClass} ${baseClass}-${secondaryLang}`;
        elSecondary.dir = (secondaryLang === 'ar') ? 'rtl' : 'ltr';
        elSecondary.style.textAlign = (secondaryLang === 'ar') ? 'right' : 'left';
        // Add visual distinction for the secondary language
        elSecondary.style.fontSize = '0.95em';
        elSecondary.style.color = '#666';
        elSecondary.style.marginTop = '3px';
         // ** Use innerHTML to render the processed HTML **
        elSecondary.innerHTML = processedSecondary;
        container.appendChild(elSecondary);
        contentAdded = true;
    }


    if (!contentAdded) {
        console.warn(`[DOM Helpers] renderBilingualText: No valid text found for baseClass '${baseClass}' in textObject:`, textObject);
    }

    return contentAdded;
}

/**
 * Renders an array of external link objects into a specified container.
 * Uses data-* attributes for type/url and classes for styling.
 * @param {Array} linksArray - Array of link objects (expected format: { type: 'text'|'icon'|'image', url: '...', text?: {en, ar}, iconClass?: '...', imageUrl?: '...', altText?: {en, ar}, title?: {en, ar} }).
 * @param {HTMLElement} containerElement - The DOM element to append the list of links to.
 */
export function renderExternalLinks(linksArray, containerElement) {
    // ... (Implementation of renderExternalLinks remains unchanged) ...
     if (!containerElement) {
         console.error("[DOM Helpers] RenderLinks Error: Container element not provided.");
         return;
     }
     const state = getCurrentState();
     const currentLang = state.currentLanguage || 'ar';
     const placeholder = containerElement.querySelector('.info-message');
     containerElement.innerHTML = '';
     if (placeholder) {
         containerElement.appendChild(placeholder);
         placeholder.style.display = 'block';
     }
     if (!Array.isArray(linksArray) || linksArray.length === 0) {
         return;
     }
     if (placeholder) placeholder.style.display = 'none';
     const list = document.createElement('ul');
     list.className = 'external-links-list';
     linksArray.forEach(linkData => {
         if (!linkData || !linkData.type || !linkData.url) {
             console.warn("[DOM Helpers] RenderLinks Warning: Skipping invalid link data:", linkData);
             return;
         }
         const listItem = document.createElement('li');
         const linkElement = document.createElement('a');
         linkElement.href = linkData.url;
         linkElement.target = linkData.target || '_blank';
         linkElement.rel = 'noopener noreferrer';
         const titleText = linkData.title?.[currentLang] || linkData.title?.['en'] || '';
         if (titleText) linkElement.title = titleText;
         let labelText = '';
         switch (linkData.type.toLowerCase()) {
             case 'text':
                 const linkTextContent = linkData.text?.[currentLang] || linkData.text?.['en'] || linkData.url;
                 linkElement.textContent = linkTextContent;
                 linkElement.className = 'link-text';
                 labelText = linkTextContent;
                 break;
             case 'icon':
                 if (!linkData.iconClass) { console.warn("[DOM Helpers] RenderLinks Warning: Icon link missing 'iconClass'. Skipping:", linkData); return; }
                 const iconElement = document.createElement('i');
                 iconElement.className = linkData.iconClass.includes(' ') ? linkData.iconClass : `fas ${linkData.iconClass}`;
                 iconElement.setAttribute('aria-hidden', 'true');
                 linkElement.appendChild(iconElement);
                 linkElement.className = 'link-icon';
                 labelText = titleText || linkData.text?.[currentLang] || linkData.text?.['en'] || `Icon link to ${linkData.url.substring(0, 30)}...`;
                 if (!titleText) { const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = labelText; linkElement.appendChild(sr); }
                 break;
             case 'image':
                 if (!linkData.imageUrl || !linkData.altText) { console.warn("[DOM Helpers] RenderLinks Warning: Image link missing 'imageUrl' or 'altText'. Skipping:", linkData); return; }
                 const imgElement = document.createElement('img');
                 imgElement.src = linkData.imageUrl;
                 imgElement.alt = linkData.altText?.[currentLang] || linkData.altText?.['en'] || 'External Link Image';
                 imgElement.loading = 'lazy';
                 linkElement.appendChild(imgElement);
                 linkElement.className = 'link-image';
                 labelText = titleText || imgElement.alt;
                 break;
             default: console.warn(`[DOM Helpers] RenderLinks Warning: Unknown link type "${linkData.type}". Skipping:`, linkData); return;
         }
         linkElement.setAttribute('aria-label', labelText || linkData.url);
         listItem.appendChild(linkElement);
         list.appendChild(listItem);
     });
     containerElement.appendChild(list);
}


export function convertToEmbedUrl(url) {
    if (!url || typeof url !== 'string') return '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        if (urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.pathname.substring(1);
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        if (urlObj.pathname.includes('/embed/')) return url;
        console.warn("[DOM Helpers] Unsupported YouTube URL format:", url);
        return '';
    } catch (e) {
        console.error("[DOM Helpers] Error parsing URL:", url, e);
        return '';
    }
}


console.log('[DOM Helpers] Module Initialized.');