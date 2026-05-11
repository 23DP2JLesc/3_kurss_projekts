import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi, productsApi, categoriesApi } from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useProducts, DBProduct } from "@/hooks/useProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Ban, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  banned: boolean;
  role: string;
  warningMessage: string | null;
  profile: { displayName: string | null; avatarUrl: string | null } | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

const emptyProduct = {
  name: "",
  brand: "",
  model: "",
  type: "",
  category: "",
  price: 0,
  original_price: null as number | null,
  image: "",
  stock: 0,
  fitment: [] as string[],
  description: "",
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { products, refetch } = useProducts();

  const [editing, setEditing] = useState<DBProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [warnTarget, setWarnTarget] = useState<AdminUser | null>(null);
  const [warnText, setWarnText] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await categoriesApi.getAll();
      setCategories(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
    setCategoriesLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadCategories();
  }, [isAdmin]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await usersApi.getAll();
      setUsers(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      toast.error("Failed to load users");
    }
    setUsersLoading(false);
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 container mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-4xl">Admins Only</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- Product handlers ----
  const openCreate = () => {
    setForm(emptyProduct);
    setCreating(true);
  };

  const openEdit = (p: DBProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      brand: p.brand,
      model: p.model,
      type: p.type,
      category: p.category,
      price: Number(p.price),
      original_price: p.original_price ? Number(p.original_price) : null,
      image: p.image,
      stock: p.stock,
      fitment: p.fitment,
      description: p.description,
    });
  };

  const closeDialogs = () => {
    setEditing(null);
    setCreating(false);
  };

  const saveProduct = async () => {
    if (!form.name || !form.brand || !form.image || form.price <= 0) {
      toast.error("Aizpildi nosaukumu, marku, attēla URL un pozitīvu cenu.");
      return;
    }
    if (editing) {
      try {
        await productsApi.update(editing.id, form);
        toast.success("Produkts atjaunināts");
      } catch (error: any) {
        return toast.error(error.message);
      }
    } else {
      try {
        await productsApi.create(form);
        toast.success("Produkts izveidots");
      } catch (error: any) {
        return toast.error(error.message);
      }
    }
    closeDialogs();
    refetch();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Dzēst šo produktu?")) return;
    try {
      await productsApi.delete(id);
      toast.success("Deleted");
      refetch();
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  // ---- User handlers ----
  const toggleBan = async (u: AdminUser) => {
    const banned = !u.banned;
    try {
      await usersApi.updateStatus(u.id, { banned });
      toast.success(banned ? "User banned" : "User unbanned");
      loadUsers();
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const sendWarning = async () => {
    if (!warnTarget) return;
    try {
      await usersApi.updateStatus(warnTarget.id, { warning_message: warnText });
      toast.success("Brīdinājums nosūtīts");
      setWarnTarget(null);
      setWarnText("");
      loadUsers();
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  // ---- Category handlers ----
  const openCreateCategory = () => {
    setCategoryForm({ name: "", description: "" });
    setCreatingCategory(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({ name: c.name, description: c.description || "" });
  };

  const closeCategoryDialogs = () => {
    setEditingCategory(null);
    setCreatingCategory(false);
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error("Nepieciešams kategorijas nosaukums");
      return;
    }
    if (editingCategory) {
      try {
        await categoriesApi.update(editingCategory.id, categoryForm);
        toast.success("Kategorijas atjaunināta");
      } catch (error: any) {
        return toast.error(error.message);
      }
    } else {
      try {
        await categoriesApi.create(categoryForm);
        toast.success("Kategorijas izveidota");
      } catch (error: any) {
        return toast.error(error.message);
      }
    }
    closeCategoryDialogs();
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Dzēst šo kategoriju?")) return;
    try {
      await categoriesApi.delete(id);
      toast.success("Kategorijas dzēsta");
      loadCategories();
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Vadības centrs</span>
            <h1 className="font-display text-4xl md:text-5xl mt-1">Administrācija</h1>
          </div>
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Produkti ({products.length})</TabsTrigger>
            <TabsTrigger value="users">Lietotāji ({users.length})</TabsTrigger>
            <TabsTrigger value="categories">Kategorijas ({categories.length})</TabsTrigger>
          </TabsList>

          {/* PRODUCTS */}
          <TabsContent value="products" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={openCreate} className="gap-2">
                  <Plus className="h-4 w-4" /> Jauns produkts
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nosaukums</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Veids</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Krājums</TableHead>
                    <TableHead className="text-right">Darbības</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.brand}</TableCell>
                      <TableCell>{p.type}</TableCell>
                      <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="mt-6">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-pasts</TableHead>
                    <TableHead>Loma</TableHead>
                    <TableHead>Statuss</TableHead>
                    <TableHead>Pievienots</TableHead>
                    <TableHead className="text-right">Darbības</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Ielādē...</TableCell></TableRow>
                  )}
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>
                        <span className={u.role?.toLowerCase() === "admin" ? "text-primary font-semibold" : ""}>
                          {u.role || "user"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {u.banned ? (
                          <span className="text-destructive font-semibold">Banned</span>
                        ) : u.warningMessage ? (
                          <span className="text-yellow-500">Warned</span>
                        ) : (
                          <span className="text-muted-foreground">Active</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setWarnTarget(u); setWarnText(u.warningMessage || ""); }}
                            disabled={u.id === user.id}
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" /> Warn
                          </Button>
                          <Button
                            size="sm"
                            variant={u.banned ? "outline" : "destructive"}
                            onClick={() => toggleBan(u)}
                            disabled={u.id === user.id}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            {u.banned ? "Unban" : "Ban"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={openCreateCategory} className="gap-2">
                <Plus className="h-4 w-4" /> New category
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesLoading && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
                  )}
                  {categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.description || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditCategory(c)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteCategory(c.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Product Dialog */}
      <Dialog open={creating || !!editing} onOpenChange={(o) => !o && closeDialogs()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
            <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div>
              <Label>Price</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Original Price (optional)</Label>
              <Input type="number" step="0.01" value={form.original_price ?? ""} onChange={(e) => setForm({ ...form, original_price: e.target.value ? parseFloat(e.target.value) : null })} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Fitment (comma-separated)</Label>
              <Input value={form.fitment.join(", ")} onChange={(e) => setForm({ ...form, fitment: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… or /src/assets/product-exhaust.jpg" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialogs}>Cancel</Button>
            <Button onClick={saveProduct}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={!!warnTarget} onOpenChange={(o) => !o && setWarnTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warn {warnTarget?.email}</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={4}
            placeholder="Explain what they did wrong…"
            value={warnText}
            onChange={(e) => setWarnText(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarnTarget(null)}>Cancel</Button>
            <Button onClick={sendWarning} disabled={!warnText.trim()}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={creatingCategory || !!editingCategory} onOpenChange={(o) => !o && closeCategoryDialogs()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Name</Label>
              <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCategoryDialogs}>Cancel</Button>
            <Button onClick={saveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
