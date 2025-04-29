
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [companyName, setCompanyName] = React.useState(localStorage.getItem("companyName") || "Storage Manager");
  const [autoSave, setAutoSave] = React.useState(localStorage.getItem("autoSave") === "true");

  const handleSave = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("autoSave", autoSave.toString());
    toast.success("Pengaturan berhasil disimpan");
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-6">Pengaturan Aplikasi</h1>
      
      <div className="bg-card shadow-sm rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nama Perusahaan</Label>
          <Input 
            id="company-name" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Masukkan nama perusahaan"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-save"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="auto-save" className="cursor-pointer">Simpan otomatis saat mengedit data</Label>
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-2">
          <h3 className="font-medium">Tampilan</h3>
          <p className="text-sm text-muted-foreground">Ubah tampilan aplikasi sesuai preferensi Anda</p>
          <DarkModeToggle className="mt-2" />
        </div>

        <div className="pt-4">
          <Button onClick={handleSave}>Simpan Pengaturan</Button>
        </div>
      </div>
      
      <div className="mt-8 bg-card shadow-sm rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold">Tentang Aplikasi</h2>
        <p className="text-muted-foreground">
          Storage Management v1.0.0<br />
          Aplikasi manajemen gudang dan inventori sederhana.<br />
          © 2025 Semua hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
};

export default Settings;
