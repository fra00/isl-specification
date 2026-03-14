# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./data-management-presentation

> **Reference**: Concepts/Capabilities in `./domain.isl.md`
> **Reference**: Concepts/Capabilities in `./data-management-logic.isl.md`
> **Reference**: Concepts/Capabilities in `./ui-components.isl.md`

## Component: DataManagementPresentation
### Role: Presentation
**Signature**: `(dataManagementLogic: @DataManagementLogic, notificationService: @NotificationService, confirmationDialog: @ConfirmationDialog)`

### 📐 Appearance
The component presents two main sections: "Export Data" and "Import Data".
- **Export Data Section**:
    - A clear heading "Export Application Data".
    - Two distinct buttons: "Export to JSON" and "Export to Excel".
    - Informational text about what each export option does.
- **Import Data Section**:
    - A clear heading "Import Application Data".
    - A file input element for selecting a JSON file.
    - Radio buttons or a dropdown for selecting the `@ImportMode`: "Replace All Existing Data" and "Add to Existing Data".
    - A button labeled "Preview Import" which becomes active after a file is selected.
    - A section to display the import preview (initially hidden). This section should show a summary of entities (e.g., "Projects: X, Epics: Y, Stories: Z") found in the selected file.
    - A button labeled "Confirm Import" which is initially disabled and becomes active only after a successful preview.

### 📦 Content
- Contains a file input element.
- Contains buttons for export and import actions.
- Contains radio buttons or a dropdown for `@ImportMode` selection.
- Contains a `ConfirmationDialog` for destructive import operations.
- Utilizes `NotificationService` for user feedback.

### ⚡ Capabilities
#### RenderExportOptions
**Contract**: Renders the user interface elements for exporting application data.
**Signature**: `()` -> `void`
**Flow**:
  1. Display the "Export Application Data" heading.
  2. Display the "Export to JSON" button.
  3. Display the "Export to Excel" button.
  4. Display descriptive text for each export option.
**Side Effects**: None.

#### HandleExportJson
**Contract**: Initiates the process to export all application data as a JSON file and triggers a download.
**Signature**: `()` -> `Promise<void>`
**Trigger**: User clicks the "Export to JSON" button.
**Flow**:
  1. Display a loading indicator.
  2. Request `dataManagementLogic` to `exportToJson()`.
  3. ON SUCCESS (receives `jsonString`):
     1. Create a Blob from `jsonString` with `application/json` type.
     2. Generate a filename like `roadmap-manager-export-YYYY-MM-DD-HHMMSS.json`.
     3. Trigger a file download in the user's browser with the generated filename and Blob.
     4. Request `notificationService` to `ShowSuccess("Data exported successfully as JSON.")`.
  4. ON ERROR (`error`):
     1. Request `notificationService` to `ShowError("Failed to export JSON data: " + error.message)`.
  5. Hide the loading indicator.
**Side Effects**: Triggers a file download, displays notifications.

#### HandleExportExcel
**Contract**: Initiates the process to export all application data as a multi-sheet Excel file and triggers a download.
**Signature**: `()` -> `Promise<void>`
**Trigger**: User clicks the "Export to Excel" button.
**Flow**:
  1. Display a loading indicator.
  2. Request `dataManagementLogic` to `exportToExcel()`.
  3. ON SUCCESS (receives `excelData`):
     1. Convert `excelData` into an Excel file format (e.g., using a client-side library).
     2. Create a Blob from the Excel file data with appropriate MIME type.
     3. Generate a filename like `roadmap-manager-export-YYYY-MM-DD-HHMMSS.xlsx`.
     4. Trigger a file download in the user's browser with the generated filename and Blob.
     5. Request `notificationService` to `ShowSuccess("Data exported successfully as Excel.")`.
  4. ON ERROR (`error`):
     1. Request `notificationService` to `ShowError("Failed to export Excel data: " + error.message)`.
  5. Hide the loading indicator.
**Side Effects**: Triggers a file download, displays notifications.

