fetch("HTML Files.json")
  .then((response) => response.json())
  .then((data) => {
    let html_code = "";
    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        const info = data[category];
        html_code += `<a class="card" href="${info.path}">\n`;
        html_code += '  <div class="card-content">\n';
        html_code += '    <div class="card-info-wrapper">\n';
        html_code += '      <div class="card-info">\n';
        html_code += `        <div class="card-info-title">\n`;
        html_code += `          <h3>${category}</h3>\n`;
        html_code += `          <h4>${info.name}</h4>\n`;
        html_code += "        </div>\n";
        if (info.type) {
          html_code += '<div class="imgBx">';
          html_code += `     <img src="${info.type}" alt="Image">`;
          html_code += "</div>"
        }
        html_code += "      </div>\n";
        html_code += "    </div>\n";
        html_code += "  </div>\n";
        html_code += "</a>\n";
      }
    }
    document.getElementById("cards").innerHTML = html_code;
  })
  .catch((error) => console.error("Error fetching JSON:", error));
