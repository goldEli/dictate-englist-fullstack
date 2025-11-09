# Tasks: Add Edit Button for Sentence Management

## Implementation Tasks

### 1. Analyze Current Implementation
- [x] Review existing sentence editing code in `frontend/app/sentences/page.tsx`
- [x] Understand current `handleUpdateSentence` function
- [x] Identify UI components and styling patterns
- [x] Document current behavior (auto-save on blur)

### 2. Design Edit State Management
- [ ] Add state to track which sentence is being edited
- [ ] Add state to track draft text during edit
- [ ] Design state transition logic (view → edit → save/cancel → view)

### 3. Implement Edit Mode UI
- [ ] Add Edit button to each sentence in view mode
- [ ] Create edit mode layout with:
  - [ ] Textarea for editing
  - [ ] Save button
  - [ ] Cancel button
- [ ] Add conditional rendering for view vs edit mode
- [ ] Style edit mode with Tailwind CSS

### 4. Implement Event Handlers
- [ ] Create `handleStartEdit(sentenceId, text)` function
- [ ] Create `handleSaveEdit(sentenceId)` function
- [ ] Create `handleCancelEdit()` function
- [ ] Ensure proper focus management (focus textarea when entering edit mode)

### 5. Test Implementation
- [ ] Test entering edit mode
- [ ] Test saving changes
- [ ] Test canceling changes (verify original text restored)
- [ ] Test editing multiple sentences in sequence
- [ ] Verify no regressions in existing functionality
- [ ] Test keyboard accessibility (Enter to save, Escape to cancel)

### 6. Code Quality
- [ ] Ensure TypeScript types are correct
- [ ] Follow existing code style and conventions
- [ ] Add comments for complex logic
- [ ] Run linting (`pnpm lint` in frontend directory)
