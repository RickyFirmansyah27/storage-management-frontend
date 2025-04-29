
import React from "react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { getAllItems, getAllCategories } from "@/utils/localStorage";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = React.useState({
    totalItems: 0,
    totalCategories: 0,
    totalStock: 0,
  });

  React.useEffect(() => {
    const items = getAllItems();
    const categories = getAllCategories();
    setSummary({
      totalItems: items.length,
      totalCategories: categories.length,
      totalStock: items.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <h1 className="text-3xl font-bold mb-3">Dashboard Ringkasan</h1>
      <DashboardSummary {...summary} />
      <div className="bg-white dark:bg-card/70 rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">Selamat datang 👋</h2>
        <p className="text-gray-700 dark:text-gray-300 text-md">
          Kelola data item <b>storage</b> Anda dengan mudah: monitoring stok, kategori, serta histori mutasi barang. Navigasi menu di samping untuk mulai.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
