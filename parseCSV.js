let {Parser} = require('parse-csv');
let parser = new Parser();
let encoding = 'utf-8';
let csvData = "";
let moment = require('moment');

//ToDos:
//Notes column: If there are invalid UTF-8 characters, replace them w/ the unicode replacement character
//check if characters are unicode invalid. If so, replacement character
  //if that breaks the input, drop that row and send a message to stderr
  //use moment('It is 2012-05-25', 'YYYY-MM-DD', true).isValid(); // false for date validation

  process.stdin.setEncoding(encoding);
  process.stdin.on('readable', () => {
    let chunk;
    while (chunk = process.stdin.read()) {
      csvData += chunk;
    }
  })
  process.stdin.on('end', () => {
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
      checkForInvalidUnicode(currentRow);
      formatTimestamp(currentRow);
      formatZipcode(currentRow);
      formatNames(currentRow);
      formatDurations(currentRow);
      for(let j=0; j<datagrid[i].length; j++) {
        if(datagrid[i][j].includes(",")) {
          process.stdout.write('"' + datagrid[i][j] + '"')
        } else {
          process.stdout.write(datagrid[i][j])
          if(j !== datagrid[i].length-1) {process.stdout.write(',')}
        }
      }
      process.stdout.write("\n");
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
    row[3] = row[3].toUpperCase();
  }

  function formatDurations(row) {
    row[4] = moment.duration(row[4]).asSeconds().toString();
    row[5] = moment.duration(row[5]).asSeconds().toString();
    row[6] = row[4] + row[5];
  }

  function checkForInvalidUnicode(row) {
    /*row.forEach((element) => {
      let arrayToCheck = element.split("");
      for (let i=0; i<arrayToCheck.length; i++) {
        if (element.charCodeAt(i) === "NAN") {
          console.log("Nanananananananananananananannanananananananannaa Batman!");
        }
      }
      //if unicode is not valid
        //replace with unicode replacement character
    })
    */
  }

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatNames,
  formatDurations
}
