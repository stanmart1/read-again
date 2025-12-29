import AdminLayout from '../../components/AdminLayout';
import ReportsSection from '../../components/admin/ReportsSection';

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-10 bg-card rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and download comprehensive reports</p>
        </div>
        <ReportsSection />
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
