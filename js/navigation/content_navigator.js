// /js/navigation/content_navigator.js

// Corrected import:
import { getCurrentState, updateState, getCachedData, resetNavigationState } from '../core/state_manager.js';
import { updateCardFlowView, showMainContentSection, hideAllSectionsExcept } from '../core/view_manager.js';
import { createCardElement } from '../components/card_factory.js';
import { handleExternalLink } from '../utils/external_link_handler.js';
import { loadAndDisplayLesson } from '../components/tabs_controller.js';
// Import new data loading functions
// Corrected import:
import { loadGradesList, loadLessonsList, loadSubjectsList } from '../core/data_loader.js';
import { GRID_IDS, VIEW_IDS, DEFAULT_ICON_PATH, MAIN_SECTION_IDS } from '../config/constants.js';

import { navigateHome } from './home_handler.js';

// clearGridAndShowMessage function remains the same...
function clearGridAndShowMessage(gridId, message = '', messageType = 'info') {
    const gridElement = document.getElementById(gridId);
    if (gridElement) {
        console.log(`[Content Navigator] Clearing grid: #${gridId}. Current innerHTML length: ${gridElement.innerHTML.length}`);
        gridElement.innerHTML = ''; // Clear previous cards
        console.log(`[Content Navigator] Grid #${gridId} cleared. InnerHTML length now: ${gridElement.innerHTML.length}`);
        // Check if the grid is visually empty in the Elements tab *right after* this line.
        if (message) {
            // ... add message element ...
        }
    } else {
        console.error(`[Content Navigator] clearGrid: Grid element #${gridId} not found.`);
    }
}

/**
 * Displays the list of subjects as cards. Called initially.
 * @param {Array} subjectsList - Array of subject objects from subjects.json.
 */
export function displaySubjectCards(subjectsList) {
    console.log("[Content Navigator] Displaying Subject cards...");
    const gridId = GRID_IDS.SUBJECTS;
    const state = getCurrentState();
    const currentLang = state.currentLanguage;

    clearGridAndShowMessage(gridId); // Clear previous

    if (!Array.isArray(subjectsList) || subjectsList.length === 0) {
        console.warn('[Content Navigator] No subjects data provided.');
        clearGridAndShowMessage(gridId, 'لا توجد مواد متاحة حالياً.', 'error'); // Show error if list failed loading
        return;
    }

    const subjectsGrid = document.getElementById(gridId);
    if (!subjectsGrid) return;

    subjectsList.forEach(subject => {
        if (!subject || !subject.subjectId || !subject.title?.[currentLang]) {
            console.warn("[Content Navigator] Skipping invalid subject item:", subject);
            return;
        }
    
        const card = createCardElement(
            subject.title[currentLang],
            subject.icon || DEFAULT_ICON_PATH,
            'data-subject-id',
            subject.subjectId
        );
    
        if (subject.externalLink) {
            // Handle external link directly
            card.addEventListener('click', () => handleExternalLink(subject.externalLink));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExternalLink(subject.externalLink);
                }
            });
        } else {
            // Normal subject selection
            card.addEventListener('click', () => handleSubjectSelection(subject.subjectId, subject.title));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSubjectSelection(subject.subjectId, subject.title);
                }
            });
        }
    
        subjectsGrid.appendChild(card);
    });
    console.log("[Content Navigator] Subject cards rendered.");
}

/**
 * Handles the selection of a subject. Loads and displays grades.
 * @param {string} subjectId - The ID of the selected subject.
 * @param {object} subjectTitle - The title object {en, ar} for display.
 */
async function handleSubjectSelection(subjectId, subjectTitle) {
    console.log(`[Content Navigator] Subject selected: ${subjectId}`);
    const state = getCurrentState();
    const currentLang = state.currentLanguage;

    // Update state immediately
    updateState({
        selectedSubjectId: subjectId,
        selectedSubjectTitle: subjectTitle, // Store title for display later if needed
        selectedGradeId: null,
        selectedLessonId: null,
        isQuizActive: false
    });

    // Show loading message in grades grid while fetching
    clearGridAndShowMessage(GRID_IDS.GRADES, 'جاري تحميل الصفوف...');
    updateCardFlowView('grades'); // Switch view to show loading message

    try {
        const gradesList = await loadGradesList(subjectId); // Load grades dynamically

        if (!gradesList || gradesList.length === 0) {
             // Handle case where grades file loaded but was empty or invalid
             console.warn(`No grades found for subject ${subjectId}. File might be empty or invalid.`);
             clearGridAndShowMessage(GRID_IDS.GRADES, 'لا توجد صفوف متاحة لهذه المادة.');
             // updateCardFlowView('grades') was already called
             return;
        }

        // Display grades (pass ID and Title object)
        displayGradeCards(gradesList, subjectTitle[currentLang] || subjectId);

    } catch (error) {
        
        clearGridAndShowMessage(GRID_IDS.GRADES, 'فشل تحميل قائمة الصفوف.', 'error');
       // console.error(`[Content Navigator] Error loading grades for ${subjectId}:`, error);
        // View is already 'grades'
    }
}


