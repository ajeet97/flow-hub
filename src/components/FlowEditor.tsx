import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';

import { Node } from './Node';

const nodeTypes = {
    node: Node,
};

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    {
        id: 'node-1',
        type: 'node',
        position: { x: 0, y: 200 },
        data: { app: 'MyApp', action: 'MyAction' },
    },
];
const initialEdges = [
    { id: 'n1-n2', source: 'n1', target: 'n2' },
    { id: 'n2-node-1', source: 'n2', target: 'node-1' }
];

export default function FlowEditor() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            deleteKeyCode={null}
            fitView
        >
            <Controls />
            {/* <MiniMap /> */}
            <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
    );
}
