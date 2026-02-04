import { ChevronLeft, QrCode, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { mockFoodItems } from '@/lib/data';
import type { FoodItem } from '@/lib/types';
import { StatusBadge } from '@/components/pantrylink/status-badge';
import { format } from 'date-fns';
import { RecipientMatcher } from '@/components/pantrylink/recipient-matcher';

async function getItem(id: string): Promise<FoodItem | undefined> {
  // In a real app, fetch from DB
  return mockFoodItems.find((item) => item.id === id);
}

export default async function ItemDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getItem(params.id);

  if (!item) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Item not found</h3>
          <p className="text-sm text-muted-foreground">
            The requested food item does not exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/inventory">Back to Inventory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const qrData = encodeURIComponent(
    JSON.stringify({ itemId: item.id, claimToken: item.claimToken })
  );
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/inventory">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {item.name}
        </h1>
        <StatusBadge status={item.status} className="hidden sm:flex" />
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Update Status</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Full details for the donated item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Category</TableCell>
                    <TableCell>{item.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Weight</TableCell>
                    <TableCell>{item.weight} kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Expiration Date</TableCell>
                    <TableCell>
                      {format(new Date(item.expirationDate), 'PPP')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Condition</TableCell>
                    <TableCell className="capitalize">{item.condition}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Storage</TableCell>
                    <TableCell className="capitalize">{item.storageTemp}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Allergens</TableCell>
                    <TableCell>
                      {item.allergens.length > 0 ? (
                        item.allergens.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="mr-1 capitalize"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None specified</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dietary Tags</TableCell>
                    <TableCell>
                      {item.dietaryTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="mr-1 capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <RecipientMatcher item={item} />
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Item QR Code</CardTitle>
              <CardDescription>Scan to view item details and claim.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={150}
                height={150}
                data-ai-hint="qr code"
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <Button className="w-full" variant="outline">
                {' '}
                <QrCode className="mr-2 h-4 w-4" /> Print QR Code
              </Button>
            </CardFooter>
          </Card>
          {item.recipientId && (
            <Card>
              <CardHeader>
                <CardTitle>Allocated To</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="font-medium">Community Kitchen</div>
                <div className="text-sm text-muted-foreground">
                  Partner Organization
                </div>
                <Button size="sm" variant="outline">
                  <Truck className="mr-2 h-4 w-4" /> Mark as Picked Up
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
