import { useState, useEffect, useRef, useMemo } from 'react';
import { useReports } from '../../hooks/useReports';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportsSection = () => {
  const { reportsData, loading, fetchReportsData, generateReport, downloadReport } = useReports();
  const [generatingReport, setGeneratingReport] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchReportsData();
      hasFetched.current = true;
    }
  }, []);

  const safeData = useMemo(() => ({
    engagementData: reportsData?.engagement || [],
    popularBooks: reportsData?.popularBooks || [],
    reviewAnalytics: reportsData?.reviewAnalytics || reportsData?.reviews || [],
    reports: reportsData?.reports || []
  }), [reportsData]);

  const handleGenerateReport = async (reportType) => {
    setGeneratingReport(reportType);
    const result = await generateReport(reportType);
    if (result.success) {
      alert('Report generated successfully!');
      fetchReportsData();
    } else {
      alert('Failed to generate report');
    }
    setGeneratingReport(null);
  };

  const handleDownloadReport = async (reportType) => {
    const result = await downloadReport(reportType);
    if (result.success) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('Failed to download report');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading && !reportsData) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading reports data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Report Generation */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h3>
        {safeData.reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeData.reports.map((report, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{report.title}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'ready' ? 'bg-green-100 text-green-800' :
                    report.status === 'generating' ? 'bg-primary/20 text-blue-800' :
                    'bg-muted text-gray-800'
                  }`}>
                    {generatingReport === report.type ? 'generating' : report.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Last generated: {report.lastGenerated}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateReport(report.type)}
                      disabled={generatingReport === report.type}
                      className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                    >
                      {generatingReport === report.type ? 'Generating...' : 'Generate'}
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report.type)}
                      className="px-3 py-1 text-xs border border-input rounded hover:bg-muted whitespace-nowrap"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No reports available</div>
        )}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">User Engagement</h3>
          {safeData.engagementData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeData.engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </div>

        {/* Review Distribution */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Review Distribution</h3>
          {safeData.reviewAnalytics.length > 0 ? (
            <div className="space-y-3">
              {safeData.reviewAnalytics.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm text-muted-foreground">{item.rating}</span>
                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </div>
      </div>

      {/* Popular Books */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Popular Books Tracking</h3>
        {safeData.popularBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reviews</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeData.popularBooks.map((book, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatNumber(book.views)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center space-x-1">
                        <span>{book.rating}</span>
                        <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{book.reviews}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <i className={`ri-arrow-${book.trend >= 0 ? 'up' : 'down'}-line text-${book.trend >= 0 ? 'green' : 'red'}-600`}></i>
                        <span className={`text-${book.trend >= 0 ? 'green' : 'red'}-600`}>
                          {book.trend >= 0 ? '+' : ''}{book.trend}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No data available</div>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
