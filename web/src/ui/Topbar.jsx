import TimeSlider from './TimeSlider.jsx';
import ParameterToggle from './ParameterToggle.jsx';
import { useStore } from '../state/store.js';

export default function Topbar() {
  const perfMode = useStore((state) => state.view.perfMode);
  const setView = useStore((state) => state.setView);
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 1000,
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>EarthPulse</h1>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <TimeSlider />
        <ParameterToggle />
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={perfMode}
            onChange={(e) => setView({ perfMode: e.target.checked })}
          />
          성능 모드
        </label>
      </div>
    </div>
  );
}

