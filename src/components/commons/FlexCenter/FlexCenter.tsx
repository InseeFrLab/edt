import { Box } from "@mui/material";

interface FlexCenterProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexCenter = (props: FlexCenterProps) => {
    const { children, className } = props;
    return (
        <Box sx={{ display: "flex", justifyContent: "center" }} className={className}>
            {children}
        </Box>
    );
};

export default FlexCenter;
