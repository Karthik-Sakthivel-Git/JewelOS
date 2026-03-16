"use client";

import { useState } from "react";
import { Plus, Lock } from "lucide-react";

export function LockersTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API call to create locker
    setForm({ name: "", location: "", capacity: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Safe Lockers</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Locker
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="locker-name" className="mb-1 block text-sm font-medium text-gray-700">
                Locker Name *
              </label>
              <input
                id="locker-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Vault A"
                required
              />
            </div>
            <div>
              <label htmlFor="locker-location" className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="locker-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Basement"
              />
            </div>
            <div>
              <label htmlFor="locker-capacity" className="mb-1 block text-sm font-medium text-gray-700">
                Capacity (slots)
              </label>
              <input
                id="locker-capacity"
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                className="input-field"
                min={1}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">
              Save Locker
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
        <Lock className="mx-auto h-8 w-8 mb-2" />
        <p>No safe lockers configured yet.</p>
      </div>
    </div>
  );
}
