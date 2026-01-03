import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Activity, PieChart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsEvent {
  event_id: string;
  event_type: string;
  event_subtype: string;
  event_timestamp: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  trend_direction: string;
}

interface AggregatedMetrics {
  totalEvents: number;
  goalEvents: number;
  applicationEvents: number;
  avgMetricValue: number;
}

export function AnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics>({
    totalEvents: 0,
    goalEvents: 0,
    applicationEvents: 0,
    avgMetricValue: 0,
  });
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('event_timestamp', startDate.toISOString())
      .order('event_timestamp', { ascending: false });

    if (!error && data) {
      setEvents(data);

      const goalEvents = data.filter((e) => e.event_type === 'goal_created').length;
      const applicationEvents = data.filter((e) => e.event_type === 'application_created').length;
      const avgValue =
        data.length > 0
          ? data.reduce((acc, e) => acc + e.metric_value, 0) / data.length
          : 0;

      setMetrics({
        totalEvents: data.length,
        goalEvents,
        applicationEvents,
        avgMetricValue: avgValue,
      });
    }
  };

  const eventTypeColors: Record<string, string> = {
    goal_created: 'bg-blue-100 text-blue-800',
    application_created: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">System metrics and activity tracking</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Events</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Goal Events</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.goalEvents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Application Events</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.applicationEvents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Avg Metric Value</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.avgMetricValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.event_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          eventTypeColors[event.event_type] || eventTypeColors.default
                        }`}
                      >
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.metric_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.metric_value} {event.metric_unit}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          event.trend_direction === 'up'
                            ? 'text-green-600'
                            : event.trend_direction === 'down'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {event.trend_direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(event.event_timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No analytics events in the selected time range.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
