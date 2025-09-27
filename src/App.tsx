import SideBar from './components/SideBar';
import FlowEditor from './components/FlowEditor';

export default function App() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <SideBar>
                <FlowEditor />
            </SideBar>
        </div>
    );
}
