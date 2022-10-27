const winston = require('winston')
const DiscordTransport = require('./transports/discord-error-transport.js')

const Discord = require('discord.js')

const NodeCache = require("node-cache");
const cron = require("node-cron");

const notificationCache = new NodeCache({ stdTTL: 86400 });

exports.BotNotifications = class {

    constructor(discordClient, db, logger) {
        this._discordClient = discordClient
        this._debugNotificationChannelId = '847139120132128808'
        this._stockNotificationChannelId = '848253035036934184'
        this._testNotificationChannelId = '878565573347393538'
        this._botErrorChannelId = '858301136568844308'
        this._stockReportChannelId = '858275213220249650'
        this._db = db.collection('stockalerts')
        this._productDb = db.collection('product_reports')
        this._statsDb = db.collection('stats')
        this.logger = logger
        this._msrps = {}
    }

    get debugNotificationChannel() {
        return _debugNotificationChannelId
    }


    async Start(registrationData) {
        this._server = await this._discordClient.guilds.fetch('843541472930168882')

        this._3060Group = this._server.roles.cache.find(role => role.name == "RTX3060")
        this._3060TIGroup = this._server.roles.cache.find(role => role.name == "RTX3060TI")
        this._3070Group = this._server.roles.cache.find(role => role.name == "RTX3070")
        this._3070TIGroup = this._server.roles.cache.find(role => role.name == "RTX3070TI")
        this._3080Group = this._server.roles.cache.find(role => role.name == "RTX3080")
        this._3080TIGroup = this._server.roles.cache.find(role => role.name == "RTX3080TI")
        this._3090Group = this._server.roles.cache.find(role => role.name == "RTX3090")
        this._ps5Group = this._server.roles.cache.find(role => role.name == "PS5")
        this._aldiGroup = this._server.roles.cache.find(role => role.name == "Aldi")
        this._beerwulfGroup = this._server.roles.cache.find(role => role.name == "Beerwulf")
        this._generalGroup = this._server.roles.cache.find(role => role.name == "General")

        this._adminGroup = this._server.roles.cache.find(role => role.name == "Admin")
        this._devGroup = this._server.roles.cache.find(role => role.name == "Dev")

        this._roleGroups = [this._3060Group, this._3060TIGroup, this._3070Group, this._3070TIGroup, this._3080Group, this._3080TIGroup, this._3090Group, this._ps5Group, this._aldiGroup, this._beerwulfGroup, this._generalGroup]

        let y = this._server.roles.cache.filter(role => {
            return (role.color === 0x56b654 || role.color === 0xff3d3d || role.color === 0x1867ac || role.color === 0x2dff00 || role.color === 0xeed60d || role.color === 0xffffff || role.color === 0xf556c7) && !this._roleGroups.includes(role)
        })
        let x = Array.from(y.values())

        this._roleGroups = this._roleGroups.concat(x)
        
        this._debugChannel = this._server.channels.cache.get(this._debugNotificationChannelId)
        this._stockChannel = this._server.channels.cache.get(this._stockNotificationChannelId)
        this._stockAdminChannel = this._server.channels.cache.get(this._stockReportChannelId)

        this.logger.add(new DiscordTransport({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        },
            this._debugChannel,
            this._devGroup.id))

        this.logger.exceptions.handle(new DiscordTransport({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        },
            this._server.channels.cache.get(this._botErrorChannelId),
            this._devGroup.id))

        this._statsDb.findOne({ stats: 'stats' }).then(result => {
            if (!result) {
                this._statsDb.insertOne({ stats: 'stats', alert_count: 0, last_alert: new Date() })
            }
        }).catch(err => {

        })

        cron.schedule('0 */2 * * * *', async () => {
            this._statsDb.findOne({ stats: 'accepted_prices' }).then(result => {
                this._msrps = result
            }).catch(err => {

            })
        })

        // cron.schedule('48 37 1 */2 * *', async () => {
        //     this.logger.info('Cleaning up channels')

        //     this._roleGroups.forEach(async role => {
        //         let channel = this.GetChannel(role)

        //         if (channel != undefined) {
        //             if (channel.isText()) {
        //                 try {
        //                     await channel.bulkDelete(100, true)
        //                 }
        //                 catch (err) {
        //                     this.logger.info('Problem clearing messages. Check the logs')
        //                     this.logger.error(err)
        //                 }

        //             }
        //         }

        //     })

        //     this.logger.info('Cleaning up database')

        //     const result = await this._db.deleteMany(
        //         {
        //             when: {
        //                 $lt: new Date(new Date().setDate(new Date().getDate() - 1))
        //             }
        //         })

        //     this.logger.info(`Removed ${result.deletedCount} from database`)


        // })

    }

    GetChannel(role) {
        if (role == "test")
            return this._server.channels.cache.get(this._debugNotificationChannelId)

        let test = this._server.channels.cache.find(channel => channel.name == role.name.toLowerCase())

        if (test == undefined)
            return this._generalGroup

        return test
    }

    GetGroupDirect(name) {
        return this._server.roles.cache.find(role => role.name.toLowerCase() == name.toLowerCase())
    }

    GetGroup(name, retailer, alertViaRetailer = false) {
        if (alertViaRetailer) {
            retailer = retailer.toLowerCase().replace(/ /g, '')

            return this._server.roles.cache.find(role => role.name.toLowerCase().replace(/ /g, '') == retailer)
        }
        else {
            name = name.toLowerCase().replace(/ /g, '')
            let roleContains = []

            this._roleGroups.forEach(role => {
                let roleName = role.name.toLowerCase()
                name = name.replace('™', '')
                if (name.includes(roleName)) {
                    roleContains.push(role)
                }
            })

            let matchingRole = this._generalGroup  

            roleContains.forEach(role => {
                for (let i = 0; i < name.length; i++) {
                    if (name.match(new RegExp(role.name, "i"))) {
                        matchingRole = role
                        break;
                    }
                }
            })
            return matchingRole
        }
    }

    Notify(role, embed, product, cache) {
        if (!cache) {
            this._db.insertOne({ url: product.url, when: new Date(), domain: new URL(product.url).hostname.replace(/^[^.]+\./g, ''), product: product })
            this._statsDb.updateOne({ stats: 'stats' }, { $set: { last_alert: Math.floor(new Date().getTime() / 1000) }, $inc: { alert_count: 1 } })
        }

        //embed.setDescription(`${product.name} has restocked at ${product.retailer}`)
        if (process.env.NODE_ENV !== 'production')
        { 
            let channel = this._server.channels.cache.get(this._testNotificationChannelId)
            channel.send(`<@&${role.id}> £${product.price} @${product.retailer}`, embed)
        }
        else
        { 
            this.GetChannel(role).send(`<@&${role.id}> £${product.price} @${product.retailer}`, embed)    
        }
        
        notificationCache.set(product.url, true)
    }

    async SendNotification(product, group, test = false) {

        if (product.url == undefined) {
            this.logger.info(`Product URL of ${product.name} at ${product.retailer} is undefined. Check the check.js file`)
            return
        }

        product.retailer = product.retailer.charAt(0).toUpperCase() + product.retailer.slice(1)

        let embed = new Discord.MessageEmbed()
            .setTitle('Product Alert')
            .addFields(
                { name: 'Product', value: product.name },
                { name: 'Retailer', value: product.retailer },
                { name: 'Price', value: `£${product.price}` },
                //{ name: 'Est Resell Price', value:  `Unknown`},
                { name: 'URL', value: product.url }
            )
            .setFooter('Resell prices may vary. Make sure to check current prices before you buy')

        if (product.note != undefined) {
            embed.addField('Note', product.note)
        }


        if (test) {
            if (group == "admin") {
                embed.setDescription(`<@&${this._adminGroup.id}>`)
                this.GetChannel("test").send(embed)
            }
            else if (group == "info") {
                this.GetChannel("test").send(embed)
            }
            else {
                let role = this.GetGroup(group)
                this.GetChannel("test").send(embed)
            }
        }
        else {
            let role
            if (product.role) {
                role = this.GetGroupDirect(product.role)
            }
            else {
                if (product.pingViaRetailer) {
                    role = this.GetGroup(group, product.retailer, true)
                }
                else {
                    role = this.GetGroup(group)
                }
            }

            if (role == undefined) {
                this.logger.error('Role is somehow undefined for ' + group)

                role = this._generalGroup
            }

            product.role = role.name

            this._db.findOne({
                url: product.url, when: {
                    $lt: new Date(),
                    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
            }).then((result) => {
                if (!result) {
                    this.Notify(role, embed, product)
                    //Uncomment this to enable filter
                    // if (this._msrps[role.name.toLowerCase()] != undefined && process.env.NODE_ENV === 'production') {
                    //     if ((Number(this._msrps[role.name.toLowerCase()]) * 1.1) >= Number(product.price)) {
                            
                    //     }
                    // }
                    // else {
                    //     this.Notify(role, embed, product)
                    // }


                }
            }).catch((err) => {
                this.logger.error(`Reverting to cache as the db error: ${err}`)
                if (notificationCache.get(product.url) == undefined) {
                    if (this._msrps[role.name.toLowerCase()] != undefined) {
                        if ((Number(this._msrps[role.name.toLowerCase()]) * 1.1) >= Number(product.price)) {
                            this.Notify(role, embed, product, true)
                        }
                    }
                    else {
                        this.Notify(role, embed, product, true)
                    }
                }
            })
        }
    }

    async AddStockReport(retailer, product_name, product_price = "unknown", in_date_stock = "unknown", product_url = "unknown") {

        this._productDb.findOne({ retailer: retailer, product_name: product_name }).then((result) => {
            if (!result) {
                this._productDb.insertOne({ retailer: retailer, product_name: product_name, product_price: product_price, original_date_stock: in_date_stock, last_date_stock: in_date_stock, product_url: product_url }).then((result) => {

                }).catch((err) => {
                    this.logger.error(`Failed to add product report for ${product_name} at ${retailer}. ERROR: ${err}`)
                })
            }
            else {
                this._productDb.updateOne({ retailer: retailer, product_name: product_name }, { $set: { product_price: product_price, last_date_stock: in_date_stock, product_url: product_url } }).then((result) => {

                }).catch((err) => {
                    this.logger.error(`Failed to update product report for ${product_name} at ${retailer} ERROR: ${err}`)
                })
            }
        }).catch((err) => {
            this.logger.error(`Failed to update product report for ${product_name} at ${retailer} ERROR: ${err}`)
        })
    }

    async UpdateStockReport() {


    }

}
