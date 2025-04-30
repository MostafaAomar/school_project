
// /js/components/tabs_controller.js

/**
 * @fileoverview Manages the Lesson/Quiz tabs component.
 * Handles tab switching, loading lesson content, and timer functionality.
 */

import { getCurrentState, updateState } from '../core/state_manager.js';
import { loadLessonDetails } from '../core/data_loader.js';
import { startQuizForLesson, resetQuizEngine } from './quiz_engine.js'; // Assuming startQuiz initiation + reset
import { renderBilingualText, renderExternalLinks, convertToEmbedUrl } from '../utils/dom_helpers.js';
import { DEFAULT_QUIZ_DURATION_SECONDS } from '../config/constants.js';

// Module-level variables
let tabsContainerElement;
let tabButtons = [];
let tabPanels = [];
let currentLessonData = null; // Holds the data for the currently loaded lesson details
let timerIntervalId = null;
let currentTimerDuration = DEFAULT_QUIZ_DURATION_SECONDS;

// DOM Element References within the tabs component (cached on init/load)
let lessonTitleDisplay, lessonTextContentArea, lessonVideoContentArea, lessonAudioContentArea, lessonExternalLinksArea;
let startQuizButton;
let quizTimerDisplay;
let quizTabButton, lessonTabButton; // References to the specific tab buttons
let quizPanel, lessonPanel;         // References to the panels
let backToLessonButton, backToLessonsListButton; // Buttons inside results area

/**
 * Finds and caches references to essential DOM elements within the tabs component.
 * @returns {boolean} True if all essential elements are found, false otherwise.
 */
function cacheTabDOMElements() {
    tabsContainerElement = document.getElementById('lesson-quiz-tabs-section');
    if (!tabsContainerElement) {
        console.error("[Tabs Controller] FATAL: Tabs container '#lesson-quiz-tabs-section' not found.");
        return false;
    }

    // Cache buttons and panels
    const buttonContainer = tabsContainerElement.querySelector('.tab-buttons');
    if (!buttonContainer) { console.error("[Tabs Controller] FATAL: '.tab-buttons' container not found."); return false; }
    tabButtons = Array.from(buttonContainer.querySelectorAll('.tab-button'));
    tabPanels = Array.from(tabsContainerElement.querySelectorAll('.tab-panel'));
    quizTabButton = document.getElementById('quiz-tab-btn');
    lessonTabButton = document.getElementById('lesson-tab-btn');
    quizPanel = document.getElementById('quiz-test-panel');
    lessonPanel = document.getElementById('lesson-content-panel');


    if (tabButtons.length === 0 || tabPanels.length === 0 || !quizTabButton || !lessonTabButton || !quizPanel || !lessonPanel) {
        console.error("[Tabs Controller] FATAL: Required tab buttons or panels missing.");
        return false;
    }

    // Cache elements within the LESSON panel
    lessonTitleDisplay = tabsContainerElement.querySelector('#lesson-title-display');
    lessonTextContentArea = tabsContainerElement.querySelector('#lesson-text-content-area');
    lessonVideoContentArea = tabsContainerElement.querySelector('#lesson-video-content-area');
    lessonAudioContentArea = tabsContainerElement.querySelector('#lesson-audio-content-area');
    lessonExternalLinksArea = tabsContainerElement.querySelector('#lesson-external-links-area');
    startQuizButton = tabsContainerElement.querySelector('#start-quiz-button');

    if (!lessonTitleDisplay || !lessonTextContentArea || !lessonVideoContentArea || !lessonAudioContentArea || !lessonExternalLinksArea || !startQuizButton) {
        console.error("[Tabs Controller] FATAL: One or more elements within the lesson panel not found.");
        return false;
    }

    // Cache elements within the QUIZ panel
    quizTimerDisplay = tabsContainerElement.querySelector('#quiz-timer-display');
    backToLessonButton = tabsContainerElement.querySelector('#back-to-lesson-button'); // In results
    backToLessonsListButton = tabsContainerElement.querySelector('.back-to-lessons-list'); // In results

    if (!quizTimerDisplay || !backToLessonButton || !backToLessonsListButton ) {
         console.error("[Tabs Controller] FATAL: One or more critical elements within the quiz panel (timer, results buttons) not found.");
         // Note: Other quiz elements (#active-quiz-area etc.) are managed by quiz_engine.js
         return false;
    }

    console.log("[Tabs Controller] Successfully cached DOM elements.");
    return true;
}

