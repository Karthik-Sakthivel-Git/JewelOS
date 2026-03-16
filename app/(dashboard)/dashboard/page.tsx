import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Today's Sales",
    value: "₹0",
    icon: ShoppingCart,
    change: "No data yet",
  },
  {
    label: "Active Stock",
    value: "0 items",
    icon: Package,
    change: "No data yet",
  },
  {
    label: "Total Customers",
    value: "0",
    icon: Users,
    change: "No data yet",
  },
  {
    label: "Gold Rate (22K)",
    value: "₹6,450/g",
    icon: TrendingUp,
    change: "Manual entry",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome to JewelOS. Complete your store setup to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-lg bg-maroon-50 p-3">
                <stat.icon className="h-5 w-5 text-maroon-800" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "New Sale", href: "/dashboard/sales", color: "bg-maroon-800" },
            { label: "Add Product", href: "/dashboard/inventory", color: "bg-gold-400" },
            { label: "Add Customer", href: "/dashboard/customers", color: "bg-emerald-600" },
            { label: "Update Gold Rate", href: "/dashboard/store-setup", color: "bg-blue-600" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`${action.color} flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
