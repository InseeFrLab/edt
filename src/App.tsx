import "./App.scss";

import { CssBaseline, ThemeProvider } from "@mui/material";
import "i18n/i18n";
import { theme } from "lunatic-edt";
import { BrowserRouter } from "react-router-dom";
import EdtRoutes from "routes/EdtRoutes";

const App = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <BrowserRouter>
                    <EdtRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
};

export default App;
