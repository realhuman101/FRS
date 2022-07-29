import { showAlert } from "../sendAlert.js";

const fs = require('fs');
const fileName = './save.json';

var cardPack;
var cardPackInd;

$(document).ready(function () {
	updateCardPackView();

	$('#cardForm').submit(function (e) {
		fs.readFile(fileName, 'utf8', function (error, data) {
			var file = JSON.parse(data);
			
			const question = $('#cardQuestion').val();
			const answer = $('#cardAnswer').val();

			file.cardPacks[cardPackInd].cards.push({
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

	$('#cardPackForm').submit(function() {
		fs.readFile(fileName, 'utf8', function (error, data) {
			var file = JSON.parse(data);
			const name = $('#cardPackName').val();

			if (file.cardPacks.some(e => e.name == name)) {
				showAlert(`'${name}' already exists as a card pack`);
			} else {
				file.cardPacks.push({
					name: name,
					cards: []
				});

				fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
					if (err) return console.log(err);
				});
			}
			
			updateCardPackView();

			$('#cardPackName').val('');
		})
	})
})

function updateCardPackView() {
	fs.readFile(fileName, 'utf8', function (error, data) {
		$('#cardPacks').empty();

		const file = JSON.parse(data);

		const items = file.cardPacks;

		items.forEach(elem => {
			const card = document.createElement('div');
			const name = document.createElement('h3');

			card.className = 'cardPack';
			name.innerText = elem.name;

			document.getElementById('cardPacks').appendChild(card);
			card.appendChild(name);
		});
	})
}

function updateCardView() {
	fs.readFile(fileName, 'utf8', function (error, data) {
		$('#cards').empty();

		const file = JSON.parse(data);

		const items = file.cardPacks[cardPackInd].cards;

		items.forEach(elem => {
			const card = document.createElement('div');
			const title = document.createElement('h4');
			const subtitle = document.createElement('p');

			card.className = 'card';
			card.onclick = function () {modifyCard(this,elem)}
			card.oncontextmenu = function () {deleteCard(this,elem)}

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
		const cards = file.cardPacks[cardPackInd].cards;

		file.cardPacks[cardPackInd].cards.splice(cards.indexOf(cardData),1);

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
			const cards = file.cardPacks[cardPackInd].cards;
			
			const index = cards.findIndex((obj => (obj.answer == cardData.answer) && (obj.question == cardData.question)));
			
			const question = $('#editQuestion').val();
			const answer = $('#editAnswer').val();
			
			file.cardPacks[cardPackInd].cards[index].question = question;
			file.cardPacks[cardPackInd].cards[index].answer = answer;
			file.cardPacks[cardPackInd].cards[index].inputValidation = {
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