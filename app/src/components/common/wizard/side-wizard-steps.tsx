import { cn } from "@/lib/utils";
import React from "react";
import {
  getStepInfoSubTitles,
  getStepInfoTitles,
} from "@/components/common/wizard/steps-info";
import type { WizardControlProps } from "@/components/common/wizard/useWizardFlow";

interface Props {
  wizard: WizardControlProps;
}

export const SideWizardSteps = ({ wizard }: Props) => {
  return (
    <div>
      SUB STEPS{" "}
      <div className="flex flex-row gap-2">
        {getStepInfoSubTitles(wizard.stepsInfo, wizard.stepCode).map(
          ({ title, status }) => (
            <div
              key={title}
              className={cn([
                { "font-bold": status === "done" },
                { "text-gray-300": status === "next" },
              ])}
            >
              {title}
            </div>
          )
        )}
      </div>
    </div>
  );
};
