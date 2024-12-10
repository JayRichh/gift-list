import { ComponentExample } from "../types";
import { buttonMeta } from "./button";
import { formMeta } from "./form";
import { selectMeta } from "./select";
import { sliderMeta } from "./slider";

export * from "./button";
export * from "./form";
export * from "./select";
export * from "./slider";

export const inputComponents: ComponentExample[] = [buttonMeta, formMeta, selectMeta, sliderMeta];
