"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Boxes, PlusCircle, MoreHorizontal, Search, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const inventoryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

type InventoryItemSchema = z.infer<typeof inventoryItemSchema>;

interface InventoryItem extends InventoryItemSchema {
  id: string;
}

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Red Roses (Dozen)', category: 'Flowers', quantity: 50, price: 25.99, description: 'Classic red roses, perfect for romance.', imageUrl: 'https://placehold.co/100x100.png', },
  { id: '2', name: 'White Lilies (Bunch)', category: 'Flowers', quantity: 30, price: 18.50, description: 'Elegant white lilies for various occasions.', imageUrl: 'https://placehold.co/100x100.png', },
  { id: '3', name: 'Glass Vase (Medium)', category: 'Vases', quantity: 20, price: 12.00, description: 'Standard medium-sized glass vase.', imageUrl: 'https://placehold.co/100x100.png', },
  { id: '4', name: 'Floral Foam Brick', category: 'Supplies', quantity: 100, price: 2.50, description: 'Essential for arranging flowers.', imageUrl: 'https://placehold.co/100x100.png', },
];

const itemCategories = ["Flowers", "Vases", "Plants", "Supplies", "Gifts"];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setInventory(initialInventory);
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (data: InventoryItemSchema) => {
    const newItem: InventoryItem = { ...data, id: Date.now().toString() };
    setInventory(prev => [newItem, ...prev]);
    toast({ title: "Item Added", description: `${data.name} has been added to inventory.` });
  };

  const handleEditItem = (data: InventoryItemSchema) => {
    if (!editingItem) return;
    setInventory(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
    toast({ title: "Item Updated", description: `${data.name} has been updated.` });
  };

  const handleDeleteItem = (itemId: string) => {
    const itemName = inventory.find(item => item.id === itemId)?.name || "Item";
    setInventory(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item Deleted", description: `${itemName} has been removed from inventory.`, variant: "destructive" });
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  }

  return (
    <>
      <PageHeader
        title="Inventory Management"
        description="Manage your flowers, vases, and other items."
        icon={Boxes}
        actions={
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      data-ai-hint={`${item.category === 'Vases' ? 'vase' : 'flower product'}`}
                      height="64"
                      src={item.imageUrl || `https://placehold.co/64x64.png`}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="hidden md:table-cell">${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <InventoryItemFormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        item={editingItem}
      />
    </>
  );
}

interface InventoryItemFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryItemSchema) => void;
  item: InventoryItem | null;
}

function InventoryItemFormDialog({ isOpen, onClose, onSubmit, item }: InventoryItemFormDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<InventoryItemSchema>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: item || { name: '', category: '', quantity: 0, price: 0, description: '', imageUrl: ''}
  });

  useEffect(() => {
    if (item) {
      reset(item);
    } else {
      reset({ name: '', category: '', quantity: 0, price: 0, description: '', imageUrl: ''});
    }
  }, [item, reset, isOpen]);


  const handleFormSubmit: SubmitHandler<InventoryItemSchema> = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details of the inventory item.' : 'Enter the details for the new inventory item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue("category", value)} defaultValue={item?.category}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {itemCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register("quantity")} className="mt-1" />
              {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} className="mt-1" />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register("imageUrl")} className="mt-1" placeholder="https://placehold.co/100x100.png" />
            {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register("description")} className="mt-1" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{item ? 'Save Changes' : 'Add Item'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
