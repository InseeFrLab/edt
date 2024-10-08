import { Box, Button, Typography } from "@mui/material";
import React, { ReactElement, memo, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Alert from "../Alert";
import ClickableList from "../ClickableList";
import FreeInput from "../FreeInput";
import Icon from "../Icon";
import {
    appendHistoryActivitySelecter,
    clickableListHistoryOnChange,
    clickableListOnChange,
    createActivityCallBack,
    createIndexSuggester,
    findRank1Category,
    getInputValue,
    nextStepFreeInput,
    onChange,
    processActivityAutocomplete,
    processActivityCategory,
    processNewActivity,
    selectFinalCategory,
    selectSubCategory,
    updateNewValue,
} from "./activityUtils";
import { ActivityLabelProps, ActivitySelecterSpecificProps } from "../../../interface/lunatic-edt/ComponentsSpecificProps";
import { ActivitySelecterNavigationEnum } from "../../../enumerations/lunatic-edt/ActivitySelecterNavigationEnum";
import { responseType, responsesType, NomenclatureActivityOption, SelectedActivity, AutoCompleteActiviteOption } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { splitLabelWithParenthesis, createCustomizableLunaticField } from "../../../utils/lunatic-edt";

type ActivitySelecterProps = {
    handleChange(response: responseType, value: string | boolean | undefined): void;
    componentSpecificProps: ActivitySelecterSpecificProps;
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ];
    label: string;
    value: { [key: string]: string | boolean };
    variables: Map<string, any>;
    bindingDependencies: string[];
};

export enum FullScreenComponent {
    Main,
    ClickableListComp,
    FreeInput,
}

export const selectedIdNewActivity = "selectedIdNewActivity";
export const selectedLabelNewActivity = "selectionValue - label";
export const historyInputSuggester = "historyInputSuggester";
export const historyActivitySelecter = "historyActivitySelecter";

