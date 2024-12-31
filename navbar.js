async function search() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (!searchTerm) {
        resultsDiv.style.display = "none";
        return;
    }

    // Arabic Normalization Function
    const normalizeArabic = (text) => {
        return text
            .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
            .replace(/أ|إ|آ/g, 'ا') // Normalize Alif variants
            .replace(/ة/g, 'ه') // Normalize Ta Marbuta
            .replace(/ى/g, 'ي'); // Normalize Alef Maqsura
    };

    const pages = [
        { name: 'high_school Page', url: 'https://mostafaaomar.github.io/school_project/high_school/high_school.html' },
        { name: 'index Page', url: 'https://mostafaaomar.github.io/school_project/index.html' },
        { name: 'quiz1 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz1.html' },
        { name: 'quiz2 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz2.html' },
        { name: 'quiz3 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz3.html' },
        { name: 'quiz4 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz4.html' },
        { name: 'quiz5 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz5.html' },
        { name: 'quiz6 Page', url: 'https://mostafaaomar.github.io/school_project/high_school/quizes/quiz6.html' }
    ];


    let hasResults = false;

    for (const page of pages) {
        try {
            const response = await fetch(page.url);
            if (!response.ok) throw new Error(`Failed to fetch ${page.url}`);
            
            console.log(`Fetched: ${page.url}`);
            
            let text = await response.text();
            text = text.replace(/<script[\s\S]*?<\/script>/gi, ""); // Remove scripts

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const navbar = doc.querySelector('nav');
            if (navbar) navbar.remove();

            const content = doc.body.textContent || "";
            const normalizedContent = normalizeArabic(content.toLowerCase());
            const normalizedSearchTerm = normalizeArabic(searchTerm);

            const sentences = normalizedContent.split(/[.!?]/);

            sentences.forEach(sentence => {
                if (sentence.includes(normalizedSearchTerm)) {
                    const resultItem = document.createElement("div");
                    resultItem.className = "result-item";
                    resultItem.textContent = sentence.trim();
                    resultItem.addEventListener("click", () => {
                        window.location.href = `${page.url}#highlight=${encodeURIComponent(searchTerm)}`;
                    });
                    resultsDiv.appendChild(resultItem);
                    hasResults = true;
                }
            });
        } catch (error) {
            console.error(`Error fetching ${page.url}:`, error);
        }
    }

    if (!hasResults) {
        resultsDiv.textContent = `"${searchTerm}" not found.`;
    }

    resultsDiv.style.display = hasResults ? "block" : "none";
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', search);

document.addEventListener('click', (event) => {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    if (!searchInput.contains(event.target) && !resultsDiv.contains(event.target)) {
        resultsDiv.style.display = "none";
    }
});

document.getElementById('searchInput').addEventListener('focus', () => {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML) {
        resultsDiv.style.display = "block";
    }
});

    








//##############################################################################################
// async function search() {
//     const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = "";

//     if (!searchTerm) {
//         resultsDiv.style.display = "none";
//         return;
//     }

//     const pages = [
//         { name: 'high_school Page', url: './high_school/high_school.html' },
//         { name: 'index Page', url: './index.html' },
//         { name: 'unit-1 Page', url: './high_school/quizes/quiz1.html' },
//         { name: 'unit-2 Page', url: './high_school/quizes/quiz2.html' },
//         { name: 'unit-3 Page', url: './high_school/quizes/quiz3.html' },
//         { name: 'unit-4 Page', url: './high_school/quizes/quiz4.html' },
//         { name: 'unit-4 Page', url: './high_school/quizes/quiz5.html' },
//         { name: 'unit-4 Page', url: './high_school/quizes/quiz6.html' }
//     ];

//     let hasResults = false;

//     for (const page of pages) {
//         try {
//             const response = await fetch(page.url);
//             if (!response.ok) throw new Error(`Failed to fetch ${page.url}`);
//             let text = await response.text();
//             text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

//             const parser = new DOMParser();
//             const doc = parser.parseFromString(text, 'text/html');
//             const navbar = doc.querySelector('nav');
//             if (navbar) navbar.remove();

//             const content = doc.body.textContent || "";
//             const sentences = content.split(/[.!?]/);

//             sentences.forEach(sentence => {
//                 if (sentence.toLowerCase().includes(searchTerm)) {
//                     const resultItem = document.createElement("div");
//                     resultItem.className = "result-item";
//                     resultItem.textContent = sentence.trim();
//                     resultItem.addEventListener("click", () => {
//                         window.location.href = `${page.url}#highlight=${encodeURIComponent(searchTerm)}`;
//                     });
//                     resultsDiv.appendChild(resultItem);
//                     hasResults = true;
//                 }
//             });
//         } catch (error) {
//             console.error(`Error fetching ${page.url}:`, error);
//         }
//     }

//     if (!hasResults) {
//         resultsDiv.textContent = `"${searchTerm}" not found.`;
//     }

//     resultsDiv.style.display = hasResults ? "block" : "none";
// }

// document.getElementById('searchInput').addEventListener('input', search);
// document.addEventListener('click', (event) => {
//     const searchInput = document.getElementById('searchInput');
//     const resultsDiv = document.getElementById('results');
//     if (!searchInput.contains(event.target) && !resultsDiv.contains(event.target)) {
//         resultsDiv.style.display = "none";
//     }
// });
// document.getElementById('searchInput').addEventListener('focus', () => {
//     const resultsDiv = document.getElementById('results');
//     if (resultsDiv.innerHTML) {
//         resultsDiv.style.display = "block";
//     }
// });
