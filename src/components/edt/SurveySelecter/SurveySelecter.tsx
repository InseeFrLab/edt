import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { AppBar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import calendarMonth from "assets/illustration/mui-icon/calendar-month.svg";
import expandLess from "assets/illustration/mui-icon/expand-less.svg";
import expandMore from "assets/illustration/mui-icon/expand-more.svg";
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
    const [focused, setFocused] = React.useState(false);

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
            return <img src={PersonSunIcon} alt={t("accessibility.asset.card.person-sun-alt")} />;
        } else {
            return (
                <img
                    src={calendarMonth}
                    alt={t("accessibility.asset.mui-icon.calendar-month")}
                    className={classes.icon}
                />
            );
        }
    };

    const getTab = (tabData: TabData, index: number) => {
        return (
            <Tab
                key={"tab-" + index}
                className={cx(classes.tab, focused ? classes.tabFocused : "")}
                icon={getTabIcon(tabData.isActivitySurvey)}
                tabIndex={index}
                onFocus={useCallback(() => setFocused(true), [])}
                label={
                    <Box>
                        <Typography className={classes.alignText}>
                            {tabData.surveyDateLabel + " - " + tabData.score + "%"}
                        </Typography>
                        <Typography className={classes.alignText}>{tabData.firstNameLabel}</Typography>
                    </Box>
                }
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
                    >
                        {tabsDataFiltred.map((tabData, index) => getTab(tabData, index))}
                    </Tabs>
                    <Box className={classes.actionBox} onClick={handleToggle}>
                        {isOpen ? (
                            <img src={expandLess} alt={t("accessibility.asset.mui-icon.expand-less")} />
                        ) : (
                            <img src={expandMore} alt={t("accessibility.asset.mui-icon.expand-more")} />
                        )}
                    </Box>
                </Box>

                {isOpen && (
                    <Tabs
                        value={valueRowTwo}
                        onChange={handleChangeRowTwo}
                        className={classes.tabsBox}
                        aria-label={ariaLabel}
                    >
                        {tabsData
                            .filter((_, index) => index >= maxTabsPerRow)
                            .map((tabData, index) => getTab(tabData, tabsDataFiltred.length + index))}
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
    tabFocused: {},
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
