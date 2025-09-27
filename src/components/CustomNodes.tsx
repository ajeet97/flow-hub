import { Clock, RotateCcw } from 'lucide-react';

// Enhanced node components with handle positioning
export const WalletNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-blue-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-blue-500' : 'border-blue-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-800">{data.stepNumber}. Wallet</span>
        </div>
        <div className="mt-2 text-sm text-blue-600">
            <div>Amount: {data.amount || '100'} {data.token || 'FLOW'}</div>
        </div>
    </div>
);

export const SwapperNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-green-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-green-500' : 'border-green-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800">{data.stepNumber}. Swapper</span>
        </div>
        <div className="mt-2 text-sm text-green-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            <div>{data.fromToken || 'FLOW'} → {data.toToken || 'USDC'}</div>
        </div>
    </div>
);

export const LiquidStakingNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-purple-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-purple-500' : 'border-purple-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium text-purple-800">{data.stepNumber}. Liquid Staking</span>
        </div>
        <div className="mt-2 text-sm text-purple-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            <div>{data.inputToken || 'FLOW'} → {data.outputToken || 'stFLOW'}</div>
        </div>
    </div>
);

export const LendingNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-yellow-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-yellow-500' : 'border-yellow-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium text-yellow-800">
                {data.stepNumber}. {data.action === 'borrow' ? 'Borrowing' : 'Lending'}
            </span>
        </div>
        <div className="mt-2 text-sm text-yellow-600">
            <div>Protocol: {data.protocol || 'IncrementFi'}</div>
            <div>Token: {data.token || 'USDC'}</div>
            {data.action === 'borrow' && <div>Amount: {data.amount || '90'}%</div>}
        </div>
    </div>
);

export const FlashLoanNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-red-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-red-500' : 'border-red-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">{data.stepNumber}. Flash Loan</span>
        </div>
        <div className="mt-2 text-sm text-red-600">
            <div>Protocol: {data.protocol || 'Some Protocol'}</div>
            <div>Token: {data.token || 'FLOW'}</div>
        </div>
    </div>
);

export const PriceNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-gray-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-gray-500' : 'border-gray-300'
        }`}>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="font-medium text-gray-800">{data.stepNumber}. Price Oracle</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
            <div>Source: {data.source || 'Some Oracle'}</div>
            <div>Pair: {data.pair || 'FLOW/USDC'}</div>
        </div>
    </div>
);

export const LoopNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-indigo-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-indigo-500' : 'border-indigo-300'
        }`}>
        <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-800">{data.stepNumber}. Loop Start</span>
        </div>
        <div className="mt-2 text-sm text-indigo-600">
            <div>Iterations: {data.iterations || '3'}</div>
            <div>Target: {data.targetNodeId || 'Select target'}</div>
        </div>
    </div>
);

export const ScheduleNode = ({ data, selected }) => (
    <div className={`px-4 py-3 bg-orange-100 border-2 rounded-lg shadow-md min-w-[180px] ${selected ? 'border-orange-500' : 'border-orange-300'
        }`}>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-orange-800">{data.stepNumber}. Schedule</span>
        </div>
        <div className="mt-2 text-sm text-orange-600">
            <div>Frequency: {data.frequency || 'Weekly'}</div>
        </div>
    </div>
);