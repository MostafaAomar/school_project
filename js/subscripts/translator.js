document.addEventListener('DOMContentLoaded', () => {

    const wordInput = document.getElementById('wordInput');
    const dictionaryOutput = document.getElementById('dictionaryOutput');

    // *** IMPORTANT: Adjust this path to your dictionary.json file ***
    // Examples based on HTML file location:
    // - If HTML is root, json is root: './dictionary.json'
    // - If HTML is /high_school/, json is root: '../dictionary.json'
    // - If HTML is /high_school/quizes/, json is root: '../../dictionary.json'
    const localDictionaryPath = 'https://raw.githubusercontent.com/MostafaAomar/school_project/refs/heads/main/data/subdata/myOwnDic.json'; // ADJUST AS NEEDED

    const apiEndpoint = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let dictionaryData = []; // To store the loaded local dictionary
    let isDictionaryLoaded = false;
    let isLoadingDictionary = false;

    // --- 1. Load Local Dictionary ---
    async function loadLocalDictionary() {
        if (isDictionaryLoaded || isLoadingDictionary) {
            return; // Already loaded or currently loading
        }
        isLoadingDictionary = true;
        console.log(`Attempting to load local dictionary from: ${localDictionaryPath}`); // Debugging

        try {
            const response = await fetch(localDictionaryPath);
            if (!response.ok) {
                console.error(`HTTP error loading local dictionary! Status: ${response.status}, URL: ${response.url}`);
                throw new Error(`Failed to load local dictionary.json (status: ${response.status})`);
            }
            dictionaryData = await response.json();
            // Basic validation: Check if it's an array
            if (!Array.isArray(dictionaryData)) {
                 console.error("Local dictionary.json is not a valid JSON array.");
                 throw new Error("Invalid local dictionary format.");
            }
            isDictionaryLoaded = true;
            console.log(`Local dictionary loaded successfully with ${dictionaryData.length} entries.`);
            // Trigger search if input has value after successful load
             if (wordInput && wordInput.value.trim()) {
                handleWordSearch();
            }
        } catch (error) {
            console.error('Error loading or parsing local dictionary.json:', error);
            // Display error to user only if the output element exists
             if (dictionaryOutput) {
                 dictionaryOutput.innerHTML = `<p class="text-danger">خطأ في تحميل القاموس المحلي. قد لا تعمل عمليات البحث المحلية.</p>`;
             }
             // Allow API fallback even if local fails, so don't set isDictionaryLoaded = false here
        } finally {
            isLoadingDictionary = false;
        }
    }

    // --- 2. Search Functions ---

    // Searches the *loaded* local dictionary data
    function searchLocalDictionary(word) {
        if (!isDictionaryLoaded || dictionaryData.length === 0) {
            return undefined; // Not loaded or empty
        }
        const searchTerm = word.trim().toLowerCase();
        // Find the word (case-insensitive)
        return dictionaryData.find(entry => entry.word.toLowerCase() === searchTerm);
    }

    // Searches the public API
    async function searchApiDictionary(word) {
        const searchTerm = word.trim();
        if (!searchTerm) return null;

        console.log(`Searching API for: ${searchTerm}`); // Debugging
        dictionaryOutput.innerHTML = '<p class="text-muted">لم يتم العثور عليه محليًا، جار البحث عبر الإنترنت...</p>';

        try {
            const response = await fetch(`${apiEndpoint}${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`API returned 404 (Not Found) for "${searchTerm}"`);
                    return null; // Explicitly return null for "not found"
                } else {
                     // Log other HTTP errors
                     console.error(`API HTTP error! Status: ${response.status}, URL: ${response.url}`);
                     throw new Error(`API error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log(`API Result for "${searchTerm}":`, data); // Debugging
            // API returns an array, usually we want the first element
            return (data && data.length > 0) ? data[0] : null;

        } catch (error) {
            console.error('Error fetching definition from API:', error);
             if (dictionaryOutput) {
                  dictionaryOutput.innerHTML = `<p class="text-danger">حدث خطأ أثناء البحث عبر الإنترنت.</p>`;
             }
            return null; // Indicate error during API lookup
        }
    }


    // --- 3. Display Function ---
    // This function should work for both local JSON and API results
    // as their structure is similar based on your example.
     function displayDefinition(entryData, searchTerm) {
         if (!dictionaryOutput) return; // Make sure output area exists

         if (!entryData) {
            dictionaryOutput.innerHTML = `<p class="text-warning">لم يتم العثور على تعريف للكلمة "${escapeHTML(searchTerm)}".</p>`;
            return;
        }

        // Extract data - use optional chaining ?. for safety
        const word = entryData.word;
        const phoneticText = entryData.phonetics?.find(p => p.text)?.text;
        const audioUrl = entryData.phonetics?.find(p => p.audio)?.audio;

        let html = `<h4 class="mb-2">${escapeHTML(word)} ${phoneticText ? `<span class="text-muted fs-6">${escapeHTML(phoneticText)}</span>` : ''}</h4>`;

        if (audioUrl) {
            html += `
                <div class="audio mb-3">
                    <audio controls src="${escapeHTML(audioUrl)}">
                        متصفحك لا يدعم عنصر الصوت.
                    </audio>
                </div>
            `;
        } else {
             // Look for audio in different phonetic entries if the first didn't have it
             const alternateAudio = entryData.phonetics?.find(p => p.audio)?.audio;
              if (alternateAudio) {
                 html += `
                 <div class="audio mb-3">
                     <audio controls src="${escapeHTML(alternateAudio)}">
                         متصفحك لا يدعم عنصر الصوت.
                     </audio>
                 </div>
             `;
              }
        }


        // Loop through meanings (part of speech, definitions, examples, synonyms)
        if (entryData.meanings && Array.isArray(entryData.meanings)) {
            entryData.meanings.forEach(meaning => {
                html += `<div class="definition mb-3 border-bottom pb-2">`;
                html += `<h5><em>${escapeHTML(meaning.partOfSpeech)}</em></h5>`;

                if (meaning.definitions && Array.isArray(meaning.definitions)) {
                    meaning.definitions.forEach((def, index) => {
                        html += `<p class="mb-1"><strong>${index + 1}.</strong> ${escapeHTML(def.definition)}</p>`;
                        if (def.example) {
                            html += `<p class="ms-3 text-muted fst-italic">"${escapeHTML(def.example)}"</p>`;
                        }
                        if (def.synonyms && def.synonyms.length > 0) {
                            html += `<p class="ms-3 small"><strong>مرادفات:</strong> ${escapeHTML(def.synonyms.join(', '))}</p>`;
                        }
                        if (def.antonyms && def.antonyms.length > 0) {
                            html += `<p class="ms-3 small"><strong>أضداد:</strong> ${escapeHTML(def.antonyms.join(', '))}</p>`;
                        }
                    });
                }
                html += `</div>`;
            });
        } else {
             html += `<p class="text-muted">لا توجد معاني مفصلة متوفرة.</p>`;
        }


        dictionaryOutput.innerHTML = html;
    }

    // --- 4. Event Handling & Orchestration ---
    async function handleWordSearch() {
        if (!wordInput || !dictionaryOutput) return; // Ensure elements exist

        const word = wordInput.value.trim();

        if (word.length < 1) { // Allow single character search if desired, or increase limit
            dictionaryOutput.innerHTML = '<p class="text-muted">أدخل كلمة للبحث.</p>';
            return;
        }

        // Ensure local dictionary is loaded or loading initiated
        if (!isDictionaryLoaded && !isLoadingDictionary) {
             dictionaryOutput.innerHTML = '<p class="text-muted">جارٍ تحميل القاموس المحلي أولاً...</p>';
            await loadLocalDictionary(); // Wait for loading attempt
             // If loading failed, isDictionaryLoaded is still false, allowing API fallback
        }
         else if (isLoadingDictionary) {
             dictionaryOutput.innerHTML = '<p class="text-muted">القاموس المحلي قيد التحميل، يرجى الانتظار...</p>';
             return; // Don't search yet
         }


        // Step 1: Try searching locally
        const localResult = searchLocalDictionary(word);

        if (localResult) {
            console.log(`Found "${word}" in local dictionary.`); // Debugging
            displayDefinition(localResult, word);
        } else {
            // Step 2: If not found locally, try the API
            console.log(`"${word}" not found locally, trying API.`); // Debugging
            const apiResult = await searchApiDictionary(word); // Already shows "searching online" message

             // apiResult will be the first entry object, or null if not found/error
            displayDefinition(apiResult, word); // Display API result or "not found" message
        }
    }

    // --- 5. Initialization ---
    if (wordInput && dictionaryOutput) {
        // Start loading the local dictionary immediately when the page loads
        loadLocalDictionary();

        // Add debounced event listener to the input
        wordInput.addEventListener('input', debounce(handleWordSearch, 350)); // Slightly increased debounce

    } else {
        console.warn("Dictionary input or output element not found on this page.");
    }

    // --- Helper Functions ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

}); // End DOMContentLoaded