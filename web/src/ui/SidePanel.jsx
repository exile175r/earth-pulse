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
      top: '80px',
      width: '300px',
      height: 'calc(100vh - 80px)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 999,
    }}>
      <button
        onClick={() => setUI({ sidePanelOpen: false })}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
      
      <h2>상세 정보</h2>
      
      {selection.type === 'none' ? (
        <p>항목을 선택하세요.</p>
      ) : (
        <div>
          <h3>{selection.name}</h3>
          <p>타입: {selection.type}</p>
          {/* TODO: 상세 정보 표시 */}
        </div>
      )}
    </div>
  );
}

