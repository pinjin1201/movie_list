
'use strict'

$(function() {

  const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
  const POSTER_URL = `https://movie-list.alphacamp.io/posters/`  //:image
  const $dataPanel = $('#data-panel')
  const $movieModalImage = $('#movie-modal-image')
  const $movieModalTitle = $('#movie-modal-title')
  const $movieModalDate = $('#movie-modal-date')
  const $movieModalDescription = $('#movie-modal-description')
  const $searchForm = $('#search-form')
  const $searchInput = $('#search-input')
  const $pagination = $('#pagination')

  let favoriteMovies = JSON.parse(localStorage.getItem('favorite')) || []
  let searchMovie = []
  const PRE_PAGE = 12

  // render movie list
  function renderMovieList(data) {
    let content = ``
    data.forEach(item => {
      content += `
          <div class="col-sm-3">
          <div class="card">
            <img class="card-img-top" src="${POSTER_URL + item.image}" alt="movie-poster">
            <div class="card-body">
              <h5 class="card-title mb-4" id="movie-title">${item.title}</h5>
              <button type="button" id="more-btn" class="btn btn-primary" data-id="${item.id}" data-toggle="modal" data-target="#movie-modal">
                More
              </button>
              <button type="button" class="btn btn-danger" id="remove-btn" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </div>
        `
    })
    $dataPanel.html(content)
  }

  // render pagination
  function renderPagination(amount) {
    const MOVIE_PAGE_AMOUNT = Math.ceil(amount / PRE_PAGE)
    let page = ``
    for (let i = 1; i <= MOVIE_PAGE_AMOUNT; i++) {
      page += `
        <li class="page-item"><a class="page-link" href="#" data-id="${[i]}">${[i]}</a></li>
      `
    }
    $pagination.html(page)
  }

  // cut movies by page number
  function cutMoviesByPage(item) {
    const startIndex = (item - 1) * PRE_PAGE
    const lastIndex = item * PRE_PAGE
    let cutMovies = searchMovie.length > 0 ? searchMovie : favoriteMovies
    return cutMovies = cutMovies.slice(startIndex, lastIndex)
  }
  
  // start favorite page
  renderMovieList(cutMoviesByPage(1))
  renderPagination(favoriteMovies.length)


})