import { HourCheckerOption } from "./HourCheckerOptions";
import { LunaticMultiSelectionValues } from "./LunaticMultiSelectionValues";

export type TimeLineRowType = {
    label: string;
    options: HourCheckerOption[];
    value: LunaticMultiSelectionValues;
};
