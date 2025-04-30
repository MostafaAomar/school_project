
// /js/navigation/home_handler.js

/**
 * @fileoverview Handles the functionality of all "Home" buttons,
 * resetting the application state and UI to the initial view.
 */

import { resetNavigationState, updateState } from '../core/state_manager.js';
import { showMainContentSection, updateCardFlowView } from '../core/view_manager.js';
import { MAIN_SECTION_IDS } from '../config/constants.js';
import { resetTabsComponent } from '../components/tabs_controller.js'; // Import reset function
import { resetQuizEngine } from '../components/quiz_engine.js'; // Import quiz reset

/**
 * Resets the application to its initial state: showing the subjects view.
 * This function should be the *single source* for navigating home.
 */
export function navigateHome() {
    console.log("[Home Handler] Navigating Home...");

    // 1. Reset logical state (subject, grade, lesson, quiz status)
    resetNavigationState(); // Clears selected items and sets view to 'subjects'

    // 2. Set the active main section to the default card flow
    updateState({ activeMainSectionId: MAIN_SECTION_IDS.FLOW });
    showMainContentSection(MAIN_SECTION_IDS.FLOW);

    // 3. Ensure the view *within* the card flow section is set to subjects
    updateCardFlowView('subjects'); // Updates sub-view and makes #subjects-view-container visible

    // 4. Reset the visual state of the main navigation tabs (highlight "Subjects")
    const mainNavContainer = document.querySelector('.main-nav-container .main-nav-links');
    if (mainNavContainer) {
         mainNavContainer.querySelectorAll('.main-nav-button').forEach(btn => {
              // Check if the button targets the main flow section
              if (btn.getAttribute('data-main-target') === MAIN_SECTION_IDS.FLOW) {
                   btn.classList.add('active');
              } else {
                   btn.classList.remove('active');
              }
         });
    } else {
         console.warn("[Home Handler] Could not find main nav container to update active state.");
    }


    // 5. Reset the Lesson/Quiz Tabs Component
     resetTabsComponent();

    // 6. Reset the Quiz Engine State (score, index etc.)
     resetQuizEngine();


    // 7. Scroll to top (optional but good UX)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log("[Home Handler] Navigation Home complete.");
}

/**
 * Initializes the home button functionality by attaching a delegated event listener.
 */
export function initializeHomeButtonHandler() {
    // Use event delegation on the body to catch clicks on any home button
    document.body.addEventListener('click', (event) => {
        // Check if the clicked element or its ancestor is a home button
        if (event.target.closest('.home-button')) {
            event.preventDefault(); // Prevent default if it's a link
            console.log("[Home Handler] Home button clicked.");
            navigateHome(); // Call the centralized home navigation function
        }
        // Also handle the logo link in the header acting as a home button
        if (event.target.closest('header a.home-button-link')) {
             event.preventDefault();
             console.log("[Home Handler] Header logo link clicked.");
             navigateHome();
        }
    });

    console.log("[Home Handler] Initialized and listener attached to body.");
}

console.log('[Home Handler] Module Initialized.');