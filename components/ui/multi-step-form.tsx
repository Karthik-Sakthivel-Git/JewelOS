"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepClick,
  children,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  canProceed = true,
}: MultiStepFormProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <nav className="overflow-x-auto">
        <ol className="flex items-center gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <li key={step.id} className="flex items-center gap-2">
                {idx > 0 && (
                  <div
                    className={cn(
                      "hidden sm:block h-px w-8",
                      isCompleted ? "bg-gold-400" : "bg-gray-200"
                    )}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onStepClick(idx)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isCurrent && "bg-maroon-800 text-white shadow-sm",
                    isCompleted && "bg-gold-50 text-gold-700 border border-gold-200",
                    !isCurrent && !isCompleted && "bg-gray-50 text-gray-400 border border-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                      isCurrent && "bg-white/20 text-white",
                      isCompleted && "bg-gold-400 text-white",
                      !isCurrent && !isCompleted && "bg-gray-200 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div className="card p-6 mandala-pattern relative overflow-hidden corner-ornament-tl corner-ornament-br">
        <div className="relative z-10">{children}</div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            "rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium transition-colors",
            isFirst
              ? "cursor-not-allowed opacity-40"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          Previous
        </button>

        <span className="text-xs text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </span>

        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !canProceed}
            className="btn-gold disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="btn-primary disabled:opacity-50"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}
