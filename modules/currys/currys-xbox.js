const Check = require('../../check.js')

const GPU_SEARCH_TERMS = ["3060", "3060 Ti", "3070", "3080", "3090"]

class CurrysXbox extends Check {

    constructor() {
        super("Currys Xbox")
        this.products = ["https://www.currys.co.uk/gbuk/xbox-series-x/console-gaming/consoles/634_4783_32541_xx_ba00013671-bv00313583/xx-criteria.html"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let instock = []
                let errors = []
                for (let i = 0; i < this.products.length; i++) {
                    try {
                        await page.goto(this.products[i])

                        await page.waitForSelector('.prd-channels')

                        let results = await page.$('.resultList')
                        let products = await results.$$('article')

                        for (let j = 0; j < products.length; j++) {
                            try {
                                let availablity = await products[j].$$(".available");
                                if (availablity.length > 0) {
                                    let product = await products[j].$('header > a')
                                    let productName = await product.evaluate(el => el.innerText)
                                    let productLink = await product.evaluate(el => el.getAttribute('href'))
                                    let [priceSpan] = await products[j].$x(".//div[contains(@class, 'productPrices')]//span[contains(., '£')]")
                                    let price = await priceSpan.evaluate(el => el.innerText)

                                    instock.push({ name: productName, price: price.replace('£', ''), retailer: "currys", role: "XSX", date: new Date(), url: productLink })
                                }
                            }
                            catch (err) {
                                errors.push({ for: page.url(), err: err })
                            }

                        }
                    }
                    catch (err) {
                        errors.push({ for: page.url(), err: err })
                    }

                }
                resolve({ instock: instock, errors: errors })
            }
            catch (e) {
                reject(e)

            }
        })
    }

}

module.exports = CurrysXbox