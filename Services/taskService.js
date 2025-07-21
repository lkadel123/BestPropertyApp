// /services/taskService.js

export const getTasksByProject = async (projectId) => {
  // Replace with real fetch
  return [
    {
      id: '1',
      title: 'Schedule site visit for Lead A',
      dueDate: '2025-07-18',
      assignedTo: 'Priya Kapoor',
      status: 'Pending',
    },
    {
      id: '2',
      title: 'Send project brochure to Lead B',
      dueDate: '2025-07-15',
      assignedTo: 'Ravi Sharma',
      status: 'Completed',
    },
    {
      id: '3',
      title: 'Reminder call to Lead C',
      dueDate: '2025-07-12',
      assignedTo: 'Amit Verma',
      status: 'Overdue',
    },
  ];
};
