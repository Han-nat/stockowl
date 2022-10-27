const Check = require('../../check.js')

const GPU_SEARCH_TERMS = ["6600", "6700", "6800", "6900"]

class EbuyerAMD extends Check {



    constructor() {
        super("Ebuyer AMD")
        this.products = ["https://www.ebuyer.com/store/Components/cat/Graphics-Cards-AMD/subcat/-AMD-RX-6600-XT", "https://www.ebuyer.com/store/Components/cat/Graphics-Cards-AMD/subcat/AMD-RX-6700-XT",
        "https://www.ebuyer.com/store/Components/cat/Graphics-Cards-AMD/subcat/AMD-RX-6800", "https://www.ebuyer.com/store/Components/cat/Graphics-Cards-AMD/subcat/AMD-RX-6800-XT", "https://www.ebuyer.com/store/Components/cat/Graphics-Cards-AMD/subcat/AMD-RX-6900-XT"]
    }

    async runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            let instock = []
            let errors = []

            for (let i = 0; i < this.products.length; i++) {
                try
                {
                    await page.goto(this.products[i])

                    await page.waitForSelector('#grid-view')
    
                    let products = await page.$$('.grid-item')
    
                    for (let j = 0; j < products.length; j++) {
                        try
                        {
                            
                            let product = products[j]
                        
                            let addToBasketButton = await product.$('button.button--mini-basket')
                            if (addToBasketButton)
                            {
                                let title = await product.$('h3.grid-item__title > a')
                                let name = await title.evaluate(el => el.innerText)

                                if (!name.includes('20') && !name.includes('+'))
                                {
                                    let priceNode = await product.$('p.price')

                                    await priceNode.$$eval('span', (el) => {
                                        el.forEach(span => {
                                            span.parentNode.removeChild(span)
                                        })
                                    })
                                    
                                    let price = await product.$eval('p.price', el => el.innerText)
                                    let url = await title.evaluate(el => el.getAttribute('href'))
    
                                    instock.push({ name: name, price: price, retailer: "ebuyer", date: new Date(), url: `https://www.ebuyer.com${url}` })
                                }
                            }
                        }
                        catch (err)
                        {
                            errors.push({for: page.url(), err: err})
                        }
    
                    }
                }
                catch (err)
                {
                    errors.push({for: page.url(), err: err})
                }
            }

