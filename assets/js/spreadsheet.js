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
              <button class="copyButton" onclick="copyToClipboard(this)" aria-label="Copy hashes to clipboard">📋</button>
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
          if (!row || typeof row !== "object") return false;
          const rowHashes = neisHeaders.map(h => row[h]).filter(Boolean);
          const matchCount = queryHashes.filter(q => rowHashes.includes(q)).length;
          const percentMatch = (matchCount / queryHashes.length) * 100;
          return percentMatch >= threshold;
        });
        renderTable(filtered);
      }

      renderTable(data);

      let debounceTimeout;
      document.getElementById("searchInput").addEventListener("keyup", () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(filterRows, 250);
      });
      
      document.getElementById("thresholdInput").addEventListener("change", filterRows);

      function downloadTSV(filteredData) {
        const rows = [headers]; // already defined in your script
      
        filteredData.forEach(row => {
          const rowData = otherHeaders.map(h => row[h]);
          const hashValues = neisHeaders.map(h => row[h]).filter(Boolean).sort().join(",");
          rowData.push(hashValues);
          rows.push(rowData);
        });
      
        const tsvContent = rows.map(row => row.join("\t")).join("\n");
        const blob = new Blob([tsvContent], { type: "text/tab-separated-values" });
        const url = URL.createObjectURL(blob);
      
        const now = new Date().toISOString().replace(/:/g, "-").slice(0, 19); // Remove colons for filesystem safety
        const filename = `filtered_table_${now}.tsv`;
      
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      
    }
  });

  document.getElementById("downloadButton").addEventListener("click", function () {
    const input = document.getElementById("searchInput").value.trim();
    const threshold = parseInt(document.getElementById("thresholdInput").value) || 0;
  
    const queryHashes = input ? input.split(/\s*,\s*/).filter(Boolean) : [];
    const filtered = queryHashes.length > 0 ? data.filter(row => {
      const rowHashes = neisHeaders.map(h => row[h]).filter(Boolean);
      const matchCount = queryHashes.filter(q => rowHashes.includes(q)).length;
      const percentMatch = (matchCount / queryHashes.length) * 100;
      return percentMatch >= threshold;
    }) : data;
  
    downloadTSV(filtered);
  });
  
});