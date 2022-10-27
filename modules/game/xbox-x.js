const Check = require('./../../check.js')
const Promise = require('promise')

class GameXboxX extends Check {



    constructor() {
        super("game xbox x")
        this.products = ['https://www.game.co.uk/en/xbox-series-x-2831406', 'https://www.game.co.uk/en/xbox-all-access-xbox-series-x-2836838']
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < this.products.length; i++) {
                try {
                    await page.goto(this.products[i])
                    await page.waitForSelector('h1')

                    let priceContainer = await page.$('#pdpPriceContainers .btnMint')

                    if (priceContainer)
                    {
                        let header = await page.$eval('h1', (e) => e.innerText)
                        let aTag = await priceContainer.$('a')
                        let priceElement = await priceContainer.$('.btnPrice')

                        let directLink = await aTag.evaluate(e => e.getAttribute('href'))
                        directLink = "https:" + directLink

                        let price = priceElement != null ? await priceElement.evaluate((e) => e.innerText) : '-1' 
                        price = price.replace('£', '')

                        instock.push({ name: header, price: price, retailer: 'Game', date: new Date(), url: this.products[i], pingViaRetailer: false, role: 'XSX', note: `This link may add the console directly to your basket, however, you may need to go back to Game's website after. ${directLink}`})
                    }

                }
                catch (err) {
                    errors.push({ for: page.url(), err: err})
                }
            }
        

            res({instock: instock, errors: errors})
        })
    }

}

module.exports = GameXboxX

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