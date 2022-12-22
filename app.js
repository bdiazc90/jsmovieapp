// LocalStorage
const favorites = JSON.parse(localStorage.getItem("jsapp.favorites")) ?? [];
console.log(favorites);

const inputSearch = document.querySelector("#inputSearch");
const buttonSearch = document.querySelector("#buttonSearch");
const resultRow = document.querySelector("#resultRow");

// buttonSearch:
buttonSearch.onclick = function () {
	const textSearch = inputSearch.value;
	if (textSearch != "") {
		searchOMDB(textSearch);
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
}

function generateCard(movie) {
	let like = `<a href="javascript: addLike('${movie.imdbID}');" class="btn btn-primary">Like</a>`;
	if (favorites.length) {
		if (favorites.find((fav) => fav === movie.imdbID)) {
			like = `<p class="text-primary">Liked!</p>`;
		}
	}
	return `
    <div class="col-12 col-sm-6 col-md-4">
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
	favorites.push(imdbID);
	localStorage.setItem("jsapp.favorites", JSON.stringify(favorites));
}
