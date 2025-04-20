import './leaflet-map.js';
import './routing.js';
import { startAR } from './ar.js';

document.getElementById('arBtn').addEventListener('click', () => {
  startAR(); // Calls AR start from ar.js
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  