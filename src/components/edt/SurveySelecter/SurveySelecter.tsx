import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { AppBar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { ReactComponent as PersonSunIcon } from "assets/illustration/card/person-sun.svg";
import { ReactComponent as CalendarMonthIcon } from "assets/illustration/mui-icon/calendar-month.svg";
import { ReactComponent as ExpandLessIcon } from "assets/illustration/mui-icon/expand-less.svg";
import { ReactComponent as ExpandMoreIcon } from "assets/illustration/mui-icon/expand-more.svg";
import { TabData } from "interface/component/Component";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface SurveySelecterProps {
    id: string;
    tabsData: TabData[];
    ariaLabel: string;
    selectedTab: number;
    onChangeSelected(tabData: TabData): void;
    maxTabsPerRow: number;
    isDefaultOpen?: boolean;
    maxTabIndex?: number;
}

const SurveySelecter = (props: SurveySelecterProps) => {
    const {
        id,
        tabsData,
        ariaLabel,
        onChangeSelected,
        selectedTab,
        isDefaultOpen = false,
        maxTabsPerRow,
        maxTabIndex = 20,
    } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const [valueRowOne, setValueRowOne] = React.useState<number | false>(
        selectedTab < maxTabsPerRow ? selectedTab : false,
    );
    const [valueRowTwo, setValueRowTwo] = React.useState<number | false>(
        selectedTab >= maxTabsPerRow ? selectedTab - maxTabsPerRow : false,
    );
    const [isOpen, setIsOpen] = React.useState(isDefaultOpen);

    const handleChangeRowOne = useCallback(
        (_event: React.ChangeEvent<{}>, newValue: number) => {
            setValueRowOne(newValue);
            onChangeSelected(tabsData[newValue]);
            setValueRowTwo(false);
        },
        [valueRowOne, valueRowTwo],
    );

    const handleChangeRowTwo = useCallback(
        (_event: React.ChangeEvent<{}>, newValue: number) => {
            setValueRowTwo(newValue);
            onChangeSelected(tabsData[newValue + maxTabsPerRow]);
            setValueRowOne(false);
        },
        [valueRowOne, valueRowTwo],
    );

    const getTabIcon = (isActivitySurvey: boolean): JSX.Element => {
        if (isActivitySurvey) {
            return <PersonSunIcon aria-label={t("accessibility.asset.card.person-sun-alt")} />;
        } else {
            return (
                <CalendarMonthIcon
                    aria-label={t("accessibility.asset.mui-icon.calendar-month")}
                    className={classes.icon}
                />
            );
        }
    };

    const renderLabel = (tabData: TabData) => {
        return (
            <Box>
                <Typography className={classes.alignText}>
                    {tabData.surveyDateLabel +
                        (tabData.isActivitySurvey ? " - " + tabData.score + "%" : "")}
                </Typography>
                <Typography className={classes.alignText}>{tabData.firstNameLabel}</Typography>
            </Box>
        );
    };

    const getTab = (tabData: TabData, index: number, tabIndex: number) => {
        return (
            <Tab
                key={"tab-" + index}
                className={cx(classes.tab)}
                icon={getTabIcon(tabData.isActivitySurvey)}
                tabIndex={tabIndex}
                label={renderLabel(tabData)}
            />
        );
    };

    const handleToggle = useCallback(() => {
        setIsOpen(isOpen => !isOpen);
    }, []);

    const tabsDataFiltred = tabsData.filter((_, index) => index < maxTabsPerRow);
    return (
        <Box id={id}>
            <AppBar className={classes.surveySelecterAppBar} position="static">
                <Box className={classes.firstRow}>
                    <Tabs
                        value={valueRowOne}
                        onChange={handleChangeRowOne}
                        className={classes.tabsBox}
                        aria-label={ariaLabel}
                        id="tabs-survey-selecter"
                    >
                        {tabsDataFiltred.map((tabData, index) =>
                            getTab(tabData, index, maxTabIndex + index + 1),
                        )}
                    </Tabs>
                    <Box className={classes.actionBox} onClick={handleToggle}>
                        {isOpen ? (
                            <ExpandLessIcon aria-label={t("accessibility.asset.mui-icon.expand-less")} />
                        ) : (
                            <ExpandMoreIcon aria-label={t("accessibility.asset.mui-icon.expand-more")} />
                        )}
                    </Box>
                </Box>

                {isOpen && (
                    <Tabs
                        value={valueRowTwo}
                        onChange={handleChangeRowTwo}
                        className={classes.tabsBox}
                        aria-label={ariaLabel}
                        id="tabs-survey-selecter-2"
                    >
                        {tabsData
                            .filter((_, index) => index >= maxTabsPerRow)
                            .map((tabData, index) =>
                                getTab(tabData, index, tabsDataFiltred.length + maxTabIndex + index + 1),
                            )}
                    </Tabs>
                )}
                <Divider light />
            </AppBar>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveySelecter } })(theme => ({
    surveySelecterAppBar: {
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.light,
    },
    firstRow: {
        display: "flex",
    },
    tabsBox: {
        width: "97%",
        alignItems: "center",
        "& .MuiTabs-flexContainer": { justifyContent: "space-evenly" },
    },
    tab: {
        flexDirection: "row",
        "& .MuiTab-iconWrapper": { marginRight: "0.5rem" },
    },
    notVisibleSelectedTab: {
        backgroundColor: "red",

        "&. Mui-selected": {
            backgroundColor: "red",
        },
    },
    actionBox: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    icon: { color: theme.palette.primary.main },
    alignText: {
        textAlign: "initial",
    },
}));

export default SurveySelecter;
