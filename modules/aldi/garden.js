const Promise = require('promise')
const Check = require('./../../check.js')

class AldiGarden extends Check {


    constructor() {
        super("Aldi Garden")
        this.products = ["https://www.aldi.co.uk/gardenline-premium-outdoor-kitchen/p/000000489816500", "https://www.aldi.co.uk/steel-chimenea-square/p/710106465410600", "https://www.aldi.co.uk/intex-spa-pool/p/803977452873600",
        "https://www.aldi.co.uk/gardenline-kamado-ceramic-egg-bbq/p/710081460879600", "https://www.aldi.co.uk/gardenline-round-steel-chimenea/p/701436333197900", "https://www.aldi.co.uk/philips-perfect-draft-machine/p/713506473825800",
        "https://www.aldi.co.uk/gardenline-premium-outdoor-kitchen/p/000000489816500", "https://www.aldi.co.uk/crane-inflatable-kayak/p/805062477482200",
        "https://www.aldi.co.uk/gardenline-dual-fuel-bbq/p/709910444155400", "https://www.aldi.co.uk/gardenline-large-hanging-egg-chair/p/805679515188902",
        "https://www.aldi.co.uk/summer-waves-14ft-rattan-frame-pool/p/804931466770800", "https://www.aldi.co.uk/gardenline-outdoor-log-burner/p/805291498849200",
        "https://www.aldi.co.uk/summer-waves-12ft-metal-frame-pool/p/805404458987000", "https://www.aldi.co.uk/gardenline-decorative-gazebo/p/709940453422200"]
    }

    runCheck(browser, page, notifications) {
        return new Promise(async (res, rej) => {
            let instock = []
            let errors = []

            for (let i = 0; i < this.products.length; i++) {
                try {
                    if (page.isClosed()) continue

                    await page.goto(this.products[i])
                    await page.waitForSelector('.product-price__value')
                    let priceInner = await page.$eval(".product-price__value", el => el.innerText)

                    if (!priceInner.includes('longer'))
                    {
                        let add_to_cart = await page.$('button.product-details__cta.js-product-cta.button.button--big.button--rectangle.button--transactional:not([disabled])')
                        let name = await page.$eval("h1", el => el.innerText)
                    
                        if (add_to_cart && !isNaN(priceInner)) {
    
                            
                            instock.push({ name: name, price: priceInner, retailer: "aldi", date: new Date(), url: page.url(), pingViaRetailer: true })
    
                        }
                    }
                    
                }
                catch (err) {
                    let time = new Date()
                    let path = "./screenshots/" + time.getUTCMilliseconds() + '.png'

                    let error = {for: this.products[i], err: err}

                    if (!page.isClosed()) {
                        await page.screenshot({ path: path, fullPage: true})

                        error.ss = path
                    }

                    errors.push(error)
                }

            }

            if (page.isClosed()) 
            {

            }

            res({instock: instock, errors: errors})

        })
    }
}

module.exports = AldiGarden