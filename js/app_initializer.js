// /js/app_initializer.js

/**
 * @fileoverview Main entry point for the application.
 * Loads necessary data and initializes all UI components and handlers.
 * Includes state persistence across session refreshes.
 */
import { loadSubjectsList, loadAdviceContent, loadGradesList, loadLessonsList, loadLessonDetails } from './core/data_loader.js';
// --- Import the new restore function and getCurrentState ---
import { cacheData, updateState, restoreStateFromSession, getCurrentState } from './core/state_manager.js';
import { showMainContentSection, updateCardFlowView, hideAllSectionsExcept } from './core/view_manager.js';
import { initializeTabsController, loadAndDisplayLesson as loadAndDisplayLessonInTabs, resetTabsComponent } from './components/tabs_controller.js'; // Renamed import
import { displayAdviceContent } from './components/advice_display.js';
import { initializeMainNavHandler } from './navigation/main_nav_handler.js';
import { initializeResponsiveNavHandler } from './navigation/responsive_nav_handler.js';
import { initializeHomeButtonHandler } from './navigation/home_handler.js';
import { initializeContentNavigator, displaySubjectCards, displayGradeCards, displayLessonCards } from './navigation/content_navigator.js'; // Import display functions
import { initializeAutoDirection } from './utils/language_direction.js';
import { preloadSounds } from './utils/sound_manager.js';
import { MAIN_SECTION_IDS } from './config/constants.js';

/**
 * Displays a fatal error message to the user, replacing page content.
 * @param {string} message - The primary error message.
 * @param {string} details - More specific details about the error.
 */
function showFatalError(message, details) {
    // ... (showFatalError function remains the same) ...
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
     const contentWrapper = document.getElementById('page-content-wrapper');
     if (contentWrapper) {
          contentWrapper.innerHTML = errorHtml;
     } else {
           document.body.innerHTML = errorHtml; // Fallback
     }
     console.error("FATAL ERROR:", message, details); // Log error too
}


/**
 * Main application initialization function.
 * Attempts to restore state, fetches essential data, sets up UI handlers,
 * and displays the appropriate initial view (restored or default).
 */
