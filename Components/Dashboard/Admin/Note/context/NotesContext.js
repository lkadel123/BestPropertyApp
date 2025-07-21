import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const NotesContext = createContext();

// Provider
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Add new note
  const addNote = (note) => {
    setNotes((prev) => [note, ...prev]);
  };

  // Update existing note
  const updateNote = (id, updatedData) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updatedData } : note))
    );
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Pin / Unpin a note
  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  // Example to load notes from storage (optional)
  useEffect(() => {
    // TODO: Load from async storage or backend
    setNotes([
      {
        id: '1',
        title: 'Meeting Notes with Builder',
        content: 'Discussed project phases and expected timelines.',
        type: 'Property',
        pinned: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Lead Call Summary',
        content: 'Call with Mr. Rajiv regarding 2BHK options in Andheri.',
        type: 'Lead',
        pinned: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
