import { useState, useCallback, useMemo } from 'react';
import { Connect } from "@onflow/react-sdk"
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play } from 'lucide-react';

import { CustomEdge } from './CustomEdge';
import {
    WalletNode,
    SwapperNode,
    LiquidStakingNode,
    LendingNode,
    FlashLoanNode,
    PriceNode,
    LoopNode,
    ScheduleNode
} from './CustomNodes';
import { ConfigPanel } from './NodeConfigPanel';

const nodeTypes = {
    wallet: WalletNode,
    swapper: SwapperNode,
    liquidStaking: LiquidStakingNode,
    lending: LendingNode,
    flashLoan: FlashLoanNode,
    price: PriceNode,
    loop: LoopNode,
    schedule: ScheduleNode,
};

const WorkflowBuilder = () => {
    const [nodes, setNodes] = useNodesState([
        {
            id: '1',
            type: 'wallet',
            position: { x: 300, y: 50 },
            data: { amount: '100', token: 'FLOW', stepNumber: 1 },
            draggable: false,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        }
    ]);

    const [edges, setEdges] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showConfig, setShowConfig] = useState(false);
    const [nodeCounter, setNodeCounter] = useState(1);

    const onNodeClick = useCallback((event, node) => {
        event.stopPropagation();
        setSelectedNode(node);
        setShowConfig(true);
    }, []);

    const addNode = (type) => {
        const newId = `${nodeCounter + 1}`;
        setNodeCounter(prev => prev + 1);

        let position = { x: 300, y: 10 + (nodeCounter * 150) };
        let newStepNumber = nodeCounter + 1;
        // Add to end of workflow - find the last node in sequence
        const lastNode = nodes.reduce((last, current) =>
            current.data.stepNumber > last.data.stepNumber ? current : last
        );

        if (lastNode) {
            position = { x: 300, y: lastNode.position.y + 150 };
            // Add edge from last node to new node
            // @ts-ignore
            const newEdges = edges.concat([{
                id: `e${lastNode.id}-${newId}`,
                source: lastNode.id,
                target: newId,
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { strokeWidth: 2 },
                data: { percentage: 100 }
            }])
            setEdges(newEdges)
        }

        const newNode = {
            id: newId,
            type: type,
            position: position,
            data: { ...getDefaultNodeData(type), stepNumber: newStepNumber },
            draggable: false,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const getDefaultNodeData = (type) => {
        switch (type) {
            case 'wallet':
                return { amount: '100', token: 'FLOW' };
            case 'swapper':
                return { protocol: 'IncrementFi', fromToken: 'FLOW', toToken: 'USDC' };
            case 'liquidStaking':
                return { protocol: 'IncrementFi', inputToken: 'FLOW', outputToken: 'stFLOW' };
            case 'lending':
                return { protocol: 'IncrementFi', action: 'lend', token: 'USDC', amount: '100' };
            case 'flashLoan':
                return { protocol: 'Some Protocol', token: 'FLOW' };
            case 'price':
                return { source: 'Some Oracle', pair: 'FLOW/USDC' };
            case 'loop':
                return { iterations: '3', targetNodeId: null };
            case 'schedule':
                return { frequency: 'Weekly' };
            default:
                return {};
        }
    };

    const updateNodeData = (nodeId, newData) => {
        setNodes(nds => nds.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, ...newData } }
                : node
        ));
    };

    const customEdgeTypes = useMemo(() => ({
        default: (props) => <CustomEdge {...props} />
    }), []);

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50 fixed inset-0">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">DeFi Workflow Builder</h1>
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={() => setShowNodePanel(!showNodePanel)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Component
                        </button> */}
                        <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            <Play className="w-4 h-4" />
                            Execute
                        </button>
                        <div className="wallet-connect"><Connect variant='outline' /></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex relative">
                {/* Node Panel */}
                <div className="flex-4 left-0 w-64 h-full bg-white border-r border-gray-200 z-10 shadow-lg">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-800">Add Components</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { type: 'wallet', label: '💳 Wallet', desc: 'Token source' },
                                { type: 'swapper', label: '🔄 Swapper', desc: 'Token exchange' },
                                { type: 'liquidStaking', label: '🥩 Liquid Staking', desc: 'Stake tokens' },
                                { type: 'lending', label: '🏦 Lending', desc: 'Lend/Borrow' },
                                { type: 'flashLoan', label: '⚡ Flash Loan', desc: 'Instant loan' },
                                { type: 'price', label: '📊 Price Oracle', desc: 'Price feed' },
                                { type: 'loop', label: '🔁 Loop', desc: 'Repeat steps' },
                                { type: 'schedule', label: '⏰ Schedule', desc: 'Time trigger' },
                            ].map(({ type, label, desc }) => (
                                <button
                                    key={type}
                                    onClick={() => addNode(type)}
                                    className="w-full text-left p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
                                >
                                    <div className="font-medium text-sm">{label}</div>
                                    <div className="text-xs text-gray-500">{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* React Flow */}
                <div className={`flex-11 transition-all duration-200`}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        // onNodesChange={onNodesChange}
                        // onEdgesChange={onEdgesChange}
                        // onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={customEdgeTypes}
                        fitView
                        nodesDraggable={false}
                        nodesConnectable={true}
                        elementsSelectable={true}
                        className="bg-gray-50"
                    >
                        <Controls />
                        {/* <MiniMap /> */}
                        <Background variant="dots" gap={12} size={1} />
                        <defs>
                            <marker
                                id="arrow"
                                viewBox="0 0 10 10"
                                refX="9"
                                refY="3"
                                markerWidth="6"
                                markerHeight="6"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                            </marker>
                        </defs>
                    </ReactFlow>
                </div>

                {/* Configuration Panel */}
                <ConfigPanel
                    nodes={nodes}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    nodeCounter={nodeCounter}
                    setNodeCounter={setNodeCounter}
                    getDefaultNodeData={getDefaultNodeData}
                    selectedNode={selectedNode}
                    showConfig={showConfig}
                    setShowConfig={setShowConfig}
                    updateNodeData={updateNodeData}
                />
            </div>

            {/* Status Bar */}
            {/* <div className="bg-white border-t border-gray-200 px-4 py-2 z-10">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{nodes.length} components, {edges.length} connections</span>
                    <span>Click components to configure • Click + on edges to insert components • Use Split Outputs for parallel flows</span>
                </div>
            </div> */}
        </div>
    );
};

export default WorkflowBuilder;