/**
 * Switches the active tab and panel.
 * @param {string} targetTabId - The ID of the tab BUTTON to activate (e.g., 'lesson-tab-btn').
 * @param {boolean} [setFocus=false] - Whether to set focus on the newly activated tab button.
 */
function switchToTab(targetTabId, setFocus = false) {
    console.log(`[Tabs Controller] Attempting to switch to tab: ${targetTabId}`);
    const targetButton = tabButtons.find(btn => btn && btn.id === targetTabId);

    if (!targetButton) {
        console.warn(`[Tabs Controller] switchTab: Button with ID "${targetTabId}" not found.`);
        return;
    }
    if (targetButton.disabled || targetButton.getAttribute('aria-disabled') === 'true') {
         console.warn(`[Tabs Controller] switchTab: Target tab "${targetTabId}" is disabled.`);
         return;
    }
    // Avoid redundant switches if already active
    if (targetButton.getAttribute('aria-selected') === 'true') {
        // console.log(`[Tabs Controller] switchTab: Tab "${targetTabId}" is already active.`);
        return;
    }

    // Deactivate all other tabs and hide their panels
    tabButtons.forEach(button => {
        if (button) {
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('tabindex', '-1');
            const panelId = button.getAttribute('aria-controls');
            const panel = tabPanels.find(p => p && p.id === panelId);
            if (panel) {
                panel.setAttribute('hidden', '');
            }
        }
    });

    // Activate the target tab and show its panel
    targetButton.setAttribute('aria-selected', 'true');
    targetButton.setAttribute('tabindex', '0');
    const targetPanelId = targetButton.getAttribute('aria-controls');
    const targetPanel = tabPanels.find(p => p && p.id === targetPanelId);

    if (!targetPanel) {
        console.error(`[Tabs Controller] switchTab Error: Target panel "#${targetPanelId}" not found.`);
        return;
    }
    targetPanel.removeAttribute('hidden');

    if (setFocus) {
        targetButton.focus();
    }

    // --- Special handling for activating the Quiz Tab ---
    const state = getCurrentState();
    if (targetTabId === 'quiz-tab-btn') {
        handleQuizTabActivation(state.isQuizActive);
    } else {
        // If switching *away* from the quiz tab, pause the timer
        clearQuizTimer();
        // Ensure quiz placeholder is hidden if switching to lesson tab
        const placeholder = document.getElementById('quiz-placeholder-message');
        if(placeholder) placeholder.style.display = 'block'; // Show default message

        const activeQuizUI = document.getElementById('active-quiz-area');
        if (activeQuizUI) activeQuizUI.classList.add('hidden');
         const resultsUI = document.getElementById('quiz-results-area');
        if (resultsUI) resultsUI.classList.add('hidden');

    }
     console.log(`[Tabs Controller] Successfully switched to tab: ${targetTabId}`);
}

/**
 * Handles logic specific to when the quiz tab becomes active.
 * Shows the quiz UI if active, or a placeholder message otherwise.
 * Starts/resumes the timer if the quiz is active.
 * @param {boolean} isQuizCurrentlyActive - The current quiz state.
 */
