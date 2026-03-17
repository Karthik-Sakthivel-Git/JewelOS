"use client";

import { ShieldCheck, FileText } from "lucide-react";
import { getCategoryConfig } from "@/lib/utils/category-config";
import { HSN_GST_MAP } from "@/lib/utils/gst";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import type { StockCategory } from "@prisma/client";

interface Props {
  form: UseFormReturn<FieldValues>;
}

export function StepCompliance({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const category = watch("category");
  const hsnCode = watch("hsnCode");

  const catConfig = category ? getCategoryConfig(category as StockCategory) : null;

  function autoFillHsn() {
    if (catConfig) {
      setValue("hsnCode", catConfig.defaultHsn);
      setValue("gstRate", catConfig.defaultGstRate);
    }
  }

  const gstRate = hsnCode ? HSN_GST_MAP[hsnCode.substring(0, 4)] : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Compliance & Certification</h3>
        <p className="text-sm text-gray-500">BIS hallmark, HSN codes, and certificates</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* BIS HUID */}
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
            <ShieldCheck className="h-4 w-4 text-gold-500" />
            BIS HUID Number
          </label>
          <input
            {...register("bisHuid")}
            className="input-field"
            placeholder="6-character alphanumeric"
            maxLength={6}
          />
          <p className="mt-1 text-xs text-gray-400">
            Bureau of Indian Standards Hallmark Unique ID
          </p>
        </div>

        {/* HSN Code */}
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 text-gold-500" />
            HSN Code *
          </label>
          <div className="flex gap-2">
            <input
              {...register("hsnCode")}
              className="input-field"
              placeholder="e.g. 7113"
            />
            {catConfig && (
              <button
                type="button"
                onClick={autoFillHsn}
                className="whitespace-nowrap rounded-lg border border-gold-200 bg-gold-50 px-3 py-2 text-xs font-medium text-gold-700 hover:bg-gold-100"
              >
                Auto-fill ({catConfig.defaultHsn})
              </button>
            )}
          </div>
          {errors.hsnCode && (
            <p className="mt-1 text-xs text-red-600">{String(errors.hsnCode.message)}</p>
          )}
          {gstRate !== undefined && (
            <p className="mt-1 text-xs text-emerald-600">
              GST rate for HSN {hsnCode}: {gstRate}%
            </p>
          )}
        </div>

        {/* GST Rate */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            GST Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("gstRate", { valueAsNumber: true })}
            className="input-field"
            placeholder="3.0"
          />
        </div>

        {/* Certificate upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Certificate URL
          </label>
          <input
            {...register("certificateUrl")}
            type="url"
            className="input-field"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-gray-400">
            Link to purity/gemstone certificate
          </p>
        </div>
      </div>
    </div>
  );
}
