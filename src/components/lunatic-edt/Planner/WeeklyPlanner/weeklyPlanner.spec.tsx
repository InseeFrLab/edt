import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";

import { ThemeProvider } from "@mui/material";
import WeeklyPlanner from "./WeeklyPlanner";
import { InfoProps, responsesType, WeeklyPlannerSpecificProps } from "../../../../interface/lunatic-edt";
import { IODataStructure } from "../../../../interface/lunatic-edt/WeeklyPlannerTypes";
import { theme } from "../../../../theme";
import { generateStringInputFromDate } from "../../../../utils/lunatic-edt";
import userEvent from "@testing-library/user-event";

describe("weeklyPlannerComponent", () => {
    const workSumLabel = "total travaillé";
    const presentButtonLabel = "continuer";
    const futureButtonLable = "commencer";
    const editButtonLabel = "Modifier";
    const title = "titre";
    const infoLabels: InfoProps = {
        normalText: "",
        boldText: "",
        border: false,
    };
    const dates = "DATES";
    const datesStarted = "DATES_STARTED";

    const bindingDependencies = [
        "WEEKLYPLANNER",
        "DATES",
        "DATES_STARTED",
        "00H00",
        "00H15",
        "00H30",
        "00H45",
        "01H00",
        "01H15",
        "01H30",
        "01H45",
        "02H00",
        "02H15",
        "02H30",
        "02H45",
        "03H00",
        "03H15",
        "03H30",
        "03H45",
        "04H00",
        "04H15",
        "04H30",
        "04H45",
        "05H00",
        "05H15",
        "05H30",
        "05H45",
        "06H00",
        "06H15",
        "06H30",
        "06H5",
        "07H00",
        "07H15",
        "07H30",
        "07H45",
        "08H00",
        "08H15",
        "08H30",
        "08H45",
        "09H00",
        "09H15",
        "09H30",
        "09H45",
        "10H00",
        "10H15",
        "10H30",
        "10H45",
        "11H00",
        "11H15",
        "11H30",
        "11H45",
        "12H00",
        "12H15",
        "12H30",
        "12H45",
        "13H00",
        "13H15",
        "13H30",
        "13H45",
        "14H00",
        "14H15",
        "14H30",
        "14H45",
        "15H00",
        "15H15",
        "15H30",
        "15H45",
        "16H00",
        "16H15",
        "16H30",
        "16H5",
        "17H00",
        "17H15",
        "17H30",
        "17H45",
        "18H00",
        "18H15",
        "18H30",
        "18H45",
        "19H00",
        "19H15",
        "19H30",
        "19H45",
        "20H00",
        "20H15",
        "20H30",
        "20H45",
        "21H00",
        "21H15",
        "21H30",
        "21H45",
        "22H00",
        "22H15",
        "22H30",
        "22H45",
        "23H00",
        "23H15",
        "23H30",
        "23H45",
        "ISCLOSED",
    ];

    const responses: responsesType[] = [];

    const setResponses = () => {
        bindingDependencies.forEach(dep => {
            responses.push({
                "response": {
                    "name": dep,
                },
            });
        });
    };

    // Set the surveyDate to today
    let surveyDate: Date = new Date();
    surveyDate.setDate(surveyDate.getDate() - 2);
    const surveyDateString: string = generateStringInputFromDate(surveyDate);
    const dateCurrent = new Date();

    const arrayDates = new Array(7);
    const todayStringValue = generateStringInputFromDate(dateCurrent);

    arrayDates[0] = todayStringValue;
    for (let i = 1; i < 7; i++) {
        const date = new Date();
        date.setDate(dateCurrent.getDate() + i);
        arrayDates[i] = generateStringInputFromDate(date);
    }

    const setIsSubChildDisplayed = jest.fn();
    const setIsPlaceWorkDisplayed = jest.fn();
    const setDisplayedDayHeader = jest.fn();
    const saveAll = jest.fn();
    const saveHours = jest.fn();

    const value: { [key: string]: string[] | IODataStructure[] } = {
        "WEEKLYPLANNER": [
            { "dateJ1": todayStringValue },
            { "dateJ1_started": "true" },
            { "dateJ1_02h15": "true" },
            { "dateJ1_02h30": "true" },
            { "dateJ1_02h45": "true" },
            { "dateJ1_03h00": "true" },
        ],
        "DATES": arrayDates,
        "DATES_STARTED": ["true", "false", "false", "false", "false", "false", "false"],
        "02H00": ["true", "false", "false", "false", "false", "false", "false"],
        "02H15": ["true", "false", "false", "false", "false", "false", "false"],
        "02H30": ["true", "false", "false", "false", "false", "false", "false"],
        "02H45": ["true", "false", "false", "false", "false", "false", "false"],
    };

    const variables: Map<string, any> = new Map();
    variables.set("WEEKLYPLANNER", [
        { "dateJ1": todayStringValue },
        { "dateJ1_started": "true" },
        { "dateJ1_02h15": "true" },
        { "dateJ1_02h30": "true" },
        { "dateJ1_02h45": "true" },
        { "dateJ1_03h00": "true" },
    ]);
    variables.set("DATES", arrayDates);
    variables.set("DATES_STARTED", ["true", "false", "false", "false", "false", "false", "false"]);
    variables.set("02H00", ["true", "false", "false", "false", "false", "false", "false"]);
    variables.set("02H15", ["true", "false", "false", "false", "false", "false", "false"]);
    variables.set("02H30", ["true", "false", "false", "false", "false", "false", "false"]);
    variables.set("02H45", ["true", "false", "false", "false", "false", "false", "false"]);

    const componentProps: WeeklyPlannerSpecificProps = {
        surveyDate: surveyDateString,
        isSubChildDisplayed: false,
        setIsSubChildDisplayed: setIsSubChildDisplayed,
        isPlaceWorkDisplayed: false,
        setIsPlaceWorkDisplayed: setIsPlaceWorkDisplayed,
        setDisplayedDayHeader: setDisplayedDayHeader,
        displayedDayHeader: "",
        labels: {
            title: title,
            workSumLabel: workSumLabel,
            presentButtonLabel: presentButtonLabel,
            futureButtonLabel: futureButtonLable,
            editButtonLabel: editButtonLabel,
            infoLabels: infoLabels,
            dates: dates,
            datesStarted: datesStarted,
        },
        saveAll: saveAll,
        language: "fr",
        moreIcon: <></>,
        expandLessIcon: <></>,
        expandMoreIcon: <></>,
        expandLessWhiteIcon: <></>,
        expandMoreWhiteIcon: <></>,
        workIcon: <></>,
        saveHours: saveHours,
        optionsIcons: {
            "1": {
                altIcon: "",
            },
        },
        idSurvey: "",
    };

    const renderElement = (valueData: { [key: string]: string[] | IODataStructure[] }): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <WeeklyPlanner
                    handleChange={() => console.log("changed")}
                    value={valueData}
                    componentSpecificProps={componentProps}
                    bindingDependencies={bindingDependencies}
                    responses={responses}
                    variables={variables}
                ></WeeklyPlanner>
            </ThemeProvider>,
        );
    };

    beforeEach(() => {
        setResponses();
        renderElement(value);
    });

    it("renders 7 DayPlanner and 1 DayOverview with 24 Hourchecker", () => {
        expect(screen.getAllByLabelText("dayplanner")).toHaveLength(7);
        expect(screen.getAllByLabelText("dayoverview")).toHaveLength(1);
        expect(screen.getAllByLabelText("hourchecker")).toHaveLength(24);
    });

    it("renders DayPlanner items with correct DayRelativeTime", () => {
        expect(screen.getAllByText(workSumLabel)).toHaveLength(3);
        expect(screen.getAllByText(presentButtonLabel)).toHaveLength(1);
        expect(screen.getAllByText(futureButtonLable)).toHaveLength(4);
    });

    it("renders title and items with date current", () => {
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getAllByText(workSumLabel)).toHaveLength(3);
    });

    it("renders (non)selected hours and update them", async () => {
        expect(screen.queryAllByLabelText("hourselected")).toHaveLength(0);
        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(96);

        userEvent.click(screen.getByText(presentButtonLabel));

        await waitFor(() => expect(setIsSubChildDisplayed).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getAllByLabelText("hournotselected")[0]);

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(88);
        expect(await screen.findAllByLabelText("hourselected")).toHaveLength(8);
    });
});
