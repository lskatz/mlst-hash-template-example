---
layout: default
title: Home
---

# Spreadsheet Viewer

<link rel="stylesheet" href="/mlst-hash-template-example/assets/css/style.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="/mlst-hash-template-example/assets/js/spreadsheet.js"></script>

Search by entering comma-separated hash values.
Results will show rows with a percentage of matches above your selected threshold.

<div id="controls" style="margin-bottom: 1em;">
  <button id="exampleButton">Try Example</button>
  <input type="text" id="searchInput" placeholder="Enter comma-separated hashes to match (e.g., abc123, def456)" />
  <label for="thresholdInput">Minimum Match %:</label>
  <input type="number" id="thresholdInput" value="85" min="0" max="100" step="5" />%
</div>

<div id="matchCount"></div>
<div id="table-container"></div>
