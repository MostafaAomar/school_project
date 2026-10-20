// /js/config/constants.js

// Determine base path depending on whether the running page is at root or in school_project/
let detectedBase = './school_project/';
if (typeof document !== 'undefined') {
    const scripts = [...document.querySelectorAll('script[src]')];
    const hasLocalJs = scripts.some(s => s.getAttribute('src')?.startsWith('./js/'));
    if (hasLocalJs || location.pathname.includes('/school_project/')) {
        detectedBase = './';
    }
}

export const DATA_PATH = `${detectedBase}data/`;               // Dynamically resolves to ./school_project/data/ or ./data/
export const SUBJECTS_LIST_FILE = `${DATA_PATH}subjects.json`;
export const ADVICE_CONTENT_FILE = `${DATA_PATH}advice_content.json`;
export const SUBJECTS_DATA_ROOT = `${DATA_PATH}subjects/`; // Root for subject-specific data
export const DEFAULT_ICON_PATH = `${detectedBase}images/default-icon.png`;

// Suffixes for dynamically loaded files (these are fine)
export const GRADES_LIST_SUFFIX = '_grades.json';
export const LESSONS_LIST_SUFFIX = '_lessons.json';
export const LESSON_CONTENT_FILENAME = 'lesson_content.json';
export const QUESTIONS_FILENAME = 'questions.json';

// --- Other constants (likely unchanged) --- VVV
export const DEFAULT_LANGUAGE = 'ar';
export const DEFAULT_QUIZ_DURATION_SECONDS = 45 * 60; //change timer too 45 min

export const VIEW_IDS = {
    SUBJECTS: 'subjects-view-container',
    GRADES: 'grades-view-container',
    LESSONS: 'lessons-view-container',
};

export const GRID_IDS = {
    SUBJECTS: 'subjects-grid',
     GRADES: 'grades-grid',
     LESSONS: 'lessons-grid',
};

export const MAIN_SECTION_IDS = {
    FLOW: '#subject-grade-lesson-flow',
    TABS: '#lesson-quiz-tabs-section',
    ADVICE: '#advice-section',
    HANDWRITING: '#handwriting-section',
    CHATBOT: '#chatbot-section',
    ARABIC: '#nonspeaker-arabic-section',
    SOURCES: '#external-sources-section',
    CONTACT: '#contact-section',
};


console.log('[Constants] Loaded configuration (v3 - Root Relative Paths)');