import { Handle, Position } from '@xyflow/react';
import { Clock, RotateCcw } from 'lucide-react';

const CustomNode = ({ children, bgColor, selected }) => {
    // can't directly create dynamic class using props
    // https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names
    const colorVariants: { [bg: string]: string } = {
        blue: `bg-blue-100 ${selected ? 'border-blue-500' : 'border-blue-300'}`,
        pink: `bg-pink-100 ${selected ? 'border-pink-500' : 'border-pink-300'}`,
        green: `bg-green-100 ${selected ? 'border-green-500' : 'border-green-300'}`,
        purple: `bg-purple-100 ${selected ? 'border-purple-500' : 'border-purple-300'}`,
        yellow: `bg-yellow-100 ${selected ? 'border-yellow-500' : 'border-yellow-300'}`,
        red: `bg-red-100 ${selected ? 'border-red-500' : 'border-red-300'}`,
        gray: `bg-gray-100 ${selected ? 'border-gray-500' : 'border-gray-300'}`,
        indigo: `bg-indigo-100 ${selected ? 'border-indigo-500' : 'border-indigo-300'}`,
        orange: `bg-orange-100 ${selected ? 'border-orange-500' : 'border-orange-300'}`,
    }
    return (
        <div className={`px-4 py-3 border-2 rounded-lg shadow-md min-w-[180px] ${colorVariants[bgColor]}`}>
            {children}
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}

export const WalletSourceNode = ({ data, selected }) => (
    <CustomNode bgColor='blue' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-800">{data.stepNumber}. Wallet Source</span>
        </div>
        <div className="mt-2 text-sm text-blue-600">
            <div>Amount: {data.amount || '100'} {data.token || 'FlowToken'}</div>
        </div>
    </CustomNode>
);

export const WalletSinkNode = ({ data, selected }) => (
    <CustomNode bgColor='pink' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="font-medium text-pink-800">{data.stepNumber}. Wallet Sink</span>
        </div>
    </CustomNode>
);

// export const WalletNode = ({ data, selected }) => (
//     <CustomNode bgColor='blue' selected={selected}>
//         <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//             <span className="font-medium text-blue-800">{data.stepNumber}. Wallet</span>
//         </div>
//         <div className="mt-2 text-sm text-blue-600">
//             <div>Amount: {data.amount || '100'} {data.token || 'FlowToken'}</div>
//         </div>
//     </CustomNode>
// );

export const SwapperNode = ({ data, selected }) => (
    <CustomNode bgColor='green' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800">{data.stepNumber}. Swapper</span>
        </div>
        <div className="mt-2 text-sm text-green-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            {/* <div>{data.fromToken || 'FlowToken'} → {data.toToken || 'USDCFlow'}</div> */}
            <div>to {data.toToken || 'USDCFlow'}</div>
        </div>
    </CustomNode>
);

export const LiquidStakingNode = ({ data, selected }) => (
    <CustomNode bgColor='purple' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium text-purple-800">{data.stepNumber}. Liquid Staking</span>
        </div>
        <div className="mt-2 text-sm text-purple-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            <div>{data.outputToken || 'stFlowToken'}</div>
        </div>
    </CustomNode>
);

export const LendingNode = ({ data, selected }) => (
    <CustomNode bgColor='yellow' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium text-yellow-800">
                {data.stepNumber}. {data.action === 'borrow' ? 'Borrowing' : 'Lending'}
            </span>
        </div>
        <div className="mt-2 text-sm text-yellow-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            <div>Token: {data.token || 'USDCFlow'}</div>
            {data.action === 'borrow' && <div>Amount: {data.amount || '90'}%</div>}
        </div>
    </CustomNode>
);

export const FlashLoanNode = ({ data, selected }) => (
    <CustomNode bgColor='red' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">{data.stepNumber}. Flash Loan</span>
        </div>
        <div className="mt-2 text-sm text-red-600">
            <div>Protocol: {data.protocol || 'Some Protocol'}</div>
            <div>Token: {data.token || 'FlowToken'}</div>
        </div>
    </CustomNode>
);

export const PriceNode = ({ data, selected }) => (
    <CustomNode bgColor='gray' selected={selected}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="font-medium text-gray-800">{data.stepNumber}. Price Oracle</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
            <div>Source: {data.source || 'Some Oracle'}</div>
            <div>Pair: {data.pair || 'FlowToken/USDCFlow'}</div>
        </div>
    </CustomNode>
);

export const LoopNode = ({ data, selected }) => (
    <CustomNode bgColor='indigo' selected={selected}>
        <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-800">{data.stepNumber}. Loop Start</span>
        </div>
        <div className="mt-2 text-sm text-indigo-600">
            <div>Iterations: {data.iterations || '3'}</div>
            <div>Target: {data.targetNodeId || 'Select target'}</div>
        </div>
    </CustomNode>
);

export const ScheduleNode = ({ data, selected }) => (
    <CustomNode bgColor='orange' selected={selected}>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-orange-800">{data.stepNumber}. Schedule</span>
        </div>
        <div className="mt-2 text-sm text-orange-600">
            <div>Frequency: {data.frequency || 'Weekly'}</div>
        </div>
    </CustomNode>
);