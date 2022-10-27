const Check = require('../../check.js')
const GPU_SEARCH_TERMS = ["6600", "6700", "6800", "6900"]

class Scan extends Check {

    constructor() {
        super("Scan AMD")
        this.products = ["https://www.scan.co.uk/shop/computer-hardware/gpu-amd-gaming/amd-radeon-rx-6600-xt-pcie-40-graphics-cards", "https://www.scan.co.uk/shop/computer-hardware/gpu-amd-gaming/amd-radeon-rx-6700-xt-pcie-40-graphics-cards", 
        "https://www.scan.co.uk/shop/computer-hardware/gpu-amd-gaming/amd-radeon-rx-6900-xt-pcie-40-graphics-cards", "https://www.scan.co.uk/shop/computer-hardware/gpu-amd-gaming/3217/3218"]
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