import { ComponentExample } from "../types";
import { accordionMeta } from "./accordion";
import { modalMeta } from "./modal";
import { tabsMeta } from "./tabs";

export * from "./accordion";
export * from "./modal";
export * from "./tabs";

export const layoutComponents: ComponentExample[] = [accordionMeta, modalMeta, tabsMeta];
