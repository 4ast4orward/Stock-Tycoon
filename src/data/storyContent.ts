export const storyContent = {
  beginning: {
    id: 'beginning',
    title: 'Fresh Start',
    description: 'Your journey to financial independence begins',
    scenes: {
      intro: {
        id: 'intro',
        title: 'A New Beginning',
        text: "You've just graduated from college with a degree in your chosen field. With student loans to pay and dreams to pursue, you're ready to start your financial journey. Your small apartment is modest but comfortable, and you've just landed your first job. The future is full of possibilities, but also financial challenges.",
        options: [
          {
            id: 'start_job',
            text: "Start your new job",
            nextScene: 'first_paycheck',
            financialImpact: {
              knowledge: 1,
            },
          }
        ]
      },
      first_paycheck: {
        id: 'first_paycheck',
        title: 'First Paycheck',
        text: "After two weeks at your new job, you receive your first paycheck. After taxes and deductions, it's smaller than you expected. You now need to decide how to allocate your money. Your student loan payment is due soon, and you need to cover basic expenses. How will you approach your finances?",
        options: [
          {
            id: 'budget_carefully',
            text: "Create a detailed budget to track every dollar",
            nextScene: 'budget_success',
            financialImpact: {
              knowledge: 2,
              cash: -50, // Cost of budgeting app or tools
            },
            traitImpact: {
              frugality: 2,
              workEthic: 1,
            }
          },
          {
            id: 'wing_it',
            text: "Pay the bills first and figure out the rest later",
            nextScene: 'budget_struggle',
            traitImpact: {
              frugality: -1,
            }
          },
          {
            id: 'seek_advice',
            text: "Ask a financially savvy friend for advice",
            nextScene: 'friend_advice',
            financialImpact: {
              knowledge: 1,
            },
            traitImpact: {
              ambition: 1,
            }
          }
        ]
      },
      budget_success: {
        id: 'budget_success',
        title: 'Budgeting Success',
        text: "You spend an evening setting up a detailed budget. By categorizing your expenses and setting spending limits, you gain clarity about your financial situation. Though it takes some time to set up, you feel more in control of your money. You discover you can save a small amount each month if you're careful with discretionary spending.",
        options: [
          {
            id: 'emergency_fund',
            text: "Start building an emergency fund with your savings",
            nextScene: 'building_emergency_fund',
            financialImpact: {
              knowledge: 1,
            },
            traitImpact: {
              frugality: 1,
            }
          },
          {
            id: 'pay_extra_loans',
            text: "Put extra money toward your student loans",
            nextScene: 'loan_progress',
            traitImpact: {
              frugality: 1,
              workEthic: 1,
            }
          }
        ]
      },
      budget_struggle: {
        id: 'budget_struggle',
        title: 'Financial Uncertainty',
        text: "You pay your bills as they come in, but without a clear budget, you find yourself running short before the next paycheck. One evening, you realize you need to buy groceries but have very little money left in your account. This moment of stress makes you reconsider your approach to money management.",
        options: [
          {
            id: 'start_budgeting',
            text: "Start tracking your spending and create a budget",
            nextScene: 'budget_success',
            financialImpact: {
              knowledge: 2,
            },
            traitImpact: {
              frugality: 1,
              workEthic: 1,
            }
          },
          {
            id: 'credit_card',
            text: "Apply for a credit card to help with cash flow",
            nextScene: 'credit_card_approved',
            financialImpact: {
              knowledge: 1,
            },
            traitImpact: {
              frugality: -1,
            }
          }
        ]
      },
      // Add more scenes as needed
    }
  },
  // Add more chapters as needed
}; 