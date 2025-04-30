
// /js/navigation/main_nav_handler.js

/**
 * @fileoverview Handles clicks on the main navigation tabs (top bar)
 * to switch between major application sections (Subjects, Advice, etc.).
 */

import { showMainContentSection } from '../core/view_manager.js';

let mainNavContainer = null;

/**
 * Handles clicks within the main navigation container.
 * Activates the clicked button and shows the corresponding main content section.
 * @param {Event} event - The click event object.
 */
function handleMainNavClick(event) {
    const clickedButton = event.target.closest('.main-nav-button');
    if (!clickedButton) {
        return; // Click was not on a button
    }

    // Prevent default button action if necessary (though likely not needed for buttons)
    event.preventDefault();

    // Get the target section ID from the button's data attribute
    const targetSectionId = clickedButton.getAttribute('data-main-target');

    if (!targetSectionId) {
        console.error("[Main Nav] Clicked button is missing 'data-main-target' attribute:", clickedButton);
        return;
    }

    // Update active class on buttons
    if (mainNavContainer) {
        mainNavContainer.querySelectorAll('.main-nav-button').forEach(btn => btn.classList.remove('active'));
    } else {
         // Try finding it again if initialization failed initially
         mainNavContainer = document.querySelector('.main-nav-container');
         if(mainNavContainer) {
             mainNavContainer.querySelectorAll('.main-nav-button').forEach(btn => btn.classList.remove('active'));
         }
    }
    clickedButton.classList.add('active');

    // Show the target main content section
    showMainContentSection(targetSectionId); // From view_manager.js
}

/**
 * Initializes the main navigation handler by attaching the click listener.
 */
export function initializeMainNavHandler() {
    mainNavContainer = document.querySelector('.main-nav-container .main-nav-links'); // Target the link container
    if (!mainNavContainer) {
        console.error("[Main Nav] Initialization failed: '.main-nav-container .main-nav-links' not found.");
        return;
    }

    mainNavContainer.addEventListener('click', handleMainNavClick);
    console.log("[Main Nav] Handler Initialized and click listener attached.");
}

console.log('[Main Nav Handler] Module Initialized.');