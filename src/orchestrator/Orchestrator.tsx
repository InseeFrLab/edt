import React from "react";
import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "lunatic-edt";
import { lunaticDatabase } from "service/lunatic-database";
import { Button } from "@mui/material";

const { ThemeProvider, ...edtComponents } = lunaticEDT;

export type Props = {
    goPrevious: () => void;
    goNext: () => void;
    isLast: boolean;
    isFirst: boolean;
};
const Pager = (props: Props) => {
    const { goPrevious, goNext, isLast, isFirst } = props;

    return (
        <div className="pagination">
            <Button onClick={goPrevious} disabled={isFirst}>
                Previous
            </Button>
            <Button onClick={goNext} disabled={isLast}>
                Next
            </Button>
        </div>
    );
};

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });
export type OrchestratorProps = {
    source: object;
    data?: object;
};
export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data } = props;
    const {
        goPreviousPage,
        goNextPage,
        isLastPage,
        isFirstPage,
        getComponents,
        getCurrentErrors,
        getData,
    } = lunatic.useLunatic(source, data, {
        onChange: onLogChange,
    });
    const components = getComponents();
    const currentErrors = getCurrentErrors();

    const saveAndNext = () => {
        lunaticDatabase.save("edt", getData());
        goNextPage();
    };

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
            <Pager
                goPrevious={goPreviousPage}
                goNext={saveAndNext}
                isLast={isLastPage}
                isFirst={isFirstPage}
            />
        </ThemeProvider>
    );
};
