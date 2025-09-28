import type { WorkflowStep } from "./types";

// function getWalletSteps(node: any, prevStep?: any, isLastNode = false): WorkflowStep[] {
//     const steps: WorkflowStep[] = []
//     // if not first step
//     if (node.data.stepNumber != 1) {
//         steps.push({
//             app: 'FungibleToken',
//             action: 'deposit',
//             account: 'self',
//             inputToken: node.data.token,
//             outputToken: node.data.token,
//         })
//     }

//     if (!isLastNode) {
//         steps.push({
//             app: 'FungibleToken',
//             action: 'withdraw',
//             account: 'self',
//             amount: node.data.amount,
//             inputToken: node.data.token,
//             outputToken: node.data.token,
//         })
//     }
//     return steps
// }

function getWalletSourceSteps(node: any, prevStep?: any, isLastNode = false): WorkflowStep[] {
    if (prevStep && prevStep.app == 'FungibleToken' && prevStep.action == 'withdraw') {
        // ignore
        return []
    }

    return [{
        app: 'FungibleToken',
        action: 'withdraw',
        account: 'self',
        amount: node.data.amount,
        inputToken: node.data.token,
        outputToken: node.data.token,
    }]
}

function getWalletSinkSteps(node: any, prevStep?: any, isLastNode = false): WorkflowStep[] {
    if (prevStep && prevStep.app == 'FungibleToken' && prevStep.action == 'deposit') {
        // ignore
        return []
    }

    return [{
        app: 'FungibleToken',
        action: 'deposit',
        account: 'self',
        inputToken: prevStep.outputToken,
        outputToken: prevStep.outputToken,
    }]
}

function getSwapperSteps(node: any, prevStep?: any, isLastNode = false): WorkflowStep[] {
    switch (node.data.protocol) {
        case 'IncrementFi': return [{
            app: 'IncrementFi.Swapper',
            action: 'swap',
            inputToken: prevStep!.outputToken,
            outputToken: node.data.toToken,
            // TODO: add configs like slippage
        }]
        default: throw new Error(`Unknown swapper protocol: ${node.data.protocol}`)
    }
}

function getLiquidStakingSteps(node: any, prevStep?: any, isLastNode = false): WorkflowStep[] {
    switch (node.data.protocol) {
        case 'IncrementFi':
            const inputToken = prevStep!.outputToken
            if (inputToken != 'FlowToken') throw new Error(`input token for IncrementFi.LiquidStaking is expected to be FlowToken`)
            return [{
                app: 'IncrementFi.LiquidStaking',
                action: 'stake',
                inputToken,
                outputToken: node.data.outputToken,

            }]
        default: throw new Error(`Unknown swapper protocol: ${node.data.protocol}`)
    }
}

function getNodeSteps(node: any, prevStep?: any, isLastNode = false) {
    switch (node.type) {
        case 'walletSource': return getWalletSourceSteps(node, prevStep, isLastNode)
        case 'walletSink': return getWalletSinkSteps(node, prevStep, isLastNode)
        case 'swapper': return getSwapperSteps(node, prevStep, isLastNode)
        case 'liquidStaking': return getLiquidStakingSteps(node, prevStep, isLastNode)
        default: throw new Error(`Unknown node type: ${node.type}`)
    }
}

// TODO: currently workflow builder doesn't check if a step can accept the output from the previous step
export function convertNodesToSteps(nodes: any[]): WorkflowStep[] {
    const steps: WorkflowStep[] = []

    let prevStep: WorkflowStep | undefined;
    for (let i = 0; i < nodes.length; i++) {
        const nodeSteps = getNodeSteps(
            nodes[i],
            prevStep,
            i == nodes.length - 1,
        )
        steps.push(...nodeSteps)

        prevStep = steps[steps.length - 1];
    }

    return steps
}