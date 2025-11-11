import { useStore } from '../state/store.js';

export default function SidePanel() {
  const sidePanelOpen = useStore((state) => state.ui.sidePanelOpen);
  const selection = useStore((state) => state.selection);
  const setUI = useStore((state) => state.setUI);
  
  if (!sidePanelOpen) return null;
  
  return (
    <div style={{
      position: 'absolute',
      right: 0,
      top: '70px',
      width: '360px',
      height: 'calc(100vh - 70px)',
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(148, 163, 184, 0.1)',
      color: 'white',
      padding: '24px',
      overflowY: 'auto',
      zIndex: 999,
      boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)',
    }}>
      <button
        onClick={() => setUI({ sidePanelOpen: false })}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'rotate(90deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'rotate(0deg)';
        }}
      >
        ×
      </button>
      
      <h2 style={{
        marginBottom: '24px',
        fontSize: '20px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        상세 정보
      </h2>
      
      {selection.type === 'none' ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#94a3b8',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <p style={{ fontSize: '14px' }}>지구를 클릭하여 정보를 확인하세요</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}>
          <h3 style={{
            marginBottom: '12px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#f8fafc',
          }}>
            {selection.name}
          </h3>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '16px',
          }}>
            {selection.type}
          </div>
          {/* TODO: 상세 정보 표시 */}
        </div>
      )}
    </div>
  );
}
