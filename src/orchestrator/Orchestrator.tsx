import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "@inseefrlab/lunatic-edt";
import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import React from "react";

const { ...edtComponents } = lunaticEDT;

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    lunatic[name] = component;
});

export const callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } } = {
    getData: () => {
        return {};
    },
    getErrors: () => {
        return {};
    },
};

export type OrchestratorProps = {
    source?: LunaticModel | undefined;
    data?: object;
    cbHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } };
    page: string;
    subPage?: string;
    iteration?: number;
    componentSpecificProps?: any;
    overrideOptions?: any;
};

const renderLoading = () => {
    return (
        <FlexCenter>
            <CircularProgress />
        </FlexCenter>
    );
};

export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data, cbHolder, page, subPage, iteration, componentSpecificProps, overrideOptions } =
        props;
    const { classes, cx } = useStyles();

    const { getComponents, getCurrentErrors, getData } = lunatic.useLunatic(source, data, {
        initialPage:
            page +
            (subPage === undefined ? "" : `.${subPage}`) +
            (iteration === undefined ? "" : `#${iteration + 1}`),
        activeControls: true,
    });

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    cbHolder.getData = getData;
    cbHolder.getErrors = getCurrentErrors;

    const renderComponent = () => {
        return (
            <>
                <Box className={classes.orchestratorBox}>
                    <div
                        className={cx(
                            "components",
                            classes.styleOverride,
                            window.innerWidth <= 667 && componentSpecificProps.widthGlobal
                                ? classes.styleOverrideMobile
                                : "",
                        )}
                    >
                        {components.map(function (component: any) {
                            const { id, componentType, response, options, ...other } = component;
                            const Component = lunatic[componentType];
                            return (
                                <div className="lunatic lunatic-component" key={`component-${id}`}>
                                    <Component
                                        id={id}
                                        response={response}
                                        options={options ? options : overrideOptions}
                                        {...other}
                                        errors={currentErrors}
                                        custom={edtComponents}
                                        componentSpecificProps={componentSpecificProps}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Box>
            </>
        );
    };

    return source && data ? renderComponent() : renderLoading();
};

const useStyles = makeStylesEdt({ "name": { OrchestratorForStories } })(() => ({
    styleOverride: {
        width: "100%",
        maxWidth: "350px",
        "& .sequence-lunatic": {
            display: "none",
        },
        "& label": {
            backgroundColor: "transparent !important",
            marginBottom: "1rem !important",
            fontSize: "20px !important",
        },
        "& legend": {
            backgroundColor: "transparent",
            marginBottom: "1rem",
            fontSize: "20px",
            display: important("none"),
        },
        "& .field-container": {
            margin: "1rem 0",
        },
    },
    styleOverrideMobile: {
        maxWidth: important("100vw"),
        width: important("100vw"),
    },
    orchestratorBox: {
        display: "flex",
        flexDirection: "column",
    },
}));
