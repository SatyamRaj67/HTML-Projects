//Swiper slider
var swiper = new Swiper(".bg-slider-thumbs", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 0,
});
var swiper2 = new Swiper(".bg-slider", {
  loop: true,
  spaceBetween: 0,
  thumbs: {
    swiper: swiper,
  },
});

//Navigation bar effects on scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

// Contact Form Amazing Animations
const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

// Validation email
function validationText() {
  var form = document.getElementById("form");
  var email = document.getElementById("email").value;
  var text = document.getElementById("text");
  var pattern1 = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (email.match(pattern1)) {
    form.classList.add("valid");
    form.classList.remove("invalid");
    text.style.display = "none";
  } else {
    form.classList.remove("valid");
    form.classList.add("invalid");
    text.innerHTML = "Your Email Address is Invalid";
    text.style.color = "#ff0000";
    text.style.display = "block";
  }
}

// Validation number
function validationNumber() {
  var form = document.getElementById("form");
  var phno = document.getElementById("phno").value;
  var phone = document.getElementById("phone");
  var pattern2 = /^\+?([0-9]{2})\)?[-. ]?\d{9}$/;

  if (phno.match(pattern2)) {
    form.classList.add("valid");
    form.classList.remove("invalid");
    phone.style.display = "none";
  } else {
    form.classList.remove("valid");
    form.classList.add("invalid");
    phone.innerHTML = "Your Phone Number is Invalid";
    phone.style.color = "#ff0000";
    phone.style.display = "block";
  }
}

// ====== Header ======
let searchBtn = document.querySelector(".searchBtn");
let closeBtn = document.querySelector(".closeBtn");
let searchBox = document.querySelector(".searchBox");
let navigation = document.querySelector(".navigation");
let menuToggle = document.querySelector(".menuToggle");
let header = document.querySelector("header");
// let searchInput = document.getElementsByName("search_content")[0];
// let row = document.querySelectorAll(".row");

searchBtn.onclick = function () {
  searchBox.classList.add("active");
  closeBtn.classList.add("active");
  searchBtn.classList.add("active");
  menuToggle.classList.add("hide");
  header.classList.add("hidden");
  header.classList.remove("open");
};

closeBtn.onclick = function () {
  searchBox.classList.remove("active");
  closeBtn.classList.remove("active");
  searchBtn.classList.remove("active");
  menuToggle.classList.remove("hide");
  header.classList.remove("hidden");
  header.classList.remove("open");
};
menuToggle.onclick = function () {
  header.classList.add("open");
  closeBtn.classList.add("active");
  searchBtn.classList.remove("active");
  menuToggle.classList.add("hide");
};
// ====== Popup Image ======
document
  .querySelectorAll(".image .more a i.fa-solid.fa-eye")
  .forEach((image) => {
    image.onclick = () => {
      document.querySelector(".popup .imag").style.display = "block";
      document.querySelector(".popup .imag img").src =
        image.getAttribute("src");
    };
  });
// ====== Popup Read More ======
document.querySelectorAll(".image .more a.read-more i").forEach((i) => {
  i.onclick = () => {
    document.querySelector(".popup .text").style.display = "block";
    document.querySelector(".popup .text p").innerHTML = i.getAttribute("name");
  };
});

document.querySelector(".popup").onclick = () => {
  document.querySelector(".popup .imag").style.display = "none";
  document.querySelector(".popup .text").style.display = "none";
};

// ====== HEART WORK ======
document
  .querySelectorAll(".image .more i.fa-solid.fa-heart")
  .forEach((button) => {
    var e = 0;
    button.onclick = () => {
      if (e % 2 == 0) {
        button.style.color = "#f00";
      } else {
        button.style.color = "#000";
      }
      e++;
    };
  });

// Search Making
document.querySelector("#search-input").addEventListener("input", filterList);

function filterList() {
  console.log("Hello There");
  const searchInput = document.querySelector("#search-input");
  const listItems = document.querySelectorAll(".image");

  listItems.forEach((item) => {
    const Item_Name = item.querySelector(".Item");
    let text = Item_Name.textContent;
    if (text.toLowerCase().includes(searchInput.value.toLowerCase())) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}
