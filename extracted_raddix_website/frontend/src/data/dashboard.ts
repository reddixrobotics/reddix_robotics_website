export const dashboardData = {
  stats: {
    totalOrders: 12,
    pendingPayments: '₹120,000',
    activeApplications: 2,
    savedProducts: 5
  },
  recentOrders: [
    {
      id: 'ORD-2024-8901',
      date: '2024-05-12',
      products: ['R-X1 Industrial Arm'],
      amount: '₹4,500,000',
      deposit: '₹2,250,000',
      status: 'Processing'
    },
    {
      id: 'ORD-2024-8842',
      date: '2024-04-28',
      products: ['Vision System Pro', 'Calibration Kit'],
      amount: '₹850,000',
      deposit: '₹425,000',
      status: 'Delivered'
    },
    {
      id: 'ORD-2024-8799',
      date: '2024-03-15',
      products: ['Quantum Sensor Module x4'],
      amount: '₹200,000',
      deposit: '₹100,000',
      status: 'Delivered'
    }
  ],
  pendingPayments: [
    {
      id: 'PAY-8901-BAL',
      orderId: 'ORD-2024-8901',
      dueDate: '2024-06-15',
      amount: '₹2,250,000',
      status: 'Upcoming'
    }
  ],
  applications: [
    {
      id: 'APP-992',
      type: 'Partnership',
      date: '2024-05-01',
      status: 'Under Review'
    },
    {
      id: 'APP-814',
      type: 'Career (Robotics Engineer)',
      date: '2024-04-20',
      status: 'Interview Scheduled'
    }
  ],
  user: {
    name: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    company: 'TechCorp Industries',
    role: 'Procurement Manager',
    phone: '+91 98765 43210',
    location: 'Bangalore, India'
  }
};
