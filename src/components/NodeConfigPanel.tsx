import {
    MarkerType,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Percent } from 'lucide-react';

export const ConfigPanel = ({
    nodes,
    setNodes,
    setEdges,
    nodeCounter,
    setNodeCounter,
    getDefaultNodeData,
    selectedNode,
    showConfig,
    setShowConfig,
    updateNodeData,
}) => {
    if (!selectedNode || !showConfig) return null;

    const nodeData = selectedNode.data;
    const nodeType = selectedNode.type;


    // const addMultipleOutputs = (sourceNodeId) => {
    //     const targetCount = parseInt(prompt('How many outputs do you want?') || '2');
    //     if (targetCount > 1) {
    //         // Remove existing edges from this source
    //         setEdges(eds => eds.filter(e => e.source !== sourceNodeId));

    //         // Add multiple nodes with percentage splits
    //         const percentagePerOutput = Math.floor(100 / targetCount);
    //         let remainingPercentage = 100;
    //         const sourceNode = nodes.find(n => n.id === sourceNodeId);

    //         for (let i = 0; i < targetCount; i++) {
    //             const isLast = i === targetCount - 1;
    //             const percentage = isLast ? remainingPercentage : percentagePerOutput;
    //             remainingPercentage -= percentage;

    //             const newId = `${nodeCounter + i + 1}`;
    //             const newStepNumber = sourceNode.data.stepNumber + 1;

    //             const newNode = {
    //                 id: newId,
    //                 type: 'swapper', // Default type
    //                 position: {
    //                     x: 300 + (i * 200) - ((targetCount - 1) * 100),
    //                     y: sourceNode.position.y + 150
    //                 },
    //                 data: { ...getDefaultNodeData('swapper'), stepNumber: newStepNumber },
    //                 draggable: false,
    //                 sourcePosition: Position.Bottom,
    //                 targetPosition: Position.Top,
    //             };

    //             const newEdge = {
    //                 id: `e${sourceNodeId}-${newId}`,
    //                 source: sourceNodeId,
    //                 target: newId,
    //                 markerEnd: { type: MarkerType.ArrowClosed },
    //                 style: { strokeWidth: 2 },
    //                 data: { percentage: percentage },
    //                 label: `${percentage}%`,
    //             };

    //             setNodes(nds => [...nds, newNode]);
    //             setEdges(eds => [...eds, newEdge]);
    //         }

    //         setNodeCounter(prev => prev + targetCount);
    //     }
    // };

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-20 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Configure Component</h3>
                    <button
                        onClick={() => setShowConfig(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {nodeType === 'wallet' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                value={nodeData.amount || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { amount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                            <select
                                value={nodeData.token || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { token: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="FlowToken">FlowToken</option>
                                <option value="USDCFlow">USDCFlow</option>
                                <option value="stFlowToken">stFlowToken</option>
                            </select>
                        </div>
                    </>
                )}

                {nodeType === 'swapper' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                            <select
                                value={nodeData.protocol || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { protocol: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="IncrementFi">IncrementFi</option>
                                <option value="Some Other Protocol">Some Other Protocol</option>
                            </select>
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Token</label>
                            <select
                                value={nodeData.fromToken || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { fromToken: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="FlowToken">FlowToken</option>
                                <option value="USDCFlow">USDCFlow</option>
                                <option value="stFlowToken">stFlowToken</option>
                            </select>
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Token</label>
                            <select
                                value={nodeData.toToken || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { toToken: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="FlowToken">FlowToken</option>
                                <option value="USDCFlow">USDCFlow</option>
                                <option value="stFlowToken">stFlowToken</option>
                            </select>
                        </div>
                    </>
                )}

                {nodeType === 'liquidStaking' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                            <select
                                value={nodeData.protocol || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { protocol: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="IncrementFi">IncrementFi</option>
                                <option value="Some Other Protocol">Some Other Protocol</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Token</label>
                            <select
                                value={nodeData.outputToken || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { outputToken: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {/* <option value="FlowToken">FlowToken</option>
                                <option value="USDCFlow">USDCFlow</option> */}
                                <option value="stFlowToken">stFlowToken</option>
                            </select>
                        </div>
                    </>
                )}

                {nodeType === 'lending' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                            <select
                                value={nodeData.action || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { action: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="lend">Lend</option>
                                <option value="borrow">Borrow</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                            <select
                                value={nodeData.protocol || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { protocol: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="IncrementFi">IncrementFi</option>
                                <option value="Some Other Protocol">Some Other Protocol</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                            <select
                                value={nodeData.token || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { token: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="FlowToken">FlowToken</option>
                                <option value="USDCFlow">USDCFlow</option>
                                <option value="stFlowToken">stFlowToken</option>
                            </select>
                        </div>
                        {nodeData.action === 'borrow' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Percentage</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={nodeData.amount || ''}
                                    onChange={(e) => updateNodeData(selectedNode.id, { amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}
                    </>
                )}

                {nodeType === 'loop' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Iterations</label>
                            <input
                                type="number"
                                min="1"
                                value={nodeData.iterations || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { iterations: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loop Target Node</label>
                            <select
                                value={nodeData.targetNodeId || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, { targetNodeId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select target node</option>
                                {nodes.filter(n => n.id !== selectedNode.id).map(node => (
                                    <option key={node.id} value={node.id}>
                                        Node {node.id} ({node.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={() => addMultipleOutputs(selectedNode.id)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Percent className="w-4 h-4" />
                        Split Outputs
                    </button>
                </div> */}
            </div>
        </div>
    );
};