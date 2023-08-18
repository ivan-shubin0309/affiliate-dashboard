import type { MetaInfo } from "@/utils/zod-meta";
import { filter, map, uniq, uniqBy } from "rambda";

export type WizardLayout = "none" | "steps";

export interface StepInfo {
  name: string;
  title?: string;
  subTitle?: string;
  code: string;
  layout: WizardLayout;
}

export const collectStepInfo = (
  steps: Record<string, MetaInfo>
): StepInfo[] => {
  const stepsInfo: StepInfo[] = [];

  let codeIdx = 0;
  let subCodeIdx = 0;
  let lastName: string | undefined = undefined;
  let lastSub: string | undefined = undefined;
  Object.values(steps).forEach((step) => {
    const stepInfo = step.meta?.stepInfo;
    if (stepInfo && stepInfo !== "none") {
      const { name, sub } = stepInfo;
      if (name && name !== lastName) {
        codeIdx++;
        subCodeIdx = 0;
        lastName = name;
      }
      lastSub = sub;
    }

    subCodeIdx++;
    stepsInfo.push({
      name: step.name,
      title: lastName,
      subTitle: lastSub,
      code: `${codeIdx}-${subCodeIdx}`,
      layout: stepInfo === "none" ? "none" : "steps",
    });
  });

  // console.log(`mulycollectStepInfo:`, { steps, stepsInfo });

  return stepsInfo;
};

export const getStepByCode = (
  stepsInfo: StepInfo[],
  stepCode: string
): StepInfo => {
  const step = stepsInfo.find(({ code }) => code === stepCode);
  if (!step) {
    throw new Error(`Step not found ${stepCode}`);
  }

  return step;
};

interface StepStatus {
  title: string;
  status: "done" | "current" | "next";
}

export const getStepInfoTitles = (
  stepsInfo: StepInfo[],
  stepCode: string
): StepStatus[] => {
  let status: StepStatus["status"] = "next";
  const stepStatus: StepStatus[] = [];
  const unique: Record<string, number> = {};
  stepsInfo.forEach((step) => {
    if (step.title && !unique[step.title]) {
      stepStatus.push({ title: step.title, status });
      unique[step.title] = 1;
    }
    if (step.code === stepCode) {
      const lastStep = stepStatus[stepStatus.length - 1];
      if (lastStep) {
        lastStep.status = "done";
      }
      status = "next";
    }
  });

  return stepStatus;
};

export const getStepInfoSubTitles = (
  stepsInfo: StepInfo[],
  stepCode: string
): StepStatus[] => {
  const step = getStepByCode(stepsInfo, stepCode);

  let status: StepStatus["status"] = "next";
  const stepStatus: StepStatus[] = [];
  const unique: Record<string, number> = {};
  stepsInfo
    .filter(({ title }) => title === step.title)
    .forEach((step) => {
      if (step.subTitle && !unique[step.subTitle]) {
        stepStatus.push({ title: step.subTitle, status });
        unique[step.subTitle] = 1;
      }
      if (step.code === stepCode) {
        const lastStep = stepStatus[stepStatus.length - 1];
        if (lastStep) {
          lastStep.status = "done";
        }
        status = "next";
      }
    });

  return stepStatus;
};

export const backDisabled = (stepsInfo: StepInfo[], stepCode: string) =>
  stepsInfo[0]?.code === stepCode;
