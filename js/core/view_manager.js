
// /js/core/view_manager.js

/**
 * @fileoverview Manages the visibility of different UI sections and views.
 */

import { updateState } from './state_manager.js';
import { MAIN_SECTION_IDS, VIEW_IDS } from '../config/constants.js';

/**
 * Hides all main content sections except the one specified.
 * Main content sections are identified by the '.main-content-section' class.
 * @param {string} targetSectionId - The ID (including '#') of the main section to KEEP VISIBLE.
 */
export function showMainContentSection(targetSectionId) {
    console.log(`[View Manager] Activating main section: ${targetSectionId}`);

    // Hide all sections first
    document.querySelectorAll('.main-content-section').forEach(section => {
        if (section) {
            // Check if the section we are about to hide is the one currently tracked as active
            // if(section.id && `#${section.id}` === currentState.activeMainSectionId && `#${section.id}` !== targetSectionId) {
                // Optional: Add cleanup logic here if needed when hiding a section
            // }
            section.classList.add('hidden');
        }
    });

    // Show the target section
    const targetElement = document.querySelector(targetSectionId);
    if (targetElement) {
        targetElement.classList.remove('hidden');
        // Update the state to track the currently active main section
        updateState({ activeMainSectionId: targetSectionId });
    } else {
        console.error(`[View Manager] Error: Main section element not found for ID: ${targetSectionId}`);
        // Fallback: Show the default flow section if target is invalid
        const defaultSection = document.querySelector(MAIN_SECTION_IDS.FLOW);
        if (defaultSection) {
            defaultSection.classList.remove('hidden');
            updateState({ activeMainSectionId: MAIN_SECTION_IDS.FLOW });
             console.warn(`[View Manager] Fallback: Showing default section ${MAIN_SECTION_IDS.FLOW}`);
        } else {
            console.error('[View Manager] Fatal Error: Default main section not found!');
        }
    }
}

/**
 * Switches the visible view *within* the '#subject-grade-lesson-flow' container.
 * Shows the specified view ('subjects', 'grades', 'lessons') and hides others.
 * @param {'subjects' | 'grades' | 'lessons'} viewName - The name of the view to display.
 */
export function updateCardFlowView(viewName) {
    const parentContainer = document.getElementById('subject-grade-lesson-flow');
    if (!parentContainer) {
        console.error("[View Manager] updateCardFlowView Error: Parent container '#subject-grade-lesson-flow' not found.");
        return;
    }

    console.log(`[View Manager] Switching card flow view to: ${viewName}`);

    // Hide all specific view containers within the parent
    parentContainer.querySelectorAll('.view-container').forEach(container => {
        if (container) container.classList.add('hidden');
    });

    let containerIdToShow;
    switch (viewName) {
        case 'subjects':
            containerIdToShow = VIEW_IDS.SUBJECTS;
            break;
        case 'grades':
            containerIdToShow = VIEW_IDS.GRADES;
            break;
        case 'lessons':
            containerIdToShow = VIEW_IDS.LESSONS;
            break;
        default:
            console.error(`[View Manager] updateCardFlowView Error: Invalid view name "${viewName}".`);
            // Fallback to subjects view
            containerIdToShow = VIEW_IDS.SUBJECTS;
            viewName = 'subjects'; // Correct the viewName for state update
            console.warn(`[View Manager] Fallback: Showing subjects view.`);
            break;
    }

    const targetViewContainer = document.getElementById(containerIdToShow);
    if (targetViewContainer) {
        // Ensure the parent '#subject-grade-lesson-flow' is visible
        if (parentContainer.classList.contains('hidden')) {
            console.warn('[View Manager] Parent #subject-grade-lesson-flow was hidden. Making it visible.');
            parentContainer.classList.remove('hidden');
             // updateState activeMainSection needs to be handled by the caller or higher logic
        }
        targetViewContainer.classList.remove('hidden');
        targetViewContainer.style.opacity = '0'; // Start fade-in
        // Trigger reflow before adding class
        void targetViewContainer.offsetWidth;
        targetViewContainer.style.transition = 'opacity 0.4s ease-in-out';
        targetViewContainer.style.opacity = '1';


        // Update state for the current *sub-view* within the main flow
        updateState({ currentCardView: viewName });
    } else {
        console.error(`[View Manager] updateCardFlowView Error: Container element not found for ID: ${containerIdToShow}`);
    }
}

/**
 * Hides all elements with the class 'main-content-section' EXCEPT the one specified.
 * @param {string} excludedSectionId - The ID (including '#') of the element to NOT hide.
 */
export function hideAllSectionsExcept(excludedSectionId) {
     console.log(`[View Manager] Hiding all main sections except ${excludedSectionId}`);
     document.querySelectorAll('.main-content-section').forEach(section => {
         if (section && section.id && `#${section.id}` !== excludedSectionId) {
             section.classList.add('hidden');
         } else if (section && section.id === excludedSectionId.substring(1)) {
             section.classList.remove('hidden'); // Ensure the excluded one is visible
         }
     });
}


console.log('[View Manager] Module Initialized.');