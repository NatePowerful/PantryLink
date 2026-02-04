'use client';

import { useState } from 'react';
import { Wand2, Loader2, Handshake } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  suggestRecipientMatches,
  type SuggestRecipientMatchesOutput,
} from '@/ai/flows/suggest-recipient-matches';
import type { FoodItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '../ui/badge';
import { useRole } from '@/contexts/role-context';

export function RecipientMatcher({ item }: { item: FoodItem }) {
  const [matches, setMatches] = useState<SuggestRecipientMatchesOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { role } = useRole();

  const handleFindMatches = async () => {
    setIsLoading(true);
    setError(null);
    setMatches(null);
    try {
      const result = await suggestRecipientMatches({
        foodItemId: item.id,
        expirationDate: item.expirationDate,
        dietaryTags: item.dietaryTags,
        weight: item.weight,
        pickupLocation: {
          latitude: item.pickupLocation.latitude,
          longitude: item.pickupLocation.longitude,
        },
      });
      // The AI flow is a mock. Provide mock data if it returns empty.
      if (!result || result.length === 0) {
        setMatches([
          {
            recipientId: 'Community Kitchen',
            matchScore: 95,
            reason:
              'High urgency and can handle the weight. Close proximity.',
          },
          {
            recipientId: 'Northside Shelter',
            matchScore: 80,
            reason: 'Accepts all dietary tags, but further away.',
          },
          {
            recipientId: 'Family of 4 (JDoe)',
            matchScore: 72,
            reason: 'Good fit for family size, but has conflicting pickup window.',
          },
        ]);
      } else {
        setMatches(result);
      }
    } catch (e: any) {
      console.error(e);
      setError('Failed to fetch recipient matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllocate = (recipientId: string) => {
    toast({
      title: `Allocated to ${recipientId}`,
      description: `${item.name} has been reserved.`,
    });
    // In a real app, this would call a server action to update the item
    // and lock it for the recipient.
  };

  if (role !== 'staff' && role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipient Matching</CardTitle>
        <CardDescription>
          Use AI to find the best recipient for this item based on current needs
          and logistics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleFindMatches} disabled={isLoading || item.status === 'allocated' || item.status === 'picked_up'}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Find Best Matches
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {matches && (
          <div className="grid gap-4 pt-4 md:grid-cols-2">
            {matches.map((match) => (
              <Card key={match.recipientId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {match.recipientId}
                      </CardTitle>
                      <CardDescription>
                        Match Score: {match.matchScore}/100
                      </CardDescription>
                    </div>
                    <Badge variant="default">{match.matchScore}% Match</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{match.reason}</p>
                </CardContent>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleAllocate(match.recipientId)}
                  >
                    <Handshake className="mr-2 h-4 w-4" /> Allocate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
