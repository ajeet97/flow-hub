import fs from 'fs'
import workflow from './workflows/1.js'

const imports = new Set()

function startTxBlock(txInputs) {
    const inputArgs = txInputs.map(i => `${i.name}: ${i.type}`)
    return `transaction(${inputArgs.join(', ')}) {\n    let signer: auth(SaveValue) &Account`
}

function prepareBlock(steps) {
    return `
    prepare(acc: auth(SaveValue) &Account) {
        self.signer = acc
    }`
}

function getAccount(account) {
    if (account == 'self') return 'self.signer'
    return `getAccount(${account})`
}

function getFTVaultPublicPath(token) {
    switch (token) {
        case 'FlowToken':
            imports.add('FlowToken')
            return '/public/flowTokenReceiver'
        default: throw new Error(`Unknown token: ${token}`)
    }
}

// function withdrawFT(token) {
//     switch (token) {
//         case 'FlowToken':
//             imports.add('FlowToken')
//             return 'withdrawAvailable(maxAmount: amount) as! @FlowToken.Vault'
//         default: throw new Error(`Unknown token: ${token}`)
//     }
// }

function processFungibleTokenStep(step, index) {
    imports.add('FungibleToken')
    imports.add('FungibleTokenConnectors')

    let prefix = `step_${index}`
    switch (step.action) {
        case 'withdraw':
            return `
        let ${prefix}_acc = ${getAccount(step.account)}
        let ${prefix}_withdrawVault = ${prefix}_acc
            .capabilities
            .get<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(${getFTVaultPublicPath(step.token)})
        let ${prefix}_source = FungibleTokenConnectors.VaultSource(
            min: nil,
            withdrawVault: ${prefix}_withdrawVault,
            uniqueID: nil
        )
        let ${prefix}_output <-${prefix}_source.withdrawAvailable(maxAmount: ${step.input} as! UFix64)`
        default: throw new Error(`Unknown FungibleToken action: ${step.action}`)
    }
}

function processIncrementFiLiquidStaking(step, index) {
    if (index == 0) throw new Error(`IncrementFi.LiquidStaking cannot be first step`)

    imports.add('LiquidStaking')

    let prevStepOutputVar = `step_${index - 1}_output`
    let prefix = `step_${index}`
    switch (step.action) {
        case 'stake':
            return `
        let ${prefix}_output <- LiquidStaking.stake(flowVault: <- ${prevStepOutputVar} as! @${step.inputType})`
        default: throw new Error(`Unknown FungibleToken action: ${step.action}`)
    }
}

function processStep(step, index) {
    switch (step.app) {
        case 'FungibleToken': return processFungibleTokenStep(step, index)
        case 'IncrementFi.LiquidStaking': return processIncrementFiLiquidStaking(step, index)
        default: throw new Error(`Unknown app: ${step.app}`)
    }
}

function generate() {
    if (!workflow.steps) return null;
    // if (workflow.steps.length <= 1) return null;

    let tx = startTxBlock(workflow.inputs ?? [])

    tx += prepareBlock(workflow.steps)

    tx += '\n    execute {'
    let index = 0;
    for (const step of workflow.steps) {
        tx += processStep(step, index)
        index++;
    }
    tx += '\n    }'

    // end tx block
    tx += '\n}'

    let deps = ''
    for (const dep of imports) {
        deps += `import "${dep}"\n`
    }

    return deps + tx;
}

fs.writeFileSync('tx.cdc', generate())