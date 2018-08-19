
const query = "https://gist.githubusercontent.com/2hill/067958e529edd64926dd981b0a26aeb8/raw/0c62f691d8f805badaa322d60f7866b0f927bb6d/parc.json";

const parc = [];
fetch(query)
    .then(blob => blob.json())
    .then(data => parc.push(...data));

function findMatches(wordToMatch, parc) {
    return parc.filter(place => {
     // console.log(place.ville);
        const regex = new RegExp(wordToMatch, 'gi');
        return place.ville.match(regex) || place.raisonsociale.match(regex) || place.codepostal.match(regex)
    });
}
function displayMatches() {

    const matchArray = findMatches(this.value, parc);
    const html = matchArray.map(place => {
        const regex = new RegExp(this.value, 'gi');
        const cityName = place.ville.replace(regex, `<span class="hl">${this.value}</span>`);
        const parcName = place.raisonsociale.replace(regex, `<span class="hl">${this.value}</span>`);
        return `
        <li>
         <span class="name">${cityName}, ${parcName}</span>
         <span class="zipcode">${place.codepostal}</span>
        </li>`;
    }).join('');
    suggestions.innerHTML = html;
}
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);


/* MapBox */


mapboxgl.accessToken = 'pk.eyJ1IjoiMmhpbGwiLCJhIjoiY2psMTBndnMzMWFvdjNwbXAwcXhwYmRmOCJ9.QX7gxoc4nfQgU-sjBm1Zow';
let map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', // stylesheet location
    center: [5.44, 43.52], // starting position [lng, lat]
    zoom: 8 // starting zoom
});
