const MongoClient = require('mongodb').MongoClient;
const BotNotifications = require('./notification.js').BotNotifications
const AutoUpdater = require('./autoupdate/update.js')
const cron = require('node-cron')
const Discord = require('discord.js')
const fs = require('fs')
const pathModule = require('path')

class Bot {

    constructor(connectionUri, discordClient, cluster, checks, logger) {
        this.checks = checks

        this._connectionUri = connectionUri
        this._discordClient = discordClient
        this._cluster = cluster
        this._currentRunningChecks = []
        this._logger = logger
        this._shouldRestart = false
        this._currentCycles = {}
        this._currentTaskCount = 0
        this._designatedTasks = []
        this._autoUpdater = new AutoUpdater(this, this._logger)
        this._autoUpdater.Update(cron)
        this._shouldManageCommands = false
        this._delaying = []
        this._statusChannelId = 877869853745225768
    }

    async CheckHive() {

        for (let i = 0; i < this._delaying.length; i++)
        {
            let delayedCheck = this._delaying[i]
            if (delayedCheck.enableOn <= Date.now())
            {
                this.checks.push(delayedCheck.check)
                console.log(this._delaying.splice(i, 1))
            }
        }

        fs.readdir('./screenshots', (err, files) => {
            if (err) return

            for (const file of files) {
                fs.unlink(pathModule.join('./screenshots', file), err => {})
            }
        })

        if (process.env.NODE_ENV !== 'production') {
            this._designatedTasks = ["Scan Nvidia", "Scan AMD", "CCL nvidia gpus", "Ebuyer AMD", "CCL AMD gpus"]
            //this._designatedTasks = this.checks.map(el => el.name)  
            //['game ps5', 'argos ps5']
            //['Amazon A']

            this._logger.info('Checking hive in debug mode. Only setting designated tasks to ' + this._designatedTasks)

            return
        }

        this._logger.info('Checking hive')

        let products = await this._hiveProducts.find({})
        products = await products.toArray()
        //this._logger.info(`Checking for new product links ${products}`)

        for (const product of products) {
            if (this.isValidCheck(product["checkName"])) {
                let index = this.checks.findIndex(check => {
                    return check.name == product["checkName"]
                })
                if (index != -1 && !this.checks[index].products.includes(product["link"])) {
                    this.checks[index].products.push(product.link)
                    this._logger.info(`Added new product to ${product["checkName"]}`)
                }
            }
        }

        try {
            let bot = await this._hive.findOne({ "botname": this._botName })

            if (bot) {
                
                let updatedObject = { lastActive: new Date() }

                if (JSON.stringify(this._designatedTasks) !== JSON.stringify(bot.scheduled)) {

                    updatedObject.availableChecks = this.checks.map(el => {

                        if (Array.isArray(el)) {
                            return el[0].name
                        }

                        return el.name

                    })
                    
                    this._designatedTasks = bot.scheduled
                    updatedObject.current = this._designatedTasks

                }

                

                this._hive.updateOne({ "botname": this._botName }, {
                    $set: updatedObject
                })
            } else {
                this.RegisterToHive()
            }

        }
        catch (err) {
            console.error(err)
        }

        this._logger.info(`"${this._botName} is running with a task count of ${this._currentTaskCount}`)
    }

