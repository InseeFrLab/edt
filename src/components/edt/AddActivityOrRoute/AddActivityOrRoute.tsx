import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Modal } from "@mui/material";
import ActivityIcon from "../../../assets/illustration/activity.svg?react";
import RouteIcon from "../../../assets/illustration/route.svg?react";
import YellowPlusIcon from "../../../assets/illustration/yellow-plus.svg?react";
import { Default, Mobile } from "../../commons/Responsive/Responsive.tsx";
import { LunaticModel } from "../../../interface/lunatic/Lunatic";
import React from "react";
import AddActivityOrRouteDefault from "./AddActivityOrRouteDefault";
import AddActivityOrRouteMobile from "./AddActivityOrRouteMobile";

interface AddActivityOrRouteProps {
    labelledBy: string;
    describedBy: string;
    onClickActivity(idSurvey: string, source: LunaticModel): void;
    onClickRoute(idSurvey: string, source: LunaticModel): void;
    handleClose(): void;
    open: boolean;
}

const AddActivityOrRoute = (props: AddActivityOrRouteProps) => {
    const { labelledBy, describedBy, onClickActivity, onClickRoute, open, handleClose } = props;

    const { classes } = useStyles();

    return (
        <>
            <Box
                component="div"
                className={classes.shadowBackground}
                sx={{ display: open ? "visible" : "none" }}
            ></Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
            >
                <>
                    <Default>
                        <AddActivityOrRouteDefault
                            handleClose={handleClose}
                            onClickActivity={onClickActivity}
                            onClickRoute={onClickRoute}
                            className={classes.modal}
                            iconTitle={YellowPlusIcon}
                            iconActivity={ActivityIcon}
                            iconRoute={RouteIcon}
                        />
                    </Default>
                    <Mobile>
                        <AddActivityOrRouteMobile
                            handleClose={handleClose}
                            onClickActivity={onClickActivity}
                            onClickRoute={onClickRoute}
                            className={classes.modal}
                            iconTitle={YellowPlusIcon}
                            iconActivity={ActivityIcon}
                            iconRoute={RouteIcon}
                        />
                    </Mobile>
                </>
            </Modal>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { AddActivityOrRoute } })(theme => ({
    modal: {
        position: "absolute",
        backgroundColor: theme.palette.background.default,
        border: "2px solid transparent",
        boxShadow: "24",
        index: "2",
    },
    shadowBackground: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "#0000004D",
        index: "1",
    },
}));

export default AddActivityOrRoute;
