"use client";

import { METAL_TYPE_OPTIONS, PURITY_MAP } from "@/lib/utils/category-config";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface Props {
  form: UseFormReturn<FieldValues>;
}

export function StepMetalStone({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const metalType = watch("metalType");
  const targetGroup = watch("targetGroup");

  function handleMetalChange(value: string) {
    setValue("metalType", value || null);
    const defaultPurity = PURITY_MAP[value];
    if (defaultPurity) {
      setValue("purity", defaultPurity);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Metal & Stone Details</h3>
        <p className="text-sm text-gray-500">Composition, weight, and stone information</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Metal Type
          </label>
          <select
            value={metalType ?? ""}
            onChange={(e) => handleMetalChange(e.target.value)}
            className="input-field"
          >
            <option value="">None (non-metal)</option>
            {METAL_TYPE_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Purity (%)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("purity", { valueAsNumber: true })}
            className="input-field"
            placeholder="e.g. 91.6"
          />
          {errors.purity && (
            <p className="mt-1 text-xs text-red-600">{String(errors.purity.message)}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Gross Weight (g)
          </label>
          <input
            type="number"
            step="0.001"
            {...register("grossWeight", { valueAsNumber: true })}
            className="input-field"
            placeholder="0.000"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Net Weight (g)
          </label>
          <input
            type="number"
            step="0.001"
            {...register("netWeight", { valueAsNumber: true })}
            className="input-field"
            placeholder="0.000"
          />
          <p className="mt-1 text-xs text-gray-400">
            Net = Gross - Stone weight
          </p>
        </div>
      </div>

      {/* Stone details */}
      <div className="gold-divider" />
      <div>
        <h4 className="text-sm font-semibold text-gray-800">Stone Details</h4>
        <p className="mb-3 text-xs text-gray-400">Optional — fill if product has stones</p>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stone Type
            </label>
            <input
              {...register("stoneType")}
              className="input-field"
              placeholder="e.g. Diamond, Ruby"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stone Weight (g)
            </label>
            <input
              type="number"
              step="0.001"
              {...register("stoneWeight", { valueAsNumber: true })}
              className="input-field"
              placeholder="0.000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stone Value (Rs.)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("stoneValue", { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Size details */}
      <div className="gold-divider" />
      <div>
        <h4 className="text-sm font-semibold text-gray-800">Size</h4>
        <p className="mb-3 text-xs text-gray-400">Optional — for rings, bangles, chains, etc.</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Size Label
            </label>
            <input
              {...register("sizeLabel")}
              className="input-field"
              placeholder='e.g. 12, 2/8, 18 inch, Free Size'
            />
            <p className="mt-1 text-xs text-gray-400">
              Ring no., bangle size, chain length, or "Free Size"
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Size Standard
            </label>
            <select
              {...register("sizeStandard", {
                setValueAs: (value) => (value === "" ? null : value),
              })}
              className="input-field"
            >
              <option value="">Not applicable</option>
              <option value="INDIAN">Indian</option>
              <option value="US">US</option>
              <option value="UK">UK</option>
              <option value="EU">EU</option>
              <option value="MM">MM (millimetres)</option>
              <option value="CM">CM (centimetres)</option>
              <option value="FREE">Free Size</option>
            </select>
          </div>

          {targetGroup === "PAIR" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Ladies Size
                </label>
                <input
                  {...register("sizeLadies")}
                  className="input-field"
                  placeholder="e.g. 12"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Gents Size
                </label>
                <input
                  {...register("sizeGents")}
                  className="input-field"
                  placeholder="e.g. 18"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
