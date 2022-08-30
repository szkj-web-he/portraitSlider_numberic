import { createContext, useContext } from "react";

export type JumpContextType = (index: number, el: HTMLElement | null) => void;

export const JumpContext = createContext<JumpContextType>(() => undefined);

export const useGroupEl = (): JumpContextType => useContext(JumpContext);
