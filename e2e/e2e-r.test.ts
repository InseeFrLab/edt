import puppeteer from "puppeteer";
import { edtOrganisationApiBaseUrl, stromaeBackOfficeApiBaseUrl } from "../src/service/api-service";
import { getUserToken, isReviewer } from "../src/service/user-service";
import { EdtRoutesNameEnum } from "./../src/enumerations/EdtRoutesNameEnum";
import userData from "./mocks/userData.json";
import surveysDataInterviewer from "./mocks/userSurveyInfo-interviewer.json";
import surveysDataReviewer from "./mocks/userSurveyInfo-reviewer.json";

jest.mock("axios");

const urlHost = process.env.REACT_APP_KEYCLOAK_REDIRECT_URI;
const urlUserSurvey = edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys";
const urlSurveysDataReviewer = edtOrganisationApiBaseUrl + "api/survey-assigment/reviewer/my-surveys";
const urlSurveyData = stromaeBackOfficeApiBaseUrl + "api/survey-unit/";

const userServiceMock = jest.fn(isReviewer).mockImplementationOnce(() => true);

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
            body: JSON.stringify(surveysDataInterviewer),
        });
    };

    const mockSurveysDataReviewer = (request: any) => {
        request.respond({
            headers: mockHeaders,
            body: JSON.stringify(surveysDataReviewer),
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
            headless: false,
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
            } else if (url.includes(urlSurveysDataReviewer)) {
                mockSurveysDataReviewer(request);
            } else {
                request.continue();
            }
        });

        userServiceMock();
    });

    it("redirect to keycloak when user connect", async () => {
        await page.goto(urlHost);
        await page.waitForSelector("#username");

        await page.$eval("#username", el => (el.value = ""));
        await page.type("#username", "reviewer1");

        await page.waitForSelector("#password");
        await page.click("#password");
        await page.type("#password", "password");

        await page.click("#kc-login");
        await page.waitForNavigation();

        await page.waitForNavigation();

        let urlHome = await page.url();
        expect(urlHome).toContain(urlHost);
    }, 50000);

    it("shows home page", async () => {
        await page.waitForSelector("#button-demo");

        let urlHome = await page.url();
        expect(urlHome).toContain(urlHost + EdtRoutesNameEnum.REVIEWER_HOME);

        await page.waitFor(200);
        await page.click("#button-demo");
        await page.waitForNavigation();

        urlHome = await page.url();
        expect(urlHome).toContain(urlHost + EdtRoutesNameEnum.SURVEYED_HOME);
    }, 30000);

    it("shows demo page", async () => {
        await page.waitForSelector("#dayCard-1");

        //verify presence of activity survey
        const numActivitySurvey = (await page.$$('[id^="dayCard-"]')).length;
        expect(numActivitySurvey).toBe(6);

        //verify presence of number of work time survey
        const numWorkTimeSurvey = (await page.$$('[id^="weekCard-"]')).length;
        expect(numWorkTimeSurvey).toBe(2);

        const surveyDate = (await page.$$("#surveyDate-text")).length;
        const firstName = (await page.$$("#firstName-text")).length;

        expect(surveyDate).toBe(8);
        expect(firstName).toBe(8);

        page.waitFor(200);
        await page.click("#button-home-reviewer");

        let urlHome = await page.url();
        expect(urlHome).toContain(urlHost + EdtRoutesNameEnum.REVIEWER_HOME);
    }, 30000);

    it("shows surveys overview page", async () => {
        await page.waitForSelector("#button-surveys-overview");
        await page.click("#button-surveys-overview");

        let urlHome = await page.url();
        expect(urlHome).toContain(urlHost + EdtRoutesNameEnum.REVIEWER_SURVEYS_OVERVIEW);

        const numHouseholds = (await page.$$('[id^="householdCard-"]')).length;
        //expect(numHouseholds).toBe(2);

        /*        await page.click("#householdCard-0");
        await page.waitForNavigation();*/
    }, 30000);

    afterAll(() => {
        browser.close();
    });
});
