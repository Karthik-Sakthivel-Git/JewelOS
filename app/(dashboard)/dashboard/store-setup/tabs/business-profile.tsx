"use client";

import { useState } from "react";

export function BusinessProfileTab() {
  const [form, setForm] = useState({
    name: "",
    legalName: "",
    gstin: "",
    pan: "",
    phone: "",
    email: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API call to save business profile
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Business Profile</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Store Name *
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="legalName" className="mb-1 block text-sm font-medium text-gray-700">
            Legal / Firm Name
          </label>
          <input
            id="legalName"
            name="legalName"
            value={form.legalName}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="gstin" className="mb-1 block text-sm font-medium text-gray-700">
            GSTIN
          </label>
          <input
            id="gstin"
            name="gstin"
            value={form.gstin}
            onChange={handleChange}
            className="input-field"
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
          />
        </div>

        <div>
          <label htmlFor="pan" className="mb-1 block text-sm font-medium text-gray-700">
            PAN
          </label>
          <input
            id="pan"
            name="pan"
            value={form.pan}
            onChange={handleChange}
            className="input-field"
            placeholder="AAAAA0000A"
            maxLength={10}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Save Profile
      </button>
    </form>
  );
}
