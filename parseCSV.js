let {Parser} = require('parse-csv');
let parser = new Parser();
let encoding = 'utf-8';
let csvData = "";

//TODO:
//tests
//take in CSV from stdin
//parse csv
  //make sure addresses with commas in them are ok
//entire CSV is in the UTF-8 character set
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

function toExport() {
  process.stdin.setEncoding(encoding);
  process.stdin.on('readable', () => {
    let chunk;
    while (chunk = process.stdin.read()) {
      csvData += chunk;
    }
  })
  process.stdin.on('end', () => {
    var datagrid = parser.parse(csvData);
    console.log(datagrid.data);
    //process.stdout.write(csvData + "\n")
  });
}

toExport()



module.exports = {
  toExport,
}
