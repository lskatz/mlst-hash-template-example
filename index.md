---
layout: default
title: Home
---

# Query MLST profiles

<link rel="stylesheet" href="/mlst-hash-template-example/assets/css/style.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="/mlst-hash-template-example/assets/js/spreadsheet.js"></script>

The below table contains samples of _Neisseria meningitidis_ with some identifiers.
Some other columns include LINcode which helps label clusters and also `sortedHashes`.
This field is the list of MLST alleles, transformed into md5sums.
Add to the database by making a pull request at <https://github.com/lskatz/mlst-hash-template-example>.

Search by entering comma-separated md5sum alleles.
Define what percent of the alleles have to match in order to show on the table.
Results will show rows with a percentage of matches above your selected threshold.

<div id="controls" style="margin-bottom: 1em;">
  <button id="exampleButton">Try Example</button>
  <input type="text" id="searchInput" placeholder="Enter comma-separated hashes to match" />
  <br />
  <button id="downloadButton">⬇️</button>
  <label for="thresholdInput">Minimum Match %:</label>
  <input type="number" id="thresholdInput" value="85" min="0" max="100" step="5" />%
</div>

<div id="matchCount"></div>
<div id="table-container"></div>
