import { useStore } from '../state/store.js';

const PARAMETERS = [
  { value: 'pm25', label: 'PM2.5' },
  { value: 'pm10', label: 'PM10' },
  { value: 'o3', label: 'O3' },
];

export default function ParameterToggle() {
  const param = useStore((state) => state.view.param);
  const setView = useStore((state) => state.setView);
  
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {PARAMETERS.map((p) => (
        <button
          key={p.value}
          onClick={() => setView({ param: p.value })}
          style={{
            padding: '8px 16px',
            background: param === p.value ? '#4a90e2' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

