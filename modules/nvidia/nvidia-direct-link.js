var Promise = require('promise');
const Check = require('../../check.js')

let url = "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&gpu=RTX%203090,RTX%203080,RTX%203050%20Ti,RTX%203060,RTX%203050,RTX%203080%20Ti,RTX%203070%20Ti,RTX%203060%20Ti,RTX%203070&manufacturer=NVIDIA&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0"

class NVidiaStore extends Check {

    constructor() {
        super("founders scan")
        this.products = ["https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203060%20Ti&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0",
        "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203070&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0",
        "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203070%20Ti&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0",
        "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203080&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0",
        "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203080%20Ti&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0",
        "https://shop.nvidia.com/en-gb/geforce/store/gpu/?page=1&limit=9&locale=en-gb&category=GPU&manufacturer=NVIDIA&gpu=RTX%203090&gpu_filter=RTX%203090~1,RTX%203080%20Ti~1,RTX%203080~1,RTX%203070%20Ti~1,RTX%203070~1,RTX%203060%20Ti~1,RTX%203060~0,RTX%203050%20Ti~0,RTX%203050~0,RTX%202080%20Ti~0,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060%20SUPER~0,RTX%202060~0,GTX%201660%20Ti~0,GTX%201660%20SUPER~0,GTX%201660~0,GTX%201650%20Ti~0,GTX%201650%20SUPER~0,GTX%201650~0"]
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (resolve, reject) => {
            try {
                let instock = []
                let errors = []

                for (let i = 0; i < this.products.length; i++) {
                    try {
                        await page.goto(this.products[i])
                        await page.waitForSelector('#main-header')
    
                        let [BUYNOW] = await page.$x("//span[contains(., 'BUY NOW')]")
                        if (BUYNOW) {
                            let name = await page.$eval("h2.name", el => el.innerText)
                            let price = -1
                            let divs = await page.$$('.buy > div')
                            for (let j = 0; j < divs.length; j++) {
                                let [text, display] = await divs[j].evaluate(el => [el.innerText, el.style.display])
    
                                if (display == 'none') {
                                    try {
    
                                        let json = JSON.parse(text)
    
                                        if (json.length == 1) {
                                            if (json[0].purchaseLink != undefined) {
                                                instock.push({ name: name, price: price, retailer: "Founders Edition Cards NVidia/Scan", date: new Date(), url: json[0].purchaseLink })
    
                                            }
                                        }
                                    }
                                    catch (error) {
                                        console.log(error)
                                        continue
                                    }
                                }
                            }
                        }
                    }
                    catch (err) {
                        errors.push({ for: page.url(), err: err })
                    }
                    
                }

                resolve({instock: instock, errors: errors})

            }
            catch (err) {
                console.log(err)
                reject(err)
            }

            // try {
            //     const page = await browser.newPage()
            //     await page.goto(url)
            //     await page.waitForSelector('.featured-buy-link')

            //     const buy_links = await page.$$('.featured-buy-link')
            //     const products = await page.$$('.details-col')

            //     let instock = []

            //     for (let j = 0; j < products.length; j++) {
            //         let nameHeader = await products[j].$('.name')
            //         let name = await nameHeader.evaluate((el) => el.innerText.toLowerCase())
            //         let price = await products[j].$eval('.price', el => el.innerText)

            //         if (j < buy_links.length) {
            //             let xd = await buy_links[j].evaluate((el) => el.innerText)

            //             if (!xd.toLowerCase().includes('out')) {
            //                 instock.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() })
            //                 // if (name.includes('3060 ti')) {

            //                 //     notifications.AddStockReport("NVidia", name, price, new Date(), '')
            //                 //     notifications.send(url, '3060 ti')
            //                 // }
            //                 // else if (name.includes('3070 ti')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3070 ti')
            //                 // }
            //                 // else if (name.includes('3060')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3060')
            //                 // }
            //                 // else if (name.includes('3070')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3070')
            //                 // }
            //                 // else if (name.includes('3080 ti')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3080 ti')
            //                 // }
            //                 // else if (name.includes('3080')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3080')
            //                 // }
            //                 // else if (name.includes('3090')) {
            //                 //     instock.push(products.push({ name: name, price: price, retailer: "NVidia", date: new Date(), url: page.url() }))
            //                 //     notifications.send(url, '3090')
            //                 // }


            //             }
            //         }
            //     }

            //     await page.close()
            //     resolve(instock)
            // }
            // catch (e) {
            //     reject(e)
            // }
        })
    }
}

module.exports = NVidiaStore
