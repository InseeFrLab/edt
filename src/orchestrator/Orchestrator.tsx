import React from "react";
import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "lunatic-edt";

const { ThemeProvider, ...edtComponents } = lunaticEDT;

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });
export type OrchestratorProps = {
    source: object;
    data?: object;
};
export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data } = props;
    const { getComponents, getCurrentErrors } = lunatic.useLunatic(source, data, {
        onChange: onLogChange,
    });
    const components = getComponents();
    const currentErrors = getCurrentErrors();

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