    async RunSmartChecks() {
        /*
        *   This runs everytime the puppeteer cluster executes a task
        */
        try {
            await this._cluster.task(async ({ page, data: check }) => {
                page.setDefaultTimeout(15000)
                this._currentTaskCount--

                let startTime = Date.now()

                try {
                    console.log(`Running ${check.name}`)
                    /*
                    * Run the check and wait for the response
                    */
                    let res = await check.runCheck(this._browser, page, this._botNotifications)

                    /*
                    * Get execution time to determine if it needs to be split in future
                    */
                    let executionTime = (Date.now() - startTime) / 1000

                    if (res != undefined) {
                        let products = res.instock
                        let errors = res.errors

                        if (products != undefined) {
                            products.forEach(product => {
                                product.price = product.price.replace('£', '')
                                this._botNotifications.SendNotification(product, product.name, false)
                            })
                        }

                        if (errors != undefined) {
                            errors.forEach(error => {
                                if (error === undefined) {
                                    this._logger.warn(`${check.name} produced a invalid error`)
                                }
                                else {
                                    this._logger.warn(`Encounted an error while scraping: ${error.for}. ${error.err}`)


                                    let index = this.checks.findIndex(el => (Array.isArray(el) && el[0].name == check.name) || el.name == check.name)

                                    this._delaying.push({ check: this.checks.splice(index, 1)[0], enableOn: Date.now() + check.timeout, addedOn: Date.now() })

                                    check.timeout *= 2

                                    if (error.ss)
                                    {
                                        let channel = this._discordClient.channels.cache.get('858301136568844308')

                                        if (channel)
                                        {
                                            channel.send(`Encounted an error while scraping: ${error.for}. ${error.err}`, { files: [
                                                error.ss
                                            ] })
                                        }
                                        else
                                        {
                                            this._logger.error('Channel is null')
                                        }
                                    }
                                }

                            })

                            if (check.artificialDelay != 0)
                            {
                                let index = this.checks.findIndex(el => (Array.isArray(el) && el[0].name == check.name) || el.name == check.name)

                                if (index != -1)
                                {
                                    this._delaying.push({check: this.checks.splice(index, 1)[0], enableOn: Date.now() + check.artificialDelay, addedOn: Date.now()})
                                }

                            }

                            if (errors.length == 0)
                                check.timeout = check.defaultTimeout
                        }


                        //
                    }

                    /*
                    * If its taken longer than 15 seconds it can cause timeout errors from PuppeteerCluster that clog up the logs.
                    */
                    if (executionTime >= 30) {
                        this._logger.info(`Finished ${check.name} in ${executionTime}s`)
                        //Create a new array for the checks
                        let checkArray = []

                        //Make a copy of the checks
                        check.copyProducts()

                        //Create a new check from the original's path
                        let CheckClass = require(check.path)
                        let copyCheck = new CheckClass()

                        let splitAt = Math.floor(check.products.length / 2)
                        let split = check.products.slice(splitAt)

                        copyCheck.copyProducts()
                        copyCheck.products = split
                        check.products = check.products.slice(0, splitAt)

                        let outputs = this.checks.map(el => Array.isArray(el) ? el.map(e => e.name) : el.name)

                        let checkIndex = this.checks.indexOf(check)

                        if (checkIndex == -1) {
                            checkIndex = this.checks.findIndex(el => {
                                return Array.isArray(el) && el[0].name == check.name
                            })

                            this.checks[checkIndex] = this.checks[checkIndex].concat(copyCheck)
                        }
                        else {
                            let array = [this.checks[checkIndex], copyCheck]
                            this.checks[checkIndex] = array
                        }
                    }
                }
                catch (err) {
                    this._logger.info(`Got an error on ${check.name + i}`)
                    this._logger.error(err)
                }


            })
        }
        catch (e) {
            this._logger.error(e)
        }


        cron.schedule('2 * * * * *', async () => {

            this.checks.forEach(async module => {

                let modules = []

                if (!Array.isArray(module)) {
                    modules.push(module)
                }
                else {
                    modules = modules.concat(module)
                }

                for (const check of modules) {
                    if (this._designatedTasks.includes(check.name)) {

                        this._cluster.queue(check)
                        this._currentTaskCount++
                    }
                }
            })

            setTimeout(() => {
                this.CheckHive()
            }, 30000)

        })

    }

    async RegisterToHive() {
        if (process.env.NODE_ENV === 'production') {
            const net = require('net');
            const client = net.connect({ port: 80, host: "google.com" }, async () => {
                let bot = await this._hive.findOne({ "botname": client.localAddress })


                if (!bot) {
                    this._hive.insertOne({ botname: client.localAddress, scheduled: [], current: [], lastActive: new Date(), availableChecks: this.checks.map(el => el.name) })
                }

                this._logger.info(`Registering as ${client.localAddress}`)
                this._botName = client.localAddress
            });
        }

        this.CheckHive()
    }

    async StartChecks() {
        this.RunSmartChecks()
    }

    isValidUrl(url) {
        try {
            new URL(url)
        } catch (e) {
            return false;
        }
        return true;
    }

    isValidCheck(checkName) {
        return this.checks.some(el => el.name == checkName)
    }

