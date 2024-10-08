import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";


import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    FullScreenComponent,
    historyInputSuggester,
    selectedIdNewActivity,
    selectedLabelNewActivity,
} from "../ActivitySelecter/ActivitySelecter";
import {
    clickableListOnChange,
    createActivityCallBack,
    createIndexSuggester,
    getInputValue,
    onChange,
    updateNewValue,
} from "../ActivitySelecter/activityUtils";
import Alert from "../Alert";
import ClickableList from "../ClickableList";
import FreeInput from "../FreeInput";
import { CheckboxOneCustomOption, CheckboxOneSpecificProps, responsesType, responseType } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { isUUID, important, createCustomizableLunaticField } from "../../../utils/lunatic-edt";

export type CheckboxOneProps = {
    handleChange(
        response: { [name: string]: string },
        value: string | boolean | number | undefined,
    ): void;
    id?: string;
    label?: string;
    options: CheckboxOneCustomOption[];
    value: { [key: string]: string } | string | null | undefined;
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ];
    bindingDependencies: string[];
    className?: string;
    componentSpecificProps: CheckboxOneSpecificProps;
    variables: Map<string, any>;
};

const getComposantInit = (suggesterId: string | null, labelNewValue: string | null) => {
    if (suggesterId && labelNewValue) {
        return FullScreenComponent.FreeInput;
    } else {
        return suggesterId && suggesterId != ""
            ? FullScreenComponent.ClickableListComp
            : FullScreenComponent.Main;
    }
};

