import { CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
interface LoadingFullProps {
    message: string;
    thanking?: string;
}

const LoadingFull = (props: LoadingFullProps) => {
    const { message, thanking } = props;
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

export default LoadingFull;
