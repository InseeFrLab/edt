import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "../../interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface DaySummaryExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const DaySummaryExportTemplate = (props: DaySummaryExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    return (
        <View>
            <View style={classes.title}>
                <Text>{t("export.activities-summary.title.day-summary")}</Text>
            </View>
            <View style={classes.daySummaryBox}>
                <View style={classes.greyBox}>
                    <View>
                        <Text>
                            {t("export.activities-summary.day-summary.activities-amount")}
                            {exportData.userActivitiesSummary?.activitiesAmount}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {t("export.activities-summary.day-summary.routes-amount")}
                            {exportData.userActivitiesSummary?.routesAmount}
                        </Text>
                    </View>
                </View>
                <View style={classes.tableNoBorder}>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.workingTimeLabel}
                                </Text>
                                <Text>{t("export.activities-summary.day-summary.working-time")}</Text>
                            </View>
                        </View>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.activitiesWithScreenAmount}
                                </Text>
                                <Text>
                                    {t(
                                        "export.activities-summary.day-summary.amount-activity-or-route-with-screen",
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.sleepingTimeLabel}
                                </Text>
                                <Text>{t("export.activities-summary.day-summary.sleeping-time")}</Text>
                            </View>
                        </View>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.activitiesTimeWithScreenLabel}
                                </Text>
                                <Text>
                                    {t(
                                        "export.activities-summary.day-summary.time-activity-with-screen",
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.homeTasksTimeLabel}
                                </Text>
                                <Text>
                                    {t("export.activities-summary.day-summary.house-tasks-time")}
                                </Text>
                            </View>
                        </View>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.realRouteTimeLabel}
                                </Text>
                                <Text>{t("export.activities-summary.day-summary.real-route-time")}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesSummary?.otherFamilyTasksTimeLabel}
                                </Text>
                                <Text>
                                    {t("export.activities-summary.day-summary.other-house-tasks-time")}
                                </Text>
                            </View>
                        </View>
                        <View style={classes.tableCol50}></View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const classes = StyleSheet.create({
    title: {
        backgroundColor: "#FCE15C",
        marginTop: 16,
        marginBottom: 16,
        padding: 3,
    },
    dayCharacteristicsBox: {},
    tableNoBorder: {
        display: "flex",
        width: "auto",
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableRowHeader: {
        margin: "auto",
        flexDirection: "row",
        backgroundColor: "#EDECF4",
    },
    tableCol50: {
        width: "50%",
    },
    tableCell: {
        margin: "auto",
        marginTop: 3,
        marginBottom: 3,
        fontSize: 10,
    },
    valueAndLabel: {
        display: "flex",
        flexDirection: "row",
        marginTop: 3,
        marginBottom: 3,
        fontSize: 10,
    },
    value: {
        color: "#4973D2",
        marginRight: 8,
        textAlign: "right",
        width: "30%",
    },
    daySummaryBox: {},
    greyBox: {
        backgroundColor: "#C3BFD9",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        fontSize: 10,
        padding: 3,
        marginBottom: 8,
    },
});

export { DaySummaryExportTemplate };
