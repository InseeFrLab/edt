import { Box, TextField, Typography } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { FullScreenComponent } from "../ActivitySelecter/ActivitySelecter";
import { NomenclatureActivityOption, responsesType, responseType } from "../../../interface/lunatic-edt/ActivityTypes";
import { ActivityLabelProps } from "../../../interface/lunatic-edt/ComponentsSpecificProps";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";

type FreeInputProps = {
    states: {
        selectedCategories?: NomenclatureActivityOption[];
        fullScreenComponent?: FullScreenComponent;
        freeInput: string | undefined;
        showSubCategories: boolean;
    };
    specifiqueProps: {
        labels: ActivityLabelProps;
        label: string;
        isMobile: boolean;
        newItemId: string;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    };
    functions: {
        nextClickCallback: (routeToGoal: boolean) => void;
        onChange: (isFullyCompleted: boolean, id?: string, suggesterId?: string, label?: string) => void;
        handleChange(response: responseType, value: string | boolean | undefined): void;
    };
    renderTitle?: (
        fullScreenComponent: FullScreenComponent,
        selectedCategories: NomenclatureActivityOption[],
        showSubCategories: boolean,
        labels: ActivityLabelProps,
        label: string,
        classes: any,
        hasQuestionMark?: boolean,
    ) => JSX.Element;
    updateNewValue: (
        value: string | undefined,
        handleChange: (response: responseType, value: string | boolean | undefined) => void,
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ],
        newItemId: string,
    ) => void;
};

const FreeInput = memo((props: FreeInputProps) => {
    const { classes, cx } = useStyles();
    let { states, specifiqueProps, functions, renderTitle, updateNewValue } = props;

    const [createActivityValue, setCreateActivityValue] = useState<string | undefined>(states.freeInput);

    const freeInputOnChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setCreateActivityValue(e.target.value);
        },
        [],
    );

    const renderTitleFix = (labels: ActivityLabelProps) => {
        return <Typography className={classes.title}> {labels.addActivity}</Typography>;
    };

    return (
        <Box className={cx(classes.root, specifiqueProps.isMobile ? classes.freeInputMobileBox : "")}>
            <Box className={classes.labelBox}>
                {renderTitle
                    ? renderTitle(
                        states.fullScreenComponent ?? FullScreenComponent.FreeInput,
                        states.selectedCategories ?? [],
                        states.showSubCategories,
                        specifiqueProps.labels,
                        specifiqueProps.labels.addActivity,
                        classes,
                        false,
                    )
                    : renderTitleFix(specifiqueProps.labels)}
            </Box>
            <TextField
                value={createActivityValue}
                className={classes.freeInputTextField}
                onChange={freeInputOnChange}
                onBlur={() =>
                    updateNewValue(
                        createActivityValue,
                        functions.handleChange,
                        specifiqueProps.responses,
                        specifiqueProps.newItemId,
                    )
                }
                placeholder={specifiqueProps.labels.clickableListPlaceholder}
                label={specifiqueProps.label}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    "& label": { display: "grid", visibility: "hidden" },
                }}
            ></TextField>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { FreeInput } })(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    freeInputMobileBox: {
        justifyContent: "center",
        padding: "0rem 2rem",
    },
    freeInputBox: {
        height: "60vh",
        justifyContent: "center",
    },
    freeInputTextField: {
        width: "100%",
        backgroundColor: theme.variables.white,
        borderRadius: "5px",
    },
    labelBox: {
        padding: "1rem",
    },
    title: {
        color: theme.palette.info.main,
        fontSize: "20px",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "1rem",
    },
}));

export default createCustomizableLunaticField(FreeInput, "FreeInput");
