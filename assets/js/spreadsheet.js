function copyToClipboard(button) {
  const text = button.parentElement.querySelector(".hashText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = "✅";
    setTimeout(() => button.textContent = "📋", 1000);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("/mlst-hash-template-example/data/Nmen.dbh/profiles.tsv", {
    download: true,
    header: true,
    delimiter: "\t",
    complete: function (results) {
      const data = results.data;
      const container = document.getElementById("table-container");

      // Identify NEIS headers
      const allHeaders = Object.keys(data[0]);
      const neisHeaders = allHeaders.filter(h => h.startsWith("NEIS"));
      const otherHeaders = allHeaders.filter(h => !h.startsWith("NEIS"));

      // New headers: all non-NEIS + sortedHashes
      const headers = [...otherHeaders, "sortedHashes"];

      // Begin HTML table
      let html = "<table><thead><tr>";
      headers.forEach(header => {
        if (header === "sortedHashes") {
          html += `<th style="width: 500px;" title="${header}">${header}</th>`;
        } else {
          html += `<th title="${header}">${header}</th>`;
        }
      });
      html += "</tr></thead><tbody>";

      // Process each row
      data.forEach(row => {
        html += "<tr>";

        // Add non-NEIS fields
        otherHeaders.forEach(header => {
          html += `<td title="${row[header]}">${row[header]}</td>`;
        });

        // Add sortedHashes column
        const hashValues = neisHeaders.map(h => row[h]).filter(Boolean).sort();
        const hashes = hashValues.join(",");
        html += `
          <td title="${hashes}" class="sortedHashes">
            <button class="copyButton" onclick="copyToClipboard(this)">📋</button>
            <span class="hashText">${hashes}</span>
          </td>`;

        html += "</tr>";
      });

      html += "</tbody></table>";
      container.innerHTML = html;
    }
  });

  // Create search instructions and threshold slider
  const searchInput = document.getElementById("searchInput");
  searchInput.placeholder = "Enter comma-separated hashes to search for (e.g., abc,def,ghi)";

  const thresholdControl = document.createElement("div");
  thresholdControl.innerHTML = `
    <label for="matchThreshold">Match threshold (%): <span id="thresholdValue">85</span>%</label>
    <input type="range" id="matchThreshold" min="0" max="100" value="85">
  `;
  searchInput.insertAdjacentElement("afterend", thresholdControl);

  const thresholdSlider = document.getElementById("matchThreshold");
  const thresholdValueLabel = document.getElementById("thresholdValue");

  thresholdSlider.addEventListener("input", function () {
    thresholdValueLabel.textContent = this.value;
    performSearch();
  });

  searchInput.addEventListener("keyup", performSearch);

  function performSearch() {
    const filter = searchInput.value.toUpperCase().split(",").map(h => h.trim()).filter(Boolean);
    const threshold = parseInt(thresholdSlider.value, 10);
    const rows = document.querySelectorAll("#table-container table tbody tr");

    rows.forEach(row => {
      const hashCell = row.querySelector(".sortedHashes .hashText");
      if (!hashCell) return;

      const cellHashes = hashCell.textContent.toUpperCase().split(",").filter(Boolean);
      const matches = filter.filter(h => cellHashes.includes(h)).length;
      const percentMatch = (matches / filter.length) * 100;

      row.style.display = percentMatch >= threshold ? "" : "none";
    });
  }
});
