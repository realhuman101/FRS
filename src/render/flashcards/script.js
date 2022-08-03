import { showAlert } from "../sendAlert.js";
const { findSavePath } = require('../savePath.js');

const fs = require('fs');
const fileName = findSavePath();

var cardPackInd;

$(document).ready(function () {
	updateCardPackView();

	$('#flashcard').click(function() {
		const inner = $('#inner');
		if (inner.css('transform') == 'matrix3d(-1, 0, -1.22465e-16, 0, 0, 1, 0, 0, 1.22465e-16, 0, -1, 0, 0, 0, 0, 1)') {
			inner.css({'transform':'rotateY(0deg)'});
		} else {
			inner.css({'transform':'rotateY(180deg)'});
		}
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
			const amount = document.createElement('p');

			card.className = 'cardPack';
			card.onclick = function() {selectCardPack(elem)}

			name.innerText = elem.name;
			amount.innerText = `${elem.cards.length} card(s)`

			document.getElementById('cardPacks').appendChild(card);
			card.appendChild(name);
			card.appendChild(amount);
		});
	})
}

function selectCardPack(cardPackData) {
	fs.readFile(fileName, 'utf8', function (error, data) {
		const file = JSON.parse(data);
		const cardPacks = file.cardPacks;

		let cardPack = cardPackData.name;
		cardPackInd = cardPacks.findIndex(x => x.name == cardPack);

		$('#selectPack').css({'display':'none'});
		
		setup();
	})
}

function setup() {
	fs.readFile(fileName, 'utf8', function (error, data) {
		const file = JSON.parse(data);
		const cards = file.cardPacks[cardPackInd].cards;

		const flashcard = $('#flashcards');

		if (cards.length == 0) {
			showAlert('No cards available');
			setTimeout(() => {
				location.href = '../main/index.html';
			},1910)
		} else {
			$('#flashcardInstruct').css({'display':'initial'});

			setFlashcards(cards, 0);

			flashcard.css({'display':'initial'});
		}
	})
}

function setFlashcards(cards,current) {
	$('#slideNum').text((current + 1).toString() + '/' + (cards.length).toString());

	var currentCard = cards[current];

	$('#inner').css({'transform':'rotateY(0deg)'})

	const prevCard = $('#previous');
	const nextCard = $('#next');

	$('#question').text(currentCard.question);
	$('#answer').text(currentCard.answer);

	if (current <= 0) {
		prevCard.prop('disabled',true);
	} else {
		prevCard.click(function() {
			prevCard.unbind('click');
			prevCard.prop('disabled',false);
			nextCard.prop('disabled',false);
			setFlashcards(cards,(current - 1));
		})
	}

	if (cards.length <= (current + 1)) {
		nextCard.prop('disabled',true);
	} else {
		nextCard.click(function() {
			nextCard.unbind('click');
			nextCard.prop('disabled',false);
			prevCard.prop('disabled',false);
			setFlashcards(cards,(current + 1));
		})
	}
}