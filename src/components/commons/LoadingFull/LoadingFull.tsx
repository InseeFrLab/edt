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
            </FlexCenter>
            <FlexCenter>
                <h2>{message}</h2>
            </FlexCenter>
            <FlexCenter>{thanking ? <h3>{thanking}</h3> : <></>}</FlexCenter>
        </>
    );
};

export default LoadingFull;
