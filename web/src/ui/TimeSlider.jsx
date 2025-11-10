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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="range"
        min={minTimeValue}
        max={maxTimeValue}
        value={fromTime}
        onChange={handleFromChange}
        style={{ width: '200px' }}
      />
      <span style={{ fontSize: '12px', minWidth: '150px' }}>
        {from.toLocaleString('ko-KR')} ~ {to.toLocaleString('ko-KR')}
      </span>
      <input
        type="range"
        min={minTimeValue}
        max={maxTimeValue}
        value={toTime}
        onChange={handleToChange}
        style={{ width: '200px' }}
      />
    </div>
  );
}

