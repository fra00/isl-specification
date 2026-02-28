export const NoteNameEnum: { C: 'C'; 'C#': 'C#'; D: 'D'; 'D#': 'D#'; E: 'E'; F: 'F'; 'F#': 'F#'; G: 'G'; 'G#': 'G#'; A: 'A'; 'A#': 'A#'; B: 'B'; };
export const OctaveRangeConstant: { START_OCTAVE: 3; END_OCTAVE: 5; };
export const KeyboardKeyMapConstant: { KEY_CODES: string[]; };
export function getNoteIdentifier(noteName: string, octave: number): string;
export function getAllNotesInKeyboardRange(): string[];
export function getKeyToNoteMapping(): { keyCode: string; noteIdentifier: string; }[];