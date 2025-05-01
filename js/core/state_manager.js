// /js/core/state_manager.js
import { DEFAULT_LANGUAGE, MAIN_SECTION_IDS } from '../config/constants.js';

const SESSION_STORAGE_KEY = 'appNavigationState'; // Key for sessionStorage

const applicationState = {
    currentLanguage: DEFAULT_LANGUAGE,
    selectedSubjectId: null,
    selectedGradeId: null,
    selectedLessonId: null,
    selectedSubjectTitle: null,
    selectedGradeTitle: null,
    selectedLessonTitle: null,
    isQuizActive: false, // Let's NOT persist quiz state for simplicity
    currentCardView: 'subjects',
    activeMainSectionId: MAIN_SECTION_IDS.FLOW,
    cachedData: {
        subjectsList: null, // Cache for data/subjects.json
        adviceContent: null,
        // Dynamic caches, keyed appropriately
        gradesList: {},      // e.g., gradesList['english'] = [...]
        lessonsList: {},     // e.g., lessonsList['english_baccalaureate'] = [...]
        lessonDetails: {},   // e.g., lessonDetails['english_baccalaureate_life_choices'] = {...}
        lessonQuestions: {}  // e.g., lessonQuestions['english_baccalaureate_life_choices'] = {...}
    }
};
function saveNavigationStateToSession() {
    try {
        const stateToSave = {
            selectedSubjectId: applicationState.selectedSubjectId,
            selectedGradeId: applicationState.selectedGradeId,
            selectedLessonId: applicationState.selectedLessonId,
            selectedSubjectTitle: applicationState.selectedSubjectTitle,
            selectedGradeTitle: applicationState.selectedGradeTitle,
            selectedLessonTitle: applicationState.selectedLessonTitle,
            currentCardView: applicationState.currentCardView,
            activeMainSectionId: applicationState.activeMainSectionId,
            // Don't save isQuizActive - quiz should restart if page reloads
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
        // console.log('[State Manager] Saved navigation state to sessionStorage:', stateToSave);
    } catch (error) {
        console.error('[State Manager] Failed to save state to sessionStorage:', error);
    }
}

// --- Helper to load state from sessionStorage ---
export function restoreStateFromSession() {
    try {
        const savedStateString = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (savedStateString) {
            const restoredState = JSON.parse(savedStateString);
            // Basic validation: Check if essential keys exist
            if (restoredState && restoredState.activeMainSectionId && restoredState.currentCardView) {
                console.log('[State Manager] Restoring state from sessionStorage:', restoredState);
                // Update the in-memory state, but only with the persisted fields
                // Don't overwrite cachedData or language potentially set elsewhere initially
                 updateState({ // Use updateState to ensure consistency (even though it saves again)
                     selectedSubjectId: restoredState.selectedSubjectId || null,
                     selectedGradeId: restoredState.selectedGradeId || null,
                     selectedLessonId: restoredState.selectedLessonId || null,
                     selectedSubjectTitle: restoredState.selectedSubjectTitle || null,
                     selectedGradeTitle: restoredState.selectedGradeTitle || null,
                     selectedLessonTitle: restoredState.selectedLessonTitle || null,
                     currentCardView: restoredState.currentCardView || 'subjects',
                     activeMainSectionId: restoredState.activeMainSectionId || MAIN_SECTION_IDS.FLOW,
                     isQuizActive: false // Always reset quiz status on restore
                 });
                return true; // Indicate success
            } else {
                console.warn('[State Manager] Invalid state found in sessionStorage. Clearing.');
                sessionStorage.removeItem(SESSION_STORAGE_KEY);
            }
        }
    } catch (error) {
        console.error('[State Manager] Failed to restore state from sessionStorage:', error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY); // Clear invalid data
    }
    return false; // Indicate failure or no state found
}



export function getCurrentState() {
    return { ...applicationState };
}

export function updateState(newState) {
    console.log('[State Manager] Updating state:', newState);
    Object.assign(applicationState, newState);
    // --- SAVE TO SESSION STORAGE AFTER UPDATE ---
    saveNavigationStateToSession();
    // -----------------------------------------
    console.log('[State Manager] New state:', { ...applicationState }); // Log after saving
}

export function resetNavigationState() {
    console.log('[State Manager] Resetting navigation state.');
    updateState({ // This will also trigger saveNavigationStateToSession with nulls
        selectedSubjectId: null,
        selectedGradeId: null,
        selectedLessonId: null,
        selectedSubjectTitle: null,
        selectedGradeTitle: null,
        selectedLessonTitle: null,
        isQuizActive: false,
        currentCardView: 'subjects'
    });
       // --- CLEAR SESSION STORAGE ON EXPLICIT RESET ---
    try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        console.log('[State Manager] Cleared navigation state from sessionStorage.');
    } catch (error) {
        console.error('[State Manager] Failed to clear sessionStorage:', error);
    }
}

