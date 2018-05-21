const mocha = require('mocha');
const expect = require('chai').expect;

let {formatTimestamp, formatZipcode, formatNames} = require("./parseCSV.js");

let datagrid = [["4/1/11 11:00:00 AM",0,"12345678", "Dani Gellis"],[0,0,"123", "株式会社スタジオジ"]]

describe("formatting zipcode", function() {
  it("truncates a zip code if it's more than 5 digits", function() {
    let row = datagrid[0];
    formatZipcode(row)
    expect(row[2]).to.equal("12345")
  });
  it("prepends zeros until the zipcode has 5 digits", function() {
    let row = datagrid[1];
    formatZipcode(row)
    expect(row[2]).to.equal("00123")
  });
})

describe("formatting names", function() {
  it("converts all names to uppercase", function() {
    let row = datagrid[0];
    formatNames(row)
    expect(row[3]).to.equal("DANI GELLIS")
  });
})

describe("formatting timestamps", function() {
  it("changes pst to est and converts to ISO-8601", function() {
    let row = datagrid[0];
    formatTimestamp(row)
    expect(row[0]).to.equal("2011-04-01T21:00:00.000Z")
  });
})



/*
describe("taking in and parsing a csv", function() {
  it("can take in a csv file", function() {
    before(function() {
      //change stdout's default behavior so that I can test it
      //https://github.com/mochajs/mocha/issues/1582
      //*****https://stackoverflow.com/questions/18543047/mocha-monitor-application-output?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
      //or the two libraries in there!  https://www.npmjs.com/package/test-console or https://www.npmjs.com/package/intercept-stdout
      funcsToTest.takeInCSV()
  });
    expect(test.to.exist)
  })
})

//
//   describe("data is invalid", function() {
//     it("prints a warning to stderr", function() {
//
//     })
//   })
*/
