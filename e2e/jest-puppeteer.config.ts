module.exports = {
    launch: {
        headless: import.meta.env.HEADLESS !== "false",
        slowMo: import.meta.env.SLOWMO ? import.meta.env.SLOWMO : 0,
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
