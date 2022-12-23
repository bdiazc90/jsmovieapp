// LocalStorage
let likeds = JSON.parse(localStorage.getItem("jsapp.likeds")) ?? [];
console.log(likeds);

const inputSearch = document.querySelector("#inputSearch");
const buttonSearch = document.querySelector("#buttonSearch");
const buttonLikeds = document.querySelector("#buttonLikeds");
const resultRow = document.querySelector("#resultRow");

// Para guardar las películas que vienen del API:
const localMovies = [];

// buttonSearch:
buttonSearch.onclick = function () {
	const textSearch = inputSearch.value;
	if (textSearch != "") {
		searchOMDB(textSearch);
		inputSearch.value = "";
	}
};

async function searchOMDB(term) {
	const apikey = "e50b7182"; // Usar si propia apikey 🙏
	resultRow.innerHTML = "";
	try {
		let page = 1;
		const results_by_page = 10;
		const max_page = 2;

		(async () => {
			while (page <= max_page) {
				const response = await fetch(
					"http://www.omdbapi.com/?s=" +
						term +
						"&apikey=" +
						apikey +
						"&page=" +
						page
				);
				const data = await response.json();
				if (!data || data === undefined) break;
				const totalResults = data.totalResults;
				if (totalResults === undefined || totalResults === 0) break;
				if (data.Search && data.Search.length) {
					const movies = data.Search;
					movies.forEach((movie) => {
						resultRow.innerHTML += generateCard(movie);
						localMovies.push(movie);
					});
				}
				if (totalResults > page * results_by_page) {
					page++;
				} else {
					break;
				}
			}
		})();
	} catch (error) {
		console.log(error);
	}
	console.log(localMovies);
}

function generateCard(movie) {
	let like = `<a href="javascript: addLike('${movie.imdbID}');" class="btn btn-primary">Like</a>`;
	if (likeds.length) {
		if (likeds.find((likedMovie) => likedMovie.imdbID === movie.imdbID)) {
			like = `
			<div class="d-flex justify-content-between align-items-center">
				<p class="text-primary m-0">Liked!</p>
				<a href="javascript: removeLike('${movie.imdbID}');" class="btn btn-outline-secondary">Dislike</a>
			</div>
			`;
		}
	}
	return `
    <div class="col-12 col-sm-6 col-md-4" id="${movie.imdbID}">
        <div class="card">
            <img src="${movie.Poster}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                ${like}
            </div>
        </div>
    </div>
    `;
}

function addLike(imdbID) {
	const tempmovie = localMovies.find((movie) => movie.imdbID === imdbID);
	if (tempmovie === undefined) {
		return alert("Pelicula no encontrada");
	}
	if (!likeds.find((movie) => movie.imdbID === imdbID)) {
		likeds.push(tempmovie);
		localStorage.setItem("jsapp.likeds", JSON.stringify(likeds));
	}
	const divparent = document.querySelector("#" + imdbID);
	divparent.querySelector("a").outerHTML = `
	<div class="d-flex justify-content-between align-items-center">
		<p class="text-primary m-0">Liked!</p>
		<a href="javascript: removeLike('${imdbID}');" class="btn btn-outline-secondary">Dislike</a>
	</div>
	`;
}

function removeLike(imdbID) {
	const newLikeds = likeds.filter(
		(likedMovie) => likedMovie.imdbID !== imdbID
	);
	likeds = newLikeds;
	localStorage.setItem("jsapp.likeds", JSON.stringify(likeds));
	const divparent = document.querySelector("#" + imdbID);
	divparent.querySelector(
		".d-flex"
	).outerHTML = `<a href="javascript: addLike('${imdbID}');" class="btn btn-primary">Like</a>`;
	const likedMoviesView = document.querySelector("#likedMoviesView");
	if (likedMoviesView) {
		resultRow.innerHTML = `<div id="likedMoviesView" class="col-12"><h3>Liked Movies</h3></div>`;
		if (likeds.length) {
			likeds.forEach((likedItem) => {
				resultRow.innerHTML += generateCard(likedItem);
			});
		}
	}
}

// buttonLikeds: Mostrar solamente las películas que tienen Like:
buttonLikeds.onclick = function () {
	resultRow.innerHTML = `<div id="likedMoviesView" class="col-12"><h3>Liked Movies</h3></div>`;
	if (likeds.length) {
		likeds.forEach((likedItem) => {
			resultRow.innerHTML += generateCard(likedItem);
		});
	}
};
