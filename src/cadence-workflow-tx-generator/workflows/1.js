module.exports = {
    steps: [
        {
            app: 'FungibleToken',
            action: 'withdraw',
            token: 'FlowToken',
            account: 'self',
            input: 100, // user input for first step
            outputType: 'FungibleToken.Vault'
        },
        {
            app: 'IncrementFi.LiquidStaking',
            action: 'stake',
            inputType: 'FlowToken.Vault',
            outputType: 'stFlowToken.Vault',
        },
        {
            app: 'FungibleToken',
            action: 'deposit',
            token: 'stFlowToken',
            address: 'self',
            inputType: 'FungibleToken.Vault',
            outputType: 'FungibleToken.Vault'
        }
    ]
}