const UserMobileCard = ({ user, onView, onEdit, onAnalytics, onAssignBooks, onAssignRole, onPasswordReset, onStatusChange, onDelete }) => {
  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-500' : 'bg-red-500';
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'admin': return 'bg-purple-500';
      case 'super_admin': return 'bg-red-500';
      case 'user': return 'bg-primary/100';
      default: return 'bg-muted0';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 space-y-3">
      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {user.first_name?.[0] || ''}{user.last_name?.[0] || ''}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-foreground break-words">
                {user.first_name} {user.last_name}
              </div>
              {user.school_name && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-primary/20 text-primary" title="Student">
                  <i className="ri-graduation-cap-line mr-1"></i>
                  Student
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground break-words">{user.email}</div>
          </div>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(user.is_active)}`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Joined:</span>
          <span className="ml-1 font-medium text-foreground break-words">
            {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Username:</span>
          <span className="ml-1 font-medium text-foreground break-words">
            {user.username}
          </span>
        </div>
      </div>

      {/* Roles */}
      <div className="border-t pt-3">
        <div className="text-sm">
          <span className="font-medium text-foreground">Role:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getRoleColor(user.role?.name)}`}>
              {user.role?.display_name || 'No Role'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onView(user)}
          className="text-primary hover:text-blue-800 flex items-center text-sm"
        >
          <i className="ri-eye-line mr-1"></i>
          View
        </button>
        <button
          onClick={() => onAnalytics(user.id)}
          className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
        >
          <i className="ri-line-chart-line mr-1"></i>
          Analytics
        </button>
        <button
          onClick={() => onAssignRole?.(user)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
        >
          <i className="ri-shield-user-line mr-1"></i>
          Role
        </button>
        <button
          onClick={() => onAssignBooks(user)}
          className="text-teal-600 hover:text-teal-800 flex items-center text-sm"
        >
          <i className="ri-book-2-line mr-1"></i>
          Books
        </button>
        <button
          onClick={() => onEdit(user)}
          className="text-green-600 hover:text-green-800 flex items-center text-sm"
        >
          <i className="ri-edit-line mr-1"></i>
          Edit
        </button>
        <button
          onClick={() => onPasswordReset(user)}
          className="text-orange-600 hover:text-orange-800 flex items-center text-sm"
        >
          <i className="ri-lock-password-line mr-1"></i>
          Password
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-600 hover:text-red-800 flex items-center text-sm"
        >
          <i className="ri-delete-bin-line mr-1"></i>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserMobileCard;
