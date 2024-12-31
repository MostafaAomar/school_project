var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "8- Antibiotics are useful to ......",
    o : [
      "a- cure many illnesses",
      " b- allow bacteria to multiply",
      "c- spread infections "

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "9- Using the same antibiotics over and over again makes the body ..... the bacteria.",
    o : [
      "a- stronger to kill ",
      "b- unable to fight",
       "c- able to attack"

    ],
    a : 1
  },
  {
    q : "10- Match two of the underlined words from the text to the meanings below: 10- the ability to stop something from harming you",
    o : [

      "resistance",
      "survive",
      "strictly"

    ],
    a : 0
  },
  {
    q : "11- Match two of the underlined words from the text to the meanings below: 11- continue to live or exist",
    o : [
      "resistance",
      "survive",
      "strictly"

    ],
    a : 1
  },
  {
    q : "12- patients who start to feel better while taking antibiotics shouldn't.......",
    o : [
      "keep (taking the course of antibiotics).",
      "There are many reasons why this might happen.",
      "stop (taking the course of antibiotics)."

    ],
    a :2
  },
  {
    q : "13- Cleaning the hands helps people to.......",
    o : [
      "to be Cleaned",
      "kill all the resistant bacteria.",
      "to eat"

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
        quiz.hQn.innerHTML = ` لقد حصلت على ${quiz.score}  من ${quiz.data.length}   بشكل صحيح `;
        quiz.hAns.innerHTML = "";
      }
    }, 1000);
  }
};
window.addEventListener("load", quiz.init);
