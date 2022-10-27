const { Octokit } = require("@octokit/rest")
const crypto = require('crypto')
const fs = require('fs')
const fsp = fs.promises
const glob = require('glob')
const JSZip = require('jszip')

const octokit = new Octokit({
    auth: "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"
})

class Updater {

    constructor(bot, logger) {
        this._bot = bot
        this._logger = logger
    }

    async Update(cron) {
        //DO NOT REMOVE THIS WITHOUT PUSHING GIT FIRST
        if (process.env.NODE_ENV !== 'production')
            return

        //30 */2 * * * *
        cron.schedule('30 */2 * * * *', async (err) => {
            this._logger.info('Checking for updates')

            try {

                let zip = await octokit.rest.repos.downloadZipballArchive({
                    owner: 'Han-nat',
                    repo: 'stockbot'
                })

                JSZip.loadAsync(zip.data).then(async (res) => {

                    //this._logger.info(JSON.stringify(res.files))
                    let hasChangedFiles = false
                    for (const fileName in res.files) {
                        const file = await res.file(fileName)

                        if (file) {
                            file.data = await file.async("string")
                            file.editedData = file.data.replace(/\s+/g, '')
                            let fileName = file.name.substring(file.name.indexOf('/') + 1, file.name.length)

                            if (fs.existsSync(fileName)) {
                                try {
                                    let checkData = await fsp.readFile(fileName, { encoding: 'utf8' })
                                    checkData = checkData.replace(/\s+/g, '')

                                    if (checkData != file.editedData) {
                                        this._logger.info(fileName + ' is being updated')

                                        await fsp.unlink(`./${fileName}`)

                                        await fsp.writeFile(`./${fileName}`, file.data)


                                        hasChangedFiles = true
                                    }
                                }
                                catch (e) {
                                    console.error(e)
                                }
                            }
                            else {
                                let dirPath = fileName.substring(0, fileName.lastIndexOf('/'))
                                this._logger.info("latest string " + dirPath)
                                fsp.mkdir('./' + dirPath, { recursive: true }).then(async () => {
                                    await fsp.writeFile(`./${fileName}`, file.data)

                                    hasChangedFiles = true
                                }).catch(e => {

                                })
                            }
                        }



                        // if (checkFiles.includes(fileName)) {
                        //     try {
                        //         let checkData = await fsp.readFile('./' + fileName, { encoding: 'utf8' })
                        //         checkData = checkData.replace(/\s+/g, '')

                        //         if (checkData != file.editedData) {
                        //             this._logger.info(file.name + ' is being updated')

                        //             await fsp.unlink(`./${fileName}`)

                        //             await fsp.writeFile(`./${fileName}`, file.data)

                        //         }
                        //     }
                        //     catch (e) {
                        //         console.error(e)
                        //     }
                        // }
                        // else if (fileName.includes('modules')) {
                        //     this._logger.info('Trying to create new check')
                        //     try {
                        //         let dirPath = fileName.substring(0, fileName.lastIndexOf('/'))
                        //         this._logger.info("latest string " + dirPath)
                        //         fsp.mkdir('./' + dirPath, { recursive: true }).then(async () => {
                        //             await fsp.writeFile(`./${fileName}`, file.data)
                        //         }).catch(e => {

                        //         })


                        //     }
                        //     catch (e) {
                        //         console.error(e)
                        //     }


                        // }

                    }

                    if (hasChangedFiles) {
                        this._logger.info('hasChangedFiles flag true after updating files. Restarting')
                        const { exec } = require("child_process");
                        exec("pm2 restart app.config.js")
                    }

                })

                //this._logger.info(test.data)
            }
            catch (e) {
                console.error(e)
            }
        })


    }

}

module.exports = Updater