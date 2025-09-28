export interface WorkflowStep {
    app: string,
    action: string,
    account?: string,
    amount?: number,
    inputToken: string,
    outputToken: string,
}
