import { Box } from "@mui/material";

interface FlexEvenlyProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexEvenly = (props: FlexEvenlyProps) => {
    const { children, className } = props;
    return (
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }} className={className}>
            {children}
        </Box>
    );
};

export default FlexEvenly;
