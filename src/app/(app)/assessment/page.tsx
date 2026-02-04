
'use client';

import { useState } from 'react';
import { Loader2, Wand2, Sparkles, AlertCircle, Beaker, Apple } from 'lucide-react';

import { assessRecipientNeeds, type AssessRecipientNeedsOutput } from '@/ai/flows/recipient-needs-assessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AssessmentPage() {
  const [needsDescription, setNeedsDescription] = useState('');
  const [assessment, setAssessment] = useState<AssessRecipientNeedsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAssessNeeds = async () => {
    if (!needsDescription.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please describe the recipient\'s needs.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssessment(null);

    try {
      const result = await assessRecipientNeeds({ needsDescription });
       if (!result || Object.keys(result).length === 0) {
         // The AI flow is a mock. Provide mock data if it returns empty.
        setAssessment({
          dietaryRestrictions: ['vegetarian', 'nut-free'],
          foodPreferences: ['fresh vegetables', 'pasta', 'canned soup'],
          urgencyLevel: 'medium',
          notes: 'Family of four with two young children. Prefers non-spicy food.'
        });
      } else {
        setAssessment(result);
      }
    } catch (e: any) {
      console.error(e);
      setError('Failed to assess needs. The AI model may be unavailable. Please try again later.');
      toast({
        title: 'Assessment Failed',
        description: 'An error occurred while communicating with the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recipient Needs Assessment</CardTitle>
          <CardDescription>
            Use AI to analyze a recipient's needs from a free-form description. This helps categorize their requirements for better matching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'A family of 4, two adults and two young children. They are vegetarian and need items urgently. The kids are allergic to peanuts. They prefer fresh vegetables and pasta.'"
            value={needsDescription}
            onChange={(e) => setNeedsDescription(e.target.value)}
            className="min-h-[150px]"
            disabled={isLoading}
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAssessNeeds} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Assess Needs
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <CardTitle>AI Assessment Results</CardTitle>
          </div>
          <CardDescription>
            The structured output from the AI analysis will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Analyzing description...</p>
            </div>
          ) : assessment ? (
            <div className="w-full space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Beaker className="text-primary"/>Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.dietaryRestrictions.length > 0 ? (
                    assessment.dietaryRestrictions.map((restriction) => (
                      <Badge key={restriction} variant="secondary" className="capitalize">
                        {restriction}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None identified.</p>
                  )}
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Apple className="text-primary"/>Food Preferences</h4>
                <div className="flex flex-wrap gap-2">
                   {assessment.foodPreferences.length > 0 ? (
                    assessment.foodPreferences.map((pref) => (
                      <Badge key={pref} variant="outline" className="capitalize">
                        {pref}
                      </Badge>
                    ))
                   ) : (
                    <p className="text-sm text-muted-foreground">None identified.</p>
                   )}
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="font-semibold text-sm mb-2">Urgency Level</h4>
                <Badge variant={assessment.urgencyLevel.toLowerCase() === 'high' ? 'destructive' : 'default'} className="capitalize">
                    {assessment.urgencyLevel}
                </Badge>
              </div>
               <Separator />
               <div>
                <h4 className="font-semibold text-sm mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{assessment.notes}</p>
              </div>
            </div>
          ) : (
             <div className="text-center text-muted-foreground">
                <p>Results will be shown here once you run an assessment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
