const map = L.map('map').setView([30.34, 70.04], 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load boundary with opaque white and restrict map view to it
fetch('data/boundary.geojson').then(r => r.json()).then(data => {
    const boundaryLayer = L.geoJSON(data, {
        style: {
            color: '#000000',
            weight: 2,
            fillColor: '#ffffff',
            fillOpacity: 1.0
        }
    }).addTo(map);

    // Fit map to boundary and set max bounds to clip map view
    const bounds = boundaryLayer.getBounds();
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = 1.0; // Prevent dragging outside
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

            // Add tooltip (label) for each building
            layer.bindTooltip(name, { permanent: false, direction: 'center' });

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

// Add static overlay info box and button to launch 3D map
const customControl = L.control({ position: 'topright' });

customControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'custom-map-overlay');
    div.innerHTML = `
        <h1 style="margin: 0 0 5px 0;">IIRS Campus</h1>
        <h3 style="font-weight: normal; margin: 0 0 10px 0;">
            Zoom in and scan the map image to view 3D Model in AR.<br>
            Click below to open the 3D model.
        </h3>
        <a href='3d_map.html' target='_blank' style="padding: 6px 10px; background: #3367D6; color: white; text-decoration: none; border-radius: 4px;">Show 3D Map</a>
    `;
    return div;
};

customControl.addTo(map);

// Get user's current location
navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
    window.userLocation = [longitude, latitude]; // for routing
});
