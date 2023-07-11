import puppeteer from "puppeteer";
import { edtOrganisationApiBaseUrl, stromaeBackOfficeApiBaseUrl } from "../src/service/api-service";
import { getUserToken } from "../src/service/user-service";
import userData from "./mocks/userData.json";
import userSurveyInfo from "./mocks/userSurveyInfo.json";

jest.mock("axios");

const urlRedirection = process.env.REACT_APP_KEYCLOAK_AUTHORITY;
const urlHost = process.env.REACT_APP_KEYCLOAK_REDIRECT_URI;

const urlUserSurvey = edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys";
const urlSurveyData = stromaeBackOfficeApiBaseUrl + "api/survey-unit/";

describe("App.ts", () => {
    let browser;
    let page;

    let mockHeaders = {
        "Authorization": "Bearer " + getUserToken(),
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
    };

    const mockUserSurvey = (request: any) => {
        request.respond({
            headers: mockHeaders,
            body: JSON.stringify(userSurveyInfo),
        });
    };

    const mockSurveyData = (request: any, url: string) => {
        const idSurvey = Number.parseInt(url.split("survey-unit/")[1].split("-")[1] ?? 0);
        request.respond({
            headers: mockHeaders,
            body: JSON.stringify(userData[idSurvey - 1]),
        });
    };

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: "new",
            product: "chrome",
            executablePath: process.env.REACT_APP_CHROMIUM_PATH,
            devtools: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        });

        page = await browser.newPage();

        await page.setRequestInterception(true);

        page.on("request", request => {
            const url: string = request.url();
            if (url.includes(urlUserSurvey)) {
                mockUserSurvey(request);
            } else if (url.includes(urlSurveyData)) {
                mockSurveyData(request, url);
            } else {
                request.continue();
            }
        });
    });

    it("redirect to keycloak when user connect", async () => {
        await page.goto(urlHost);
        await page.waitForSelector("#username");

        await page.$eval("#username", el => (el.value = ""));
        await page.type("#username", "repondant10");

        await page.waitForSelector("#password");
        await page.click("#password");
        await page.type("#password", "password");

        await page.click("#kc-login");
        await page.waitForNavigation();

        await page.waitForNavigation();

        const urlHome = await page.url();
        expect(urlHome).toContain(urlHost);
    }, 50000);

    it("shows home page with all of questionnaires", async () => {
        await page.waitForSelector("#dayCard-1");

        //verify presence of activity survey
        const numActivitySurvey = (await page.$$('[id^="dayCard-"]')).length;
        expect(numActivitySurvey).toBe(3);

        //verify presence of number of work time survey
        const numWorkTimeSurvey = (await page.$$('[id^="weekCard-"]')).length;
        expect(numWorkTimeSurvey).toBe(2);

        const surveyDate = (await page.$$("#surveyDate-text")).length;
        const firstName = (await page.$$("#firstName-text")).length;

        expect(surveyDate).toBe(5);
        expect(firstName).toBe(5);
    }, 3000);

    it("create new activity in activity questionarie which is not closed", async () => {
        await page.waitForSelector("#dayCard-1");
        await page.click("#dayCard-1");
        await page.waitForNavigation();

        const numActivityCard = (await page.$$('[id^="activityOrRouteCard-"]')).length;
        expect(numActivityCard).toBe(2);

        await page.click("#add-button");
        await page.click("#add-activity");
        await page.waitForNavigation();

        let url = await page.url();
        expect(url).toContain("activity-duration/2");

        await page.waitForSelector("#next-button");
        await page.click("#next-button");
        await page.waitForNavigation();
        await page.waitForSelector("#rankCategory-0");

        await page.click("#rankCategory-0");
        await page.click("#subrankCategory-3");

        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("secondary-activity/2");

        await page.waitForSelector("#true-button");
        await page.click("#true-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("secondary-activity-selection");

        await page.waitForSelector("#checkboxone-0");
        await page.click("#checkboxone-0");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("activity-location");

        await page.waitForSelector("#icongridcheckboxone-0");
        await page.click("#icongridcheckboxone-0");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("with-who");

        await page.waitForSelector("#true-button");
        await page.click("#true-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("with-who-selection");

        await page.waitForSelector("#checkboxgroup-4");
        await page.click("#checkboxgroup-4");
        await page.click("#checkboxgroup-0");
        await page.click("#next-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("with-screen");

        await page.waitForSelector("#false-button");
        await page.click("#false-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain(urlHost);
    }, 9000);

    it("create new route in activity questionarie which is not closed", async () => {
        await page.waitForSelector("#activityOrRouteCard-51");

        const numActivityCard = (await page.$$('[id^="activityOrRouteCard-"]')).length;
        expect(numActivityCard).toBe(3);

        await page.click("#add-button");
        await page.click("#add-route");
        await page.waitForNavigation();

        let url = await page.url();
        expect(url).toContain("activity-duration/3");

        await page.waitForSelector("#next-button");
        await page.click("#next-button");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("route/3");

        await page.waitForSelector("#icongridcheckboxone-0");
        await page.click("#icongridcheckboxone-0");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("mean-of-transport/3");

        await page.waitForSelector("#checkboxone-0");
        await page.click("#checkboxone-0");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("secondary-activity/3");

        await page.waitForSelector("#false-button");
        await page.click("#false-button");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("with-who");

        await page.waitFor(800);
        await page.click("#false-button");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("with-screen");

        await page.waitFor(800);
        await page.click("#true-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain(urlHost);
    }, 9000);

    it("clore activity questionarie", async () => {
        await page.waitForSelector("#activityOrRouteCard-51");

        await page.waitForSelector("#clore-button");
        await page.click("#clore-button");
        await page.waitForSelector("#button-complete");
        await page.click("#button-complete");
        await page.waitForNavigation();

        let url = await page.url();
        expect(url).toContain("greatest-activity-day");

        await page.waitForSelector("#checkboxone-1");
        await page.click("#checkboxone-1");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("worst-activity-day");

        await page.waitFor(200);
        await page.click("#checkboxone-1");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("kind-of-day");

        await page.waitFor(200);
        await page.click("#checkboxone-0");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("exceptional-day");

        await page.waitForSelector("#false-button");
        await page.click("#false-button");
        await page.waitForNavigation();
        url = await page.url();
        expect(url).toContain("travel-time");

        await page.waitForSelector("#durationHour-select");
        await page.click("#durationHour-select");
        await page.click("#hour-1");

        await page.waitFor(200);
        await page.click("#durationMin-select");
        await page.waitForSelector("#min-1");
        await page.click("#min-1");

        await page.waitFor(200);
        await page.click("#next-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("phone-time");

        await page.waitFor(200);
        await page.click("#durationHour-select");
        await page.click("#hour-2");

        await page.waitFor(200);
        await page.click("#durationMin-select");
        await page.waitForSelector("#min-1");
        await page.click("#min-1");

        await page.waitFor(200);
        await page.click("#next-button");
        await page.waitForNavigation();

        url = await page.url();
        expect(url).toContain("end-survey");

        await page.waitFor(200);
        await page.click("#send-button");

        await page.waitForSelector("#next-modal-button");
        await page.click("#next-modal-button");
    }, 9000);

    afterAll(() => {
        browser.close();
    });
});
