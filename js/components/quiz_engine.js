
// /js/components/quiz_engine.js

/**
 * @fileoverview Core logic for the quiz functionality.
 * Handles loading questions, displaying them, checking answers,
 * tracking score, and showing results.
 */

import { getCurrentState, updateState, getCachedData } from '../core/state_manager.js';
import { loadLessonQuestions } from '../core/data_loader.js';
import { shuffleArray } from '../utils/array_utils.js';
import { renderBilingualText } from '../utils/dom_helpers.js';
import { playCorrectSound, playIncorrectSound } from '../utils/sound_manager.js';
import { clearQuizTimer, resetTimerDisplay } from './tabs_controller.js'; // Import timer controls

// --- Module State ---
let currentQuestions = []; // Array of question objects for the active quiz
let currentQuestionIndex = 0;
let currentScore = 0;
let userAnswersForCurrentQuestion = {}; // Stores user selections/inputs for the *current* question being checked
let quizLanguage = 'ar'; // Language for displaying options/feedback
let dragDropState = { // State specific to drag and drop questions
    draggedElement: null,
    droppedItems: {} // { dropZoneId: draggableItemId }
};

// --- DOM Element References (Cached as needed) ---
let quizContainer, activeQuizArea, questionDisplayArea, feedbackDisplayArea, resultsArea;
let progressBar, scoreDisplay, difficultyDisplay, questionCounterDisplay;
let finalScoreDisplay, finalPercentageDisplay, finalMessageDisplay, badgesDisplayArea;
let checkAnswerButton, nextQuestionButton, restartQuizButton;
let quizPlaceholderMessage, quizTimerDisplayElement; // Added timer ref

/**
 * Caches references to essential DOM elements within the quiz panel.
 * Should be called once during initialization or before starting a quiz.
 * @returns {boolean} True if essential elements are found, false otherwise.
 */
function cacheQuizDOMElements() {
     quizContainer = document.getElementById('quiz-interface-container'); // Overall wrapper in quiz panel
     activeQuizArea = document.getElementById('active-quiz-area');
     questionDisplayArea = document.getElementById('question-display-area');
     feedbackDisplayArea = document.getElementById('feedback-display-area');
     resultsArea = document.getElementById('quiz-results-area');
     quizPlaceholderMessage = document.getElementById('quiz-placeholder-message');

     progressBar = document.getElementById('quiz-progress-bar');
     scoreDisplay = document.getElementById('current-score-display');
     difficultyDisplay = document.getElementById('difficulty-level-display');
     questionCounterDisplay = document.getElementById('question-counter-display');

     finalScoreDisplay = document.getElementById('final-score-display');
     finalPercentageDisplay = document.getElementById('final-percentage-display');
     finalMessageDisplay = document.getElementById('final-message-display');
     badgesDisplayArea = document.getElementById('badges-display-area');

     checkAnswerButton = document.getElementById('check-answer-button');
     nextQuestionButton = document.getElementById('next-question-button');
     restartQuizButton = document.getElementById('restart-quiz-button');
     quizTimerDisplayElement = document.getElementById('quiz-timer-display'); // Get timer display


     // Validate essential elements
      const essentialElements = [
           quizContainer, activeQuizArea, questionDisplayArea, feedbackDisplayArea, resultsArea, quizPlaceholderMessage,
           progressBar, scoreDisplay, difficultyDisplay, questionCounterDisplay,
           finalScoreDisplay, finalPercentageDisplay, finalMessageDisplay, badgesDisplayArea,
           checkAnswerButton, nextQuestionButton, restartQuizButton, quizTimerDisplayElement
      ];

      if (essentialElements.some(el => !el)) {
           console.error("[Quiz Engine] FATAL: One or more essential Quiz UI elements not found. Check HTML IDs.");
           // Log missing elements specifically
           if (!quizContainer) console.error("Missing: #quiz-interface-container");
           if (!activeQuizArea) console.error("Missing: #active-quiz-area");
           // ... log others as needed for debugging
           return false;
      }

     console.log("[Quiz Engine] Successfully cached DOM elements.");
     return true;
}


// --- Utility Functions ---

function getDifficultyText(level) {
    switch (level) {
        case 1: return 'سهل';
        case 2: return 'متوسط';
        case 3: return 'صعب';
        default: return 'غير محدد';
    }
}

// --- UI Update Functions ---

function updateQuizProgressUI() {
     if (!scoreDisplay || !difficultyDisplay || !questionCounterDisplay || !progressBar) {
          console.warn("[Quiz Engine] updateProgress: Missing one or more UI elements.");
          return;
     }

     const currentQuestion = currentQuestions[currentQuestionIndex];
     const totalQuestions = currentQuestions.length;

     // Update score display
     scoreDisplay.textContent = `النقاط: ${currentScore}`;

     // Update difficulty (handle case where question might not exist yet)
     difficultyDisplay.textContent = `المستوى: ${currentQuestion ? getDifficultyText(currentQuestion.difficulty) : '-'}`;

     // Update question counter (ensure index is 1-based and doesn't exceed total)
     const displayIndex = totalQuestions > 0 ? Math.min(currentQuestionIndex + 1, totalQuestions) : 0;
     questionCounterDisplay.textContent = totalQuestions > 0 ? `السؤال ${displayIndex} / ${totalQuestions}` : "السؤال 0 / 0";

     // Calculate and update progress bar percentage (avoid division by zero)
     // Progress based on *completed* questions (index)
     const progressPercent = totalQuestions > 0 ? Math.min(100, ((currentQuestionIndex) / totalQuestions) * 100) : 0;
     progressBar.style.width = `${progressPercent}%`;
}


// --- Core Quiz Logic ---

/**
 * Initializes and starts a quiz for a given lesson.
 * Fetches questions if needed, resets state, and displays the first question.
 * @param {object} subject - The subject object.
 * @param {object} grade - The grade object.
 * @param {object} lesson - The lesson object (from app_structure.json).
 * @returns {Promise<boolean>} True if quiz started successfully, false otherwise.
 */
