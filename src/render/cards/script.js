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
				answer: answer,
				inputValidation: {
					caseSensitive: $('#caseSensitive').is(":checked"),
					ignoreTrailing: $('#ignoreTrailing').is(":checked"),
					ignoreSpaces: $('#ignoreSpaces').is(":checked"),
					convertDash: $('#convertDash').is(":checked")
				}
			});
			
			fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
				if (err) return console.log(err);
			});

			$('#cardQuestion').val('');
			$('#cardAnswer').val('');
			
			$('#caseSensitive').prop('checked', true);
			$('#ignoreTrailing').prop('checked', true);
			$('#ignoreSpaces').prop('checked', false);
			$('#convertDash').prop('checked', false);

			updateCardView();

			showAlert('Card Created');
		})
	})

	$('#modifyCard').click(function(e) {
		if (e.target.id == 'modifyCard') {
			$('#modifyCard').css({'display':'none'});
		}
	});
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
			card.oncontextmenu = function () {modifyCard(this,elem)}

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

function modifyCard(card,cardData) {
	fs.readFile(fileName, 'utf8', function (error, data) {
		const inputValidation = cardData.inputValidation;

		$('#editQuestion').val(cardData.question);
		$('#editAnswer').val(cardData.answer);

		$('#EcaseSensitive').prop('checked', inputValidation.caseSensitive);
		$('#EignoreTrailing').prop('checked', inputValidation.ignoreTrailing);
		$('#EignoreSpaces').prop('checked', inputValidation.ignoreSpaces);
		$('#EconvertDash').prop('checked', inputValidation.convertDash);
		
		$('#modifyCard').css({'display':'block'});

		$('#editCard').submit(function (e) {
			var file = JSON.parse(data);
			const cards = file.cards;
			
			const index = cards.findIndex((obj => (obj.answer == cardData.answer) && (obj.question == cardData.question)));
			
			const question = $('#editQuestion').val();
			const answer = $('#editAnswer').val();
			
			file.cards[index].question = question;
			file.cards[index].answer = answer;
			file.cards[index].inputValidation = {
				caseSensitive: $('#EcaseSensitive').is(":checked"),
				ignoreTrailing: $('#EignoreTrailing').is(":checked"),
				ignoreSpaces: $('#EignoreSpaces').is(":checked"),
				convertDash: $('#EconvertDash').is(":checked")
			}
			
			fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
				if (err) return console.log(err);
			});
			
			$('#modifyCard').css({'display':'none'});

			$('#editQuestion').val('');
			$('#editAnswer').val('');

			$('#EcaseSensitive').prop('checked', true);
			$('#EignoreTrailing').prop('checked', true);
			$('#EignoreSpaces').prop('checked', false);
			$('#EconvertDash').prop('checked', false);

			updateCardView();

			$('#editCard').unbind('submit');
		})
	})
}