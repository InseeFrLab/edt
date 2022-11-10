import { Box, Button, Modal } from "@mui/material";
import activity from "assets/illustration/activity.svg";
import route from "assets/illustration/route.svg";
import yellow_plus from "assets/illustration/yellow-plus.svg";
import { Default, Mobile } from "components/commons/Responsive/Responsive";
import { makeStylesEdt } from "lunatic-edt";
import React from "react";
import AddActivityOrRouteDefault from "./AddActivityOrRouteDefault";
import AddActivityOrRouteMobile from "./AddActivityOrRouteMobile";
interface AddActivityOrRouteProps {
    labelledBy: string;
    describedBy: string;
    onClickActivity(): void;
    onClickRoute(): void;
}

const AddActivityOrRoute = (props: AddActivityOrRouteProps) => {
    const { labelledBy, describedBy, onClickActivity, onClickRoute } = props;
    const { classes } = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box
                component="div"
                className={classes.shadowBackground}
                sx={{ display: open ? "visible" : "none" }}
            ></Box>
            <React.Fragment>
                <Button onClick={handleOpen}>Open Child Modal</Button>
                <Modal
                    hideBackdrop
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
                                iconTitle={yellow_plus}
                                iconActivity={activity}
                                iconRoute={route}
                            />
                        </Default>
                        <Mobile>
                            <AddActivityOrRouteMobile
                                handleClose={handleClose}
                                onClickActivity={onClickActivity}
                                onClickRoute={onClickRoute}
                                className={classes.modal}
                                iconTitle={yellow_plus}
                                iconActivity={activity}
                                iconRoute={route}
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
