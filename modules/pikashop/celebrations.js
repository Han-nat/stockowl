const Promise = require('promise')
const Check = require('./../../check.js')

const PRODUCTS = ["https://pikashop.co.uk/products/pokemon-celebrations-special-collection-elite-trainer-box?_pos=6&_sid=79ae6513e&_ss=r", "https://pikashop.co.uk/products/pokemon-celebrations-premium-figure-collection-pikachu-vmax?_pos=9&_sid=79ae6513e&_ss=r", "https://pikashop.co.uk/products/pokemon-celebrations-ultra-premium-collection?_pos=4&_sid=79ae6513e&_ss=r"]

class PikaShop extends Check {


    constructor() {
        super("Pikashop")
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < PRODUCTS.length; i++) {
                try {
                    await page.goto(PRODUCTS[i])

                    await page.waitForSelector('div.h3.bold')

                    let canbuy = await page.$('.product-form--atc-button')

                    if (canbuy)
                     {
                        let name = await page.$eval("h1.product-title", el => el.innerText)
                        let price = await page.$eval(".price--main > span.money", el => el.innerText)
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

module.exports = PikaShop