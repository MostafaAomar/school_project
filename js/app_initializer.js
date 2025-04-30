
// /js/app_initializer.js

/**
 * @fileoverview Main entry point for the application.
 * Loads necessary data and initializes all UI components and handlers.
 */
// Corrected import:
import { loadSubjectsList, loadAdviceContent } from './core/data_loader.js';
import { cacheData, updateState } from './core/state_manager.js';
import { showMainContentSection, updateCardFlowView } from './core/view_manager.js';
import { initializeTabsController } from './components/tabs_controller.js';
import { displayAdviceContent } from './components/advice_display.js';
import { initializeMainNavHandler } from './navigation/main_nav_handler.js';
import { initializeResponsiveNavHandler } from './navigation/responsive_nav_handler.js';
import { initializeHomeButtonHandler } from './navigation/home_handler.js';
import { initializeContentNavigator, displaySubjectCards } from './navigation/content_navigator.js';
import { initializeAutoDirection } from './utils/language_direction.js';
import { preloadSounds } from './utils/sound_manager.js';
import { MAIN_SECTION_IDS } from './config/constants.js';

/**
 * Displays a fatal error message to the user, replacing page content.
 * @param {string} message - The primary error message.
 * @param {string} details - More specific details about the error.
 */
function showFatalError(message, details) {
     const errorHtml = `
          <div style="color: red; text-align: center; padding: 50px; border: 1px solid red; margin: 20px auto; border-radius: 5px; max-width: 800px; background-color: #fff0f0;">
               <h2><i class="fas fa-exclamation-triangle"></i> خطأ فادح في التطبيق</h2>
               <p>${message}</p>
               <p style="font-family: monospace; background-color: #f8d7da; color: #721c24; padding: 5px; border-radius: 3px; font-size: 0.9em; word-wrap: break-word;">
                    <i>${details}</i>
               </p>
               <p>يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً.</p>
          </div>
       `;
     // Replace the entire content wrapper or body
     const contentWrapper = document.getElementById('page-content-wrapper');
     if (contentWrapper) {
          contentWrapper.innerHTML = errorHtml;
          // Hide other potential top-level elements like header/nav if needed
         // document.querySelector('header')?.style.display = 'none';
        //  document.querySelector('.main-nav-container')?.style.display = 'none';
     } else {
           document.body.innerHTML = errorHtml; // Fallback
     }
}


/**
 * Main application initialization function.
 * Fetches essential data and sets up UI handlers.
 */
async function initializeApplication() {
    console.log('[App Initializer] Starting application initialization (v2)...');

    try {
        // --- Load Essential Data Concurrently ---
        console.log('[App Initializer] Fetching initial data...');
        // --- CHANGE: Load subjects list first ---
        const [subjectsList, adviceContent] = await Promise.all([
            loadSubjectsList(),    // Load SUBJECTS list
            loadAdviceContent()
        ]);

        console.log('[App Initializer] Initial data fetched.');

        // Check if the crucial subjects list loaded
        if (!subjectsList) {
             throw new Error("CRITICAL: Failed to load the main subjects list (subjects.json). Cannot proceed.");
        }
        // Advice content is less critical, can proceed without it maybe
        if (!adviceContent) {
             console.warn("[App Initializer] Failed to load advice content. Proceeding without it.");
        }

        // --- Initialize UI Components and Handlers ---
        console.log('[App Initializer] Initializing UI components...');
        // ... (Initialize Nav Handlers, Content Navigator, Tabs Controller, Utilities as before) ...
        initializeMainNavHandler();
        initializeResponsiveNavHandler();
        initializeHomeButtonHandler();
        initializeContentNavigator(); // Navigator now expects separate load calls
        initializeTabsController();
        initializeAutoDirection();
        preloadSounds();

        // --- Populate Initial UI Content ---
        console.log('[App Initializer] Populating initial UI content...');

        // Display Subjects using the loaded list
        displaySubjectCards(subjectsList); // Pass the loaded list

        // Display Advice using the loaded data (handle potential null)
        const adviceContainer = document.getElementById('advice-content-display-area');
        if (adviceContainer) {
             if (adviceContent) {
                  displayAdviceContent(adviceContent, adviceContainer);
             } else {
                  adviceContainer.innerHTML = '<p class="info-message">لم يتم تحميل نصائح الدراسة.</p>';
             }
        } else {
            console.warn('[App Initializer] Advice container not found.');
        }

        // --- Set Initial View ---
        // ... (Set initial view/main nav tab active as before) ...
        showMainContentSection(MAIN_SECTION_IDS.FLOW);
        updateCardFlowView('subjects');
        document.getElementById('main-nav-subjects-btn')?.classList.add('active');


        console.log('[App Initializer] Application initialization complete!');

    } catch (error) {
        console.error('[App Initializer] CRITICAL ERROR during initialization:', error);
        showFatalError(/* ... */); // Show fatal error
    }
}
// --- Start Initialization ---
// Use DOMContentLoaded to ensure HTML is ready before manipulating it
document.addEventListener('DOMContentLoaded', initializeApplication);

console.log('[App Initializer] Script loaded. Waiting for DOMContentLoaded...');