# Proposal: Add Edit Button for Sentence Management

## Why
The current sentence management interface uses inline editing with auto-save on blur, which can lead to accidental edits and provides no way for users to cancel changes. Adding an explicit edit button with save/cancel controls gives users better control over their sentence modifications and prevents unintended changes.

## Objective
Add an explicit edit button to the "Manage Your Practice Lists" section that allows users to edit sentences with a clear edit/save/cancel workflow.

## Problem Statement
Currently, the sentence management page (at `/sentences`) uses an inline textarea that auto-saves on blur. This approach:
- Lacks user control over when edits are saved
- Can result in accidental edits if users accidentally focus the textarea
- Provides no way to cancel changes
- Has no clear visual indication of edit mode

## Solution
Replace the current auto-save on blur behavior with a button-driven edit workflow:

### UX Flow
1. **View Mode**: Sentences display as read-only text with an "Edit" button
2. **Edit Mode**: Clicking "Edit" transforms the sentence into an editable textarea with "Save" and "Cancel" buttons
3. **Save**: Updates the sentence via API and returns to view mode
4. **Cancel**: Discards changes and returns to view mode

### Implementation Details

#### File to Modify
- `frontend/app/sentences/page.tsx` - The sentence management page

#### Key Changes
1. **Add State Management**
   - Track edit mode per sentence (editing state)
   - Track draft text during edit session
   - Store original text to support cancel operation

2. **UI Components**
   - Edit button (visible in view mode)
   - Save button (visible in edit mode)
   - Cancel button (visible in edit mode)
   - Textarea (visible in edit mode only)

3. **Event Handlers**
   - `handleStartEdit` - Enter edit mode for a specific sentence
   - `handleSaveEdit` - Save changes and exit edit mode
   - `handleCancelEdit` - Discard changes and exit edit mode

4. **API Integration**
   - Reuse existing `handleUpdateSentence` function
   - No backend changes required

### Visual Design
- Edit mode should be clearly distinguishable with visual cues
- Use Tailwind CSS classes consistent with existing design
- Maintain the existing color scheme and spacing
- Smooth transitions between view and edit modes

## User Stories
1. As a user, I want to click an "Edit" button before modifying a sentence
2. As a user, I want to see "Save" and "Cancel" options while editing
3. As a user, I want to cancel my changes and restore the original text
4. As a user, I want my changes to be saved only when I click "Save"

## Success Criteria
- [ ] Edit button is visible on each sentence in view mode
- [ ] Clicking Edit enters edit mode with a textarea
- [ ] Save button persists changes via API
- [ ] Cancel button discards changes and returns to view mode
- [ ] Edit mode has clear visual distinction from view mode
- [ ] No breaking changes to existing functionality
- [ ] Code follows existing TypeScript and Tailwind conventions

## Technical Approach
- Use React state to track editing state per sentence
- Store original text to enable cancel functionality
- Maintain existing API integration
- Follow existing code patterns and styling
- Ensure accessibility with proper ARIA labels

## Rollback Plan
Since this is a UI enhancement with no backend changes:
- Revert the modified `page.tsx` file to previous version
- All existing functionality will be immediately restored
- No database migrations or backend deployment required
