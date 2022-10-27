//span#buybox-see-all-buying-choices a.a-button-text
const Promise = require('promise')
const Check = require('../../check.js')

class Amazon extends Check {


    constructor() {
        super("Amazon PS5")
        this.products = ['https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/ref=sr_1_1?dchild=1&keywords=playstation+5&qid=1628096148&s=videogames&sr=1-1', 'https://www.amazon.co.uk/PlayStation-5-Digital-Edition-Console/dp/B08H97NYGP/ref=sr_1_2?dchild=1&keywords=playstation+5&qid=1628096148&s=videogames&sr=1-2']
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < this.products.length; i++) {
                try {

                    await page.goto(this.products[i])
                    let title = await page.waitForSelector('#productTitle')
                    title = await title.evaluate(el => el.innerText)

                    let addToCart = await page.$('#add-to-cart-button')

                    if (addToCart)
                    {
                        let price = await page.$eval('#priceblock_ourprice', el => el.innerText)
                        price = price.trim().replace('£', '')

                        instock.push({ name: title, price: price, retailer: "amazon", date: new Date(), url: page.url(), role: 'PS5', pingViaRetailer: false })
                    }

                //https://www.amazon.co.uk/Xbox-RRT-00007-Series-X/dp/B08H93GKNJ/ref=sr_1_1?dchild=1&keywords=xbox+series+x&qid=1628797481&sr=8-1
                    // await Promise.race([page.waitForSelector('#add-to-cart-button'), page.waitForSelector('#unqualifiedBuyBox')]).then(async result => {
                    //     if (result)
                    //     {
                    //         let resultId = await result.evaluate(el => el.id)
    
                    //         console.log(resultId)
                    //         if (resultId == 'add-to-cart-button')
                    //         {
                    //             instock.push({ name: title, price: priceInner, retailer: "amazon", date: new Date(), url: page.url(), pingViaRetailer: false })
                    //         }
                    //         else
                    //         {
                    //             let aClick = await result.$('span#buybox-see-all-buying-choices a.a-button-text')
    
                    //             aClick.click()

                    //             let offerList = await page.waitForSelector('#aod-offer-list')
                    //             let offers = await offerList.$$('#aod-offer')

                    //             let prices = offers.

                    //             for (const offer of offers)
                    //             {
                    //                 //.a-price .a-offscreen
                    //                 let price = offer.price
                    //             }

                                
                    //         }
                    //     }
                    //})
                }
                catch (err) {
                    let time = new Date()
                    let path = "./screenshots/" + time.getUTCMilliseconds() + '.png'

                    let error = {for: this.products[i], err: err}

                    if (!page.isClosed()) {
                        await page.screenshot({ path: path, fullPage: true})

                        error.ss = path
                    }

                    errors.push(error)
                }

            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = Amazon