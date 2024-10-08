import { makeStyles } from "tss-react/mui";
import { Css, CSSObject, Cx } from "tss-react/";
import { EdtTheme } from "./edt-theme";

/*
 *     MakeStylesEdt is an extension that was made from makeStyles.
 *     It does exactly the same thing except the returned theme from the function is typed as EdtTheme
 *     that is the custom theme of the app.
 */
export type MakeStylesParams =
    | {
        name?: string | Record<string, unknown>;
        uniqId?: string;
    }
    | undefined;

export type MakeStyleEdt<Params = void, RuleNameSubsetReferencableInNestedSelectors extends string = never> = <
    RuleName extends string,
>(
    cssObjectByRuleNameOrGetCssObjectByRuleName:
        | Record<RuleName, CSSObject>
        | ((
            theme: EdtTheme,
            params: Params,
            classes: Record<RuleNameSubsetReferencableInNestedSelectors, string>,
        ) => Record<RuleNameSubsetReferencableInNestedSelectors | RuleName, CSSObject>),
) => (
    params: Params,
    styleOverrides?:
        | {
            props: {
                classes?: Record<string, string>;
            } & Record<string, unknown>;
            ownerState?: Record<string, unknown>;
        }
        | undefined,
) => {
    classes: Record<RuleName, string>;
    theme: EdtTheme;
    css: Css;
    cx: Cx;
};
const makeStylesEdt = function <
    Params = void,
    RuleNameSubsetReferencableInNestedSelectors extends string = never,
>(params?: MakeStylesParams) {
    return makeStyles(params) as MakeStyleEdt<Params, RuleNameSubsetReferencableInNestedSelectors>;
};
export { makeStylesEdt };

