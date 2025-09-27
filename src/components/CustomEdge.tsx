import { Plus } from 'lucide-react';

import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    // useReactFlow,
    type EdgeProps,
} from '@xyflow/react';

export function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    onEdgeClick,
}) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    className="button-edge__label nodrag nopan"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        textAlign: 'center',
                    }}
                >
                    {/* <button className="button-edge__button" onClick={onEdgeClick}>
                        <Plus
                            x={centerX - 6}
                            y={centerY - 6}
                            width="24"
                            height="24"
                            stroke="gray"
                            strokeWidth="3"
                            style={{
                                pointerEvents: 'none',
                                backgroundColor: '#fff',
                                border: '2px solid gray',
                                borderRadius: '50%'
                            }}
                        />
                    </button> */}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}


// // Custom edge component with plus button
// export function CustomEdge2({ id, sourceX, sourceY, targetX, targetY, onEdgeClick }) {
//     const edgePath = `M${sourceX},${sourceY}L${targetX},${targetY}`;
//     const centerX = (sourceX + targetX) / 2;
//     const centerY = (sourceY + targetY) / 2;

//     return (
//         <g>
//             <path
//                 id={id}
//                 d={edgePath}
//                 stroke="#64748b"
//                 strokeWidth={2}
//                 markerEnd="url(#arrow)"
//             />
//             <circle
//                 cx={centerX}
//                 cy={centerY}
//                 r="12"
//                 fill="#3b82f6"
//                 stroke="#ffffff"
//                 strokeWidth="2"
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => onEdgeClick?.(id)}
//             />
//             <Plus
//                 x={centerX - 6}
//                 y={centerY - 6}
//                 width="12"
//                 height="12"
//                 stroke="#ffffff"
//                 strokeWidth="2"
//                 style={{ pointerEvents: 'none' }}
//             />
//         </g>
//     );
// };