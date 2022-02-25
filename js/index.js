
'use strict'

$(function() {

  const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
  const DATA_URL = `${BASE_URL}movies/`                           // :id
  const POSTER_URL = `https://movie-list.alphacamp.io/posters/`  // :image

  const $toggleStyle = $('#toggle')
  const $movieStyle = $('#movie-style')
  const $movieModalImage = $('#movie-modal-image')
  const $movieModalTitle = $('#movie-modal-title')
  const $movieModalDate = $('#movie-modal-date')
  const $movieModalDescription = $('#movie-modal-description')
  const $searchForm = $('#search-form')
  const $searchInput = $('#search-input')
  const $pagination = $('#pagination')

  let movies = []
  let searchMovie = []
  let status = 'card'
  const PRE_PAGE = 12

  // filter search movies or all movies to render, and its pagination
  function filterMovies(style) {
    const filterMovie = searchMovie.length > 0 ? searchMovie : movies
    renderMovies(cutMoviesByPage(1), style)
    renderPagination(filterMovie.length, style)
  }

  // toggle card style
  function toggleCardStyle() {
    status = 'card'
    $movieStyle.html(`<div class="row" id="data-panel-card"></div>`)
    $searchForm.attr('data-search', 'card')
    filterMovies(status)
  }

  // toggle list style
  function toggleListStyle() {
    status = 'list'
    $movieStyle.html(`<ul class="list-group" id="data-panel-list"></ul>`)
    $searchForm.attr('data-search', 'list')
    filterMovies(status)
  }

  // cut movies by page number
  function cutMoviesByPage(item) {
    const startIndex = (item - 1) * PRE_PAGE
    const lastIndex = item * PRE_PAGE
    let cutMovies = searchMovie.length > 0 ? searchMovie : movies
    return cutMovies = cutMovies.slice(startIndex, lastIndex)
  }

  // render movies to HTML: card or list
  function renderMovies(data, style) {
    const $dataPanelCard = $('#data-panel-card')
    const $dataPanelList = $('#data-panel-list')
    let content = ``

    if (style === 'card') {
      data.forEach(item => {
        content += `
          <div class="col-sm-3">
          <div class="card movie-item">
            <img class="card-img-top" src="${POSTER_URL + item.image}" alt="movie-poster">
            <div class="card-body">
              <h5 class="card-title mb-4" id="movie-title">${item.title}</h5>
              <button type="button" id="more-btn" class="btn btn-primary" data-id="${item.id}" data-toggle="modal" data-target="#movie-modal">
                More
              </button>
              <button type="button" class="btn btn-info" id="favorite-btn" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
        `
      })
      $dataPanelCard.html(content)

    } else if (style === 'list') {
      data.forEach(item => {
        content += `
          <li class="list-group-item list-group-item-action border-left-0 border-right-0 rounded-0 h5 font-weight-normal pt-3 pb-3 movie-item">
            <div class="row">
              <div class="col-sm-9 pt-2 mb-2">
                ${item.title}
              </div>
              <div class="col-sm-3 text-right">
                <button type="button" id="more-btn" class="btn btn-primary mr-2" data-id="${item.id}" data-toggle="modal" data-target="#movie-modal">
                  More
                </button>
                <button type="button" class="btn btn-info" id="favorite-btn" data-id="${item.id}">+</button>
              </div>
            </div>
          </li>
        `
      })
      $dataPanelList.html(content)
    }
  }

  // render pagination to HTML: card or list
  function renderPagination(amount, style) {
    const MOVIE_PAGE_AMOUNT = Math.ceil(amount / PRE_PAGE)
    let page = ``
    if (style === 'card') {
      for (let i = 1; i <= MOVIE_PAGE_AMOUNT; i++) {
        page += `
        <li class="page-item"><a class="page-link" href="#" data-style="card-style" data-id="${[i]}">${[i]}</a></li>
      `
      }
    } else if (style === 'list') {
      for (let i = 1; i <= MOVIE_PAGE_AMOUNT; i++) {
        page += `
        <li class="page-item"><a class="page-link" href="#" data-style="list-style" data-id="${[i]}">${[i]}</a></li>
      `
      }
    }
    $pagination.html(page)
  }

  // show movie detail
  function showMovieDetail(id) {
    movies.find(item => {
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

  // add movie to favorite page
  function addToFavorite(id) {
    const favoriteMovie = JSON.parse(localStorage.getItem('favorite')) || []
    const movie = movies.find(movie => movie.id === id)
    if (favoriteMovie.some(movie => movie.id === id)) {
      return alert(`${movie.title} 已經在收藏清單中!`)
    }
    favoriteMovie.push(movie)
    localStorage.setItem('favorite', `${JSON.stringify(favoriteMovie)}`)
  }

  
  // get API data: Array(80) movies list, and render to HTML
  axios.get(DATA_URL)
    .then((response) => {
      status = 'card'
      movies.push(...response.data.results)
      toggleCardStyle()
    })
  .catch((error) => console.log(error))
  
  // toggle movies style: card or list
  $toggleStyle.on('click', 'div', function (event) {
    const $this = $(this)
    if ($this.attr('id') === 'toggle-card') {
      toggleCardStyle()
    } else if ($this.attr('id') === 'toggle-list') {
      toggleListStyle()
    }
  })

  // show movie detail or add to favorite
  $movieStyle.on('click', '.movie-item button', function (event) {
    const $this = $(this)
    if (String($this.attr('id')) === 'more-btn') {
      showMovieDetail(Number(event.target.dataset.id))
    } else if (String($this.attr('id')) === 'favorite-btn') {
      addToFavorite(Number(event.target.dataset.id))
    }
  })

  // render search movies on card or list style
  $searchForm.on('submit', function (event) {
    event.preventDefault()
    const value = $searchInput.val()
    searchMovie = movies.filter(movie => movie.title.toLowerCase().includes(value.trim().toLowerCase()))

    if (searchMovie.length === 0) {
      return alert(`無法找尋相關電影, ${value}`)
    }
    if (event.target.dataset.search === 'card') {
      status = 'card'
      renderMovies(cutMoviesByPage(1), status)
      renderPagination(searchMovie.length, status)
    } else if (event.target.dataset.search === 'list') {
      status = 'list'
      renderMovies(cutMoviesByPage(1), status)
      renderPagination(searchMovie.length, status)
    }

  })

  // render movies by pagination 
  $pagination.on('click', 'a', function (event) {
    const style = event.target.dataset.style
    const number = event.target.dataset.id
    if (style === 'card-style') {
      status = 'card'
      renderMovies(cutMoviesByPage(number), status)
    } else if (style === 'list-style') {
      status = 'list'
      renderMovies(cutMoviesByPage(number), status)
    }
  })

})