const ActivitySelecter = memo((props: ActivitySelecterProps) => {
    let {
        handleChange,
        componentSpecificProps,
        responses,
        label,
        value,
        bindingDependencies,
        variables,
    } = props;
    bindingDependencies.forEach((bindingDependency: string) => {
        value[bindingDependency] = variables.get(bindingDependency);
    });

    const idBindingDep = responses?.[0]?.response;
    const suggesterIdBindingDep = responses?.[1]?.response;
    const labelBindingDep = responses?.[2]?.response;
    const isFullyCompletedBindingDep = responses?.[3]?.response;
    const historyActivitySelecterBindingDep = responses?.[5]?.response;

    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        categoriesIcons,
        activitesAutoCompleteRef,
        clickableListIconNoResult,
        setDisplayStepper,
        setDisplayHeader,
        categoriesAndActivitesNomenclature,
        labels,
        errorIcon,
        addToReferentielCallBack,
        onSelectValue,
        separatorSuggester,
        helpStep,
        chevronRightIcon,
        chevronRightIconAlt,
        searchIcon,
        searchIconAlt,
        extensionIcon,
        addWhiteIcon,
        addLightBlueIcon,
        modifiable = true,
        CreateIndex,
        indexSuggester,
    } = { ...componentSpecificProps };

    const SearchIcon = searchIcon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    const [selectedCategories, setSelectedCategories] = useState<NomenclatureActivityOption[]>([]);
    const [showSubCategories, setShowSubCategories] = useState<boolean>(false);
    const [selectRank1Category, setSelectRank1Category] = useState<
        NomenclatureActivityOption | undefined
    >(undefined);
    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const [selectedSuggesterId, setSelectedSuggesterId] = useState<string | undefined>();
    const [labelOfSelectedId, setLabelOfSelectedId] = useState<string | undefined>();
    const [fullScreenComponent, setFullScreenComponent] = useState<FullScreenComponent>(
        FullScreenComponent.Main,
    );
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 667);
    const [newValue, setNewValue] = useState<string | undefined>();

    const newItemId = useRef(uuidv4());
    const { classes, cx } = useStyles({
        "modifiable": modifiable,
        "innerHeight": window.innerHeight,
    });

    useEffect(() => {
        setDisplayStepper &&
            setDisplayStepper(
                fullScreenComponent === FullScreenComponent.Main &&
                (selectedCategories.length === 0 || !showSubCategories),
            );

        setDisplayHeader &&
            setDisplayHeader(fullScreenComponent === FullScreenComponent.ClickableListComp && !isMobile);
    }, [fullScreenComponent, selectedCategories]);

    useEffect(() => {
        localStorage.removeItem(selectedLabelNewActivity);
        localStorage.removeItem(selectedIdNewActivity);

        localStorage.setItem(
            historyActivitySelecter,
            value[historyActivitySelecterBindingDep.name]
                ? (value[historyActivitySelecterBindingDep.name] as string)
                : "",
        );

        const parsedValue: SelectedActivity = {
            id: value[idBindingDep.name] as string,
            suggesterId: value[suggesterIdBindingDep.name] as string,
            label: value[labelBindingDep.name] as string,
            isFullyCompleted: value[isFullyCompletedBindingDep.name] as boolean,
        };
        setNewValue(parsedValue.label);
        if (parsedValue.label) localStorage.setItem(selectedLabelNewActivity, parsedValue.label);
        if (parsedValue.id) localStorage.setItem(selectedIdNewActivity, parsedValue.id);
        if (helpStep == 3) parsedValue.id = "100";
        const rank1 = findRank1Category(parsedValue, categoriesAndActivitesNomenclature);
        setSelectRank1Category(rank1);

        processActivityCategory(
            value,
            parsedValue,
            categoriesAndActivitesNomenclature,
            setSelectedId,
            setSelectedCategories,
            setShowSubCategories,
        );
        processActivityAutocomplete(value, parsedValue, setFullScreenComponent, setSelectedSuggesterId);
        processNewActivity(
            value,
            parsedValue,
            categoriesAndActivitesNomenclature,
            setFullScreenComponent,
            setCreateActivityValue,
            setSelectedCategories,
        );
    }, []);

    useEffect(() => {
        setShowSubCategories(false);
        back(
            backClickEvent,
            selectedCategories,
            showSubCategories,
            {
                setSelectedId: setSelectedId,
                setLabelOfSelectedId: setLabelOfSelectedId,
                setSelectedSuggesterId: setSelectedSuggesterId,
                setSelectedCategories: setSelectedCategories,
                setCreateActivityValue: setCreateActivityValue,
                setFullScreenComponent: setFullScreenComponent,
            },
            {
                fullScreenComponent,
                separatorSuggester,
                historyActivitySelecterBindingDep,
            },
            {
                backClickCallback,
                handleChange,
            },
        );
    }, [backClickEvent]);

    useEffect(() => {
        next(
            nextClickEvent,
            {
                selectedCategory: selectRank1Category?.id,
                selectedId: selectedId,
                suggesterId: selectedSuggesterId,
                fullScreenComponent: fullScreenComponent,
                selectedCategories: selectedCategories,
                createActivityValue: createActivityValue,
                freeInput: newValue,
            },
            {
                setDisplayAlert,
                nextClickCallback,
                addToReferentielCallBack,
                handleChange,
            },
            {
                newItemId: newItemId.current,
                continueWithUncompleted: false,
                separatorSuggester,
                historyActivitySelecterBindingDep,
                responses,
            },
        );
    }, [nextClickEvent]);

    const handleSize = useCallback(() => {
        const isMobile1 = window.innerWidth <= 667;
        setIsMobile(isMobile1);

        setDisplayHeader &&
            setDisplayHeader(fullScreenComponent === FullScreenComponent.ClickableListComp && !isMobile);
    }, [window.innerWidth, window.innerHeight]);

    useEffect(() => {
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    });

    /**
     * Show categories of rank 2 or 3
     * @param category category du first rank
     * @returns
     */
    const renderSubRankCategory = (category: NomenclatureActivityOption, index: number) => {
        return (
            <Box
                className={getSubRankCategoryClassName(
                    category,
                    selectedId,
                    labelOfSelectedId,
                    classes,
                    cx,
                )}
                key={uuidv4()}
                onClick={() => {
                    categoriesActivitiesBoxClick(
                        {
                            selectedCategories,
                            selectedId,
                            labelOfSelectedId,
                            setSelectedId,
                            setLabelOfSelectedId,
                            setSelectedCategories,
                            setShowSubCategories,
                        },
                        handleChange,
                        onSelectValue,
                        {
                            selection: category,
                            categoriesAndActivitesNomenclature,
                            modifiable,
                            separatorSuggester,
                            historyActivitySelecterBindingDep,
                            responses,
                            newItemId: newItemId.current,
                        },
                    );
                }}
                tabIndex={index + 1}
                id={"subrankCategory-" + index}
            >
                <Box className={classes.optionIcon}>{extensionIcon} </Box>
                <Typography className={classes.subRankLabel}>{category.label}</Typography>
                {category.subs && (
                    <Icon
                        icon={chevronRightIcon}
                        alt={chevronRightIconAlt}
                        className={classes.chevronIcon}
                    />
                )}
            </Box>
        );
    };

    return (
        <Box>
            {componentSpecificProps && categoriesAndActivitesNomenclature && (
                <>
                    <Alert
                        isAlertDisplayed={displayAlert}
                        onCompleteCallBack={() => setDisplayAlert(false)}
                        onCancelCallBack={() =>
                            next(
                                nextClickEvent,
                                {
                                    selectedCategory: selectRank1Category?.id,
                                    selectedId: selectedId,
                                    suggesterId: selectedSuggesterId,
                                    fullScreenComponent: fullScreenComponent,
                                    selectedCategories: selectedCategories,
                                    createActivityValue: createActivityValue,
                                    freeInput: newValue,
                                },
                                {
                                    setDisplayAlert,
                                    nextClickCallback,
                                    addToReferentielCallBack,
                                    handleChange,
                                },
                                {
                                    newItemId: newItemId.current,
                                    continueWithUncompleted: true,
                                    separatorSuggester,
                                    historyActivitySelecterBindingDep,
                                    responses,
                                },
                            )
                        }
                        labels={{
                            content: labels.alertMessage,
                            cancel: labels.alertIgnore,
                            complete: labels.alertComplete,
                        }}
                        icon={errorIcon}
                    ></Alert>
                    {renderClickableList(
                        fullScreenComponent,
                        {
                            handleChange,
                            nextClickCallback,
                            setDisplayAlert,
                            nextStepClickableList,
                            CreateIndex,
                            indexSuggester,
                        },
                        {
                            selectedCategory: selectRank1Category?.id,
                            selectedId: selectedId,
                            suggesterId: selectedSuggesterId,
                            fullScreenComponent: fullScreenComponent,
                            selectedCategories: selectedCategories,
                            createActivityValue: createActivityValue,
                            freeInput: newValue,
                        },
                        {
                            setCreateActivityValue,
                            setFullScreenComponent,
                            setNewValue,
                            setSelectedSuggesterId,
                        },
                        {
                            activitesAutoCompleteRef,
                            selectedSuggesterId,
                            clickableListIconNoResult,
                            labels,
                            isMobile,
                            separatorSuggester,
                            modifiable,
                            newItemId: newItemId.current,
                            historyActivitySelecterBindingDep,
                            responses,
                        },
                        classes,
                        addLightBlueIcon,
                        addWhiteIcon,
                        extensionIcon,
                        <SearchIcon aria-label={searchIconAlt} />,
                    )}

                    {renderFreeInput(
                        {
                            selectedCategories,
                            createActivityValue,
                            fullScreenComponent,
                            selectedCategory: selectRank1Category?.id,
                            selectedId: selectedId,
                            suggesterId: selectedSuggesterId,
                            freeInput: newValue,
                            showSubCategories,
                        },
                        {
                            labels,
                            label,
                            isMobile,
                            newItemId: newItemId.current,
                            displayAlertNewActivity:
                                fullScreenComponent == FullScreenComponent.FreeInput
                                    ? (createActivityValue === undefined ||
                                        createActivityValue === "") &&
                                    !true
                                    : selectRank1Category?.id === undefined &&
                                    selectedId === undefined &&
                                    selectedSuggesterId === undefined &&
                                    !true,
                            routeToGoal: selectedCategories[selectedCategories.length - 1]
                                ? false
                                : true,
                            modifiable: modifiable,
                            separatorSuggester,
                            historyActivitySelecterBindingDep,
                            responses,
                        },
                        {
                            nextClickCallback,
                            addToReferentielCallBack,
                            setDisplayAlert,
                            handleChange,
                        },
                        classes,
                        cx,
                        addWhiteIcon,
                    )}

                    {fullScreenComponent === FullScreenComponent.Main && (
                        <Box className={classes.root}>
                            {renderTitle(
                                fullScreenComponent,
                                selectedCategories,
                                showSubCategories,
                                labels,
                                label,
                                classes,
                            )}

                            {renderSearchInput(
                                selectedCategories,
                                showSubCategories,
                                setFullScreenComponent,
                                classes,
                                cx,
                                {
                                    labels,
                                    helpStep,
                                    searchIcon,
                                    searchIconAlt,
                                    separatorSuggester,
                                    historyActivitySelecterBindingDep,
                                },
                                { handleChange },
                            )}

                            {renderCategories(
                                {
                                    selectedCategories,
                                    selectedId,
                                    labelOfSelectedId,
                                    createActivityValue,
                                    fullScreenComponent,
                                    selectedCategory: selectRank1Category?.id,
                                    suggesterId: selectedSuggesterId,
                                    showSubCategories,
                                    setSelectedCategories,
                                    setSelectedId,
                                    setLabelOfSelectedId,
                                    setShowSubCategories,
                                },
                                {
                                    setFullScreenComponent,
                                    renderSubRankCategory,
                                    onSelectValue,
                                    handleChange,
                                },
                                {
                                    categoriesAndActivitesNomenclature,
                                    labels,
                                    categoriesIcons,
                                    helpStep,
                                    modifiable,
                                    separatorSuggester,
                                    historyActivitySelecterBindingDep,
                                    responses,
                                    newItemId: newItemId.current,
                                },
                                classes,
                                cx,
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
});

/**
 * Show categories of rank 1
 * @param category
 * @returns
 */
const renderRank1Category = (
    category: NomenclatureActivityOption,
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setShowSubCategories: (show: boolean) => void;
    },
    functions: {
        onSelectValue: () => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        categoriesIcons: {
            [id: string]: {
                icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
                altIcon: string;
            };
        };
        helpStep: number | undefined;
        modifiable: boolean | undefined;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        newItemId: string;
    },
    index: number,
    classes: any,
    cx: any,
) => {
    const id = Number(category.id);
    const { mainLabel, secondLabel } = splitLabelWithParenthesis(category.label);
    return (
        <Box
            className={cx(
                classes.rank1Category,
                inputs.helpStep == 1 && ["100", "200"].includes(category.id)
                    ? classes.rank1CategoryHelp
                    : "",
                states.selectedCategory == category.id ? classes.rank1CategorySelected : undefined,
                !inputs.modifiable ? classes.disabled : "",
            )}
            key={uuidv4()}
            onClick={() =>
                categoriesActivitiesBoxClick(states, functions.handleChange, functions.onSelectValue, {
                    selection: category,
                    categoriesAndActivitesNomenclature: inputs.categoriesAndActivitesNomenclature,
                    modifiable: inputs.modifiable,
                    separatorSuggester: inputs.separatorSuggester,
                    historyActivitySelecterBindingDep: inputs.historyActivitySelecterBindingDep,
                    responses: inputs.responses,
                    newItemId: inputs.newItemId,
                })
            }
            tabIndex={index + 1}
            id={"rankCategory-" + index}
        >
            <Icon
                className={classes.icon}
                icon={inputs.categoriesIcons[id].icon}
                alt={inputs.categoriesIcons[id].altIcon}
            />
            <Typography className={classes.rank1MainLabel}>{mainLabel}</Typography>
            {secondLabel && <Typography className={classes.rank1SecondLabel}>{secondLabel}</Typography>}
        </Box>
    );
};

/**
 * When category selected,
 * if exist subcategories, save category selectionned uncompleted
 * other save category completed
 * @param selection
 * @param onChange
 * @param onSelectValue
 */
const categoriesActivitiesBoxClick = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setShowSubCategories: (show: boolean) => void;
    },
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    onSelectValue: () => void,
    inputs: {
        selection: NomenclatureActivityOption;
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        modifiable: boolean | undefined;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        newItemId: string;
    },
) => {
    states.setShowSubCategories(true);
    if (inputs.modifiable) {
        if (inputs.selection.subs) {
            selectSubCategory(
                states.selectedId,
                states.selectedCategories,
                states.setSelectedCategories,
                handleChange,
                inputs,
            );
        } else {
            selectFinalCategory(states, onSelectValue, inputs, handleChange);
        }
    }
};

const renderTitle = (
    fullScreenComponent: FullScreenComponent,
    selectedCategories: NomenclatureActivityOption[],
    showSubCategories: boolean,
    labels: ActivityLabelProps,
    label: string,
    classes: any,
    hasQuestionMark = true,
) => {
    return selectedCategories.length === 0 || !showSubCategories ? (
        <Typography className={classes.title}>
            {label}
            {hasQuestionMark ? <>&nbsp;?</> : <></>}
        </Typography>
    ) : (
        <Typography className={classes.title}>
            {getTextTitle(fullScreenComponent, selectedCategories, labels, label)}
        </Typography>
    );
};

const renderCategories = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        suggesterId: string | undefined;
        showSubCategories: boolean;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setShowSubCategories: (show: boolean) => void;
    },
    functions: {
        setFullScreenComponent: (comp: FullScreenComponent) => void;
        renderSubRankCategory: (category: NomenclatureActivityOption, index: number) => JSX.Element;
        onSelectValue: () => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        categoriesIcons: {
            [id: string]: {
                icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
                altIcon: string;
            };
        };
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        labels: ActivityLabelProps;
        helpStep: number | undefined;
        modifiable: boolean | undefined;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        newItemId: string;
    },
    classes: any,
    cx: any,
) => {
    return !states.showSubCategories ? (
        <Box className={classes.rank1CategoriesBox}>
            {inputs.categoriesAndActivitesNomenclature.map((d, index) => {
                return renderRank1Category(
                    d,
                    states,
                    {
                        onSelectValue: functions.onSelectValue,
                        handleChange: functions.handleChange,
                    },
                    inputs,
                    index,
                    classes,
                    cx,
                );
            })}
        </Box>
    ) : (
        <Box className={classes.rank1CategoriesBox}>
            {states.selectedCategories[states.selectedCategories.length - 1]?.subs?.map((s, index) => {
                return functions.renderSubRankCategory(s, index);
            })}
            <Button
                className={classes.buttonOther}
                onClick={() =>
                    clickAutreButton(
                        functions.setFullScreenComponent,
                        {
                            selectedCategories: states.selectedCategories,
                            separatorSuggester: inputs.separatorSuggester,
                            historyActivitySelecterBindingDep: inputs.historyActivitySelecterBindingDep,
                        },
                        functions,
                    )
                }
            >
                {inputs.labels.otherButton}
            </Button>
        </Box>
    );
};