function handleQuizTabActivation(isQuizCurrentlyActive) {
     const placeholderMessage = document.getElementById('quiz-placeholder-message');
     const activeQuizUI = document.getElementById('active-quiz-area'); // Contains questions etc.
     const resultsUI = document.getElementById('quiz-results-area'); // Contains results

     if (!placeholderMessage || !activeQuizUI || !resultsUI) {
          console.error("[Tabs Controller] Quiz tab activation error: Missing UI elements (placeholder, active area, or results area).");
          return;
     }

    if (isQuizCurrentlyActive) {
        console.log("[Tabs Controller] Quiz tab activated: Quiz is active, showing active UI.");
        placeholderMessage.style.display = 'none';
        resultsUI.classList.add('hidden');       // Ensure results aren't shown
        activeQuizUI.classList.remove('hidden'); // Show the questions/progress
        // Start or resume the timer (start function handles duplicates)
        startQuizTimer(currentTimerDuration);
    } else {
        // Check if results should be shown instead of placeholder
         if (!resultsUI.classList.contains('hidden')) {
              console.log("[Tabs Controller] Quiz tab activated: Quiz finished, showing results UI.");
              placeholderMessage.style.display = 'none';
              activeQuizUI.classList.add('hidden');
              // Timer should already be cleared by quiz engine finishing
              clearQuizTimer();
         } else {
            console.log("[Tabs Controller] Quiz tab activated: Quiz is NOT active, showing placeholder.");
            placeholderMessage.style.display = 'block'; // Show the "start quiz first" message
            activeQuizUI.classList.add('hidden');    // Hide question area
            resultsUI.classList.add('hidden');      // Hide results area
            clearQuizTimer();                   // Ensure timer isn't running
            resetTimerDisplay();                // Show default time
         }
    }
}


// --- Event Handlers ---
function handleTabClick(event) {
    const clickedButton = event.target.closest('.tab-button');
    if (clickedButton) {
        event.preventDefault();
        switchToTab(clickedButton.id);
    }
}

function handleTabKeydown(event) {
    const targetButton = event.target.closest('.tab-button');
    if (!targetButton || targetButton.disabled) return;

    let currentButtonIndex = tabButtons.findIndex(btn => btn === targetButton);
    if (currentButtonIndex === -1) return;

    let newIndex = currentButtonIndex;
    const nextKeys = ['ArrowRight', 'ArrowDown']; // Right/Down for next (RTL/LTR neutral)
    const prevKeys = ['ArrowLeft', 'ArrowUp'];   // Left/Up for previous

    const findEnabledIndex = (startIndex, direction) => {
        const numTabs = tabButtons.length;
        for (let i = 1; i < numTabs; i++) {
            const checkIndex = (startIndex + direction * i + numTabs) % numTabs;
            if (tabButtons[checkIndex] && !tabButtons[checkIndex].disabled) {
                return checkIndex;
            }
        }
        return startIndex; // No other enabled found
    };

    let shouldPreventDefault = false;

    if (nextKeys.includes(event.key)) {
        newIndex = findEnabledIndex(currentButtonIndex, 1);
        shouldPreventDefault = true;
    } else if (prevKeys.includes(event.key)) {
        newIndex = findEnabledIndex(currentButtonIndex, -1);
        shouldPreventDefault = true;
    } else if (event.key === 'Home') {
        newIndex = tabButtons.findIndex(btn => btn && !btn.disabled);
        shouldPreventDefault = true;
    } else if (event.key === 'End') {
        // Find last *enabled* button
        for (let i = tabButtons.length - 1; i >= 0; i--) {
            if (tabButtons[i] && !tabButtons[i].disabled) {
                newIndex = i;
                break;
            }
        }
        shouldPreventDefault = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
        // Already handled by click, but good practice
        switchToTab(targetButton.id);
        shouldPreventDefault = true;
    }

    if (shouldPreventDefault) {
        event.preventDefault();
        if (newIndex !== currentButtonIndex && tabButtons[newIndex]) {
            switchToTab(tabButtons[newIndex].id, true); // Switch and set focus
        }
    }
}

