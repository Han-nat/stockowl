const Check = require('./../../check.js')
const Promise = require('promise')

class VeryPS5 extends Check {



    constructor() {
        super("very ps5")
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            res({ instock: {}, errors: {}})
            return
            await page.goto('https://www.very.co.uk/gaming-dvd/playstation-5-consoles/e/b/124301.end')
            await page.waitForSelector('.productList')

            let instock = []
            let errors = []
            //#contentPanels3 span.sectionButton a
            let consoles = await page.$$('li.product')
            for (let i = 0; i < consoles.length; i++)
            {
                try
                {
                    let consoleProducts = consoles[i]
                
                    let titleElement = consoleProducts.$('span.productBrandDesc')
                    let title = titleElement != null ? await titleElement.evaluate(e => e.innerText) : 'PS5'

                    let priceElement = consoleProducts.$('dd.productPrice')
                    let price = titleElement != null ? await titleElement.evaluate(e => e.innerText) : 'PS5'
                    let priceRegex = new RegExp('/(\£[0-9]+(\.[0-9]{2})?)/', 'gm')

                    let priceArray = priceRegex.exec(price)
                    
                    if (priceArray != null)
                    {
                        price = priceArray[0].replace('£', '')
                    }
                    else
                    {
                        price = '-1'
                    }

                    let stock = await consoleProducts.$('a.productTitle')

                    let link = await stock.evaluate(el => el.getAttribute('href'))
        
                    instock.push({ name: title, price: price, retailer: 'Very', date: new Date(), url: link, role: 'PS5', pingViaRetailer: false})
                }
                catch (err)
                {
                    console.log(err)
                    errors.push({ for: 'very ps5', err: err })
                }
            }

            res({instock: instock, errors: errors})
        })
    }

}

module.exports = VeryPS5

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