// ../js/subscripts/handwrite.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Handwriting DOM Ready. Initializing script...");

    // Get elements based on your HTML
    const canvas = document.getElementById('handwriting-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const questionTextEl = document.getElementById('question-text');
    const resultEl = document.getElementById('handwriting-result'); // Still useful for error messages
    const clearBtn = document.getElementById('clear-canvas');
    const nextBtn = document.getElementById('next-question');

    // --- Essential Element Check ---
    // Note: We removed the check for checkBtn
    if (!canvas || !ctx || !questionTextEl || !resultEl || !clearBtn || !nextBtn) {
        console.error("Handwriting Init Error: One or more required HTML elements are missing. Check IDs (canvas, question-text, handwriting-result, clear-canvas, next-question).");
        if(questionTextEl) questionTextEl.textContent = '❌ خطأ فادح: لم يتم العثور على عناصر التحكم في الصفحة.';
        return; // Stop execution
    }
    console.log("Handwriting Elements Found.");

    // --- State Variables ---
    let isDrawing = false;
    let questions = [];
    let currentIndex = 0;
    // let currentCorrectAnswerProcessed = ''; // No longer needed for comparison

    // --- Drawing Configuration ---
    const drawingConfig = {
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'round',
        strokeStyle: '#333'
    };

    // --- Apply Drawing Styles ---
    function applyDrawingStyles() {
        ctx.lineWidth = drawingConfig.lineWidth;
        ctx.lineCap = drawingConfig.lineCap;
        ctx.lineJoin = drawingConfig.lineJoin;
        ctx.strokeStyle = drawingConfig.strokeStyle;
    }

    // --- Resize Canvas ---
    function resizeCanvas() {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            applyDrawingStyles();
            console.log(`Handwriting Canvas resized to: ${canvas.width}x${canvas.height}`);
        }
    }

    // --- Initialize Drawing Event Listeners ---
    function initializeDrawingEvents() {
        function getPointerPosition(event) {
            const rect = canvas.getBoundingClientRect();
            const touch = event.changedTouches ? event.changedTouches[0] : event;
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            return { x, y };
        }

        const startDrawing = (event) => {
            event.preventDefault();
            isDrawing = true;
            const { x, y } = getPointerPosition(event);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (event) => {
            if (!isDrawing) return;
            event.preventDefault();
            const { x, y } = getPointerPosition(event);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            if (isDrawing) {
                isDrawing = false;
                ctx.beginPath();
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        canvas.style.touchAction = 'none';
        console.log("Handwriting Drawing events initialized.");
    }

    // --- Load Questions ---
    function loadQuestions() {
        // *** IMPORTANT: Verify this path is correct relative to the HTML file linking this script ***
        // If handwrite.html is in the root, use './data/...'
        // If handwrite.html is in /html/, use '../data/...'
        const jsonPath = '../data/subdata/handwrite.json'; // Using your original path assumption
        console.log(`Handwriting: Attempting to fetch questions from: ${jsonPath}`);

        fetch(jsonPath)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status} fetching ${jsonPath}`);
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn("Handwriting Warning: Loaded data is not a valid non-empty array.", data);
                    throw new Error('البيانات المحملة غير صالحة أو فارغة.');
                }
                questions = data;
                currentIndex = 0;
                console.log(`Handwriting: Successfully loaded ${questions.length} questions.`);
                displayQuestion();
            })
            .catch(error => {
                console.error("Handwriting Error loading questions:", error);
                questionTextEl.textContent = `❌ خطأ في تحميل الأسئلة: ${error.message}`;
                nextBtn.disabled = true;
                clearBtn.disabled = true;
            });
    }

    // --- Display Current Question ---
    function displayQuestion() {
        if (questions.length === 0) {
            console.log("Handwriting: No questions available to display.");
            questionTextEl.textContent = 'لا توجد أسئلة متاحة حالياً.';
            nextBtn.disabled = true;
            clearBtn.disabled = true;
            return;
        }

        currentIndex = currentIndex % questions.length; // Loop through questions
        const currentQuestion = questions[currentIndex];

        if (!currentQuestion || !currentQuestion.question) { // Removed check for correctAnswer
            console.error(`Handwriting Error: Invalid question data at index ${currentIndex}:`, currentQuestion);
            questionTextEl.textContent = '❌ خطأ في بيانات السؤال الحالي.';
             nextBtn.disabled = true;
             clearBtn.disabled = false; // Allow clearing
            return;
        }

        questionTextEl.textContent = currentQuestion.question;
        // currentCorrectAnswerProcessed = ''; // No longer needed

        console.log(`Handwriting: Displaying Q${currentIndex + 1}: "${currentQuestion.question}"`);

        clearCanvas(); // Clear canvas and any previous messages

        // Enable buttons
        clearBtn.disabled = false;
        nextBtn.disabled = false; // Always enable Next (loops)
    }

    // --- Clear Canvas ---
    function clearCanvas() {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        resultEl.textContent = ''; // Clear any messages
        resultEl.classList.remove('error'); // Remove styling
        console.log("Handwriting Canvas cleared.");
    }

    // --- Advance to Next Question ---
    function advanceToNextQuestion() {
        if (questions.length > 0) {
            currentIndex++; // Increment index
            displayQuestion(); // Display the new question (handles looping/clearing/enabling buttons)
        } else {
            console.log("Handwriting: Cannot advance, no questions loaded.");
        }
    }

    // --- Initial Setup ---
    resizeCanvas();
    applyDrawingStyles();
    initializeDrawingEvents();
    loadQuestions();

    // --- Assign Button Actions ---
    // NO checkBtn listener needed
    clearBtn.addEventListener('click', clearCanvas);
    nextBtn.addEventListener('click', advanceToNextQuestion);

    // --- Handle Window Resizing ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 150);
    });

    console.log("Handwriting script fully initialized and listeners attached.");

}); // End DOMContentLoaded