const CheckboxOneEdt = memo((props: CheckboxOneProps) => {
    let {
        id,
        value,
        label,
        options,
        className,
        handleChange,
        responses,
        bindingDependencies,
        componentSpecificProps,
        variables,
    } = props;
    const {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
        addToReferentielCallBack,
        onSelectValue,
        modifiable = true,
        activitesAutoCompleteRef,
        separatorSuggester,
        labelsClickableList,
        icons,
        indexSuggester,
        CreateIndex,
    } = {
        ...componentSpecificProps,
    };

    let selectedId = null;
    let suggesterId = null;
    let labelNewValue = null;

    if (typeof value == "string") {
        selectedId = variables.get(bindingDependencies[0]);
    } else if (typeof value == "object") {
        selectedId = variables.get(bindingDependencies[0]);
        suggesterId = variables.get(bindingDependencies[2]);
        labelNewValue = variables.get(bindingDependencies[1]);
    } else {
        selectedId = variables.get(bindingDependencies[0]);
    }

    const { classes, cx } = useStyles({
        "modifiable": modifiable,
        "innerWidth": window.innerWidth,
    });
    const [currentOption, setCurrentOption] = React.useState<string | undefined>(
        selectedId ?? undefined,
    );
    const [isSubchildDisplayed, setIsSubchildDisplayed] = React.useState<boolean>(selectedId != "");
    const [subComponent, setSubComponent] = React.useState<FullScreenComponent>(
        getComposantInit(suggesterId, labelNewValue),
    );

    const [newOptionValue, setNewOptionValue] = React.useState<string | undefined>(undefined);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 667);

    const [selectedSuggesterId, setSelectedSuggesterId] = useState<string | undefined>(
        suggesterId ?? "",
    );
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>(
        labelNewValue ?? "",
    );
    const [newValue, setNewValue] = useState<string | undefined>(labelNewValue ?? "");
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const newItemId = useRef(uuidv4());

    const idBindingDep: responsesType = {
        response: { name: bindingDependencies[0] },
    };
    const suggesterIdBindingDep: responsesType = bindingDependencies.length
        ? {
            response: { name: bindingDependencies[2] },
        }
        : idBindingDep;

    const labelBindingDep: responsesType = bindingDependencies.length
        ? {
            response: { name: bindingDependencies[1] },
        }
        : idBindingDep;

    const responsesActivity: [
        responsesType,
        responsesType,
        responsesType,
        undefined,
        undefined,
        undefined,
    ] = [idBindingDep, suggesterIdBindingDep, labelBindingDep, undefined, undefined, undefined];

    const indexInfo = createIndexSuggester(
        activitesAutoCompleteRef ?? [],
        selectedSuggesterId,
        CreateIndex,
        indexSuggester,
    );

    useEffect(() => {
        if (isSubchildDisplayed) {
            setIsSubchildDisplayed(false);
        } else if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent && nextClickCallback) {
            next(false, setDisplayAlert, nextClickCallback);
        }
    }, [nextClickEvent]);

    const handleSize = useCallback(() => {
        const isMobile1 = window.innerWidth <= 667;
        setIsMobile(isMobile1);
    }, [window.innerWidth, window.innerHeight]);

    useEffect(() => {
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    });

    const handleOptions = useCallback(
        (_event: React.MouseEvent<HTMLElement>, selectedOption: string) => {
            setCurrentOption(selectedOption);
            handleChange(responses[0].response, selectedOption);
            const listOptions = componentSpecificProps?.options ?? options;
            const optSelected = listOptions.find(opt => opt.value == selectedOption);

            if (isUUID(selectedOption) && optSelected) {
                handleChange({ "name": bindingDependencies[0] }, optSelected.value);
                if (bindingDependencies.length > 1) {
                    handleChange({ "name": bindingDependencies[1] }, optSelected.label);
                }
            }

            if (onSelectValue && selectedOption != null) {
                onSelectValue();
            }
        },
        [],
    );

    const onAddNewOption = useCallback(() => {
        setIsSubchildDisplayed(true);
        setSubComponent(FullScreenComponent.ClickableListComp);
    }, []);

    const next = (
        continueWithUncompleted: boolean,
        setDisplayAlert: (display: boolean) => void,
        nextClickCallback: () => void,
    ) => {
        if (
            (currentOption == null || currentOption == "") &&
            (newOptionValue == null || newOptionValue == "") &&
            !continueWithUncompleted
        ) {
            handleChange(responses[0].response, undefined);
            setDisplayAlert(true);
        } else {
            if (addToReferentielCallBack && newOptionValue) {
                addToReferentielCallBack({
                    label: newOptionValue || "",
                    value: newItemId.current,
                });
            }
            nextClickCallback();
        }
    };

    const handleAlert = useCallback(() => {
        if (nextClickCallback) next(true, setDisplayAlert, nextClickCallback);
    }, [displayAlert]);

    const handleChangeClickableList = (id: string, label: string) => {
        setNewOptionValue(label);

        handleChange({ "name": bindingDependencies[0] }, newItemId.current);
        handleChange({ "name": bindingDependencies[1] }, label);

        clickableListOnChange(
            id,
            handleChange,
            responsesActivity,
            newItemId.current,
            setSelectedSuggesterId,
            label,
        );
    };

    const createNewActivity = (label: string) => {
        setSubComponent(FullScreenComponent.FreeInput);
        setNewOptionValue(label);
        handleChange({ "name": bindingDependencies[0] }, newItemId.current);
        handleChange({ "name": bindingDependencies[1] }, label);
        createActivityCallBack(
            { selectedCategoryId: newItemId.current },
            {
                setFullScreenComponent,
                setCreateActivityValue,
                setNewValue,
            },
            {
                handleChange,
            },
            {
                activityLabel: label,
                newItemId: newItemId.current,
                separatorSuggester: separatorSuggester ?? "",
                historyActivitySelecterBindingDep: undefined,
                responses: responsesActivity,
            },
        );
    };

    const renderSuggester = () => {
        const historyInputSuggesterValue = localStorage.getItem(historyInputSuggester) ?? "";

        return (
            <Box className={classes.clickableListBox}>
                <ClickableList
                    className={isMobile ? classes.clickableListMobile : classes.clickableList}
                    optionsFiltered={indexInfo[1]}
                    index={indexInfo[0]}
                    selectedValue={indexInfo[2]}
                    historyInputSuggesterValue={historyInputSuggesterValue}
                    handleChange={(id: string, label: string) => handleChangeClickableList(id, label)}
                    handleChangeHistorySuggester={(value: string) => console.log(value)}
                    createActivity={(label: string) => createNewActivity(label)}
                    placeholder={labelsClickableList?.clickableListPlaceholder ?? ""}
                    notFoundLabel={labelsClickableList?.clickableListNotFoundLabel ?? ""}
                    notFoundComment={labelsClickableList?.clickableListNotFoundComment ?? ""}
                    notSearchLabel={labelsClickableList?.clickableListNotSearchLabel ?? ""}
                    addActivityButtonLabel={labelsClickableList?.clickableListAddActivityButton ?? ""}
                    iconNoResult={icons?.clickableListIconNoResult ?? <></>}
                    autoFocus={true}
                    isMobile={isMobile}
                    separatorSuggester={separatorSuggester}
                    iconAddWhite={icons?.iconAddWhite ?? <></>}
                    iconAddLightBlue={icons?.iconAddLightBlue ?? <></>}
                    iconExtension={icons?.iconExtension ?? <></>}
                    iconSearch={icons?.iconSearch ?? <></>}
                    modifiable={modifiable}
                />
                {renderButtonSaveClickableList(
                    classes,
                    modifiable,
                    componentSpecificProps?.labelsSpecifics?.validateButton ?? "",
                )}
            </Box>
        );
    };

    const navNextStep = (
        value: string | undefined,
        nextClickCallback: () => void,
        newItemId: string,
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ],
        handleChange: (response: responseType, value: string | boolean | undefined) => void,
    ) => {
        updateNewValue(value, handleChange, responses, newItemId);
        nextClickCallback();
    };

    const nextStepFreeInput = (
        states: {
            createActivityValue: string | undefined;
            freeInput: string | undefined;
        },
        displayAlertNewActivity: boolean,
    ) => {
        if (displayAlertNewActivity) {
            setDisplayAlert(true);
        } else {
            const label =
                states.freeInput ?? localStorage.getItem(selectedLabelNewActivity) ?? undefined;
            if (addToReferentielCallBack) {
                addToReferentielCallBack({
                    label: newOptionValue || "",
                    value: newItemId.current,
                });
            }
            localStorage.setItem(selectedIdNewActivity, newItemId.current);

            onChange(handleChange, {
                responses: responsesActivity,
                newItemId: newItemId.current,
                isFullyCompleted: true,
                id: undefined,
                suggesterId: newItemId.current,
                activityLabel: label,
            });
            if (nextClickCallback) nextClickCallback();
        }
    };

    const renderFreeInput = () => {
        return (
            nextClickCallback && (
                <Box className={cx(classes.freeInputBox, isMobile ? classes.freeInputBoxMobile : "")}>
                    <FreeInput
                        states={{
                            freeInput: newValue,
                        }}
                        specifiqueProps={{ labels, label, isMobile }}
                        functions={{ nextClickCallback, onChange }}
                        updateNewValue={updateNewValue}
                    />
                    <Button
                        className={classes.addActivityButton}
                        variant="contained"
                        startIcon={icons?.iconAddWhite}
                        onClick={() => {
                            navNextStep(
                                getInputValue(),
                                nextClickCallback,
                                newItemId.current,
                                responses,
                                handleChange,
                            );
                            nextStepFreeInput({ freeInput: newValue, createActivityValue }, false);
                        }}
                        disabled={!modifiable}
                    >
                        {labelsClickableList?.saveButton}
                    </Button>
                </Box>
            )
        );
    };

    const renderButtonSaveClickableList = (classes: any, modifiable: boolean, label: string) => {
        return (
            nextClickCallback && (
                <Box className={classes.buttonSaveClickableList}>
                    <Button
                        className={classes.saveNewActivityButton}
                        variant="contained"
                        onClick={() => nextClickCallback()}
                        disabled={!modifiable}
                    >
                        {label}
                    </Button>
                </Box>
            )
        );
    };

    return (
        <>
            {labels && (
                <Alert
                    isAlertDisplayed={displayAlert}
                    onCompleteCallBack={() => setDisplayAlert(false)}
                    onCancelCallBack={handleAlert}
                    labels={{
                        content: labels.alertMessage,
                        cancel: labels.alertIgnore,
                        complete: labels.alertComplete,
                    }}
                    icon={errorIcon ?? <></>}
                ></Alert>
            )}
            {!isSubchildDisplayed && fullScreenComponent == FullScreenComponent.Main && (
                <Box>
                    {label && (
                        <Box>
                            <Box className={classes.labelSpacer}>
                                <h1 className={classes.h1}>{label}&nbsp;?</h1>
                            </Box>
                        </Box>
                    )}
                    {(componentSpecificProps?.options ?? options) && (
                        <ToggleButtonGroup
                            orientation="vertical"
                            value={currentOption}
                            exclusive
                            onChange={modifiable ? handleOptions : undefined}
                            id={id}
                            aria-label={label}
                            className={cx(className, classes.toggleButtonGroup)}
                        >
                            {(componentSpecificProps?.options ?? options)?.map(
                                (option: CheckboxOneCustomOption, index) => (
                                    <ToggleButton
                                        className={
                                            componentSpecificProps?.icon ||
                                                componentSpecificProps?.defaultIcon
                                                ? classes.MuiToggleButtonIcon
                                                : classes.MuiToggleButton
                                        }
                                        key={option.value + "-" + index}
                                        value={option.value}
                                        tabIndex={index + 1}
                                        id={"checkboxone-" + index}
                                        disabled={!modifiable}
                                    >
                                        {componentSpecificProps?.icon && (
                                            <Box className={cx(classes.iconBox, classes.icon)}>
                                                {componentSpecificProps?.icon}
                                            </Box>
                                        )}
                                        {componentSpecificProps?.defaultIcon && (
                                            <Box className={classes.iconBox}>
                                                {componentSpecificProps.extensionIcon}
                                            </Box>
                                        )}
                                        <Box className={classes.labelBox}>{option.label}</Box>
                                    </ToggleButton>
                                ),
                            )}
                        </ToggleButtonGroup>
                    )}
                    {(componentSpecificProps?.options ?? options) &&
                        componentSpecificProps?.labelsSpecifics?.otherButtonLabel && (
                            <Box>
                                <Box className={classes.centerBox}>
                                    <Button
                                        variant="contained"
                                        onClick={onAddNewOption}
                                        id="add-new-option"
                                        disabled={!modifiable}
                                    >
                                        {componentSpecificProps.labelsSpecifics?.otherButtonLabel}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                </Box>
            )}

            {isSubchildDisplayed &&
                subComponent == FullScreenComponent.ClickableListComp &&
                renderSuggester()}
            {isSubchildDisplayed && subComponent == FullScreenComponent.FreeInput && renderFreeInput()}
        </>
    );
});

