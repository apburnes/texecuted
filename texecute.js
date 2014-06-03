// Add modules
var request = require('request');
var $ = require('cheerio');
var fs = require('fs');

// State of Texas executed list
var url = 'http://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html';

function Inmate() {
};

function parseRows(url, done) {
  request(url, function(err, res, html) {
    if (err) return log(err);
    var parsedHtml = $.load(html);
    var json = [];
    parsedHtml('tr').map(function(i, elem) {
      if (i > 0) {
        var row = elem.children.filter(function(d) { return d.type === 'tag' });
        var inmate = new Inmate;
        row.forEach(function(item, index, arr) {
          var len = arr.length;
          attrInmate(index, item, inmate, function(d) {
            json.push(d);
          });
        });
      }
    }).end(done(json));
  });
}

function attrInmate(index, attr, inmate, done) {
  if (index === 0) {
    inmate.execution = attr.children[0].data;
  }
  if (index === 3) {
    inmate.lastName = attr.children[0].data;
  }
  if (index === 4) {
    inmate.firstName = attr.children[0].data;
  }
  if (index === 5) {
    inmate.tdcjNumber = attr.children[0].data;
  }
  if (index === 6) {
    inmate.age = attr.children[0].data;
  }
  if (index === 7) {
    inmate.executionDate = attr.children[0].data;
  }
  if (index === 8) {
    inmate.race = attr.children[0].data;
  }
  if (index === 9) {
    inmate.county = attr.children[0].data;
    done(inmate)
  }
}

function log() {
  var args = Array.prototype.slice.call(arguments);
  args.forEach(function(item) {
    console.log(item)
  })
}

// parseRows('http://www.tdcj.state.tx.us/death_row/dr_info/villegasjoselast.html')
parseRows(url, function(json) {
  var data = JSON.stringify(json, null, 2);
  fs.writeFile('./executed.json', data, function(err) {
    if (err) return log(err);
    log('Finished')
  })
});
