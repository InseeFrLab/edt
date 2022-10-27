import { CssBaseline, ThemeProvider } from "@mui/material";
import "i18n/i18n";
import { theme } from "lunatic-edt";
import { EdtRoutes } from "routes/EdtRoutes";

const App = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <EdtRoutes />
            </ThemeProvider>
        </>
    );
};

export default App;
