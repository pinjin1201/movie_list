
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

  // remove favorite movie
  function removeFromFavorite(id) {
    const movie = favoriteMovies.findIndex(movie => movie.id === id)
    favoriteMovies.splice(movie, 1)
    localStorage.setItem('favorite', `${JSON.stringify(favoriteMovies)}`)
    renderMovieList(cutMoviesByPage(1))
    renderPagination(favoriteMovies.length)
  }

  // show movie detail
  function showMovieDetail(id) {
    favoriteMovies.find(item => {
      if (id === item.id) {
        $movieModalTitle.text(item.title)
        $movieModalDate.html(`<i>Release date: ${item.release_date}</i>`)
        $movieModalDescription.text(item.description)
        $movieModalImage.html(`
          <img src="${POSTER_URL + item.image}" alt="movie-modal-poster">
        `)
      }
    })
  }

  // start favorite page
  renderMovieList(cutMoviesByPage(1))
  renderPagination(favoriteMovies.length)

  // show movie detail or remove to favorite
  $dataPanel.on('click', '.card button', function (event) {
    const $this = $(this)
    if (String($this.attr('id')) === 'more-btn') {
      showMovieDetail(Number(event.target.dataset.id))
    } else if (String($this.attr('id')) === 'remove-btn') {
      removeFromFavorite(Number(event.target.dataset.id))
    }
  })

  // search favorite movies
  $searchForm.on('submit', function (event) {
    event.preventDefault()
    const value = $searchInput.val()
    searchMovie = favoriteMovies.filter(movie => movie.title.toLowerCase().includes(value.trim().toLowerCase()))

    if (searchMovie.length === 0) {
      return alert(`無法找尋相關電影, ${value}`)
    }
    renderMovieList(cutMoviesByPage(1))
    renderPagination(searchMovie.length)
  })

  // render movies by pagination
  $pagination.on('click', 'li', function (event) {
    const number = event.target.dataset.id
    if (number) {
      renderMovieList(cutMoviesByPage(number))
    }
  })
})