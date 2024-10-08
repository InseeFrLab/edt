
import { Box, Button } from "@mui/material";
import ArrowBackIosIcon from "../../../../assets/illustration/mui-icon/arrow-back-ios.svg?react";
import ArrowForwardIosIcon from "../../../../assets/illustration/mui-icon/arrow-forward-ios.svg?react";
import DoneIcon from "../../../../assets/illustration/mui-icon/done.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import { useCallback } from "react";
import { isIOS, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { isDesktop } from "../../../../service/responsive";
import { makeStylesEdt } from "../../../../theme";

interface LoopNavigatorProps {
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    onValidate?(): void;
    nextLabel: string;
    previousLabel: string;
    validateLabel: string;
}

const LoopNavigator = (props: LoopNavigatorProps) => {
    const { onNext, onPrevious, onValidate, nextLabel, previousLabel, validateLabel } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const hasTwoButtons = (onPrevious && onNext) || (onPrevious && onValidate);
    const isItDesktop = isDesktop();

    const backClick = useCallback(
        (event: React.MouseEvent) => {
            onPrevious?.(event);
        },
        [onPrevious],
    );
    const nextClick = useCallback(
        (event: React.MouseEvent) => {
            onNext?.(event);
        },
        [onNext],
    );

    return (
        <>
            {!isItDesktop && <Box className={classes.gap}></Box>}
            <FlexCenter
                className={cx(
                    classes.validateButtonBox,
                    isItDesktop ? "" : classes.validateButtonBoxMobileTablet,
                    isIOS ? classes.buttonBoxPwa : "",
                )}
            >
                <>
                    {onPrevious && (
                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBackIosIcon
                                    aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
                                />
                            }
                            onClick={backClick}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                                isIOS && isMobile ? classes.buttonBoxPwa : "",
                            )}
                            id="previous-button"
                        >
                            <Box className={classes.label}>{previousLabel}</Box>
                        </Button>
                    )}
                    {onNext && !onValidate && (
                        <Button
                            variant="outlined"
                            endIcon={
                                <ArrowForwardIosIcon
                                    aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                                />
                            }
                            onClick={nextClick}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                                isIOS && isMobile ? classes.buttonBoxPwa : "",
                            )}
                            id="next-button"
                        >
                            <Box className={classes.label}>{nextLabel}</Box>
                        </Button>
                    )}
                    {onValidate && (
                        <Button
                            variant="outlined"
                            endIcon={<DoneIcon aria-label={t("accessibility.asset.mui-icon.done")} />}
                            onClick={onValidate}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                                isIOS && isMobile ? classes.buttonBoxPwa : "",
                            )}
                            id="validate-button"
                        >
                            <Box className={classes.label}>{validateLabel}</Box>
                        </Button>
                    )}
                </>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { LoopNavigator } })(theme => ({
    gap: {
        height: "5rem",
        width: "100%",
    },
    validateButtonBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
    },
    validateButtonBoxMobileTablet: {
        position: "fixed",
        bottom: "0",
        left: "0",
    },
    buttonBoxPwa: {
        height: "3.75rem",
    },
    navButton: {
        borderRadius: "0",
        height: "3.75rem",
    },
    navButtons: {
        width: "50%",
    },
    singleNavButton: {
        width: "100%",
    },
    label: {
        color: theme.palette.secondary.main,
    },
}));

export default LoopNavigator;
