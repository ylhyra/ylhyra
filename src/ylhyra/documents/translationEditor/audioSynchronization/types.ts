import { Seconds } from "modules/time";

export type LongAudioReducer = {
  [filename: string]: {
    sync: {
      list: LongAudioSyncData[];
    } | null;
    /** Used in the translation editor to know if we have to recalculate */
    xml: XmlForAeneas;
    xml_hash: string;
  };
};

/**
 * Format:
 * [
 *  { begin: 0.000, end: 1.930, elements: ["s0","w1"] },
 *  { begin: 1.930, end: 2.315, elements: ["s0","w2"] },
 *  { begin: 2.315, end: 4.400, elements: ["s0"] },
 * ]
 * @see audioSynchronization/README.md
 */
export type LongAudioSyncData = {
  begin: Seconds;
  end: Seconds;
  /**
   * Elements that are highlighted during this time
   */
  elements: string[];
};

export type AeneasAudioSyncOutput = {
  fragments: Array<{
    id: "root";
    /** Sentence-level elements */
    children: Array<{
      begin: string;
      end: string;
      id: string;
      /** Array containing a single element, which is the matched text */
      lines: string[];
      /** Word-level elements */
      children?: Array<
        Pick<
          AeneasAudioSyncOutput["fragments"][number]["children"][number],
          "begin" | "end" | "id" | "lines"
        >
      >;
    }>;
  }>;
};

/** An XML file where only words and sentences retain their ids */
export type XmlForAeneas = string;

export type LongAudioSyncDataIntermediateForm = {
  begin: Seconds;
  end: Seconds;
  id: string;
};
