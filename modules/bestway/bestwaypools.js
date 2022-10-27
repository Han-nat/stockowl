const Check = require('./../../check.js')

class BestwayPools extends Check {



    constructor() {
        super("bestway pools")
        this.products = ["https://www.bestwaystore.co.uk/12-x39-5-steel-pro-frame-pool-set.html", "https://www.bestwaystore.co.uk/12-x30-steel-pro-frame-pool-set.html", "https://www.bestwaystore.co.uk/12-x39-5-steel-pro-frame-pool-set.html", 
        "https://www.bestwaystore.co.uk/9-10-x6-7-x26-steel-pro-frame-pool.html", "https://www.bestwaystore.co.uk/14ft-steel-pro-max-round-pool-set.html", "https://www.bestwaystore.co.uk/hydro-force-cove-champion-kayak-1-person-with-oars.html", "https://www.bestwaystore.co.uk/lite-rapid-x2-kayak.html"]
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
                
                        await page.waitForSelector('.product-add-wrapper')
                
                        let canBuy = await page.$('.product-add-form div.available > span')
                        if (canBuy)
                        {
                            let name = await page.$eval('h1.page-title > span', el => el.innerText)
                            let price = await page.$eval('div.product-info-price .price', el => el.innerText)
            
                            products.push({ name: name, price: price.replace('£', ''), retailer: "bestway", date: new Date(), url: page.url(), pingViaRetailer: true})
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

module.exports = BestwayPools

// exports.register = function()
// {
//     return { name:  }
// }

// exports.check = async function(browser, notifications) {

    


// }