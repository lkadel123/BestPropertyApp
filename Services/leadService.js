// services/leadService.js

// 🧪 Mock Data
let mockLeads = [
  {
    id: 'lead001',
    name: 'Amit Sharma',
    phone: '9876543210',
    source: 'Facebook Ads',
    createdAt: '2025-07-10',
    projectId: 'project001',
    status: 'New',
  },
  {
    id: 'lead002',
    name: 'Riya Mehta',
    phone: '9123456780',
    source: 'Walk-In',
    createdAt: '2025-07-13',
    projectId: 'project001',
    status: 'Contacted',
  },
  {
    id: 'lead003',
    name: 'Karan Patel',
    phone: '9998877665',
    source: 'Google Ads',
    createdAt: '2025-07-14',
    projectId: 'project002',
    status: 'Interested',
  },
];

// 🔍 Get all leads by project ID
export const getLeadsByProject = async (projectId) => {
  return new Promise((resolve) => {
    const leads = mockLeads.filter((lead) => lead.projectId === projectId);
    setTimeout(() => resolve(leads), 300); // simulate network delay
  });
};

// 📄 Get a single lead by ID
export const getLeadDetails = async (leadId) => {
  return new Promise((resolve, reject) => {
    const lead = mockLeads.find((l) => l.id === leadId);
    setTimeout(() => {
      if (lead) resolve(lead);
      else reject(new Error('Lead not found'));
    }, 300);
  });
};

// ➕ Create a new lead for a project
export const createLeadForProject = async (projectId, leadData) => {
  return new Promise((resolve) => {
    const newLead = {
      id: `lead${Date.now()}`,
      ...leadData,
      projectId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockLeads.push(newLead);
    setTimeout(() => resolve(newLead), 300);
  });
};

// ✏️ Update a lead by ID
export const updateLead = async (leadId, updates) => {
  return new Promise((resolve, reject) => {
    const index = mockLeads.findIndex((l) => l.id === leadId);
    if (index === -1) {
      setTimeout(() => reject(new Error('Lead not found')), 300);
    } else {
      mockLeads[index] = { ...mockLeads[index], ...updates };
      setTimeout(() => resolve(mockLeads[index]), 300);
    }
  });
};
