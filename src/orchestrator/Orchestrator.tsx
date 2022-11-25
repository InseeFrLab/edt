import * as lunatic from "@inseefr/lunatic";
import { CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import * as lunaticEDT from "lunatic-edt";
import { makeStylesEdt } from "lunatic-edt";
import React, { useEffect } from "react";

const { ...edtComponents } = lunaticEDT;

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    lunatic[name] = component;
});

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });

export const callbackHolder: { getData(): LunaticData } = {
    getData: () => {
        return {};
    },
};

export type OrchestratorProps = {
    source: LunaticModel | undefined;
    data?: object;
    callbackHolder: { getData(): LunaticData };
    page: string;
    subPage?: string;
    iteration?: number;
    surveyDate?: string;
    isSubChildDisplayed?: boolean;
    setIsSubChildDisplayed?(value: boolean): void;
};

let lastPager: any = null;
let lastGoNextPage: any = null;
let i = 0;

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
    } = props;
    const { classes, cx } = useStyles();

    const [loaded, setLoaded] = React.useState(false);

    const { getComponents, getCurrentErrors, getData, goNextPage, pager } = lunatic.useLunatic(
        source,
        data,
        {
            onChange: onLogChange,
            initialPage: "1",
        },
    );
    pager["" + i++] = "toto";
    lastPager = pager;
    lastGoNextPage = goNextPage;
    console.log("source");
    console.log(source);
    console.log(data);
    console.log(pager);

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    callbackHolder.getData = getData;

    useEffect(() => {
        console.log("useEffect");
        const targetPage =
            page +
            (subPage !== undefined ? "." + subPage : "") +
            (iteration !== undefined ? "#" + (iteration + 1) : "");

        let currentConstructedPage = "";

        const func = () => {
            setTimeout(() => {
                console.log("funcTimeout");
                console.log(lastPager);
                if (lastPager.page === undefined) {
                    func();
                }
                if (lastPager.page === pager.maxPage) {
                    return;
                }
                const constructedPagerPage =
                    lastPager.page +
                    (lastPager.subPage !== undefined ? "." + (lastPager.subPage + 1) : "") +
                    (lastPager.iteration !== undefined ? "#" + (lastPager.iteration + 1) : "");
                console.log(
                    `cible=${targetPage} pager=${constructedPagerPage} current=${currentConstructedPage}`,
                );
                if (constructedPagerPage === targetPage) {
                    setLoaded(true);
                    return;
                }
                if (currentConstructedPage !== constructedPagerPage) {
                    console.log("goNextPage");
                    goNextPage();
                    currentConstructedPage = constructedPagerPage;
                }
                func();
            }, 100);
        };

        func();
    }, [pager]);

    return source && data && loaded ? (
        <>
            <div className={cx("components", classes.styleOverride)}>
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
                            />
                        </div>
                    );
                })}
            </div>
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
        "& .field-container": {
            margin: "1rem 0",
        },
    },
}));
