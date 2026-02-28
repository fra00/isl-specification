# Project: Musical Keyboard

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./tone-synth-logic

> **Reference**: Concepts/Capabilities in `./keyboard-domain.isl.md`

## Component: ToneSynthLogic
### Role: Business Logic

### ⚡ Capabilities
#### initSynth
**Contract**: Initializes the Tone.js audio context and sets up the synthesizer for playback. This capability MUST be called before any notes can be played.
- **Signature**: `() -> void`
- **Flow**:
  1.  Activate the Tone.js audio context to enable sound generation.
  2.  Create and configure a polyphonic synthesizer instance.
  3.  Connect the synthesizer's output to the master audio output.
  4.  Set the initial master volume of the synthesizer to a default level.
- **Side Effects**:
  - Activates the browser's audio context.
  - Instantiates and configures an internal synthesizer object.
  - Modifies the global audio output chain.
- **✅ Acceptance Criteria**:
  - The audio context is successfully initialized and active.
  - The synthesizer is ready to produce sound.

#### playNote
**Contract**: Triggers the synthesizer to play a specific musical note.
- **Signature**: `(noteIdentifier: NoteIdentifier, duration: number (seconds)) -> void`
- **Flow**:
  1.  Instruct the internal synthesizer to start playing the sound corresponding to the `noteIdentifier`.
  2.  The note will sustain for the specified `duration`.
- **Side Effects**:
  - Generates audio output for the specified note.
- **🚨 Constraint**:
  - `noteIdentifier` MUST be a valid > **Reference**: `NoteIdentifier` in `./keyboard-domain.isl.md`.
  - `duration` MUST be a positive number representing seconds.
- **✅ Acceptance Criteria**:
  - A sound corresponding to the `noteIdentifier` is produced by the synthesizer.
  - The note plays for the specified `duration`.
- **🧪 Test Scenarios**:
  - Play "C4" for 1 second.
  - Play "G#3" for 0.5 seconds.

#### stopNote
**Contract**: Stops a currently playing musical note on the synthesizer.
- **Signature**: `(noteIdentifier: NoteIdentifier) -> void`
- **Flow**:
  1.  Instruct the internal synthesizer to stop playing the sound corresponding to the `noteIdentifier`.
- **Side Effects**:
  - Ceases audio output for the specified note.
- **🚨 Constraint**:
  - `noteIdentifier` MUST be a valid > **Reference**: `NoteIdentifier` in `./keyboard-domain.isl.md`.
- **✅ Acceptance Criteria**:
  - The sound corresponding to the `noteIdentifier` immediately ceases.
- **🧪 Test Scenarios**:
  - Play "C4", then stop "C4".
  - Attempt to stop a note that is not currently playing (no audible change expected).

#### setVolume
**Contract**: Adjusts the master output volume of the synthesizer.
- **Signature**: `(level: number (dB)) -> void`
- **Flow**:
  1.  Set the master output volume of the synthesizer to the specified `level`.
- **Side Effects**:
  - Changes the overall loudness of the synthesizer's audio output.
- **🚨 Constraint**:
  - `level` MUST be a number representing decibels (e.g., typically in the range of -60 dB to 0 dB, where 0 dB is maximum volume).
- **✅ Acceptance Criteria**:
  - The audible loudness of the synthesizer's output changes according to the `level` provided.
- **🧪 Test Scenarios**:
  - Set volume to -12 dB.
  - Set volume to 0 dB.
  - Set volume to -INF dB (effectively mute).