const renderSearchInput = (
    selectedCategories: NomenclatureActivityOption[],
    showSubCategories: boolean,
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    classes: any,
    cx: any,
    inputs: {
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        labels: ActivityLabelProps;
        helpStep: number | undefined;
        searchIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        searchIconAlt: string;
    },
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
) => {
    return (
        (selectedCategories.length === 0 || !showSubCategories) && (
            <Box
                className={cx(
                    classes.activityInput,
                    inputs.helpStep == 2 ? classes.activityInputHelp : "",
                )}
                onClick={() => {
                    appendHistoryActivitySelecter(
                        ActivitySelecterNavigationEnum.SUGGESTER,
                        inputs.separatorSuggester,
                        inputs.historyActivitySelecterBindingDep,
                        functions.handleChange,
                    );
                    setFullScreenComponent(FullScreenComponent.ClickableListComp);
                }}
            >
                {
                    <Typography className={classes.activityInputLabel}>
                        {inputs.labels.clickableListPlaceholder}
                    </Typography>
                }
                <Icon
                    icon={inputs.searchIcon}
                    alt={inputs.searchIconAlt}
                    className={classes.activityInputIcon}
                />
            </Box>
        )
    );
};

const renderFreeInput = (
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
        showSubCategories: boolean;
    },
    props: {
        labels: ActivityLabelProps;
        label: string;
        isMobile: boolean;
        newItemId: string;
        displayAlertNewActivity: boolean;
        routeToGoal: boolean;
        modifiable: boolean;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    },
    functions: {
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string | undefined,
            newActivity: string,
        ) => void;
        setDisplayAlert: (display: boolean) => void;
        handleChange(response: responseType, value: string | boolean | undefined): void;
    },
    classes: any,
    cx: any,
    addIcon: ReactElement<any>,
) => {
    return (
        states.fullScreenComponent === FullScreenComponent.FreeInput && (
            <Box className={cx(classes.freeInputBox, props.isMobile ? classes.freeInputBoxMobile : "")}>
                <FreeInput
                    states={states}
                    specifiqueProps={props}
                    functions={functions}
                    renderTitle={renderTitle}
                    updateNewValue={updateNewValue}
                />
                <Button
                    className={classes.addActivityButton}
                    variant="contained"
                    startIcon={addIcon}
                    onClick={() => {
                        nextStepFreeInput(states, functions, props);
                        navNextStep(
                            getInputValue(),
                            functions.nextClickCallback,
                            props.routeToGoal,
                            props.newItemId,
                            props.responses,
                            functions.handleChange,
                        );
                    }}
                    disabled={!props.modifiable}
                >
                    {props.labels.saveButton}
                </Button>
            </Box>
        )
    );
};

