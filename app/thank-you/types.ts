export type PackageKey = "bousola" | "intilaqah" | "tamkeen";

export interface PackageData {
  key: PackageKey;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;

  nextStep: string;
  estimatedTime: string;

  points: string[];
}

export interface ObjectionItem {
  question: string;
  reality: string;
  answer: string;
}

export interface TransformationItem {
  before: string;
  after: string;
}

export interface TimelineStep {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}