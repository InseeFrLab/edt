import { Box } from "@mui/material";

interface FlexEndProps {
    children: JSX.Element[] | JSX.Element;
}

const FlexEnd = ({ children }: FlexEndProps) => {
    return <Box sx={{ display: "flex", justifyContent: "flex-end" }}>{children}</Box>;
};

export default FlexEnd;
