const Check = require('./../../check.js')

class GamesworkshopW40k extends Check {



    constructor() {
        super("Games Workshop W40K")
        this.products = ["https://www.games-workshop.com/en-GB/Warhammer-40-000?N=1125463923+3206404541&Nr=AND(sku.siteId%3AGB_gw%2Cproduct.locale%3Aen_GB_gw)&Nrs=collection()%2Frecord[product.startDate+%3C%3D+1628542980000+and+product.endDate+%3E%3D+1628542980000]&view=all"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let products = []
                let errors = []

                for (let i = 0; i < this.products.length; i++) {
                    let url = this.products[i]
                    try {
                        await page.goto(url)

                        await page.waitForSelector('.product-grid')
                        //
                        let stock = await page.$$('.product-grid > li')

                        for (let j = 0; j < stock.length; j++) {
                            let product = stock[j]

                            let canBuy = await product.$('span.add-to-cart_text')
                            if (canBuy) {

                                let name = await product.$eval('a.product-item__name', el => el.innerText)
                                let price = await product.$eval('.price', el => el.innerText)
                                price = price.replace('£', '')

                                price = Number(price)

                                if (price >= 80 && price <= 150) {
                                    products.push({ name: name, price: price, retailer: "Games Workshop", role: "Warhammer", date: new Date(), url: page.url()})
                                }
                            }

                        }


                    }
                    catch (err) {
                        errors.push({ for: url, err: err })
                    }

                }

                resolve({ instock: products, errors: errors })
            }
            catch (e) {
                reject(e)
            }
        })

    }

}

module.exports = GamesworkshopW40k

// exports.register = function()
// {
//     return { name:  }
// }

// exports.check = async function(browser, notifications) {




// }