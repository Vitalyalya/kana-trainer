// TOGGLES AND UI
const settings = document.querySelector(".settings");
const tables = document.querySelector(".kana-tables");
const tablesChange = document.querySelector(".tables-header");
const katakanaTable = document.querySelector(".katakana-table");
const hiraganaTable = document.querySelector(".hiragana-table");
const blob = document.querySelector(".blob");

const kanaInput = document.querySelector(".kana-input");
const kanas = document.querySelector(".kanas");

const result = document.querySelector(".right-or-wrong");
const answer = document.querySelector(".answer");

const settingsHiragana = document.querySelector(".hiragana");
const settingsKatakana = document.querySelector(".katakana");

const spanCounter = document.querySelector(".counter");

document.querySelector(".settings-icon").addEventListener("click", () => {
  settings.classList.toggle("settings-active");
});

document.querySelector(".back-icon").addEventListener("click", () => {
  if (!checkSettings()) {
    alert("Need to select at least one!");
  } else {
    settings.classList.toggle("settings-active");
  }
});

document.querySelector(".back-icon-2").addEventListener("click", () => {
  tables.classList.toggle("tables-active");
});

document.querySelector(".tables-icon").addEventListener("click", () => {
  tables.classList.toggle("tables-active");
});

// ********************************************

tablesChange.addEventListener("click", () => {
  blob.classList.toggle("blob-move");
  katakanaTable.classList.toggle("table-active");
  hiraganaTable.classList.toggle("table-active");
});

let answers = [];
kanas.addEventListener("submit", (e) => {
  e.preventDefault();

  if (e.target.lastChild.className === "kana-input") {
    e.target.lastChild.disabled = true;

    let nextInput = e.target.parentElement.nextSibling;

    if (nextInput) {
      answers.push(e.target.lastChild.value);

      e.target.lastChild.blur();

      nextInput.lastChild.lastChild.focus();
    } else {
      answers.push(e.target.lastChild.value);
      inputCheck(answers);
    }
  }
});

// ********************************************
let numberOfSyllables;

pickRandomKana();

//variable for the counter for right answers
let rightAnswers = 0;

//check the inputs
function inputCheck(kanaInput) {
  let counter = 0;

  for (let i = 0; i < kanaInput.length; i++) {
    console.log(kanaInput[i].toLowerCase().trim());
    console.log(randomRoumajiText[i]);

    if (kanaInput[i].toLowerCase().trim() == randomRoumajiText[i]) {
      counter++;

      addSyllable(randomRoumajiText[i], "green");
    } else {
      counter--;
      addSyllable(randomRoumajiText[i], "#8b0000 ");
    }
  }
  if (counter === numberOfSyllables) {
    showRight();
    rightAnswers++;
    spanCounter.textContent = rightAnswers;
    spanCounter.style.display = "block";
    console.log(answer.text);
    console.log(rightAnswers);
    clearPage();
    pickRandomKana();
  } else {
    rightAnswers = 0;
    spanCounter.style.display = "none";
    console.log(rightAnswers);
    setTimeout(() => {
      clearPage();
      pickRandomKana();
    }, 2000);
  }
  answers = [];
}

//appends spans with kana and animation to the container
function addSyllable(syllable, color) {
  let span = document.createElement("span");
  span.textContent = syllable;
  span.style.color = `${color}`;

  if (color === "#8b0000 ") {
    span.style.animation = "error 1.5s forwards ease-in-out";
  }

  answer.appendChild(span);
  answer.style.opacity = 1;
}

//checks settings and asks to pick random kanas and create an element
function pickRandomKana() {
  const hiraKata = checkSettings();
  numberOfSyllables = Math.floor(Math.random() * (5 - 2) + 2);

  if (hiraKata == 3) {
    let randomKana = pushKana("both", numberOfSyllables);

    createKana(numberOfSyllables, ...randomKana[0]);
    randomRoumajiText = randomKana[1];
  } else if (hiraKata === 2) {
    let randomKana = pushKana(katakana, numberOfSyllables);

    createKana(numberOfSyllables, ...randomKana[0]);
    randomRoumajiText = randomKana[1];
  } else {
    let randomKana = pushKana(hiragana, numberOfSyllables);

    createKana(numberOfSyllables, ...randomKana[0]);
    randomRoumajiText = randomKana[1];
  }
}

//picks random kana from arrays
function pushKana(arr, numberOfSyllables) {
  let randomKana = [];
  let randomRoumaji = [];

  if (arr === "both") {
    arr = hiragana.concat(katakana);
  }
  for (i = 0; i < numberOfSyllables; i++) {
    let randomNumber = Math.random();

    kanaValue = arr[Math.floor(randomNumber * arr.length)];

    randomKana.push(kanaValue.kana);

    randomRoumaji.push(kanaValue.roumaji);
  }

  return [randomKana, randomRoumaji];
}

//checks the setting on page
function checkSettings() {
  if (!settingsHiragana.checked && !settingsKatakana.checked) {
    return 0;
  }
  if (settingsHiragana.checked && settingsKatakana.checked) {
    return 3;
  } else if (settingsHiragana.checked && settingsKatakana.checked === false) {
    return 1;
  } else return 2;
}

//create an element
function createKana(numberOfSyllables, ...syllables) {
  for (let i = 0; i < numberOfSyllables; i++) {
    const kanasInput = document.createElement("div");
    kanasInput.className = "kana-plus-input";
    const kanaSpan = document.createElement("span");
    kanaSpan.className = "kana";

    kanaSpan.textContent = syllables[i];

    const form = document.createElement("form");
    form.className = "kana-input-form";

    const input = document.createElement("input");
    input.autocapitalize = "none";
    input.type = "text";
    input.className = "kana-input";
    input.spellcheck = false;

    kanas.appendChild(kanasInput);
    kanasInput.appendChild(kanaSpan);
    kanasInput.appendChild(form);
    form.appendChild(input);
    setTimeout(() => {
      kanaSpan.classList.add("kana-appear");
    }, 0);
    if (i === 0) {
      input.focus();
    }
  }
}

//clears answers and kana
function clearPage() {
  answer.style.opacity = 0;
  while (kanas.firstChild) kanas.firstChild.remove();
  setTimeout(() => {
    while (answer.firstChild) answer.firstChild.remove();
  }, 500);
}

//show the message if everything is right
function showRight() {
  result.textContent = "Correct!";
  result.style.color = "green";

  setTimeout(() => {
    result.style.color = "transparent";
  }, 1500);
}
