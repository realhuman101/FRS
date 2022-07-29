$(document).ready(function () {
	$('button').click(function() {
		if (['session','cards','flashcards'].includes(this.id)) {
			location.href = `../${this.id}/index.html`;
		}
	})
})