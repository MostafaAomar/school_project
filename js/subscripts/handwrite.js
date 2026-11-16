// Writing canvas: custom pen colors, high-DPI drawing, and responsive fullscreen mode.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('handwriting-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const questionTextEl = document.getElementById('question-text');
    const resultEl = document.getElementById('handwriting-result');
    const clearBtn = document.getElementById('clear-canvas');
    const nextBtn = document.getElementById('next-question');
    const colorPicker = document.getElementById('pen-color-picker');
    const colorSwatches = Array.from(document.querySelectorAll('.pen-color-swatch'));
    const expandBtn = document.getElementById('expand-canvas');
    const exitFullscreenBtn = document.getElementById('exit-canvas-fullscreen');
    const handwritingContainer = document.querySelector('.handwriting-container');

    if (!canvas || !ctx || !questionTextEl || !resultEl || !clearBtn || !nextBtn ||
        !colorPicker || !expandBtn || !exitFullscreenBtn || !handwritingContainer) {
        console.error('Handwriting initialization failed: required page elements are missing.');
        if (questionTextEl) questionTextEl.textContent = 'تعذر تشغيل مساحة الكتابة بسبب نقص بعض العناصر.';
        return;
    }

    let isDrawing = false;
    let activePointerId = null;
    let questions = [];
    let currentIndex = 0;
    let resizeObserver = null;
    let resizeTimeout = null;

    const drawingConfig = {
        lineWidth: 3.5,
        lineCap: 'round',
        lineJoin: 'round',
        strokeStyle: '#2563eb'
    };

    try {
        const savedColor = localStorage.getItem('handwriting-pen-color');
        if (savedColor && /^#[0-9a-f]{6}$/i.test(savedColor)) {
            colorPicker.value = savedColor;
        }
    } catch (error) {
        // Private browsing or storage restrictions should not block writing.
    }
    drawingConfig.strokeStyle = colorPicker.value || '#2563eb';

    function applyDrawingStyles() {
        ctx.lineWidth = drawingConfig.lineWidth;
        ctx.lineCap = drawingConfig.lineCap;
        ctx.lineJoin = drawingConfig.lineJoin;
        ctx.strokeStyle = drawingConfig.strokeStyle;
    }

    // Keep the current strokes when the canvas changes size or enters/exits fullscreen.
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const cssWidth = Math.round(rect.width);
        const cssHeight = Math.round(rect.height);
        if (!cssWidth || !cssHeight) return;

        const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
        const targetWidth = Math.round(cssWidth * dpr);
        const targetHeight = Math.round(cssHeight * dpr);
        if (canvas.width === targetWidth && canvas.height === targetHeight) return;

        const oldCssWidth = Number(canvas.dataset.cssWidth) || cssWidth;
        const oldCssHeight = Number(canvas.dataset.cssHeight) || cssHeight;
        let previousDrawing = null;

        if (canvas.width > 0 && canvas.height > 0 && canvas.dataset.initialized === 'true') {
            previousDrawing = document.createElement('canvas');
            previousDrawing.width = canvas.width;
            previousDrawing.height = canvas.height;
            const previousContext = previousDrawing.getContext('2d');
            if (previousContext) previousContext.drawImage(canvas, 0, 0);
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (previousDrawing) {
            ctx.drawImage(
                previousDrawing,
                0, 0, previousDrawing.width, previousDrawing.height,
                0, 0, oldCssWidth, oldCssHeight
            );
        }

        canvas.dataset.cssWidth = String(cssWidth);
        canvas.dataset.cssHeight = String(cssHeight);
        canvas.dataset.initialized = 'true';
        applyDrawingStyles();
    }

    function getPointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        isDrawing = true;
        activePointerId = event.pointerId;
        if (typeof canvas.setPointerCapture === 'function') {
            try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* no-op */ }
        }
        const point = getPointerPosition(event);
        applyDrawingStyles();
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + 0.01, point.y + 0.01);
        ctx.stroke();
    }

    function draw(event) {
        if (!isDrawing || (activePointerId !== null && event.pointerId !== activePointerId)) return;
        event.preventDefault();
        const point = getPointerPosition(event);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }

    function stopDrawing(event) {
        if (!isDrawing || (event && activePointerId !== null && event.pointerId !== activePointerId)) return;
        isDrawing = false;
        if (event && typeof canvas.releasePointerCapture === 'function') {
            try {
                if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
            } catch (error) { /* no-op */ }
        }
        activePointerId = null;
        ctx.beginPath();
    }

    function updateSelectedSwatch() {
        colorSwatches.forEach((swatch) => {
            const selected = swatch.dataset.color?.toLowerCase() === drawingConfig.strokeStyle.toLowerCase();
            swatch.classList.toggle('is-selected', selected);
            swatch.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
    }

    function setPenColor(color) {
        if (!/^#[0-9a-f]{6}$/i.test(color)) return;
        drawingConfig.strokeStyle = color;
        colorPicker.value = color;
        applyDrawingStyles();
        updateSelectedSwatch();
        try { localStorage.setItem('handwriting-pen-color', color); } catch (error) { /* no-op */ }
    }

    function updateFullscreenControls(isFullscreen) {
        expandBtn.hidden = isFullscreen;
        exitFullscreenBtn.hidden = !isFullscreen;
        expandBtn.setAttribute('aria-pressed', isFullscreen ? 'true' : 'false');
        handwritingContainer.classList.toggle('is-fullscreen', isFullscreen);
        document.body.classList.toggle('handwriting-focus-mode', isFullscreen);
        if (isFullscreen) {
            exitFullscreenBtn.focus({ preventScroll: true });
        }
        requestAnimationFrame(resizeCanvas);
        window.setTimeout(resizeCanvas, 80);
    }

    async function enterFullscreenMode() {
        updateFullscreenControls(true);
        // Use native fullscreen where supported; the CSS full-viewport mode remains
        // the fallback on iOS and browsers that do not expose the Fullscreen API.
        if (typeof handwritingContainer.requestFullscreen === 'function' && !document.fullscreenElement) {
            try {
                await handwritingContainer.requestFullscreen();
            } catch (error) {
                console.info('Native fullscreen is unavailable; using the page fullscreen layout.');
            }
        }
        resizeCanvas();
    }

    async function exitFullscreenMode() {
        if (document.fullscreenElement === handwritingContainer && typeof document.exitFullscreen === 'function') {
            try { await document.exitFullscreen(); } catch (error) { /* CSS mode is still removed below. */ }
        }
        updateFullscreenControls(false);
        expandBtn.focus({ preventScroll: true });
    }

    function clearCanvas() {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        resultEl.textContent = '';
        resultEl.classList.remove('error');
    }

    async function loadQuestions() {
        const paths = [
            '../data/subdata/handwrite.json',
            './school_project/data/subdata/handwrite.json',
            './data/subdata/handwrite.json'
        ];

        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (!response.ok) continue;
                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) continue;
                questions = data;
                currentIndex = 0;
                displayQuestion();
                return;
            } catch (error) {
                // Try the next local path.
            }
        }

        questionTextEl.textContent = 'تعذر تحميل أسئلة الكتابة اليدوية.';
        nextBtn.disabled = true;
        clearBtn.disabled = true;
    }

    function displayQuestion() {
        if (!questions.length) {
            questionTextEl.textContent = 'لا توجد أسئلة متاحة حالياً.';
            nextBtn.disabled = true;
            clearBtn.disabled = true;
            return;
        }
        currentIndex %= questions.length;
        const question = questions[currentIndex];
        if (!question || !question.question) {
            questionTextEl.textContent = 'خطأ في بيانات السؤال الحالي.';
            nextBtn.disabled = true;
            return;
        }
        questionTextEl.textContent = question.question;
        clearCanvas();
        clearBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function advanceToNextQuestion() {
        if (!questions.length) return;
        currentIndex += 1;
        displayQuestion();
    }

    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('lostpointercapture', stopDrawing);
    canvas.style.touchAction = 'none';

    colorPicker.addEventListener('input', () => setPenColor(colorPicker.value));
    colorPicker.addEventListener('change', () => setPenColor(colorPicker.value));
    colorSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => setPenColor(swatch.dataset.color));
    });

    clearBtn.addEventListener('click', clearCanvas);
    nextBtn.addEventListener('click', advanceToNextQuestion);
    expandBtn.addEventListener('click', enterFullscreenMode);
    exitFullscreenBtn.addEventListener('click', exitFullscreenMode);

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && handwritingContainer.classList.contains('is-fullscreen')) {
            updateFullscreenControls(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && handwritingContainer.classList.contains('is-fullscreen')) {
            // The browser exits native fullscreen itself; also close the CSS fallback.
            if (!document.fullscreenElement) updateFullscreenControls(false);
        }
    });

    resizeCanvas();
    updateSelectedSwatch();
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => resizeCanvas());
        resizeObserver.observe(canvas);
    }
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(resizeCanvas, 100);
    }, { passive: true });
    window.addEventListener('orientationchange', () => window.setTimeout(resizeCanvas, 160), { passive: true });

    loadQuestions();
});
