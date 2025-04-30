// /js/core/state_manager.js
import { DEFAULT_LANGUAGE, MAIN_SECTION_IDS } from '../config/constants.js';

const applicationState = {
    currentLanguage: DEFAULT_LANGUAGE,
    // Store IDs instead of full objects for simplicity with dynamic loading
    selectedSubjectId: null,
    selectedGradeId: null,
    selectedLessonId: null,
    // We might need the titles temporarily for display, store them briefly
    selectedSubjectTitle: null,
    selectedGradeTitle: null,
    selectedLessonTitle: null,
    isQuizActive: false,
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

export function getCurrentState() {
    return { ...applicationState };
}

export function updateState(newState) {
    console.log('[State Manager] Updating state:', newState);
    Object.assign(applicationState, newState);
    console.log('[State Manager] New state:', { ...applicationState });
}

export function resetNavigationState() {
    console.log('[State Manager] Resetting navigation state.');
    updateState({
        selectedSubjectId: null,
        selectedGradeId: null,
        selectedLessonId: null,
        selectedSubjectTitle: null,
        selectedGradeTitle: null,
        selectedLessonTitle: null,
        isQuizActive: false,
        currentCardView: 'subjects'
    });
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