// Around line 118
export function displayGradeCards(gradesList, subjectDisplayName) { // <--- ADD export HERE
    console.log('[Content Navigator] displayGradeCards received:', JSON.stringify(gradesList)); // See exactly what data is being looped over

    const gridId = GRID_IDS.GRADES;
    const gradesGrid = document.getElementById(gridId);
    const titleElement = document.getElementById('grades-section-title');
    const currentLang = getCurrentState().currentLanguage;

    if (titleElement) {
        titleElement.textContent = `اختر الصف لمادة ${subjectDisplayName}`;
    }

    clearGridAndShowMessage(gridId); // Clear loading/previous error

    if (!Array.isArray(gradesList) || gradesList.length === 0) { // Should be caught by handler, but double check
        clearGridAndShowMessage(gridId, 'لا توجد صفوف متاحة لهذه المادة.');
        return;
    }
    // clearGridAndShowMessage(gridId); // Removed redundant clear
    gradesList.forEach(grade => {
        console.log('[Content Navigator] Processing grade in loop:', grade.gradeId);
        if (!grade || !grade.gradeId || !grade.title?.[currentLang]) {
            console.warn("[Content Navigator] Skipping invalid grade item:", grade);
            return;
        }

        // Handle potential external link directly on grade card click
        if (grade.externalLink) {
            const card = createCardElement(
                grade.title[currentLang],
                grade.icon || DEFAULT_ICON_PATH,
                'data-grade-id',
                grade.gradeId
            );
            card.addEventListener('click', () => handleExternalLink(grade.externalLink));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleExternalLink(grade.externalLink); }
            });
            gradesGrid.appendChild(card);
        } else {
            // Normal grade selection
            const card = createCardElement(
                grade.title[currentLang],
                grade.icon || DEFAULT_ICON_PATH,
                'data-grade-id',
                grade.gradeId
            );
            // Pass grade ID and title object
            card.addEventListener('click', () => handleGradeSelection(grade.gradeId, grade.title));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGradeSelection(grade.gradeId, grade.title); }
            });
            gradesGrid.appendChild(card);
        }
    });
    console.log("[Content Navigator] Grade cards rendered.");
}


// Around line 201
export function displayLessonCards(lessonsList, gradeDisplayName) { // <--- ADD export HERE
    console.log("[Content Navigator] Displaying Lesson cards...");
    const gridId = GRID_IDS.LESSONS;
    const lessonsGrid = document.getElementById(gridId);
    const titleElement = document.getElementById('lessons-section-title');
    const currentLang = getCurrentState().currentLanguage;

    if (titleElement) {
        titleElement.textContent = `اختر الدرس للصف ${gradeDisplayName}`;
    }

    clearGridAndShowMessage(gridId); // Clear loading/previous error

    if (!Array.isArray(lessonsList) || lessonsList.length === 0) {
        clearGridAndShowMessage(gridId, 'لا توجد دروس متاحة لهذا الصف.');
        return;
    }

    lessonsList.forEach(lesson => {
        if (!lesson || !lesson.lessonId || !lesson.title?.[currentLang]) {
            console.warn("[Content Navigator] Skipping invalid lesson item:", lesson);
            return;
        }

        const card = createCardElement(
            lesson.title[currentLang],
            lesson.icon || DEFAULT_ICON_PATH,
            'data-lesson-id',
            lesson.lessonId
        );

        // Pass lesson ID and Title object
        card.addEventListener('click', () => handleLessonSelection(lesson.lessonId, lesson.title));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLessonSelection(lesson.lessonId, lesson.title); }
        });
        lessonsGrid.appendChild(card);
    });
    console.log("[Content Navigator] Lesson cards rendered.");
}

