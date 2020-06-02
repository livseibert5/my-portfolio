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

function getContent() {
  const responsePromise = fetch('/data');
  responsePromise.then(handleResponse);
}

function handleResponse(response) {
  const textPromise = response.text();
  textPromise.then(addMessageToDom);
}

function addMessageToDom(message) {
  const messageContainer = document.getElementById('content-container');
  messageContainer.innerText = message;
}

document.addEventListener('DOMContentLoaded', getComments);

function getComments() {
  fetch('/data').then(response => response.json()).then((comments) => {
    const commentsListElement = document.getElementById('comments-section');
    commentsListElement.innerHTML = '';
    comments.map(createCommentElement).forEach(element => commentsListElement.appendChild(element));
  });

  fetch('/data').then(response => response.json()).catch((error) => {
    console.log("error");
  });
}

/**
 * Takes text of a comment and puts it in a
 * list element to be displayed.
 * @param {text} content of user comment
 * @return {liElement} list element to hold comment
 */
function createCommentElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}
