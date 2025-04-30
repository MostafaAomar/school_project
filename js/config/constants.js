// /js/config/constants.js

export const DATA_PATH = '../data/';
export const SUBJECTS_LIST_FILE = `${DATA_PATH}subjects.json`; // Renamed from APP_STRUCTURE_FILE
export const ADVICE_CONTENT_FILE = `${DATA_PATH}advice_content.json`;
export const SUBJECTS_DATA_ROOT = `${DATA_PATH}subjects/`; // Root for subject-specific data

// Suffixes for dynamically loaded files
export const GRADES_LIST_SUFFIX = '_grades.json';
export const LESSONS_LIST_SUFFIX = '_lessons.json';
export const LESSON_CONTENT_FILENAME = 'lesson_content.json';
export const QUESTIONS_FILENAME = 'questions.json';


export const DEFAULT_LANGUAGE = 'ar';
export const DEFAULT_QUIZ_DURATION_SECONDS = 30 * 60;


export const DEFAULT_ICON_PATH = '../images/default-icon.png';

console.log('[Constants] Loaded configuration (v2 - Dynamic Paths)');

// /js/config/constants.js

// ... other constants ...

export const VIEW_IDS = {
    SUBJECTS: 'subjects-view-container', // <<< MUST HAVE THIS KEY
    GRADES: 'grades-view-container',
    LESSONS: 'lessons-view-container',
};

export const GRID_IDS = {
    SUBJECTS: 'subjects-grid',
     GRADES: 'grades-grid',
     LESSONS: 'lessons-grid',
};

export const MAIN_SECTION_IDS = {
    FLOW: '#subject-grade-lesson-flow', // <<< MUST HAVE THIS KEY (with #)
    TABS: '#lesson-quiz-tabs-section',
    ADVICE: '#advice-section',
    HANDWRITING: '#handwriting-section',
    CHATBOT: '#chatbot-section',
    ARABIC: '#nonspeaker-arabic-section',
    SOURCES: '#external-sources-section',
    CONTACT: '#contact-section',
};


// ... rest of the file ...