const renderButtonSaveClickableList = (
    classes: any,
    modifiable: boolean,
    label: string,
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        setDisplayAlert: (display: boolean) => void;
        nextStepClickableList: (
            states: {
                selectedCategory: string | undefined;
                selectedId: string | undefined;
                suggesterId: string | undefined;
                fullScreenComponent: FullScreenComponent;
                selectedCategories: NomenclatureActivityOption[];
                createActivityValue: string | undefined;
            },
            setDisplayAlert: (display: boolean) => void,
            nextClickCallback: (routeToGoal: boolean) => void,
            displayAlert1: boolean,
            routeToGoal: boolean,
        ) => void;
    },
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
    },
) => {
    let selectedActId =
        localStorage.getItem(selectedIdNewActivity) != "" || states.selectedId === undefined;
    let displayAlert =
        states.fullScreenComponent == FullScreenComponent.FreeInput
            ? states.freeInput === undefined || states.freeInput === ""
            : states.selectedCategory === undefined &&
            selectedActId === undefined &&
            states.suggesterId === undefined;

    return (
        <Box className={classes.buttonSaveClickableList}>
            <Button
                className={classes.saveNewActivityButton}
                variant="contained"
                onClick={() =>
                    functions.nextStepClickableList(
                        states,
                        functions.setDisplayAlert,
                        functions.nextClickCallback,
                        displayAlert,
                        true,
                    )
                }
                disabled={!modifiable}
            >
                {label}
            </Button>
        </Box>
    );
};

