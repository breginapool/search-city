const endpoint =
  'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'

const searchInput = document.querySelector('.search')
const suggestions = document.querySelector('.suggestions')

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)

displayAll()

//use fetch() method to get the data from the server
async function fetchData() {
  let url = endpoint
  try {
    let response = await fetch(url) //returns a promise, when request completes, the resource is available
    return await response.json() //handle the response (resource object)
  } catch (error) {
    console.log(error)
  }
}

//function that renders the data
async function displayAll() {
  let data = await fetchData()
  let html = ''
  data.map((place) => {
    let htmlSegment = `<li>
       <span>${place.city}, ${place.state}</span>
       <span>${numberWithCommas(place.population)}</span>
     </li>`

    html += htmlSegment
  })
  suggestions.innerHTML = html
}

async function findMatches(wordToMatch) {
  let regex = new RegExp(wordToMatch, 'gi')
  let data = await fetchData()
  return data.filter((place) => {
    return place.city.match(regex) || place.state.match(regex)
  })
}

//function that listens for keyup/change event, then invokes findMatches function to display matches
async function displayMatches() {
  let matchArray = await findMatches(this.value)
  let html = ''
  matchArray.map((place) => {
    let regex = new RegExp(this.value, 'gi')
    let cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`)
    let stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`)
    let htmlSegment = `
    <li>
    <span>${cityName}, ${stateName}</span>
    <span>${numberWithCommas(place.population)}</span>
    </li>`

    html += htmlSegment
  })
  suggestions.innerHTML = html
}

//function to create comma's in a number
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
