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

	const test = parent.querySelector('.movie.hide ~ .movie') != null;
	const nextToReveal = test ? parent.querySelector('.movie.hide + .movie.hide') : parent.querySelectorAll('.movie.hide')[parent.querySelectorAll('.movie.hide').length - 1];
	const visible = parent.querySelectorAll('.movie:not(.hide)');
	const nextToHide = visible[visible.length - 1];

	nextToHide.classList.add('hide');
	nextToReveal.classList.remove('hide');

	if (parent.querySelector('.right').classList.contains('disabled'))
		parent.querySelector('.right').classList.remove('disabled')

	const movies = parent.querySelectorAll('.movie')
	if (!movies[0].classList.contains('hide'))
		elem.classList.add('disabled');
}

async function GetMoviesOfCategory(name, amount = 7, skip = 0, sorted_by = "&sort_by=-votes,-imdb_score") {
	const results = await fetch(`http://localhost:8000/api/v1/titles/?genre=${name}${sorted_by}`);

	if (!results.ok)
		return

	const data = await results.json();
	let result = Array(...data.results);

	if (skip > 0)
		result.splice(0, skip);

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

async function GetBestMovie() {
	return new Promise(async (resolve, reject) => {
		const results = await fetch('http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score');

		const movies = await results.json();

		resolve(movies.results[0]);
	});
}

async function AddCarousel(label, name, skipping = 0) {
	const carousel = document.createElement('div');
	carousel.classList.add('carousel');

	const title = document.createElement('div');
	title.classList.add('title');
	title.textContent = label;
	carousel.append(title);

	const movies_container = document.createElement('div');
	movies_container.classList.add('movies');

	const left_arrow = document.createElement('div');
	left_arrow.classList.add('left', 'disabled');
	left_arrow.setAttribute('onclick', 'SlideLeft(this)');
	left_arrow.innerHTML = "<i class=\"fas fa-chevron-left\"></i>";

	movies_container.appendChild(left_arrow);

	document.querySelector('.container').appendChild(carousel);

	const movies = await GetMoviesOfCategory(name, 7, skipping);

	let i = 0;
	for (const movie of movies) {
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
}

window.addEventListener('load', (ev) => {
	AddCarousel("Films les mieux notés", "", 1);
	AddCarousel("Action", "action");
	AddCarousel("Sci-Fi", "Sci-Fi");
	AddCarousel("Animation", "animation");

	GetBestMovie().then(async (movie) => {
		const movie_data = await GetMovieInfos(movie.id);
		// console.log(movie_data);
		document.querySelector('.main_movie .movie_infos h2').textContent = movie.title;
		document.querySelector('.main_movie .description').textContent = movie_data.long_description;
		document.querySelector('.main_movie img').src = movie.image_url;
	});
});