import { useStore } from '../state/store.js';

const PARAMETERS = [
  { value: 'pm25', label: 'PM2.5', color: '#ef4444' },
  { value: 'pm10', label: 'PM10', color: '#f59e0b' },
  { value: 'o3', label: 'O₃', color: '#10b981' },
];

export default function ParameterToggle() {
  const param = useStore((state) => state.view.param);
  const setView = useStore((state) => state.setView);
  
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '4px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    }}>
      {PARAMETERS.map((p) => (
        <button
          key={p.value}
          onClick={() => setView({ param: p.value })}
          style={{
            padding: '8px 16px',
            background: param === p.value 
              ? `linear-gradient(135deg, ${p.color}, ${p.color}dd)`
              : 'transparent',
            color: param === p.value ? 'white' : '#cbd5e1',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: param === p.value ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (param !== p.value) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (param !== p.value) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
