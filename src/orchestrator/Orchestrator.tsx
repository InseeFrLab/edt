import * as lunatic from "@inseefr/lunatic";
import { CircularProgress } from "@mui/material";
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

export const callbackHolder: { getData(): LunaticData; getErrors(): any } = {
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
    callbackHolder: { getData(): LunaticData; getErrors(): any };
    page: string;
    surveyDate?: string;
    isSubChildDisplayed?: boolean;
    setIsSubChildDisplayed?(value: boolean): void;
};
export const OrchestratorForStories = (props: OrchestratorProps) => {
    const {
        source,
        data,
        callbackHolder,
        page,
        surveyDate,
        isSubChildDisplayed,
        setIsSubChildDisplayed,
    } = props;

    const { getComponents, getCurrentErrors, getData } = lunatic.useLunatic(source, data, {
        onChange: onLogChange,
        initialPage: page,
        activeControls: true,
    });
    const { classes, cx } = useStyles();
    const components = getComponents();
    const currentErrors = getCurrentErrors();
    callbackHolder.getData = getData;
    callbackHolder.getErrors = getCurrentErrors;

    return source && data ? (
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
