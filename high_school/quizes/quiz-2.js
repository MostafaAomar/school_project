var quiz = {
  // (A) PROPERTIES
  // (A1) QUESTIONS & ANSWERS
  // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
  data: [{
      q: "economic activity concerned with raw materials and manufacture goods",
      o: [
        "industry",
        "deteriorate ",
        " success"

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "a serious shortage of food leading to great hunger on a large scale",
      o: [
        "deteriorate",
        "famine ",
        " emigrate"

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "a period of great wealth",
      o: [
        "development",
        " deteriorate",
        "success "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "the process of modernisation",
      o: [
        "development",
        " deteriorate",
        " famine"

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "to leave your country to live in a new country",
      o: [
        "industry",
        " emigrate",
        " success"

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "to get worse",
      o: [
        "success",
        " deteriorate",
        " industry"

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  My weekly .....s are twice as much as they were last year. (earn)",
      o: [
        "earn",
        "earning ",
        "earned "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  A huge earthquake caused the ......of Agadir, Morocco, in 1960. (destroy)",
      o: [
        "destruction",
        "destroyed ",
        "destroy "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  Two ....... potato crops led to mass starvation in Ireland. (disaster)",
      o: [
        "disaster",
        "disastery ",
        "disastrous "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  The of the world’s migrants move to find a better life. (major)",
      o: [
        "major",
        "majory ",
        "majority "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  The people of Tristan da Cunha left because of volcanic ...... . (act)",
      o: [
        "activity",
        "action ",
        "acting "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  The....... success of the 1960s and 1970s was funded by oil. (economy)",
      o: [
        "economic",
        "economy ",
        "economyly "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5 These workers were able to find a better life and help with the .......of the region. (develop)",
      o: [
        "developing",
        "development ",
        "developed "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/19/3   Past simple or past perfect On February 29th 1960, an earthquake (1)...... (hit) the Moroccan city of Agadir. ",
      o: [
        "hit",
        "hitted ",
        "had hitted "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5 Although it (2) .....(last) only fifteen seconds, it (3)...... (be) one of the most destructive earthquakes of the 20th century.",
      o: [
        "lasted - been",
        "had lasted - had been ",
        "lasted - was "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5 When the rescue team (4) ......(arrive), many areas of the city (5)..... (be destroyed) completely and thousands of families (6)...... (become) refugees.",
      o: [
        "arrived - was destroyed - became",
        "arrived - had been destroyed - had become ",
        "arrived - was destroyed - had become "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5  After the earthquake, the city (7)....... (be evacuate) and inhabitants (8) ......(move) 3km south where the city (9)....... (be rebuilt).",
      o: [
        "was evacuated - moved - was rebuilt",
        "was evacuated - had moved - was rebuilt ",
        "was evacuated - moved - had been rebuilt "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "S/18/5 Later studies (10)...... (show) that the disaster (11) .......(kill) over one third of the population of Agadir, over 10,000 people, and (12)...... (injure) many more.",
      o: [
        "showed - had killed -  injured",
        "showed -  killed - had injured ",
        "showed - had killed - had injured "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 having mild temperatures",
      o: [
        "temperate",
        " raise",
        " creature"

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 bring up children",
      o: [
        "temperate",
        " raise",
        " creature"

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 a living thing / animal",
      o: [
        "temperate",
        " raise",
        " creature"

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 very long",
      o: [
        "extensive",
        "recurrent ",
        "original "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 first",
      o: [
        "extensive",
        "recurrent ",
        "original "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 occurring often or repeatedly",
      o: [
        "extensive",
        "recurrent ",
        "original "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/4 advance steadily",
      o: [
        "extensive",
        "forge ",
        "original "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/3 Some human activities are (destroying / destruction) the natural world.",
      o: [
        "destroying",
        "destruction "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/3 Unemployment is falling as more people find (permanent / permanently) work.",
      o: [
        "permanent",
        "permanently "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/3 Average (earn / earnings) are expected to double in the next ten years.",
      o: [
        "earn",
        "earnings "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/3 It has been a (disaster / disastrous) year for the tea industry.",
      o: [
        "disaster",
        "disastrous "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/10/3 Storms caused the (destroyed / destruction) of most of the crops.",
      o: [
        "destroyed",
        "destruction "

      ],
      a: 1 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/11/1 In 1975 my family (1)....... (leave) England on an aeroplane. Five hours later we (2) .......(arrive) in Damascus, Syria. My mother (3)......... (be) worried about the plane journey because she is scared of flying. But there (4)........ (be) no turbulence and she (5)......... (sleep) through the trip.",
      o: [
        "left - had arrived - was - was - slept",
        " had left - arrived - was - was - slept",
        "left - arrived - was - was - slept "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/11/1 In Syria my family (6)....... (live) in a lovely apartment, which was (7)....... (provide) by my father’s new job. My father helped to run an engineering firm that (8)........(build) bridges. We (9)........ (go) to an international school and (10)........ (attend) school with children from all over the world.",
      o: [
        "lived - provided - built - went - attended",
        "had lived - provided - had built - went - attended ",
        "lived - provided - built - was going - attended "

      ],
      a: 0 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/11/1 At first, it (11)........ (be) difficult getting used to being away from home, but we all (12)....... (work) hard to fit in and the locals (13)....... (be) very friendly. In 1986, my family and I (14)...... (return) to England, but I (15)..... (love) my time in Syria.",
      o: [
        "was - worked - had been - returned - loved",
        "was - had worked - were - returned - loved ",
        "was - worked - were - returned - loved "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
    },
    {
      q: "A/11/1 I (16).......(learn) so much about an interesting culture and (17)....... (make) so many good friends.",
      o: [
        "had learnt - had make",
        "had learning - had made ",
        "had learnt - had made "

      ],
      a: 2 // arrays start with 0, so answer is 70 meters
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
  init: function() {
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
  draw: function() {
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
  select: function() {
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
    setTimeout(function() {
      if (quiz.now < quiz.data.length) {
        quiz.draw();
      } else {
        quiz.hQn.innerHTML = ` لقد حصلت على ${quiz.score}  من ${quiz.data.length}   بشكل صحيح `;
        quiz.hAns.innerHTML = "";
      }
    }, 1000);
  }
};
window.addEventListener("load", quiz.init);
