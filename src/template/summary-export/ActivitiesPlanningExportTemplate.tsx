import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface ActivitiesPlanningExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const ActivitiesPlanningExportTemplate = (props: ActivitiesPlanningExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    return (
        <View>
            <View style={classes.title}>
                <Text>{t("export.activities-summary.title.activities-planning")}</Text>
            </View>
            <View style={classes.activitiesPlanningBox}>
                <View style={classes.table}>
                    <View style={classes.tableRowHeader}>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.schedule")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.duration")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.activity")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.secondary-activity")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.location")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.presence")}
                            </Text>
                        </View>
                        <View style={classes.tableCol14}>
                            <Text style={classes.tableCell}>
                                {t("export.activities-summary.table-header.screen")}
                            </Text>
                        </View>
                    </View>
                    {exportData.activities.map((activity, index) => (
                        <View style={classes.tableRow} key={"row-activities-planning-" + index}>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>
                                    {activity.startTime + " - " + activity.endTime}
                                </Text>
                            </View>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>{activity.durationLabel}</Text>
                            </View>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>{activity.activity?.activityLabel}</Text>
                            </View>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>
                                    {activity.secondaryActivity?.activityLabel ??
                                        t("export.activities-summary.table-data.empty")}
                                </Text>
                            </View>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>{activity.place?.placeLabel}</Text>
                            </View>
                            <View style={classes.tableCol14}>
                                <Text style={classes.tableCell}>
                                    {activity.withSomeoneLabels ??
                                        t("export.activities-summary.table-data.empty")}
                                </Text>
                            </View>
                            <View style={classes.tableCol14}>
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
    );
};

const classes = StyleSheet.create({
    title: {
        backgroundColor: "#FCE15C",
        marginTop: 16,
        marginBottom: 16,
        padding: 3,
    },
    activitiesPlanningBox: {},
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
    tableCol14: {
        width: "14.3%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: "auto",
        marginTop: 3,
        marginBottom: 3,
        fontSize: 10,
    },
});

export { ActivitiesPlanningExportTemplate };
