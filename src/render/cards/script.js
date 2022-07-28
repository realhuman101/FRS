import { showAlert } from "../sendAlert.js";

const fs = require('fs');
const fileName = './save.json';

$(document).ready(function () {
	updateCardView();

	$('#cardForm').submit(function (e) {
		fs.readFile(fileName, 'utf8', function (error, data) {
			var file = JSON.parse(data);
			
			const question = $('#cardQuestion').val();
			const answer = $('#cardAnswer').val();

			file.cards.push({
				question: question,
				answer: answer
			});
			
			fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
				if (err) return console.log(err);
			});

			$('#cardQuestion').val('');
			$('#cardAnswer').val('');

			updateCardView();

			showAlert('Card Created');
		})
	})

	$('.card').click(function () {
		console.log('card element clicked');
	})
})

function updateCardView() {
	fs.readFile(fileName, 'utf8', function (error, data) {
		$('#cards').empty();

		const file = JSON.parse(data);

		const items = file.cards;

		items.forEach(elem => {
			const card = document.createElement('div');
			const title = document.createElement('h4');
			const subtitle = document.createElement('p');

			card.className = 'card';
			card.onclick = function () {deleteCard(this,elem)}

			title.innerText = elem.question;
			subtitle.innerText = elem.answer;

			document.getElementById('cards').appendChild(card);
			card.appendChild(title);
			card.appendChild(subtitle);
		});
	})
}

function deleteCard(card,cardData) {
	fs.readFile(fileName, 'utf8', function (error, data) {
		var file = JSON.parse(data);

		const cards = file.cards;

		file.cards.splice(cards.indexOf(cardData),1);

		fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
			if (err) return console.log(err);
		});

		card.remove();
	})
}