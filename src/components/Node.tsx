import { Handle, Position } from '@xyflow/react';

export function Node(props) {
    return (
        <div className="node">
            <div className="app">App</div>
            <div className="action">Action</div>
            <Handle type="source" position={Position.Top} />
            <Handle type="target" position={Position.Bottom} />
        </div>
    );
}