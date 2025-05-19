"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Users, PlusCircle, MoreHorizontal, Search, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number is too short").optional().or(z.literal('')),
  preferences: z.string().optional(),
  purchaseHistory: z.array(z.string()).optional(), // For simplicity, array of strings
});

type CustomerSchema = z.infer<typeof customerSchema>;

interface Customer extends CustomerSchema {
  id: string;
}

const initialCustomers: Customer[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-1234', preferences: 'Loves tulips and pastel colors.', purchaseHistory: ['Order #1001', 'Order #1005'] },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phone: '555-5678', preferences: 'Prefers hardy plants, dislikes lilies.', purchaseHistory: ['Order #1002'] },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-8765', preferences: 'Birthday arrangements in February.', purchaseHistory: [] },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCustomers(initialCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = (data: CustomerSchema) => {
    const newCustomer: Customer = { ...data, id: Date.now().toString(), purchaseHistory: [] };
    setCustomers(prev => [newCustomer, ...prev]);
    toast({ title: "Customer Added", description: `${data.name} has been added.` });
  };

  const handleEditCustomer = (data: CustomerSchema) => {
    if (!editingCustomer) return;
    setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...data } : c));
    toast({ title: "Customer Updated", description: `${data.name}'s details have been updated.` });
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customerName = customers.find(c => c.id === customerId)?.name || "Customer";
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    toast({ title: "Customer Deleted", description: `${customerName} has been removed.`, variant: "destructive" });
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
  }

  return (
    <>
      <PageHeader
        title="Customer Management"
        description="Manage your customer information and preferences."
        icon={Users}
        actions={
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers by name or email..."
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Preferences</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground truncate max-w-xs">
                    {customer.preferences}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CustomerFormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer}
        customer={editingCustomer}
      />
    </>
  );
}

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerSchema) => void;
  customer: Customer | null;
}

function CustomerFormDialog({ isOpen, onClose, onSubmit, customer }: CustomerFormDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || { name: '', email: '', phone: '', preferences: ''}
  });

  useEffect(() => {
    if (customer) {
      reset(customer);
    } else {
      reset({ name: '', email: '', phone: '', preferences: ''});
    }
  }, [customer, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<CustomerSchema> = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {customer ? 'Update the customer\'s details.' : 'Enter the details for the new customer.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="preferences">Preferences (Optional)</Label>
            <Textarea id="preferences" {...register("preferences")} className="mt-1" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{customer ? 'Save Changes' : 'Add Customer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

