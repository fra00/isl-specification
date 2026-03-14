# Project: Roadmap Manager

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./settings-presentation

> **Reference**: @TeamMember, @Category in `./domain.isl.md`
> **Reference**: SettingsLogic in `./settings-logic.isl.md`
> **Reference**: ConfirmationDialog, NotificationService in `./ui-components.isl.md`

## Component: SettingsPresentation
### Role: Presentation
**Signature**: `(settingsLogic: @SettingsLogic, notificationService: @NotificationService)`
### 📐 Appearance
The settings interface is organized into distinct, clearly labeled sections: "Team Members", "Categories", and "Application Options".
- **Team Members Section**:
    - A prominent heading "Manage Team Members".
    - An input field for entering a new team member's name, accompanied by an "Add Team Member" button.
    - A dynamic list or table displaying all existing team members. Each entry includes the team member's name, an "Edit" button, and a "Delete" button.
    - When "Edit" is activated, the team member's name transforms into an editable input field, alongside "Save" and "Cancel" buttons.
- **Categories Section**:
    - A prominent heading "Manage Categories".
    - An input field for entering a new category name, accompanied by an "Add Category" button.
    - A dynamic list or table displaying all existing categories. Each entry includes the category's name, an "Edit" button, and a "Delete" button.
    - When "Edit" is activated, the category's name transforms into an editable input field, alongside "Save" and "Cancel" buttons.
- **Application Options Section**:
    - A prominent heading "Application Options".
    - A clearly visible "Reset Database" button, styled to visually communicate its destructive nature.
    - Informational text regarding application version and IndexedDB storage usage (not explicitly requested in capabilities, but implied by "information about the application" in requirements).
- **Confirmation Dialog**: An instance of `@ConfirmationDialog` is utilized for all destructive actions (deletions, database reset).
- **Notifications**: Feedback for all operations (success, error) is provided via `@NotificationService`.

### 📦 Content
The component structurally comprises:
- Input elements for adding new `@TeamMember` and `@Category` entities.
- Display areas (lists/tables) for presenting `@TeamMember` and `@Category` data.
- Interactive buttons for adding, editing, and deleting entities.
- A dedicated button for initiating the database reset process.
- An embedded `@ConfirmationDialog` for user interaction.
- Integration with `@NotificationService` for displaying alerts.

### ⚡ Capabilities
#### RenderTeamMembers
**Contract**: Displays the provided collection of team members, offering interactive elements for their management.
**Signature**: `(members: @TeamMember[])`
**Flow**:
  1. FOR EACH `@TeamMember` in `members`:
     1. Display the `name` of the team member.
     2. Render an "Edit" button associated with the team member.
     3. Render a "Delete" button associated with the team member.
  2. Render an input field and an "Add Team Member" button for creating new team members.

#### AddTeamMember
**Contract**: Processes the user's intent to introduce a new team member into the system.
**Signature**: `(name: string)` -> `Promise<void>`
**Trigger**: User activates the "Add Team Member" button after providing a name.
**Flow**:
  1. Request `settingsLogic.addTeamMember(name)`.
  2. IF the operation completes successfully, THEN:
     1. Request `notificationService.ShowSuccess("Team member added successfully.")`.
     2. Clear the input field used for adding new members.
     3. Request the parent component to refresh the displayed list of team members.
  3. ELSE (the operation encounters an error):
     1. Request `notificationService.ShowError("Failed to add team member: " + error.message)`.
**Side Effects**: Triggers `settingsLogic.addTeamMember`. Displays user notifications.

#### EditTeamMember
**Contract**: Manages the user's action to modify the name of an existing team member.
**Signature**: `(id: string, name: string)` -> `Promise<void>`
**Trigger**: User activates the "Save" button after altering a team member's name.
**Flow**:
  1. Request `settingsLogic.updateTeamMember(id, name)`.
  2. IF the operation completes successfully, THEN:
     1. Request `notificationService.ShowSuccess("Team member updated successfully.")`.
     2. Request the parent component to refresh the displayed list of team members.
  3. ELSE (the operation encounters an error):
     1. Request `notificationService.ShowError("Failed to update team member: " + error.message)`.
**Side Effects**: Triggers `settingsLogic.updateTeamMember`. Displays user notifications.

#### DeleteTeamMember
**Contract**: Orchestrates the removal of a team member, ensuring user confirmation before proceeding.
**Signature**: `(id: string)` -> `Promise<void>`
**Trigger**: User activates the "Delete" button for a specific team member.
**Flow**:
  1. Display `@ConfirmationDialog` with the message "Are you sure you want to delete this team member? This action cannot be undone."
  2. IF the user confirms the action, THEN:
     1. Request `settingsLogic.deleteTeamMember(id)`.
     2. IF the deletion completes successfully, THEN:
        1. Request `notificationService.ShowSuccess("Team member deleted successfully.")`.
        2. Request the parent component to refresh the displayed list of team members.
     3. ELSE (the deletion encounters an error):
        1. Request `notificationService.ShowError("Failed to delete team member: " + error.message)`.
  3. ELSE (the user cancels the action):
     1. Dismiss the confirmation dialog.
