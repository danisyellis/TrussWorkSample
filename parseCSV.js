let {Parser} = require('parse-csv');
let parser = new Parser();
let encoding = 'utf-8';
let csvData = "";

//TODO:
//tests
//Timestamp column
  //should be formatted in ISO-8601 format
  //converted from pacific to US/Eastern
//All ZIP codes should be formatted as 5 digits.
  //If there are less than 5 digits, assume 0 as the prefix
//All name columns should be converted to uppercase
//convert `FooDuration` and `BarDuration` to floating point seconds format
//replace the value of TotalDuration withFooDuration + BarDuration
//Notes column: If there are invalid UTF-8 characters, replace them w/ the unicode replacement character
//check if characters are unicode invalid. If so, replacement character
  //if that breaks the input, drop that row and send a message to stderr
//send it out through stdout

  process.stdin.setEncoding(encoding);
  process.stdin.on('readable', () => {
    let chunk;
    while (chunk = process.stdin.read()) {
      csvData += chunk;
    }
  })
  process.stdin.on('end', () => {
    var datagrid = parser.parse(csvData).data;
    for(let i=1; i<datagrid.length; i++) {
      currentRow = datagrid[i];
      formatTimestamp(currentRow);
      formatZipcode(currentRow);
      formatNames(currentRow);
      //console.log(row)
    }
  //either just log the whole thing, or loop through each row and send it to stdout...
    //process.stdout.write(csvData + "\n")
  });

  function formatTimestamp(row) {
    //first column format with moment
      //and make it est instead of pst
    //console.log(row[0]);
    //row[0]
  }

  function formatZipcode(row) {
    let zipcode = row[2];
    if(zipcode.length > 5) {
      row[2] = zipcode.slice(0,5);
    } else if (zipcode.length < 5) {
      let toAdd = ""
      for(let i=0; i < 5-zipcode.length; i++) {
        toAdd += "0";
      }
      row[2] = toAdd + zipcode;
    }
  }

  function formatNames(row) {
    row[3] = row[3].toUpperCase()
    console.log(row[3]);
  }

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatNames
}
