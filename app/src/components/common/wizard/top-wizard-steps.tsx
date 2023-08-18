import { cn } from "@/lib/utils";
import React from "react";
import { getStepInfoTitles } from "@/components/common/wizard/steps-info";
import type { WizardControlProps } from "@/components/common/wizard/useWizardFlow";

interface Props {
  wizard: WizardControlProps;
}

export const TopWizardSteps = ({ wizard }: Props) => {
  const stepTitles = getStepInfoTitles(wizard.stepsInfo, wizard.stepCode);

  return stepTitles.length > 0 ? (
    <div>
      STEPS{" "}
      <div className="flex flex-row gap-2">
        {stepTitles.map(({ title, status }) => (
          <div
            key={title}
            className={cn([
              { "font-bold": status === "done" },
              { "text-red-300": status === "next" },
            ])}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
