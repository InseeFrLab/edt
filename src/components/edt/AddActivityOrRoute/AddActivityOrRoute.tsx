import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { makeStyles } from "tss-react/mui";

interface AddActivityOrRouteProps {
    labelledBy: string;
    describedBy: string;
}

const AddActivityOrRoute = (props: AddActivityOrRouteProps) => {
    const { labelledBy, describedBy } = props;
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
                    <Box className={classes.modal}>
                        <Box id="modal-title" sx={{ display: "flex" }}>
                            caca
                        </Box>
                        <Box id="add-activity" className={classes.navigateBox}>
                            pipi
                        </Box>
                        <Box id="add-route" className={classes.navigateBox}>
                            popo
                        </Box>
                        <Button onClick={handleClose}>Close Child Modal</Button>
                    </Box>
                </Modal>
            </React.Fragment>
        </>
    );
};

const useStyles = makeStyles({ "name": { AddActivityOrRoute } })(theme => ({
    navigateBox: {
        cursor: "pointer",
    },
    modal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.palette.background.default,
        padding: "3.5rem",
        border: "2px solid transparent",
        borderRadius: "37px",
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
