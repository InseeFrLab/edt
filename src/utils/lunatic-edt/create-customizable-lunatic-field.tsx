import React from "react";

const notLunaticComponents: Map<string, React.MemoExoticComponent<any>> = new Map();

function createCustomizableLunaticField(LunaticField: React.MemoExoticComponent<any>, name: string) {
    const Memoized = React.memo(LunaticField);
    notLunaticComponents.set(name, Memoized);

    return function OverlayField(props: any) {
        const { custom, ...rest } = props;
        if (typeof custom === "object" && name in custom) {
            const CustomComponent = custom[name];
            return <CustomComponent {...rest} />;
        }

        return <Memoized {...props} />;
    };
}

export { createCustomizableLunaticField, notLunaticComponents };
