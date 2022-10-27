const Check = require('../../check.js')
const Promise = require('promise')

class JohnlewisXbox extends Check {



    constructor() {
        super("John Lewis Xbox")
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            await page.goto('https://www.johnlewis.com/browse/electricals/gaming/xbox/console/_/N-a74Z1z0pdgi')
            await page.waitForSelector('#main-content')

            ////div[@data-test='component-product-card']
            const productCards = await page.$x(`.//section[@data-test='product-card']`)
            notifications.logger.info(productCards.length)

            let count = 0
            for (const product of productCards) {
                try {
                    let [title] = await product.$x(`.//div[@data-test='product-title']`)
                    let titleText = await title.evaluate(el => el.innerText)

                    if (titleText.includes('Xbox Series X'))
                    {
                        let [outofstock] = await product.$x(`.//p[contains(., 'Out of stock')]`)

                        if (!outofstock) {
                            let [priceElement] = await title.$x(`..//div[contains(., '£')]`)
                            let price = await priceElement.evaluate(el => el.innerText)
                            price = price.replace('£', '')
    
                            let link = await title.evaluate(e => e.parentNode.getAttribute("href"))
    
                            instock.push({ name: titleText, price: price, retailer: 'John Lewis', date: new Date(), url: 'https://www.johnlewis.com/' + link, role: 'XSX', pingViaRetailer: false })
                            count++
                        }
                    }
                }
                catch (err) {
                    errors.push({ for: 'https://www.johnlewis.com/browse/electricals/gaming/xbox/console/_/N-a74Z1z0pdgi', err: err })
                }


            }

            res({ instock: instock, errors: errors })
        })
    }

}

module.exports = JohnlewisXbox

async function asd(browser, notifications) {


    // let products = await page.$$('.contentPanelWrapper h3')

    // for (let i = 0; i < products.length; i++)
    // {
    //     let name = await products[i].evaluate(x => x.innerText)

    //     if (name.toLowerCase().includes('playstation 5'))
    //     {
    //         let xd = await products[i].getProperty('parentNode')

    //         let buttons = await xd.$('span > a')

    //         let inner = await buttons.evaluate(el => el.innerText)
    //         if (!inner.toLowerCase().includes('out'))
    //         {
    //             let link = await buttons.evaluate(el => el.getAttribute('href'))

    //             notifications.SendNotification("https://www.game.co.uk/playstation-5", 'ps5')
    //         }
    //     }
    // }

    await page.close()
}