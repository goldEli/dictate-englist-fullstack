## Implementation Plan

### Overview
Add a bulk add feature to the Sentence Bank page that allows users to input an array of strings (like `["a", "b", "c"]`) and save them as individual sentences.

### Implementation Steps

1. **Add UI Section for Bulk Add**
   - Add a new section below the single sentence add form
   - Include a textarea for array input
   - Add a "Bulk Add" button
   - Add instructions for the expected format

2. **Implement Bulk Add Logic**
   - Add state for bulk input and validation
   - Create `handleBulkAddSentences` function that:
     - Parses the input string as JSON
     - Validates it's an array of strings
     - Converts each string to a Sentence object with unique id using `makeId()`
     - Calls `sentencesService.saveSentences()` to save all sentences
     - Updates the UI with new sentences
     - Shows success/error messages

3. **Add Input Validation**
   - Handle invalid JSON format
   - Handle non-array inputs
   - Handle empty arrays
   - Show clear error messages

4. **Update Sentence List**
   - Ensure newly added sentences appear in the list
   - Maintain the same UI style and behavior

### Technical Details

- **Use existing `saveSentences()` method** - it already supports saving multiple sentences
- **Use existing `sanitizeSentencesPayload()` function** - for validation and sanitization
- **Follow existing UI patterns** - match the style of the single add form
- **Add appropriate error handling** - for JSON parsing and API errors
- **Update the operation status messages** - to include bulk add results

### Files to Modify

- `/Users/eli/Documents/github/dictate-englist-fullstack/frontend/app/sentences/page.tsx` - Add bulk add UI and logic

### Expected Behavior

1. User enters `["Hello", "World"]` in the bulk input
2. User clicks "Bulk Add"
3. System parses the input, creates two sentence objects
4. Sentences are saved to the database
5. Sentence list updates to show the new sentences
6. Success message appears

### Error Handling

- Invalid JSON: "Please enter a valid JSON array of strings"
- Non-array input: "Please enter a JSON array"
- Empty array: "Please enter at least one sentence"
- API error: "Failed to add sentences. Please try again."

### Testing

1. Test with valid JSON array
2. Test with invalid JSON
3. Test with non-array input
4. Test with empty array
5. Test with large array (10+ sentences)
6. Verify existing functionality still works

### Rollback Plan

- Revert changes to `page.tsx` file
- All existing functionality will be preserved