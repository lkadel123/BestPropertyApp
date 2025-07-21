// notesConfig.js

// Define available note types (used for filters and creation)
export const NOTE_TYPES = ['Lead', 'Property', 'Follow-Up', 'Site Visit', 'Other'];

// Tag colors for display in NoteCard, filters, etc.
export const TAG_COLORS = {
  Lead: '#007AFF',         // Blue
  Property: '#28a745',     // Green
  'Follow-Up': '#f39c12',  // Orange
  'Site Visit': '#9b59b6', // Purple
  Other: '#95a5a6',        // Gray
};

// Default content placeholder (for empty rich editor)
export const DEFAULT_NOTE_CONTENT = 'Type your note here...';