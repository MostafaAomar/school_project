var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "14. The law related to computer crime ----changing",
    o : [
      "is",
      " are",
      "be"

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "15. very quickly. --- recent years, computer crime",
    o : [
    " (on)-(at)-(above)",
      "(in)-(over)-(during)-(through)",
      "(a)-(an)-(the)"

    ],
    a : 1
  },
  {
    q : "16. has increased ---- the number of people using the internet has grown.",
    o : [

      "(because)-(since)-(as)-(and)",
      "(a)-(an)-(but)-(then)",
      "(do)-(that)-(which)"

    ],
    a : 0
  },
  {
    q : "17. Marie's mother died when her ----- daughter was ",
    o : [
      "lessons",
      "successful",
      "youngst"

    ],
    a : 2
  },
  {
    q : "18. only ten. From then on, Marie----- that she",
    o : [
    "knew",
    "successful",
    "youngst"

    ],
    a :0
  },
  {
    q : "19. would have to work hard at her---- if she",
    o : [
    "lessons",
    "successful",
    "knew"

    ],
    a :0
  },
  {
    q : "20. wanted to be ----- in her life.",
    o : [
    "lessons",
    "successful",
    "youngst"
    ],
    a :1
  }
  ],

  // (A2) HTML ELEMENTS
  hWrap: null, // HTML quiz container
  hQn: null, // HTML question wrapper
  hAns: null, // HTML answers wrapper

  // (A3) GAME FLAGS
  now: 0, // current question
  score: 0, // current score

  // (B) INIT QUIZ HTML
  init: function(){
    // (B1) WRAPPER
    quiz.hWrap = document.getElementById("quizWrap");

    // (B2) QUESTIONS SECTION
    quiz.hQn = document.createElement("div");
    quiz.hQn.id = "quizQn";
    quiz.hWrap.appendChild(quiz.hQn);

    // (B3) ANSWERS SECTION
    quiz.hAns = document.createElement("div");
    quiz.hAns.id = "quizAns";
    quiz.hWrap.appendChild(quiz.hAns);

    // (B4) GO!
    quiz.draw();
  },

  // (C) DRAW QUESTION
  draw: function(){
    // (C1) QUESTION
    quiz.hQn.innerHTML = quiz.data[quiz.now].q;

    // (C2) OPTIONS
    quiz.hAns.innerHTML = "";
    for (let i in quiz.data[quiz.now].o) {
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quiz";
      radio.id = "quizo" + i;
      quiz.hAns.appendChild(radio);
      let label = document.createElement("label");
      label.innerHTML = quiz.data[quiz.now].o[i];
      label.setAttribute("for", "quizo" + i);
      label.dataset.idx = i;
      label.addEventListener("click", quiz.select);
      quiz.hAns.appendChild(label);
    }
  },

  // (D) OPTION SELECTED
  select: function(){
    // (D1) DETACH ALL ONCLICK
    let all = quiz.hAns.getElementsByTagName("label");
    for (let label of all) {
      label.removeEventListener("click", quiz.select);
    }

    // (D2) CHECK IF CORRECT
    let correct = this.dataset.idx == quiz.data[quiz.now].a;
    if (correct) {
      quiz.score++;
      this.classList.add("correct");
    } else {
      this.classList.add("wrong");
    }

    // (D3) NEXT QUESTION OR END GAME
    quiz.now++;
    setTimeout(function(){
      if (quiz.now < quiz.data.length) { quiz.draw(); }
      else {
        quiz.hQn.innerHTML = `   لقد حصلت على  ${quiz.score}  من  ${quiz.data.length}    بشكل صحيح `;
        quiz.hAns.innerHTML = "";
      }
    }, 1000);
  }
};
window.addEventListener("load", quiz.init);
