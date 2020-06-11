// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

document.addEventListener("DOMContentLoaded", initMap);

let editMarker;
let map;

/**
 * Defines map styling, pre-determined markers, and the info text for those
 * markers. Then, it creates the map and puts the markers on it, each
 * with an onclick event listener to display the info text. Lastly,
 * it fetches the markers that the user inputs.
 */
function initMap() {
  const styledMapType = new google.maps.StyledMapType(
      [
        {"elementType": "geometry", "stylers": [{"color": "#ebe3cd"}]},
        {"elementType": "labels.text.fill", "stylers": [{"color": "#523735"}]},
        {"elementType": "labels.text.stroke", "stylers": [{"color": "#f5f1e6" }]},
        {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#c9b2a6"}]},
        {"featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [{"color": "#dcd2be"}]},
        {"featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{"color": "#ae9e90"}]},
        {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"color": "#dfd2ae"}]},
        {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#dfd2ae"}]},
        {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#93817c"}]},
        {"featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"color": "#a5b076"}]},
        {"featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{"color": "#447530"}]},
        {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#f5f1e6"}]},
        {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#fdfcf8"}]},
        {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#f8c967"}]},
        {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#e9bc62"}]},
        {"featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{"color": "#e98d58"}]},
        {"featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{"color": "#db8555"}]},
        {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#806b63"}]},
        {"featureType": "transit.line", "elementType": "geometry", "stylers": [{"color": "#dfd2ae"}]},
        {"featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{"color": "#8f7d77"}]},
        {"featureType": "transit.line", "elementType": "labels.text.stroke", "stylers": [{"color": "#ebe3cd"}]},
        {"featureType": "transit.station", "elementType": "geometry", "stylers": [{"color": "#dfd2ae"}]},
        {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#b9d3c2"}]},
        {"featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#92998d"}]}]);
  
  const heavBuffs = {lat:36.009670, lng: -78.920311};
  const chapel = {lat: 36.000591, lng: -78.937494};
  const cameron = {lat: 35.997201, lng: -78.944451};

  const heavBuffsInfo = '<h3 id="firstHeading" class="firstHeading">Heavenly Buffaloes</h3>'+
    '<p>Heavenly Buffaloes, home of my favorite food, ' +
    'vegan thai chili wings.';
  const chapelInfo = '<h3 id="firstHeading" class="firstHeading">Duke Chapel</h3>'+
    '<p>Duke Chapel, Duke\'s prettiest on campus location.';
  const cameronInfo = '<h3 id="firstHeading" class="firstHeading">Cameon Indoor</h3>'+
    '<p>Cameron Indoor Stadium, the best place on earth to watch college basketball.';

  map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 36.0, lng: -78.94},
                zoom: 13,
                mapTypeControlOptions: {
                  mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
                }
              });
  
  const markers = [
    [heavBuffs, 'Heavenly Buffaloes', heavBuffsInfo],
    [chapel, 'Duke Chapel', chapelInfo],
    [cameron, 'Cameron Indoor Stadium', cameronInfo]
  ];

  const infoWindow = new google.maps.InfoWindow();

  markers.forEach((marker) => {
    const mark = new google.maps.Marker({position: marker[0], map: map, title: marker[1]});
    google.maps.event.addListener(mark, 'click', function(){
        infoWindow.close();
        infoWindow.setContent(`<div id="infowindow">${marker[2]}</div>`);
        infoWindow.open(map, mark);
    });
  });

  fetch('/auth').then(response => response.json()).then((user) => {
    if (user.loginStatus === "true") {
      document.getElementById("add-marker").classList.remove("hidden");
      map.addListener('click', (event) => {
        createMarkerForEdit(event.latLng.lat(), event.latLng.lng());
      });
      console.log("running");
      fetchMarkers();
    } else {
      document.getElementById("add-marker").classList.add("hidden");
    }
  }).catch(() => {
      console.error("Bad JSON");
  });

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
}

/** Fetches markers from the backend and adds them to the map. */
function fetchMarkers() {
  fetch('/markers').then(response => response.json()).then((markers) => {
    if (markers.length != 0) {
      markers.forEach((marker) => {
        console.log("making markers");
        createMarkerForDisplay(marker.latitude, marker.longitude, marker.content);
      });
    }
  }).catch(() => {
      console.error("Bad Marker data.");
  });
}

/** Creates a marker that shows a read-only info window when clicked. */
function createMarkerForDisplay(latitude, longitude, content) {
  const marker =
      new google.maps.Marker({position: {lat: latitude, lng: longitude}, map: map});
  console.log("displaying marker");
  const infoWindow = new google.maps.InfoWindow({content: content});
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

/** Sends a marker to the backend for saving. */
function postMarker(latitude, longitude, content) {
  const params = new URLSearchParams();
  params.append('latitude', latitude);
  params.append('longitude', longitude);
  params.append('content', content);

  fetch('/markers', {method: 'POST', body: params});
}

/** Creates a marker that shows a textbox the user can edit. */
function createMarkerForEdit(latitude, longitude) {
  // If we're already showing an editable marker, then remove it.
  if (editMarker) {
    editMarker.setMap(null);
  }

  editMarker =
      new google.maps.Marker({position: {lat: latitude, lng: longitude}, map: map});

  const infoWindow =
      new google.maps.InfoWindow({content: buildInfoWindowInput(latitude, longitude)});

  // When the user closes the editable info window, remove the marker.
  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    editMarker.setMap(null);
  });

  infoWindow.open(map, editMarker);
}

/**
 * Builds and returns HTML elements that show an editable textbox and a submit
 * button.
 */
function buildInfoWindowInput(latitude, longitude) {
  const textBox = document.createElement('textarea');
  const button = document.createElement('button');
  button.appendChild(document.createTextNode('Submit'));

  button.onclick = () => {
    postMarker(latitude, longitude, textBox.value);
    createMarkerForDisplay(latitude, longitude, textBox.value);
    editMarker.setMap(null);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(button);

  return containerDiv;
}
