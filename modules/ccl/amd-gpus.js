const { loggers } = require('winston')
const Check = require('../../check.js')

const GPU_SEARCH_TERMS = ["6600", "6700", "6800", "6900"]

class CCLNvidia extends Check {
    constructor() {
        super("CCL AMD gpus")
        this.products = ["https://www.cclonline.com/category/430/PC-Components/Graphics-Cards/AMD-Chipset-Graphics-Cards/attributeslist/1268066/", "https://www.cclonline.com/category/430/PC-Components/Graphics-Cards/AMD-Chipset-Graphics-Cards/attributeslist/1268065/",
         "https://www.cclonline.com/category/430/PC-Components/Graphics-Cards/AMD-Chipset-Graphics-Cards/attributeslist/1268062/", "https://www.cclonline.com/category/430/PC-Components/Graphics-Cards/AMD-Chipset-Graphics-Cards/attributeslist/1268063/", 
         "https://www.cclonline.com/category/430/PC-Components/Graphics-Cards/AMD-Chipset-Graphics-Cards/attributeslist/1268064/"]
        this.artificialDelay = 300000/2
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let instock = []
                let errors = []

                for (let i = 0; i < this.products.length; i++) {
                    try {
                        
                        let searchTerm = this.products[i]

                        await page.goto(searchTerm, { timeout: 3000 })

                        await page.waitForSelector('.productList')

                        const products = await page.$$('.productList')

                        for (let j = 0; j < products.length; j++) {
                            try {
                                let xd = await products[j].$('h3 > a')

                                let name = await xd.evaluate(el => el.innerText)
                                if (name.includes(searchTerm)) {
                                    let soldoutbox = await products[j].$('.soldout-box')

                                    if (soldoutbox) {
                                        let href = await xd.evaluate(el => el.getAttribute('href'))
                                    }
                                    else {

                                        let href = await xd.evaluate(el => el.getAttribute('href'))

                                        let canBuy = await products[j].$('.btnAddToBasket')

                                        if (canBuy) {
                                            let price = await products[j].$eval('.price > p', el => el.innerText.replace(/[^0-9.]/g, ''))

                                            instock.push({ name: name, price: price, retailer: "ccl", date: new Date(), url: 'https://www.cclonline.com' + href })

                                        }

                                    }

                                }
                            }
                            catch (err) {
                                errors.push({ for: page.url(), err: err })
                            }


                        }
                    }
                    catch (err) {
                        errors.push[{ for: page.url(), err: err }]
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

module.exports = CCLNvidia

// exports.register = function()
// {
//     return { name: "ccl nvidia-gpus" }
// }

// exports.check = async function (browser, notifications) {


// }