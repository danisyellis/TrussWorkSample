let {Parser} = require('parse-csv');
let parser = new Parser();
let encoding = 'utf-8';
let csvData = "";
let moment = require('moment');

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
  //use moment('It is 2012-05-25', 'YYYY-MM-DD', true).isValid(); // false for date validation
//send it out through stdout

  process.stdin.setEncoding(encoding);
  process.stdin.on('readable', () => {
    let chunk;
    while (chunk = process.stdin.read()) {
      csvData += chunk;
    }
  })
  process.stdin.on('end', () => {
    console.log(csvData);
    var datagrid = parser.parse(csvData).data;
    // write the header to stdout
    datagrid[0].forEach((element) => {
      if(datagrid[0].indexOf(element) === datagrid[0].length-1) {
        process.stdout.write(element + '\n');
      } else {
        process.stdout.write(element + ',');
      }
    })

    //normalize and send to stdout the rest of the csv
    for(let i=1; i<datagrid.length; i++) {
      currentRow = datagrid[i];
      formatTimestamp(currentRow);
      formatZipcode(currentRow);
      formatNames(currentRow);
      for(let j=0; j<datagrid[i].length; j++) {
        if(datagrid[i][j].includes(",")) {
          process.stdout.write('"' + datagrid[i][j] + '",')
  //TODO: get rid of trailing , with another write (or create the string first)
        } else {
          process.stdout.write(datagrid[i][j] + ',')
        }
      }
      process.stdout.write("\n");
      //console.log(datagrid)
    }
  });

  function formatTimestamp(row) {
     row[0] = moment(row[0], "MM-DD-YYYY, h:mm:ss a").add(3, 'hours').toISOString();
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
  }

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatNames
}
