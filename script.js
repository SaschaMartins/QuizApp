let questions = [
    {
        "question": "Wer war der Mitbegründer von Apple Inc. zusammen mit Steve Jobs und Steve Wozniak?",
        "answer_1": "Bill Gates",
        "answer_2": "Paul Allen",
        "answer_3": "Tim Cook",
        "answer_4": "Ronald Wayne",
        "right_answer": 4
    },
    {
        "question": "In welchem Jahr wurde der erste Macintosh-Computer von Apple veröffentlicht?",
        "answer_1": "1980",
        "answer_2": "1984",
        "answer_3": "1990",
        "answer_4": "1995",
        "right_answer": 2
    },
    {
        "question": "Welches Produkt von Apple wurde erstmals im Jahr 2007 eingeführt und revolutionierte die Smartphone-Industrie?",
        "answer_1": "iPad",
        "answer_2": "iPod",
        "answer_3": "iPhone",
        "answer_4": "iMac",
        "right_answer": 3
    },
    {
        "question": "Welches Betriebssystem läuft auf den meisten Apple-Computern?",
        "answer_1": "Windows",
        "answer_2": "iOS",
        "answer_3": "Linux",
        "answer_4": "macOS",
        "right_answer": 4
    },
    {
        "question": "Wie nennt Apple seine eigene Webbrowser-Anwendung?",
        "answer_1": "Safari",
        "answer_2": "Firefox",
        "answer_3": "Chrome",
        "answer_4": "Edge",
        "right_answer": 1
    }
];

let currentQuestion = 0;
let correctAnswers = 0;
let answered = false;

function init() {
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
        const savedData = JSON.parse(savedProgress);
        currentQuestion = savedData.currentQuestion;
        correctAnswers = savedData.correctAnswers;
        updateProgressBar();
    }
    document.getElementById('all-questions').innerHTML = questions.length;
    document.getElementById('next-button').disabled = true;
    showQuestion();
}

function showQuestion() {
    let question = questions[currentQuestion];
    document.getElementById('questiontext').innerHTML = question['question'];
    document.getElementById('question-number').innerHTML = currentQuestion + 1;
    for (let i = 1; i <= 4; i++) {
        let answerId = `answer_${i}`;
        document.getElementById(answerId).innerHTML = question[`answer_${i}`];
    }
    updateProgressBar();
}

function answer(selection) {
    if (answered) return;
    const question = questions[currentQuestion];
    const selectionQuestionNumber = selection.slice(-1);
    const idOfRightAnswer = `answer_${question['right_answer']}`;
    const audioSrc = selectionQuestionNumber == question['right_answer'] ? 'audio/success.mp3' : 'audio/fail.mp3';
    playAudioAndHighlightSelection(selection, idOfRightAnswer, audioSrc);
    answered = true;
    document.getElementById('next-button').disabled = false;
    const progressData = {
        currentQuestion: currentQuestion,
        correctAnswers: correctAnswers,
    };
    localStorage.setItem('quizProgress', JSON.stringify(progressData));
}

function playAudioAndHighlightSelection(selection, idOfRightAnswer, audioSrc) {
    const audio = new Audio();
    audio.oncanplaythrough = function () {
        if (selection === idOfRightAnswer) {
            highlightAnswer(selection, 'bg-success');
            audio.play();
            correctAnswers++;
        } else {
            highlightAnswer(selection, 'bg-danger');
            highlightAnswer(idOfRightAnswer, 'bg-success');
            audio.play();
        }
    };
    audio.src = audioSrc;
}

function highlightAnswer(answerId, cssClass) {
    document.getElementById(answerId).parentNode.classList.add(cssClass);
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        document.getElementById('next-button').disabled = true;
        showQuestion();
        resetAnswerButtons();
        answered = false;
        const progressData = {
            currentQuestion: currentQuestion,
            correctAnswers: correctAnswers,
        };
        localStorage.setItem('quizProgress', JSON.stringify(progressData));
    } else {
        showEndScreen();
    }
}

function resetAnswerButtons() {
    for (let i = 1; i <= 4; i++) {
        let answerId = `answer_${i}`;
        document.getElementById(answerId).parentNode.classList.remove('bg-success', 'bg-danger');
    }
}

function showEndScreen() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('result-text').innerHTML = `Du hast ${correctAnswers} von ${questions.length} Fragen richtig beantwortet.`;
    let audio = new Audio('audio/win.mp3');
    audio.play();
    let fireworkDivs = document.querySelectorAll('.firework');
    fireworkDivs.forEach(div => {
        div.style.display = 'block';
    });
}

function updateProgressBar() {
    let totalQuestions = questions.length;
    let answeredQuestions = currentQuestion;
    let percentage = (answeredQuestions / totalQuestions) * 100;
    let progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = percentage + "%";
    progressBar.setAttribute('aria-valuenow', percentage);
}

function restartQuiz() {
    localStorage.removeItem('quizProgress');
    location.reload();
}