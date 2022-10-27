const Check = require('./../../check.js')
const Promise = require('promise')

class ArgosPS5 extends Check {



    constructor() {
        super("argos ps5")
        this.products = ["https://www.argos.co.uk/vp/oos/ps5.html?clickSR=slp:term:ps5:3:299:1", "https://www.argos.co.uk/vp/oos/ps5.html?clickSR=slp:term:ps5:4:299:1"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {

            let instock = []
            let errors = []

            await page.goto('https://www.argos.co.uk/search/ps5/category:798632/')
            await page.waitForSelector('.search')

            ////div[@data-test='component-product-card']
            const productCards = await page.$x(`//div[@data-test='component-product-card']`)

            let count = 0
            for (const product of productCards) {
                if (count >= 2) break;

                try
                {
                    let [title] = await page.$x(`//a[@data-test='component-product-card-title']`)
                    let titleText = await title.evaluate(el => el.innerText)
    
                    if (titleText == "Sony Playstation 5 Console" || titleText == "Sony Playstation 5 Digital Console") 
                    {
                        let [button] = await product.$x(`//a[@data-test='component-button']`)
                        let buttonText = await button.evaluate(el => el.innerText)
        
                        if (buttonText.toLowerCase() != "more details")
                        {
                            let [price] = await product.$x(`//div[@data-test='component-product-card-price']/strong`)
                            let priceText = await price.evaluate(el => el.innerText)

                            titleText = titleText.replace(/Playstation 5/gmi, 'PS5')
                            instock.push({ name: titleText, price: priceText, retailer: 'Argos', date: new Date(), url: link, pingViaRetailer: false})
                            count++
                        }
                    }
                }
                catch (err)
                {
                    errors.push({ for: 'https://www.argos.co.uk/search/ps5/category:798632/', err: err})
                }

                
            }

            res({instock: instock, errors: errors})

        })
    }

}
// exports.check = async function(browser, notifications) {
//     // let page = await browser.newPage()

//     // await page.goto('https://www.argos.co.uk/search/playstation-5/?clickOrigin=searchbar:home:term:playstation+5')
//     // await page.waitForSelector('.search')

//     // const products = await page.$$('a')

//     // let deadman = false
//     // for (let i = 0; i < products.length; i++)
//     // {
//     //     let href = await products[i].evaluate(x => x.getAttribute('href'))

//     //     if (href == '//www.argos.co.uk/list/shop-ps5-games-and-accessories-now/?tag=ar:search:m020:ps5-no-stock')
//     //     {
//     //         deadman = true
//     //     }


//     //     if (i == products.length - 1)
//     //     {
//     //         if (!deadman)
//     //         {
//     //             notifications.SendNotification("https://www.argos.co.uk/search/playstation-5/?clickOrigin=searchbar:home:term:playstation+5", GPU_SEARCH_TERMS[i])
                
//     //         }
//     //             //notifications.send("843542729581527081", "l82LN9OdC04mtuFZoyWx1Wlr_lJPbxydYECFa-u6EMcgEv6iolGopJexIvLBf_FMas-j", "https://www.argos.co.uk/search/playstation-5/?clickOrigin=searchbar:home:term:playstation+5", "Signs of Argos Restocking: ")
//     //     }
//     // }

 
//     // await page.close()
// }

module.exports = ArgosPS5