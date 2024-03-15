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

// Loading Recent disasters of fire
function project_content_load() {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let project_content = document.getElementById("project_content");
      project_content.innerHTML = "";
      for (let i = 0; i < data.project_content_data.length; i++) {
        project_content.innerHTML += `
        <div class="workBx">
          <div class="imgBx">
            <img src="${data.project_content_data[i].img_url}" alt="${data.project_content_data[i].heading}" />
            </div>
        <div class="textBx">
          <h3>${data.project_content_data[i].heading}</h3>
          <p>${data.project_content_data[i].content}</p>
          <a href="./dynamics/dynamics.html#${i}" 
            class="btn" 
            name=${data.project_content_data[i].heading} 
            aria-label=${data.project_content_data[i].heading}>
            ${data.project_content_data[i].heading}
            </a>
        </div>
      </div>`;
      }
    });
}
