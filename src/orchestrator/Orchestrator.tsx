import * as lunatic from "@inseefr/lunatic";
import { Box, CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import * as lunaticEDT from "lunatic-edt";
import { makeStylesEdt } from "lunatic-edt";
import React from "react";

const { ...edtComponents } = lunaticEDT;

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    lunatic[name] = component;
});

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });

export const callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } } = {
    getData: () => {
        return {};
    },
    getErrors: () => {
        return {};
    },
};

export type OrchestratorProps = {
    source: LunaticModel | undefined;
    data?: object;
    callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } };
    page: string;
    subPage?: string;
    iteration?: number;
    surveyDate?: string;
    isSubChildDisplayed?: boolean;
    setIsSubChildDisplayed?(value: boolean): void;
    componentSpecificProps?: any;
};

let i = 0;
let stablePager: any;
let stableGoNextPage: any;

const setStablePager = (pager: any, goNextPage: any): void => {
    if (pager !== stablePager) {
        stablePager = pager;
        stableGoNextPage = goNextPage;
        i = 0;
    }
};
let waiting = false;
const waitForStablePager = (pager: any, goNextPage: any, callback: () => void): void => {
    setStablePager(pager, goNextPage);
    if (waiting) return;
    waiting = true;

    const wait = () => {
        setTimeout(() => {
            if (i++ > 10) {
                callback();
                waiting = false;
                i = 0;
                return;
            }
            wait();
        }, 1);
    };
    wait();
};

export const OrchestratorForStories = (props: OrchestratorProps) => {
    const {
        source,
        data,
        callbackHolder,
        page,
        subPage,
        iteration,
        surveyDate,
        isSubChildDisplayed,
        setIsSubChildDisplayed,
        componentSpecificProps,
    } = props;
    const { classes, cx } = useStyles();

    const [loaded, setLoaded] = React.useState(false);

    const { getComponents, getCurrentErrors, getData, goNextPage, pager } = lunatic.useLunatic(
        source,
        data,
        {
            onChange: onLogChange,
            initialPage: subPage ? "3" : page, //Page 3 if we have subpage because we start from the sequence before the loop
            activeControls: true,
        },
    );

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    callbackHolder.getData = getData;
    callbackHolder.getErrors = getCurrentErrors;

    const myGoToPage = (
        pager: any,
        goNextPage: any,
        page: string,
        subPage: string | undefined,
        iteration: number | undefined,
    ) => {
        if (!pager.page) {
            return;
        }
        pager.currentPage = () =>
            pager.page +
            (pager.subPage === undefined ? "" : `.${pager.subPage + 1}`) +
            (pager.iteration === undefined ? "" : `#${pager.iteration + 1}`);
        pager.cible =
            page +
            (subPage === undefined ? "" : `.${subPage}`) +
            (iteration === undefined ? "" : `#${iteration + 1}`);
        pager.previous = undefined;
        pager.attempts = 10;
        if (pager.cible === pager.currentPage()) {
            setLoaded(true);
            return;
        }
        const waitThenNext = () => {
            setTimeout(() => {
                if (pager.attempts == 0) {
                    return;
                }
                if (pager.previous === pager.currentPage()) {
                    pager.attempts--;
                    waitThenNext();
                    return;
                }
                if (pager.cible === pager.currentPage()) {
                    setLoaded(true);
                    return;
                }
                if (pager.page === pager.maxPage) {
                    console.log("maxpage loaded true");
                    setLoaded(true);
                    return;
                }
                pager.previous = pager.currentPage();
                pager.attempts = 10;
                goNextPage();
                waitThenNext();
            }, 1);
        };
        waitThenNext();
    };
    if (subPage) {
        //Complicated case with subPage, useLunatic needs to navigate page by page from the boucle sequence to the wished page
        waitForStablePager(pager, goNextPage, () => {
            myGoToPage(stablePager, stableGoNextPage, page, subPage, iteration);
        });
    }

    return source && data ? (
        <>
            <Box className={classes.orchestratorBox}>
                <FlexCenter
                    className={loaded || !subPage ? classes.loaderWhenLoaded : classes.loaderWhenLoading}
                >
                    <CircularProgress />
                </FlexCenter>
                <div
                    className={cx(
                        "components",
                        classes.styleOverride,
                        loaded || !subPage
                            ? classes.orchestratorWhenLoaded
                            : classes.orchestratorWhenLoading,
                    )}
                >
                    {components.map(function (component: any) {
                        const { id, componentType, response, ...other } = component;
                        const Component = lunatic[componentType];
                        return (
                            <div className="lunatic lunatic-component" key={`component-${id}`}>
                                <Component
                                    id={id}
                                    response={response}
                                    {...other}
                                    {...component}
                                    errors={currentErrors}
                                    custom={edtComponents}
                                    surveyDate={surveyDate}
                                    isSubChildDisplayed={isSubChildDisplayed}
                                    setIsSubChildDisplayed={setIsSubChildDisplayed}
                                    componentSpecificProps={componentSpecificProps}
                                />
                            </div>
                        );
                    })}
                </div>
            </Box>
        </>
    ) : (
        <FlexCenter>
            <CircularProgress />
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { OrchestratorForStories } })(() => ({
    styleOverride: {
        width: "90%",
        maxWidth: "350px",
        "& .sequence-lunatic": {
            display: "none",
        },
        "& label": {
            backgroundColor: "transparent",
            marginBottom: "1rem",
            fontSize: "20px",
        },
        "& legend": {
            backgroundColor: "transparent",
            marginBottom: "1rem",
            fontSize: "20px",
        },
        "& .field-container": {
            margin: "1rem 0",
        },
    },
    loaderWhenLoaded: {
        display: "none !important",
    },
    loaderWhenLoading: {
        display: "visible",
        marginTop: "2rem",
    },
    orchestratorWhenLoading: {
        visibility: "hidden",
        height: "1px",
        width: "1px",
        overflow: "hidden",
    },
    orchestratorWhenLoaded: {
        visibility: "visible",
    },
    orchestratorBox: {
        display: "flex",
        flexDirection: "column",
    },
}));
