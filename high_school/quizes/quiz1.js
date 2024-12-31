var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "1- What are the factors that affect the amount of our sleep?",
    o : [
      "The factors that affect the amount of our sleep  They are our age, our daily routine, the quality of our sleep and our genetic make up.",
      " Exactly how much we need depends on several factors",
      "Getting enough sleep allows us to recharge our mental and physical batteries and be ready for cach new day."

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q : "2- Why is it important to get enough sleep?",
    o : [
      "People who have been deprived of sleep find it difficult to perform the simplest activities",
      " When we fall asleep, our sleep can be deep and restful or light and shallow.",
       "to recharge our mental and physical batteries, be ready For each new day."

    ],
    a : 2
  },
  {
    q : "3- How are shallow sleepers different from deep sleepers?",
    o : [

      "Some of the signs that you may need more sleep are: You have memory problems.",
"Shallow sleepers wake up still feeling tired while deep sleepers wake up refreshed",
      "Babies need about 16 hours a day while many teenagers need an average of 9 hours."

    ],
    a : 1
  },
  {
    q : "4- Find the word which mean: 4- easily feeling gloomy for no good reason",
    o : [
      "moody",
      "individual",
      "batteries"

    ],
    a : 0
  },
  {
    q : "5- Find the word which mean: 5- give all your attention to a subject",
    o : [
      "average",
      "concentrate",
      "motorists"

    ],
    a :1
  },
  {
    q : "6- Rewrite these sentences about the text to correct ..: Babies usually sleep less than adults.",
    o : [
      "Babies usually do not sleep more than adults.",
      "Babies usually sleep two hours a day.",
      "Babies usually sleep more than adults."

    ],
    a :2
  },
  {
    q : "7- Rewrite these sentences about the text to correct ..: Many traffic accidents happen becuase of the drivers who feel alert. ",
    o : [
      "Many traffic accidents happen because of drivers who sleep at home.",
      "Many traffic accidents happen because of drivers who fall asleep (at the wheel).",
      "Many traffic accidents do not happen because of drivers who fall asleep (at the wheel)."

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
