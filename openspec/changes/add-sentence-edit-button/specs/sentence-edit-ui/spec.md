# Spec: Edit Button UI for Sentence Management

## ADDED Requirements

### Requirement: Edit Button Visibility
Sentences in the "Manage Your Practice Lists" section must display an Edit button in view mode.

**Rationale**: Users need an explicit action to enter edit mode, rather than the current auto-save on blur behavior.

**Implementation Location**: `frontend/app/sentences/page.tsx`

#### Scenario: Edit button appears in view mode
- Given a sentence in the library
- When the sentence is displayed in view mode
- Then an "Edit" button is visible next to the sentence

#### Scenario: Edit button is clickable
- Given an Edit button is visible
- When a user clicks the Edit button
- Then the sentence enters edit mode

### Requirement: Edit Mode Interface
When a sentence enters edit mode, it must display a textarea and action buttons (Save/Cancel).

**Rationale**: Users need a clear, controlled editing interface with explicit save/cancel options.

#### Scenario: Edit mode shows textarea
- Given a user clicked Edit on a sentence
- When the sentence is in edit mode
- Then a textarea is visible with the sentence text pre-populated

#### Scenario: Edit mode shows Save button
- Given a user clicked Edit on a sentence
- When the sentence is in edit mode
- Then a "Save" button is visible

#### Scenario: Edit mode shows Cancel button
- Given a user clicked Edit on a sentence
- When the sentence is in edit mode
- Then a "Cancel" button is visible

#### Scenario: View mode elements are hidden
- Given a sentence is in edit mode
- When the sentence is in edit mode
- Then the "Edit" button and read-only text are not visible

### Requirement: Save Functionality
Clicking Save must persist the changes via the existing API.

**Rationale**: Users need to explicitly save their changes to have them persisted.

#### Scenario: Save updates the sentence
- Given a user is editing a sentence and has made changes
- When the user clicks Save
- Then the sentence is updated via `handleUpdateSentence`
- And the sentence returns to view mode with the new text

#### Scenario: Save shows success message
- Given a user clicks Save on an edited sentence
- When the save operation completes successfully
- Then a success status message is displayed

#### Scenario: Save handles errors
- Given a user clicks Save on an edited sentence
- When the save operation fails
- Then an error message is displayed
- And the sentence remains in edit mode

### Requirement: Cancel Functionality
Clicking Cancel must discard changes and return to view mode.

**Rationale**: Users need the ability to abandon their changes.

#### Scenario: Cancel restores original text
- Given a user is editing a sentence and has made changes
- When the user clicks Cancel
- Then the original sentence text is restored
- And the sentence returns to view mode

#### Scenario: Cancel clears edit state
- Given a user is editing a sentence
- When the user clicks Cancel
- Then the edit state is cleared
- And the sentence returns to view mode

### Requirement: State Management
The component must track which sentence is being edited and its draft text.

**Rationale**: Multiple sentences may exist, and each needs independent edit state.

#### Scenario: Only one sentence in edit mode
- Given a user edits sentence A
- When sentence A is in edit mode
- Then sentence B and other sentences remain in view mode

#### Scenario: Switching between sentences
- Given a user is editing sentence A
- When the user clicks Edit on sentence B
- Then sentence A returns to view mode (changes lost if not saved)
- And sentence B enters edit mode

### Requirement: Visual Design
Edit mode must have clear visual distinction from view mode.

**Rationale**: Users need to easily identify which sentences are being edited.

#### Scenario: Edit mode has distinct styling
- Given a sentence is in edit mode
- When the sentence is in edit mode
- Then it has different background/border styling to indicate edit mode

#### Scenario: Smooth transitions
- Given a user switches between view and edit modes
- When the mode changes
- Then the transition is visually smooth (no jarring jumps)

## MODIFIED Requirements

### Requirement: Sentence Display Component
The sentence item component must be refactored to support view/edit mode switching.

**Rationale**: Current implementation always shows editable textarea; need to add conditional rendering.

**Breaking Changes**: None - purely additive UI enhancement

#### Scenario: Backward compatibility
- Given the updated component
- When it renders
- Then all existing functionality (delete, play) continues to work

#### Scenario: No regressions
- Given the updated component
- When it is used
- Then there are no regressions in existing behavior
