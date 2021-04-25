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

// OpenModal()

async function GetMoviesOfCategory(name, amount = 7, sorted_by = "&sort_by=-votes,-imdb_score") {
	const results = await fetch(`http://localhost:8000/api/v1/titles/?genre=${name}${sorted_by}`);

	if (!results.ok)
		return

	const data = await results.json();
	let result = Array(...data.results);

	if (result.length < amount) {
		const results2 = await (await fetch(data.next)).json();

		result.push(...Array(...results2.results).slice(0, amount - result.length));
	}

	return result;
}

async function GetMovieInfos(id) {
	const results = await fetch(`http://localhost:8000/api/v1/titles/${id}`);

	if (!results.ok)
		return;

	const result = await results.json();

	return result;
}

async function AddCarousel(label, name) {
	console.log("Add")
	const movies = await GetMoviesOfCategory(name);
	const carousel = document.createElement('div');
	carousel.classList.add('carousel');

	const title = document.createElement('div');
	title.classList.add('title');
	title.textContent = label;
	carousel.append(title);

	const movies_container = document.createElement('div');
	movies_container.classList.add('movies');

	const left_arrow = document.createElement('div');
	left_arrow.classList.add('left');
	left_arrow.setAttribute('onclick', 'SlideLeft(this)');
	left_arrow.innerHTML = "<i class=\"fas fa-chevron-left\"></i>";

	movies_container.appendChild(left_arrow);

	let i = 0;
	for (const movie of movies) {
		console.log(movie)
		const div_movie = document.createElement('div');
		div_movie.classList.add('movie');
		if (i > 4)
			div_movie.classList.add('hide');
		div_movie.setAttribute('onclick', 'OpenModal(this)');

		const title = document.createElement('div');
		title.classList.add('title');
		title.textContent = movie.title;
		div_movie.appendChild(title);

		const image = document.createElement('img');
		image.src = movie.image_url;
		div_movie.appendChild(image);

		movies_container.appendChild(div_movie);
		
		i++;
	}

	const right_arrow = document.createElement('div');
	right_arrow.classList.add('right');
	right_arrow.setAttribute('onclick', 'SlideRight(this)');
	right_arrow.innerHTML = "<i class=\"fas fa-chevron-right\"></i>";

	movies_container.appendChild(right_arrow);

	carousel.appendChild(movies_container);

	document.querySelector('.container').appendChild(carousel);
}

window.addEventListener('load', (ev) => {
	AddCarousel("Films les mieux notés", "")
});