const Check = require('./../../check.js')

const GPU_SEARCH_TERMS = ["3060", "3060 Ti", "3070", "3080", "3090"]

class CurrysNvidia extends Check {

    constructor() {
        super("Currys nvidia-gpus")
        this.products = ["https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/graphics-cards/324_3091_30343_xx_ba00013562-bv00313725%7Cbv00313767%7Cbv00313849%7Cbv00314157%7Cbv00314002%7Cbv00313952/1_50/relevance-desc/xx-criteria.html", 
        "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/graphics-cards/324_3091_30343_xx_ba00013562-bv00313725%7Cbv00313767%7Cbv00313849%7Cbv00314157%7Cbv00314002%7Cbv00313952/2_50/relevance-desc/xx-criteria.html", "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/graphics-cards/324_3091_30343_xx_ba00013562-bv00314012%7Cbv00314005%7Cbv00314066%7Cbv00313996/1_50/relevance-desc/xx-criteria.html"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let instock = []
                let errors = []
                for (let i = 0; i < this.products.length; i++)
                {
                    try
                    {
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

                                    instock.push({ name: productName, price: price.replace('£', ''), retailer: "currys", date: new Date(), url: productLink })
                                }
                            }
                            catch (err) {
                                errors.push({ for: page.url(), err: err })
                            }
        
                        }
                    }
                    catch (err)
                    {
                        errors.push({ for: page.url(), err: err })
                    }

                }
                resolve({instock: instock, errors: errors})
            }
            catch (e) {
                reject(e)

            }
        })
    }

}

module.exports = CurrysNvidia