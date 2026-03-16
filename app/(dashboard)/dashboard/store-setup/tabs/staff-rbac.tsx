"use client";

import { useState } from "react";
import { Plus, Shield } from "lucide-react";

const ROLES = [
  { value: "OWNER", label: "Owner", description: "Full access to everything" },
  { value: "MANAGER", label: "Manager", description: "Branch-level management" },
  { value: "SALESPERSON", label: "Salesperson", description: "POS, customers, inventory view" },
  { value: "CASHIER", label: "Cashier", description: "POS and payment processing" },
  { value: "KARIGAR", label: "Karigar", description: "Job card and repair view" },
  { value: "ACCOUNTANT", label: "Accountant", description: "Finance, reports, day book" },
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
] as const;

export function StaffRbacTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "SALESPERSON",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API call to invite staff
    setForm({ name: "", phone: "", role: "SALESPERSON" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Staff & Roles</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="staff-name" className="mb-1 block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                id="staff-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="staff-phone" className="mb-1 block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                id="staff-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="staff-role" className="mb-1 block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                id="staff-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">
              Invite Staff
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

      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-700">
          Role Permissions
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <div
              key={role.value}
              className="rounded-lg border border-gray-200 p-3"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-maroon-800" />
                <span className="font-medium text-gray-900">{role.label}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
