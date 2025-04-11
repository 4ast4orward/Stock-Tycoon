import { storyContent } from '../data/storyContent';

interface StoryOption {
  id: string;
  text: string;
  nextScene: string;
  financialImpact?: {
    cash?: number;
    income?: number;
    expenses?: number;
    assets?: any[];
    liabilities?: any[];
    knowledge?: number;
  };
  traitImpact?: {
    frugality?: number;
    ambition?: number;
    generosity?: number;
    workEthic?: number;
  };
  requirements?: {
    cash?: number;
    creditScore?: number;
    knowledge?: number;
    traits?: {
      [key: string]: number;
    };
  };
}

interface StoryScene {
  id: string;
  title: string;
  text: string;
  background?: string;
  options: StoryOption[];
}

interface StoryChapter {
  id: string;
  title: string;
  description: string;
  scenes: { [key: string]: StoryScene };
  requirements?: {
    previousChapters?: string[];
    gameTime?: number;
    playerState?: any;
  };
}

export class StoryEngine {
  private storyContent: { [key: string]: StoryChapter };
  
  constructor() {
    this.storyContent = storyContent;
  }
  
  getChapter(chapterId: string): StoryChapter | null {
    return this.storyContent[chapterId] || null;
  }
  
  getScene(chapterId: string, sceneId: string): StoryScene | null {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return null;
    
    return chapter.scenes[sceneId] || null;
  }
  
  getAvailableOptions(scene: StoryScene, playerState: any): StoryOption[] {
    return scene.options.filter(option => {
      if (!option.requirements) return true;
      
      // Check cash requirement
      if (option.requirements.cash && playerState.cash < option.requirements.cash) {
        return false;
      }
      
      // Check credit score requirement
      if (option.requirements.creditScore && playerState.creditScore < option.requirements.creditScore) {
        return false;
      }
      
      // Check knowledge requirement
      if (option.requirements.knowledge && playerState.financialKnowledge < option.requirements.knowledge) {
        return false;
      }
      
      // Check trait requirements
      if (option.requirements.traits) {
        for (const [trait, value] of Object.entries(option.requirements.traits)) {
          if (playerState.characterTraits[trait] < value) {
            return false;
          }
        }
      }
      
      return true;
    });
  }
  
  getNextChapters(currentChapter: string, playerState: any, gameTime: number): string[] {
    return Object.keys(this.storyContent).filter(chapterId => {
      if (chapterId === currentChapter) return false;
      
      const chapter = this.storyContent[chapterId];
      if (!chapter.requirements) return true;
      
      // Check previous chapters requirement
      if (chapter.requirements.previousChapters) {
        for (const requiredChapter of chapter.requirements.previousChapters) {
          if (!playerState.unlockedChapters.includes(requiredChapter)) {
            return false;
          }
        }
      }
      
      // Check game time requirement
      if (chapter.requirements.gameTime && gameTime < chapter.requirements.gameTime) {
        return false;
      }
      
      // Additional player state requirements could be checked here
      
      return true;
    });
  }
}

export default new StoryEngine(); 