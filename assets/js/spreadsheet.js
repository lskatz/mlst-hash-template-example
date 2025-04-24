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
      headers.forEach(header => html += `<th>${header}</th>`);
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
        html += `<td class="sortedHashes">${hashValues.join(",")}</td>`;

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
