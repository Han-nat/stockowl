const Promise = require('promise')
const Check = require('./../../check.js')

const PRODUCTS = []

class Smyths extends Check {


    constructor() {
        super("Smyths")
        this.products = ["https://www.smythstoys.com/uk/en-gb/toys/action-figures-and-playsets/pokemon/pokemon-trading-cards-game/pok%c3%a9mon-tcg-sword-and-shield-ultra-premium-collection-zacian-and-zamazenta/p/194705", 
        "https://www.smythstoys.com/uk/en-gb/toys/action-figures-and-playsets/pokemon/pokemon-trading-cards-game/pok%c3%a9mon-trading-card-game-shining-fates-elite-trainer-box/p/196815"]
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            res({instock: [], errors: []})
            // await page.goto('https://bot.sannysoft.com')
            // await page.waitForTimeout(5000)
            // await page.screenshot({ path: 'testresult.png', fullPage: true })

            // let instock = []
            // let errors = []

            // for (let i = 0; i < PRODUCTS.length; i++) {
            //     try {
            //         await page.goto(PRODUCTS[i])

            //         await page.waitForSelector('.btn-green')

            //         let in_stock = await page.$(".js-enable-btn")
            //test man 2ojk12peojk12poekp1o2ke
            //         if (in_stock)
            //          {
            //             let name = await page.$eval("h1.margn_top_10", el => el.innerText)
            //             let price = await page.$eval("div.price_tag > span.notranslate", el => el.innerText)
            //             instock.push({ name: name, price: price.replace('£', ''), retailer: "smyths", date: new Date(), url: page.url(), pingViaRetailer: true })
                        
            //         }
            //     }
            //     catch (err) {
            //         errors.push[{ for: PRODUCTS[i], err: err }]
            //     }

            // }

            // await page.close()
            // res(instock, errors)

        })
    }
}

module.exports = Smyths