        const canvas = document.getElementById('handwriting-canvas');
        const ctx = canvas.getContext('2d');
        const questionText = document.getElementById('question-text');
        const resultEl = document.getElementById('handwriting-result');
        const checkBtn = document.getElementById('check-handwriting');
        const clearBtn = document.getElementById('clear-canvas');
        const nextBtn = document.getElementById('next-question');

        let isDrawing = false;
        let questions = [];
        let currentIndex = 0;
        let correctAnswer = '';

        // Resize canvas to fit
        function resizeCanvas() {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        // Drawing
        function initDrawing() {
            canvas.addEventListener('pointerdown', e => {
                isDrawing = true;
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
            });
            canvas.addEventListener('pointermove', e => {
                if (!isDrawing) return;
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            });
            ['pointerup', 'pointerleave'].forEach(evt => {
                canvas.addEventListener(evt, () => isDrawing = false);
            });
        }

        // Load questions
        function loadQuestions() {
            fetch('../data/subdata/handwrite.json')
                .then(res => res.json())
                .then(data => {
                    questions = data;
                    showQuestion();
                })
                .catch(() => {
                    questionText.textContent = '❌ لم يتم تحميل الأسئلة.';
                });
        }

        // Display current question
        function showQuestion() {
            const q = questions[currentIndex];
            questionText.textContent = q.question;
            correctAnswer = q.correctAnswer.trim().replace(/\s+/g, '').toLowerCase();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resultEl.textContent = '';
            resultEl.classList.remove('error');
        }

        // Check answer
        function checkAnswer() {
            Tesseract.recognize(canvas, 'eng+ara',
                 { logger: m => console.log(m) }
            )
                .then(({ data: { text } }) => {
                    const rec = text.trim().replace(/\s+/g, '').toLowerCase();
                    if (rec === correctAnswer) {
                        resultEl.textContent = '✅ إجابة صحيحة!';
                        resultEl.classList.remove('error');
                    } else {
                        resultEl.textContent = `❌ خاطئة: النظام قرأ "${rec}"`;
                        resultEl.classList.add('error');
                    }
                })
                .catch(() => {
                    resultEl.textContent = '⚠️ خطأ في التعرف';
                    resultEl.classList.add('error');
                });
        }

        // Next question
        function nextQuestion() {
            currentIndex = (currentIndex + 1) % questions.length;
            showQuestion();
        }

        // Clear canvas
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resultEl.textContent = '';
            resultEl.classList.remove('error');
        }

        window.addEventListener('load', () => {
            resizeCanvas();
            initDrawing();
            loadQuestions();
           // checkBtn.onclick = checkAnswer;
            clearBtn.onclick = clearCanvas;
            nextBtn.onclick = nextQuestion;
        });
        window.addEventListener('resize', resizeCanvas);