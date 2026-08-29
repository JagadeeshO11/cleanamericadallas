const fs = require('fs');
const path = require('path');

console.log('Testing file existence...');

const files = [
  'src/App.jsx',
  'src/components/Navbar.jsx',
  'src/components/BottomNav.jsx',
  'src/pages/Home.jsx',
  'src/pages/Browse.jsx',
  'src/pages/auth/Login.jsx',
  'src/pages/auth/Register.jsx',
  'src/pages/CustomerProfile.jsx',
  'src/pages/Orders.jsx',
  'src/pages/Cart.jsx',
  'src/pages/BookingFlow.jsx',
  'src/pages/OrderTracking.jsx',
  'src/pages/worker/WorkerHome.jsx',
  'src/pages/worker/WorkerOrders.jsx',
  'src/pages/worker/WorkerHistory.jsx',
  'src/pages/worker/WorkerWallet.jsx',
  'src/pages/worker/WorkerProfile.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/admin/AdminOrders.jsx',
  'src/pages/admin/AdminCustomers.jsx',
  'src/pages/admin/AdminWorkers.jsx',
  'src/pages/admin/AdminProducts.jsx',
  'src/pages/admin/AdminReports.jsx',
  'src/pages/admin/AdminPayments.jsx',
  'src/pages/admin/AdminMore.jsx',
  'src/routes/CustomerRoutes.jsx',
  'src/routes/WorkerRoutes.jsx',
  'src/routes/AdminRoutes.jsx',
];

let missing = 0;
for (const file of files) {
  const fullPath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error('MISSING FILE:', file);
    missing++;
  }
}

if (missing === 0) {
  console.log('All files exist!');
}
