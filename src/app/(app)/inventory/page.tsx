import { PlusCircle, File } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryTable } from '@/components/pantrylink/inventory-table';
import { mockFoodItems } from '@/lib/data';

// In a real app, this would be a server-side fetch from a database
async function getFoodItems() {
  return mockFoodItems;
}

export default async function InventoryPage() {
  const items = await getFoodItems();

  const storedItems = items.filter((item) => item.status === 'stored');
  const allocatedItems = items.filter((item) => item.status === 'allocated');
  const expiringItems = items.filter((item) => {
    const daysUntilExpiry = differenceInDays(
      new Date(item.expirationDate),
      new Date()
    );
    return (
      daysUntilExpiry >= 0 &&
      daysUntilExpiry <= 3 &&
      item.status !== 'picked_up' &&
      item.status !== 'expired'
    );
  });

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stored">Stored</TabsTrigger>
          <TabsTrigger value="allocated">Allocated</TabsTrigger>
          <TabsTrigger value="expiring" className="text-destructive">
            Expiring Soon
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" asChild className="h-8 gap-1">
            <Link href="/inventory/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Item
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Full Inventory</CardTitle>
            <CardDescription>
              Manage your food items and view their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable items={items} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="stored">
        <Card>
          <CardHeader>
            <CardTitle>Stored Inventory</CardTitle>
            <CardDescription>
              Items currently in storage and available for allocation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable items={storedItems} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="allocated">
        <Card>
          <CardHeader>
            <CardTitle>Allocated Inventory</CardTitle>
            <CardDescription>
              Items that have been allocated to a recipient and are awaiting
              pickup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable items={allocatedItems} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="expiring">
        <Card>
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
            <CardDescription>
              These items are expiring in the next 3 days. Prioritize for
              allocation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable items={expiringItems} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
