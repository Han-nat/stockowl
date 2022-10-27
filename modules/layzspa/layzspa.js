const Promise = require('promise')
const Check = require('./../../check.js')

class LazySpa extends Check {


    constructor() {
        super("Lay Z Spa Hot tubs")
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            try {
                await page.goto('https://www.lay-z-spa.co.uk/inflatable-hot-tubs.html?price=632-1079&product_list_limit=36')

                await page.waitForSelector('.products')

                let products = await page.$$('li.product')

                for (let i = 0; i < products.length; i++) {
                    try
                    {
                        let product = products[i]
                        let productName = await product.$eval('.product-item-link > span', el => el.innerText)
                        let productPrice = await product.$eval('span.price', el => el.innerText)
                        let link = await product.$eval('.actions-primary > a', el => el.getAttribute('href'))
                        let available = await product.$('.available')
    
                        if (available)
                        {
                            instock.push({ name: productName, price: productPrice.replace('£', ''), retailer: "Lay Z Spa", date: new Date(), url: link, pingViaRetailer: true })
                        }
                    }
                    catch (err)
                    {
                        errors.push({for: page.url(), err: err})
                    }


                }
            }
            catch (err) {
                errors.push({for: page.url(), err: err})
            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = LazySpa