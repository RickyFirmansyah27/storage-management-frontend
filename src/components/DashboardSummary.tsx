
import React from "react";

interface DashboardSummaryProps {
  totalItems: number;
  totalCategories: number;
  totalStock: number;
}

const cards = [
  { title: "Item", color: "bg-blue-100 text-blue-900", },
  { title: "Kategori", color: "bg-green-100 text-green-900", },
  { title: "Total Stok", color: "bg-purple-100 text-purple-900", },
];

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalItems, totalCategories, totalStock
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className="p-6 rounded-xl shadow bg-blue-100 flex flex-col items-center">
      <span className="text-4xl font-bold">{totalItems}</span>
      <span className="text-lg mt-2">Total Item</span>
    </div>
    <div className="p-6 rounded-xl shadow bg-green-100 flex flex-col items-center">
      <span className="text-4xl font-bold">{totalCategories}</span>
      <span className="text-lg mt-2">Kategori</span>
    </div>
    <div className="p-6 rounded-xl shadow bg-purple-100 flex flex-col items-center">
      <span className="text-4xl font-bold">{totalStock}</span>
      <span className="text-lg mt-2">Total Stok</span>
    </div>
  </div>
);
