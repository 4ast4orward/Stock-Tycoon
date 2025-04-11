export class FinancialEngine {
  calculateNetWorth(playerState: any): number {
    const assetsValue = playerState.assets.reduce((total: number, asset: any) => total + asset.value, 0);
    const liabilitiesValue = playerState.liabilities.reduce((total: number, liability: any) => total + liability.amount, 0);
    
    return playerState.cash + assetsValue - liabilitiesValue;
  }
  
  calculateMonthlyIncome(incomes: any[]): number {
    return incomes.reduce((total: number, income: any) => {
      switch (income.frequency) {
        case 'weekly': return total + income.amount * 4.33;
        case 'biweekly': return total + income.amount * 2.17;
        case 'monthly': return total + income.amount;
        case 'annually': return total + income.amount / 12;
        default: return total;
      }
    }, 0);
  }
  
  calculateMonthlyExpenses(expenses: any[]): number {
    return expenses.reduce((total: number, expense: any) => {
      switch (expense.frequency) {
        case 'weekly': return total + expense.amount * 4.33;
        case 'biweekly': return total + expense.amount * 2.17;
        case 'monthly': return total + expense.amount;
        case 'annually': return total + expense.amount / 12;
        default: return total;
      }
    }, 0);
  }
  
  calculateMonthlyCashFlow(playerState: any): number {
    const monthlyIncome = this.calculateMonthlyIncome(playerState.incomes);
    const monthlyExpenses = this.calculateMonthlyExpenses(playerState.expenses);
    
    return monthlyIncome - monthlyExpenses;
  }
  
  calculateDebtToIncomeRatio(playerState: any): number {
    const monthlyDebtPayments = playerState.liabilities.reduce(
      (total: number, liability: any) => total + liability.minimumPayment, 
      0
    );
    const monthlyIncome = this.calculateMonthlyIncome(playerState.incomes);
    
    return monthlyIncome > 0 ? monthlyDebtPayments / monthlyIncome : 0;
  }
  
  calculateEmergencyFundMonths(playerState: any): number {
    const monthlyExpenses = this.calculateMonthlyExpenses(playerState.expenses);
    
    return monthlyExpenses > 0 ? playerState.cash / monthlyExpenses : 0;
  }
  
  calculateInvestmentReturns(asset: any, months: number): number {
    return asset.value * (Math.pow(1 + asset.growthRate / 12, months) - 1);
  }
  
  calculateLoanPayoff(liability: any, extraPayment: number): number {
    if (extraPayment <= 0) return 0;
    
    let balance = liability.amount;
    let monthlyInterestRate = liability.interestRate / 12;
    let monthlyPayment = liability.minimumPayment + extraPayment;
    let months = 0;
    
    while (balance > 0 && months < 360) { // Cap at 30 years
      let interest = balance * monthlyInterestRate;
      let principal = Math.min(monthlyPayment, balance + interest);
      
      balance = balance + interest - principal;
      months++;
    }
    
    return months;
  }
  
  applyDecisionImpact(playerState: any, impact: any): any {
    const updatedState = { ...playerState };
    
    if (impact.cash) {
      updatedState.cash += impact.cash;
    }
    
    if (impact.income) {
      // Handle income changes
    }
    
    if (impact.expenses) {
      // Handle expense changes
    }
    
    if (impact.assets) {
      // Handle asset changes
    }
    
    if (impact.liabilities) {
      // Handle liability changes
    }
    
    return updatedState;
  }
}

export default new FinancialEngine(); 