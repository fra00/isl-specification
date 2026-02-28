# Project: Musical Keyboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./keyboard-ui

> **Reference**: Concepts/Capabilities in `./keyboard-domain.isl.md`

## Component: KeyboardUI
### Role: Presentation

### 📐 Appearance
The keyboard interface MUST visually represent a 3-octave musical keyboard.
-   **Keys**: Each key MUST be visually distinct, representing either a white note or a black note.
    -   White keys MUST be wider and arranged in a continuous row.
    -   Black keys MUST be narrower, elevated, and positioned between specific white keys (e.g., C# between C and D).
-   **Highlighting**: Keys MUST support a visual "pressed" state, indicated by a distinct color or style change.
-   **Layout**: The keys MUST be arranged horizontally, spanning the full width of the available display area.

### 📦 Content
The `KeyboardUI` component contains a collection of individual key elements.
-   Each key element corresponds to a unique `NoteIdentifier` from the keyboard's range.
-   Each key element MUST display its corresponding `NoteIdentifier` (e.g., "C3", "F#4") as a label, visible on hover or permanently.

### ⚡ Capabilities
#### renderKeyboard
**Contract**: Renders the visual keyboard interface, creating and arranging all keys based on the provided note identifiers.
-   **Signature**: `(noteIdentifiers: Array<NoteIdentifier>) -> void`
-   **Flow**:
    1.  Clear any previously rendered keys from the display.
    2.  FOR EACH `noteIdentifier` in the `noteIdentifiers` array:
        1.  Create a visual key element.
        2.  Determine if the key is a white key or a black key based on its `NoteIdentifier` (e.g., by parsing the `NoteNameEnum` part).
        3.  Apply appropriate visual styling (size, position, color) for white or black keys.
        4.  Attach an event listener to the key element for "pointer down" (e.g., mouse click, touch start) events.
        5.  Attach an event listener to the key element for "pointer up" (e.g., mouse release, touch end) events.
        6.  Add the key element to the keyboard's display area, maintaining the correct order.
-   **🚨 Constraint**:
    -   The visual arrangement of keys MUST accurately reflect the chromatic scale and octave structure.
    -   Each key element MUST be uniquely identifiable by its `NoteIdentifier` for subsequent highlighting/unhighlighting.
-   **✅ Acceptance Criteria**:
    -   Given an array of `NoteIdentifier`s, the UI MUST display a corresponding number of distinct key elements.
    -   White keys MUST be visually distinct from black keys.
    -   Keys MUST be ordered correctly from left to right (e.g., C3, C#3, D3, ... B5).
-   **🧪 Test Scenarios**:
    -   Call `renderKeyboard` with `["C3", "D3", "E3"]`. Verify three keys are rendered, "C3" and "D3" are white, "D3" is white, and "E3" is white.
    -   Call `renderKeyboard` with `getAllNotesInKeyboardRange()` from > **Reference**: `getAllNotesInKeyboardRange` in `./keyboard-domain.isl.md`. Verify 36 keys are rendered, with correct white/black key patterns and ordering.

#### onNotePressed
**Contract**: Registers a callback function to be executed when a user interacts with a rendered key, indicating a note press.
-   **Signature**: `(callback: (noteIdentifier: NoteIdentifier) => void) -> void`
-   **Trigger**: A "pointer down" event (e.g., mouse click, touch start) occurs on any rendered key element.
-   **Flow**:
    1.  Store the provided `callback` function internally.
    2.  When a "pointer down" event occurs on a key element:
        1.  Identify the `NoteIdentifier` associated with that key.
        2.  Execute the stored `callback`, passing the identified `NoteIdentifier`.
-   **Side Effects**:
    -   The `highlightKey` capability for the corresponding `NoteIdentifier` is triggered internally.
-   **🚨 Constraint**:
    -   Only one callback can be active at a time; subsequent calls to `onNotePressed` will replace the previous callback.
-   **✅ Acceptance Criteria**:
    -   When a user clicks on the "C4" key, the registered callback MUST be invoked with "C4".
    -   When a user touches the "G#3" key, the registered callback MUST be invoked with "G#3".
-   **🧪 Test Scenarios**:
    -   Register a mock callback. Click on "C3". Verify the callback was called with "C3".
    -   Register a new mock callback. Click on "D4". Verify the *new* callback was called with "D4".

#### onNoteReleased
**Contract**: Registers a callback function to be executed when a user releases interaction with a rendered key, indicating a note release.
-   **Signature**: `(callback: (noteIdentifier: NoteIdentifier) => void) -> void`
-   **Trigger**: A "pointer up" event (e.g., mouse release, touch end) occurs on any rendered key element.
-   **Flow**:
    1.  Store the provided `callback` function internally.
    2.  When a "pointer up" event occurs on a key element:
        1.  Identify the `NoteIdentifier` associated with that key.
        2.  Execute the stored `callback`, passing the identified `NoteIdentifier`.
-   **Side Effects**:
    -   The `unhighlightKey` capability for the corresponding `NoteIdentifier` is triggered internally.
-   **🚨 Constraint**:
    -   Only one callback can be active at a time; subsequent calls to `onNoteReleased` will replace the previous callback.
-   **✅ Acceptance Criteria**:
    -   When a user releases a click on the "C4" key, the registered callback MUST be invoked with "C4".
    -   When a user lifts their finger from the "G#3" key, the registered callback MUST be invoked with "G#3".
-   **🧪 Test Scenarios**:
    -   Register a mock callback. Click and then release on "C3". Verify the callback was called with "C3" on release.

#### highlightKey
**Contract**: Visually highlights the specified key on the keyboard interface.
-   **Signature**: `(noteIdentifier: NoteIdentifier) -> void`
-   **Flow**:
    1.  Locate the visual key element corresponding to the `noteIdentifier`.
    2.  Apply a predefined "pressed" visual style to this key element.
-   **🚨 Constraint**:
    -   If the `noteIdentifier` does not correspond to a rendered key, no action is taken.
-   **✅ Acceptance Criteria**:
    -   Given "C4", the visual representation of the "C4" key MUST change to its highlighted state.
-   **🧪 Test Scenarios**:
    -   Call `highlightKey("C3")`. Verify the "C3" key visually changes.
    -   Call `highlightKey("F#4")`. Verify the "F#4" key visually changes.

#### unhighlightKey
**Contract**: Removes the visual highlight from the specified key on the keyboard interface.
-   **Signature**: `(noteIdentifier: NoteIdentifier) -> void`
-   **Flow**:
    1.  Locate the visual key element corresponding to the `noteIdentifier`.
    2.  Remove the "pressed" visual style from this key element, reverting it to its normal state.
-   **🚨 Constraint**:
    -   If the `noteIdentifier` does not correspond to a rendered key, no action is taken.
-   **✅ Acceptance Criteria**:
    -   Given "C4", the visual representation of the "C4" key MUST revert from its highlighted state to its normal state.
-   **🧪 Test Scenarios**:
    -   Call `highlightKey("C3")`, then `unhighlightKey("C3")`. Verify the "C3" key visually returns to its original state.
    -   Call `unhighlightKey("F#4")` without prior highlighting. Verify no visual change occurs.