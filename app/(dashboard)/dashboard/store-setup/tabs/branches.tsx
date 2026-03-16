"use client";

import { useState } from "react";
import { Plus, MapPin, Pencil } from "lucide-react";

interface BranchForm {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isMain: boolean;
}

const emptyBranch: BranchForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  isMain: false,
};

export function BranchesTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BranchForm>(emptyBranch);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API call to create branch
    setForm(emptyBranch);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Branches</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="branch-name" className="mb-1 block text-sm font-medium text-gray-700">
                Branch Name *
              </label>
              <input
                id="branch-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Main Showroom"
                required
              />
            </div>
            <div>
              <label htmlFor="branch-phone" className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="branch-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="branch-address" className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="branch-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="branch-city" className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="branch-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="branch-state" className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                id="branch-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="branch-pincode" className="mb-1 block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                id="branch-pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="input-field"
                maxLength={6}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="branch-isMain"
                name="isMain"
                type="checkbox"
                checked={form.isMain}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-maroon-800 focus:ring-maroon-800"
              />
              <label htmlFor="branch-isMain" className="text-sm text-gray-700">
                Main branch
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">
              Save Branch
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
        <MapPin className="mx-auto h-8 w-8 mb-2" />
        <p>No branches configured yet.</p>
        <p className="text-sm">Add your first branch to get started.</p>
      </div>
    </div>
  );
}
