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

document.addEventListener("DOMContentLoaded", userAuth);

function userAuth() {
  const request = new Request('/auth');
  fetch(request).then(response => response.json()).then((user) => {
    const welcomeBox = document.getElementById('welcome');
    document.getElementById("log").href = user.urlDisplay;

    if (user.loginStatus === "false") {
      welcomeBox.innerText = "Hello user!";
      document.getElementById("log").innerText = "Login";
      document.getElementById("comments-area").classList.add("hidden");
      sessionStorage.setItem("log", "loggedOut");
    } else {
      welcomeBox.innerText = "Hello " + user.userEmail + "!";
      document.getElementById("log").innerText = "Logout";
      document.getElementById("comments-area").classList.remove("hidden");
      sessionStorage.setItem("log", "loggedIn");
      
      setCommentLim()
    }
  });
}

function setCommentLim() {
  try {
    let lim = parseInt(sessionStorage.getItem("commentLim"));
    getComments(lim);
  } catch {
    console.error("Can't read commentLim param from storage.");
    getComments(3);
  }
}

/** 
 * Gets json data for comments from the server and
 * displays them on the front end.
 * @param {value} number of comments to be displayed
 */
function getComments(value) {
  sessionStorage.setItem("commentLim", value.toString());
  const url = `/data?commentLimit=${value}`;
  fetch(url).then((response) => response.json()).then((comments) => {
    const commentsListElement = document.getElementById('comments-section');
    if (comments.length == 0) {
      commentsListElement.innerHTML = 'Nothing to show.';
    } else {
      commentsListElement.innerHTML = '';
      comments.forEach((comment) => {
        const email = comment.email;
        const text = comment.text;
        const element = createCommentElement(email, text);
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
function createCommentElement(email, text) {
  const commentTemplate = document.getElementById('comment-template');
  const commentElement = commentTemplate.content.cloneNode(true);

  commentElement.querySelector(".email").innerText = email;
  commentElement.querySelector(".text").innerText = text;

  return commentElement;
}
