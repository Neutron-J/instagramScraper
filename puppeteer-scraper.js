const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

const url = 'https://www.instagram.com/officeworks/';

puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(page => {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(html => {
    const $ = cheerio.load(html);
    const imageSrcs = [];
    $('.eLAPa > div > img').slice(0, 3).each(function() {
      //console.log(this.parent.parent.parent.attribs.href);
      imageSrcs.push({
        src: $(this).attr('src'),
      });
    });
    console.log(imageSrcs);
    return imageSrcs;
  })
  .then(imageSrcs => {
    imageSrcs.map((image, i) => {
      downloadImage(image.src, 'insta-image' + (i + 1) + '.jpg');
    });
  })
  .catch(console.error);

  function downloadImage (uri, filename) {
    request.head(uri, function (err, res, body) {
      request(uri)
        .on('error', function () { if (err !== null) { console.log(err); } })
        .pipe(fs.createWriteStream('./images/' + filename))
        .on('close', function () {
          console.log('Images Downloaded');
        });
    });
  }