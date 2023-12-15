import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface DayCharacteristicsExportTemplateProps {
    exportData: ActivitiesSummaryExportData;
}

const DayCharacteristicsExportTemplate = (props: DayCharacteristicsExportTemplateProps) => {
    const { exportData } = props;
    const { t } = useTranslation();

    return (
        <View>
            <View style={classes.title}>
                <Text>{t("export.activities-summary.title.day-characteristics")}</Text>
            </View>
            <View style={classes.dayCharacteristicsBox}>
                <View style={classes.tableNoBorder}>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesCharacteristics?.greatestActivityLabel}
                                </Text>
                                <Text>
                                    {t("export.activities-summary.day-characteristics.best-activity")}
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
                                    {t("export.activities-summary.day-characteristics.special-day")}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={classes.tableRow}>
                        <View style={classes.tableCol50}>
                            <View style={classes.valueAndLabel}>
                                <Text style={classes.value}>
                                    {exportData.userActivitiesCharacteristics?.worstActivityLabel}
                                </Text>
                                <Text>
                                    {t("export.activities-summary.day-characteristics.worst-activity")}
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
                                    {t("export.activities-summary.day-characteristics.kind-of-day")}
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
});

export { DayCharacteristicsExportTemplate };
