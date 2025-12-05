## Implementation Plan

### Overview
Add a one-click delete all sentences feature with user confirmation to the Sentence Bank page.

### Implementation Steps

1. **Add Delete All Button to UI**
   - Add a "Delete All" button in the Library section header
   - Style it as a red button to indicate danger
   - Only show when there are sentences to delete
   - Position it next to the sentence count

2. **Implement Confirmation Dialog**
   - Use browser's native `confirm()` dialog for simplicity
   - Clear message: "Are you sure you want to delete all sentences? This action cannot be undone."
   - Focus on the cancel option by default

3. **Implement Delete All Logic**
   - Create `handleDeleteAllSentences` function that:
     - Shows confirmation dialog
     - If confirmed, iterates through all sentences
     - Calls `sentencesService.deleteSentence()` for each one
     - Clears the sentences state
     - Shows success/error message

4. **Update UI State**
   - Ensure the sentence list updates immediately after deletion
   - Show appropriate success/error messages
   - Hide the delete all button when no sentences exist

### Technical Details

- **Use existing `deleteSentence()` method** - no new backend endpoint needed
- **Use native `confirm()` dialog** - simple and accessible
- **Follow existing UI patterns** - match the style of other buttons
- **Add appropriate error handling** - show message if deletion fails
- **Update operation status messages** - to include delete all results

### Files to Modify

- `/Users/eli/Documents/github/dictate-englist-fullstack/frontend/app/sentences/page.tsx` - Add delete all button and logic

### Expected Behavior

1. User has multiple sentences in the list
2. User clicks "Delete All"
3. Confirmation dialog appears
4. User confirms deletion
5. All sentences are deleted one by one
6. Sentence list clears
7. Success message appears

### Error Handling

- User cancels: No action taken
- API error: "Failed to delete all sentences. Please try again."
- Empty list: Button is hidden

### Testing

1. Test with multiple sentences
2. Test canceling the confirmation
3. Test with empty list (button should be hidden)
4. Verify success message appears
5. Verify sentences are removed from the list

### Rollback Plan

- Revert changes to `page.tsx` file
- All existing functionality will be preserved