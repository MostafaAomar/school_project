/**
 * EduBot Content Search Script (Arabic Focused - Enhanced Fields)
 * ... (rest of the comments remain the same) ...
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements (Matching your HTML) ---
    const chatMessagesContainer = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const bodyElement = document.body;

    // --- State and Configuration ---
    let mergedData = {};
    // *** Path to the file containing the list of JSON sources ***
    const dataSourceIndexFile = '../../data/subdata/chatbot.json';
    let currentLanguage = 'ar'; // Default to Arabic based on HTML

    // ========================================================================
    // == 1. DATA LOADING & INITIALIZATION (*** UPDATED ***)
    // ========================================================================
    // ========================================================================
    // == 1. DATA LOADING & INITIALIZATION (*** UPDATED TO HANDLE LESSON STRUCTURE ***)
    // ========================================================================
    async function loadAndMergeData() {
        // ... (initial setup, fetch index file, get dataFileUrls - same as before) ...
        showTypingIndicator(true, "جاري تحميل قائمة المصادر...");
        disableInput(true);
        try {
            // Step 1 & 2: Fetch index and get URLs (Keep your existing code for this)
            const indexResponse = await fetch(dataSourceIndexFile); // Assuming dataSourceIndexFile is defined
            if (!indexResponse.ok) throw new Error(`Failed to load source list (${dataSourceIndexFile}): ${indexResponse.status}`);
            const sourcesList = await indexResponse.json();
            if (!Array.isArray(sourcesList)) throw new Error(`Source list file (${dataSourceIndexFile}) is not a valid JSON array.`);
            const dataFileUrls = sourcesList.map(s => s.url).filter(url => typeof url === 'string' && url.trim() !== '');
            if (dataFileUrls.length === 0) { /* ... handle no URLs ... */ return; }

            console.log(`Found ${dataFileUrls.length} data sources in ${dataSourceIndexFile}:`, dataFileUrls);
            showTypingIndicator(true, `جاري تحميل البيانات من ${dataFileUrls.length} مصادر...`);

            // Step 3: Fetch all data files (Keep your existing code for this)
            const fetchPromises = dataFileUrls.map(url =>
                fetch(url)
                .then(response => { /* ... handle response ok ... */ return response.json().catch( /* ... handle parse error ... */); })
                .catch(error => { /* ... handle fetch error ... */ throw error; })
            );
            const datasets = await Promise.all(fetchPromises);

            // --- Step 4: Merge data, **handling different structures** ---
            mergedData = {}; // Reset before merging
            datasets.forEach((data, index) => {
                const sourceUrl = dataFileUrls[index];
                if (data && typeof data === 'object' && !Array.isArray(data)) { // Ensure it's a non-array object

                    // *** Heuristic Check: Does it look like lesson content? ***
                    // Checks if it has 'textContent' BUT does NOT have keys that look like typical IDs (e.g., 'e_l1_q5')
                    // Adjust the ID regex pattern if your IDs follow a different convention
                    const keys = Object.keys(data);
                    const hasTextContent = keys.includes('textContent');
                    // Simple check: assume if it doesn't have keys with underscores, it might be lesson content
                    const hasIdLikeKeys = keys.some(key => key.includes('_') && key.length > 3); // Basic check for ID format

                    if (hasTextContent && !hasIdLikeKeys) {
                        // --- Structure Looks Like lesson_content.json ---
                        console.log(`Detected lesson-like structure in ${sourceUrl}. Wrapping with generated ID.`);
                        // Generate a unique ID (e.g., based on filename or index)
                        const generatedId = `lesson_${sourceUrl.split('/').pop().replace(/\.json$/i, '') || index}`;
                        if (mergedData[generatedId]) {
                             console.warn(`Generated ID collision for ${generatedId} from ${sourceUrl}. Overwriting previous.`);
                        }
                        // Wrap the entire 'data' object under the generated ID
                        mergedData[generatedId] = data;
                         console.log(`  Wrapped content under ID: ${generatedId}`);

                    } else {
                        // --- Structure Looks Like questions.json (or other ID-based) ---
                        // Assume it's the standard { id: content, id2: content2 } structure
                        console.log(`Detected standard ID-based structure in ${sourceUrl}. Merging directly.`);
                        Object.assign(mergedData, data); // Merge directly
                    }

                } else {
                    console.warn(`Data from ${sourceUrl} is not a valid object or is an array. Skipping merge.`);
                }
            });

            console.log(`Load & Merge complete. Final structure keys:`, Object.keys(mergedData)); // Debug log
            console.log(`Total items in mergedData: ${Object.keys(mergedData).length}`);

            if (Object.keys(mergedData).length === 0) { /* ... handle no data ... */ }

        } catch (error) {
             /* ... handle critical errors ... */
        } finally {
            showTypingIndicator(false);
            disableInput(Object.keys(mergedData).length === 0);
        }
    } // End loadAndMergeData

    function showTypingIndicator(show, text = "جاري الكتابة...") {
        if (typingIndicator) {
            typingIndicator.textContent = text;
            typingIndicator.style.display = show ? 'block' : 'none';
        }
        if (show) chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function disableInput(isDisabled = true) {
        userInput.disabled = isDisabled;
        sendButton.disabled = isDisabled;
        userInput.placeholder = isDisabled ? "يرجى الانتظار..." : "اكتب سؤالك هنا...";
    }

    // ========================================================================
    // == 2. LANGUAGE DETECTION & TEXT PROCESSING (No changes needed here)
    // ========================================================================
    function detectLanguage(text) { /* ... (same as before) ... */
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? 'ar' : 'en';
    }

    /**
     * Normalizes text for search: lowercase, remove punctuation & Arabic diacritics.
     */
    function normalizeTextForSearch(text) {
        if (typeof text !== 'string') return '';
        return text
            .toLowerCase() // For English case-insensitivity
            .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics (tashkeel)
            .replace(/[.,!?;:"'؟،؛]/g, '') // Remove common punctuation
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    function extractSentenceWithMatch(fullText, query) { /* ... (same as before - should be okay) ... */
         if (!fullText || !query) return fullText || '';
        const sentenceEndingsRegex = /[.!?؟،؛](?=\s|$)/;
        const sentences = fullText.split(sentenceEndingsRegex).map(s => s.trim()).filter(s => s.length > 0);
        const potentialSentences = (sentences.length > 0) ? sentences : [fullText];
        const normalizedQuery = normalizeTextForSearch(query);

        for (const sentence of potentialSentences) {
            const normalizedSentence = normalizeTextForSearch(sentence);
            // Use the updated whole-word regex logic for finding the sentence
            try {
                 const escapedQueryForRegex = normalizedQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                 // Use a simpler check here, maybe substring is okay for *finding* the sentence
                 // Or refine the whole-word regex if needed even here. Let's stick to includes for finding the *block*.
                 // The critical part is the main searchContent regex.
                 // Alternative: Use the more robust regex from searchContent if includes isn't good enough.
                if (normalizedSentence.includes(normalizedQuery)) { // Keep using includes for simplicity here, refine if needed
                    return sentence;
                }
            } catch(e) {
                console.warn("Error creating regex during sentence extraction:", e);
                // Fallback to simple includes if regex fails
                if (normalizedSentence.includes(normalizedQuery)) {
                    return sentence;
                }
            }
        }
        console.warn("لم يتم عزل الجملة المطابقة بدقة، سيتم عرض النص الكامل.", {query, fullText});
        return fullText.trim();
    }

    /**
     * Highlights matches using a regex that attempts word boundaries for both languages.
     */
    function highlightMatch(text, query) {
        if (!text || !query) return text || '';
        try {
            const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            // --- Revised Regex for Word Boundary (more language agnostic) ---
            // Matches query if it's preceded by start-of-string OR non-letter/non-number
            // And followed by end-of-string OR non-letter/non-number
            // This avoids the \b limitation with non-ASCII letters.
            // Using Unicode property escapes (\p{L}, \p{N}) for broader compatibility:
             const regex = new RegExp(`(?<=^|[^\\p{L}\\p{N}])(${escapedQuery})(?=$|[^\\p{L}\\p{N}])`, 'giu');
            // Explanation:
            // (?<=^|[^\p{L}\p{N}]) : Positive lookbehind - asserts that before the match is start (^) OR not a Letter/Number
            // (${escapedQuery})    : Captures the actual query match
            // (?=$|[^\p{L}\p{N}])  : Positive lookahead - asserts that after the match is end ($) OR not a Letter/Number
            // 'g' : Global search
            // 'i' : Case-insensitive (for English)
            // 'u' : Unicode mode (essential for \p{...} to work correctly)

            // Fallback Regex (if lookbehind or \p{} not supported - less precise):
            // const regex = new RegExp(`(?:^|\\s|[.,!?;:"'؟،؛])(${escapedQuery})(?:$|\\s|[.,!?;:"'؟،؛])`, 'gi');

            return text.replace(regex, (match, capturedQuery) => {
                // We need to reconstruct the match slightly differently for the lookaround regex
                // The lookaround itself isn't part of the *match*, only the captured group is the query.
                // However, text.replace replaces the whole matched part including boundaries if they were not zero-width assertions.
                // The lookaround version correctly replaces *only* the captured word.
                 return `<strong class="highlight">${capturedQuery}</strong>`;

                // If using the Fallback Regex, the replacement might need adjustment if it captures surrounding space/punctuation.
                // Example for Fallback: return match.replace(capturedQuery, `<strong class="highlight">${capturedQuery}</strong>`);
            });

        } catch (e) {
            console.error("فشل تمييز النص:", e, "Query:", query, "Text:", text);
             // If regex fails, fall back to basic highlighting (might highlight partial words)
             try {
                 const fallbackRegex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
                 return text.replace(fallbackRegex, '<strong class="highlight">$1</strong>');
             } catch (e2) {
                 console.error("Fallback highlighting failed:", e2);
                 return text; // Return original text on error
             }
        }
    }

    // ========================================================================
    // == 3. SEARCH & MATCHING LOGIC (Should work correctly with updated load)
    // ========================================================================
    // ========================================================================
    // == 3. SEARCH & MATCHING LOGIC (*** UPDATED for specific 'options' structure ***)
    // ========================================================================

    function searchContent(query, language) {
        const normalizedQuery = normalizeTextForSearch(query);
        if (!normalizedQuery) return [];

        // --- Create regex for whole word matching (same as before) ---
        let wholeWordRegex;
        try {
            const escapedQueryForRegex = normalizedQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            wholeWordRegex = new RegExp(`(?<=^|[^\\p{L}\\p{N}])${escapedQueryForRegex}(?=$|[^\\p{L}\\p{N}])`, 'iu');
        } catch (e) {
            console.error("Could not create search regex for query:", query, e);
            console.warn("Falling back to substring search due to regex error.");
            wholeWordRegex = null; // Indicate regex failure
        }
        // ---------------------------------------------

        // Define fields to search. The path format (e.g., `options.${language}`)
        // is still useful for consistency, but we'll handle 'options' specially.
        const fieldsToSearch = [
            `questionText.${language}`,
            `textContent.${language}`,
            `supportContent.${language}`,
            `options.${language}`, // Keep this entry, but handle its logic differently
            `correctAnswer.${language}`,
            `feedbackCorrect.${language}`,
            `feedbackIncorrect.${language}`
        ];

        const potentialMatches = [];

        console.log(`Searching for query "${query}" (normalized: "${normalizedQuery}", language: ${language}) using regex: ${wholeWordRegex}`);

        for (const id in mergedData) {
            const item = mergedData[id];
            if (!item) continue;

            let bestMatchForItem = null;

            for (const fieldPath of fieldsToSearch) {
                const pathParts = fieldPath.split('.');
                const fieldName = pathParts[0]; // e.g., 'questionText', 'options'
                // 'language' variable is already available in the outer scope

                // ***** SPECIAL HANDLING FOR 'options' FIELD *****
                if (fieldName === 'options') {
                    const optionsArray = item.options; // Access the top-level 'options' array directly

                    // Check if item.options exists and is an array
                    if (Array.isArray(optionsArray)) {
                        // console.log(`Item ID: ${id} - Field: ${fieldName} is Array. Checking options objects...`);
                        for (let i = 0; i < optionsArray.length; i++) {
                            const optionObject = optionsArray[i]; // This is { ar: "...", en: "..." }

                            // Check if it's a valid object and has the target language string
                            if (optionObject && typeof optionObject === 'object' && typeof optionObject[language] === 'string') {
                                const optionText = optionObject[language]; // Get the text for the current language

                                // console.log(`  Checking option[${i}].${language}: "${optionText}"`);
                                if (optionText.trim() !== '') {
                                    const normalizedOption = normalizeTextForSearch(optionText);
                                    // console.log(`    Normalized: "${normalizedOption}"`);
                                    const isMatch = wholeWordRegex ? wholeWordRegex.test(normalizedOption) : normalizedOption.includes(normalizedQuery);
                                    // console.log(`    Match found for "${normalizedQuery}"? -> ${isMatch}`);

                                    if (isMatch) {
                                        // console.log(`      ✅ Match found in option!`);
                                        const currentMatch = {
                                            id: id,
                                            field: fieldName, // Mark as found in 'options'
                                            // Store the specific language string that matched
                                            originalContentBlock: optionText,
                                            difficulty: typeof item.difficulty === 'number' ? item.difficulty : 99,
                                            query: query,
                                            // You could add index if needed: optionIndex: i
                                        };
                                        bestMatchForItem = prioritizeMatch(currentMatch, bestMatchForItem);
                                    }
                                }
                            } else {
                               // console.log(`  Option object [${i}] is invalid or missing language '${language}'.`);
                            }
                        } // End loop through option objects
                    } else {
                       // console.log(`Item ID: ${id} - Field: ${fieldName} exists but is not an Array.`);
                    }
                    // Crucially, skip the generic handling below for the 'options' field
                    continue; // Move to the next fieldPath in fieldsToSearch
                }

                // ***** GENERIC HANDLING for other fields (questionText, textContent, etc.) *****
                let content = item;
                try {
                    // This loop accesses item[fieldName][language] for standard fields
                    for (const part of pathParts) {
                         content = content?.[part]; // Safely access nested property
                    }
                    if (content === undefined) {
                        // console.log(`Field ${fieldPath} not found for item ${id}`);
                        continue; // Skip this field if it or the language sub-property doesn't exist
                    }
                } catch (e) {
                     console.error(`Error accessing field ${fieldPath} for item ${id}:`, e);
                     content = null;
                 }

                // Handle String Content (for non-'options' fields processed above)
                if (typeof content === 'string' && content.trim() !== '') {
                     // console.log(`Item ID: ${id} - Checking generic field: ${fieldPath} - Content: "${content.substring(0,50)}..."`);
                    const normalizedContent = normalizeTextForSearch(content);
                    const isMatch = wholeWordRegex ? wholeWordRegex.test(normalizedContent) : normalizedContent.includes(normalizedQuery);
                     // console.log(`    Normalized: "${normalizedContent}" | Match? -> ${isMatch}`);

                    if (isMatch) {
                        const currentMatch = {
                            id: id,
                            field: fieldName, // Store the base field name (e.g., 'questionText')
                            originalContentBlock: content, // Store the full string block
                            difficulty: typeof item.difficulty === 'number' ? item.difficulty : 99,
                            query: query
                        };
                        bestMatchForItem = prioritizeMatch(currentMatch, bestMatchForItem);
                    }
                }
                 // Optimization: If the best match is questionText, stop checking lower priority fields for this item
                 if (bestMatchForItem?.field === 'questionText') {
                     break; // Exit the inner loop (fieldsToSearch) for this item
                 }

            } // End loop through fields for one item

            if (bestMatchForItem) {
                potentialMatches.push(bestMatchForItem);
            }
        } // End loop through all items

        // --- Sorting logic remains the same ---
        const fieldPriority = {
            'questionText': 5,
            'textContent': 4,
            'supportContent': 3,
            'options': 2, // Priority for 'options' field remains
            'correctAnswer': 1,
            'feedbackCorrect': 0,
            'feedbackIncorrect': 0,
            'default': 0
        };

        potentialMatches.sort((a, b) => {
            const priorityA = fieldPriority[a.field] ?? fieldPriority.default;
            const priorityB = fieldPriority[b.field] ?? fieldPriority.default;
            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }
            return a.difficulty - b.difficulty; // Lower difficulty first if priorities are equal
        });

         if (potentialMatches.length === 0) {
              console.log(`No matches found for "${query}" in language "${language}". Check JSON data and structure.`);
         } else {
              console.log(`Found ${potentialMatches.length} potential matches. Top match field: ${potentialMatches[0].field}`);
         }


        return potentialMatches;
    }

    // --- prioritizeMatch function remains unchanged ---
     function prioritizeMatch(currentMatch, existingBestMatch) {
        if (!existingBestMatch) return currentMatch;
         const fieldPriority = {
            'questionText': 5, 'textContent': 4, 'supportContent': 3,
            'options': 2, 'correctAnswer': 1, 'feedbackCorrect': 0,
            'feedbackIncorrect': 0, 'default': 0
         };
        const priorityCurrent = fieldPriority[currentMatch.field] ?? fieldPriority.default;
        const priorityExisting = fieldPriority[existingBestMatch.field] ?? fieldPriority.default;
        if (priorityCurrent > priorityExisting) return currentMatch;
        if (priorityCurrent < priorityExisting) return existingBestMatch;
        if (currentMatch.difficulty < existingBestMatch.difficulty) return currentMatch;
        return existingBestMatch;
     }
    // ========================================================================
    // == 4. RESPONSE GENERATION & DISPLAY (No changes needed here)
    // ========================================================================
    function displayResults(matches, language) {
        if (!matches || matches.length === 0) {
            const noMatchMessages = {
                 en: "Sorry, I couldn't find an example for your query. Try another word.",
                 ar: "عذراً، لم أتمكن من العثور على مثال يطابق استفسارك. يرجى محاولة كلمة أو عبارة مختلفة."
            };
            addBotMessage(noMatchMessages[language]);
            return;
        }

        const topMatch = matches[0];
        const itemData = mergedData[topMatch.id];

        // Use the specific block (sentence/option/answer) that matched
        const targetText = extractSentenceWithMatch(topMatch.originalContentBlock, topMatch.query);
        const highlightedText = highlightMatch(targetText, topMatch.query);

        let responseHTML = highlightedText;
        const supportContent = itemData?.supportContent?.[language];

        if (supportContent && topMatch.field !== 'supportContent') {
            // Using <hr> might be too visually strong, consider a softer separator or just spacing
             // responseHTML += `<hr class="support-separator"><div class="support-info"><span class="support-tag">معلومة إضافية:</span> ${supportContent}</div>`;
            // Simpler approach:
             responseHTML += `<br><span class="support-info"><span class="support-tag">معلومة إضافية:</span> ${supportContent}</span>`;
        }

        addBotMessage(responseHTML); // Add the assembled response
    }


    // ========================================================================
    // == 5. CHAT UI & EVENT HANDLING (No changes needed here)
    // ========================================================================
  
    function addMessage(content, type, direction) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type === 'user' ? 'user-message' : 'bot-message');
        messageDiv.innerHTML = content;
        messageDiv.setAttribute('dir', direction); // Set direction attribute
        chatMessagesContainer.appendChild(messageDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // --- Update callers of addMessage ---

    function addUserMessage(message, direction) {
        // Basic sanitization for user messages
        const sanitizedMessage = message.replace(/</g, "<").replace(/>/g, ">");
        // Pass the detected direction
        addMessage(sanitizedMessage, 'user', direction);
    }

    function addBotMessage(message, direction) {
        // Bot messages contain HTML, pass the direction used for the response
        addMessage(message, 'bot', direction);
    }

    function handleSend() {
        const query = userInput.value.trim();
        if (!query || userInput.disabled) return;

        const detectedLang = detectLanguage(query);
        const messageDirection = detectedLang === 'ar' ? 'rtl' : 'ltr';
        console.log("Detected language:", detectedLang, "Direction:", messageDirection);
        currentLanguage = detectedLang; // Update global state

        addUserMessage(query, messageDirection); // Pass direction to user message
        userInput.value = '';

        showTypingIndicator(true, currentLanguage === 'ar' ? 'جاري البحث...' : 'Searching...');
        disableInput(true);

        // Optional: Update input placeholder based on detected language?
        // userInput.placeholder = currentLanguage === 'ar' ? "اكتب سؤالك هنا..." : "Type your question here...";

        setTimeout(() => {
            try {
                const results = searchContent(query, currentLanguage);
                // Pass the *currentLanguage*'s direction to displayResults -> addBotMessage
                displayResults(results, currentLanguage);
            } catch (error) {
                console.error("Error during search or display:", error);
                // Use current language for error message direction
                addBotMessage(
                    currentLanguage === 'ar' ? "عذرًا، حدث خطأ أثناء معالجة طلبك." : "Sorry, an error occurred while processing your request.",
                    messageDirection
                );
            } finally {
                showTypingIndicator(false);
                disableInput(false);
                userInput.focus();
            }
        }, 100);
    }

    // Modify displayResults to pass direction to addBotMessage
    function displayResults(matches, language) {
        const messageDirection = language === 'ar' ? 'rtl' : 'ltr'; // Determine direction

        if (!matches || matches.length === 0) {
            const noMatchMessages = {
                 en: "Sorry, I couldn't find an example for your query. Try another word.",
                 ar: "عذراً، لم أتمكن من العثور على مثال يطابق استفسارك. يرجى محاولة كلمة أو عبارة مختلفة."
            };
             // Pass direction to bot message
            addBotMessage(noMatchMessages[language], messageDirection);
            return;
        }

        const topMatch = matches[0];
        const itemData = mergedData[topMatch.id];

        const targetText = extractSentenceWithMatch(topMatch.originalContentBlock, topMatch.query);
        const highlightedText = highlightMatch(targetText, topMatch.query);

        let responseHTML = highlightedText;
        const supportContent = itemData?.supportContent?.[language];

        if (supportContent && topMatch.field !== 'supportContent') {
            const supportTag = language === 'ar' ? 'معلومة إضافية:' : 'Additional Info:';
            responseHTML += `<br><span class="support-info"><span class="support-tag">${supportTag}</span> ${supportContent}</span>`;
        }

         // Pass direction to bot message
        addBotMessage(responseHTML, messageDirection);
    }

    // --- Event Listeners remain the same ---
    sendButton.addEventListener('click', handleSend);
  userInput.addEventListener('keydown', (event) => { // Use 'keydown' instead of 'keypress'
    // Check if the key pressed is Enter and Shift is not held down
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Important: Prevent default action (like adding a newline or submitting a form if applicable)
        handleSend(); // Call your existing send function
    }
});

    // --- Initialization remains the same ---
    // showTypingIndicator(false);
    // loadAndMergeData(); // Called within DOMContentLoaded

    // Call initial load
     loadAndMergeData();});