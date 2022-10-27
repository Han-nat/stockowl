const Check = require('./../../check.js')
const Promise = require('promise')

class GamePS5 extends Check {



    constructor() {
        super("game ps5")
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            await page.goto('https://www.game.co.uk/playstation-5')
            await page.waitForSelector('#contentPanels3')

            let instock = []
            let errors = []
            //#contentPanels3 span.sectionButton a
            let consoles = await page.$$('#contentPanels3 div.contentPanelItem')
            for (let i = 0; i < consoles.length; i++)
            {
                try
                {
                    let consoleProducts = consoles[i]
                
                    let stock = await consoleProducts.$('span.sectionButton a')

                    let aText = await stock.evaluate(el => el.innerText)
                    let link = await stock.evaluate(el => el.getAttribute('href'))
        
                    if (aText.toLowerCase() != "out of stock")
                    {
                        let header = await consoleProducts.$eval('h3', el => el.innerText)
                        header = header.replace(/Playstation 5/gmi, 'PS5')

                        instock.push({ name: header, price: header == 'PS5' ? '449.99' : '359.99', retailer: 'Game', date: new Date(), url: 'https://www.game.co.uk' + link, pingViaRetailer: false})
                    }
                }
                catch (err)
                {
                    console.log(err)
                    errors.push({ for: 'https://www.game.co.uk/playstation-5', err: err })
                }
            }

            res({instock: instock, errors: errors})
        })
    }

}

module.exports = GamePS5

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