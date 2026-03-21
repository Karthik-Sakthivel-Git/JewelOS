"use client";

import { Scale, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface Props {
  form: UseFormReturn<FieldValues>;
}

export function StepPricing({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const pricingType = watch("pricingType");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
        <p className="text-sm text-gray-500">
          Choose how this product is priced
        </p>
      </div>

      {/* Pricing type toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setValue("pricingType", "WEIGHT_BASED")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 transition-all",
            pricingType === "WEIGHT_BASED"
              ? "border-gold-400 bg-gold-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <Scale className={cn("h-6 w-6", pricingType === "WEIGHT_BASED" ? "text-gold-600" : "text-gray-400")} />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Weight-Based</p>
            <p className="text-xs text-gray-500">
              net_weight x live_rate + making + stones
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setValue("pricingType", "FIXED_MRP")}
          className={cn(
            "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 transition-all",
            pricingType === "FIXED_MRP"
              ? "border-blue-400 bg-blue-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <Tag className={cn("h-6 w-6", pricingType === "FIXED_MRP" ? "text-blue-600" : "text-gray-400")} />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Fixed MRP</p>
            <p className="text-xs text-gray-500">
              Supplier MRP — no rate formula applied
            </p>
          </div>
        </button>
      </div>

      {/* WEIGHT_BASED fields */}
      {pricingType === "WEIGHT_BASED" && (
        <div className="rounded-xl border border-gold-200 bg-gold-50/30 p-5 space-y-5">
          <div className="rounded-lg bg-white/60 p-3 text-xs text-gray-600">
            <span className="font-semibold text-gold-700">Formula:</span>{" "}
            Price = net_weight x live_rate + making_charges + wastage + stone_value
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Making Charge Type
              </label>
              <select
                {...register("makingChargeType")}
                className="input-field"
              >
                <option value="PER_GRAM">Per Gram (Rs./g)</option>
                <option value="FLAT">Flat Amount (Rs.)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Making Charge Value
              </label>
              <input
                type="number"
                step="0.01"
                {...register("makingChargeValue", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Wastage Charge */}
          <div className="border-t border-gold-200 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              Wastage Charge
              <span className="ml-2 text-xs font-normal text-gray-400">Optional — separate from making charges</span>
            </h4>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Wastage Type
                </label>
                <select
                  {...register("wastageType", {
                    setValueAs: (value) => (value === "" ? null : value),
                  })}
                  className="input-field"
                >
                  <option value="">None</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="PER_GRAM">Per Gram (Rs./g)</option>
                  <option value="FLAT">Flat Amount (Rs.)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Wastage Value
                </label>
                <input
                  type="number"
                  step="0.001"
                  {...register("wastageValue", { valueAsNumber: true })}
                  className="input-field"
                  placeholder="0.000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED_MRP fields */}
      {pricingType === "FIXED_MRP" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 space-y-4">
          <div className="rounded-lg bg-white/60 p-3 text-xs text-gray-600">
            <span className="font-semibold text-blue-700">Fixed Price:</span>{" "}
            No rate formula — uses supplier MRP directly
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Supplier MRP (Rs.) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("supplierMrp", { valueAsNumber: true })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.supplierMrp && (
              <p className="mt-1 text-xs text-red-600">{String(errors.supplierMrp.message)}</p>
            )}
          </div>
        </div>
      )}

      {/* Unit of measure */}
      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Unit of Measure
        </label>
        <select {...register("unitOfMeasure")} className="input-field">
          <option value="GRAMS">Grams</option>
          <option value="PIECES">Pieces</option>
          <option value="CARATS">Carats</option>
          <option value="MILLIGRAMS">Milligrams</option>
        </select>
      </div>
    </div>
  );
}
