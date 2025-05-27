const form = document.querySelector('.form');
const dropdownCategory = document.getElementById('categoryDropdown');
const dropdownDifficulty = document.getElementById('difficultyDropdown');
const dropdownType = document.getElementById('typeDropdown');
const submitBtn = document.querySelector('.submit');
const formItem = document.getElementsByClassName('form-item');
const categoryError = document.querySelector('.categoryError');
const difficultyError = document.querySelector('.difficultyError');
const typeError = document.querySelector('.typeError');
const quiz = document.querySelector('.quiz');
let correctAnswers = [];

fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
        data.trivia_categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            dropdownCategory.appendChild(option);
        })
    })

function renderQuiz(questions) {
    quiz.innerHTML = '<h2 class="quiz-header">Quiz</h2>'; 
    correctAnswers = [];
    questions.forEach((q, index) => {
        correctAnswers.push(q.correct_answer);
        const answers = [...q.incorrect_answers, q.correct_answer];
        const questionEl = document.createElement('div');
        questionEl.innerHTML = `
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        <ul>
            ${answers.map(ans => `
            <li>
                <label>
                <input type="radio" name="q${index}" value="${ans}">
                ${ans}
                </label>
            </li>`).join('')}
        </ul>
        `;
        quiz.appendChild(questionEl);
    });
    const checkBtn = document.createElement('button');
    checkBtn.textContent = 'Check Answers';
    checkBtn.classList.add('check-answers');
    quiz.appendChild(checkBtn);
    checkBtn.addEventListener('click', checkAnswers);
    
}

function checkAnswers() {
  let score = 0;

  correctAnswers.forEach((correct, index) => {
    const questionRadios = document.getElementsByName(`q${index}`);
    let userAnswer = null;

    questionRadios.forEach(radio => {
      if (radio.checked) {
        userAnswer = radio.value;
      }

      // Disable all options after checking
      radio.disabled = true;

      // Remove any previous highlights
      radio.parentElement.classList.remove('correct', 'incorrect', 'missed');
    });

    questionRadios.forEach(radio => {
      const parent = radio.parentElement;

      if (radio.value === correct) {
        if (radio.checked) {
          parent.classList.add('correct');
          score++;
        } else {
          parent.classList.add('missed');
        }
      } else if (radio.checked) {
        parent.classList.add('incorrect');
      }
    });
  });

  const resultMsg = document.createElement('p');
  resultMsg.innerHTML = `<strong>You scored ${score} out of ${correctAnswers.length}</strong>`;
  resultMsg.style.marginTop = '1rem';
  quiz.appendChild(resultMsg);
}




form.addEventListener("submit", function(event){
    event.preventDefault();

    const category = dropdownCategory.value;
    const difficulty = dropdownDifficulty.value;
    const type = dropdownType.value;

    const apiUrl = `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=${type}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        renderQuiz(data.results);
    }
    )
})
    
