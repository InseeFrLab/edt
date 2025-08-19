import * as lunaticComponents from "@inseefr/lunatic/lib/index";
import * as lunaticEDT from "@inseefrlab/lunatic-edt";
import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, CircularProgress } from "@mui/material";
import FlexCenter from "../components/commons/FlexCenter/FlexCenter";
import { FieldNameEnum, FieldNameEnumActivity } from "../enumerations/FieldNameEnum";
import { LunaticData, LunaticModel } from "../interface/lunatic/Lunatic";
import React, { useEffect } from "react";
import { getCurrentPageSource } from "../service/orchestrator-service";
import { isReviewer } from "../service/user-service";

const { ...edtComponents } = lunaticEDT;

const lunatic = { ...lunaticComponents };

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    (lunatic as any)[name] = component;
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
    source?: LunaticModel;
    data?: LunaticData;
    callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } };
    page: string;
    subPage?: string;
    iteration?: number;
    componentSpecificProps?: any;
    overrideOptions?: any;
    // Replace lunatic components
    components?: Record<string, any>;
};

const renderLoading = () => {
    return (
        <FlexCenter>
            <CircularProgress />
        </FlexCenter>
    );
};

const isWorkTime = (source: LunaticModel | undefined) => {
    return source ? source.label == "WorkTime" : getCurrentPageSource().label == "WorkTime";
};

const propsWorkTime = (source: LunaticModel): string[] => {
    const bindingDependenciesOfComponent = source.components.map(
        component => component.bindingDependencies ?? [],
    );
    // array of arrays to array
    const bindingDependencies = ([] as string[]).concat(...bindingDependenciesOfComponent);
    //unique values
    const uniqueBindingDependencies = bindingDependencies?.filter(
        (value, index, array) => array.indexOf(value) === index,
    );
    return uniqueBindingDependencies;
};

/**
 * Retrieves and updates interviewer data.
 *
 * This function fetches data using `getData` callback, then updates
 * the collected data with edited values from the provided `data` object.
 * It ensures that the edited values from the database are correctly set
 */
const getDataInterviewer = (getData: any, data: LunaticData | undefined, source?: LunaticModel) => {
    const callbackholder = getData();
    const dataCollected = callbackholder.COLLECTED;
    //dataCollected values get of lunatic
    if (callbackholder && dataCollected && source) {
        for (const prop in FieldNameEnumActivity) {
            const dataOfField = dataCollected[prop];
            //set values edited with values in bdd, because we don't recover the edited part with lunatic
            if (dataOfField) {
                dataOfField.EDITED = data?.COLLECTED?.[prop]?.EDITED;
            }
        }
        propsWorkTime(source).forEach(prop => {
            const dataOfField = dataCollected[prop];
            //set values edited with values in bdd, because we don't recover the edited part with lunatic
            if (dataOfField) {
                dataOfField.EDITED = data?.COLLECTED?.[prop]?.EDITED;
            }
        });
    }
    callbackholder.COLLECTED = dataCollected;
    return callbackholder;
};

const getBindingDependencies = (components: any) => {
    let bindings =
        components.filter((component: any) => component.componentType != "Sequence")[0]
            ?.bindingDependencies ?? [];
    return bindings;
};

const getVariablesActivity = (
    data: LunaticData | undefined,
    iteration: number | undefined | null,
    bindingDependencies: string[],
    value: any,
) => {
    const variables = new Map<string, any>();
    const isReviewerMode = isReviewer();
    const isLocked = data?.COLLECTED?.[FieldNameEnum.ISLOCKED]?.COLLECTED;
    bindingDependencies?.forEach((bindingDependency: string) => {
        const varE = data?.COLLECTED?.[bindingDependency]?.EDITED;
        const varC = data?.COLLECTED?.[bindingDependency]?.COLLECTED;

        const variableEdited = iteration != null && varE && Array.isArray(varE) ? varE[iteration] : varE;
        let variableCollected = iteration != null && Array.isArray(varC) ? varC[iteration] : varC;
        variableCollected = variableCollected ?? value?.[bindingDependency];
        const variable =
            isReviewerMode || isLocked ? (variableEdited ?? variableCollected) : variableCollected;
        variables.set(bindingDependency, variable);
    });
    return variables;
};

