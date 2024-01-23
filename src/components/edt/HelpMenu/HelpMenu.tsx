import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Modal } from "@mui/material";
import { Default, Mobile } from "components/commons/Responsive/Responsive";
import { LunaticModel } from "interface/lunatic/Lunatic";
import HelpMenuInner from "./HelpMenuInner";

interface HelpMenuProps {
    labelledBy: string;
    describedBy: string;
    onClickContact(idSurvey: string, source: LunaticModel): void;
    onClickInstall(idSurvey: string, source: LunaticModel): void;
    onClickHelp(idSurvey: string, source: LunaticModel): void;
    handleClose(): void;
    open: boolean;
}

const HelpMenu = (props: HelpMenuProps) => {
    const { labelledBy, describedBy, onClickContact, onClickInstall, onClickHelp, open, handleClose } =
        props;

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
                        <HelpMenuInner
                            handleClose={handleClose}
                            onClickContact={onClickContact}
                            onClickInstall={onClickInstall}
                            onClickHelp={onClickHelp}
                            className={classes.modal}
                            isMobile={false}
                        />
                    </Default>
                    <Mobile>
                        <HelpMenuInner
                            handleClose={handleClose}
                            onClickContact={onClickContact}
                            onClickInstall={onClickInstall}
                            onClickHelp={onClickHelp}
                            className={classes.modal}
                            isMobile={true}
                        />
                    </Mobile>
                </>
            </Modal>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpMenu } })(theme => ({
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

export default HelpMenu;
