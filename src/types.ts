export type SubjectKey = 'dashboard' | 'chinese' | 'math' | 'english' | 'plan';

export interface DailySprintTask {
  id: string;
  subject: 'chinese' | 'math' | 'english';
  subjectTitle: string;
  tag: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  examTrick: string;
  completed?: boolean;
  userSelection?: number;
}

export interface MathSolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathExpr: string;
}

export interface MathSolveResponse {
  coreConcept: string;
  formula: string;
  steps: MathSolutionStep[];
  finalAnswer: string;
  commonTraps: string[];
  quickTip: string;
  similarProblem: {
    problem: string;
    hint: string;
    answer: string;
  };
}

export interface EssayDimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface SentenceUpgrade {
  original: string;
  upgraded: string;
  rationale: string;
}

export interface EssayCritiqueResponse {
  overallScore: string;
  dimensionScores: EssayDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  sentenceUpgrades: SentenceUpgrade[];
  structureSuggestions: string;
  modelConclusion: string;
}

export interface WordNote {
  char: string;
  pinyin: string;
  meaning: string;
  usage: string;
}

export interface ChineseSentenceDissect {
  type: 'chinese_classical';
  sourceTitle?: string;
  modernTranslation: string;
  wordByWordNotes: WordNote[];
  rhetoricDevices: string[];
  examTakeaway: string;
}

export interface EnglishClause {
  type: string;
  text: string;
  explanation: string;
}

export interface EnglishVocabItem {
  word: string;
  phonetic: string;
  meaning: string;
  collocation: string;
}

export interface EnglishSentenceDissect {
  type: 'english_grammar';
  mainSubject: string;
  mainVerb: string;
  mainObject?: string;
  clauses: EnglishClause[];
  grammarPoints: string[];
  translatedChinese: string;
  vocabulary: EnglishVocabItem[];
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  examTrick: string;
}

export interface ErrorBookItem {
  id: string;
  subject: 'chinese' | 'math' | 'english';
  topic: string;
  question: string;
  wrongAnswer: string;
  correctAnswer: string;
  reason: '粗心計算' | '觀念不熟' | '題意誤解' | '公式記憶模糊' | '時間不夠';
  note: string;
  timestamp: number;
  mastered: boolean;
}

export interface StudyStrategySubject {
  focus: string;
  actionItems: string[];
  expectedGain: string;
}

export interface DiagnosticPlanResponse {
  diagnosticSummary: string;
  subjectStrategies: {
    chinese: StudyStrategySubject;
    math: StudyStrategySubject;
    english: StudyStrategySubject;
  };
  weeklySchedule: {
    day: string;
    routine: string[];
  }[];
  mindsetTip: string;
}

export interface Grade11ExamQuestion {
  id: string;
  subject: 'chinese' | 'math' | 'english';
  unit: string;
  examSource: string;
  difficulty: '基礎概念' | '進階應用' | '頂標挑戰';
  allocatedMinutes?: number;
  hint?: string;
  question: string;
  options: string[];
  correctIndex: number;
  coreConcept: string;
  fullSolution: {
    analysis: string;
    steps: string[];
    answerNote: string;
  };
  commonTraps: string;
  speedTrick: string;
}
