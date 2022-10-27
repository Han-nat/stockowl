const Check = require('./../../check.js')

class BeerWulfBeerCases extends Check {



    constructor() {
        super("beerwulf beercases")
        this.products = ["https://www.beerwulf.com/en-gb/p/beercases/blade-heineken-8l-keg", 
                            "https://www.beerwulf.com/en-gb/p/beercases/blade-birra-moretti-8l-keg",
                            "https://www.beerwulf.com/en-gb/p/beercases/blade-tiger-8l-keg",
                            "https://www.beerwulf.com/en-gb/p/beercases/blade-heineken-zero-8l-keg",
                            "https://www.beerwulf.com/en-gb/p/beercases/blade"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try
            {
                let products = []
                let errors = []
        
                for (let i = 0; i < this.products.length; i++) 
                {
                    let url = this.products[i]
                    try
                    {
                        await page.goto(url)
                
                        await page.waitForSelector('.header-row')
                
                        let canBuy = await page.$('.add-to-cart')
                        if (canBuy)
                        {
                            let name = await page.$eval('h1', el => el.innerText)
                            let prices = await page.$$('.price')

                            let price
                            if (prices.length > 1)
                            {
                                price = await prices[1].evaluate(el => el.innerText)
                            }
                            else
                            {
                                price = await prices[0].evaluate(el => el.innerText)
                            }

                            
                            
                            products.push({ name: name, price: price.replace('£', '').replace(' ', ''), retailer: "beerwulf", date: new Date(), url: page.url(), pingViaRetailer: true})
                        }
                    }
                    catch (err)
                    {
                        errors.push({ for: url, err: err })
                    }
                    
                }
            
                resolve({instock: products, errors: errors})
            }
            catch (e)
            {
                reject(e)
            }
        })
        
    }

}

module.exports = BeerWulfBeerCases

// exports.register = function()
// {
//     return { name:  }
// }

// exports.check = async function(browser, notifications) {

    


// }