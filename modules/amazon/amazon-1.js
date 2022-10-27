//span#buybox-see-all-buying-choices a.a-button-text
const Promise = require('promise')
const Check = require('./../../check.js')

class Amazon extends Check {


    constructor() {
        super("Amazon A")
        this.products = ['https://www.amazon.co.uk/MSI-GeForce-3080-Gaming-Trio/dp/B08HM4V2DH/ref=sr_1_10?dchild=1&keywords=3080&qid=1626872038&refinements=p_n_availability%3A419162031&rnid=419160031&sr=8-10',
        'https://www.amazon.co.uk/ASUS-GeForce-buffed-up-chart-topping-performance/dp/B095YF4L9W/ref=sr_1_7?dchild=1&keywords=3080&qid=1626872038&refinements=p_n_availability%3A419162031&rnid=419160031&sr=8-7']
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

                        instock.push({ name: title, price: price, retailer: "amazon", date: new Date(), url: page.url(), pingViaRetailer: false })
                    }

                
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
                    console.error(err)
                    errors.push({ for: this.products[i], err: err })
                }

            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = Amazon