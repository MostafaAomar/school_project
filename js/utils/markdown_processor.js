// /js/utils/markdown_processor.js

/**
 * @fileoverview Utility function to process simple markdown-like text into HTML.
 * Handles conversions for bold text and newlines.
 */

/**
 * Converts simple markdown-like syntax (**bold text**, \n) to HTML tags (<strong>, <br>).
 * @param {string|null|undefined} text - The input string potentially containing markdown.
 * @returns {string} - The processed string with HTML tags. Returns an empty string for invalid input.
 */
export function processSimpleMarkdown(text) {
    // Return immediately for null, undefined, or non-string types
    if (typeof text !== 'string' || !text) {
        return '';
    }

    let processedText = text;

    // 1. Replace **bold text** with <strong>bold text</strong>
    //    Using a regular expression:
    //    \*\* : Escaped asterisk (matches the literal character *)
    //    (     : Start capturing group 1
    //    [^*]+ : Match one or more characters that are NOT an asterisk (*)
    //            (Using [^*] is simpler than .+? and avoids potential issues with nested patterns if simple)
    //    )     : End capturing group 1
    //    \*\* : Escaped asterisk (matches the literal closing **)
    //    g     : Global flag - replace all occurrences in the string
    const boldRegex = /\*\*([^*]+)\*\*/g;
    processedText = processedText.replace(boldRegex, '<strong>$1</strong>');
    // '$1' refers to the content captured by the first group (...)

    // 2. Replace newline characters (\n) with HTML line break tags (<br>)
    //    Uses a simple global replacement.
    processedText = processedText.replace(/\n/g, '<br>');

    // --- Future Enhancements ---
    // You could add more rules here later, for example:
    // // Replace *italic text* with <em>italic text</em>
    // const italicRegex = /\*([^*]+)\*/g; // Simple italic (single asterisk)
    // processedText = processedText.replace(italicRegex, '<em>$1</em>');

    return processedText;
}

// Log to console when this module is loaded
console.log('[Markdown Processor] Module Initialized.');