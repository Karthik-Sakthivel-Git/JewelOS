"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Gem, DollarSign, ShieldCheck, Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MultiStepForm, type Step } from "@/components/ui/multi-step-form";
import { StepBasic } from "@/components/inventory/product-form/step-basic";
import { StepMetalStone } from "@/components/inventory/product-form/step-metal-stone";
import { StepPricing } from "@/components/inventory/product-form/step-pricing";
import { StepCompliance } from "@/components/inventory/product-form/step-compliance";
import { StepPhotos } from "@/components/inventory/product-form/step-photos";
import { productCreateSchema, type ProductCreateInput } from "@/lib/validations/product";

const steps: Step[] = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "metal", label: "Metal & Stone", icon: Gem },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "photos", label: "Photos", icon: Camera },
];

export default function NewProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema) as any,
    defaultValues: {
      name: "",
      category: undefined,
      metalType: undefined,
      purity: undefined,
      grossWeight: undefined,
      netWeight: undefined,
      stoneType: "",
      stoneWeight: undefined,
      stoneValue: undefined,
      pricingType: "WEIGHT_BASED",
      supplierMrp: undefined,
      hsnCode: "7113",
      gstRate: 3,
      unitOfMeasure: "GRAMS",
      makingChargeType: "PER_GRAM",
      makingChargeValue: undefined,
      targetGroup: "UNISEX",
      wastageType: null,
      wastageValue: 0,
      sizeLabel: null,
      sizeStandard: null,
      sizeLadies: null,
      sizeGents: null,
      bisHuid: "",
      bisHallmarked: false,
      certificateUrl: "",
      subcategory: "",
      designCode: "",
      description: "",
      images: [],
    },
  });

  const onInvalid = (errors: FieldErrors<ProductCreateInput>) => {
    const list = Object.entries(errors).map(([field, err]) => {
      const e = err as { message?: string; type?: string | number } | undefined;
      return `${field}: ${e?.message || e?.type}`;
    });
    setFieldErrors(list);
    setError("Please fix the validation errors before saving.");
  };

  async function onSubmit(data: ProductCreateInput) {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors([]);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error ?? `Failed to create product (${res.status})`;
        const details = err?.details?.issues
          ?.map((i: { path?: string[]; message?: string }) => `${(i.path || []).join(".")}: ${i.message}`)
          .join("; ");
        throw new Error(details ? `${msg} — ${details}` : msg);
      }

      const { product } = await res.json();
      router.push(`/dashboard/inventory/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/inventory"
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">
            Fill in the details across all steps to create a product
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">{error}</p>
          {fieldErrors.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs">
              {fieldErrors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
        onSubmit={() => form.handleSubmit(onSubmit, onInvalid)()}
        isSubmitting={isSubmitting}
      >
        {currentStep === 0 && <StepBasic form={form as any} />}
        {currentStep === 1 && <StepMetalStone form={form as any} />}
        {currentStep === 2 && <StepPricing form={form as any} />}
        {currentStep === 3 && <StepCompliance form={form as any} />}
        {currentStep === 4 && <StepPhotos form={form as any} />}
      </MultiStepForm>
    </div>
  );
}
