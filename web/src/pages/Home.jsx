import WorldWindScene from '../three/WorldWindScene.jsx';
import Topbar from '../ui/Topbar.jsx';
import SidePanel from '../ui/SidePanel.jsx';
import SummaryCards from '../ui/SummaryCards.jsx';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <WorldWindScene />
      <Topbar />
      <SidePanel />
      <SummaryCards />
    </div>
  );
}

