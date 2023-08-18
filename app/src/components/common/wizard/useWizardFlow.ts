import { z } from "zod";
import { useRouter } from "next/router";
import type React from "react";
import { useMemo, useState } from "react";
import type {
  MetaInfo,
  ControlCallback,
  ZodMetaDataItem,
} from "../../../utils/zod-meta";
import { getZodMetaInfo } from "../../../utils/zod-meta";
import type { ZodEffects } from "zod";
import type { TranslationFn } from "../../../utils/i18n-utils";
import { translateSchemaInfo } from "../../../utils/i18n-utils";
import { useQueryState } from "next-usequerystate";
import type { ZodTypeAny } from "zod/lib/types";
import { map } from "rambda";
import type { FormContext } from "@/components/libs/react-ts-form/FieldContext";
import type { StepInfo } from "@/components/common/wizard/steps-info";
import { collectStepInfo } from "@/components/common/wizard/steps-info";

// type CustomRefMap = Record<string, () => Promise<any>>;
// export type CustomControlDef = (props: WizardControlProps) => React.ReactNode;
// export type CustomControlDefMap = { [key: string]: CustomControlDef };

export const getPagesZodMetaInfo = (
  wizardPagesDefinition: WizardPagesDefinition
): MetaInfo => {
  const { pages, description, name, ...meta } = wizardPagesDefinition;
  return {
    meta: { label: description, ...meta },
    children: map((page, name) => getZodMetaInfo(page, name), pages),
    typeName: name || "wizard",
    name: name || "wizard",
    type: z.undefined(),
  };
};

interface UseWizardFlowOptions {
  onCompleteUrl: string;

  translate: TranslationFn;

  recordData?: any;
}

export interface WizardPagesDefinition {
  pages: Record<string, ZodTypeAny>;

  description: string | ControlCallback;
  text?: Record<string, string>;

  name: string;

  ns: string;
}

