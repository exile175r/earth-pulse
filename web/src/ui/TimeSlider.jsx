import { useStore } from '../state/store.js';

export default function TimeSlider() {
  const timeRange = useStore((state) => state.view.timeRange);
  const setView = useStore((state) => state.setView);
  
  const from = new Date(timeRange.from);
  const to = new Date(timeRange.to);
  const now = new Date();
  const minTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7일 전
  const maxTime = now;
  
  const fromTime = from.getTime();
  const toTime = to.getTime();
  const minTimeValue = minTime.getTime();
  const maxTimeValue = maxTime.getTime();
  
  const handleFromChange = (e) => {
    const newFrom = new Date(parseInt(e.target.value, 10));
    if (newFrom < to) {
      setView({
        timeRange: {
          from: newFrom.toISOString(),
          to: timeRange.to,
        },
      });
    }
  };
  
  const handleToChange = (e) => {
    const newTo = new Date(parseInt(e.target.value, 10));
    if (newTo > from) {
      setView({
        timeRange: {
          from: timeRange.from,
          to: newTo.toISOString(),
        },
      });
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' }}>
        <input
          type="range"
          min={minTimeValue}
          max={maxTimeValue}
          value={fromTime}
          onChange={handleFromChange}
          style={{ width: '100%' }}
        />
        <input
          type="range"
          min={minTimeValue}
          max={maxTimeValue}
          value={toTime}
          onChange={handleToChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{
        fontSize: '12px',
        color: '#cbd5e1',
        minWidth: '200px',
        textAlign: 'center',
        padding: '4px 8px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
      }}>
        {from.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} ~ {to.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
