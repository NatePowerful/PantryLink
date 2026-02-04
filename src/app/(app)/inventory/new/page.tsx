import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FoodItemForm } from '@/components/pantrylink/food-item-form';

export default function NewInventoryItemPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Food Item</CardTitle>
        <CardDescription>
          Fill in the details of the new donation. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FoodItemForm />
      </CardContent>
    </Card>
  );
}
