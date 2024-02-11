function fetchJsonFile() {
  fetch("htmlFiles.json")
    .then((response) => response.json())
    .then((data) => displayJsonLinks(data))
    .catch((error) => console.error("Error fetching JSON file:", error));
}

function displayJsonLinks(jsonData) {
  const jsonLinksElement = document.getElementById("cards");

  for (const category in jsonData) {
    if (jsonData.hasOwnProperty(category)) {
      const files = jsonData[category];
      for (const file in files) {
        if (files.hasOwnProperty(file)) {
          const filePath = files[file];
          const anchorTag = document.createElement("a");
          anchorTag.href = filePath;
          anchorTag.target = "_blank";
          anchorTag.classList.add("card");

          // Making the format
          const cardContent = document.createElement("div");
          cardContent.classList.add("card-content");
          const cardInfoWrapper = document.createElement("div");
          cardInfoWrapper.classList.add("card-info-wrapper");
          const cardInfo = document.createElement("div");
          cardInfo.classList.add("card-info");
          const cardInfoTitle = document.createElement("div");
          cardInfoTitle.classList.add("card-info-title");

          // Adding the Respective Text
          const categoryHeading = document.createElement("h3");
          categoryHeading.textContent = category;
          const fileHeading = document.createElement("h4");
          fileHeading.textContent = file;

          // Append the values
          cardInfoTitle.appendChild(categoryHeading);
          cardInfoTitle.appendChild(fileHeading);
          cardInfo.appendChild(cardInfoTitle);
          cardInfoWrapper.appendChild(cardInfo);
          cardContent.appendChild(cardInfoWrapper);
          anchorTag.appendChild(cardContent);
          jsonLinksElement.appendChild(anchorTag);
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", fetchJsonFile);