// --- Timer Functions ---
function startQuizTimer(durationSeconds) {
    clearQuizTimer(); // Prevent multiple intervals
    if (!quizTimerDisplay) {
        console.warn("[Tabs Controller] Timer display element not found.");
        return;
    }

    let remainingTime = durationSeconds;
    currentTimerDuration = durationSeconds; // Store duration for potential resume
    console.log(`[Tabs Controller] Starting timer: ${durationSeconds} seconds.`);
    updateTimerDisplay(remainingTime);
    quizTimerDisplay.style.color = 'var(--secondary-color)'; // Reset color

    timerIntervalId = setInterval(() => {
        remainingTime--;
        updateTimerDisplay(remainingTime);

        // Update colors based on remaining time
        if (remainingTime <= 0) {
            console.log("[Tabs Controller] Timer finished!");
            clearQuizTimer();
            quizTimerDisplay.textContent = "الوقت انتهى!";
            quizTimerDisplay.style.color = 'var(--incorrect-color)';
            // Notify the quiz engine that time is up
             if (typeof window.handleQuizTimeUp === 'function') { // Check if quiz engine exposed this
                 window.handleQuizTimeUp();
             } else {
                  console.warn("[Tabs Controller] Timer Warning: handleQuizTimeUp function not found in quiz_engine.");
                  // Maybe force quiz end via a different mechanism if quiz_engine doesn't expose time up handler
                   alert("انتهى وقت الاختبار!"); // Simple fallback
             }
        } else if (remainingTime <= 10) {
            quizTimerDisplay.style.color = 'var(--incorrect-color)'; // Red
        } else if (remainingTime <= 60) {
            quizTimerDisplay.style.color = 'var(--accent-color)'; // Orange
        }

    }, 1000);
}

function updateTimerDisplay(seconds) {
    if (!quizTimerDisplay) return;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // Pad with leading zeros
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(remainingSeconds).padStart(2, '0');
    quizTimerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

function clearQuizTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        console.log("[Tabs Controller] Timer cleared/paused.");
    }
}

function resetTimerDisplay(duration = DEFAULT_QUIZ_DURATION_SECONDS) {
    if (quizTimerDisplay) {
        updateTimerDisplay(duration);
        quizTimerDisplay.style.color = 'var(--secondary-color)'; // Reset color
    }
     currentTimerDuration = duration; // Reset stored duration
}



// ... (module variables, cacheTabDOMElements, switchToTab, handleQuizTabActivation, timer functions etc. remain mostly the same) ...

/**
 * Populates the lesson panel content based on fetched data.
 * @param {object} lessonContent - The detailed content object for the lesson.
 * @param {object} lessonBasicInfo - *Basic* info (ID, title object) passed from navigator.
 */