#### RenderImportOptions
**Contract**: Renders the user interface elements for importing application data.
**Signature**: `()` -> `void`
**Flow**:
  1. Display the "Import Application Data" heading.
  2. Display a file input element for selecting a JSON file.
  3. Display radio buttons for `@ImportMode` selection: "Replace All Existing Data" and "Add to Existing Data".
  4. Display the "Preview Import" button (initially disabled until a file is selected).
  5. Display the import preview section (initially hidden).
  6. Display the "Confirm Import" button (initially disabled).
**Side Effects**: None.

#### HandleFileSelectionAndPreview
**Contract**: Reads the content of a selected JSON file, parses it, and prepares a preview of the data to be imported.
**Signature**: `(file: File, mode: @ImportMode)` -> `Promise<void>`
**Trigger**: User selects a file in the file input and clicks "Preview Import".
**Flow**:
  1. Store the `mode` internally.
  2. Display a loading indicator.
  3. Read the `file` content as a text string (`fileContent`).
  4. TRY:
     1. Attempt to parse `fileContent` into a JavaScript object (`parsedData`).
     2. Request `ShowImportPreview(parsedData)`.
     3. Store `fileContent` internally for later confirmation.
     4. Enable the "Confirm Import" button.
  5. CATCH (`error`):
     1. Request `notificationService` to `ShowError("Invalid JSON file or data structure: " + error.message)`.
     2. Clear any previous import preview.
     3. Disable the "Confirm Import" button.
  6. Hide the loading indicator.
**Side Effects**: Updates internal state with `parsedData` and `fileContent`, updates UI to show preview, enables/disables buttons, displays notifications.
**🚨 Constraint**: The `file` MUST be a JSON file.

#### ShowImportPreview
**Contract**: Displays a summary of the data that will be imported, allowing the user to review before final confirmation.
**Signature**: `(data: @ExportedData)` -> `void`
**Flow**:
  1. Make the import preview section visible.
  2. Display a summary of the entities found in `data`:
     - "Projects: " + `data.projects.length`
     - "Epics: " + `data.epics.length`
     - "Stories: " + `data.stories.length`
     - "Changelog Entries: " + `data.changelog.length`
     - "Team Members: " + `data.teamMembers.length`
     - "Categories: " + `data.categories.length`
  3. Display the `data.version` and `data.timestamp` from the exported file.
**Side Effects**: Updates the content of the import preview section.

#### HandleImportConfirmation
**Contract**: Triggers the actual import of the parsed JSON data into the database using the selected mode, after user confirmation.
**Signature**: `(fileContent: string, mode: @ImportMode)` -> `Promise<void>`
**Trigger**: User clicks the "Confirm Import" button after a preview has been shown.
**Flow**:
  1. Initialize `confirmationMessage`.
  2. IF `mode` is `@ImportMode.REPLACE_ALL`, THEN:
     1. Set `confirmationMessage` to "Are you sure you want to replace ALL existing data? This action cannot be undone."
  3. ELSE (`mode` is `@ImportMode.ADD_TO_EXISTING`):
     1. Set `confirmationMessage` to "Are you sure you want to add this data to existing data? Conflicting IDs will be re-generated."
  4. Request `confirmationDialog` to `ShowDialog(confirmationMessage)`.
  5. ON `confirmationDialog.onConfirm()`:
     1. Display a loading indicator.
     2. Request `dataManagementLogic` to `importFromJson(fileContent, mode)`.
     3. ON SUCCESS:
        1. Request `notificationService` to `ShowSuccess("Data imported successfully.")`.
        2. Clear the import preview section.
        3. Disable the "Confirm Import" button.
        4. Clear the selected file from the file input.
     4. ON ERROR (`error`):
        1. Request `notificationService` to `ShowError("Failed to import data: " + error.message)`.
     5. Hide the loading indicator.
  6. ON `confirmationDialog.onCancel()`:
     1. Request `notificationService` to `ShowInfo("Import cancelled.")`.
     1. Clear the import preview section.
     2. Disable the "Confirm Import" button.
     3. Clear the selected file from the file input.
**Side Effects**: Modifies the IndexedDB database, displays notifications, clears UI state, interacts with `ConfirmationDialog`.