export async function startQuizForLesson(subjectId, gradeId, lessonId) {
    console.log(`[Quiz Engine] Attempting to start quiz for: ${subjectId}/${gradeId}/${lessonId}`);

    if (!subjectId || !gradeId || !lessonId) {
        console.error("[Quiz Engine] Start error: Missing necessary IDs.");
        return false;
    }
    // Ensure DOM elements are cached
    if (!cacheQuizDOMElements()) return false;

    // --- Reset State ---
    resetQuizEngine(); // Clears internal score, index, etc.
    quizLanguage = getCurrentState().currentLanguage || 'ar';

    // --- Load Questions (Optional File) ---
    try {
        const questionsData = await loadLessonQuestions(subjectId, gradeId, lessonId);

        // Check if questions file exists and is not empty
        if (!questionsData || Object.keys(questionsData).length === 0) {
            console.log(`[Quiz Engine] No questions found for lesson ${lessonId} (questions.json empty or not found). Quiz will not start.`);
            // Don't show an error, this is expected if no quiz exists
             resetQuizInterfaceVisually(); // Ensure placeholder is shown
            return false; // Signal that quiz did not start
        }

         // Process the loaded questions (assuming keys are question IDs)
         currentQuestions = shuffleArray(Object.values(questionsData).map((qData, index) => {
              // Try to find an 'id' field, otherwise use the key? Or ensure IDs are in the object.
              // For now, let's try finding an ID field or generate one. It's better if IDs are IN the data.
              const id = qData.id || `q_${index}_${lessonId}`; // Fallback ID generation
               return { ...qData, id: id };
         }));


        if (currentQuestions.length === 0) {
            console.warn(`[Quiz Engine] questions.json for ${lessonId} loaded, but resulted in zero valid questions after processing.`);
            resetQuizInterfaceVisually();
            return false; // Signal failure
        }

        console.log(`[Quiz Engine] Loaded and shuffled ${currentQuestions.length} questions.`);

    } catch (error) {
        // Error during fetch/parse (other than optional 404/empty handled by data_loader)
        console.error(`[Quiz Engine] Failed to load or process questions for ${lessonId}:`, error);
        alert(`خطأ في تحميل أسئلة الاختبار: ${error.message}`);
        resetQuizInterfaceVisually();
        return false; // Signal failure
    }

    // --- Initialize UI for Active Quiz ---
     resultsArea.classList.add('hidden'); resultsArea.classList.remove('show');
     feedbackDisplayArea.style.display = 'none'; feedbackDisplayArea.className = 'feedback-area';
     quizPlaceholderMessage.style.display = 'none';
     activeQuizArea.classList.remove('hidden'); // Show active area

     resetTimerDisplay(); // Timer started by tabs_controller on tab switch

     if (checkAnswerButton) { checkAnswerButton.classList.remove('hidden'); checkAnswerButton.disabled = true; }
     if (nextQuestionButton) { nextQuestionButton.classList.add('hidden'); nextQuestionButton.disabled = true; }

    // --- Load First Question ---
    loadQuestionUI(currentQuestionIndex);
    // Don't update global isQuizActive state here, tabs_controller does that *after* this function returns true
    console.log(`[Quiz Engine] Quiz initialized successfully for ${lessonId}.`);
    return true; // Signal success!
}

/**
 * Resets the quiz engine's internal state.
 * Called when leaving the quiz or starting a new one.
 */
export function resetQuizEngine() {
     console.log("[Quiz Engine] Resetting internal state.");
     currentQuestions = [];
     currentQuestionIndex = 0;
     currentScore = 0;
     userAnswersForCurrentQuestion = {};
      dragDropState = { draggedElement: null, droppedItems: {} };
     // Note: Visual reset (hiding areas, resetting timer display) is handled
     // by resetQuizInterfaceVisually or resetTabsComponent.
}


/**
 * Resets the visual parts of the quiz interface (hides active quiz/results, shows placeholder).
 * Does NOT reset the internal quiz engine state (score, index).
 */
function resetQuizInterfaceVisually() {
     console.log("[Quiz Engine] Resetting quiz interface visuals.");
     if (activeQuizArea) activeQuizArea.classList.add('hidden');
     if (resultsArea) { resultsArea.classList.add('hidden'); resultsArea.classList.remove('show'); }
     if (feedbackDisplayArea) feedbackDisplayArea.style.display = 'none';
     if (quizPlaceholderMessage) quizPlaceholderMessage.style.display = 'block'; // Show default "start quiz" message
     // Reset timer display via imported function
     resetTimerDisplay();
     // Reset progress bar and counters visually
     if (progressBar) progressBar.style.width = '0%';
     if (scoreDisplay) scoreDisplay.textContent = 'النقاط: 0';
     if (difficultyDisplay) difficultyDisplay.textContent = 'المستوى: -';
     if (questionCounterDisplay) questionCounterDisplay.textContent = 'السؤال 0 / 0';
      // Reset buttons
      if (checkAnswerButton) { checkAnswerButton.classList.add('hidden'); checkAnswerButton.disabled = true; }
      if (nextQuestionButton) { nextQuestionButton.classList.add('hidden'); nextQuestionButton.disabled = true; }


}


/**
 * Loads and displays the UI for the question at the given index.
 * @param {number} index - The index of the question in the `currentQuestions` array.
 */
