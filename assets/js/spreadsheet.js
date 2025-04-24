
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
          html += `<th style="width: 500px;">${header}</th>`;
        } else {
          html += `<th>${header}</th>`;
        }
      });      
      html += "</tr></thead><tbody>";

      // Process each row
      data.forEach(row => {
        html += "<tr>";

        // Add non-NEIS fields
        otherHeaders.forEach(header => {
          html += `<td>${row[header]}</td>`;
        });

        // Add sortedHashes column
        const hashValues = neisHeaders.map(h => row[h]).filter(Boolean).sort();
        const hashes = hashValues.join(",");
        html += `
          <td class="sortedHashes">
            <button class="copyButton" onclick="copyToClipboard(this)">📋</button>
            <span class="hashText">${hashes}</span>
          </td>`;
        

        html += "</tr>";
      });

      html += "</tbody></table>";
      container.innerHTML = html;
    }
  });

  document.getElementById("searchInput").addEventListener("keyup", function () {
    const filter = this.value.toUpperCase();
    const rows = document.querySelectorAll("#table-container table tbody tr");
    rows.forEach(row => {
      const match = [...row.cells].some(cell =>
        cell.textContent.toUpperCase().includes(filter)
      );
      row.style.display = match ? "" : "none";
    });
  });

});
