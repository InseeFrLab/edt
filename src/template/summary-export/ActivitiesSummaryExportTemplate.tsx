import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";

import { useTranslation } from "react-i18next";

interface ActivitiesSummaryExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const ActivitiesSummaryExportTemplate = (props: ActivitiesSummaryExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    return (
        <Document>
            <Page orientation="landscape" wrap size="A4" style={classes.body}>
                <View style={classes.headerBox}>
                    <View style={classes.headerRow}>
                        <View>
                            {/*<Image source="assets/illustration/logo_jpg.jpg" style={classes.logo} />*/}
                        </View>
                        <View>
                            <Text>{t("export.activities-summary.header.edt-survey")}</Text>
                            <Text>{t("export.activities-summary.header.house-reference")} XXXX</Text>
                            <Text>{exportData.firstName}</Text>
                        </View>
                    </View>
                    <View style={classes.headerRow}>
                        <View>
                            <Text>
                                {t("export.activities-summary.header.survey-day")}
                                <Text style={classes.valueColor}>{exportData.surveyDate}</Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={classes.valueColor}>
                                {exportData.userActivitiesCharacteristics?.userMarkLabel}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={classes.section}>
                    <View style={classes.title}>
                        <Text>{t("export.activities-summary.title.global-day-overview")}</Text>
                    </View>
                    <View style={classes.dayPlanningBox}>
                        <View style={classes.table}>
                            <View style={classes.tableRowHeader}>
                                <View style={classes.tableCol25}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.schedule")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol25}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.duration")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol25}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.activity")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol25}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.route")}
                                    </Text>
                                </View>
                            </View>
                            {exportData.activitiesAndRoutes.map(activityOrRoute => (
                                <View style={classes.tableRow}>
                                    <View style={classes.tableCol25}>
                                        <Text style={classes.tableCell}>
                                            {activityOrRoute.startTime + " - " + activityOrRoute.endTime}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol25}>
                                        <Text style={classes.tableCell}>
                                            {activityOrRoute.durationLabel}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol25}>
                                        <Text style={classes.tableCell}>
                                            {!activityOrRoute.isRoute ? "X" : ""}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol25}>
                                        <Text style={classes.tableCell}>
                                            {activityOrRoute.isRoute ? "X" : ""}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={classes.section}>
                    <View style={classes.title}>
                        <Text>{t("export.activities-summary.title.activities-planning")}</Text>
                    </View>
                    <View style={classes.activitiesPlanningBox}>
                        <View style={classes.table}>
                            <View style={classes.tableRowHeader}>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.schedule")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.duration")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.activity")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.activity-category")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.secondary-activity")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.location")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.presence")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol12}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.screen")}
                                    </Text>
                                </View>
                            </View>
                            {exportData.activities.map(activity => (
                                <View style={classes.tableRow}>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.startTime + " - " + activity.endTime}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>{activity.durationLabel}</Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.activity?.activityLabel}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>{"UNKNOWN"}</Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.secondaryActivity?.activityLabel ??
                                                t("export.activities-summary.table-data.empty")}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.place?.placeLabel}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.withSomeoneLabels ??
                                                t("export.activities-summary.table-data.empty")}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol12}>
                                        <Text style={classes.tableCell}>
                                            {activity.withScreen
                                                ? t("export.activities-summary.table-data.yes")
                                                : t("export.activities-summary.table-data.no")}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={classes.section}>
                    <View style={classes.title}>
                        <Text>{t("export.activities-summary.title.routes-planning")}</Text>
                    </View>
                    <View style={classes.routesPlanningBox}>
                        <View style={classes.table}>
                            <View style={classes.tableRowHeader}>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.schedule")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.duration")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.mean-of-transport")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.secondary-activity")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.presence")}
                                    </Text>
                                </View>
                                <View style={classes.tableCol16}>
                                    <Text style={classes.tableCell}>
                                        {t("export.activities-summary.table-header.screen")}
                                    </Text>
                                </View>
                            </View>
                            {exportData.routes.map(route => (
                                <View style={classes.tableRow}>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>
                                            {route.startTime + " - " + route.endTime}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>{route.durationLabel}</Text>
                                    </View>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>
                                            {route.meanOfTransportLabels}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>
                                            {route.secondaryActivity?.activityLabel ??
                                                t("export.activities-summary.table-data.empty")}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>
                                            {route.withSomeoneLabels ??
                                                t("export.activities-summary.table-data.empty")}
                                        </Text>
                                    </View>
                                    <View style={classes.tableCol16}>
                                        <Text style={classes.tableCell}>
                                            {route.withScreen
                                                ? t("export.activities-summary.table-data.yes")
                                                : t("export.activities-summary.table-data.no")}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={classes.section}>
                    <View style={classes.title}>
                        <Text>{t("export.activities-summary.title.day-characteristics")}</Text>
                    </View>
                    <View style={classes.dayCharacteristicsBox}>
                        <View style={classes.tableNoBorder}>
                            <View style={classes.tableRow}>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {
                                                exportData.userActivitiesCharacteristics
                                                    ?.greatestActivityLabel
                                            }
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.best-activity",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {exportData.userActivitiesCharacteristics?.isExceptionalDay
                                                ? t("export.activities-summary.table-data.yes")
                                                : t("export.activities-summary.table-data.no")}
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.special-day",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={classes.tableRow}>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {
                                                exportData.userActivitiesCharacteristics
                                                    ?.worstActivityLabel
                                            }
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.worst-activity",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {exportData.userActivitiesCharacteristics?.routeTimeLabel}
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.route-time-estimation",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={classes.tableRow}>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {exportData.userActivitiesCharacteristics?.kindOfDayLabel}
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.kind-of-day",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {exportData.userActivitiesCharacteristics?.phoneTimeLabel}
                                        </Text>
                                        <Text>
                                            {t(
                                                "export.activities-summary.day-characteristics.phone-time-estimation",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={classes.section}>
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
                                        <Text>
                                            {t("export.activities-summary.day-summary.working-time")}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {
                                                exportData.userActivitiesSummary
                                                    ?.activitiesWithScreenAmount
                                            }
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
                                        <Text>
                                            {t("export.activities-summary.day-summary.sleeping-time")}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}>
                                    <View style={classes.valueAndLabel}>
                                        <Text style={classes.value}>
                                            {
                                                exportData.userActivitiesSummary
                                                    ?.activitiesTimeWithScreenLabel
                                            }
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
                                        <Text>
                                            {t("export.activities-summary.day-summary.real-route-time")}
                                        </Text>
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
                                            {t(
                                                "export.activities-summary.day-summary.other-house-tasks-time",
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <View style={classes.tableCol50}></View>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const classes = StyleSheet.create({
    headerBox: {},
    logo: {
        width: "40px",
        height: "46px",
    },
    headerRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 10,
        padding: 3,
        marginBottom: 8,
    },
    section: {},
    title: {
        backgroundColor: "#FCE15C",
        marginTop: 16,
        marginBottom: 16,
        padding: 3,
    },
    dayPlanningBox: {},
    activitiesPlanningBox: {},
    routesPlanningBox: {},
    dayCharacteristicsBox: {},
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
    body: {},
    tableNoBorder: {
        display: "flex",
        width: "auto",
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
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
    tableCol12: {
        width: "12.5%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCol16: {
        width: "16.7%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCol25: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
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
    valueColor: {
        color: "#4973D2",
    },
});

export default ActivitiesSummaryExportTemplate;