export const useWizardFlow = (
  pagesDefinition: WizardPagesDefinition,
  options: UseWizardFlowOptions,
  props?: Record<string, unknown>
) => {
  // console.log(`muly:useWizardFlow`, { options });
  const router = useRouter();

  const { steps, meta, stepsInfo } = useMemo(() => {
    const stepsRaw = getPagesZodMetaInfo(pagesDefinition);
    const steps = translateSchemaInfo(
      stepsRaw,
      options.translate,
      pagesDefinition.name
    );
    const { children, meta } = steps;
    return {
      steps: Object.values(children || {}),
      meta,
      stepsInfo: children ? collectStepInfo(children) : [],
    };
  }, [options.translate, pagesDefinition]);

  const stepCode0 = stepsInfo[0]?.code || "";

  const [currentStepCode, setCurrentStepCode] = useQueryState<string>("step", {
    history: "push",
    parse: (val: string) => (val ? val : stepCode0),
    defaultValue: props?.step ? String(props?.step) : stepCode0,
  });

  if (!steps) {
    throw new Error("No steps found");
  }

  if (steps.length !== stepsInfo.length) {
    throw new Error(`Mismatch in step length`);
  }

  const stepIdx = stepsInfo.findIndex(
    ({ code }: StepInfo) => code === currentStepCode
  );

  const stepCount = steps.length;
  const step: MetaInfo | undefined = steps[Math.max(0, stepIdx)];

  if (!step /*|| stepIdx < 0*/) {
    throw new Error(
      `Unexpected state currentStep v2: ${currentStepCode}/${stepCount} ${stepCode0} ${stepsInfo.findIndex(
        ({ code }: StepInfo) => code === (currentStepCode || stepCode0)
      )}`
    );
  }

  const control: ControlCallback | undefined =
    step.meta.control && typeof step.meta.control === "function"
      ? step.meta.control
      : undefined;

  // const [stepRange, setStepRangeValues] = useState<{
  //   start: number;
  //   end: number;
  // }>({
  //   start: 0,
  //   end: stepCount - 1,
  // });

  const wizardInfo: WizardInfo = {
    stepCode: currentStepCode,
    // currentStep,
    schema: step.type as z.AnyZodObject | ZodEffects<any, any>,
    step,
    meta,
    formContext: { t: options.translate, formMeta: step },
    props,
  };

  // const setStep = (stepIdx: number) => {
  //   console.log(`useWizardFlow:setStep`, {
  //     stepIdx,
  //     stepRange,
  //     currentStep,
  //   });
  //   void setCurrentStep(
  //     Math.min(stepRange.end, Math.max(stepRange.start, stepIdx))
  //   );
  // };

  const onStepBack = async (data?: any) => {
    await moveStep(-1, data);
  };

  const moveStep = async (direction: number, data?: any) => {
    const currentStep = stepsInfo.findIndex(
      ({ code }: StepInfo) => code === currentStepCode
    );
    let idx = currentStep + direction;
    while (
      (direction > 0 || idx > 0) &&
      (direction < 0 || idx <= stepCount - 1) &&
      !evaluateStepCondition(idx, data)
    ) {
      console.log(
        `useWizardFlow:moveStep ${idx}:${steps[idx]?.name} ${direction} condition is false`,
        {
          idx,
          step: steps[idx],
          data,
        }
      );
      idx += direction;
    }
    if (idx > stepCount - 1) {
      await router.push(options.onCompleteUrl);
    } else {
      await setCurrentStepCode(stepsInfo[Math.max(0, idx)]?.code || "");
      //     Math.min(stepRange.end, Math.max(stepRange.start, stepIdx))
      //   );
      //
      // setStep(idx);
    }
  };

  const onStepNext = async (data?: any) => {
    await moveStep(1, data);
  };

  // console.log(`muly:useWizardFlow`, {
  //   stepRange,
  //   control,
  //   step,
  //   currentStep,
  //   metaInfo: steps,
  // });

  if (step.typeName === "ZodUndefined" && !control) {
    throw new Error(
      `Invalid step ${currentStepCode}, schema type is ${step.typeName} and control is empty`
    );
  }

  const evaluateStepCondition = (idx: number, data?: any) => {
    const step = steps[idx];
    if (!step?.meta.condition) {
      return true;
    }

    const info = { ...wizardInfo, step, currentStep: idx };
    return step.meta.condition(info, data || options.recordData);
  };

  // const setStepRange = async (start?: number, end?: number) => {
  //   const _start = start === undefined ? stepRange.start : start;
  //   const _end = end === undefined ? stepRange.end : end;
  //   setStepRangeValues({
  //     start: _start,
  //     end: _end,
  //   });
  //
  //   await setCurrentStepCodeREPLACE(
  //     Math.min(_end, Math.max(_start, currentStepCode))
  //   );
  //   console.log(`useWizardFlow:setStepRange`, {
  //     _start,
  //     _end,
  //     currentStepCode,
  //   });
  // };

  const wizard = {
    // stepRange,
    // setStepRange,
    // setStep,
    onStepBack,
    onStepNext,
    stepsInfo,

    control,
    // steps,

    ...wizardInfo,
  };

  // steps.forEach((step) => {
  //   step.meta.props = { wizard, ...step.meta.props };
  // });

  return wizard;
};

export type WizardControlProps = ReturnType<typeof useWizardFlow>;
export interface WizardInfo {
  stepCode: string;
  // currentStep: number;
  schema: z.AnyZodObject | ZodEffects<any, any>;
  step: MetaInfo;
  meta: ZodMetaDataItem;
  formContext: FormContext;
  props?: Record<string, unknown>;
}

export const evaluateControlCallback = (
  value: string | ControlCallback | undefined,
  wizard: WizardControlProps
): React.ReactNode => {
  if (!value) {
    return null;
  } else if (typeof value === "string") {
    return value;
  } else {
    return value(wizard);
  }
};

export const maybeConvertChild = (
  label: string | ControlCallback | undefined,
  wizard?: WizardControlProps
): React.ReactNode => {
  if (typeof label === "string" || !label) {
    return label;
  }

  if (!wizard) {
    throw new Error("maybeConvertChild, wizard is not defined");
  }

  return label(wizard);
  // throw new Error("maybeConvertChild, Not yet supported, should be");
};
