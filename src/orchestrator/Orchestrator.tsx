import * as lunatic from "@inseefr/lunatic";
import { Box, Button } from "@mui/material";
import * as lunaticEDT from "lunatic-edt";
import React from "react";
import { lunaticDatabase } from "service/lunatic-database";

const { ...edtComponents } = lunaticEDT;

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    lunatic[name] = component;
});

export type Props = {
    goPrevious: () => void;
    goNext: () => void;
    isLast: boolean;
    isFirst: boolean;
};
const Pager = (props: Props) => {
    const { goPrevious, goNext, isLast, isFirst } = props;

    return (
        <Box sx={{ visibility: "hidden", height: "1px" }}>
            <Button onClick={goPrevious} disabled={isFirst}>
                Previous
            </Button>
            <Button onClick={goNext} disabled={isLast}>
                Next
            </Button>
        </Box>
    );
};

const onLogChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log("onChange", { ...e });
export type OrchestratorProps = {
    source: object;
    data?: object;
};
export const OrchestratorForStories = (props: OrchestratorProps) => {
    const { source, data } = props;
    console.log(props);
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

    const save = () => {
        lunaticDatabase.save("edt", getData());
    };

    return (
        <>
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
            <Pager goPrevious={goPreviousPage} goNext={save} isLast={isLastPage} isFirst={isFirstPage} />
        </>
    );
};
