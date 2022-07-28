import { showAlert } from "../sendAlert.js";

const fs = require('fs');
const fileName = './save.json';

var wrongQuestions = []
var correctAmt = 0

$(document).ready(function () {
	fs.readFile(fileName, 'utf8', function (error, data) {
		const file = JSON.parse(data);

		const cards = file.cards;

		if (cards.length == 0) {
			$('#quiz').remove();
			showAlert('No questions available');
			setTimeout(() => {
				location.href = '../main/index.html';
			}, 1910)
		} else {
			setQuestions(cards, 0);
		}
	})
})

function setQuestions (cards, current) {
	var currentCard = cards[current];

	document.getElementById('question').innerText = currentCard.question;

	$('#quiz').submit(function () {
		const guess = $('#answer').val();
		$('#answer').val('');

		if (guess == currentCard.answer) {
			correctAmt = correctAmt + 1;

			showAlert('Congratulations! Correct answer!');
		} else {
			currentCard['guess'] = guess;

			wrongQuestions.push(currentCard);

			showAlert(`Wrong answer... Correct answer is: '${currentCard.answer}'`);
		}

		current = current + 1;
		
		if (cards.length == current) {
			showResults(cards);
		} else {
			$('#quiz').unbind('submit');
			setQuestions(cards, current);
		}
	})
}

function showResults (cards) {
	const quiz = document.getElementById('quiz');
	quiz.remove();

	$('#totalQ').text((cards.length).toString());
	$('#correctStat').text(correctAmt.toString());
	$('#accuracy').text(Number((100*(correctAmt/(cards.length))).toFixed(2)).toString());

	wrongQuestions.forEach(elem => {
		const wrongElem = document.createElement('div');
		const elemQuestion = document.createElement('h3');
		const elemAnswer = document.createElement('p');
		const lineblock = document.createElement('hr');
		const youWrote = document.createElement('h4');
		const guessedAnswer = document.createElement('p');

		wrongElem.className = 'wrongCard';
		elemQuestion.innerText = elem.question;
		elemAnswer.innerText = elem.answer;
		guessedAnswer.innerText = elem.guess;
		youWrote.innerText = 'You Wrote:';

		document.getElementById('wrongQuestions').appendChild(wrongElem);
		wrongElem.appendChild(elemQuestion);
		wrongElem.appendChild(elemAnswer);
		wrongElem.appendChild(lineblock);
		wrongElem.appendChild(youWrote);
		wrongElem.appendChild(guessedAnswer);
	});

	document.getElementById('stats').style.display = 'block';
}