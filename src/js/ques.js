document.addEventListener("DOMContentLoaded", function () {
  var coursesOffered = document.getElementById("courses-offered");
  var dropdown = coursesOffered.querySelector(".dropdown");
  var subDropdowns = document.querySelectorAll(".sub-dropdown");

  coursesOffered.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleDropdown();
  });

  subDropdowns.forEach(function (subDropdown) {
    subDropdown.parentElement.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleSubDropdown(subDropdown);
      closeOtherSubDropdowns(subDropdown);
    });
  });

  document.addEventListener("click", function () {
    closeDropdowns();
  });

  function toggleDropdown() {
    dropdown.classList.toggle("active");
    closeOtherSubDropdowns();
  }

  function toggleSubDropdown(subDropdown) {
    subDropdown.classList.toggle("active");
  }

  function closeDropdowns() {
    dropdown.classList.remove("active");
    subDropdowns.forEach(function (subDropdown) {
      subDropdown.classList.remove("active");
    });
  }

  function closeOtherSubDropdowns(currentSubDropdown) {
    subDropdowns.forEach(function (subDropdown) {
      if (subDropdown !== currentSubDropdown) {
        subDropdown.classList.remove("active");
      }
    });
  }
});

// HEADER JS
window.addEventListener("scroll", function () {
  const header = document.querySelector(".head");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }
});

var initialClick = false;
var currentQuestionIndex = 0;
var questionsData;
console.log(questionsData);

// function updateProgressBar() {
//     var progressBar = document.getElementById('progress-bar');
//     if (currentQuestionIndex > 0) {
//         progressBar.style.display = 'block'; // Show the progress bar
//         progressBar.style.width = (currentQuestionIndex * 33.33) + '%'; // Update progress
//     } else {
//         progressBar.style.display = 'none'; // Hide the progress bar
//     }
// }

document
  .getElementById("user-info-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var comments = document.getElementById("comments").value;

    console.log("Name: " + name);
    console.log("Email: " + email);
    console.log("Comments: " + comments);

    const url = "http://localhost:8080/api/user/enroll";
    const data = {
      name,
      email,
      comments,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          alert("Retry");
        } else {
          alert("Check your mail");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });

function setupInitialMessage() {
  var questionText = document.getElementById("question-text");
  var questionText2 = document.getElementById("question-text2");
  var answersContainer = document.getElementById("answers");
  var backButton = document.getElementById("back-button");

  questionText.innerHTML = "Click here to start";

  backButton.style.display = "none";

  document
    .getElementById("question-container")
    .addEventListener("click", function () {
      if (!initialClick) {
        fetchQuestionsData();
        initialClick = true;

        var head1Element = document.querySelector(".head1");
        head1Element.classList.add("shift-left");
      }
    });
}

function fetchQuestionsData() {
  fetch("./js/questions.json")
    .then((response) => response.json())
    .then((data) => {
      questionsData = data;
      setupInitialQuestion();
    })
    .catch((error) => console.error("Error fetching questions:", error));
}

function setupInitialQuestion() {
  var questionText = document.getElementById("question-text");
  var answersContainer = document.getElementById("answers");
  var questionContainer = document.getElementById("question-container");
  var backButton = document.getElementById("back-button");
  var introHeading = document.querySelector(".intro");
  var subIntroHeading = document.querySelector(".sub-intro");
  var intro2Paragraph = document.querySelector(".intro2");

  var initialQuestion = questionsData.initial;

  questionText.innerHTML = initialQuestion.text;
  answersContainer.innerHTML = "";

  initialQuestion.answers.forEach(function (answer) {
    var answerElement = document.createElement("div");
    answerElement.classList.add("answer");
    answerElement.innerHTML = answer;
    answerElement.addEventListener("click", function () {
      handleNextQuestion(answer);
    });
    answersContainer.appendChild(answerElement);
  });

  questionContainer.classList.add("question-container-expanded");

  introHeading.style.display = "none";
  subIntroHeading.style.display = "none";
  intro2Paragraph.style.display = "none";

  // var head1Element = document.querySelector('.head1');
  // head1Element.classList.add('shift-left');
}

// function updateStepInfo() {
//     var currentStep = document.getElementById('current-step');
//     var totalSteps = document.getElementById('total-steps');

//     currentStep.textContent = currentQuestionIndex + 1;
//     totalSteps.textContent = Object.keys(questionsData).length;
// }

function handleNextQuestion(selectedAnswer) {
  var questionText = document.getElementById("question-text");
  var answersContainer = document.getElementById("answers");
  var backButton = document.getElementById("back-button");
  var progressBar = document.getElementById("filler-bar");
  var formContainer = document.getElementById("form-container");
  var questionContainer = document.getElementById("question-container");

  currentQuestionIndex++;
  var currentQuestion = questionsData[selectedAnswer];

  if (currentQuestion) {
    questionText.innerHTML = currentQuestion.text;
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach(function (nextAnswer) {
      var nextAnswerElement = document.createElement("div");
      nextAnswerElement.classList.add("answer");
      nextAnswerElement.innerHTML = nextAnswer;
      nextAnswerElement.addEventListener("click", function () {
        handleNextQuestion(nextAnswer);
      });
      answersContainer.appendChild(nextAnswerElement);
    });

    // Show the back button when reaching the second question
    if (currentQuestionIndex === 1) {
      backButton.style.display = "flex";
    }

    console.log(currentQuestionIndex);
    if (currentQuestionIndex > 4) {
      questionContainer.style.display = "none";
      formContainer.style.display = "block";
      document.getElementById("back-button").style.display = "none";
    }

    // Update the progress bar
    // progress = currentQuestionIndex * 33.33;
    // updateProgressBar();

    // if (currentQuestionIndex === 1) {
    //     // Show step info after the first question
    //     var stepInfo = document.getElementById('step-info');
    //     stepInfo.style.display = 'block';
    // }
    // updateStepInfo();
  }
}

function handleBackButton() {
  var questionText = document.getElementById("question-text");
  var answersContainer = document.getElementById("answers");
  var progressBar = document.getElementById("filler-bar");

  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;

    var previousQuestion =
      questionsData[Object.keys(questionsData)[currentQuestionIndex]];

    questionText.innerHTML = previousQuestion.text;
    answersContainer.innerHTML = "";

    previousQuestion.answers.forEach(function (answer) {
      var answerElement = document.createElement("div");
      answerElement.classList.add("answer");
      answerElement.innerHTML = answer;
      answerElement.addEventListener("click", function () {
        handleNextQuestion(answer);
      });
      answersContainer.appendChild(answerElement);
    });

    // Hide the back button for the first question
    if (currentQuestionIndex === 0) {
      document.getElementById("back-button").style.display = "none";
    }

    // Empty the progress bar
    // progress = currentQuestionIndex * 33.33;
    // updateProgressBar();
    // updateStepInfo();
  }
}

// Attach event listener for the back button
document
  .getElementById("back-button")
  .addEventListener("click", handleBackButton);

setupInitialMessage();
