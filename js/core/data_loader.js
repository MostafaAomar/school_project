// /js/core/data_loader.js

import {
    SUBJECTS_LIST_FILE,
    ADVICE_CONTENT_FILE,
    SUBJECTS_DATA_ROOT,
    GRADES_LIST_SUFFIX,
    LESSONS_LIST_SUFFIX,
    LESSON_CONTENT_FILENAME,
    QUESTIONS_FILENAME
} from '../config/constants.js';
import { getCachedData, cacheData } from './state_manager.js';

/**
 * Fetches JSON data from a given URL. Includes basic error handling.
 * @param {string} url - The URL to fetch data from.
 * @param {boolean} [isOptional=false] - If true, a 404 error will resolve promise with null instead of rejecting.
 * @returns {Promise<object|Array|null>} A promise that resolves with the parsed JSON data or null (if optional and 404).
 * @throws {Error} If the fetch request fails (non-404) or the response is not ok (and not optional 404).
 */
async function fetchData(url, isOptional = false) {
    console.log(`[Data Loader] Fetching: ${url}${isOptional ? ' (Optional)' : ''}`);
    try {
        const response = await fetch(url, { cache: 'no-cache' }); // Prevent aggressive browser caching during dev
        if (!response.ok) {
            if (isOptional && response.status === 404) {
                console.log(`[Data Loader] Optional resource not found (404): ${url}. Returning null.`);
                return null; // File doesn't exist, return null gracefully
            } else {
                 throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }
        }
        // Check for empty response body which causes json() to fail
        const text = await response.text();
        if (!text) {
             if (isOptional) {
                  console.log(`[Data Loader] Optional resource empty: ${url}. Returning null.`);
                  return null;
             } else {
                  // Treat empty mandatory files as an error, or return default empty state?
                  // Returning default empty state for now, e.g. for empty questions.json
                  console.warn(`[Data Loader] Required resource empty: ${url}. Returning empty object.`);
                  return {};
             }
        }
        const data = JSON.parse(text); // Parse text manually after check
        console.log(`[Data Loader] Successfully fetched and parsed: ${url}`);
        return data;
    } catch (error) {
        console.error(`[Data Loader] Failed to fetch or parse ${url}:`, error);
        if (isOptional) {
            return null; // Return null on any error for optional files
        }
        throw error; // Re-throw for mandatory files
    }
}

/**
 * Loads the main list of subjects.
 * @returns {Promise<Array|null>} Array of subject objects or null on error.
 */
export async function loadSubjectsList() {
    const cacheType = 'subjectsList';
    const cached = getCachedData(cacheType);
    if (cached) return cached;

    try {
         const data = await fetchData(SUBJECTS_LIST_FILE);
         if (data) cacheData(cacheType, null, null, null, data);
         return data;
    } catch (error) {
         console.error("[Data Loader] CRITICAL: Failed to load subjects list.", error);
         return null; // Indicate critical failure
    }
}

/**
 * Loads the list of grades for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @returns {Promise<Array|null>} Array of grade objects or null on error.
 */
export async function loadGradesList(subjectId) {
    if (!subjectId) return null;
    const cacheType = 'gradesList';
    const cached = getCachedData(cacheType, subjectId);
    if (cached) return cached;

    const path = `${SUBJECTS_DATA_ROOT}${subjectId}/${subjectId}${GRADES_LIST_SUFFIX}`;
    try {
         const data = await fetchData(path);
         if (data) cacheData(cacheType, subjectId, null, null, data);
         return data;
    } catch (error) {
         console.error(`[Data Loader] Failed to load grades list for ${subjectId}:`, error);
         return null;
    }
}

/**
 * Loads the list of lessons for a specific grade within a subject.
 * @param {string} subjectId - The ID of the subject.
 * @param {string} gradeId - The ID of the grade.
 * @returns {Promise<Array|null>} Array of lesson objects or null on error.
 */
export async function loadLessonsList(subjectId, gradeId) {
    if (!subjectId || !gradeId) return null;
    const cacheType = 'lessonsList';
    const cached = getCachedData(cacheType, subjectId, gradeId);
    if (cached) return cached;

    const path = `${SUBJECTS_DATA_ROOT}${subjectId}/${gradeId}/${gradeId}${LESSONS_LIST_SUFFIX}`;
     try {
         const data = await fetchData(path);
         if (data) cacheData(cacheType, subjectId, gradeId, null, data);
         return data;
    } catch (error) {
         console.error(`[Data Loader] Failed to load lessons list for ${subjectId}/${gradeId}:`, error);
         return null;
    }
}

/**
 * Loads the detailed content for a specific lesson.
 * @param {string} subjectId
 * @param {string} gradeId
 * @param {string} lessonId
 * @returns {Promise<object|null>} Lesson content object or null on error.
 */
export async function loadLessonDetails(subjectId, gradeId, lessonId) {
    if (!subjectId || !gradeId || !lessonId) return null;
    const cacheType = 'lessonDetails';
    const cached = getCachedData(cacheType, subjectId, gradeId, lessonId);
    if (cached) return cached;

    const path = `${SUBJECTS_DATA_ROOT}${subjectId}/${gradeId}/${lessonId}/${LESSON_CONTENT_FILENAME}`;
     try {
         // Lesson content is usually mandatory if the lesson exists
         const data = await fetchData(path, false); // false = not optional
         if (data) cacheData(cacheType, subjectId, gradeId, lessonId, data);
         return data;
    } catch (error) {
         console.error(`[Data Loader] Failed to load lesson details for ${subjectId}/${gradeId}/${lessonId}:`, error);
         return null;
    }
}


/**
 * Loads the questions for a specific lesson. This is treated as OPTIONAL.
 * If questions.json doesn't exist or is empty, it returns null gracefully.
 * @param {string} subjectId
 * @param {string} gradeId
 * @param {string} lessonId
 * @returns {Promise<object|null>} Questions object or null if none found/error.
 */
export async function loadLessonQuestions(subjectId, gradeId, lessonId) {
    if (!subjectId || !gradeId || !lessonId) return null;
    const cacheType = 'lessonQuestions';
    const cached = getCachedData(cacheType, subjectId, gradeId, lessonId);
    // Check explicitly for null, as empty object {} is a valid cache entry for 'no questions'
    if (cached !== null) return cached;

    const path = `${SUBJECTS_DATA_ROOT}${subjectId}/${gradeId}/${lessonId}/${QUESTIONS_FILENAME}`;
    try {
          // Questions are optional - use true for the isOptional flag
         const data = await fetchData(path, true);
          // Cache the result, even if it's null (indicates checked, none found)
         cacheData(cacheType, subjectId, gradeId, lessonId, data);
         // Return data (which might be null or an empty object {})
         return data;
    } catch (error) {
          // Should not happen if isOptional is true, but just in case
         console.error(`[Data Loader] Unexpected error loading optional questions for ${subjectId}/${gradeId}/${lessonId}:`, error);
          cacheData(cacheType, subjectId, gradeId, lessonId, null); // Cache null on error too
         return null;
    }
}


// Load advice content (unchanged logic, just uses the new fetchData)
export async function loadAdviceContent() {
    const cacheType = 'adviceContent';
    const cached = getCachedData(cacheType);
    if (cached) return cached;

    try {
        const data = await fetchData(ADVICE_CONTENT_FILE);
        if (data) cacheData(cacheType, null, null, null, data);
        return data;
    } catch(error) {
         console.error("[Data Loader] Failed to load advice content.", error);
         return null;
    }
}


console.log('[Data Loader] Module Initialized (v2 - Dynamic Loading).');