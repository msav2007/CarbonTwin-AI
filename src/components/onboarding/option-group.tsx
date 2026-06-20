"use client";

import { OptionCard } from "@/components/onboarding/option-card";
import type { OnboardingOption } from "@/lib/onboarding/options";

interface OptionGroupProps<T extends string> {
  description?: string;
  legend: string;
  name: string;
  onSelect: (value: T) => void;
  options: OnboardingOption<T>[];
  selectedValue?: T;
}

export function OptionGroup<T extends string>({
  description,
  legend,
  name,
  onSelect,
  options,
  selectedValue,
}: OptionGroupProps<T>) {
  const descriptionId = `${name}-description`;

  return (
    <fieldset
      className="space-y-3"
      role="radiogroup"
      aria-describedby={description ? descriptionId : undefined}
    >
      <legend className="mb-3 text-sm font-medium text-foreground">
        {legend}
      </legend>
      {description ? (
        <p id={descriptionId} className="mb-4 text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {options.map((option) => (
        <OptionCard
          key={option.value}
          {...option}
          name={name}
          selected={selectedValue === option.value}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </fieldset>
  );
}
