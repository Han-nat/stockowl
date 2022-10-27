const Transport = require('winston-transport')
const util = require('util')
const { MESSAGE, LEVEL } = require('triple-beam');
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600 })

module.exports = class DiscordTransport extends Transport {

    constructor(opts, channel, adminid) 
    {
        super(opts)
        this._channel = channel
        this._adminId = adminid
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        try
        {

            let msgs = []

            let splits = Math.ceil(info[MESSAGE].length / 2000)

            if (splits == 1)
            {
                msgs.push(info[MESSAGE])
            }
            else
            {
                for (let i = 0; i < splits; i++)
                {
                    let msg = info[MESSAGE].splice(2000 * i)
                    msgs.push(msg)
                }
            }

            msgs.forEach(msg => { 
                if (info[LEVEL] == 'error')
                {
                    this._channel.send(`<@&${this._adminId}> ${msg}`)
                }
                else
                {
                    this._channel.send(`${msg}`)
                }
            })

            
        }
        catch (err)
        {

        }

        callback()
    }

    cacheLogMessage(message)
    {
        cache.set(message, { id: msg.id, amount: 1 })
        // if (cache.)
        // {

        // }
    }

}