export interface TableData {
  id: number;
  descriptor: string;
  deadline: string;
  refreshRate: number;
  eventStream: string;
  percentage: number;
  downPayment: number;
  creator: string;
  finalApplicant: string;
  applicantSigned: boolean;
  creatorSigned: boolean;
  workSubmitted: boolean;
  finalSign: boolean;
}

export interface TableHeaders {
  text: string;
  value: keyof TableData | ApplicationStages;
}

export type ApplicationStages =
  | "applyForJob"
  | "chooseApplicant"
  | "initApplicantSign"
  | "initCreatorSign"
  | "submitWork"
  | "finalSign";
