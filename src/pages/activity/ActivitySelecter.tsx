import { Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { saveData } from "service/survey-service";

import catIcon1 from "../../assets/illustration/activity-categories/1.svg";
import catIcon2 from "../../assets/illustration/activity-categories/2.svg";
import catIcon3 from "../../assets/illustration/activity-categories/3.svg";
import catIcon4 from "../../assets/illustration/activity-categories/4.svg";
import catIcon5 from "../../assets/illustration/activity-categories/5.svg";
import catIcon6 from "../../assets/illustration/activity-categories/6.svg";
import catIcon7 from "../../assets/illustration/activity-categories/7.svg";
import catIcon8 from "../../assets/illustration/activity-categories/8.svg";

import iconNoResult from "../../assets/illustration/error/puzzle.svg";
import activites from ".././../activites.json";

const ActivitySelecterPage = () => {
    const [backClickEvent, setBackClickEvent] = React.useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = React.useState<React.MouseEvent>();

    const specificProps = {
        categoriesIcons: [
            catIcon1,
            catIcon2,
            catIcon3,
            catIcon4,
            catIcon5,
            catIcon6,
            catIcon7,
            catIcon8,
        ],
        clickableListIconNoResult: iconNoResult,
        activitiesRef: activites,
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            console.log("nav back");
        },
        nextClickCallback: () => {
            console.log("navigate");
        },
    };

    const context = useOutletContext() as OrchestratorContext;
    const navigate = useNavigate();

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const next = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const back = (e: React.MouseEvent) => {
        setBackClickEvent(e);
    };

    return (
        <>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>

            <FlexCenter>
                <Button
                    onClick={e => {
                        back(e);
                    }}
                    sx={{ marginTop: "1rem" }}
                >
                    Précédent
                </Button>
                <Button
                    onClick={e => {
                        next(e);
                    }}
                    sx={{ marginTop: "1rem" }}
                >
                    Suivant
                </Button>
            </FlexCenter>
        </>
    );
};

export default ActivitySelecterPage;
