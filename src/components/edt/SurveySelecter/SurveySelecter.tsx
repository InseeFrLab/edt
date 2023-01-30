import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { AppBar, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import { TabData } from "interface/component/Component";
import { makeStylesEdt } from "lunatic-edt";
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
    const { classes } = useStyles();
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
            return <img src={PersonSunIcon} alt={t("accessibility.asset.card.person-sun-alt")} />;
        } else {
            return <CalendarMonthOutlinedIcon className={classes.icon} />;
        }
    };

    const getTab = (tabData: TabData, index: number) => {
        return (
            <Tab
                key={"tab-" + index}
                className={classes.tab}
                icon={getTabIcon(tabData.isActivitySurvey)}
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
                        {tabsData
                            .filter((_, index) => index < maxTabsPerRow)
                            .map((tabData, index) => getTab(tabData, index))}
                    </Tabs>
                    <Box
                        className={classes.actionBox}
                        onClick={useCallback(() => setIsOpen(!isOpen), [open])}
                    >
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
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
                            .map((tabData, index) => getTab(tabData, index))}
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
