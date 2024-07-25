var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "29. If you want to succeed in your job, ...........",
    o : [
      "you have to work hard",
      " you had to work hard",
      "you had had work hard"

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "30. I broke my glasses, SO......... ... ",
    o : [
    " I had one",
      "I need a new one",
      "I am having one"

    ],
    a : 1
  },
  {
    q : "31. Many (recycling, recycle) factories were built in our town.",
    o : [

      "recycle",
      "recycling"

    ],
    a : 1
  },
  {
    q : "32. When I was twelve, I (did, made) the decision not to eat any more fast food. ",
    o : [
      "did",
      "made"

    ],
    a : 1
  },
  {
    q : "33. This man has three villas. He (can't be, must be) rich",
    o : [
    "can't be",
    "must be"

    ],
    a :1
  },
  {
    q : "34. My father retired after he (finish) the project.",
    o : [
    "(had finished)- (finished)",
    "(was finishing)-(is finishing)",
    "(have finished)-(finishes)"

    ],
    a :0
  },
  {
    q : " 35. Hassan (write) an essay all morning. He is very tired now.",
    o : [
    "is writing",
    "have been writing",
    "writes"
    ],
    a :1
  },
  {
    q : " 36. When Sami graduates, he (travel) to London.",
    o : [
    "had traveled",
    "(will travel)-(is going to travel)-(is traveling)",
    "(was traveling)-(traveled)"
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
