import { Plus } from 'lucide-react';

// Custom edge component with plus button
export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, onEdgeClick }) {
    const edgePath = `M${sourceX},${sourceY}L${targetX},${targetY}`;
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    return (
        <g>
            <path
                id={id}
                d={edgePath}
                stroke="#64748b"
                strokeWidth={2}
                markerEnd="url(#arrow)"
            />
            <circle
                cx={centerX}
                cy={centerY}
                r="12"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => onEdgeClick?.(id)}
            />
            <Plus
                x={centerX - 6}
                y={centerY - 6}
                width="12"
                height="12"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
            />
        </g>
    );
};