const Promise = require('promise')
const Check = require('./../../check.js')

const PRODUCTS = ["https://www.totalcards.net/trading-card-games/pokemon/expansions/celebrations", ]

class TotalCards extends Check {


    constructor() {
        super("Total Cards Expansions")
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < PRODUCTS.length; i++) {
                try {
                    await page.goto(PRODUCTS[i])

                    await page.waitForSelector('.product-items')

                    let products = await page.$$('.product-item')

                    for (let j = 0; j < products.length; j++) 
                    {
                        let product = products[j]

                        let instock = await product.$("button.tocart")

                        if (instock)
                         {
                            let name = await product.$(".product-item-link")
                            let title = await name.evaluate(el => el.innerText)
                            let link = await name.evaluate(el => el.getAttribute('href'))
                            let price = await product.$eval("span.price", el => el.innerText)
    
                            instock.push({ name: title, price: price.replace('£', ''), retailer: "totalcards", date: new Date(), url: link })
                        }
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