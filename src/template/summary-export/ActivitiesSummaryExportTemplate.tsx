import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";

import logoInsee from "assets/illustration/logo.png";
import { useTranslation } from "react-i18next";
import { ActivitiesPlanningExportTemplate } from "template/summary-export/ActivitiesPlanningExportTemplate";
import { DayCharacteristicsExportTemplate } from "template/summary-export/DayCharacteristicsExportTemplate";
import { DaySummaryExportTemplate } from "template/summary-export/DaySummaryExportTemplate";
import { GlobalOrganisationExportTemplate } from "template/summary-export/GlobalOrganisationExportTemplate";
import { RoutesPlanningExportTemplate } from "template/summary-export/RoutesPlanningExportTemplate";
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
                            <Text style={classes.title}>
                                <Image style={classes.logo} src={logoInsee} />
                            </Text>
                        </View>
                        <View>
                            <Text style={classes.title}>
                                {t("export.activities-summary.header.edt-survey")}
                            </Text>
                            <Text style={classes.headerGreyColor}>
                                {t("export.activities-summary.header.house-reference")} XXXX
                            </Text>
                            <Text>{exportData.firstName}</Text>
                        </View>
                    </View>
                    <View style={classes.headerRow}>
                        <View>
                            <Text>
                                <Text style={classes.headerGreyColor}>
                                    {t("export.activities-summary.header.survey-day")}
                                </Text>
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

                <GlobalOrganisationExportTemplate exportData={exportData} />

                <ActivitiesPlanningExportTemplate exportData={exportData} />

                <RoutesPlanningExportTemplate exportData={exportData} />

                <DayCharacteristicsExportTemplate exportData={exportData} />

                <DaySummaryExportTemplate exportData={exportData} />
            </Page>
        </Document>
    );
};

const classes = StyleSheet.create({
    headerBox: {},
    title: {
        fontSize: 15,
    },
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
    body: {
        padding: 16,
    },
    valueColor: {
        color: "#4973D2",
    },
    headerGreyColor: {
        color: "#717171",
    },
});

export default ActivitiesSummaryExportTemplate;
