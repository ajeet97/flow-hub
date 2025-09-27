import React, { useState, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Play, X } from 'lucide-react';

import { CustomEdge } from './components/CustomEdge';
import {
    WalletNode,
    SwapperNode,
    LiquidStakingNode,
    LendingNode,
    FlashLoanNode,
    PriceNode,
    LoopNode,
    ScheduleNode
} from './components/CustomNodes';
import { ConfigPanel } from './components/NodeConfigPanel';

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
    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: '1',
            type: 'wallet',
            position: { x: 300, y: 50 },
            data: { amount: '100', token: 'FLOW', stepNumber: 1 },
            draggable: false,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        },
    ]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [nodeCounter, setNodeCounter] = useState(1);

    const onNodeClick = useCallback((event, node) => {
        event.stopPropagation();
        setSelectedNode(node);
        setShowConfig(true);
    }, []);

    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                ...params,
                id: `e${params.source}-${params.target}`,
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { strokeWidth: 2 },
                data: { percentage: 100 }
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges],
    );

    const addNode = (type, insertAfterEdgeId = null) => {
        const newId = `${nodeCounter + 1}`;
        setNodeCounter(prev => prev + 1);

        let position = { x: 300, y: 50 + (nodeCounter * 150) };
        let newStepNumber = nodeCounter + 1;

        if (insertAfterEdgeId) {
            // Insert between existing nodes
            const edge = edges.find(e => e.id === insertAfterEdgeId);
            if (edge) {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);

                // Position between source and target vertically
                position = {
                    x: 300,
                    y: sourceNode.position.y + 150
                };

                // Update step numbers for all nodes after the insertion point
                const sourceStepNumber = sourceNode.data.stepNumber;
                newStepNumber = sourceStepNumber + 1;

                // Shift all nodes after insertion point down and update step numbers
                setNodes(nds => nds.map(node => {
                    if (node.data.stepNumber > sourceStepNumber) {
                        return {
                            ...node,
                            position: { ...node.position, y: node.position.y + 150 },
                            data: { ...node.data, stepNumber: node.data.stepNumber + 1 }
                        };
                    }
                    return node;
                }));

                // Remove old edge and add two new ones
                setEdges(eds => {
                    const filtered = eds.filter(e => e.id !== insertAfterEdgeId);
                    return [
                        ...filtered,
                        {
                            id: `e${edge.source}-${newId}`,
                            source: edge.source,
                            target: newId,
                            markerEnd: { type: MarkerType.ArrowClosed },
                            style: { strokeWidth: 2 },
                            data: { percentage: 100 }
                        },
                        {
                            id: `e${newId}-${edge.target}`,
                            source: newId,
                            target: edge.target,
                            markerEnd: { type: MarkerType.ArrowClosed },
                            style: { strokeWidth: 2 },
                            data: { percentage: 100 }
                        }
                    ];
                });
            }
        } else {
            // Add to end of workflow - find the last node in sequence
            const lastNode = nodes.reduce((last, current) =>
                current.data.stepNumber > last.data.stepNumber ? current : last
            );

            if (lastNode) {
                position = { x: 300, y: lastNode.position.y + 150 };
                // Add edge from last node to new node
                setTimeout(() => {
                    setEdges((eds) => eds.concat([{
                        id: `e${lastNode.id}-${newId}`,
                        source: lastNode.id,
                        target: newId,
                        markerEnd: { type: MarkerType.ArrowClosed },
                        style: { strokeWidth: 2 },
                        data: { percentage: 100 }
                    }]));
                }, 0);
            }
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
        setShowNodePanel(false);
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

    const onEdgeClick = (edgeId) => {
        // Show context menu or add node between
        const shouldAdd = window.confirm('Add a new component here?');
        if (shouldAdd) {
            setShowNodePanel(true);
            // Store edge ID for insertion
            window.insertAfterEdgeId = edgeId;
        }
    };

    const addMultipleOutputs = (sourceNodeId) => {
        const targetCount = parseInt(prompt('How many outputs do you want?') || '2');
        if (targetCount > 1) {
            // Remove existing edges from this source
            setEdges(eds => eds.filter(e => e.source !== sourceNodeId));

            // Add multiple nodes with percentage splits
            const percentagePerOutput = Math.floor(100 / targetCount);
            let remainingPercentage = 100;
            const sourceNode = nodes.find(n => n.id === sourceNodeId);

            for (let i = 0; i < targetCount; i++) {
                const isLast = i === targetCount - 1;
                const percentage = isLast ? remainingPercentage : percentagePerOutput;
                remainingPercentage -= percentage;

                const newId = `${nodeCounter + i + 1}`;
                const newStepNumber = sourceNode.data.stepNumber + 1;

                const newNode = {
                    id: newId,
                    type: 'swapper', // Default type
                    position: {
                        x: 300 + (i * 200) - ((targetCount - 1) * 100),
                        y: sourceNode.position.y + 150
                    },
                    data: { ...getDefaultNodeData('swapper'), stepNumber: newStepNumber },
                    draggable: false,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };

                const newEdge = {
                    id: `e${sourceNodeId}-${newId}`,
                    source: sourceNodeId,
                    target: newId,
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { strokeWidth: 2 },
                    data: { percentage: percentage },
                    label: `${percentage}%`,
                };

                setNodes(nds => [...nds, newNode]);
                setEdges(eds => [...eds, newEdge]);
            }

            setNodeCounter(prev => prev + targetCount);
        }
    };

    const customEdgeTypes = useMemo(() => ({
        default: (props) => <CustomEdge {...props} onEdgeClick={onEdgeClick} />
    }), [onEdgeClick]);

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50 fixed inset-0">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">DeFi Workflow Builder</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowNodePanel(!showNodePanel)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Component
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            <Play className="w-4 h-4" />
                            Execute
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex relative">
                {/* Node Panel */}
                {(
                    <div className="fixed left-0 left-0 w-64 h-full bg-white border-r border-gray-200 z-10 shadow-lg">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-gray-800">Add Components</h3>
                                <button
                                    onClick={() => setShowNodePanel(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
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
                                        onClick={() => addNode(type, window.insertAfterEdgeId)}
                                        className="w-full text-left p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
                                        onMouseUp={() => { window.insertAfterEdgeId = null; }}
                                    >
                                        <div className="font-medium text-sm">{label}</div>
                                        <div className="text-xs text-gray-500">{desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* React Flow */}
                <div className={`flex-1 ${showNodePanel ? 'ml-64' : ''} ${showConfig ? 'mr-80' : ''} transition-all duration-200`}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
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
                        <MiniMap />
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
                    selectedNode={selectedNode}
                    showConfig={showConfig}
                    setShowConfig={setShowConfig}
                    updateNodeData={updateNodeData}
                />
            </div>

            {/* Status Bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-2 z-10">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{nodes.length} components, {edges.length} connections</span>
                    <span>Click components to configure • Click + on edges to insert components • Use Split Outputs for parallel flows</span>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;