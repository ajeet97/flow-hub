import { Handle, Position } from '@xyflow/react';

export function Node(props) {
    return (
        <div className="node">
            <div className="app">{props.data.app}</div>
            <div className="action">{props.data.action}</div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}