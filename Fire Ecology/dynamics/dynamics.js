// Loading Recent disasters of fire
function project_content_load() {
  fetch("../data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let content = document.getElementById("content_div");
      content.innerHTML = "";
      let nav = document.getElementById("navigation_ul");
      nav.innerHTML = "";

      for (let i = 0; i < data.project_content_data.length; i++) {
        content.innerHTML += `
        <br id="${i}">
        <hr>
        <h3 class="headings" >${i + 1}. ${
          data.project_content_data[i].heading
        }</h3>
        <div class="sub_content">
        <div class="imgBx">
          <img src="../${data.project_content_data[i].img_url}" width="630px" height="350px" alt="${
          data.project_content_data[i].heading
        }">
        </div>
        <div>
          <p>${data.project_content_data[i].content}</p>
        </div>
        </div>
        `;
        nav.innerHTML += `<li><a href="#${i}" onclick="toggleMenu();">${data.project_content_data[i].heading}</a></li>`;
      }
    });
}

// Let all_content = document.querySelector('.here');
let toggle = document.querySelector(".toggle");
let topbar = document.querySelector(".topbar");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
let themeSwitch = document.querySelector(".themeSwitch");
let body = document.querySelector("body");

// Toggling Active for navigation button Clicks
toggle.onclick = function () {
  toggle.classList.toggle("active");
  topbar.classList.toggle("active");
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

//Let's Switch the Button
themeSwitch.onclick = function () {
  body.classList.toggle("dark");
};

//Fixing Menu
function toggleMenu() {
  let navigation = document.querySelector(".navigation");
  let main = document.querySelector(".main");
  navigation.classList.remove("active");
  main.classList.remove("active");
}

function navigation_load() {}

window.onload = project_content_load();
navigation_load();
