
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ShoppingCart, PlusCircle, Trash2, CreditCard, Smartphone, DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Red Roses (Dozen)', price: 25.99, stock: 50, category: 'Flowers', imageUrl: 'https://placehold.co/300x200.png' },
  { id: '2', name: 'White Lilies (Bunch)', price: 18.50, stock: 30, category: 'Flowers', imageUrl: 'https://placehold.co/300x200.png' },
  { id: '3', name: 'Glass Vase (Medium)', price: 12.00, stock: 20, category: 'Vases', imageUrl: 'https://placehold.co/300x200.png' },
  { id: '4', name: 'Orchid Plant', price: 35.00, stock: 15, category: 'Plants', imageUrl: 'https://placehold.co/300x200.png' },
  { id: '5', name: 'Chocolates Box', price: 15.75, stock: 25, category: 'Gifts', imageUrl: 'https://placehold.co/300x200.png' },
];


export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [qrDialogTitle, setQrDialogTitle] = useState("Scan UPI QR to Pay");
  const [qrDialogDescription, setQrDialogDescription] = useState("Scan the QR code with your UPI payment app.");


  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const processSale = () => {
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items to the cart before processing sale.", variant: "destructive" });
      return;
    }

    setPaymentAmount(cartTotal);
    const saleNote = `Payment for Bloom POS - Order Total: $${cartTotal.toFixed(2)}`;

    if (paymentMethod === 'mobile') {
      // IMPORTANT: Replace 'merchant@exampleupi' with your actual UPI ID.
      const upiId = "merchant@exampleupi"; // Replace this with your UPI ID
      const merchantName = "Bloom POS"; // Can be your business name
      const currencyCode = "USD"; // Or your local currency code e.g. "INR"

      const upiData = encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${cartTotal.toFixed(2)}&cu=${currencyCode}&tn=${encodeURIComponent(saleNote)}`);
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${upiData}&qzone=1&margin=1`;
      
      setQrCodeUrl(qrUrl);
      setQrDialogTitle("Scan UPI QR to Pay");
      setQrDialogDescription("Scan the QR code with your UPI payment app.");
      setIsQrDialogOpen(true);
      toast({ title: "UPI QR Code Generated", description: "Scan the QR with your UPI app to complete payment." });
    } else {
      // Simulate sale processing for cash/card
      toast({ title: "Sale Processed!", description: `Total: $${cartTotal.toFixed(2)}. Payment via ${paymentMethod}.` });
      setCart([]); // Clear cart after successful sale
    }
  };

  const handleQrDialogClose = () => {
    setIsQrDialogOpen(false);
    // Simulate payment confirmation after QR code is shown and dialog is closed by user
    // This step assumes the user has completed the payment if 'mobile' payment was chosen.
    setCart([]); // Clear cart
    toast({ title: "Sale Completed!", description: "Thank you for your purchase. Payment presumed received." });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Process Sale"
        description="Create new sales transactions."
        icon={ShoppingCart}
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1">
                      <Image
                        src={product.imageUrl || `https://placehold.co/300x200.png`}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="h-32 w-full object-cover"
                        data-ai-hint={`${product.category === 'Vases' ? 'vase' : product.category === 'Plants' ? 'plant' : 'flower product'}`}
                      />
                      <CardHeader className="p-4">
                        <CardTitle className="text-base leading-tight mb-1">{product.name}</CardTitle>
                        <div className="flex items-baseline justify-between">
                            <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Button size="sm" className="w-full" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          <PlusCircle className="mr-2 h-4 w-4" /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {filteredProducts.length === 0 && <p className="text-center text-muted-foreground py-8">No products found.</p>}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Current Sale</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Cart is empty. <br/>Add products to start a sale.</p>
              ) : (
                <ScrollArea className="h-[300px] pr-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center w-[70px]">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[50px] text-right"><span className="sr-only">Remove</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                          <TableCell className="px-1">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                              className="h-8 w-14 text-center px-1"
                              min="0"
                              max={item.stock}
                            />
                          </TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-2xl font-bold text-primary mb-1">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="mt-6">
                <Label className="mb-2 block font-medium text-sm">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'mobile') => setPaymentMethod(value)} className="flex space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-1.5 cursor-pointer text-sm"><DollarSign className="h-4 w-4 text-muted-foreground"/> Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-1.5 cursor-pointer text-sm"><CreditCard className="h-4 w-4 text-muted-foreground"/> Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center gap-1.5 cursor-pointer text-sm"><Smartphone className="h-4 w-4 text-muted-foreground"/> Mobile UPI</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="mt-4">
              <Button className="w-full" size="lg" onClick={processSale} disabled={cart.length === 0}>
                Process Sale
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={isQrDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) { 
          handleQrDialogClose();
        } else {
          setIsQrDialogOpen(true);
        }
      }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{qrDialogTitle}</DialogTitle>
            <DialogDescription className="text-center whitespace-pre-line">
              {qrDialogDescription} <br /> Amount Due: <span className="font-bold text-lg text-primary">${paymentAmount.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6 bg-muted rounded-md my-2">
            {qrCodeUrl ? (
              <Image src={qrCodeUrl} alt="UPI Payment QR Code" width={220} height={220} data-ai-hint="payment qr code" className="rounded-md shadow-md" />
            ) : (
              <div className="h-[220px] w-[220px] flex items-center justify-center text-muted-foreground">Generating QR Code...</div>
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" onClick={handleQrDialogClose} className="w-full sm:w-auto">
              Close & Confirm Payment Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    