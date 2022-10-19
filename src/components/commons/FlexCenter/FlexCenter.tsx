import { Box } from "@mui/material";

interface FlexCenterProps {
    children: JSX.Element[] | JSX.Element;
}

const FlexCenter = ({ children }: FlexCenterProps) => {
    return <Box sx={{ display: "flex", justifyContent: "center" }}>{children}</Box>;
};

export default FlexCenter;
