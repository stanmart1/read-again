export default function FAQStats({ stats }) {
  const statCards = [
    {
      title: 'Total FAQs',
      value: stats.total_faqs || 0,
      icon: 'ri-question-line',
      color: 'bg-primary/100',
      textColor: 'text-primary'
    },
    {
      title: 'Categories',
      value: stats.total_categories || 0,
      icon: 'ri-folder-line',
      color: 'bg-green-50 dark:bg-green-900/200',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Views',
      value: stats.total_views || 0,
      icon: 'ri-eye-line',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Recent FAQs',
      value: stats.recent_faqs?.length || 0,
      icon: 'ri-time-line',
      color: 'bg-yellow-50 dark:bg-yellow-900/200',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <i className={`${stat.icon} text-2xl ${stat.textColor}`}></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
