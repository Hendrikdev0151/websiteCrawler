const crawler = require("./crawler");

(async () => {
  await crawler.initialize();

  await crawler.getResults();

  // console.log(results);

  debugger;
})();