const renderClickableList = (
    fullScreenComponent: FullScreenComponent,
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        setDisplayAlert: (display: boolean) => void;
        nextStepClickableList: (
            states: {
                selectedCategory: string | undefined;
                selectedId: string | undefined;
                suggesterId: string | undefined;
                fullScreenComponent: FullScreenComponent;
                selectedCategories: NomenclatureActivityOption[];
                createActivityValue: string | undefined;
            },
            setDisplayAlert: (display: boolean) => void,
            nextClickCallback: (routeToGoal: boolean) => void,
            displayAlert1: boolean,
            routeToGoal: boolean,
        ) => void;
        CreateIndex(
            optionsFiltered: AutoCompleteActiviteOption[],
        ): elasticlunr.Index<AutoCompleteActiviteOption>;
        indexSuggester: elasticlunr.Index<AutoCompleteActiviteOption>;
    },
    states: {
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        freeInput: string | undefined;
    },
    setters: {
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
        setNewValue: (value?: string) => void;
        setSelectedSuggesterId: (id: string | undefined) => void;
    },
    inputs: {
        activitesAutoCompleteRef: AutoCompleteActiviteOption[];
        selectedSuggesterId: string | undefined;
        clickableListIconNoResult: ReactElement<any>;
        labels: ActivityLabelProps;
        isMobile: boolean;
        separatorSuggester: string;
        modifiable: boolean;
        newItemId: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    },
    classes: any,
    iconAddLightBlue: ReactElement<any>,
    iconAddWhite: ReactElement<any>,
    iconExtension: ReactElement<any>,
    iconSearch: ReactElement<any>,
) => {
    const indexInfo = createIndexSuggester(
        inputs.activitesAutoCompleteRef,
        inputs.selectedSuggesterId,
        functions.CreateIndex,
        functions.indexSuggester,
    );
    const historyInputSuggesterValue = localStorage.getItem(historyInputSuggester) ?? "";

    return (
        fullScreenComponent == FullScreenComponent.ClickableListComp && (
            <Box className={classes.clickableListBox}>
                <ClickableList
                    className={inputs.isMobile ? classes.clickableListMobile : classes.clickableList}
                    optionsFiltered={indexInfo[1]}
                    index={indexInfo[0]}
                    selectedValue={indexInfo[2]}
                    historyInputSuggesterValue={historyInputSuggesterValue}
                    handleChange={(id: string, label: string) =>
                        clickableListOnChange(
                            id,
                            functions.handleChange,
                            inputs.responses,
                            inputs.newItemId,
                            setters.setSelectedSuggesterId,
                            label,
                        )
                    }
                    handleChangeHistorySuggester={(value: string) => clickableListHistoryOnChange(value)}
                    createActivity={(label: string) =>
                        createActivityCallBack(
                            {
                                selectedCategoryId:
                                    states.selectedCategories[states.selectedCategories.length - 1]?.id,
                                selectedCategories: states.selectedCategories,
                            },
                            setters,
                            functions,
                            {
                                activityLabel: label,
                                newItemId: inputs.newItemId,
                                separatorSuggester: inputs.separatorSuggester,
                                historyActivitySelecterBindingDep:
                                    inputs.historyActivitySelecterBindingDep,
                                responses: inputs.responses,
                            },
                        )
                    }
                    placeholder={inputs.labels.clickableListPlaceholder}
                    notFoundLabel={inputs.labels.clickableListNotFoundLabel}
                    notFoundComment={inputs.labels.clickableListNotFoundComment}
                    notSearchLabel={inputs.labels.clickableListNotSearchLabel}
                    addActivityButtonLabel={inputs.labels.clickableListAddActivityButton}
                    iconNoResult={inputs.clickableListIconNoResult}
                    autoFocus={true}
                    isMobile={inputs.isMobile}
                    separatorSuggester={inputs.separatorSuggester}
                    iconAddWhite={iconAddWhite}
                    iconAddLightBlue={iconAddLightBlue}
                    iconExtension={iconExtension}
                    iconSearch={iconSearch}
                    modifiable={inputs.modifiable}
                />
                {renderButtonSaveClickableList(
                    classes,
                    inputs.modifiable,
                    inputs.labels.validateButton,
                    functions,
                    states,
                )}
            </Box>
        )
    );
};

