import AdminLayout from '../components/admin/AdminLayout.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';

export default function AdminDashboardPage() {
  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-GH', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <AdminDashboard />
      </div>
    </AdminLayout>
  );
}
