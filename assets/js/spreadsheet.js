document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("/mlst-hash-template-example/db/clusters.tsv", {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;
      const container = document.getElementById("table-container");
      let html = "<table><thead><tr>";

      // Table headers
      const headers = Object.keys(data[0]);
      headers.forEach(header => html += `<th>${header}</th>`);
      html += "</tr></thead><tbody>";

      // Table rows
      data.forEach(row => {
        html += "<tr>";
        headers.forEach(header => html += `<td>${row[header]}</td>`);
        html += "</tr>";
      });

      html += "</tbody></table>";
      container.innerHTML = html;
    }
  });
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

