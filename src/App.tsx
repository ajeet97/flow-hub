import SideBar from './components/SideBar';
import FlowEditor from './components/FlowEditor';
import { FlowProvider } from "@onflow/react-sdk"

export default function App() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <FlowProvider
                config={{
                    accessNodeUrl: "https://access.mainnet.nodes.onflow.org:9000",
                    flowNetwork: "mainnet",
                    appDetailTitle: "FlowHub",
                    appDetailIcon: "https://example.com/icon.png",
                    appDetailDescription: "Flow actions workflow marketplace",
                    appDetailUrl: "https://myonchainapp.com",
                }}
            >
                <SideBar>
                    <FlowEditor />
                </SideBar>
            </FlowProvider>
        </div>
    );
}
