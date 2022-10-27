class Check {

    constructor(name, timeout = 300000) {
        this.name = name
        this.lastRun = null
        this.cycles = 0
        this.artificialDelay = 0
        this.timeout = timeout
        this.defaultTimeout = timeout
        this.products = []
    }

    runCheck(browser, page, notifications) {

    }

    copyProducts() {
        this.originalProducts = this.products.map(x => x)
    }

    

    /*
        The idea behind this is they will be called more often then runcheck and will check whether the check's page has done anything in x time, if not then it will close it
    */
    async aliveCheck()
    {

    }


}

module.exports = Check