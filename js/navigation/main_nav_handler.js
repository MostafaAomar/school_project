
// /js/navigation/main_nav_handler.js


import { showMainContentSection, updateCardFlowView } from '../core/view_manager.js';
// --- Adjust Imports ---
import { resetNavigationState, getCachedData } from '../core/state_manager.js'; // Add getCachedData
import { MAIN_SECTION_IDS } from '../config/constants.js';
import { displaySubjectCards } from '../navigation/content_navigator.js'; // Add displaySubjectCards
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
        mainNavContainer = document.querySelector('.main-nav-container .main-nav-links');
        if(mainNavContainer) {
            mainNavContainer.querySelectorAll('.main-nav-button').forEach(btn => btn.classList.remove('active'));
        }
    }
    clickedButton.classList.add('active');
  // Show the target main content section
    showMainContentSection(targetSectionId);
    // --- Modified: Special handling for the Subjects/Flow button ---
    if (targetSectionId === MAIN_SECTION_IDS.FLOW) {
        console.log("[Main Nav] Subjects flow button clicked. Resetting navigation state and view.");
        resetNavigationState();         // Clear selected subject/grade/lesson IDs
        updateCardFlowView('subjects'); // Explicitly show the subjects grid view

        // --- ADDED: Re-display subject cards from cache ---
        console.log("[Main Nav] Attempting to re-display subject cards from cache.");
        const subjectsList = getCachedData('subjectsList');
        if (subjectsList) {
            displaySubjectCards(subjectsList);
            console.log("[Main Nav] Subject cards re-displayed from cache.");
        } else {
            // This shouldn't normally happen if the app initialized correctly
            console.error("[Main Nav] CRITICAL: Could not retrieve subjectsList from cache to re-display subjects. Initial load might have failed.");
            // Optionally display an error message in the grid
             const subjectsGrid = document.getElementById('subjects-grid');
             if(subjectsGrid) subjectsGrid.innerHTML = '<p class="error-message">خطأ: لم يتم العثور على قائمة المواد لعرضها.</p>';
        }}
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