import { Badge } from '@/components/ui/badge';
import type { FoodItemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: FoodItemStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'stored':
      case 'picked_up':
        return 'default';
      case 'allocated':
        return 'secondary';
      case 'expired':
      case 'trashed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant()} className={cn('capitalize', className)}>
      {status.replace('_', ' ')}
    </Badge>
  );
}