async function initializeApplication() {
    console.log('[App Initializer] Starting application initialization (v3 - Persistence)...');

    // --- 1. Attempt to Restore State ---
    const stateRestored = restoreStateFromSession();
    const initialState = getCurrentState(); // Get state *after* potential restore

    try {
        // --- 2. Load Essential Data Concurrently ---
        // These are usually needed regardless of restored state (e.g., for Home button)
        console.log('[App Initializer] Fetching essential data...');
        const [subjectsList, adviceContent] = await Promise.all([
            loadSubjectsList(),
            loadAdviceContent()
        ]);
        console.log('[App Initializer] Essential data fetched.');

        // Check subjects list - still critical for basic function
        if (!subjectsList) {
             throw new Error("CRITICAL: Failed to load the main subjects list (subjects.json). Cannot proceed.");
        }
        if (!adviceContent) {
             console.warn("[App Initializer] Failed to load advice content. Proceeding without it.");
        }

        // --- 3. Initialize UI Handlers & Utilities ---
        // These should generally be initialized regardless of state
        console.log('[App Initializer] Initializing UI components & handlers...');
        initializeMainNavHandler();
        initializeResponsiveNavHandler();
        initializeHomeButtonHandler();
        initializeContentNavigator(); // Navigator listeners needed
        initializeTabsController();   // Tabs component needs init for structure/listeners
        initializeAutoDirection();
        preloadSounds();
        console.log('[App Initializer] UI components & handlers initialized.');

        // --- 4. Populate Common/Static Content ---
        // Display Advice (always shown in its own section)
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

        // --- 5. Determine and Render Initial View ---
        console.log('[App Initializer] Determining initial view...');

        if (stateRestored && initialState.activeMainSectionId) {
            console.log(`[App Initializer] Restoring view based on sessionStorage: Section=${initialState.activeMainSectionId}, CardView=${initialState.currentCardView}`);

            // Ensure correct main section is visible
            showMainContentSection(initialState.activeMainSectionId);

            // Update main nav button active state
            activateMainNavButton(initialState.activeMainSectionId);

            // Handle specific restored view
            switch (initialState.activeMainSectionId) {
                case MAIN_SECTION_IDS.FLOW:
                    // Restore card flow view (subjects, grades, or lessons)
                    await restoreCardFlowView(initialState, subjectsList);
                    break;

                case MAIN_SECTION_IDS.TABS:
                    // Restore lesson/quiz tab view (load the specific lesson)
                     resetTabsComponent(); // Reset first to ensure clean state
                     if (initialState.selectedSubjectId && initialState.selectedGradeId && initialState.selectedLessonId && initialState.selectedLessonTitle) {
                          try {
                               console.log(`[App Initializer] Restoring lesson view: ${initialState.selectedLessonId}`);
                               const lessonBasicInfo = {
                                   lessonId: initialState.selectedLessonId,
                                   title: initialState.selectedLessonTitle // Pass the restored title object
                               };
                               await loadAndDisplayLessonInTabs(initialState.selectedSubjectId, initialState.selectedGradeId, lessonBasicInfo);
                               // loadAndDisplayLessonInTabs should handle switching to the lesson tab
                          } catch (error) {
                               console.error("[App Initializer] Error restoring lesson view:", error);
                               alert("حدث خطأ أثناء استعادة الدرس السابق. سيتم عرض قائمة المواد.");
                               // Fallback to default view if lesson restore fails
                               displaySubjectCards(subjectsList);
                               showMainContentSection(MAIN_SECTION_IDS.FLOW);
                               updateCardFlowView('subjects');
                               activateMainNavButton(MAIN_SECTION_IDS.FLOW);
                          }
                     } else {
                          console.warn("[App Initializer] Cannot restore TABS view: Missing required IDs/Title in restored state. Falling back to default.");
                          // Fallback if state is inconsistent
                          displaySubjectCards(subjectsList);
                          showMainContentSection(MAIN_SECTION_IDS.FLOW);
                          updateCardFlowView('subjects');
                          activateMainNavButton(MAIN_SECTION_IDS.FLOW);
                     }
                    break;

                // For other sections like Advice, Handwriting etc., just showing the section is enough.
                case MAIN_SECTION_IDS.ADVICE:
                case MAIN_SECTION_IDS.HANDWRITING:
                case MAIN_SECTION_IDS.CHATBOT:
                case MAIN_SECTION_IDS.ARABIC:
                case MAIN_SECTION_IDS.SOURCES:
                case MAIN_SECTION_IDS.CONTACT:
                    // showMainContentSection was already called.
                    // activateMainNavButton was already called.
                    console.log(`[App Initializer] Restored to simple section: ${initialState.activeMainSectionId}`);
                    break;

                default:
                    console.warn(`[App Initializer] Unknown activeMainSectionId restored: ${initialState.activeMainSectionId}. Falling back to default.`);
                     // Fallback to default view
                     displaySubjectCards(subjectsList);
                     showMainContentSection(MAIN_SECTION_IDS.FLOW);
                     updateCardFlowView('subjects');
                     activateMainNavButton(MAIN_SECTION_IDS.FLOW);
            }

        } else {
            // --- No Restored State: Set Default Initial View ---
            console.log('[App Initializer] No valid state restored. Setting default initial view.');
            displaySubjectCards(subjectsList); // Display Subjects using the loaded list
            showMainContentSection(MAIN_SECTION_IDS.FLOW); // Show the card flow section
            updateCardFlowView('subjects'); // Show the 'subjects' view within the flow
            activateMainNavButton(MAIN_SECTION_IDS.FLOW); // Highlight 'Subjects' nav button
            resetTabsComponent(); // Ensure tabs are in default state
        }

        console.log('[App Initializer] Application initialization complete!');

    } catch (error) {
        console.error('[App Initializer] CRITICAL ERROR during initialization:', error);
        // --- Use the showFatalError function ---
        showFatalError(
             "حدث خطأ غير متوقع أثناء تحميل التطبيق.",
             error.message + (error.stack ? `\nStack: ${error.stack}` : '')
        );
        // --------------------------------------
    }
}

/**
 * Restores the correct view within the card flow section based on restored state.
 * Loads necessary data (grades/lessons) if needed.
 * @param {object} restoredState - The state object restored from sessionStorage.
 * @param {Array} subjectsList - The already loaded list of subjects.
 */
