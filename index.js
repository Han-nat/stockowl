const glob = require('glob')
const winston = require('winston')
const vanilla = require('puppeteer')
const addExtra = require('puppeteer-extra').addExtra
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const BlockResources = require('puppeteer-extra-plugin-block-resources')
const Cluster = require('puppeteer-cluster').Cluster
const Discord = require('discord.js')

require('winston-daily-rotate-file')

const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )

const logger = winston.createLogger({
    format: format,
    exitOnError: true,
    transports: [
        new winston.transports.DailyRotateFile({
            filename: '../logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            filename: '../logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        }),
        new winston.transports.Console({
            format: format
        })
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: '../logs/unhandled/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        }),
        new winston.transports.Console({
            format: format
        })
    ]
});

//exitOnError: true
/*
for aldi test

*/


(async () => {
    const discordClient = new Discord.Client();
    const puppeteer = addExtra(vanilla)
    
    puppeteer.use(StealthPlugin())
    //puppeteer.use(BlockResources({ blockedTypes: new Set([ 'image', 'stylesheet' ]) }))

    const cluster = await Cluster.launch({
        puppeteer,
        maxConcurrency: 3,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        puppeteerOptions: { headless: process.env.NODE_ENV === 'production', args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    })
    
    logger.info(`Loading modules`);
    
    let checks = []
    const checkFiles = glob.sync("modules/**/*.js")
    
    checkFiles.forEach((file) => {
        let CheckClass = require('./' + file)
        var check = new CheckClass()
        
        if (check !== undefined) {
            check.path = `./${file}`
            checks.push(check)
    
            logger.info(`Added ${check.name}`);
        }
        else
        {
            logger.warn(`Failed to add ${file}. Check Undefined: ${check !== undefined}.`)
        }
    
    })
    
    const Bot = require('./bot.js')
    const bot = new Bot(process.env.DB_URL, discordClient, cluster, checks, logger)
    
    bot.Start()
})()





// checkFiles.forEach((file) => {
//     let moduleFile = require('./' + file)
//     let check = moduleFile.check
//     let registration = moduleFile.register

//     if (check !== undefined && registration !== undefined) {
//         registration = registration()
//         checks.push({ reg: registration, checkFunction: check })

//         logger.log({
//             level: 'info',
//             message: `Adding ${file} for ${registration}`
//         });
//     }
//     else
//     {
//         logger.warn(`Failed to add ${file}. Check Undefined: ${check !== undefined}. Registration Undefined: ${registration !== undefined}`)
//     }

// })