            resolve({instock: instock, errors: errors})

        })


        return new Promise(async (resolve, reject) => {
            let instock = []

            for (let i = 0; i < 2; i++) {
                await page.goto('https://www.ebuyer.com/store/Components/cat/Graphics-Cards-Nvidia/subcat/GeForce-RTX-3060?page=' + (i + 1))

                await page.waitForSelector('#grid-view')

                let products = await page.$$('.grid-item')

                for (let j = 0; j < products.length; j++) {
                    let addToBasket = await products[j].$x("//button[contains(., 'Add to Basket')]")
                    let [moreInfo] = await products[j].$x("//a[contains(., 'More Info')]")
                    let priceContainer = await products[j].$("p > .price")

                    let price = "unknown"
                    if (priceContainer) {
                        price = await priceContainer.evaluate(el => el.innerText)
                    }

                    let productLink = "https://www.ebuyer.com" + await moreInfo.evaluate(el => el.getAttribute('href'))
                    let productName = await products[j].$('.grid-item__title > a')

                    if (addToBasket[0]) {
                        instock.push({ name: productName, price: price, retailer: "ebuyer", date: new Date(), url: productLink })
                    }

                }
            }

            for (let i = 0; i < 2; i++) {
                await page.goto('https://www.ebuyer.com/store/Components/cat/Graphics-Cards-Nvidia/subcat/GeForce-RTX-3060-Ti?page=' + (i + 1))

                await page.waitForSelector('#grid-view')

                let products = await page.$$('.grid-item')

                for (let j = 0; j < products.length; j++) {
                    let addToBasket = await products[j].$x("//button[contains(., 'Add to Basket')]")
                    let [moreInfo] = await products[j].$x("//a[contains(., 'More Info')]")
                    let priceContainer = await products[j].$("p > .price")

                    let price = "unknown"
                    if (priceContainer) {
                        price = await priceContainer.evaluate(el => el.innerText)
                    }

                    let productLink = "https://www.ebuyer.com" + await moreInfo.evaluate(el => el.getAttribute('href'))
                    let productName = await products[j].$('.grid-item__title > a')

                    if (addToBasket[0]) {
                        instock.push({ name: productName, price: price, retailer: "ebuyer", date: new Date(), url: productLink })
                    }

                }
            }

            for (let i = 0; i < 2; i++) {
                await page.goto('https://www.ebuyer.com/store/Components/cat/Graphics-Cards-Nvidia/subcat/GeForce-RTX-3070?page=' + (i + 1))

                await page.waitForSelector('#grid-view')

                let products = await page.$$('.grid-item')

                for (let j = 0; j < products.length; j++) {
                    let addToBasket = await products[j].$x("//button[contains(., 'Add to Basket')]")
                    let [moreInfo] = await products[j].$x("//a[contains(., 'More Info')]")
                    let priceContainer = await products[j].$("p > .price")

                    let price = "unknown"
                    if (priceContainer) {
                        price = await priceContainer.evaluate(el => el.innerText)
                    }

                    let productLink = "https://www.ebuyer.com" + await moreInfo.evaluate(el => el.getAttribute('href'))
                    let productName = await products[j].$('.grid-item__title > a')

                    if (addToBasket[0]) {
                        instock.push({ name: productName, price: price, retailer: "ebuyer", date: new Date(), url: productLink })
                    }

                }
            }

            await page.goto('https://www.ebuyer.com/store/Components/cat/Graphics-Cards-Nvidia/subcat/GeForce-RTX-3080')

            await page.waitForSelector('#grid-view')

            let products = await page.$$('.grid-item')

            for (let j = 0; j < products.length; j++) {
                let addToBasket = await products[j].$x("//button[contains(., 'Add to Basket')]")
                let [moreInfo] = await products[j].$x("//a[contains(., 'More Info')]")
                let priceContainer = await products[j].$("p > .price")

                let price = "unknown"
                if (priceContainer) {
                    price = await priceContainer.evaluate(el => el.innerText)
                }

                let productLink = "https://www.ebuyer.com" + await moreInfo.evaluate(el => el.getAttribute('href'))
                let productName = await products[j].$('.grid-item__title > a')

                if (addToBasket[0]) {
                    instock.push({ name: productName, price: price, retailer: "ebuyer", date: new Date(), url: productLink })
                }

            }



            for (let i = 0; i < 2; i++) {
                await page.goto('https://www.ebuyer.com/store/Components/cat/Graphics-Cards-Nvidia/subcat/GeForce-RTX-3090?page=' + (i + 1))

                await page.waitForSelector('#grid-view')

                let products = await page.$$('.grid-item')

                for (let j = 0; j < products.length; j++) {
                    let addToBasket = await products[j].$x("//button[contains(., 'Add to Basket')]")
                    let [moreInfo] = await products[j].$x("//a[contains(., 'More Info')]")
                    let priceContainer = await products[j].$("p > .price")

                    let price = "unknown"
                    if (priceContainer) {
                        price = await priceContainer.evaluate(el => el.innerText)
                    }

                    let productLink = "https://www.ebuyer.com" + await moreInfo.evaluate(el => el.getAttribute('href'))
                    let productName = await products[j].$('.grid-item__title > a')

                    if (addToBasket[0]) {
                        instock.push({ name: productName, price: price, retailer: "ebuyer", date: new Date(), url: productLink })
                    }
                }

            }



            await page.close()
        })
    }

}

module.exports = EbuyerAMD

// exports.register = function () {
//     return { name: "ebuyer nvidia gpus" }
// }


// exports.check = async function (browser, notifications) {

// }