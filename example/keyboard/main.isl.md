# Project: Musical Keyboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Capabilities in `./tone-synth-logic.isl.md`
> **Reference**: Capabilities in `./keyboard-ui.isl.md`
> **Reference**: Concepts/Capabilities in `./keyboard-domain.isl.md`

## Component: Main
### Role: Presentation

### ⚡ Capabilities
#### initializeApplication
**Contract**: Serves as the application's entry point, orchestrating the setup of the synthesizer, rendering the keyboard UI, and establishing all necessary event listeners for user interaction via mouse/touch and physical keyboard.
- **Signature**: `() -> void`
- **Flow**:
  1.  Retrieve the complete ordered list of `NoteIdentifier`s for the keyboard range from > **Reference**: `getAllNotesInKeyboardRange` in `./keyboard-domain.isl.md`.
  2.  Retrieve the mapping of physical keyboard `keyCode`s to `NoteIdentifier`s from > **Reference**: `getKeyToNoteMapping` in `./keyboard-domain.isl.md`.
  3.  Initialize an internal state to track currently pressed physical keyboard keys to prevent repeated note triggers.
  4.  Initialize the audio synthesizer by triggering > **Reference**: `initSynth` in `./tone-synth-logic.isl.md`.
  5.  Render the visual keyboard interface by triggering > **Reference**: `renderKeyboard` in `./keyboard-ui.isl.md`, passing the list of `NoteIdentifier`s.
  6.  Register a callback for when a UI key is pressed:
      1.  Trigger > **Reference**: `onNotePressed` in `./keyboard-ui.isl.md`.
      2.  The callback function MUST:
          1.  Trigger the synthesizer to play the corresponding note by triggering > **Reference**: `playNote` in `./tone-synth-logic.isl.md` with the `noteIdentifier` and a default sustain duration (e.g., 5 seconds).
          2.  Visually highlight the pressed key by triggering > **Reference**: `highlightKey` in `./keyboard-ui.isl.md` with the `noteIdentifier`.
  7.  Register a callback for when a UI key is released:
      1.  Trigger > **Reference**: `onNoteReleased` in `./keyboard-ui.isl.md`.
      2.  The callback function MUST:
          1.  Trigger the synthesizer to stop the corresponding note by triggering > **Reference**: `stopNote` in `./tone-synth-logic.isl.md` with the `noteIdentifier`.
          2.  Visually unhighlight the released key by triggering > **Reference**: `unhighlightKey` in `./keyboard-ui.isl.md` with the `noteIdentifier`.
  8.  Attach a global event listener for physical keyboard `keydown` events:
      1.  Identify the `keyCode` from the event.
      2.  Look up the corresponding `noteIdentifier` using the `keyToNoteMapping`.
      3.  IF a `noteIdentifier` is found AND the `keyCode` is NOT currently tracked as pressed:
          1.  Trigger the synthesizer to play the note by triggering > **Reference**: `playNote` in `./tone-synth-logic.isl.md` with the `noteIdentifier` and a default sustain duration (e.g., 5 seconds).
          2.  Visually highlight the key by triggering > **Reference**: `highlightKey` in `./keyboard-ui.isl.md` with the `noteIdentifier`.
          3.  Add the `keyCode` to the internal state of currently pressed keys.
  9.  Attach a global event listener for physical keyboard `keyup` events:
      1.  Identify the `keyCode` from the event.
      2.  Look up the corresponding `noteIdentifier` using the `keyToNoteMapping`.
      3.  IF a `noteIdentifier` is found AND the `keyCode` IS currently tracked as pressed:
          1.  Trigger the synthesizer to stop the note by triggering > **Reference**: `stopNote` in `./tone-synth-logic.isl.md` with the `noteIdentifier`.
          2.  Visually unhighlight the key by triggering > **Reference**: `unhighlightKey` in `./keyboard-ui.isl.md` with the `noteIdentifier`.
          3.  Remove the `keyCode` from the internal state of currently pressed keys.
- **Side Effects**:
  - Activates the browser's audio context.
  - Renders the entire musical keyboard UI.
  - Establishes global event listeners for mouse/touch and keyboard input.
- **✅ Acceptance Criteria**:
  - Upon application load, the visual keyboard MUST be displayed.
  - Clicking or touching a key on the UI MUST produce the corresponding sound and visually highlight the key.
  - Releasing a clicked/touched key MUST stop the sound and unhighlight the key.
  - Pressing a mapped physical keyboard key MUST produce the corresponding sound and visually highlight the associated UI key.
  - Releasing a mapped physical keyboard key MUST stop the sound and unhighlight the associated UI key.
  - Holding down a physical key MUST only trigger the note once until released.

### 💡 Global Hints
-   The application implicitly relies on Tone.js being loaded from a CDN (e.g., `https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js`) before this component's initialization logic executes. This external script loading is outside the scope of this ISL document but is a prerequisite for `ToneSynthLogic` to function.
-   A default duration of 5 seconds for `playNote` is chosen to allow for sustained notes when a physical key or UI key is pressed, relying on `stopNote` to end the sound explicitly upon release. This accommodates the `playNote` signature while enabling "press and hold" behavior.