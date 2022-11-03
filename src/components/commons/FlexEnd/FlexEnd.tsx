import { Box } from "@mui/material";

interface FlexEndProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexEnd = (props: FlexEndProps) => {
    const { children, className } = props;
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} className={className}>
            {children}
        </Box>
    );
};

export default FlexEnd;
