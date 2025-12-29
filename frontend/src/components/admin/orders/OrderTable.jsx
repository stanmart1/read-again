const OrderTable = ({ 
  orders, 
  onView, 
  onDelete, 
  onSelect,
  onSelectAll,
  selectedOrders,
  selectAll,
  getStatusColor,
  getPaymentStatusColor,
  formatCurrency,
  formatDate,
  formatTime,
  getCustomerName
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-foreground">No orders found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => onSelect(order.id)}
                      className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">#{order.order_number}</div>
                    <div className="text-sm text-muted-foreground">{order.total_items || 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{getCustomerName(order)}</div>
                    {order.guest_email && (
                      <div className="text-sm text-muted-foreground">{order.guest_email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                    {order.payment_method && (
                      <div className="text-xs text-muted-foreground mt-1">{order.payment_method}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{formatDate(order.created_at)}</div>
                    <div className="text-sm text-muted-foreground">{formatTime(order.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(order)}
                        className="text-primary hover:text-blue-800"
                        title="View details"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => onDelete(order)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:text-red-200"
                        title="Delete order"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
