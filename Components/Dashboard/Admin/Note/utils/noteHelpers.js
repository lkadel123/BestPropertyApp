// noteHelpers.js

// Sort notes by pinned first, then by date
export const sortNotes = (notes = []) => {
  return [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt); // latest first
  });
};

// Filter notes by type (e.g., 'Lead', 'Property')
export const filterNotesByType = (notes = [], type = 'All') => {
  if (type === 'All') return notes;
  return notes.filter((note) => note.type === type);
};

// Search notes by keyword (title or content)
export const searchNotes = (notes = [], keyword = '') => {
  if (!keyword.trim()) return notes;
  const lower = keyword.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lower) ||
      note.content.toLowerCase().includes(lower)
  );
};

// Format date to DD/MM/YYYY or other pattern
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')
  }/${date.getFullYear()}`;
};

// Generate a unique ID (fallback if needed)
export const generateNoteId = () => {
  return Date.now().toString();
};
