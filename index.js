let modal = {
	image: document.querySelector('.modal .image img'),
	title: document.querySelector('.modal .base_infos .title'),
	rated: document.querySelector('.modal .base_infos .rated span'),
	imdb: document.querySelector('.modal .base_infos .imdb span'),
	release_date: document.querySelector('.modal .base_infos .release_date span'),
	types: document.querySelector('.modal .base_infos .types span'),
	realisator: document.querySelector('.modal .base_infos .realisator span'),
	actors: document.querySelector('.modal .base_infos .actors span'),
	duration: document.querySelector('.modal .base_infos .duration span span'),
	countries: document.querySelector('.modal .base_infos .countries span'),
	description: document.querySelector('.modal .description'),
}

async function OpenModal(from) {
	const _modal = document.querySelector('.modal-container');

	const movie_id = from.getAttribute('movie_id');

	movie_data = await GetMovieInfos(movie_id);

	modal.image.src = movie_data.image_url;
	modal.title.textContent = movie_data.title;
	modal.imdb.textContent = movie_data.imdb_score;
	modal.release_date.textContent = movie_data.date_published;
	modal.duration.textContent = movie_data.duration;
	modal.description.textContent = movie_data.long_description;

	modal.countries.textContent = movie_data.countries.join(', ');
	modal.actors.textContent = movie_data.actors.join(', ');
	modal.types.textContent = movie_data.genres.join(', ');
	modal.realisator.textContent = movie_data.directors.join(', ');

	const amountOfStars = Number(movie_data.rated) / 2;
	let ratedContent = '';
	for (let i = 0; i < amountOfStars - 1; i++)
		ratedContent += '<i class="fas fa-star"></i>';
	for (let i = 10 - amountOfStars + 1; i > 0; i--)
		ratedContent += '<i class="far fa-star"></i>';
	modal.rated.innerHTML = ratedContent;

	_modal.classList.add('visible');
}

function CloseModal() {
	const modal = document.querySelector('.modal-container');

	modal.classList.remove('visible');
}

function SlideRight(elem) {
	let state = Number(elem.parentElement.getAttribute('state'));
	if (state == NaN)
		state = 0;
	if (state >= 2)
		return;
	
	elem.parentElement.querySelectorAll('.movie.hide')[state].classList.remove('hide');
	elem.parentElement.querySelectorAll('.movie')[state].classList.add('hide');
	state++;
	elem.parentElement.setAttribute('state', state);

	if (elem.parentElement.querySelector('.left').classList.contains('disabled'))
		elem.parentElement.querySelector('.left').classList.remove('disabled')

	if (state >= 2)
		elem.classList.add('disabled');
}

function SlideLeft(elem) {
	let state = Number(elem.parentElement.getAttribute('state'));
	if (state == NaN)
		state = 0;
	if (state <= 0)
		return;
	
	elem.parentElement.querySelectorAll('.movie')[state + 4].classList.add('hide');
	elem.parentElement.querySelectorAll('.movie.hide')[state - 1].classList.remove('hide');
	state--;
	elem.parentElement.setAttribute('state', state);

	if (elem.parentElement.querySelector('.right').classList.contains('disabled'))
		elem.parentElement.querySelector('.right').classList.remove('disabled')

	if (state <= 0)
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
		div_movie.setAttribute('movie_id', movie.id);

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
		document.querySelector('.main_movie .movie_infos .play_btn').setAttribute('movie_id', movie.id);
		document.querySelector('.main_movie .description').textContent = movie_data.long_description;
		document.querySelector('.main_movie img').src = movie.image_url;
	});
});