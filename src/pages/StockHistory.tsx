
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  getAllItems, 
  getAllStockMovements, 
  saveStockMovement, 
  updateItemStock 
} from "@/utils/localStorage";

interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  notes: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
}

const StockHistory = () => {
  const [movements, setMovements] = React.useState<StockMovement[]>([]);
  const [items, setItems] = React.useState<Item[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  
  const [formData, setFormData] = React.useState({
    itemId: "",
    type: "in",
    quantity: 1,
    notes: "",
  });

  React.useEffect(() => {
    loadMovements();
    loadItems();
  }, []);

  const loadMovements = () => {
    const loadedMovements = getAllStockMovements();
    setMovements(loadedMovements);
  };

  const loadItems = () => {
    const loadedItems = getAllItems();
    setItems(loadedItems);
  };

  const handleChange = (key: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddMovement = () => {
    setFormData({
      itemId: "",
      type: "in",
      quantity: 1,
      notes: "",
    });
    setOpenDialog(true);
  };

  const handleSaveMovement = () => {
    if (!formData.itemId) {
      toast.error("Pilih item terlebih dahulu");
      return;
    }

    if (formData.quantity < 1) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }

    const item = items.find(i => i.id === formData.itemId);
    if (!item) {
      toast.error("Item tidak ditemukan");
      return;
    }

    // Check if there's enough stock for 'out' movements
    if (formData.type === "out" && item.quantity < formData.quantity) {
      toast.error("Stok tidak mencukupi");
      return;
    }

    const movementData: StockMovement = {
      id: Date.now().toString(),
      itemId: formData.itemId,
      type: formData.type as 'in' | 'out',
      quantity: Number(formData.quantity),
      date: new Date().toISOString(),
      notes: formData.notes,
    };

    // Update the item's stock
    const newQuantity = formData.type === "in" 
      ? item.quantity + Number(formData.quantity)
      : item.quantity - Number(formData.quantity);
    
    updateItemStock(formData.itemId, newQuantity);
    saveStockMovement(movementData);
    
    setOpenDialog(false);
    loadMovements();
    loadItems();
    toast.success(`${formData.type === "in" ? "Stok masuk" : "Stok keluar"} berhasil dicatat`);
  };

  const filteredMovements = movements.filter(movement => {
    if (filter === 'all') return true;
    return movement.type === filter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getItemName = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.name : "Item tidak ditemukan";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Riwayat Stok</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="in">Stok Masuk</SelectItem>
              <SelectItem value="out">Stok Keluar</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddMovement}>Tambah Pergerakan</Button>
        </div>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-center font-medium">Tipe</th>
                <th className="px-4 py-3 text-center font-medium">Jumlah</th>
                <th className="px-4 py-3 text-left font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                    Belum ada riwayat stok
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(movement.date)}</td>
                    <td className="px-4 py-3">{getItemName(movement.itemId)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {movement.type === 'in' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{movement.quantity}</td>
                    <td className="px-4 py-3">{movement.notes || "-"}</td>
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
              Catat Pergerakan Stok
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item">Item</Label>
              <Select 
                value={formData.itemId} 
                onValueChange={(value) => handleChange("itemId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stok Masuk</SelectItem>
                  <SelectItem value="out">Stok Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Tambahkan catatan..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveMovement}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockHistory;
