import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "@inseefrlab/lunatic-edt";
import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { FieldNameEnum, FieldNameEnumActivity } from "enumerations/FieldNameEnum";
import { LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import React from "react";
import { isReviewer } from "service/user-service";

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
    source?: LunaticModel;
    data?: LunaticData;
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

const getDataOfLoop = (collected: any, editedSaved: any, iteration: number | undefined) => {
    let maxLenght = Number(localStorage.getItem("loopSize") ?? 0);
    for (let i = 0; i < maxLenght; i++) {
        if (i != iteration || (collected[i] == null && i == iteration)) {
            collected[i] = editedSaved[i];
        }
    }
    return collected;
};

const getDataOfCurrentBinding = (
    collected: any,
    edited: any,
    collectedSaved: any,
    editedSaved: any,
    dataOfField: any,
    iteration: number | undefined,
) => {
    // partie collected dejà set (mode enquete) -> set values of collected (value current lunawtic) to edited
    // and collected remains with the collected value on bdd
    if (collected) {
        if (editedSaved && Array.isArray(collected)) {
            collected = getDataOfLoop(collected, editedSaved, iteration);
        }
        dataOfField.EDITED = collected;
        dataOfField.COLLECTED = collectedSaved;
    } else if (dataOfField) {
        dataOfField.EDITED = edited ?? editedSaved;
        dataOfField.COLLECTED = collectedSaved;
    }

    return dataOfField;
};

//prop is for activity and prop being modified
const isPropCurrent = (prop: string, bindings: string[]) => {
    return bindings != null && bindings.includes(prop);
};

//prop is a activity
const isPropActivity = (prop: string, dataOfField: any) => {
    return prop != FieldNameEnum.WEEKLYPLANNER && dataOfField;
};

//return a copy of a object
const copyObject = (object: any) => {
    if (object == null) return object;
    return Array.isArray(object) ? [...object] : JSON.parse(JSON.stringify(object));
};

const isWorkTime = (data: LunaticData) => {
    return data?.COLLECTED?.[FieldNameEnum.WEEKLYPLANNER] != null;
};

const propsWorkTime = (source: LunaticModel) => {
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
//if weekly planner, doesn't distinction edited/collected, so edited/collected get value of collected
const setDataOfWorkTimeReviewer = (
    source: LunaticModel | undefined,
    dataCollected: any,
    data: LunaticData | undefined,
) => {
    if (source) {
        const weeklyPlannerProps = propsWorkTime(source);
        weeklyPlannerProps.forEach(prop => {
            let dataOfField = dataCollected[prop];
            const collected = dataOfField?.COLLECTED;
            const collectedSaved = data?.COLLECTED?.[prop]?.COLLECTED;
            dataOfField.COLLECTED = collected;
        });
    }

    return dataCollected;
};

const setDataOfActivityReviewer = (
    dataCollected: any,
    data: LunaticData | undefined,
    components: any,
    iteration: number | undefined,
) => {
    const bindings: string[] = components?.filter(
        (component: any) => component.componentType != "Sequence",
    )[0]?.bindingDependencies;

    for (let prop in FieldNameEnumActivity as any) {
        let dataOfField = dataCollected[prop];
        const collected = dataOfField?.COLLECTED;
        const edited = dataOfField?.EDITED;
        const editedSaved = data?.COLLECTED?.[prop]?.EDITED;
        const collectedSaved = data?.COLLECTED?.[prop]?.COLLECTED;
        //prop activity + prop currently being edited
        if (isPropCurrent(prop, bindings)) {
            //get data of current prop ->
            //COLLECTED : value of bdd (COLLECTED)
            //EDITED: if exist EDITED -> value of lunatic for value[iteration], other -> value of bdd (EDITED)
            dataOfField = getDataOfCurrentBinding(
                copyObject(collected),
                copyObject(edited),
                copyObject(collectedSaved),
                copyObject(editedSaved),
                dataOfField,
                iteration,
            );
        } else if (isPropActivity(prop, dataOfField)) {
            //prop activity + prop not currently being edited,
            //so edited get value of edited in bdd, and collected get value of partie collected in bdd
            dataOfField.EDITED = copyObject(editedSaved);
            dataOfField.COLLECTED = copyObject(collectedSaved);
        }
    }
    return dataCollected;
};

//data of a reviewer
const getDataReviewer = (
    getData: any,
    data: LunaticData | undefined,
    components: any,
    iteration: number | undefined,
    source?: LunaticModel,
) => {
    const callbackholder = getData();
    let dataCollected = callbackholder.COLLECTED;

    // data -> get data of bdd, callbackholder -> lunatic / current data
    if (callbackholder && dataCollected) {
        if (isWorkTime(callbackholder)) {
            dataCollected = setDataOfWorkTimeReviewer(source, dataCollected, data);
        } else {
            dataCollected = setDataOfActivityReviewer(dataCollected, data, components, iteration);
        }
    }
    callbackholder.COLLECTED = dataCollected;
    return callbackholder;
};

//data of interviewer
const getDataInterviewer = (getData: any, data: LunaticData | undefined, source?: LunaticModel) => {
    const callbackholder = getData();
    const dataCollected = callbackholder.COLLECTED;
    //dataCollected values get of lunatic
    if (callbackholder && dataCollected && source) {
        for (let prop in FieldNameEnumActivity as any) {
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
                dataOfField.COLLECTED = dataOfField.COLLECTED ?? data?.COLLECTED?.[prop]?.COLLECTED;
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
    let variables = new Map<string, any>();
    const isReviewerMode = isReviewer();
    const isLocked = data?.COLLECTED?.[FieldNameEnum.ISLOCKED]?.COLLECTED;
    bindingDependencies?.forEach((bindingDependency: string) => {
        let varE = data?.COLLECTED?.[bindingDependency]?.EDITED;
        let varC = data?.COLLECTED?.[bindingDependency]?.COLLECTED;

        const variableEdited = iteration != null && varE && Array.isArray(varE) ? varE[iteration] : varE;
        let variableCollected = iteration != null && Array.isArray(varC) ? varC[iteration] : varC;
        variableCollected = variableCollected ?? value?.[bindingDependency];
        let variable =
            isReviewerMode || isLocked ? variableEdited ?? variableCollected : variableCollected;

        variables.set(bindingDependency, variable);
    });
    return variables;
};

const getVariablesWeeklyPlanner = (
    data: LunaticData | undefined,
    dataBdd: LunaticData | undefined,
    bindingDependencies: string[],
    value: any,
) => {
    let variables = new Map<string, any>();

    bindingDependencies?.forEach((bindingDependency: string) => {
        const varC = data?.COLLECTED?.[bindingDependency]?.COLLECTED;
        const variableCollected = varC ?? value?.[bindingDependency];
        variables.set(bindingDependency, variableCollected);
    });
    return variables;
};

const getVariables = (
    data: LunaticData | undefined,
    dataBdd: LunaticData | undefined,
    iteration: number | undefined | null,
    bindingDependencies: string[],
    value: any,
) => {
    if (bindingDependencies.find((bindingDependency: string) => bindingDependency == "WEEKLYPLANNER")) {
        const variables = getVariablesWeeklyPlanner(data, dataBdd, bindingDependencies, value);
        return variables;
    } else {
        return getVariablesActivity(data, iteration, bindingDependencies, value);
    }
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
        activeControls: false,
    });

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    const getDataLocal = () => {
        const dataLocal = isReviewer()
            ? getDataReviewer(getData, data, components, iteration)
            : getDataInterviewer(getData, data, source);
        return dataLocal;
    };

    cbHolder.getData = getDataLocal;
    cbHolder.getErrors = getCurrentErrors;

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
                        const Component = lunatic[componentType];
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
