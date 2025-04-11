import { financialEvents } from '../data/financialEvents';

interface EventOption {
  id: string;
  text: string;
  financialImpact: any;
  probabilityWeight: number;
}

interface FinancialEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  options: EventOption[];
  triggerConditions?: {
    minGameTime?: number;
    maxGameTime?: number;
    minCash?: number;
    maxCash?: number;
    requiredAssets?: string[];
    requiredLiabilities?: string[];
    probability: number;
  };
}

export class EventEngine {
  private events: FinancialEvent[];
  
  constructor() {
    this.events = financialEvents;
  }
  
  getEligibleEvents(playerState: any, gameTime: number): FinancialEvent[] {
    return this.events.filter(event => {
      if (!event.triggerConditions) return true;
      
      const conditions = event.triggerConditions;
      
      // Check game time conditions
      if (conditions.minGameTime && gameTime < conditions.minGameTime) return false;
      if (conditions.maxGameTime && gameTime > conditions.maxGameTime) return false;
      
      // Check cash conditions
      if (conditions.minCash && playerState.cash < conditions.minCash) return false;
      if (conditions.maxCash && playerState.cash > conditions.maxCash) return false;
      
      // Check asset conditions
      if (conditions.requiredAssets) {
        const playerAssetTypes = playerState.assets.map((asset: any) => asset.type);
        for (const assetType of conditions.requiredAssets) {
          if (!playerAssetTypes.includes(assetType)) return false;
        }
      }
      
      // Check liability conditions
      if (conditions.requiredLiabilities) {
        const playerLiabilityTypes = playerState.liabilities.map((liability: any) => liability.type);
        for (const liabilityType of conditions.requiredLiabilities) {
          if (!playerLiabilityTypes.includes(liabilityType)) return false;
        }
      }
      
      return true;
    });
  }
  
  generateRandomEvent(playerState: any, gameTime: number): FinancialEvent | null {
    const eligibleEvents = this.getEligibleEvents(playerState, gameTime);
    if (eligibleEvents.length === 0) return null;
    
    // Calculate total probability
    const totalProbability = eligibleEvents.reduce(
      (sum, event) => sum + (event.triggerConditions?.probability || 1), 
      0
    );
    
    // Generate random number
    const random = Math.random() * totalProbability;
    
    // Select event based on probability
    let cumulativeProbability = 0;
    for (const event of eligibleEvents) {
      cumulativeProbability += event.triggerConditions?.probability || 1;
      if (random <= cumulativeProbability) {
        return event;
      }
    }
    
    return eligibleEvents[0]; // Fallback
  }
  
  getEventOptions(event: FinancialEvent, playerState: any): EventOption[] {
    // Could filter options based on player state if needed
    return event.options;
  }
}

export default new EventEngine(); 