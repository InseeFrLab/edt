import React from "react";
import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "lunatic-edt";
// Pager is not exported by lunatic-edt
// import { Pager } from "lunatic-edt";
import { useTranslation } from "react-i18next";
const { ThemeProvider, ...edtComponents } = lunaticEDT;
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigatePreviousRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });
export type OrchestratorProps = {
    source: object;
    data?: object;
};
export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data } = props;
    const { getComponents, goPreviousPage, goNextPage, isFirstPage, isLastPage, getCurrentErrors } =
        lunatic.useLunatic(source, data, {
            onChange: onLogChange,
        });
    const components = getComponents();
    const currentErrors = getCurrentErrors();
    const { t } = useTranslation();

    return (
        <ThemeProvider>
            <div className="components">
                {components.map(function (component: any) {
                    const { id, componentType, response, ...other } = component;
                    const Component = lunatic[componentType];
                    return (
                        <div className="lunatic lunatic-component" key={`component-${id}`}>
                            <Component
                                id={id}
                                response={response}
                                {...other}
                                {...component}
                                errors={currentErrors}
                                custom={edtComponents}
                            />
                        </div>
                    );
                })}
            </div>
        </ThemeProvider>
    );
};
