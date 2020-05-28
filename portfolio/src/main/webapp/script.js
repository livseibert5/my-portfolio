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

  // Pick a random greeting.
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Add it to the page.
  const page = document.getElementsByTagName('BODY')[0];
  page.style.backgroundColor = color;
}

document.addEventListener("DOMContentLoaded", ready);
function ready() {

    function toggleHidden(photo) {
        let children = photo.children;
        let pic = children[0];
        let caption = children[1];
        if (pic.classList.contains("hidden")) {
            flip(caption, pic);
        } else {
            flip(pic, caption);
        }
    }

    function flip(hide, show) {
        hide.className = hide.className.replace("", "hidden");
        show.className = show.className.replace("hidden", "");
    }

    let photos = document.getElementsByClassName("pic");
    for (let i=0; i<photos.length; i++) {
        photos[i].addEventListener("mouseenter", function() {
            toggleHidden(photos[i]);
        });
        photos[i].addEventListener("mouseleave", function() {
            toggleHidden(photos[i]);
        });
    }

}
