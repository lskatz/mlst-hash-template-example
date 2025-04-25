---
layout: default
title: Home
---

# Spreadsheet Viewer

<link rel="stylesheet" href="/mlst-hash-template-example/assets/css/style.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="/mlst-hash-template-example/assets/js/spreadsheet.js"></script>

<input type="text" id="searchInput" placeholder="Enter comma-separated hashes to match (e.g., abc123,def456)..." />
<label for="thresholdInput">Minimum Match %:</label>
<input type="number" id="thresholdInput" value="85" min="0" max="100" step="1" />%
<div id="table-container"></div>
<div id="matchCount"></div>