/**
 * Handles grade selection. Loads and displays lessons.
 * @param {string} gradeId - The ID of the selected grade.
 * @param {object} gradeTitle - The title object {en, ar}.
 */
async function handleGradeSelection(gradeId, gradeTitle) {
     console.log(`[Content Navigator] Grade selected: ${gradeId}`);
     const state = getCurrentState();
     const subjectId = state.selectedSubjectId; // Get subject from state
      const currentLang = state.currentLanguage;

     if (!subjectId) {
          console.error("[Content Navigator] Cannot select grade: Subject ID missing from state.");
          navigateHome(); // Problem with state, go home
          return;
     }

     // Update state
     updateState({
          selectedGradeId: gradeId,
          selectedGradeTitle: gradeTitle,
          selectedLessonId: null,
           isQuizActive: false
     });

     // Show loading message in lessons grid
     clearGridAndShowMessage(GRID_IDS.LESSONS, 'جاري تحميل الدروس...');
     updateCardFlowView('lessons');

     try {
          const lessonsList = await loadLessonsList(subjectId, gradeId);

          if (!lessonsList || lessonsList.length === 0) {
               console.warn(`No lessons found for ${subjectId}/${gradeId}. File might be empty or invalid.`);
               clearGridAndShowMessage(GRID_IDS.LESSONS, 'لا توجد دروس متاحة لهذا الصف.');
               return;
          }

          displayLessonCards(lessonsList, gradeTitle[currentLang] || gradeId);

     } catch (error) {
          console.error(`[Content Navigator] Error loading lessons for ${subjectId}/${gradeId}:`, error);
          clearGridAndShowMessage(GRID_IDS.LESSONS, 'فشل تحميل قائمة الدروس.', 'error');
     }
}



/**
 * Handles lesson selection. Transitions to tabs view and loads lesson content.
 * @param {string} lessonId - The ID of the selected lesson.
 * @param {object} lessonTitle - The title object {en, ar}.
 */
async function handleLessonSelection(lessonId, lessonTitle) {
    console.log(`[Content Navigator] Lesson selected: ${lessonId}`);
    const state = getCurrentState();
    const { selectedSubjectId, selectedGradeId, currentLanguage } = state;

    if (!selectedSubjectId || !selectedGradeId) {
          console.error("[Content Navigator] Cannot select lesson: Subject or Grade ID missing from state.");
          alert("خطأ: الرجاء اختيار المادة والصف أولاً.");
          navigateHome();
          return;
     }

  // Update state with selected lesson ID, Title, AND the active main section
    updateState({
        selectedLessonId: lessonId,
        selectedLessonTitle: lessonTitle,
        isQuizActive: false,
        activeMainSectionId: MAIN_SECTION_IDS.TABS // <<< --- ADD THIS LINE
    });

       // --- Transition to Tabs View ---
    hideAllSectionsExcept(MAIN_SECTION_IDS.TABS);

    const lessonBasicInfo = {
        lessonId: lessonId,
        title: lessonTitle
    };

       // 3. Load the full lesson content into the tabs component
       // Pass necessary IDs for loading content
      try {
         await loadAndDisplayLesson(selectedSubjectId, selectedGradeId, lessonBasicInfo);
          // tabs_controller now handles loading details and questions internally
      } catch (error) {
           console.error("[Content Navigator] Error occurred during lesson loading trigger:", error);
           alert("حدث خطأ أثناء تحميل الدرس. الرجاء العودة للخلف والمحاولة مرة أخرى.");
           // Fallback: Go back to the lessons list view
           handleBackNavigation('lessons'); // Try going back to lessons list
      }

}


/**
 * Handles back navigation clicks. Needs to dynamically load parent lists.
 * @param {'subjects' | 'grades' | 'lessons'} targetView - The view level to navigate back TO.
 */
