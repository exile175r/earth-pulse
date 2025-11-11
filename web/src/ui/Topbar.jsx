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
      height: '70px',
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
        }}>
          🌍
        </div>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          EarthPulse
        </h1>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <TimeSlider />
        <ParameterToggle />
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        >
          <input
            type="checkbox"
            checked={perfMode}
            onChange={(e) => setView({ perfMode: e.target.checked })}
          />
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>성능 모드</span>
        </label>
      </div>
    </div>
  );
}