    async Start() {
        //this._browser = await this._puppeteer.launch({ headless: false })  
        this._mongoClient = await MongoClient.connect(this._connectionUri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => { console.log(err) })
        this._hive = this._mongoClient.db('hivecontroller').collection('hive')
        this._hiveProducts = this._mongoClient.db('hivecontroller').collection('products')


        this.RegisterToHive()

        this._discordClient.once('ready', async () => {

            let statusChannel 
            if ((statusChannel = await this._discordClient.channels.cache.get(this._statusChannelId)) != undefined)             
            {
                this._statusChannel = statusChannel
            }

            if (this._discordClient.channels.cache.get('847139120132128808') == undefined) {
                console.log('big oof it aint working')
            }

            const discordChannel = await this._discordClient.channels.cache.get('847139120132128808')

            if (!this._mongoClient) {
                discordChannel.send('Failed to connect to db')
                return
            }

            //discordChannel.send('Bot Connected')

            this._botNotifications = new BotNotifications(this._discordClient, this._mongoClient.db('stock'), this._logger)
            await this._botNotifications.Start(this._registrationData)

            this.StartChecks()

        })

        process.on('SIGINT', async function() {
            await this._logger.info(`${this._botName} is restarting`)

            await this._cluster.close()
            await this._mongoClient.close()
            await this._discordClient.destroy()

            process.exit(0)
         })

        this._discordClient.on('message', message => {
            if (!this._shouldManageCommands) {
                if (message.content.startsWith('#')) {
                    if (message.member.roles.cache.some(r => r.name.toLowerCase() == "admin")) {
                        //1 == prefix length
                        const args = message.content.slice(1).trim().split(/ +/);
                        const commandName = args.shift().toLowerCase();

                        if (commandName == 'add') {
                            if (args.length == 2) {
                                if (this.isValidUrl(args[0])) {
                                    args[1] = args[1].replace('-', ' ')
                                    if (this.isValidCheck(args[1])) {
                                        let product = this._hiveProducts.insertOne({ checkName: args[1], link: args[0] })
                                        let embed = new Discord.MessageEmbed()
                                            .setTitle('New Product Added')
                                            .addFields(
                                                { name: 'Check', value: product.checkName },
                                                { name: 'Link', value: product.link }
                                            )

                                        message.channel.send(embed)
                                    }
                                }
                                else {
                                    message.channel.send('Invalid URL')
                                }
                            }
                            else {
                                message.channel.send('Invalid number of arguments to add a new product. Use #add <link> <exact-check-name>')
                            }
                        }
                        else if (commandName == 'list') {
                            if (args.length == 1) {
                                if (this.isValidCheck(args[0])) {
                                    const check = this.checks.find(element => element.name == args[0])

                                    let embed = new Discord.MessageEmbed()
                                        .setTitle(`Current Products on ${check.name}`)

                                    this.check.products.forEach(product => {
                                        embed.addField({ name: check.name, url: product })
                                    })
                                }
                            }
                            else {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle('Current Checks')

                                this.checks.forEach(check => {
                                    embed.addField({ name: check.name, value: "Products Checked: " + check.products.length })
                                })

                                message.channel.send('Use #list <check-name> to list products')
                            }
                        }
                    }
                }
            }
        })

        this._discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => { console.log(err) })

    }



}

module.exports = Bot


            // let productsByName = {}

            // products.forEach(el => {
            //     if (product.link != null && product.checkName != null) {
            //         if (productsByName[el.checkName] == undefined) 
            //             productsByName[el.checkName] = []

            //         productsByName[el.checkName].push(el.link)
            //     }

            // })

            // for (const checkName in productsByName) {
            //     let index = this.checks.findIndex(check => check.name == checkName)

            //     if (index != -1) {
            //         let productArray = this.checks[index].products

            //         for (const link of productArray)
            //         {
            //             if (productArray.includes(link))
            //                 continue

            //             productArray.push(link)
            //         }
            //     }
            // }

/*

    async RunCheck(check, timeout) {
        // if (this._shouldRestart) {
        //     if (this._currentRunningChecks.length == 1) {
        //         await this._browser.close()
        //         this._browser = puppeteer.launch({ headless: false })

        //         this._shouldRestart = false
        //         this._currentRunningChecks = []

        //         this.StartChecks()
        //         return
        //     }
        //     else {
        //         let index = this._currentRunningChecks.findIndex(name => name === check.name)
        //         this._currentRunningChecks.splice(index, 1)

        //         this._logger.info(`Stopped ${check.name} because restart flag is true`)

        //         return
        //     }

        // }

        if (!this._currentRunningChecks.includes(check.name))
            this._currentRunningChecks.push(check.name)

        let page = await this._browser.newPage()

        check.runCheck(this._browser, page, this._botNotifications).then((products, errors) => {
            if (products != undefined) {
                products.forEach(product => {
                    this._botNotifications.AddStockReport(product.retailer, product.name, product.price, product.date, product.url)
                    this._botNotifications.SendNotification(product, product.name)
                })
            }

            if (errors != undefined) {
                errors.forEach(error => {
                    if (error === undefined) {

                    }
                    else {
                        this._logger.warn(`Encounted an error while scraping: ${error.for}. ${error.err}`)
                    }

                })
            }

            if (!page.isClosed()) {
                page.close()
            }

            setTimeout(() => {
                this.RunCheck(check, timeout)
            }, timeout)
        }).catch(err => {
            let index = this._currentRunningChecks.findIndex(name => name === check.name)
            this._currentRunningChecks.splice(index, 1)
            this._shouldRestart = true
            this._logger.error(`Failed running check ${check.name}. ERR: ${err}`)

            setTimeout(() => {
                this.RunCheck(check, timeout)
            }, timeout)

            if (!page.isClosed()) {
                page.close()
            }
        })
    }

*/