function loadQuestionUI(index) {
    if (index >= currentQuestions.length) {
        console.log("[Quiz Engine] No more questions. Showing results.");
        showQuizResults();
        return;
    }

    const question = currentQuestions[index];
    if (!question || !question.type) {
        console.error(`[Quiz Engine] Error: Invalid question data at index ${index}.`, question);
        // Skip this question or end quiz? Ending for safety.
        showQuizResults();
        return;
    }

    console.log(`[Quiz Engine] Loading Q${index + 1} (ID: ${question.id}), Type: ${question.type}`);

    // Reset UI elements for the new question
    questionDisplayArea.innerHTML = ''; // Clear previous question
    feedbackDisplayArea.innerHTML = '';
    feedbackDisplayArea.style.display = 'none';
     feedbackDisplayArea.classList.remove('show', 'correct', 'incorrect');
    userAnswersForCurrentQuestion = {}; // Clear answers for the new question
    dragDropState.droppedItems = {}; // Clear dropped items for D&D


    updateQuizProgressUI();

    // --- Render Support Content (if any) ---
    let supportContentRendered = false;
    if (question.supportContent && (question.supportContent.en || question.supportContent.ar)) {
        const supportWrapper = document.createElement('div');
        supportWrapper.className = 'support-content-wrapper'; // Use class from CSS
        if (renderBilingualText(supportWrapper, question.supportContent, 'support-content-text')) {
            questionDisplayArea.appendChild(supportWrapper);
            supportContentRendered = true;
             // Add separator only if support content *and* question text exist
             if (question.questionText && (question.questionText.en || question.questionText.ar)) {
                  const separator = document.createElement('hr');
                  separator.className = 'content-separator'; // Use class from CSS
                  questionDisplayArea.appendChild(separator);
             }
        }
    }

    // --- Render Question Text ---
    const questionTextWrapper = document.createElement('div');
    questionTextWrapper.className = 'question-text-wrapper'; // Use class from CSS
    renderBilingualText(questionTextWrapper, question.questionText, 'question-text');
    questionDisplayArea.appendChild(questionTextWrapper);

    // --- Render Question Type Specific UI ---
    const optionsContainer = document.createElement('div');
    // Add class based on type? e.g., options-container, fill-blank-container
     optionsContainer.className = 'options-container'; // Default, adjust in specific renderers if needed
    questionDisplayArea.appendChild(optionsContainer);

    renderQuestionTypeSpecificUI(question, optionsContainer);

    // --- Reset and Configure Buttons ---
    if (checkAnswerButton) {
        checkAnswerButton.classList.remove('hidden');
        checkAnswerButton.disabled = true; // Disable until an option is selected/input entered
         // Re-attach listener to ensure it's always the latest one
         const newCheckBtn = checkAnswerButton.cloneNode(true);
         checkAnswerButton.parentNode.replaceChild(newCheckBtn, checkAnswerButton);
         checkAnswerButton = newCheckBtn;
        checkAnswerButton.onclick = checkCurrentAnswer; // Assign the handler
    }
    if (nextQuestionButton) {
        nextQuestionButton.classList.add('hidden');
        nextQuestionButton.disabled = true;
         const newNextBtn = nextQuestionButton.cloneNode(true);
         nextQuestionButton.parentNode.replaceChild(newNextBtn, nextQuestionButton);
         nextQuestionButton = newNextBtn;
        nextQuestionButton.onclick = loadNextQuestion; // Assign the handler
    }
}

/**
 * Renders the specific input elements (options, inputs, drag/drop areas)
 * based on the question type.
 * @param {object} question - The question data object.
 * @param {HTMLElement} container - The DOM element to render the inputs into.
 */
function renderQuestionTypeSpecificUI(question, container) {
    container.innerHTML = ''; // Clear previous

    switch (question.type.toLowerCase()) {
        case 'mcq':
        case 'choice':
            renderMcqOptions(question, container);
            break;
        case 'fill-blank':
        case 'missing-word':
        case 'missing-letters': // Treat these similarly for input handling
            renderFillBlankInputs(question, container);
            break;
         case 'real-life': // If it just needs input fields found in question text
               setupInputListeners(question); // Only sets up listeners on existing inputs
               break;
        case 'drag-drop':
             renderDragDropUI(question, container);
             break;
         case 'open_response':
             renderOpenResponseInput(question, container);
             break;
        default:
            console.error(`[Quiz Engine] Unsupported question type: ${question.type}`);
            container.innerHTML = `<p class="error-message">نوع السؤال غير مدعوم: ${question.type}</p>`;
            if (checkAnswerButton) checkAnswerButton.disabled = true; // Disable check for unsupported type
    }
}

// --- Specific UI Renderers ---

function renderMcqOptions(question, container) {
    if (!question.options || !Array.isArray(question.options)) {
        console.warn(`[Quiz Engine] MCQ/Choice question ${question.id} is missing options array.`);
        container.innerHTML = "<p class='error-message'>خطأ: خيارات السؤال غير متوفرة.</p>";
        if (checkAnswerButton) checkAnswerButton.disabled = true;
        return;
    }

    const shuffledOptions = shuffleArray(question.options);

    shuffledOptions.forEach(optionData => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option'; // Use class from CSS
        optionElement.setAttribute('role', 'radio');
        optionElement.setAttribute('aria-checked', 'false');
        optionElement.tabIndex = 0; // Make focusable

        const textWrapper = document.createElement('div');
        textWrapper.className = 'option-text-wrapper';

        if (renderBilingualText(textWrapper, optionData, 'option-text')) {
             // Store the value used for checking answer (use language-specific if available)
             optionElement.dataset.value = optionData[quizLanguage] || optionData[quizLanguage === 'ar' ? 'en' : 'ar'] || JSON.stringify(optionData);
             optionElement.appendChild(textWrapper);

             optionElement.onclick = () => handleOptionSelection(optionElement, container);
             optionElement.onkeydown = (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault();
                       handleOptionSelection(optionElement, container);
                  }
             };
        } else {
             optionElement.textContent = "[Invalid Option Data]";
             optionElement.dataset.value = "INVALID_OPTION";
             optionElement.style.cursor = 'not-allowed';
             optionElement.style.opacity = '0.5';
        }
        container.appendChild(optionElement);
    });

    // Ensure check button is disabled initially
    if (checkAnswerButton) checkAnswerButton.disabled = true;
}

function handleOptionSelection(selectedOptionElement, container) {
     // Deselect all other options in this question
     container.querySelectorAll('.option').forEach(opt => {
          opt.classList.remove('selected');
          opt.setAttribute('aria-checked', 'false');
     });
     // Select the clicked one
     selectedOptionElement.classList.add('selected');
     selectedOptionElement.setAttribute('aria-checked', 'true');
     // Store the selected value for checking
     userAnswersForCurrentQuestion.selectedMcqValue = selectedOptionElement.dataset.value;
     // Enable the check button
     if (checkAnswerButton) checkAnswerButton.disabled = false;
}


// Renders inputs based on finding placeholders in the question text (less common now)
// OR more likely, finds inputs already placed in the HTML via questionText object.
function renderFillBlankInputs(question, container) {
    // This function might be simpler if inputs are embedded directly in the questionText HTML.
    // We mainly need to attach listeners here.
    setupInputListeners(question);
}

