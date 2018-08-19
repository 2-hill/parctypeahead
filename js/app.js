
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

map.on('load', function () {
    // Add a new source from our GeoJSON data and set the
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource("parcs", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ parcsquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' earthquake hazards program.
        data: "../data/parc.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "parcs",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                750,
                "#f28cb1"
            ],
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "parcs",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        }
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "parcs",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('parcs').getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err)
                return;

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});
