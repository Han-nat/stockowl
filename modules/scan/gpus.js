const Check = require('../../check.js')
const GPU_SEARCH_TERMS = ["3060", "3060 Ti", "3070", "3080", "3090", "6700", "6800", "6900"]

class Scan extends Check {

    constructor() {
        super("Scan Nvidia")
        this.products = ["https://www.scan.co.uk/shop/computer-hardware/gpu-nvidia-gaming/3175/3176/3177/3221/3257/3350/3353"]
        this.artificialDelay = 300000
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                page.setDefaultTimeout(30000)
                let instock = []
                let errors = []
                for (let i = 0; i < this.products.length; i++)
                {
                    try
                    {
                        await page.goto(this.products[i])

                        await page.waitForXPath(`//h2/a[contains(., 'GeForce RTX 3060 Graphics Cards')]`)
        
                        let products = await page.$$('.product')

                        for (let j = 0; j < products.length; j++)
                        {
                            let product = products[j]

                            let buyButton = await product.$('.buyButton')
                            if (buyButton)
                            {
                                let price = await product.$eval('.price', el => el.innerText)
                                let titleElement = await product.$('.description > a')
                                let title = await titleElement.evaluate(el => el.innerText)

                                if (GPU_SEARCH_TERMS.some(el => title.toLowerCase().includes(el)))
                                {
                                    let link = `https://www.scan.co.uk${await titleElement.evaluate(el => el.getAttribute('href'))}`
                                
                                    instock.push({ name: title, price: price, retailer: "scan", date: new Date(), url: link })
                                }
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

module.exports = Scan