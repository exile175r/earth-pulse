import { useStore } from '../state/store.js';
import { useEffect, useState } from 'react';
import { get } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';

export default function SummaryCards() {
  const timeRange = useStore((state) => state.view.timeRange);
  const [stats, setStats] = useState({
    earthquakes: 0,
    airQuality: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eqData, aqData] = await Promise.all([
          get(endpoints.eq.recent({
            from: timeRange.from,
            to: timeRange.to,
            bucket: 'none',
          })).catch(() => ({ total: 0 })),
          get(endpoints.aq.recent({
            from: timeRange.from,
            to: timeRange.to,
            param: 'pm25',
            bucket: 'none',
          })).catch(() => ({ total: 0 })),
        ]);

        setStats({
          earthquakes: eqData.total || 0,
          airQuality: aqData.total || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ earthquakes: 0, airQuality: 0, loading: false });
      }
    }

    fetchStats();
  }, [timeRange]);

  const cards = [
    {
      title: '지진',
      value: stats.earthquakes,
      unit: '건',
      icon: '🌊',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
    {
      title: '대기질 측정',
      value: stats.airQuality,
      unit: '건',
      icon: '🌬️',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      display: 'flex',
      gap: '16px',
      zIndex: 1000,
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            minWidth: '180px',
            padding: '20px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: card.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}>
              {card.icon}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: '500',
            }}>
              {card.title}
            </div>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '4px',
          }}>
            {stats.loading ? '...' : card.value.toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#94a3b8',
          }}>
            {card.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
