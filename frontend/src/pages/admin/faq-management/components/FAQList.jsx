import { useState } from 'react';

export default function FAQList({
  faqs,
  categories,
  selectedFAQs,
  onSelectFAQ,
  onSelectAll,
  onEditFAQ,
  onDeleteFAQ,
  onToggleStatus
}) {
  const [expandedFAQs, setExpandedFAQs] = useState([]);

  const toggleExpanded = (id) => {
    setExpandedFAQs(prev => 
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFAQs.length === faqs.length) {
      onSelectAll([]);
    } else {
      onSelectAll(faqs.map(faq => faq.id));
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280';
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || 'ri-question-line';
  };

  if (faqs.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
        <div className="text-muted-foreground">
          <i className="ri-question-line text-6xl mb-4"></i>
          <h3 className="text-lg font-medium text-foreground mb-2">No FAQs found</h3>
          <p className="text-muted-foreground">Get started by creating your first FAQ.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedFAQs.length === faqs.length && faqs.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {faqs.map((faq) => (
              <tr key={faq.id} className="hover:bg-muted">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedFAQs.includes(faq.id)}
                    onChange={() => onSelectFAQ(faq.id)}
                    className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="mr-2 text-muted-foreground hover:text-muted-foreground"
                    >
                      <i className={`ri-arrow-${expandedFAQs.includes(faq.id) ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground line-clamp-2">
                        {faq.question}
                      </div>
                      {expandedFAQs.includes(faq.id) && (
                        <div className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getCategoryColor(faq.category)}20`,
                      color: getCategoryColor(faq.category)
                    }}
                  >
                    <i className={`${getCategoryIcon(faq.category)} mr-1`}></i>
                    {faq.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      faq.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {faq.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {faq.view_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(faq.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onToggleStatus(faq.id, !faq.is_active)}
                      className="text-muted-foreground hover:text-foreground"
                      title={faq.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`ri-eye${faq.is_active ? '' : '-off'}-line`}></i>
                    </button>
                    <button
                      onClick={() => onEditFAQ(faq)}
                      className="text-primary hover:text-primary/90"
                      title="Edit FAQ"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => onDeleteFAQ(faq.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900"
                      title="Delete FAQ"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