const back = (
    backClickEvent: React.MouseEvent | undefined,
    selectedCategories: NomenclatureActivityOption[],
    showSubCategories: boolean,
    setters: {
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
        setSelectedSuggesterId: (id?: string) => void;
        setSelectedCategories: (activities: NomenclatureActivityOption[]) => void;
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
    },
    inputs: {
        fullScreenComponent: FullScreenComponent;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
    },
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
        backClickCallback: () => void;
    },
) => {
    if (backClickEvent) {
        // Go back to previous page in application navigation
        if (
            inputs.fullScreenComponent === FullScreenComponent.Main &&
            (selectedCategories.length === 0 || !showSubCategories)
        ) {
            functions.backClickCallback();
            return;
        }
        const temp = [...selectedCategories];
        appendHistoryActivitySelecter(
            ActivitySelecterNavigationEnum.PREVIOUS_BUTTON,
            inputs.separatorSuggester,
            inputs.historyActivitySelecterBindingDep,
            functions.handleChange,
        );

        switch (inputs.fullScreenComponent) {
            case FullScreenComponent.Main:
                setters.setSelectedId(undefined);
                setters.setLabelOfSelectedId(undefined);
                temp.pop();
                setters.setSelectedCategories(temp);
                break;
            case FullScreenComponent.FreeInput:
                setters.setSelectedId(undefined);
                setters.setLabelOfSelectedId(undefined);
                setters.setCreateActivityValue(undefined);
                setters.setFullScreenComponent(FullScreenComponent.Main);
                break;
            case FullScreenComponent.ClickableListComp:
                setters.setSelectedSuggesterId(undefined);
                setters.setFullScreenComponent(FullScreenComponent.Main);
                break;
            default:
                break;
        }
    }
};

