var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "not responsible for a crime",
    o : [
      "innocent",
      "guilty",
      "property "

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "something valuable which belongs to someone",
    o : [
      "principle ",
      "property",
       "enforce"

    ],
    a : 1
  },
  {
    q : " a group of people in court who decide whether someone is guilty",
    o : [

      "jury",
      "legal",
      "property"

    ],
    a : 0
  },
  {
    q : " rule / belief",
    o : [
      "innocent",
      "govern",
      "principle"

    ],
    a : 2
  },
  {
    q : "to control",
    o : [
      "enforce",
      "innocent",
      "govern"

    ],
    a :2
  },
  {
    q : "responsible for a crime",
    o : [
      "property",
      "guilty",
      "prove"

    ],
    a :1
  },
  {
    q : "to show that something is true",
    o : [
      "property",
      "guilty",
      "prove"

    ],
    a :2
  },{
    q : "relating to the law",
    o : [
      "property",
      "principle",
      "prove"

    ],
    a :1
  },{
    q : "to put into practice / carry out",
    o : [
      "enforce",
      "guilty",
      "prove"

    ],
    a :0
  },{
    q : "Many people believe that the worst crimes are murder and other......... acts. (violence)",
    o : [
      "violently",
      "violent"


    ],
    a :1
  },{
    q : "There would be a .....situation in society if there were no...... systems.(chaos / law)",
    o : [
      "chaotic - legal",
      "chaoticly - legally"


    ],
    a :0
  },{
    q : "He left court a free man because he had proved that he was..... .The jury said he was...... (innocence / not guilt).",
    o : [
      "innocent - not guilty",
      "innocently - not guilt"


    ],
    a :0
  },{
    q : "very harshly",
    o : [
      "severely",
      "international",
      "prejudice"


    ],
    a :0
  },{
    q : " people not in the army",
    o : [
      "international",
      "civilians",
      "prejudice"


    ],
    a :1
  },{
    q : "used by a number of different countries",
    o : [
    "international",
    "civilians",
    "prejudice"


    ],
    a :0
  },{
    q : "help",
    o : [
    "international",
    "civilians",
    "aid"


    ],
    a :2
  },{
    q : " a formal agreement",
    o : [
      "treaty",
      "civilians",
      "aid"


    ],
    a :0
  },{
    q : " negative attitude towards people who are different",
    o : [
    "treaty",
    "prejudice",
    "aid"


    ],
    a :1
  },{
    q : "A/5/2 - The judge in charge of the..... carried all his documents in a black leather...... ",
    o : [
    "mean",
    "fine",
    "court",
    "case"


    ],
    a :3
  },{
    q : "A/5/2- The..... heard that the crime had taken place on a tennis.... ",
    o : [
    "mean",
    "fine",
    "court",
    "case"


    ],
    a :2
  },{
    q : "A/5/2 - The .....weather made me feel happy, but my mood changed when the police officer gave me a .....for driving too fast. ",
    o : [
    "mean",
    "fine",
    "court",
    "case"

    ],
    a :1
  },{
    q : "A/5/2 - A  What does this word .....? B ..... is the opposite of generous. ",
    o : [
    "mean",
    "fine",
    "court",
    "case"

    ],
    a :0
  },{
    q : "A/6/2- A- What have you (done / been doing) since I last saw you? B- I’ve (passed / been passing) my driving test and I’ve (had / been having) interviews for a university place. ",
    o : [
    "been doing - passed - been having",
    "done - been passing - had"

    ],
    a :0
  },{
    q : "A/6/2 - A- Have you ever (learnt to play / been learning to play) a musical instrument? B- Yes, I’ve (started / been starting) learning the mizmar, but I’ve only (played / been playing) for a few weeks. ",
    o : [
    "been learning to play - been starting - been playing",
    "learnt to play - started - been playing"

    ],
    a :1
  },{
    q : "A/6/2 - A- Have you (had / been having) a holiday yet this year? B- Yes, we’ve just (come back / been coming back) from Lattakia. ",
    o : [
    "had - been coming back",
    "had - come back"

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
