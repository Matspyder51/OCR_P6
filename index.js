function OpenModal(from) {
	const modal = document.querySelector('.modal-container');

	modal.classList.add('visible');
}

function CloseModal() {
	const modal = document.querySelector('.modal-container');

	modal.classList.remove('visible');
}

function SlideRight(elem) {
	if (elem.classList.contains('disabled'))
		return;
	const parent = elem.parentElement;

	const nextToReveal = parent.querySelector('.movie ~ .movie.hide');
	const nextToHide = parent.querySelector('.movie:not(.hide)');

	nextToHide.classList.add('hide');
	nextToReveal.classList.remove('hide');


	if (parent.querySelector('.left').classList.contains('disabled'))
		parent.querySelector('.left').classList.remove('disabled')

	const movies = parent.querySelectorAll('.movie')
	if (!movies[movies.length - 1].classList.contains('hide'))
		elem.classList.add('disabled');
}

function SlideLeft(elem) {
	if (elem.classList.contains('disabled'))
		return;
	const parent = elem.parentElement;

	const hided = parent.querySelectorAll('.movie.hide')
	const nextToReveal = parent.querySelectorAll('.movie ~ .movie.hide').length > 0 ? hided[hided.length - 1] : hided[0];
	const visible = parent.querySelectorAll('.movie:not(.hide)');
	const nextToHide = visible[visible.length - 1];

	nextToHide.classList.add('hide');
	nextToReveal.classList.remove('hide');

	if (parent.querySelector('.right').classList.contains('disabled'))
		parent.querySelector('.right').classList.remove('disabled')

	// const movies = parent.querySelectorAll('.movie')
	// if (!movies[movies.length - 1].classList.contains('hide'))
	// 	elem.classList.add('disabled');
}

OpenModal()