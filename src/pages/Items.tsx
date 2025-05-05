import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { get } from "lodash";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getAllItems, saveItem, deleteItem, getAllCategories } from "@/utils/localStorage";
import { useGetAllItems } from "@/services/item-service";

interface Item {
  id: string;
  name: string;
  category_id: string;
  stock: number;
  unit: string;
  min_stock?: number;
}

const Items = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  const [categories, setCategories] = React.useState<{id: string, name: string}[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const [formData, setFormData] = React.useState({
    name: "",
    category_id: "",
    stock: 0,
    unit: "",
    min_stock: 0
  });

  React.useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const { data: dataItems, isLoading, refetch } = useGetAllItems({});
  const itemList = get(dataItems, "data.data.items", []);

  const loadItems = () => {
    const loadedItems = getAllItems();
    setItems(loadedItems);
  };

  const loadCategories = () => {
    const loadedCategories = getAllCategories();
    setCategories(loadedCategories);
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      name: "",
      category_id: "",
      stock: 0,
      unit: "",
      min_stock: 0
    });
    setOpenDialog(true);
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category_id: item.category_id,
      stock: item.stock,
      unit: item.unit,
      min_stock: item.min_stock || 0
    });
    setOpenDialog(true);
  };

  const handleChange = (key: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveItem = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama item tidak boleh kosong");
      return;
    }

    if (!formData.category_id) {
      toast.error("Kategori harus dipilih");
      return;
    }

    const itemData = {
      id: currentItem?.id || Date.now().toString(),
      ...formData
    };

    saveItem(itemData);
    setOpenDialog(false);
    await refetch(); // Refresh the items list
    toast.success(`Item berhasil ${currentItem ? 'diperbarui' : 'ditambahkan'}`);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Yakin ingin menghapus item ini?")) {
      deleteItem(id);
      await refetch(); // Refresh the items list
      toast.success("Item berhasil dihapus");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (category_id: string) => {
    const category = categories.find(cat => cat.id === category_id);
    return category ? category.name : "Tidak ada kategori";
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Manajemen Item</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <Input 
              placeholder="Cari item..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddItem}>Tambah Item</Button>
        </div>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Nama</th>
                <th className="px-4 py-3 text-left font-medium">Kategori</th>
                <th className="px-4 py-3 text-center font-medium">Stok</th>
                <th className="px-4 py-3 text-left font-medium">Satuan</th>
                <th className="px-4 py-3 text-center font-medium">Min Stok</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {itemList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                    {searchTerm ? "Tidak ada item yang ditemukan" : "Belum ada item tersimpan"}
                  </td>
                </tr>
              ) : (
                itemList?.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{getCategoryName(item.category_id)}</td>
                    <td className={`px-4 py-3 text-center ${Number(item.stock) <= Number(item.min_stock || 0) ? "text-destructive font-semibold" : ""}`}>
                      {item.stock}
                    </td>
                    <td className="px-4 py-3">{item.unit}</td>
                    <td className="px-4 py-3 text-center">{item.min_stock || '-'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive" 
                        onClick={() => handleDeleteItem(item.id)}
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
              {currentItem ? "Edit Item" : "Tambah Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Item</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleChange("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Satuan</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  placeholder="pcs, kg, box, dll"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_stock">Stok Minimal (Opsional)</Label>
              <Input
                id="min_stock"
                type="number"
                min={0}
                value={formData.min_stock}
                onChange={(e) => handleChange("min_stock", parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Batas minimal stok sebelum diberi peringatan</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveItem}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Items;