function populateLessonContentPanel(lessonContent, lessonBasicInfo) {
    const state = getCurrentState();
    const currentLang = state.currentLanguage || 'ar';

    if (!lessonBasicInfo ) {
         console.error("[Tabs Controller] Cannot populate lesson panel - missing basic lesson info.");
         lessonTitleDisplay.textContent = "خطأ في تحديد الدرس";
         return;
    }

    // Set Title using basic info passed in
    lessonTitleDisplay.textContent = lessonBasicInfo.title?.[currentLang] || lessonBasicInfo.title?.['en'] || `Lesson (${lessonBasicInfo.lessonId})`;

    // Reset content areas
    lessonTextContentArea.innerHTML = ''; lessonTextContentArea.classList.remove('loading');
    lessonVideoContentArea.innerHTML = ''; lessonVideoContentArea.classList.remove('loading');
    lessonAudioContentArea.innerHTML = ''; lessonAudioContentArea.classList.remove('loading');
    lessonExternalLinksArea.innerHTML = ''; lessonExternalLinksArea.classList.remove('loading');

    // Check if detailed content actually loaded
    if (!lessonContent) {
         console.warn(`[Tabs Controller] Detailed content for lesson ${lessonBasicInfo.lessonId} failed to load or is null.`);
         lessonTextContentArea.innerHTML = '<p class="info-message">محتوى الدرس غير متوفر حالياً.</p>';
         lessonVideoContentArea.classList.add('lesson-section-content'); // Show :empty style
         lessonAudioContentArea.classList.add('lesson-section-content');
         lessonExternalLinksArea.classList.add('lesson-section-content');
         startQuizButton.disabled = true; // Disable quiz if content failed
         quizTabButton.disabled = true; quizTabButton.setAttribute('aria-disabled', 'true');
         return; // Stop populating
    }

    // --- Populate with Detailed Content ---
    // Text
    if (lessonContent.textContent && (lessonContent.textContent[currentLang] || lessonContent.textContent['en'])) {
        renderBilingualText(lessonTextContentArea, lessonContent.textContent, 'lesson-text');
        lessonTextContentArea.classList.remove('lesson-section-content');
    } else {
        lessonTextContentArea.classList.add('lesson-section-content'); // Add class for :empty styling
    }
  
      if (lessonContent.videoUrl && typeof lessonContent.videoUrl === 'string' && lessonContent.videoUrl.trim() !== '') {
        const embedUrl = convertToEmbedUrl(lessonContent.videoUrl); // Use the helper
        if (embedUrl) {
             console.log(`[Tabs Controller] Rendering video with embed URL: ${embedUrl}`);
             const videoWrapper = document.createElement('div');
             videoWrapper.className = 'video-wrapper'; // Use styles from CSS

             const iframe = document.createElement('iframe');
             // Standard YouTube embed size, CSS can override if needed
             iframe.width = "560";
             iframe.height = "315";
             iframe.src = embedUrl;
             // Construct a meaningful title for accessibility
             iframe.title = "Video Player" + (lessonBasicInfo?.title?.[currentLang] ? `: ${lessonBasicInfo.title[currentLang]}` : '');
             iframe.frameborder = "0";
             // Standard allow attributes for modern embeds
             iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
             // Note: allowfullscreen attribute is boolean, just needs to be present
             iframe.allowFullscreen = true; // Use the correct JS property name

             videoWrapper.appendChild(iframe);
             lessonVideoContentArea.appendChild(videoWrapper);
             lessonVideoContentArea.classList.remove('lesson-section-content'); // Remove empty placeholder style
        } else {
              // URL was provided but couldn't be converted
              console.warn(`[Tabs Controller] Invalid video URL format or could not convert: ${lessonContent.videoUrl}`);
              lessonVideoContentArea.innerHTML = '<p class="info-message">رابط الفيديو غير صالح أو غير مدعوم.</p>';
              lessonVideoContentArea.classList.add('lesson-section-content'); // Keep placeholder style
        }
    } else {
         // No video URL provided
         lessonVideoContentArea.classList.add('lesson-section-content'); // Ensure empty placeholder style applies
    }
 if (lessonContent.audioUrl && typeof lessonContent.audioUrl === 'string' && lessonContent.audioUrl.trim() !== '') {
        console.log(`[Tabs Controller] Rendering audio: ${lessonContent.audioUrl}`);
        const audio = document.createElement('audio');
        audio.controls = true; // Show default audio controls
        audio.style.width = '100%'; // Make it responsive within its container

        const source = document.createElement('source');
        source.src = lessonContent.audioUrl; // Assume path relative to HTML or absolute
        // Use provided type or make a reasonable guess/default
        source.type = lessonContent.audioType || 'audio/mpeg';
        audio.appendChild(source);

        // Provide fallback text for browsers that don't support the <audio> tag
        audio.appendChild(document.createTextNode('متصفحك لا يدعم تشغيل هذا النوع من الملفات الصوتية.'));

        lessonAudioContentArea.appendChild(audio);
        lessonAudioContentArea.classList.remove('lesson-section-content'); // Remove empty placeholder style
    } else {
        // No audio URL provided
        lessonAudioContentArea.classList.add('lesson-section-content'); // Ensure empty placeholder style applies
    }
    // External Links (use links from DETAILED content)
    const linksToRender = lessonContent.externalLinks || [];
    if (linksToRender.length > 0) { /* ... render external links ... */ }
    else { lessonExternalLinksArea.classList.add('lesson-section-content'); }

    // --- Configure Start Quiz Button (RELY ON QUIZ ENGINE TO CHECK FOR questions.json) ---
    const newStartButton = startQuizButton.cloneNode(true);
    startQuizButton.parentNode.replaceChild(newStartButton, startQuizButton);
    startQuizButton = newStartButton; // Update reference

    // Enable the button initially. The quiz engine will handle disabling if questions don't load.
    startQuizButton.disabled = false;
    quizTabButton.disabled = true; // Keep quiz tab disabled initially
    quizTabButton.setAttribute('aria-disabled', 'true');

    startQuizButton.onclick = async () => { // Make handler async
        const currentState = getCurrentState();
        console.log(`[Tabs Controller] Start Quiz clicked for lesson: ${lessonBasicInfo.lessonId}`);
        if (!currentState.selectedSubjectId || !currentState.selectedGradeId || !currentState.selectedLessonId) {
            console.error("[Tabs Controller] Cannot start quiz: Missing subject/grade/lesson ID in state.");
            alert("خطأ: لا يمكن بدء الاختبار لعدم توفر معلومات المادة/الصف.");
            return;
        }

        // Show some loading/starting indicator? (Optional)
        startQuizButton.disabled = true;
        startQuizButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ البدء...';

        try {
             // Attempt to start the quiz; quiz engine handles question loading
             const success = await startQuizForLesson(
                 currentState.selectedSubjectId,
                 currentState.selectedGradeId,
                 currentState.selectedLessonId
             );

             if (success) {
                 if (quizTabButton) {
                     quizTabButton.disabled = false;
                     quizTabButton.setAttribute('aria-disabled', 'false');
                 }
                 updateState({ isQuizActive: true });
                 switchToTab('quiz-tab-btn');
             } else {
                 // Quiz engine indicated failure (e.g., questions.json not found or empty)
                 console.warn("[Tabs Controller] Quiz engine indicated start failure (check engine logs).");
                  if (quizTabButton) {
                       quizTabButton.disabled = true;
                       quizTabButton.setAttribute('aria-disabled', 'true');
                  }
                  updateState({ isQuizActive: false });
                  // Show user message that quiz isn't available
                  alert("لا يتوفر اختبار لهذا الدرس حالياً.");
             }

        } catch (error) {
             console.error("[Tabs Controller] Error during quiz start process:", error);
              if (quizTabButton) {
                   quizTabButton.disabled = true;
                   quizTabButton.setAttribute('aria-disabled', 'true');
              }
              updateState({ isQuizActive: false });
              alert("حدث خطأ غير متوقع أثناء بدء الاختبار.");
        } finally {
             // Reset button text/state regardless of success/failure
             startQuizButton.disabled = false; // Re-enable maybe? Or keep disabled until navigating away? Let's keep it enabled.
             startQuizButton.innerHTML = '<i class="fas fa-play"></i> ابدأ الاختبار';
        }
    };
}

