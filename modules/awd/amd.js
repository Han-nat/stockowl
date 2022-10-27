const Check = require('./../../check.js')

class AWD extends Check {

    constructor() {
        super("AWD GPUs")
        this.products = ["https://www.awd-it.co.uk/components/graphics-cards/radeon.html?features_hash=24-7283-6948-7061-7086", "https://www.awd-it.co.uk/components/graphics-cards.html?features_hash=24-7189-6974-6631-7588-6600-7664-6596", "https://www.awd-it.co.uk/components/graphics-cards-page-2.html?features_hash=24-7189-6974-6631-7588-6600-7664-6596", "https://www.awd-it.co.uk/components/graphics-cards-page-3.html?features_hash=24-7189-6974-6631-7588-6600-7664-6596"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let instock = []
                let errors = []
                for (let i = 0; i < this.products.length; i++)
                {
                    try
                    {
                        await page.goto(this.products[i])

                        await page.waitForSelector(`.grid-list`)
        
                        let products = await page.$$('.vs-grid')
                        
                        for (let j = 0; j < products.length; j++)
                        {
                            let product = products[j]

                            let buyButton = await product.$('div.product-description  a.vs-add-to-cart')
                            if (buyButton)
                            {
                                let price = await product.$eval('.ty-price', el => el.innerText)
                                let titleElement = await product.$('a.product-title')
                                let title = await titleElement.evaluate(el => el.innerText)
                                let link = await titleElement.evaluate(el => el.getAttribute('href'))
                                
                                instock.push({ name: title, price: price, retailer: "AWD", date: new Date(), url: link })
                            }
                        }

                    }
                    catch (err)
                    {
                        errors.push({ for: page.url(), err: err })
                    }

                }
                //console.log(instock)
                resolve({instock: instock, errors: errors})
            }
            catch (e) {
                reject(e)

            }
        })
    }

}

module.exports = AWD