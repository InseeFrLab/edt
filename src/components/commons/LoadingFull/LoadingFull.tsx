import { CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStyles } from "tss-react/mui";
interface LoadingFullProps {
    message: string;
    thanking?: string;
}

const LoadingFull = (props: LoadingFullProps) => {
    const { message, thanking } = props;
    const { classes } = useStyles();
    return (
        <>
            <FlexCenter>
                <CircularProgress />
                <h2>{message}</h2>
                {thanking ? <h3>{thanking}</h3> : <></>}
            </FlexCenter>
        </>
    );
};

const useStyles = makeStyles({ "name": { LoadingFull } })(theme => ({}));

export default LoadingFull;
