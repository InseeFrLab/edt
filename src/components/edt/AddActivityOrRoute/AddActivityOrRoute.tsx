import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Modal } from "@mui/material";
import { ReactComponent as ActivityIcon } from "assets/illustration/activity.svg";
import { ReactComponent as RouteIcon } from "assets/illustration/route.svg";
import { ReactComponent as YellowPlusIcon } from "assets/illustration/yellow-plus.svg";
import { Default, Mobile } from "components/commons/Responsive/Responsive";
import { LunaticModel } from "interface/lunatic/Lunatic";
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
            <React.Fragment>
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
            </React.Fragment>
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
