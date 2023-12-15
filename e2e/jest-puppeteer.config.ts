module.exports = {
    launch: {
        headless: process.env.HEADLESS !== "false",
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
        devtools: true,
    },
    //browser: 'chromium',
    server: {
        command: "yarn start-with-lib",
        port: 3000,
        launchTimeout: 10000,
        debug: true,
    },
};
