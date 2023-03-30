import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface RoutesPlanningExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const RoutesPlanningExportTemplate = (props: RoutesPlanningExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    return (
        <View>
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
                    {exportData.routes.map((route, index) => (
                        <View style={classes.tableRow} key={"row-routes-planning-" + index}>
                            <View style={classes.tableCol16}>
                                <Text style={classes.tableCell}>
                                    {route.startTime + " - " + route.endTime}
                                </Text>
                            </View>
                            <View style={classes.tableCol16}>
                                <Text style={classes.tableCell}>{route.durationLabel}</Text>
                            </View>
                            <View style={classes.tableCol16}>
                                <Text style={classes.tableCell}>{route.meanOfTransportLabels}</Text>
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
    );
};

const classes = StyleSheet.create({
    title: {
        backgroundColor: "#FCE15C",
        marginTop: 16,
        marginBottom: 16,
        padding: 3,
    },
    routesPlanningBox: {},
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
    tableCol16: {
        width: "16.7%",
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

export { RoutesPlanningExportTemplate };
