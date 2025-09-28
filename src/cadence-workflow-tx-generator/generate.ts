import type { WorkflowStep } from "./types"

export class CadenceTxGenerator {
    public imports = new Set()
    public steps: WorkflowStep[]
    constructor(steps: WorkflowStep[]) {
        this.steps = steps
    }

    generate() {
        if (!this.steps) return null;
        // if (this.steps.length <= 1) return null;

        let tx = this.startTxBlock()

        tx += this.prepareBlock()

        tx += '\n    execute {'
        let index = 0;
        // let prevOutputType = ''
        for (const step of this.steps) {
            // TODO: currently it's assumed that the output from previous step is of expected type
            // if (index != 0 && prevOutputType != step.inputType) {
            //     throw new Error(`step(${index}) inputType mismatch, expected: ${step.inputType}, got: ${prevOutputType}`)
            // }
            // prevOutputType = step.outputType

            tx += this.processStep(step, index)
            index++;
        }
        tx += '\n    }'

        // end tx block
        tx += '\n}'

        let deps = ''
        for (const dep of this.imports) {
            deps += `import "${dep}"\n`
        }

        return deps + tx;
    }

    // tokenImports(token: string) {
    //     switch (token) {
    //         case 'FlowToken': this.imports.add('FlowToken'); break;
    //         case 'stFlowToken': this.imports.add('stFlowToken'); break;
    //         default: throw new Error(`Unknown token: ${token}`)
    //     }
    // }

    processStep(step: WorkflowStep, index: number) {
        switch (step.app) {
            case 'FungibleToken': return this.processFungibleTokenStep(step, index)
            case 'IncrementFi.Swapper': return this.processIncrementFiSwapper(step, index)
            case 'IncrementFi.LiquidStaking': return this.processIncrementFiLiquidStaking(step, index)
            default: throw new Error(`Unknown app: ${step.app}`)
        }
    }

    processIncrementFiSwapper(step: WorkflowStep, index: number) {
        this.imports.add('IncrementFiSwapConnectors')
        this.imports.add('SwapConfig')
        this.imports.add(step.inputToken)
        this.imports.add(step.outputToken)

        let prevStepOutputVar = `step_${index - 1}_output`
        let inputVault = prevStepOutputVar
        let prefix = `step_${index}`
        switch (step.action) {
            case 'swap':
                if (index == 0) throw new Error(`IncrementFi.Swapper:swap cannot be first step`)

                return `
        let ${prefix}_inputTokenKey = SwapConfig.SliceTokenTypeIdentifierFromVaultType(vaultTypeIdentifier: Type<@${step.inputToken}.Vault>().identifier)
        let ${prefix}_outputTokenKey = SwapConfig.SliceTokenTypeIdentifierFromVaultType(vaultTypeIdentifier: Type<@${step.outputToken}.Vault>().identifier)
        let ${prefix}_swapper = IncrementFiSwapConnectors.Swapper(
            path: [
                ${prefix}_inputTokenKey,
                ${prefix}_outputTokenKey
            ],
            inVault: Type<@${step.inputToken}.Vault>(),
            outVault: Type<@${step.outputToken}.Vault>(),
            uniqueID: nil
        )
        let ${prefix}_quoteOut = ${prefix}_swapper.quoteOut(${inputVault}.balance, false)
        let ${prefix}_output = ${prefix}_swapper.swap(${prefix}_quoteOut, <- ${inputVault})
        `
            default: throw new Error(`Unknown FungibleToken action: ${step.action}`)
        }
    }

    processIncrementFiLiquidStaking(step: WorkflowStep, index: number) {
        this.imports.add('LiquidStaking')

        let prevStepOutputVar = `step_${index - 1}_output`
        let prefix = `step_${index}`
        switch (step.action) {
            case 'stake':
                if (index == 0) throw new Error(`IncrementFi.LiquidStaking:stake cannot be first step`)

                return `
        let ${prefix}_output <- LiquidStaking.stake(flowVault: <- ${prevStepOutputVar})
        `
            default: throw new Error(`Unknown FungibleToken action: ${step.action}`)
        }
    }

    processFungibleTokenStep(step: WorkflowStep, index: number) {
        this.imports.add('FungibleToken')
        this.imports.add('FungibleTokenConnectors')
        this.imports.add(step.inputToken!)
        this.imports.add(step.outputToken!)

        let prevStepOutputVar = `step_${index - 1}_output`
        let prefix = `step_${index}`
        switch (step.action) {
            // Withdraw
            case 'withdraw':
                return `
        let ${prefix}_withdrawVault = ${this.getAccount(step.account!)}
            .capabilities
            .get<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(${this.getFTVaultPaths(step.inputToken!).public})
        let ${prefix}_source = FungibleTokenConnectors.VaultSource(
            min: nil,
            withdrawVault: ${prefix}_withdrawVault,
            uniqueID: nil
        )
        let ${prefix}_output <-${prefix}_source.withdrawAvailable(maxAmount: ${step.amount!} as! UFix64) as! @${step.outputToken}.Vault
        `
            default: throw new Error(`Unknown FungibleToken action: ${step.action}`)

            // Deposit
            case 'deposit':
                if (index == 0) throw new Error(`FungibleToken:deposit cannot be first step`)

                return `
        ${this.getAccount(step.account!)}.storage.save(<-${prevStepOutputVar}, to: ${this.getFTVaultPaths(step.inputToken!).storage})
        `
        }
    }

    startTxBlock() {
        return 'transaction() {\n    let signer: auth(SaveValue) &Account'
        // const inputArgs = txInputs.map(i => `${i.name}: ${i.type}`)
        // return `transaction(${inputArgs.join(', ')}) {\n    let signer: auth(SaveValue) &Account`
    }

    prepareBlock() {
        return `
    prepare(acc: auth(SaveValue) &Account) {
        self.signer = acc
    }`
    }

    getAccount(account: string) {
        if (account == 'self') return 'self.signer'
        return `getAccount(${account})`
    }

    getFTVaultPaths(token: string) {
        switch (token) {
            case 'FlowToken': return { public: '/public/flowTokenReceiver', storage: '/storage/flowTokenVault' }
            case 'stFlowToken': return { public: 'stFlowToken.tokenReceiverPath', storage: 'stFlowToken.tokenVaultPath' }
            case 'USDCFlow': return { public: 'USDCFlow.VaultPublicPath', storage: 'USDCFlow.VaultStoragePath' }
            default: throw new Error(`Unknown token: ${token}`)
        }
    }
}
