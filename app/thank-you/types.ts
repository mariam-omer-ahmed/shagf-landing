export type PackageKey =
  | "bousola"
  | "intilaqah"
  | "tamkeen";

export interface PackageData {
  key: PackageKey;

  name: string;

  headline: string;

  shortDescription: string;

  diagnosis: string;

  whyThisPackage: string;

  nextStep: string;

  color: string;
}

export interface ObjectionItem {
  question: string;

  belief: string;

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