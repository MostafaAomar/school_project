var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [
  {
    q : "S/24/1  When he accused me of being wasteful, I (got very angry).",
    o : [
      "saw red",
      "put them on the blacklist ",
      " given the green light"

    ],
    a : 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/1 We have to stop companies from polluting the environment. We should (tell the public they have done something wrong).",
    o: [
    "saw red",
    "put them on the blacklist ",
    " given the green light"

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/1 They’ve (said yes) to the building of a new incinerator.",
    o: [
    "given the green light",
    "it's in black and white ",
    " red tape"

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/1 The rules clearly say that we must not leave rubbish outside our homes. Look, (it’s printed here).",
    o: [
    "given the green light",
    "it's in black and white ",
    " red tape"

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/1 It’s almost impossible to get a passport quickly. There is so much (paperwork and administration).",
    o: [
    "given the green light",
    "it's in black and white ",
    " red tape"

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/1 I heard this morning, (unexpectedly), that I’d won a writing competition.",
    o: [
    "given the green light",
    "it's in black and white ",
    "out of the blue "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 Things are moving so fast – it’s impossible to (keep up with) the changes.",
    o: [
    "reduce",
    "know the latest information about ",
    "meet / face "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 Supermarkets should (cut down on) packaging.",
    o: [
    "reduce",
    "know the latest information about ",
    "meet / face "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 We’ve (come up against) serious problems in our plan to recycle rubbish.",
    o: [
    "reduce",
    "know the latest information about ",
    "meet / face "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 I’m (looking forward to) the day when 100% of our rubbish is recycled.",
    o: [
    "reduce",
    "wait with pleasure for something to happen ",
    "meet / face "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 Scientists have just (come up with) a new way of reprocessing plastic.",
    o: [
    "invent / discover / find",
    " accept / stand / tolerate (something unpleasant)",
    " know the latest information about"

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "S/24/3 People living near the bus station (put up with) a lot of noise.",
    o: [
    "invent / discover / find",
    " accept / stand / tolerate (something unpleasant)",
    " know the latest information about"

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "a very small piece of paper, wood, cloth, etc.",
    o: [
    "wood pulp",
    "fibre",
    "sustainable "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "wood after it has been crushed",
    o: [
    "wood pulp",
    "fibre",
    "sustainable "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "a practice or product that can be used or re-used without causing damage to the environment",
    o: [
    "wood pulp",
    "fibre",
    "sustainable "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "decay",
    o: [
    "cloth",
    "fibre",
    "rot "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "material or fabric used to make clothes",
    o: [
    "cloth",
    "fibre",
    "rot "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "Grass and sugar cane are two of the.......... that can be used to make paper.",
    o: [
    "materials",
    "sustainable forests",
    "household waste "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "Trees used for making paper are grown in ......  ........., where new trees are planted to replace ones which are cut down.",
    o: [
    "materials",
    "sustainable forests",
    "household waste "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "About 50% of the paper and cardboard in......  ....... is made up of newspapers and magazines.",
    o: [
    "materials",
    "sustainable forests",
    "household waste "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "Burying paper in landfill sites does more damage to the........... than recycling it.",
    o: [
    "air pollution",
    "greenhouse gas",
    "environment "

    ],
    a: 2 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ---My brother spends many hours talking on the phone. (not spend so many hours)",
    o: [
    "I wish my brother wouldn’t spend so many hours on the phone.",

    "I wish my brother couldn’t spend so many hours on the phone. "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----I’m very shy about talking in public. (not so shy)",
    o: [
    "I wish I wasn’t so shy about talking in public.",

    "I wish I weren’t so shy about talking in public. "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----Newspapers and magazines contain too many adverts. (not so many)",
    o: [
    "I wish newspapers and magazines don’t contain so many adverts.",

    "I wish newspapers and magazines didn’t contain so many adverts. "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----You eat too quickly. (not eat so quickly)",
    o: [
    "I wish you wouldn’t eat so quickly.",

    "I wish you couldn’t eat so quickly. "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----I’m a very slow reader. (not such a slow reader)",
    o: [
    "I wish I weren’t such a slow reader.",

    "I wish I wasn’t such a slow reader. "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----We don’t spend much time together. (spend more time)",
    o: [
    "I wish we  spent much more time together.",

    "I wish we could spend much more time together. "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----The city centre is really busy this morning. (not so busy)",
    o: [
    "I wish the city centre weren’t so busy this morning.",

    "I wish the city centre wasn’t so busy this morning. "

    ],
    a: 0 // arrays start with 0, so answer is 70 meters
  },
  {
    q: "USING WISH ----He’s lost his keys. (find his keys)",
    o: [
    "He wishes he found his keys.",

    "He wishes he could find his keys. "

    ],
    a: 1 // arrays start with 0, so answer is 70 meters
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
