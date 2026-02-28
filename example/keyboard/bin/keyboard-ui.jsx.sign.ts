export default function KeyboardUI(props: {
  noteIdentifiers?: Array<string>;
  onNotePressed?: (noteIdentifier: string) => void;
  onNoteReleased?: (noteIdentifier: string) => void;
}): React.Element;