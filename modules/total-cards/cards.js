const Promise = require('promise')
const Check = require('./../../check.js')

const PRODUCTS = ["https://www.totalcards.net/pokemon-hidden-fates-elite-trainer-box-reprint"]

class TotalCards extends Check {


    constructor() {
        super("Total Cards")
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < PRODUCTS.length; i++) {
                try {
                    await page.goto(PRODUCTS[i])

                    await page.waitForSelector('div.h3.bold')

                    let sold_out = await page.$eval("div.h3.bold", el => el.innerText)

                    if (sold_out.toLowerCase().includes('in stock'))
                     {
                        let name = await page.$eval(".page-title > span.base", el => el.innerText)
                        let price = await page.$eval("span.price-wrapper > span.price", el => el.innerText)
                        instock.push({ name: name, price: price.replace('£', ''), retailer: "totalcards", date: new Date(), url: page.url() })
                        
                    }
                }
                catch (err) {
                    errors.push({ for: PRODUCTS[i], err: err })
                }

            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = TotalCards