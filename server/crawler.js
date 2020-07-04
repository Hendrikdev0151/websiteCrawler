const puppeteer = require("puppeteer");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({
      headless: true,
    });
    self.page = await self.browser.newPage();

    await self.page.goto("https://www.gelbeseiten.de", {
      waitUntil: "networkidle0",
    });

    await self.page.$eval("#what_search", (el) => (el.value = "Architekten"));
    await self.page.$eval("#where_search", (el) => (el.value = "Berlin"));

    await self.page.$eval("button.search_go", (el) => el.click());
  },
  getResults: async () => {
    let singlePageResults = [];
    let results = [];
    let returnResults = [];
    const buttonSelector = "a.gs_paginierung__sprungmarke--vor";
    console.log("Button recognized");
    let timeout;

    while (true) {
      console.log("Waiting for the Next button.");
      try {
        // Default timeout first time.
        await self.page.waitFor(buttonSelector, { timeout });
        // 2 sec timeout after the first.
        timeout = 2000;
      } catch (err) {
        // Ignore the timeout error.
        console.log(
          "Could not find the next button, " + "we've reached the end."
        );
        results.forEach(function (element) {
          element.map((n) => returnResults.push(n));
        }, this);
        console.log(returnResults);
        break;
      }
      console.log("Clicking the Next button.");
      const singlePageResults = await self.retrieveData();

      results = [...results, singlePageResults];

      await self.page.click(buttonSelector);
    }
  },
  retrieveData: async () => {
    //Beispielinformationen -> Ablauf 1
    const results = [];
    const companyNames = await self.page.$$eval(
      `
      #gs_treffer > div > article.mod-Treffer > a > h2
            `,
      (nodes) => nodes.map((element) => element.innerText.trim())
    );

    const industries = await self.page.$$eval(
      `
      #gs_treffer > div > article.mod-Treffer > a > p.mod-Treffer--besteBranche
            `,
      (nodes) => nodes.map((element) => element.innerText.trim())
    );

    const phoneNumbers = await self.page.$$eval(
      `
      #gs_treffer > div > article.mod-Treffer > a > address > p.mod-AdresseKompakt__phoneNumber
            `,
      (nodes) => nodes.map((element) => element.innerText.trim())
    );

    const websites = await self.page.$$eval(
      `
      div.mod-gsSlider--noneOnWhite
            `,
      (children) =>
        children.map((el) =>
          el.querySelector("a.contains-icon-homepage")
            ? el.querySelector("a.contains-icon-homepage").getAttribute("href")
            : ""
        )
    );

    const arrayLength = Math.min(
      companyNames.length,
      industries.length,
      phoneNumbers.length,
      websites.length
    );

    for (let i = 0; i < arrayLength; i++) {
      let companyName = companyNames[i];
      let industry = industries[i];
      let phoneNumber = phoneNumbers[i];
      let website = websites[i];

      results.push({
        companyName,
        industry,
        phoneNumber,
        website,
      });
    }
    //Datenbearbeitung, dann wie ab Zeile 45

    //-----------------------
    //Beispielinformationen -> Ablauf 2

    console.log("done");
    return results;
  },
};

module.exports = self;

// const checkMainLinks = await self.page.waitForSelector(
//   "#teilnehmer_block > div > div.mod-paginierung > div > div > div > ul.gs_paginierung__liste.gs_paginierung__liste--main > li > a"
// );

// if (checkMainLinks) {
//   const pageLinks = await self.page.$$eval(
//     `#teilnehmer_block > div > div.mod-paginierung > div > div > div > ul.gs_paginierung__liste.gs_paginierung__liste--main > li > a`,
//     (el) => el.map((link) => link.href)
//   );
//   console.log(pageLinks);
// }

// const checkGhostLinks = await self.page.waitForSelector(
//   "#teilnehmer_block > div > div.mod-paginierung > div > div > div > ul.gs_paginierung__liste.gs_paginierung__liste--ghostblock > li > a"
// );

// if (checkGhostLinks) {
//   const secondPageLinks = await self.page.$$eval(
//     "#teilnehmer_block > div > div.mod-paginierung > div > div > div > ul.gs_paginierung__liste.gs_paginierung__liste--ghostblock > li > a",
//     (el) => el.map((link) => link.href)
//   );

//   console.log(secondPageLinks);
// }
