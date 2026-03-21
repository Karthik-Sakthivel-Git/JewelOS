"use client";

import { CATEGORY_CONFIG, SUBCATEGORIES } from "@/lib/utils/category-config";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface Props {
  form: UseFormReturn<FieldValues>;
}

export function StepBasic({ form }: Props) {
  const { register, watch, formState: { errors } } = form;
  const category = watch("category");
  const subcategories = category ? SUBCATEGORIES[category] ?? [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        <p className="text-sm text-gray-500">Product identity and categorization</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Product Name *
          </label>
          <input
            {...register("name")}
            className="input-field"
            placeholder="e.g. Gold Necklace Temple Design"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{String(errors.name.message)}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select {...register("category")} className="input-field">
            <option value="">Select category</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{String(errors.category.message)}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select {...register("subcategory")} className="input-field">
            <option value="">Select subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Design Code
          </label>
          <input
            {...register("designCode")}
            className="input-field"
            placeholder="e.g. TMP-NK-001"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Target Group
          </label>
          <select {...register("targetGroup")} className="input-field">
            <option value="UNISEX">Unisex</option>
            <option value="LADIES">Ladies</option>
            <option value="GENTS">Gents</option>
            <option value="KIDS">Kids</option>
            <option value="PAIR">Pair (set)</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Age / gender classification for the product
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-field resize-none"
            placeholder="Product details, special features..."
          />
        </div>
      </div>
    </div>
  );
}
