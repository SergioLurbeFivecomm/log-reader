import { Frame } from "./frame";

export interface FrameService {
    handleMessage(frame: Frame): Promise<void>;
}