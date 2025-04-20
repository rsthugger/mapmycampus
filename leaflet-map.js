const map = L.map('map').setView([23.8809, 70.214], 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load boundary with opaque white
fetch('data/boundary.geojson').then(r => r.json()).then(data => {
    L.geoJSON(data, {
      style: {
        color: '#000000',
        weight: 2,
        fillColor: '#ffffff',
        fillOpacity: 1.0
      }
    }).addTo(map);
});

// Function to get random color for the buildings
function getRandomColor() {
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Load buildings with random color and name labels
let selectedDestination = null;

fetch('data/buildings.geojson').then(r => r.json()).then(data => {
    L.geoJSON(data, {
        style: feature => ({
            color: '#333',
            weight: 1,
            fillColor: getRandomColor(),
            fillOpacity: 0.6
        }),
        onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "Unnamed Building";
            const type = feature.properties?.Type || "Unknown";
            layer.bindPopup(`<strong>${name}</strong><br>Type: ${type}`);

            // Add permanent tooltip (label) for each building
            layer.bindTooltip(name, { permanent: false, direction: 'center' }); // Show name as a permanent label

            layer.on('click', () => {
                const coords = turf.center(feature).geometry.coordinates;
                alert("Destination set to: " + name);
                window.destination = coords;
            });
        }
    }).addTo(map);
});

// Load roads
let roadGeoJSON;
fetch('data/roads.geojson').then(r => r.json()).then(data => {
    roadGeoJSON = data;
    L.geoJSON(data, { color: '#777' }).addTo(map);
    window.roads = roadGeoJSON; // for routing.js
});

const customControl = L.control({ position: 'topright' }); // You can use 'topleft', 'topright', 'bottomleft', or 'bottomright'

customControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'custom-map-overlay');
    div.innerHTML = `
        <h1>IIRS Campus.</h1>
        <h3 style="font-weight: normal;">
            Zoom in and scan the Map Image to view 3D Model in AR.<br>
            Scroll Down and Click the button to view 3D model.
        </h3>
        <a href='3d_map.html' target='_blank'><button id="show3DMapBtn">Show 3D Map</button></a>
    `;
    return div;
};

customControl.addTo(map);


// User location
navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
    window.userLocation = [longitude, latitude]; // for routing
});