const nextStepClickableList = (
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
    },
    setDisplayAlert: (display: boolean) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    displayAlert1: boolean,
    routeToGoal: boolean,
) => {
    if (displayAlert1) {
        setDisplayAlert(true);
    } else {
        if (!states.suggesterId) {
            routeToGoal = false;
        }
        nextClickCallback(routeToGoal);
    }
};

const nextStepMain = (
    setDisplayAlert: (display: boolean) => void,
    nextClickCallback: (routeToGoal: boolean) => void,
    displayAlert1: boolean,
) => {
    if (displayAlert1) {
        setDisplayAlert(true);
    } else nextClickCallback(false);
};

const navNextStep = (
    value: string | undefined,
    nextClickCallback: (routeToGoal: boolean) => void,
    routeToGoal: boolean,
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
    nextClickCallback(routeToGoal);
};

const nextStep = (
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string | undefined,
            newActivity: string,
        ) => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        newItemId: string;
        continueWithUncompleted: boolean;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    },
) => {
    let routeToGoal = true;
    let selectedActId =
        localStorage.getItem(selectedIdNewActivity) != "" || states.selectedId === undefined;
    let displayAlert =
        states.fullScreenComponent == FullScreenComponent.FreeInput
            ? (states.freeInput === undefined || states.freeInput === "") &&
            !inputs.continueWithUncompleted
            : states.selectedCategory === undefined &&
            selectedActId === undefined &&
            states.suggesterId === undefined &&
            !inputs.continueWithUncompleted;
    switch (states.fullScreenComponent) {
        //option clickable list - when activity selected is one of sub category
        case FullScreenComponent.ClickableListComp:
            nextStepClickableList(
                states,
                functions.setDisplayAlert,
                functions.nextClickCallback,
                displayAlert,
                routeToGoal,
            );
            break;
        //option page principal - when activity selected is one category of first rank
        case FullScreenComponent.Main:
            if (states.selectedCategories.length === 0) {
                displayAlert =
                    states.selectedCategory === undefined &&
                    states.suggesterId === undefined &&
                    !inputs.continueWithUncompleted;
                onChange(functions.handleChange, {
                    responses: inputs.responses,
                    newItemId: inputs.newItemId,
                    isFullyCompleted: false,
                    id: states.selectedCategory,
                    suggesterId: undefined,
                });
            } else {
                displayAlert =
                    selectedActId === undefined &&
                    states.suggesterId === undefined &&
                    !inputs.continueWithUncompleted;
                onChange(functions.handleChange, {
                    responses: inputs.responses,
                    newItemId: inputs.newItemId,
                    isFullyCompleted: states.selectedId != null,
                    id: states.selectedId ?? states.selectedCategory,
                    suggesterId: undefined,
                });
            }
            nextStepMain(functions.setDisplayAlert, functions.nextClickCallback, displayAlert);
            break;
        //option free input - when new activity or activity searched
        case FullScreenComponent.FreeInput:
            nextStepFreeInput(states, functions, {
                separatorSuggester: inputs.separatorSuggester,
                historyActivitySelecterBindingDep: inputs.historyActivitySelecterBindingDep,
                newItemId: inputs.newItemId,
                displayAlertNewActivity: displayAlert,
                routeToGoal,
                responses: inputs.responses,
            });
            break;
        default:
            break;
    }
};

/**
 * Next step if doesn't need display alert
 * @param continueWithUncompleted
 * @param states
 * @param setDisplayAlert
 * @param nextClickCallback
 * @param addToReferentielCallBack
 * @param newItemId
 */
