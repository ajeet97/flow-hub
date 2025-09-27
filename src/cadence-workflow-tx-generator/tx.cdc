import "FungibleToken"
import "FungibleTokenConnectors"
import "FlowToken"
import "LiquidStaking"
transaction() {
    let signer: auth(SaveValue) &Account
    prepare(acc: auth(SaveValue) &Account) {
        self.signer = acc
    }
    execute {
        let step_0_acc = self.signer
        let step_0_withdrawVault = step_0_acc
            .capabilities
            .get<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(/public/flowTokenReceiver)
        let step_0_source = FungibleTokenConnectors.VaultSource(
            min: nil,
            withdrawVault: step_0_withdrawVault,
            uniqueID: nil
        )
        let step_0_output <-step_0_source.withdrawAvailable(maxAmount: 100 as! UFix64)
        let step_1_output <- LiquidStaking.stake(flowVault: <- step_0_output as! @FlowToken.Vault)
    }
}