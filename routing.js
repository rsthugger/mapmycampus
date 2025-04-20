import * as turf from 'https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/+esm';

function waitForData(fn) {
  if (window.userLocation && window.destination && window.roads && window.map) {
    fn();
  } else {
    setTimeout(() => waitForData(fn), 500);
  }
}

waitForData(() => {
  const pt1 = turf.point(window.userLocation);
  const pt2 = turf.point(window.destination);

  const lines = window.roads.features;

  // Find the nearest LineString manually
  let nearestLine = null;
  let minDist = Infinity;

  for (const line of lines) {
    if (line.geometry.type !== 'LineString') continue;

    const snap = turf.nearestPointOnLine(line, pt1);
    const dist = snap.properties.dist;

    if (dist < minDist) {
      minDist = dist;
      nearestLine = line;
    }
  }

  if (!nearestLine) {
    console.error("No valid nearest line found.");
    return;
  }

  // Create route by slicing along the nearest road line
  const route = turf.lineSlice(pt1, pt2, nearestLine);

  // Show on map
  L.geoJSON(route, { color: 'blue', weight: 4 }).addTo(window.map);

  window.routeCoords = turf.getCoords(route);
});
