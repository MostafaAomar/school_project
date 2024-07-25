var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "21. Ruba:................?\n Khaled: Animals migrate to find food or to raise their young,",
    o : [
      "Why do animals migrate?\n- What makes animals migrate?\n- What do animals migrate for?\n- For what do animals migrate?\n- What do animals do to raise their young / find food?",
    "Why do animals do migrate?\n- What made animals migrate?\n- What done animals migrate for?\n- For what does animals migrate?\n- What did animals do to raise their young / find food?"


    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "22. Ruba:......... .?\n Khaled: They often migrate twice a year,",
    o : [
    " How often did they migrate?\n- How many times (a year) does they migrate?",
      "How often do they migrate?\n- How many times (a year) do they migrate?"


    ],
    a : 1
  },
  {
    q : "23. Ruba:..........?\nKhaled: They usually travel to warmer places.\nRuba: How can we protect animals? ",
    o : [

      "Where do they (usually) travel (to)?\n- Which / What places do they (usually) travel to?",
      "Where are they (usually) traveling (to)?\n-Which / What places are they (usually) traveling to?"


    ],
    a : 0
  },
  {
    q : "24. Kaled:................. ",
    o : [
      "by helping them",
      "by kill them"


    ],
    a : 0
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
