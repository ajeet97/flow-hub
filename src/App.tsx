import { FlowProvider } from "@onflow/react-sdk"
import WorkflowBuilder from './components/WorkflowBuilder';

export default function App() {
    return (
        <FlowProvider
            config={{
                // accessNodeUrl: 'http://localhost:8888',
                // flowNetwork: 'emulator',
                // discoveryWallet: 'https://fcl-discovery.onflow.org/emulator/authn',
                accessNodeUrl: "https://rest-mainnet.onflow.org",
                flowNetwork: "mainnet",
                discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn'
                // appDetailTitle: "FlowHub",
                // appDetailIcon: "https://example.com/icon.png",
                // appDetailDescription: "Flow actions workflow marketplace",
                // appDetailUrl: "https://myonchainapp.com",
            }}
        >
            <WorkflowBuilder />
        </FlowProvider>
    );
}
