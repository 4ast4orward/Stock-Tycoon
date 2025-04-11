export const financialEvents = [
  {
    id: 'unexpected_expense_car',
    title: 'Car Trouble',
    description: "Your car is making strange noises and the mechanic says it needs repairs. This unexpected expense will impact your budget.",
    type: 'negative',
    options: [
      {
        id: 'pay_repairs',
        text: "Pay for the repairs immediately",
        financialImpact: {
          cash: -600,
        },
        probabilityWeight: 1,
      },
      {
        id: 'delay_repairs',
        text: "Delay the repairs and use public transportation",
        financialImpact: {
          cash: -200, // Extra transportation costs
          happiness: -10,
        },
        probabilityWeight: 1,
      },
      {
        id: 'diy_repairs',
        text: "Try to fix it yourself with online tutorials",
        financialImpact: {
          cash: -150, // Parts cost
          knowledge: 1,
        },
        probabilityWeight: 1,
      }
    ],
    triggerConditions: {
      minGameTime: 3, // At least 3 months into the game
      probability: 0.3,
    }
  },
  {
    id: 'tax_refund',
    title: 'Tax Refund',
    description: "Good news! You've received a tax refund. How will you use this unexpected money?",
    type: 'positive',
    options: [
      {
        id: 'save_refund',
        text: "Add it to your emergency fund",
        financialImpact: {
          cash: 800,
        },
        probabilityWeight: 1,
      },
      {
        id: 'invest_refund',
        text: "Invest the money",
        financialImpact: {
          cash: -800,
          assets: [
            {
              type: 'investment',
              value: 800,
              growthRate: 0.07,
            }
          ],
          knowledge: 1,
        },
        probabilityWeight: 1,
      },
      {
        id: 'spend_refund',
        text: "Treat yourself to something nice",
        financialImpact: {
          cash: 800,
          happiness: 15,
        },
        probabilityWeight: 1,
      }
    ],
    triggerConditions: {
      minGameTime: 10, // Around tax season
      maxGameTime: 14,
      probability: 0.8,
    }
  },
  // Add more events as needed
]; 