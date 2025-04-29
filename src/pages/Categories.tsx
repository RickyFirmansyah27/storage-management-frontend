
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { getAllCategories, saveCategory, deleteCategory, Category } from "@/utils/localStorage";

const Categories = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(null);
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDesc, setCategoryDesc] = React.useState("");

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const loadedCategories = getAllCategories();
    setCategories(loadedCategories);
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategoryName("");
    setCategoryDesc("");
    setOpenDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryDesc(category.description || "");
    setOpenDialog(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    const categoryData = {
      id: currentCategory?.id || Date.now().toString(),
      name: categoryName.trim(),
      description: categoryDesc.trim(),
    };

    saveCategory(categoryData);
    setOpenDialog(false);
    loadCategories();
    toast.success(`Kategori berhasil ${currentCategory ? 'diperbarui' : 'ditambahkan'}`);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Yakin ingin menghapus kategori ini?")) {
      deleteCategory(id);
      loadCategories();
      toast.success("Kategori berhasil dihapus");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
        <Button onClick={handleAddCategory}>Tambah Kategori</Button>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left font-medium">Nama</th>
                <th className="px-6 py-3 text-left font-medium">Deskripsi</th>
                <th className="px-6 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground">
                    Belum ada kategori tersimpan
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">{category.description || "-"}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive" 
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={categoryDesc}
                onChange={(e) => setCategoryDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveCategory}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
