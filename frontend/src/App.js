import { Navbar } from './Navbar';
import { LeftMenuRail } from './LeftMenuRail';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { PropertiesPanel } from './propertiesPanel';
import { GuideTour } from './GuideTour';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-layout">
        <LeftMenuRail />
        <PipelineToolbar />
        <div className="app-main">
          <PipelineUI />
          <SubmitButton />
        </div>
        <PropertiesPanel />
      </div>
      <GuideTour />
    </div>
  );
}

export default App;


