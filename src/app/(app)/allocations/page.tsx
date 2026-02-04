import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function PlaceholderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocations</CardTitle>
        <CardDescription>This page is under construction.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A log of all past and current allocations will be displayed here. You will be able to track the journey of each donation from allocation to pickup.</p>
      </CardContent>
    </Card>
  );
}
