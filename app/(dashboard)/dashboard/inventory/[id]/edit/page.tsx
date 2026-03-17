"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema) as any,
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(({ product }) => {
        if (product) {
          form.reset({
            name: product.name,
            category: product.category,
            subcategory: product.subcategory ?? undefined,
            designCode: product.designCode ?? undefined,
            description: product.description ?? undefined,
            metalType: product.metalType,
            purity: product.purity,
            stoneType: product.stoneType ?? undefined,
            stoneWeight: product.stoneWeight,
            stoneValue: product.stoneValue,
            pricingType: product.pricingType,
            makingChargeType: product.makingChargeType ?? "PER_GRAM",
            makingChargeValue: product.makingChargeValue,
            supplierMrp: product.supplierMrp,
            hsnCode: product.hsnCode,
            gstRate: product.gstRate,
            unitOfMeasure: product.unitOfMeasure,
            bisHuid: product.bisHuid ?? undefined,
            certificateUrl: product.certificateUrl ?? undefined,
            images: product.images ?? [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, form]);

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) {
      setError("Please fix the validation errors before saving.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const values = form.getValues();
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update product");
      }

      router.push(`/dashboard/inventory/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl animate-pulse h-96 card bg-gray-100" />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/inventory/${id}`}
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">Update product details</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
        onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        onSubmit={handleSubmit}
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
