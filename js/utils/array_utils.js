
export function shuffleArray(array) {
    // Ensure input is an array
    if (!Array.isArray(array)) {
        console.warn('[Array Utils] shuffleArray received non-array input:', array);
        return [];
    }

    // Create a copy to avoid modifying the original array directly
    const shuffledArray = [...array];

    // Start from the last element and swap one by one.
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements shuffledArray[i] and shuffledArray[j]
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

/**
 * Checks if two arrays are equal (containing the same elements in the same order).
 * Compares elements using string conversion for simple values.
 * @param {Array} arr1 The first array.
 * @param {Array} arr2 The second array.
 * @returns {boolean} True if the arrays are equal, false otherwise.
 */
export function arraysAreEqual(arr1, arr2) {
    // Basic checks for null/undefined or different lengths
    if (!arr1 || !arr2 || !Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
        return false;
    }

    // Compare each element
    return arr1.every((value, index) => String(value) === String(arr2[index]));
}


console.log('[Array Utils] Module Initialized.');