// Sets up listeners for ANY input field within the question area for the current question
function setupInputListeners(question){
     const inputs = questionDisplayArea.querySelectorAll('input[type="text"], input:not([type]), textarea'); // Find relevant inputs
     let requiredInputsCount = 0;

     if (inputs.length === 0) {
          console.warn(`[Quiz Engine] Fill-Blank/Input question ${question.id}: No input elements found in question area.`);
          if (checkAnswerButton) checkAnswerButton.disabled = true;
          return;
     }

     console.log(`[Quiz Engine] Setting up listeners for ${inputs.length} input(s)`);

     userAnswersForCurrentQuestion.inputs = {}; // Initialize object to store input values

      const checkAllInputsFilled = () => {
         let filledCount = 0;
         inputs.forEach((input, index) => {
              // Use a data-id if available, otherwise index
              const inputId = input.dataset.blankId || `input_${index}`;
              const value = input.value.trim();
              userAnswersForCurrentQuestion.inputs[inputId] = value; // Store current value

              if (value !== '') {
                   filledCount++;
              }
         });
         // Enable check button only if ALL inputs have some text
         if (checkAnswerButton) {
              checkAnswerButton.disabled = (filledCount < requiredInputsCount);
         }
      };

      // Attach listener and count required inputs
     inputs.forEach((input, index) => {
           input.disabled = false; // Ensure enabled
           input.style.borderColor = ''; // Reset border color
           input.addEventListener('input', checkAllInputsFilled);
           // Assume all inputs are required unless marked otherwise (e.g., with data-optional="true")
           if(input.dataset.optional !== 'true'){
               requiredInputsCount++;
           }
           // Store initial values (likely empty)
           const inputId = input.dataset.blankId || `input_${index}`;
           userAnswersForCurrentQuestion.inputs[inputId] = input.value.trim();
     });


     // Initial check to set button state
     checkAllInputsFilled();
      console.log(`[Quiz Engine] ${requiredInputsCount} required input(s) found.`);
}


 // Renders textarea for open response questions
 function renderOpenResponseInput(question, container) {
      const responseWrapper = document.createElement('div');
      responseWrapper.className = 'open-response-wrapper';

      const textarea = document.createElement('textarea');
      textarea.className = 'open-response-input auto-direction'; // Use class from CSS
      textarea.rows = 4; // Default size
      textarea.placeholder = (quizLanguage === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...');
      textarea.setAttribute('aria-label', (quizLanguage === 'ar' ? 'مربع الإجابة' : 'Answer box'));

      userAnswersForCurrentQuestion.openResponse = ''; // Initialize answer

      textarea.addEventListener('input', () => {
           userAnswersForCurrentQuestion.openResponse = textarea.value.trim();
           if (checkAnswerButton) {
                // Enable check button if there's some text
                checkAnswerButton.disabled = (userAnswersForCurrentQuestion.openResponse === '');
           }
      });

      responseWrapper.appendChild(textarea);
      container.appendChild(responseWrapper);

      // Ensure check button is disabled initially
      if (checkAnswerButton) checkAnswerButton.disabled = true;
}


 // --- Drag and Drop UI Rendering and Handlers ---

 function renderDragDropUI(question, container) {
      console.log(`[Quiz Engine] Rendering Drag & Drop UI for QID: ${question.id}`);
       dragDropState.droppedItems = {}; // Reset dropped items map for this question

       const wrapper = document.createElement('div');
       wrapper.className = 'dragdrop-container-multi'; // Use class from CSS

       const optionsArea = document.createElement('div');
       optionsArea.className = 'dragdrop-options'; // Use class from CSS

       const dropZonesArea = document.createElement('div');
       dropZonesArea.className = 'dropzones-wrapper'; // Use class from CSS

       // Validate draggable items
       if (!question.draggableItems || !Array.isArray(question.draggableItems) || question.draggableItems.length === 0) {
            console.error(`[Quiz Engine] D&D Error: Invalid or missing draggableItems for QID: ${question.id}`);
            container.innerHTML = "<p class='error-message'>خطأ: عناصر السحب مفقودة.</p>";
            if (checkAnswerButton) checkAnswerButton.disabled = true;
            return;
       }

       // Create draggable options
       shuffleArray(question.draggableItems).forEach((item) => {
            if (!item || !item.id || !item.text) {
                 console.warn("[Quiz Engine] Skipping invalid D&D draggable item:", item);
                 return;
            }
            const draggableElement = document.createElement('div');
            draggableElement.id = `draggable-${item.id}`; // Ensure unique ID
            draggableElement.className = 'draggable'; // Use class from CSS
            draggableElement.draggable = true;
            draggableElement.setAttribute('aria-grabbed', 'false');
            draggableElement.setAttribute('role', 'button');
            // Use helper for bilingual text
            renderBilingualText(draggableElement, item.text, 'draggable-text'); // Use a specific class if needed
            draggableElement.dataset.itemId = item.id; // Store original ID

            // Add drag event listeners
             draggableElement.addEventListener('dragstart', handleDragStart);
             draggableElement.addEventListener('dragend', handleDragEnd);

            optionsArea.appendChild(draggableElement);
       });

         // Validate drop zones
       if (!question.dropZones || !Array.isArray(question.dropZones) || question.dropZones.length === 0) {
            console.error(`[Quiz Engine] D&D Error: Invalid or missing dropZones for QID: ${question.id}`);
            container.innerHTML = "<p class='error-message'>خطأ: مناطق الإفلات مفقودة.</p>";
            if (checkAnswerButton) checkAnswerButton.disabled = true;
            return;
       }

       // Create drop zones
       question.dropZones.forEach(zoneData => {
            if (!zoneData || !zoneData.id || !zoneData.label || !zoneData.accepts) {
                 console.warn("[Quiz Engine] Skipping invalid D&D drop zone data:", zoneData);
                 return;
            }
             const pairDiv = document.createElement('div');
            pairDiv.className = 'drop-zone-pair'; // Use class from CSS

            const labelElement = document.createElement('span');
            labelElement.className = 'drop-zone-label'; // Use class from CSS
             // Use helper for bilingual label
            renderBilingualText(labelElement, zoneData.label, 'drop-zone-label-text');

             const dropZoneElement = document.createElement('div');
             dropZoneElement.id = `dropzone-${zoneData.id}`; // Ensure unique ID
             dropZoneElement.className = 'drop-zone'; // Use class from CSS
             dropZoneElement.dataset.zoneId = zoneData.id; // Store original zone ID
             dropZoneElement.dataset.accepts = zoneData.accepts; // Store the ID of the item it accepts

             // Add drop event listeners
             dropZoneElement.addEventListener('dragover', handleDragOver);
             dropZoneElement.addEventListener('dragleave', handleDragLeave);
             dropZoneElement.addEventListener('drop', handleDrop);

             pairDiv.appendChild(labelElement);
             pairDiv.appendChild(dropZoneElement);
             dropZonesArea.appendChild(pairDiv);
       });


       wrapper.appendChild(optionsArea);
       wrapper.appendChild(dropZonesArea);
       container.appendChild(wrapper);

       // Initially disable check button
       if (checkAnswerButton) checkAnswerButton.disabled = true;
 }

 function handleDragStart(event) {
      // Prevent dragging disabled items (after checking answer)
      if (event.target.getAttribute('aria-disabled') === 'true') {
           event.preventDefault();
           return;
      }
      dragDropState.draggedElement = event.target;
      event.dataTransfer.setData('text/plain', event.target.id); // Transfer the element's unique DOM ID
      event.dataTransfer.effectAllowed = 'move';
      // Add dragging style slightly later to ensure it's picked up
      setTimeout(() => dragDropState.draggedElement?.classList.add('dragging'), 0);
      dragDropState.draggedElement.setAttribute('aria-grabbed', 'true');
      console.log(`[Quiz Engine D&D] Drag Start: ${dragDropState.draggedElement.id}`);
 }

 function handleDragEnd(event) {
      if (dragDropState.draggedElement) {
           dragDropState.draggedElement.classList.remove('dragging');
           dragDropState.draggedElement.setAttribute('aria-grabbed', 'false');
           console.log(`[Quiz Engine D&D] Drag End: ${dragDropState.draggedElement.id}`);
      }
      // Clean up any lingering drag-over styles
      document.querySelectorAll('.drop-zone.drag-over').forEach(zone => zone.classList.remove('drag-over'));
      dragDropState.draggedElement = null; // Clear reference
 }

 function handleDragOver(event) {
      event.preventDefault(); // Necessary to allow drop

      const dropZone = event.target.closest('.drop-zone');
      if (!dropZone) return;

      // Allow drop only if the zone is empty
      if (!dropZone.querySelector('.draggable')) {
           event.dataTransfer.dropEffect = 'move';
           dropZone.classList.add('drag-over'); // Visual feedback
      } else {
           event.dataTransfer.dropEffect = 'none'; // Indicate drop is not allowed
           dropZone.classList.remove('drag-over');
      }
 }

 function handleDragLeave(event) {
       const dropZone = event.target.closest('.drop-zone');
       if (dropZone) {
            dropZone.classList.remove('drag-over'); // Remove visual feedback
       }
 }

 function handleDrop(event) {
      event.preventDefault();
      const dropZone = event.target.closest('.drop-zone');
       const draggedElId = event.dataTransfer.getData('text/plain');
       const draggedElement = document.getElementById(draggedElId); // Get the element using transferred ID

      // --- Validation ---
      if (!dropZone || !draggedElement) {
            console.warn("[Quiz Engine D&D] Drop failed: Invalid zone or dragged element cannot be found by ID.");
            if(dropZone) dropZone.classList.remove('drag-over');
            return;
      }
      // Prevent dropping onto a zone that already contains an item
      if (dropZone.querySelector('.draggable')) {
           console.warn("[Quiz Engine D&D] Drop failed: Zone already occupied.");
           dropZone.classList.remove('drag-over');
           return; // Don't allow drop
      }

       // --- Perform Drop ---
      dropZone.classList.remove('drag-over'); // Clean up style

       // Get original item ID and zone ID from data attributes
      const droppedItemId = draggedElement.dataset.itemId;
       const targetZoneId = dropZone.dataset.zoneId;

       // Check if the item was previously in another drop zone
      const originZoneId = Object.keys(dragDropState.droppedItems).find(
           zoneId => dragDropState.droppedItems[zoneId] === droppedItemId
       );
      if(originZoneId) {
           delete dragDropState.droppedItems[originZoneId]; // Remove from previous zone mapping
           console.log(`[Quiz Engine D&D] Moved item ${droppedItemId} from zone ${originZoneId}`);
      }


       // Append the element visually
       dropZone.appendChild(draggedElement);

       // Update the state mapping: { 'originalZoneId': 'originalItemId' }
       dragDropState.droppedItems[targetZoneId] = droppedItemId;

       console.log(`[Quiz Engine D&D] Dropped item ${droppedItemId} into zone ${targetZoneId}. Current state:`, { ...dragDropState.droppedItems });

       // Enable check button if all zones are now filled
       checkAllDropZonesFilled();
 }

 function checkAllDropZonesFilled() {
     const question = currentQuestions[currentQuestionIndex];
     if (!question || question.type.toLowerCase() !== 'drag-drop' || !question.dropZones) {
         return; // Not a D&D question or data missing
     }

     const requiredZoneCount = question.dropZones.length;
     const filledZoneCount = Object.keys(dragDropState.droppedItems).length;

     const allFilled = filledZoneCount === requiredZoneCount;
      console.log(`[Quiz Engine D&D] Zones filled check: ${filledZoneCount}/${requiredZoneCount}. All filled: ${allFilled}`);


     if (checkAnswerButton) {
          checkAnswerButton.disabled = !allFilled;
     }
 }



// --- Answer Checking & Feedback ---

/**
 * Checks the answer provided by the user for the current question.
 * Attached to the 'Check' button's click handler.
 */
function checkCurrentAnswer() {
     console.log(`[Quiz Engine] Checking answer for Q${currentQuestionIndex + 1}`);
     if (currentQuestionIndex >= currentQuestions.length) return; // Should not happen

     const question = currentQuestions[currentQuestionIndex];
     if (!question) return;

     let isCorrect = false;
     let userAnswer = null; // Store the answer representation being checked


      // --- Determine Correctness based on Type ---
      try {
          switch (question.type.toLowerCase()) {
               case 'mcq':
               case 'choice':
                    userAnswer = userAnswersForCurrentQuestion.selectedMcqValue;
                    const correctAnswerMCQ = question.correctAnswer?.[quizLanguage]
                         || question.correctAnswer?.[quizLanguage === 'ar' ? 'en' : 'ar']
                         || question.correctAnswer; // Fallback if not bilingual object

                    // Strict comparison might be needed depending on data format
                    isCorrect = (String(userAnswer) === String(correctAnswerMCQ));
                    console.log(`[Quiz Engine] MCQ Check: User='${userAnswer}', Correct='${correctAnswerMCQ}', Result=${isCorrect}`);
                    break;

               case 'fill-blank':
                case 'missing-word':
                case 'missing-letters':
                case 'real-life': // Assume inputs exist in the question area
                    userAnswer = { ...userAnswersForCurrentQuestion.inputs }; // Get collected input values
                     let allBlanksCorrect = true;
                     const correctAnswersFB = question.correctAnswers; // Expecting { blankId: { en: "...", ar: "..." } or "..." or ["..."] }

                     if (!correctAnswersFB || typeof correctAnswersFB !== 'object') {
                         console.error(`[Quiz Engine] Fill-Blank Error: Invalid 'correctAnswers' structure for QID ${question.id}`);
                         allBlanksCorrect = false;
                     } else {
                          const inputElements = questionDisplayArea.querySelectorAll('input[type="text"], input:not([type]), textarea');
                          inputElements.forEach((input, index) => {
                              const blankId = input.dataset.blankId || `input_${index}`; // Match how it was stored
                              const userAnswerClean = String(userAnswer[blankId] || '').trim().toLowerCase();
                               const correctData = correctAnswersFB[blankId];

                               let isThisBlankCorrect = false;
                               if (correctData !== undefined && correctData !== null) {
                                    let possibleCorrectAnswers = [];
                                    if (typeof correctData === 'object' && !Array.isArray(correctData)) {
                                        // Bilingual object {en, ar}
                                        possibleCorrectAnswers.push(String(correctData[quizLanguage] || '').trim().toLowerCase());
                                        possibleCorrectAnswers.push(String(correctData[quizLanguage === 'ar' ? 'en' : 'ar'] || '').trim().toLowerCase());
                                    } else if (Array.isArray(correctData)) {
                                        // Array of possible answers
                                         possibleCorrectAnswers = correctData.map(ans => String(ans).trim().toLowerCase());
                                    } else {
                                        // Simple string answer
                                        possibleCorrectAnswers.push(String(correctData).trim().toLowerCase());
                                    }
                                     // Remove empty strings from possibilities
                                     possibleCorrectAnswers = possibleCorrectAnswers.filter(ans => ans !== '');
                                     // Check if user answer matches any possibility
                                     isThisBlankCorrect = possibleCorrectAnswers.includes(userAnswerClean) && userAnswerClean !== ''; // Must match non-empty correct answer

                               } else {
                                    console.warn(`[Quiz Engine] Fill-Blank Warning: No correct answer data found for blankId '${blankId}' in QID ${question.id}`);
                                    isThisBlankCorrect = false;
                               }


                               if (!isThisBlankCorrect) {
                                    allBlanksCorrect = false;
                                     input.style.borderColor = 'var(--incorrect-color)';
                               } else {
                                    input.style.borderColor = 'var(--correct-color)';
                               }
                          });
                     }
                     isCorrect = allBlanksCorrect;
                    console.log(`[Quiz Engine] Fill-Blank Check: User=${JSON.stringify(userAnswer)}, Result=${isCorrect}`);
                    break;

                 case 'drag-drop':
                    userAnswer = { ...dragDropState.droppedItems }; // Current state of dropped items
                     isCorrect = true; // Assume correct initially
                      if (!question.dropZones || !Array.isArray(question.dropZones)) {
                           console.error(`[Quiz Engine] D&D Error: Invalid dropZones in QID ${question.id}`);
                           isCorrect = false;
                      } else {
                            // Check each defined drop zone against the user's placement
                            question.dropZones.forEach(zoneData => {
                                 const expectedItemId = String(zoneData.accepts); // The ID the zone expects
                                 const actualItemId = String(userAnswer[zoneData.id]); // The ID the user placed here (or 'undefined')
                                 const zoneElement = document.getElementById(`dropzone-${zoneData.id}`);

                                 if (actualItemId !== expectedItemId) {
                                      isCorrect = false;
                                      if (zoneElement) {
                                           zoneElement.style.borderColor = 'var(--incorrect-color)';
                                           zoneElement.style.borderWidth = '3px';
                                           zoneElement.style.backgroundColor = '#f8d7da';
                                      }
                                 } else {
                                      // Correct placement
                                      if (zoneElement) {
                                           zoneElement.style.borderColor = 'var(--correct-color)';
                                            zoneElement.style.borderWidth = '3px';
                                           zoneElement.style.backgroundColor = '#d1e7dd';
                                      }
                                 }
                           });
                      }
                    console.log(`[Quiz Engine] Drag-Drop Check: User State=${JSON.stringify(userAnswer)}, Result=${isCorrect}`);
                    break;

               case 'open_response':
                     userAnswer = userAnswersForCurrentQuestion.openResponse;
                      // Simple check: contains keywords OR is non-trivial length
                      if (question.keywords && Array.isArray(question.keywords) && question.keywords.length > 0) {
                           const userAnswerLower = userAnswer.toLowerCase();
                           isCorrect = question.keywords.some(k => k && userAnswerLower.includes(String(k).toLowerCase()));
                      } else {
                           // Fallback check: is the answer reasonably long? (e.g., > 5 chars)
                           isCorrect = (userAnswer && userAnswer.length > 5);
                           if(!isCorrect) console.warn(`[Quiz Engine] Open Response ${question.id}: Marked incorrect due to length/missing keywords.`);
                      }
                      // Provide visual feedback on the textarea? (Optional)
                       const textarea = questionDisplayArea.querySelector('textarea.open-response-input');
                       if (textarea) {
                            textarea.style.borderColor = isCorrect ? 'var(--correct-color)' : 'var(--incorrect-color)';
                            textarea.style.borderWidth = '2px';
                       }
                    console.log(`[Quiz Engine] Open Response Check: Result=${isCorrect}`);
                    break;

               default:
                   isCorrect = false;
                   console.error(`[Quiz Engine] Cannot check answer: Unsupported type ${question.type}`);
                   break;
          }
      } catch (error) {
           console.error(`[Quiz Engine] Error during answer checking for QID ${question.id}:`, error);
           isCorrect = false;
      }

      // --- Update Score and UI ---
      if (isCorrect) {
           currentScore++;
           playCorrectSound();
      } else {
           playIncorrectSound();
      }


      showFeedback(isCorrect, question);
      updateQuizProgressUI(); // Update score display
      disableQuestionInteraction(question);

      // --- Handle Button Visibility ---
      if (checkAnswerButton) {
           checkAnswerButton.classList.add('hidden');
           checkAnswerButton.disabled = true;
      }
      if (nextQuestionButton) {
           nextQuestionButton.classList.remove('hidden');
           nextQuestionButton.disabled = false;
      }
       console.log(`[Quiz Engine] Answer check complete. Current Score: ${currentScore}`);
}


/**
 * Shows feedback (correct/incorrect message and explanation) to the user.
 * @param {boolean} isCorrect - Whether the user's answer was correct.
 * @param {object} question - The current question object (for feedback text).
 */
function showFeedback(isCorrect, question) {
     if (!feedbackDisplayArea) {
           console.warn("[Quiz Engine] Cannot show feedback: Feedback area element not found.");
           return;
     }

     feedbackDisplayArea.innerHTML = ''; // Clear previous feedback
     feedbackDisplayArea.className = 'feedback-area'; // Reset classes
     feedbackDisplayArea.classList.add(isCorrect ? 'correct' : 'incorrect'); // Add style class

     // Add "Correct!" or "Incorrect!" message
     const resultElement = document.createElement('div');
     resultElement.className = 'feedback-result'; // Use class from CSS
     resultElement.textContent = isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة.';
     feedbackDisplayArea.appendChild(resultElement);

     // Add explanation text (if available)
     const explanationData = isCorrect ? question.feedbackCorrect : question.feedbackIncorrect;
     if (explanationData && (explanationData.en || explanationData.ar)) {
          const explanationWrapper = document.createElement('div');
           explanationWrapper.className = 'feedback-explanation-wrapper'; // Optional wrapper class
          renderBilingualText(explanationWrapper, explanationData, 'feedback-explanation');
           if (explanationWrapper.innerHTML.trim() !== '') { // Only append if text was rendered
               feedbackDisplayArea.appendChild(explanationWrapper);
           }
     }

     // Make the feedback area visible with a fade-in effect
     feedbackDisplayArea.style.display = 'block';
      feedbackDisplayArea.style.opacity = '0';
     setTimeout(() => {
          feedbackDisplayArea.style.transition = 'opacity 0.5s ease-in-out';
          feedbackDisplayArea.classList.add('show'); // Add class to trigger CSS opacity transition
          feedbackDisplayArea.style.opacity = '1';
     }, 10); // Small delay ensures transition applies

     console.log(`[Quiz Engine] Displayed feedback (Correct: ${isCorrect})`);
}

/**
 * Disables interaction with the current question's input elements after checking.
 * Highlights correct answers for MCQ/Choice types.
 * @param {object} question - The current question object.
 */
function disableQuestionInteraction(question) {
     console.log(`[Quiz Engine] Disabling interaction for QID: ${question.id}`);

     switch (question.type.toLowerCase()) {
          case 'mcq':
          case 'choice':
               const correctAnswerMCQ = String(question.correctAnswer?.[quizLanguage]
                    || question.correctAnswer?.[quizLanguage === 'ar' ? 'en' : 'ar']
                    || question.correctAnswer
               );
                questionDisplayArea.querySelectorAll('.option').forEach(opt => {
                     opt.onclick = null; // Remove interaction
                     opt.onkeydown = null;
                     opt.style.cursor = 'default';
                     opt.tabIndex = -1; // Remove from tab order

                     const optionValue = String(opt.dataset.value);
                      // Style the correct answer distinctively
                     if (optionValue === correctAnswerMCQ) {
                          opt.style.borderColor = 'var(--correct-color)';
                          opt.style.borderWidth = '3px'; // Make it prominent
                           // Optional: Add background if it wasn't the selected one
                           if (!opt.classList.contains('selected')) {
                               opt.style.backgroundColor = '#d1e7dd'; // Light green background
                           }
                     } else if (opt.classList.contains('selected')) {
                           // Style the incorrectly selected answer
                           opt.style.borderColor = 'var(--incorrect-color)';
                           opt.style.borderWidth = '3px';
                           opt.style.backgroundColor = '#f8d7da'; // Light red background
                           opt.style.opacity = '0.8';
                     } else {
                          // Dim unselected, incorrect options
                          opt.style.opacity = '0.6';
                     }
                });
               break;

           case 'fill-blank':
           case 'missing-word':
           case 'missing-letters':
           case 'real-life':
                questionDisplayArea.querySelectorAll('input[type="text"], input:not([type]), textarea').forEach(input => {
                     input.disabled = true; // Disable input fields
                     // Border color was set during checkAnswer
                });
               break;

            case 'drag-drop':
                questionDisplayArea.querySelectorAll('.draggable').forEach(el => {
                     el.draggable = false; // Disable dragging
                      el.setAttribute('aria-disabled', 'true');
                     el.style.cursor = 'default';
                      el.style.opacity = '0.7'; // Dim slightly
                     el.removeEventListener('dragstart', handleDragStart); // Remove listeners
                     el.removeEventListener('dragend', handleDragEnd);
                 });
                 questionDisplayArea.querySelectorAll('.drop-zone').forEach(el => {
                     el.classList.remove('drag-over'); // Clean up styles
                     el.removeEventListener('dragover', handleDragOver); // Remove listeners
                     el.removeEventListener('dragleave', handleDragLeave);
                     el.removeEventListener('drop', handleDrop);
                      // Border color was set during checkAnswer
                 });
                console.log("[Quiz Engine] Drag and drop interactions disabled.");
                break;

            case 'open_response':
                 const textarea = questionDisplayArea.querySelector('textarea.open-response-input');
                 if (textarea) {
                      textarea.disabled = true;
                       // Border color set during checkAnswer
                 }
                break;
     }

     // Ensure check button remains disabled after checking
     if (checkAnswerButton) checkAnswerButton.disabled = true;
}


// --- Navigation ---

/**
 * Loads the next question in the sequence or shows results if finished.
 * Attached to the 'Next' button's click handler.
 */
function loadNextQuestion() {
     console.log(`[Quiz Engine] Next button clicked. Current index: ${currentQuestionIndex}`);
     currentQuestionIndex++;

     if (currentQuestionIndex < currentQuestions.length) {
           loadQuestionUI(currentQuestionIndex);
     } else {
           showQuizResults();
     }
}

/**
 * Finalizes the quiz, calculates results, and displays the results section.
 */
function showQuizResults() {
     console.log("[Quiz Engine] Quiz finished. Displaying results.");
     updateState({ isQuizActive: false }); // Update global state
     clearQuizTimer(); // Stop the timer

     // Hide active quiz UI, show results UI
     activeQuizArea.classList.add('hidden');
     resultsArea.classList.remove('hidden');

      // --- Calculate Percentage ---
      // Simple percentage based on raw score vs number of questions
      // Could be enhanced with weighting based on difficulty if needed
      const totalQuestions = currentQuestions.length;
      const percentage = totalQuestions > 0 ? Math.round((currentScore / totalQuestions) * 100) : 0;

      // --- Display Results ---
      if (finalScoreDisplay) finalScoreDisplay.textContent = `النتيجة النهائية: ${currentScore} من ${totalQuestions}`;
      if (finalPercentageDisplay) finalPercentageDisplay.textContent = `النسبة المئوية: ${percentage}%`;

      // --- Generate Final Message & Badges ---
      let message = '';
      let earnedBadges = []; // Array for potential badge objects
      if (percentage >= 90) {
           message = 'ممتاز! أداء رائع حقاً!';
           earnedBadges.push({ text: '🌟', class: 'badge-excellence', title: 'امتياز' });
      } else if (percentage >= 75) {
           message = 'جيد جداً! لقد أبليت بلاءً حسناً!';
           earnedBadges.push({ text: '👍', class: 'badge-great', title: 'جيد جداً' });
      } else if (percentage >= 50) {
           message = 'جيد. هناك دائماً مجال للتحسين.';
           earnedBadges.push({ text: '🚀', class: 'badge-good', title: 'محاولة جيدة' });
      } else {
           message = 'لا بأس. التعلم رحلة، استمر في المحاولة!';
           earnedBadges.push({ text: '💪', class: 'badge-effort', title: 'استمر بالمحاولة' });
      }
       if (finalMessageDisplay) finalMessageDisplay.textContent = message;

       // Display badges
       if (badgesDisplayArea) {
            badgesDisplayArea.innerHTML = ''; // Clear previous
            if (earnedBadges.length > 0) {
                 const badgeTitle = document.createElement('strong');
                 badgeTitle.textContent = 'الشارات: ';
                 badgesDisplayArea.appendChild(badgeTitle);
                 earnedBadges.forEach(badge => {
                      const badgeSpan = document.createElement('span');
                      badgeSpan.className = `badge ${badge.class || ''}`; // Use class from CSS
                      badgeSpan.textContent = badge.text;
                      badgeSpan.title = badge.title || ''; // Tooltip
                      badgesDisplayArea.appendChild(badgeSpan);
                 });
            }
       }

       // --- Setup Restart Button ---
  // Inside showQuizResults function in quiz_engine.js

// --- Setup Restart Button ---
if (restartQuizButton) {
    const newRestartBtn = restartQuizButton.cloneNode(true);
    restartQuizButton.parentNode.replaceChild(newRestartBtn, restartQuizButton);
    restartQuizButton = newRestartBtn; // Update reference

    restartQuizButton.onclick = () => {
         console.log("[Quiz Engine] Restart button clicked.");
         const state = getCurrentState(); // Get current state WITH IDs

         // --- *** CHECK FOR IDs *** ---
         if (state.selectedSubjectId && state.selectedGradeId && state.selectedLessonId) {
             // --- *** PASS IDs TO START FUNCTION *** ---
             startQuizForLesson(
                 state.selectedSubjectId,
                 state.selectedGradeId,
                 state.selectedLessonId
             );
             // No need to switch tab here, assume user is already in the quiz tab
         } else {
              console.error("[Quiz Engine] Cannot restart: Missing subject/grade/lesson state IDs."); // Updated log message
              alert("خطأ: لا يمكن إعادة الاختبار لعدم توفر معلومات الدرس.");
               // Maybe navigate home? Depends on desired behavior.
               // if (typeof navigateHome === 'function') navigateHome(); // Ensure navigateHome is imported if used
         }
    };
    console.log("[Quiz Engine] Restart button listener attached."); // Log listener attachment
} else {
 console.warn("showResults: Restart button #restart-quiz-button not found."); // Handle missing button case
}

         // --- Show results area with transition ---
       resultsArea.style.opacity = '0';
       setTimeout(() => {
            resultsArea.classList.add('show'); // Add class for CSS transition
             resultsArea.style.transition = 'opacity 0.5s ease-in-out';
            resultsArea.style.opacity = '1';
       }, 50);


       // Update final progress bar/counter display (optional)
       if(progressBar) progressBar.style.width = '100%';
       if(questionCounterDisplay) questionCounterDisplay.textContent = `اكتمل (${totalQuestions} سؤال)`;
}

// Expose function to handle timer running out (called by tabs_controller)
window.handleQuizTimeUp = () => {
     console.log("[Quiz Engine] Received time up notification.");
     alert("انتهى الوقت المخصص للاختبار!");
     // Force showing results immediately
      disableQuestionInteraction(currentQuestions[currentQuestionIndex]); // Disable current Q
       showQuizResults();
};


console.log('[Quiz Engine] Module Initialized.');