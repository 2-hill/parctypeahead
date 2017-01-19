
const query = "https://gist.githubusercontent.com/2hill/067958e529edd64926dd981b0a26aeb8/raw/0c62f691d8f805badaa322d60f7866b0f927bb6d/parc.json";

const parc = [];
fetch(query)
    .then(blob => blob.json())
    .then(data => parc.push(...data));

function findMatches(wordToMatch, parc) {
    return parc.filter(place => {
      console.log(place.ville);
        const regex = new RegExp(wordToMatch, 'gi');
        return place.ville.match(regex) || place.raisonsociale.match(regex) || place.codepostal.match(regex)
    });
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
         <span class="zipcode">${numberWithCommas(place.codepostal)}</span>
        </li>`;
    }).join('');
    suggestions.innerHTML = html;
}
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
