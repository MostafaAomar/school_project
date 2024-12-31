var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [{
    q : " affecting the whole world ",
    o : [
      "global",
      "consumption ",
      "tool "

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "the eating or drinking of something",
    o : [
    "global",
    "consumption ",
    "tool "

    ],
    a : 1
  },
  {
    q : "a piece of equipment for doing a particular job",
    o : [

    "global",
    "consumption ",
    "tool "

    ],
    a : 2
  },
  {
    q : "very destructive",
    o : [
      "devastating",
      "export",
      "illegal"

    ],
    a : 0
  },
  {
    q : "against the law",
    o : [
    "devastating",
    "export",
    "illegal"

    ],
    a :2
  },
  {
    q : "send something for sale in another country",
    o : [
    "devastating",
    "export",
    "illegal"

    ],
    a :1
  },
  {
    q : "A country where the sun always shines has a dry (climate / weather).",
    o : [

    "climate",
    "weather"

    ],
    a :0
  },
  {
    q : "You feel cold when the temperature is (high / low).",
    o : [

    "high",
    "low"

    ],
    a :1
  },
  {
    q : "When there is no wind, we say the weather is (calm / stormy).",
    o : [

    "calm",
    "stormy"

    ],
    a :0
  },
  {
    q : "Farmers listen to the (climate / weather) forecast to decide when to harvest their crops.",
    o : [

    "weather",
    "climate"

    ],
    a :0
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
