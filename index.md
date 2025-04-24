---
layout: default
title: Home
---

# Spreadsheet Viewer

<style>
  #table-container table {
    table-layout: fixed;
    width: 100%;
  }
  td, th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
  td.sortedHashes {
    white-space: nowrap;        /* Don't wrap text */
    overflow: hidden;           /* Hide text that overflows */
    text-overflow: ellipsis;    /* Add ... when clipped (optional) */
    max-width: 300px;           /* Limit the width so it can overflow */
    position: relative;
  }
  .copyButton {
    margin-left: 5px;
    cursor: pointer;
    font-size: 0.9em;
    background: none;
    border: none;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="/mlst-hash-template-example/assets/js/spreadsheet.js"></script>

<input type="text" id="searchInput" placeholder="Search..." />

<div id="table-container"></div>
