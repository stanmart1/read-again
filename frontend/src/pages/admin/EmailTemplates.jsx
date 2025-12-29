import AdminLayout from '../../components/AdminLayout';
import EmailTemplateManagement from '../../components/admin/EmailTemplateManagement';

const AdminEmailTemplates = () => {
  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="sticky top-0 z-10 bg-card rounded-lg shadow-md p-3 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Email Templates</h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1">Manage email templates and notifications</p>
        </div>
        <EmailTemplateManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminEmailTemplates;
