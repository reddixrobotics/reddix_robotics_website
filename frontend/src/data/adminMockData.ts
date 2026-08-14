export const adminMockData = {
  stats: {
    totalUsers: 12450,
    totalProducts: 42,
    totalOrders: 1832,
    revenue: '₹ 84.5M',
    pendingOrders: 156,
    applications: 89,
    workshops: 12,
    messages: 43
  },
  revenueData: [
    { name: 'Jan', revenue: 4000000 },
    { name: 'Feb', revenue: 5200000 },
    { name: 'Mar', revenue: 4800000 },
    { name: 'Apr', revenue: 7100000 },
    { name: 'May', revenue: 6800000 },
    { name: 'Jun', revenue: 9500000 },
    { name: 'Jul', revenue: 11200000 },
  ],
  recentActivity: [
    { id: 'act-1', type: 'order', message: 'New order #ORD-8902 received for R-X1 Industrial Arm.', time: '10 mins ago' },
    { id: 'act-2', type: 'user', message: 'New user registration: corp_buyer_88.', time: '1 hour ago' },
    { id: 'act-3', type: 'payment', message: 'Payment of ₹900,000 received for #ORD-8901.', time: '3 hours ago' },
    { id: 'act-4', type: 'application', message: 'New partnership application from TechCorp.', time: '5 hours ago' },
    { id: 'act-5', type: 'system', message: 'System automated backup completed.', time: '1 day ago' },
  ],
  orders: [
    { id: 'ORD-8902', customer: 'Nexus Heavy Industries', amount: 4500000, date: '2024-05-15', status: 'Pending' },
    { id: 'ORD-8901', customer: 'TechCorp', amount: 4500000, date: '2024-05-12', status: 'Processing' },
    { id: 'ORD-8900', customer: 'Global Robotics', amount: 850000, date: '2024-05-10', status: 'Shipped' },
    { id: 'ORD-8899', customer: 'Apex Manufacturing', amount: 1200000, date: '2024-05-08', status: 'Delivered' },
    { id: 'ORD-8898', customer: 'Quantum Logistics', amount: 650000, date: '2024-05-05', status: 'Delivered' },
    { id: 'ORD-8897', customer: 'CyberDyne Systems', amount: 3200000, date: '2024-05-01', status: 'Processing' },
    { id: 'ORD-8896', customer: 'Weyland Corp', amount: 180000, date: '2024-04-28', status: 'Cancelled' },
    { id: 'ORD-8895', customer: 'Stark Industries', amount: 5500000, date: '2024-04-25', status: 'Delivered' },
    { id: 'ORD-8894', customer: 'Oscorp', amount: 420000, date: '2024-04-20', status: 'Delivered' },
    { id: 'ORD-8893', customer: 'Wayne Enterprises', amount: 8900000, date: '2024-04-15', status: 'Processing' },
  ]
};