/**
 * Creates a composite key for caching grade/lesson related data.
 * @param {string|null} subjectId
 * @param {string|null} gradeId
 * @param {string|null} lessonId
 * @returns {string} The composite key (e.g., "english_baccalaureate_life_choices").
 */
function createCacheKey(subjectId = null, gradeId = null, lessonId = null) {
     return [subjectId, gradeId, lessonId].filter(Boolean).join('_'); // Filter out nulls and join
}


/**
 * Caches fetched data using appropriate simple or composite keys.
 * @param {'subjectsList'|'adviceContent'|'gradesList'|'lessonsList'|'lessonDetails'|'lessonQuestions'} cacheType - The type of data being cached.
 * @param {string|null} subjectId - Subject ID (required for grades, lessons, details, questions).
 * @param {string|null} gradeId - Grade ID (required for lessons, details, questions).
 * @param {string|null} lessonId - Lesson ID (required for details, questions).
 * @param {*} data - The data to cache.
 */
export function cacheData(cacheType, subjectId, gradeId, lessonId, data) {
    const topLevelKeys = ['subjectsList', 'adviceContent'];
    if (topLevelKeys.includes(cacheType)) {
        applicationState.cachedData[cacheType] = data;
        console.log(`[State Manager] Cached data for top-level key: ${cacheType}`);
    } else if (applicationState.cachedData.hasOwnProperty(cacheType)) {
        const key = createCacheKey(subjectId, gradeId, lessonId);
        if (key) {
            applicationState.cachedData[cacheType][key] = data;
            console.log(`[State Manager] Cached data for ${cacheType} with key: ${key}`);
        } else {
             console.warn(`[State Manager] Could not generate valid key for cacheType ${cacheType} with IDs:`, { subjectId, gradeId, lessonId });
        }
    } else {
        console.warn(`[State Manager] Attempted to cache data for unknown cacheType: ${cacheType}`);
    }
    // console.log('[State Manager] Current Cache:', applicationState.cachedData);
}

/**
 * Retrieves cached data.
 * @param {'subjectsList'|'adviceContent'|'gradesList'|'lessonsList'|'lessonDetails'|'lessonQuestions'} cacheType
 * @param {string|null} subjectId
 * @param {string|null} gradeId
 * @param {string|null} lessonId
 * @returns {*} The cached data, or null if not found.
 */
export function getCachedData(cacheType, subjectId = null, gradeId = null, lessonId = null) {
    const topLevelKeys = ['subjectsList', 'adviceContent'];
    if (topLevelKeys.includes(cacheType)) {
        const data = applicationState.cachedData[cacheType];
        if (data) {
             console.log(`[State Manager] Cache hit for top-level key: ${cacheType}`);
             return data;
        }
    } else if (applicationState.cachedData.hasOwnProperty(cacheType)) {
        const key = createCacheKey(subjectId, gradeId, lessonId);
        if (key && applicationState.cachedData[cacheType][key]) {
            console.log(`[State Manager] Cache hit for ${cacheType} with key: ${key}`);
            return applicationState.cachedData[cacheType][key];
        }
    }
    console.log(`[State Manager] Cache miss for ${cacheType} with key: ${createCacheKey(subjectId, gradeId, lessonId)}`);
    return null;
}

console.log('[State Manager] Module Initialized (v2 - Dynamic Paths).');