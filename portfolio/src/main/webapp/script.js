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

/**
 * Changes background color of page randomly.
 */
function addRandomColor() {
  const colors =
      ['lavender', 'aliceblue', 'lavenderblush', 'peachpuff', 'cornsilk', 'seashell', 'whitesmoke', 'honeydew'];

  // Pick a random color.
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Add it to the page.
  document.body.style.backgroundColor = color;
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    let lim = parseInt(sessionStorage.getItem("commentLim"));
    getComments(lim);
  } catch {
    console.error("Can't read commentLim parameter from storage.");
    getComments(3);
  }
});

/** 
 * Gets json data for comments from the server and
 * displays them on the front end.
 * @param {value} number of comments to be displayed
 */
function getComments(value) {
  sessionStorage.clear();
  sessionStorage.setItem("commentLim", value.toString());
  const url = `/data?commentLimit=${value}`;
  fetch(url).then((response) => response.json()).then((comments) => {
    const commentsListElement = document.getElementById('comments-section');
    if (comments.length == 0) {
      commentsListElement.innerHTML = 'Nothing to show.';
    } else {
      commentsListElement.innerHTML = '';
      comments.forEach((comment) => {
        const name = comment.name;
        const text = comment.text;
        const element = createCommentElement(name, text);
        commentsListElement.appendChild(element);
      })
    }
    }).catch(() => {
      console.error("JSON from servlet is bad or is being handled wrong on fetch.");
  });
}

function deleteComments() {
  if (window.confirm("Are you sure you want to delete all comments?")) {
    const request = new Request('/data', {method:'delete'});
    fetch(request).then(() => getComments(3));
  }
}

/**
 * Takes text and name of a comment and puts
 * it in a list element to be displayed.
 * @param {name} name of user commenting
 * @param {text} text of comment
 * @return {commentElement} list element to hold comment
 */
function createCommentElement(name, text) {
  const commentTemplate = document.getElementById('comment-template');
  const commentElement = commentTemplate.content.cloneNode(true);

  commentElement.querySelector(".name").innerText = name;
  commentElement.querySelector(".text").innerText = text;

  return commentElement;
}

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
  const shooters = {lat: 36.001049, lng: -78.909508};
  const devines = {lat: 36.000480, lng: 36.000480};
  const chapel = {lat: 36.000591, lng: -78.937494};
  const local = {lat: 36.007231, lng: -78.92685};
  const cameron = {lat: 35.997201, lng: -78.944451};

  const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 36.0, lng: -78.94},
                zoom: 13,
                mapTypeControlOptions: {
                  mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
                }
              });
  
  const markers = [
    [heavBuffs, 'Heavenly Buffaloes'],
    [shooters, 'Shooters Saloon'],
    [devines, 'Devines'],
    [chapel, 'Duke Chapel'],
    [local, 'Local 22 Restaurant'],
    [cameron, 'Cameron Indoor Stadium']
  ];

  markers.forEach((marker) => {
    const mark = new google.maps.Marker({position: marker[0], map: map, title: marker[1]});
  })

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
}