/**
 * Loads and displays the content for a specific lesson selected by the user.
 * Fetches data if not cached, then populates the UI.
 * @param {object} subject - The subject object from app_structure.
 * @param {object} grade - The grade object from app_structure.
 * @param {object} lessonBasicInfo - The lesson object from app_structure.
 */
export async function loadAndDisplayLesson(subjectId, gradeId, lessonBasicInfo) {
    if (!lessonBasicInfo || !lessonBasicInfo.lessonId || !subjectId || !gradeId) {
        console.error("[Tabs Controller] loadAndDisplayLesson: Invalid IDs or lesson info provided.");
        return;
    }
    const lessonId = lessonBasicInfo.lessonId;
    console.log(`[Tabs Controller] Loading lesson: ${subjectId}/${gradeId}/${lessonId}`);

    resetQuizVisuals(); // Reset quiz area

    // Show loading indicators
    /* ... */

    try {
        // Fetch detailed lesson content using IDs
        const detailedLessonContent = await loadLessonDetails(subjectId, gradeId, lessonId);

        // Detailed content might be null if the file doesn't exist (shouldn't happen if lesson listed)
        if (!detailedLessonContent) {
             console.warn(`Detailed lesson content not found for ${lessonId}, showing basic info only.`);
             // Populate with basic info and placeholders/error messages
              populateLessonContentPanel(null, lessonBasicInfo); // Pass null for content
        } else {
             // Populate panel with detailed content and basic info (for title)
             populateLessonContentPanel(detailedLessonContent, lessonBasicInfo);
        }

        switchToTab('lesson-tab-btn');

    } catch (error) {
        console.error(`[Tabs Controller] Error loading or displaying lesson ${lessonId}:`, error);
        populateLessonContentPanel(null, { ...lessonBasicInfo, title: { ar: "خطأ تحميل الدرس", en:"Error Loading Lesson" } }); // Show error title
        switchToTab('lesson-tab-btn');
    } finally {
        // Hide loading indicators
        /* ... */
    }
}


/**
 * Resets the tabs component to its initial state, typically when navigating away or home.
 * Activates the lesson tab, disables the quiz tab, clears content, resets timer.
 */
