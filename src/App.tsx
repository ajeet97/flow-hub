import { FlowProvider } from "@onflow/react-sdk"
import WorkflowBuilder from './components/WorkflowBuilder';
import flowJSON from "../flow.json"

export default function App() {
    return (
        <FlowProvider
            config={{
                // accessNodeUrl: 'http://localhost:8888',
                // flowNetwork: 'emulator',
                // discoveryWallet: 'https://fcl-discovery.onflow.org/emulator/authn',

                accessNodeUrl: "https://rest-mainnet.onflow.org",
                flowNetwork: "mainnet",
                discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
                appDetailTitle: "FlowHub",
                appDetailDescription: "Build complext workflows easily with FlowHub",
            }}
            flowJson={flowJSON}
        >
            <WorkflowBuilder />
        </FlowProvider>
    );
}