const getVariableOfWeeklyPlannerInterviewer = (
    varCollected: any,
    varEdited: any,
    value: any,
    bindingDependency: string,
) => {
    if (Array.isArray(varEdited) && varEdited.length > 0 && varEdited[0] != null) {
        return varEdited;
    } else {
        return varCollected ?? value?.[bindingDependency];
    }
};

const getVariablesWeeklyPlanner = (
    // data is not used anymore
    _: LunaticData | undefined,
    dataBdd: LunaticData | undefined,
    bindingDependencies: string[],
    value: any,
) => {
    const variables = new Map<string, any>();

    bindingDependencies?.forEach((bindingDependency: string) => {
        const varC = dataBdd?.COLLECTED?.[bindingDependency]?.COLLECTED;
        const varE = dataBdd?.COLLECTED?.[bindingDependency]?.EDITED;
        let variable = null;
        variable = getVariableOfWeeklyPlannerInterviewer(varC, varE, value, bindingDependency);
        variables.set(bindingDependency, variable);
    });
    return variables;
};

const getVariables = (
    data: LunaticData | undefined,
    dataBdd: LunaticData | undefined,
    iteration: number | undefined | null,
    bindingDependencies: string[],
    value: any,
    source: LunaticModel | undefined,
) => {
    if (isWorkTime(source)) {
        const variables = getVariablesWeeklyPlanner(data, dataBdd, bindingDependencies, value);
        return variables;
    } else {
        return getVariablesActivity(data, iteration, bindingDependencies, value);
    }
};

export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { data, callbackHolder, page, subPage, iteration, componentSpecificProps, overrideOptions } =
        props;
    let source = props.source;
    const { classes, cx } = useStyles();
    const { getComponents, getCurrentErrors, getData } = (lunatic as any).useLunatic(source, data, {
        initialPage:
            page +
            (subPage === undefined ? "" : `.${subPage}`) +
            (iteration === undefined ? "" : `#${iteration + 1}`),
        activeControls: false,
    });

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    const getDataLocal = () => {
        // Since we want to disable EDITED, only consider collected data
        return getDataInterviewer(getData, data, source);
    };

    callbackHolder.getData = getDataLocal;
    callbackHolder.getErrors = getCurrentErrors;

    if (!source) {
        source = getCurrentPageSource();
    }

    const renderComponent = () => {
        return (
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
                        const { id, componentType, response, options, value, ...other } = component;
                        // @ts-ignore Temp ignoring
                        const Component = (props.components ?? lunatic)[componentType];
                        return (
                            <div className="lunatic lunatic-component" key={`component-${id}`}>
                                <Component
                                    id={id}
                                    response={response}
                                    options={options ?? overrideOptions}
                                    {...other}
                                    errors={currentErrors}
                                    custom={edtComponents}
                                    componentSpecificProps={componentSpecificProps}
                                    variables={getVariables(
                                        data,
                                        getDataLocal(),
                                        iteration,
                                        getBindingDependencies(components),
                                        value,
                                        source,
                                    )}
                                    bindingDependencies={getBindingDependencies(components)}
                                    value={value}
                                />
                            </div>
                        );
                    })}
                </div>
            </Box>
        );
    };

    // Empty callbackHolder when component is unmounted
    useEffect(() => {
        return () => {
            callbackHolder.getData = () => ({});
            callbackHolder.getErrors = () => ({});
        };
    }, []);

    return source && data ? renderComponent() : renderLoading();
};

const useStyles = makeStylesEdt({ "name": { OrchestratorForStories } })(() => ({
    styleOverride: {
        width: "100%",
        maxWidth: "550px",
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
