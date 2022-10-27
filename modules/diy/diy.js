

const Promise = require('promise')
const Check = require('./../../check.js')

//NOT WORKING
class DIY extends Check {


    constructor() {
        super("B&Q")
        this.products = ["https://www.diy.com/departments/la-hacienda-kasu-steel-fire-bowl/1633553_BQ.prd",
        "https://www.diy.com/departments/goodhome-decor-10-scotia-trim-220cm/3663602531142_BQ.prd"]
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < this.products.length; i++) {
                try {
                    await page.goto(this.products[i])

                    await page.waitForSelector('h1')
                    let available = await page.$x("//span[contains(., 'Available')]")
                    if (available.length > 0)
                     {
                        let name = await page.$eval("h1", el => el.innerText)
                        let price = await page.$eval("div._36cb0914 > div > div > span", el => el.innerText)
                        instock.push({ name: name, price: price.replace('£', ''), retailer: "B&Q", date: new Date(), url: page.url(), pingViaRetailer: true })
                        
                    }
                }
                catch (err) {
                    errors.push({ for: this.products[i], err: err })
                }

            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = DIY