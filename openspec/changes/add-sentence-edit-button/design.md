# Design: Edit Button for Sentence Management

## Architecture Decisions

### State Management Strategy
**Decision**: Use component-level state to track edit mode per sentence

**Reasoning**:
- Simpler than global state (no need for context or external state library)
- Each sentence item is self-contained
- No performance concerns with small number of sentences
- Follows existing patterns in the codebase

**State Structure**:
```typescript
const [editingId, setEditingId] = useState<string | null>(null);
const [editText, setEditText] = useState("");
```

### UI Pattern: Inline Edit vs Modal
**Decision**: Inline edit mode (not modal)

**Reasoning**:
- Maintains context (user can see other sentences)
- Consistent with existing UI patterns
- Less disruptive to workflow
- Already used in the auto-save textarea pattern

### Edit Mode Activation
**Decision**: Clicking Edit button enters edit mode

**Alternative Considered**: Clicking anywhere on sentence text
- **Rejected**: Too easy to accidentally trigger
- Less discoverable for new users

### Save Behavior
**Decision**: Explicit Save button required

**Reasoning**:
- Gives users control over when changes are committed
- Allows time to review changes
- Prevents accidental saves
- Industry standard UX pattern

### Cancel Behavior
**Decision**: Cancel button discards changes and returns to view mode

**Implementation**:
- Restore original sentence text
- Clear edit state
- Return to view mode

### Keyboard Shortcuts
**Decision**: Support Escape to cancel, Enter to save

**Reasoning**:
- Common UX pattern
- Improves accessibility
- Faster workflow for power users

## Component Structure

### Current Implementation
```
SentenceBankPage
  └── sentences.map(sentence => (
    <div>  // Currently has editable textarea always visible
      <textarea value={sentence.text} onBlur={handleUpdate} />
    </div>
  ))
```

### Proposed Implementation
```
SentenceBankPage
  └── sentences.map(sentence => (
    <div>
      {editingId === sentence.id ? (
        // Edit mode UI
        <div>
          <textarea value={editText} onChange={setEditText} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        // View mode UI
        <div>
          <span>{sentence.text}</span>
          <button onClick={handleStartEdit}>Edit</button>
        </div>
      )}
    </div>
  ))
```

## Accessibility Considerations

### ARIA Labels
- Edit button: `aria-label="Edit sentence"`
- Save button: `aria-label="Save changes"`
- Cancel button: `aria-label="Cancel editing"`

### Keyboard Navigation
- Tab to navigate between elements
- Enter on Save button to save
- Escape on Cancel button to cancel
- Focus management when entering/leaving edit mode

### Visual Feedback
- Clear visual distinction between view and edit modes
- High contrast for form elements
- Consistent with existing design system

## Performance Considerations

### Re-renders
- Only the sentence being edited will re-render
- No performance impact on other sentences
- Efficient state management

### Memory
- Minimal memory overhead
- No need to store all edit states simultaneously
- Cleanup on unmount

## Testing Strategy

### Unit Tests
- Test state transitions
- Test event handlers
- Test API integration

### Manual Testing
- Test all user flows
- Test edge cases (empty text, very long text)
- Test keyboard navigation
- Test accessibility

### Integration Testing
- Verify API calls are made correctly
- Verify error handling
- Verify UI updates after save/cancel