**Side Effects**: Triggers `@ConfirmationDialog`. If confirmed, triggers `settingsLogic.deleteTeamMember`. Displays user notifications.

#### RenderCategories
**Contract**: Presents the provided collection of categories, enabling interactive elements for their management.
**Signature**: `(categories: @Category[])`
**Flow**:
  1. FOR EACH `@Category` in `categories`:
     1. Display the `name` of the category.
     2. Render an "Edit" button associated with the category.
     3. Render a "Delete" button associated with the category.
  2. Render an input field and an "Add Category" button for creating new categories.

#### AddCategory
**Contract**: Processes the user's intent to introduce a new category into the system.
**Signature**: `(name: string)` -> `Promise<void>`
**Trigger**: User activates the "Add Category" button after providing a name.
**Flow**:
  1. Request `settingsLogic.addCategory(name)`.
  2. IF the operation completes successfully, THEN:
     1. Request `notificationService.ShowSuccess("Category added successfully.")`.
     2. Clear the input field used for adding new categories.
     3. Request the parent component to refresh the displayed list of categories.
  3. ELSE (the operation encounters an error):
     1. Request `notificationService.ShowError("Failed to add category: " + error.message)`.
**Side Effects**: Triggers `settingsLogic.addCategory`. Displays user notifications.

#### EditCategory
**Contract**: Manages the user's action to modify the name of an existing category.
**Signature**: `(id: string, name: string)` -> `Promise<void>`
**Trigger**: User activates the "Save" button after altering a category's name.
**Flow**:
  1. Request `settingsLogic.updateCategory(id, name)`.
  2. IF the operation completes successfully, THEN:
     1. Request `notificationService.ShowSuccess("Category updated successfully.")`.
     3. Request the parent component to refresh the displayed list of categories.
  3. ELSE (the operation encounters an error):
     1. Request `notificationService.ShowError("Failed to update category: " + error.message)`.
**Side Effects**: Triggers `settingsLogic.updateCategory`. Displays user notifications.

#### DeleteCategory
**Contract**: Orchestrates the removal of a category, ensuring user confirmation before proceeding.
**Signature**: `(id: string)` -> `Promise<void>`
**Trigger**: User activates the "Delete" button for a specific category.
**Flow**:
  1. Display `@ConfirmationDialog` with the message "Are you sure you want to delete this category? This action cannot be undone."
  2. IF the user confirms the action, THEN:
     1. Request `settingsLogic.deleteCategory(id)`.
     2. IF the deletion completes successfully, THEN:
        1. Request `notificationService.ShowSuccess("Category deleted successfully.")`.
        2. Request the parent component to refresh the displayed list of categories.
     3. ELSE (the deletion encounters an error):
        1. Request `notificationService.ShowError("Failed to delete category: " + error.message)`.
  3. ELSE (the user cancels the action):
     1. Dismiss the confirmation dialog.
**Side Effects**: Triggers `@ConfirmationDialog`. If confirmed, triggers `settingsLogic.deleteCategory`. Displays user notifications.

#### RenderResetOption
**Contract**: Displays the user interface element that allows for a complete reset of the application's local database.
**Signature**: `()`
**Flow**:
  1. Render the "Reset Database" button.
  2. Display a warning message informing the user about the irreversible nature of this action.

#### ConfirmResetDatabase
**Contract**: Manages the user's final confirmation and execution of the database reset operation.
**Signature**: `()` -> `Promise<void>`
**Trigger**: User activates the "Reset Database" button and subsequently confirms the initial warning.
**Flow**:
  1. Display `@ConfirmationDialog` with the message "WARNING: This will permanently delete ALL application data. Are you absolutely sure you want to proceed?"
  2. IF the user provides a second, explicit confirmation, THEN:
     1. Request `settingsLogic.resetDatabase()`.
     2. IF the database reset completes successfully, THEN:
        1. Request `notificationService.ShowSuccess("Database reset successfully. The application will now reload.")`.
        2. Trigger a full application reload to ensure a clean state.
     3. ELSE (the database reset encounters an error):
        1. Request `notificationService.ShowError("Failed to reset database: " + error.message)`.
  3. ELSE (the user cancels the action):
     1. Dismiss the confirmation dialog.
**Side Effects**: Triggers `@ConfirmationDialog`. If confirmed, triggers `settingsLogic.resetDatabase`. Displays user notifications. May trigger a full application reload.

### 🚨 Global Constraints
- All input fields for names (team members, categories) MUST prevent submission of empty strings.
- All delete operations and the database reset MUST be preceded by a `@ConfirmationDialog` to prevent accidental data loss.
- Error messages originating from `settingsLogic` operations MUST be displayed to the user using `notificationService.ShowError`.
- Successful operations MUST be acknowledged to the user using `notificationService.ShowSuccess`.