async function restoreCardFlowView(restoredState, subjectsList) {
    const { currentCardView, selectedSubjectId, selectedGradeId, selectedSubjectTitle, selectedGradeTitle, currentLanguage } = restoredState;
    console.log(`[App Initializer] Restoring card flow view: ${currentCardView}`);

    // Always ensure the flow section is visible
    showMainContentSection(MAIN_SECTION_IDS.FLOW);

    switch (currentCardView) {
        case 'subjects':
            displaySubjectCards(subjectsList || []);
            updateCardFlowView('subjects');
            break;

        case 'grades':
             if (!selectedSubjectId || !selectedSubjectTitle) {
                  console.warn("[App Initializer] Cannot restore 'grades' view: Missing subject ID/Title. Falling back to subjects.");
                  displaySubjectCards(subjectsList || []);
                  updateCardFlowView('subjects');
                  return;
             }
             console.log(`[App Initializer] Restoring grades for subject: ${selectedSubjectId}`);
             // Show loading in grades grid while fetching
             updateCardFlowView('grades'); // Switch view first
             const gradesGrid = document.getElementById('grades-grid');
             if(gradesGrid) gradesGrid.innerHTML = '<p class="info-message">جاري استعادة قائمة الصفوف...</p>';

             try {
                 const gradesList = await loadGradesList(selectedSubjectId);
                 if (gradesList) {
                      displayGradeCards(gradesList, selectedSubjectTitle[currentLanguage] || selectedSubjectId);
                 } else {
                      console.error(`[App Initializer] Failed to load grades list for restored subject ${selectedSubjectId}.`);
                       if(gradesGrid) gradesGrid.innerHTML = '<p class="error-message">فشل تحميل قائمة الصفوف.</p>';
                 }
             } catch (error) {
                  console.error(`[App Initializer] Error loading grades for restored subject ${selectedSubjectId}:`, error);
                   if(gradesGrid) gradesGrid.innerHTML = '<p class="error-message">خطأ في تحميل قائمة الصفوف.</p>';
             }
            break;

        case 'lessons':
            if (!selectedSubjectId || !selectedGradeId || !selectedGradeTitle) {
                 console.warn("[App Initializer] Cannot restore 'lessons' view: Missing subject/grade ID/Title. Falling back to subjects.");
                 displaySubjectCards(subjectsList || []);
                 updateCardFlowView('subjects');
                 return;
            }
             console.log(`[App Initializer] Restoring lessons for grade: ${selectedGradeId}`);
             // Show loading in lessons grid while fetching
              updateCardFlowView('lessons'); // Switch view first
             const lessonsGrid = document.getElementById('lessons-grid');
              if(lessonsGrid) lessonsGrid.innerHTML = '<p class="info-message">جاري استعادة قائمة الدروس...</p>';

             try {
                 const lessonsList = await loadLessonsList(selectedSubjectId, selectedGradeId);
                 if (lessonsList) {
                      displayLessonCards(lessonsList, selectedGradeTitle[currentLanguage] || selectedGradeId);
                 } else {
                      console.error(`[App Initializer] Failed to load lessons list for restored grade ${selectedGradeId}.`);
                      if(lessonsGrid) lessonsGrid.innerHTML = '<p class="error-message">فشل تحميل قائمة الدروس.</p>';
                 }
             } catch (error) {
                  console.error(`[App Initializer] Error loading lessons for restored grade ${selectedGradeId}:`, error);
                  if(lessonsGrid) lessonsGrid.innerHTML = '<p class="error-message">خطأ في تحميل قائمة الدروس.</p>';
             }
            break;

        default:
             console.warn(`[App Initializer] Invalid card view in restored state: ${currentCardView}. Falling back to subjects.`);
             displaySubjectCards(subjectsList || []);
             updateCardFlowView('subjects');
    }
}

/**
 * Updates the visual state of the main navigation buttons.
 * @param {string} activeSectionId - The ID (including '#') of the section whose button should be active.
 */
function activateMainNavButton(activeSectionId) {
     const mainNavContainer = document.querySelector('.main-nav-container .main-nav-links');
     if (mainNavContainer) {
          mainNavContainer.querySelectorAll('.main-nav-button').forEach(btn => {
               if (btn.getAttribute('data-main-target') === activeSectionId) {
                    btn.classList.add('active');
               } else {
                    btn.classList.remove('active');
               }
          });
     } else {
          console.warn("[App Initializer] Could not find main nav container to update active button state.");
     }
}


// --- Start Initialization ---
// Use DOMContentLoaded to ensure HTML is ready before manipulating it
document.addEventListener('DOMContentLoaded', initializeApplication);

console.log('[App Initializer] Script loaded. Waiting for DOMContentLoaded...');