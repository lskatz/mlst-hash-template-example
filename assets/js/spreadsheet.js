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
      const matchCount = document.getElementById("matchCount");
      
      // Add example hashes button functionality
      document.getElementById("exampleButton").addEventListener("click", function () {
        const firstRow = data.find(row => row); // Get first non-empty row
        const exampleHashes = neisHeaders.map(h => firstRow[h]).filter(Boolean).slice(0, 3);
        document.getElementById("searchInput").value = exampleHashes.join(", ");
        filterRows();
      });

      // Identify NEIS headers
      const allHeaders = Object.keys(data[0]);
      const neisHeaders = allHeaders.filter(h => h.startsWith("NEIS"));
      const otherHeaders = allHeaders.filter(h => !h.startsWith("NEIS"));

      // New headers: all non-NEIS + sortedHashes
      const headers = [...otherHeaders, "sortedHashes"];

      function renderTable(filteredData) {
        let html = "<table><thead><tr>";
        headers.forEach(header => {
          html += `<th title="${header}">${header}</th>`;
        });
        html += "</tr></thead><tbody>";

        filteredData.forEach(row => {
          html += "<tr>";
          otherHeaders.forEach(header => {
            html += `<td title="${row[header]}">${row[header]}</td>`;
          });
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
        matchCount.textContent = `Showing ${filteredData.length} matching row(s)`;
      }

      function filterRows() {
        const input = document.getElementById("searchInput").value.trim();
        const threshold = parseInt(document.getElementById("thresholdInput").value) || 0;
        if (!input) {
          renderTable(data);
          return;
        }
        const queryHashes = input.split(/\s*,\s*/).filter(Boolean);
        const filtered = data.filter(row => {
          const rowHashes = neisHeaders.map(h => row[h]).filter(Boolean);
          const matchCount = queryHashes.filter(q => rowHashes.includes(q)).length;
          const percentMatch = (matchCount / queryHashes.length) * 100;
          return percentMatch >= threshold;
        });
        renderTable(filtered);
      }

      renderTable(data);

      document.getElementById("searchInput").addEventListener("keyup", filterRows);
      document.getElementById("thresholdInput").addEventListener("change", filterRows);
    }
  });
});