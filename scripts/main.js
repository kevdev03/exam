let activeCard = getActiveCard(),
  activeNumber = getActiveNumber();
const nextButton = document.querySelector(".controls>button.btn-next"),
  sidebarRight = document.querySelector('.sidebar-right');
nextButton.addEventListener('click', nextCard);
sidebarRight.addEventListener('click', nextCard);

const previousButton = document.querySelector(".controls>button.btn-previous"),
  sidebarLeft = document.querySelector('.sidebar-left');
previousButton.addEventListener('click', previousCard);
sidebarLeft.addEventListener('click', previousCard);

const cardContainer = document.querySelector('.main'),
  numbersContainer = document.querySelector('.numbers'),
  numbers = document.querySelectorAll('.numbers button');

function getActiveCard() {
  return document.querySelector('.card.active');
}

function getActiveNumber() {
  return document.querySelector('.numbers button.btn-active');
}

function activateCard(e) {
  // console.log("e-->", e.target.dataset);
  const targetId = e.target.dataset.questionId;
  console.log("targetId-->", targetId);

  activeCard = getActiveCard();
  activeNumber = getActiveNumber();

  activeNumber.classList.remove('btn-active');
  activeCard.classList.remove('active');

  numbersContainer.querySelector(`button[data-question-id="${targetId}"]`).classList.add('btn-active');
  document.querySelector(`.card[data-question-id="${targetId}"]`).classList.add('active');
}

function nextCard(e) {
  activeCard = getActiveCard();
  activeNumber = getActiveNumber();

  if (! activeCard.nextElementSibling) 
    return false;

  activeNumber.classList.remove('btn-active');
  activeNumber.nextElementSibling.classList.add('btn-active');

  activeCard.classList.remove('active');
  activeCard.nextElementSibling.classList.add('active');
}

function previousCard() {
  activeCard = getActiveCard();
  activeNumber = getActiveNumber();

  if (! activeCard.previousElementSibling) 
    return false;

  activeNumber.classList.remove('btn-active');
  activeNumber.previousElementSibling.classList.add('btn-active');

  activeCard.classList.remove('active');
  activeCard.previousElementSibling.classList.add('active');
}

// load questions

const request = new XMLHttpRequest();
request.open('GET', 'data/questions.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    const questions = JSON.parse(request.responseText);

    // console.log("cardContainer-->", cardContainer);
    let counter = 1;

    // randomize the question array
    questions.sort(() => { return 0.5 - Math.random() });

    questions.map((question, key) => {
      // Numbers!
      const number = document.createElement('button');
      number.setAttribute('data-question-id', question.id);
      number.textContent = counter;
      number.addEventListener('click', activateCard);
      numbersContainer.appendChild(number);

      // Cards!
      const newCard = document.createElement('div');
      newCard.setAttribute('data-question-id', question.id);
      newCard.classList.add('card');

      if (key === 0) {
        numbersContainer.querySelector('button:first-child').classList.add('btn-active');
        newCard.classList.add('active');
      }

      const answers = document.createElement('div');
      answers.classList.add('options');

      // randomize the answers array
      question.answers.sort(() => { return 0.5 - Math.random() });

      question.answers.map((answerObj, key) => {
        const answerHTML = document.createElement('button'),
        answerType = answerObj.type || 'text'; // if type key is not declared, default to text
        answerHTML.classList.add('btn-default');
        answerHTML.setAttribute('data-answer-id', answerObj.answerId);

        if (answerType === 'text') {
          answerHTML.textContent = answerObj.answer;
        } else {
          const answerImage = document.createElement('img');
          answerImage.setAttribute('src', answerObj.answer);
          // console.log("answerImage-->", answerImage);
          answerHTML.appendChild(answerImage);
        }

        answerHTML.addEventListener('click', (e) => {
          // console.log("hey!-->", e);
          // this.classList.add('selected');
        }, false);

        answers.appendChild(answerHTML);
      });

      newCard.innerHTML = `
        <div class="card-header">Question # ${counter}</div>
          <div class="card-body">
            ${question.question}
          </div>
        <div class="card-footer"></div>`;
      newCard.querySelector('.card-body').appendChild(answers);

      cardContainer.appendChild(newCard);
      counter++;
    });

    const reviewButton = document.createElement('button');
    reviewButton.classList.add('btn-review');
    reviewButton.textContent = "Review";
    numbersContainer.appendChild(reviewButton);
  } else {
    console.log("error-->", request.status);
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();