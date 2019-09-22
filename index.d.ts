import { Transform } from "stream";

export = mic;
function mic(options: mic.Options): mic.Mic;
namespace mic {
    export interface Mic {
        start(): void;
        stop(): void;
        pause(): void;
        resume(): void;
        getAudioStream(): Transform;
    }

    export interface Options {
        endian?: 'big' | 'little';
        bitwidth?: number | string;
        encoding?: 'signed-integer' | 'unsigned-integer';
        rate?: number | string;
        channels?: number | string;
        device?: string;
        exitOnSilence?: number | string;
        debug?: boolean | string;
        fileType?: string;
    }
}
