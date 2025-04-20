export function startAR() {
    if (navigator.xr) {
      navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local-floor'] })
        .then((session) => {
          alert("AR session started!"); // Later: load Three.js and place markers
          console.log("Route coordinates:", window.routeCoords);
        })
        .catch((err) => {
          alert("WebXR failed.");
          console.error(err);
        });
    } else {
      alert("WebXR not supported on this browser.");
    }
  }
  