const next = (
    nextClickEvent: React.MouseEvent | undefined,
    states: {
        selectedCategory: string | undefined;
        selectedId: string | undefined;
        suggesterId: string | undefined;
        fullScreenComponent: FullScreenComponent;
        selectedCategories: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string | undefined,
            newActivity: string,
        ) => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        continueWithUncompleted: boolean;
        newItemId: string;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    },
) => {
    if (nextClickEvent) {
        nextStep(states, functions, inputs);
    }
};

const clickAutreButton = (
    setFullScreenComponent: (comp: FullScreenComponent) => void,
    inputs: {
        selectedCategories: NomenclatureActivityOption[];
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
    },
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
) => {
    appendHistoryActivitySelecter(
        ActivitySelecterNavigationEnum.OTHER_BUTTON,
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        functions.handleChange,
    );
    setFullScreenComponent(FullScreenComponent.ClickableListComp);
};

const getTextTitle = (
    fullScreenComponent: FullScreenComponent,
    selectedCategories: NomenclatureActivityOption[],
    labels: ActivityLabelProps,
    label: string,
) => {
    if (fullScreenComponent === FullScreenComponent.FreeInput) {
        return labels.addActivity;
    }
    if (selectedCategories.length === 0) {
        return label;
    }
    return `${labels.selectInCategory} «${selectedCategories[selectedCategories.length - 1]?.label} »`;
};

const getSubRankCategoryClassName = (
    category: NomenclatureActivityOption,
    selectedId: string | undefined,
    _labelOfSelectedId: string | undefined,
    classes: any,
    cx: any,
) => {
    const selectedActId = localStorage.getItem(selectedIdNewActivity);
    if (category.id === selectedId || category.id === selectedActId) {
        return cx(classes.subRankCategory, classes.selectedSubRankCategory);
    }
    return cx(classes.subRankCategory, category.id == "130" ? classes.rank1CategoryHelp : "");
};

const useStyles = makeStylesEdt<{ modifiable: boolean; innerHeight: number }>({
    "name": { ActivitySelecter },
})((theme, { modifiable }) => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    title: {
        color: theme.palette.info.main,
        fontSize: "20px",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "1rem",
    },
    activityInput: {
        width: "93%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    activityInputHelp: {
        zIndex: "1400",
    },
    activityInputLabel: {
        fontSize: "16px",
        color: "#5A6C95",
        margin: "1rem",
    },
    activityInputIcon: {
        margin: "1rem",
    },
    clickableList: {
        width: "300px",
        marginTop: "1rem",
    },
    clickableListMobile: {
        width: innerWidth - 10 + "px",
        marginTop: "0rem",
    },
    freeInputTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    rank1CategoriesBox: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        cursor: "pointer",
        padding: "1rem",
    },
    rank1Category: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        borderRadius: "15px",
    },
    rank1CategoryHelp: {
        zIndex: "1400",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
        cursor: !modifiable ? "default" : "",
    },
    rank1CategorySelected: {
        border: "2px solid #4973D2 !important",
        fontWeight: "bold",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
        cursor: !modifiable ? "default" : "",
    },
    icon: {
        width: "80px",
        height: "45px",
        marginTop: "1rem",
    },
    rank1MainLabel: {
        fontSize: "14px",
        textAlign: "center",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.secondary,
        fontWeight: "bold",
        marginTop: "1rem",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        marginLeft: "0.5rem",
    },
    rank1SecondLabel: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "0.5rem",
        marginRight: "0.5rem",
        marginBottom: "1rem",
        marginLeft: "0.5rem",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
    },
    subRankCategory: {
        border: "2px solid transparent",
        display: "flex",
        backgroundColor: theme.variables.white,
        marginTop: "4%",
        borderRadius: "6px",
        width: "100%",
        padding: "1rem",
        alignItems: "center",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
        cursor: !modifiable ? "default" : "",
    },
    subRankCategoryMobile: {
        marginTop: "3rem",
    },
    selectedSubRankCategory: {
        borderColor: theme.palette.primary.main,
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
        cursor: !modifiable ? "default" : "",
    },
    subRankLabel: {
        fontSize: "14px",
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.secondary,
        width: "80%",
        paddingLeft: "0.5rem",
    },
    optionIcon: {
        svg: {
            marginRight: "0.5rem",
            color: theme.palette.primary.main,
        },
    },
    chevronIcon: {
        color: theme.palette.primary.main,
        width: "10%",
    },
    buttonOther: {
        backgroundColor: theme.palette.primary.main,
        width: "60%",
        marginTop: "2rem",
        color: theme.variables.white,
    },
    addActivityButton: {
        margin: "2rem 0rem",
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

export default createCustomizableLunaticField(ActivitySelecter, "ActivitySelecter");