const useStyles = makeStylesEdt<{ modifiable: boolean; innerWidth: number }>({
    "name": { CheckboxOneEdt },
})((theme, { modifiable, innerWidth }) => ({
    MuiToggleButton: {
        marginBottom: "0.5rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.secondary.main,
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            color: theme.palette.secondary.main,
        },
    },
    MuiToggleButtonIcon: {
        marginBottom: "0.5rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.secondary.main,
        justifyContent: "flex-start",
        textAlign: "left",
        fontWeight: "bold",
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
        },
    },
    labelSpacer: {
        margin: "1rem 0rem",
        textAlign: "center",
    },
    iconBox: {
        svg: {
            marginRight: "0.5rem",
            color: theme.palette.primary.main,
            width: "25px",
        },
    },
    labelBox: {
        marginLeft: "0.25rem",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
    },
    titleBox: {
        display: "flex",
        alignItems: "center",
    },
    icon: {
        svg: {
            width: "25px",
            height: "25px",
        },
    },
    toggleButtonGroup: {
        marginTop: "1rem",
        width: important("98%"),
    },
    centerBox: {
        display: "flex",
        justifyContent: "center",
    },
    newOptionTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
    clickableList: {
        width: "300px",
        marginTop: "1rem",
    },
    clickableListMobile: {
        width: innerWidth - 5 + "px",
        marginTop: "0rem",
    },
    freeInputBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    freeInputBoxMobile: {
        height: "85vh",
        justifyContent: "center",
    },
    addActivityButton: {
        margin: "2rem 0rem",
    },
    buttonSaveClickableList: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
    saveNewActivityButton: {
        margin: "2rem 0rem",
        width: "80%",
    },
    clickableListBox: {
        height: innerHeight / 2 + "px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
}));

export default createCustomizableLunaticField(CheckboxOneEdt, "CheckboxOneEdt");
