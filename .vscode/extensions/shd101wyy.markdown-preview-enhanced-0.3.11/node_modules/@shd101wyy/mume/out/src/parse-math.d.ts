import { MathRenderingOption } from "./markdown-engine-config";
export declare type ParseMathArgs = {
    content: string;
    openTag: string;
    closeTag: string;
    displayMode?: boolean;
    renderingOption: MathRenderingOption;
};
declare const _default: ({ content, openTag, closeTag, displayMode, renderingOption, }: ParseMathArgs) => any;
export default _default;
