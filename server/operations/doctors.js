const puppeteer = require("puppeteer");

const uniqid = require("uniqid");

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

    await self.page.$eval("#what_search", (el) => (el.value = "Ärzte"));
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
      console.log("Warte auf den Next button.");
      try {
        // Default timeout first time.
        await self.page.waitFor(buttonSelector, { timeout });
        // 2 sec timeout after the first.
        timeout = 2000;
      } catch (err) {
        // Ignore the timeout error.
        console.log("Konnte keinen Button mehr finden.");
        results.forEach(function (element) {
          element.map((n) => returnResults.push(n));
        }, this);
        return returnResults;
        break;
      }
      console.log("Klicke den NextButton");
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
      let companyId = uniqid();
      let companyName = companyNames[i];
      let industry = industries[i];
      let phoneNumber = phoneNumbers[i];
      let website = websites[i];
      let updated = Date.now();

      results.push({
        companyId,
        companyName,
        industry,
        phoneNumber,
        website,
        updated,
      });
    }
    return results;
  },
};

module.exports = self;