async function handleBackNavigation(targetView) {
     console.log(`[Content Navigator] Navigating back to: ${targetView}`);
     const state = getCurrentState();

     if (targetView === 'subjects') {
          // Going back to subjects list view
          resetNavigationState();       // Clears subject/grade/lesson IDs
          const subjectsList = await loadSubjectsList(); // Reload (or get from cache)
          displaySubjectCards(subjectsList || []); // Display, handle potential null
          updateCardFlowView('subjects');

     } else if (targetView === 'grades') {
          // Going back to grades list view (from lessons view)
          const subjectId = state.selectedSubjectId;
           const subjectTitle = state.selectedSubjectTitle;
           if (!subjectId || !subjectTitle) { console.warn("Cannot go back to grades, subject info missing."); navigateHome(); return; }

           updateState({ selectedGradeId: null, selectedLessonId: null }); // Clear lower levels
          clearGridAndShowMessage(GRID_IDS.GRADES, 'جاري تحميل الصفوف...'); // Show loading
           updateCardFlowView('grades'); // Switch view

           const gradesList = await loadGradesList(subjectId);
           if (gradesList) {
                displayGradeCards(gradesList, subjectTitle[state.currentLanguage] || subjectId);
           } else {
                clearGridAndShowMessage(GRID_IDS.GRADES, 'فشل تحميل قائمة الصفوف.', 'error');
           }

     } else if (targetView === 'lessons') {
           // This specific back button is usually handled IN the tabs component listener now
           // But we keep the logic here as a fallback or if called directly
           const subjectId = state.selectedSubjectId;
           const gradeId = state.selectedGradeId;
           const gradeTitle = state.selectedGradeTitle;
           if (!subjectId || !gradeId || !gradeTitle) { console.warn("Cannot go back to lessons, subject/grade info missing."); navigateHome(); return; }

          updateState({ selectedLessonId: null }); // Clear lesson selection
           clearGridAndShowMessage(GRID_IDS.LESSONS, 'جاري تحميل الدروس...'); // Show loading

           // Important: We need to ensure the card flow is visible first BEFORE updating its view
           showMainContentSection(MAIN_SECTION_IDS.FLOW);
           updateCardFlowView('lessons'); // Switch view within card flow

           const lessonsList = await loadLessonsList(subjectId, gradeId);
           if(lessonsList) {
                displayLessonCards(lessonsList, gradeTitle[state.currentLanguage] || gradeId);
           } else {
                clearGridAndShowMessage(GRID_IDS.LESSONS, 'فشل تحميل قائمة الدروس.', 'error');
           }
     } else {
           console.warn(`[Content Navigator] Invalid back navigation target: ${targetView}`);
     }
}


/**
 * Initializes the content navigation logic. Attaches back button listeners.
 */
export function initializeContentNavigator() {
     const cardFlowContainer = document.getElementById('subject-grade-lesson-flow');
     if (!cardFlowContainer) {
          console.error("[Content Navigator] Init Error: Container '#subject-grade-lesson-flow' not found.");
          return;
     }

      // Listener for back buttons WITHIN the card flow (#subjects, #grades, #lessons containers)
     cardFlowContainer.addEventListener('click', (event) => {
         const backButton = event.target.closest('.back-button');
         if (backButton && backButton.closest('.view-container')) { // Ensure it's one of the card flow backs
             const targetViewName = backButton.dataset.targetView; // 'subjects' or 'grades'
             if (targetViewName) {
                 handleBackNavigation(targetViewName);
             } else {
                  console.warn("[Content Navigator] Card flow back button clicked, but missing 'data-target-view'.");
             }
         }
     });

     // Listener for buttons WITHIN the tabs component that navigate OUTSIDE the tabs
     const tabsComponent = document.getElementById('lesson-quiz-tabs-section');
     if (tabsComponent) {
          tabsComponent.addEventListener('click', (event) => {
              // Handle "Back to Lessons List" from QUIZ RESULTS area
              if (event.target.closest('.back-to-lessons-list')) {
                   console.log("[Content Navigator] 'Back to Lessons List' from results clicked.");
                   handleBackNavigation('lessons'); // Needs to load lessons for current grade
              }
              // Handle "Back" button within the LESSON PANEL itself
              else if (event.target.closest('#lesson-content-panel .back-button')) {
                   console.log("[Content Navigator] Back button from lesson panel clicked.");
                   handleBackNavigation('lessons'); // Needs to load lessons for current grade
              }
            });
     } else {
          console.warn("[Content Navigator] Could not find tabs component for back button listener.");
     }

     console.log("[Content Navigator] Initialized (v2 - Dynamic Loading).");
}

// No displaySubjectCards call here, it's called by app_initializer
console.log('[Content Navigator] Module Initialized (v2 - Dynamic Loading).');