export function resetTabsComponent() {
    console.log("[Tabs Controller] Resetting Tabs Component State.");

    // Activate Lesson Tab, Deactivate Quiz Tab
    if (lessonTabButton) {
        lessonTabButton.setAttribute('aria-selected', 'true');
        lessonTabButton.setAttribute('tabindex', '0');
    }
    if (quizTabButton) {
        quizTabButton.setAttribute('aria-selected', 'false');
        quizTabButton.setAttribute('tabindex', '-1');
        quizTabButton.disabled = true; // Disable quiz tab
        quizTabButton.setAttribute('aria-disabled', 'true');
    }

    // Show Lesson Panel, Hide Quiz Panel
    if (lessonPanel) lessonPanel.removeAttribute('hidden');
    if (quizPanel) quizPanel.setAttribute('hidden', '');

    // Clear dynamic content in lesson panel
    if (lessonTitleDisplay) lessonTitleDisplay.textContent = 'عنوان الدرس';
    if (lessonTextContentArea) lessonTextContentArea.innerHTML = '<p class="info-message">اختر درساً لعرض محتواه.</p>';
    if (lessonVideoContentArea) lessonVideoContentArea.innerHTML = '';
    if (lessonAudioContentArea) lessonAudioContentArea.innerHTML = '';
    if (lessonExternalLinksArea) lessonExternalLinksArea.innerHTML = '';
     if (startQuizButton) {
          startQuizButton.disabled = true; // Disable start button
          startQuizButton.onclick = null;
     }

    // Reset quiz visuals and timer
    resetQuizVisuals();

    console.log("[Tabs Controller] Tabs Component Reset Complete.");
}

/**
 * Resets only the visual elements of the quiz area (timer, hides active/results, shows placeholder).
 * Called when loading a new lesson or resetting the tabs.
 */
function resetQuizVisuals() {
     console.log("[Tabs Controller] Resetting quiz visuals.");
     const resultsArea = document.getElementById('quiz-results-area');
     const activeQuizArea = document.getElementById('active-quiz-area');
     const placeholder = document.getElementById('quiz-placeholder-message');

     if (resultsArea) { resultsArea.classList.add('hidden'); resultsArea.classList.remove('show'); }
     if (activeQuizArea) { activeQuizArea.classList.add('hidden'); }
     if (placeholder) { placeholder.style.display = 'block'; } // Show the initial message

     // Reset and clear the timer
     clearQuizTimer();
     resetTimerDisplay();

     // Ensure the quiz engine's state is also reset if applicable
     if(typeof resetQuizEngine === 'function') {
          resetQuizEngine();
     } else {
          console.warn("[Tabs Controller] resetQuizEngine function not found.");
     }

     // Reset quiz tab button state
      if (quizTabButton) {
            quizTabButton.disabled = true;
            quizTabButton.setAttribute('aria-disabled', 'true');
     }


}

// --- Initialization ---
export function initializeTabsController() {
    if (!cacheTabDOMElements()) {
        console.error("[Tabs Controller] Initialization failed due to missing elements.");
        return; // Stop if essential elements are missing
    }

    // Attach event listeners to the button container
    const buttonContainer = tabsContainerElement.querySelector('.tab-buttons');
    buttonContainer.addEventListener('click', handleTabClick);
    buttonContainer.addEventListener('keydown', handleTabKeydown);

    // Add listener for the "Back to Lesson" button within the results area
     if (backToLessonButton) {
          backToLessonButton.addEventListener('click', () => {
              console.log("[Tabs Controller] Back-to-lesson button clicked.");
              switchToTab('lesson-tab-btn');
          });
     }

     // Note: The "Back to Lessons List" button's logic is handled by content_navigator.js
     // It needs to trigger a view change *outside* the tabs component.

    console.log("[Tabs Controller] Initialized and listeners attached.");
    // Set initial state (Lesson tab active, Quiz tab disabled)
    resetTabsComponent();
}

console.log('[Tabs Controller] Module Initialized.');

// Expose timer control functions if needed by quiz engine (alternative to global window object)
export { startQuizTimer, clearQuizTimer, resetTimerDisplay };