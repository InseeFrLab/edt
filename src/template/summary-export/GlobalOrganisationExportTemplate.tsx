import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "../../interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface GlobalOrganisationExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const GlobalOrganisationExportTemplate = (props: GlobalOrganisationExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    const getKeyOrganisation = (index: number) => {
        return "row-organisation-" + index;
    };

    return (
        <View>
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
                    {exportData.activitiesAndRoutes.map((activityOrRoute, index) => (
                        <View style={classes.tableRow} key={getKeyOrganisation(index)}>
                            <View style={classes.tableCol25}>
                                <Text style={classes.tableCell}>
                                    {activityOrRoute.startTime + " - " + activityOrRoute.endTime}
                                </Text>
                            </View>
                            <View style={classes.tableCol25}>
                                <Text style={classes.tableCell}>{activityOrRoute.durationLabel}</Text>
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
    );
};

const classes = StyleSheet.create({
    title: {
        backgroundColor: "#FCE15C",
        marginTop: 16,
        marginBottom: 16,
        padding: 3,
    },
    dayPlanningBox: {},
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
    tableCol25: {
        width: "25%",
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

export { GlobalOrganisationExportTemplate };
