'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing recipient needs using free-form text input.
 *
 * - assessRecipientNeeds - A function that assesses recipient needs based on a text description.
 * - AssessRecipientNeedsInput - The input type for the assessRecipientNeeds function.
 * - AssessRecipientNeedsOutput - The output type for the assessRecipientNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessRecipientNeedsInputSchema = z.object({
  needsDescription: z
    .string()
    .describe('A free-form text description of the recipient’s dietary restrictions, preferences, and urgency level.'),
});

export type AssessRecipientNeedsInput = z.infer<
  typeof AssessRecipientNeedsInputSchema
>;

const AssessRecipientNeedsOutputSchema = z.object({
  dietaryRestrictions: z
    .array(z.string())
    .describe('A list of dietary restrictions derived from the needs description.'),
  foodPreferences: z
    .array(z.string())
    .describe('A list of food preferences extracted from the needs description.'),
  urgencyLevel: z
    .string()
    .describe('The urgency level of the recipient’s need (e.g., high, medium, low).'),
  notes: z
    .string()
    .describe('Any additional notes or relevant information extracted from the needs description.'),
});

export type AssessRecipientNeedsOutput = z.infer<
  typeof AssessRecipientNeedsOutputSchema
>;

export async function assessRecipientNeeds(
  input: AssessRecipientNeedsInput
): Promise<AssessRecipientNeedsOutput> {
  return assessRecipientNeedsFlow(input);
}

const assessRecipientNeedsPrompt = ai.definePrompt({
  name: 'assessRecipientNeedsPrompt',
  input: {schema: AssessRecipientNeedsInputSchema},
  output: {schema: AssessRecipientNeedsOutputSchema},
  prompt: `You are an AI assistant helping to assess recipient needs for a food bank.

  Analyze the following description of the recipient’s needs to extract dietary restrictions, food preferences, urgency level, and any other relevant information.

  Recipient Needs Description: {{{needsDescription}}}

  Based on this description, identify:
  - Dietary Restrictions: A list of specific dietary restrictions (e.g., gluten-free, vegetarian, dairy-free).
  - Food Preferences: A list of preferred food items or types (e.g., fresh produce, canned goods, specific cuisines).
  - Urgency Level: An assessment of the urgency level of the recipient’s need (e.g., high, medium, low), based on the description.
  - Notes: Any additional notes or relevant information that may be helpful for matching the recipient with appropriate food donations.
  `,
});

const assessRecipientNeedsFlow = ai.defineFlow(
  {
    name: 'assessRecipientNeedsFlow',
    inputSchema: AssessRecipientNeedsInputSchema,
    outputSchema: AssessRecipientNeedsOutputSchema,
  },
  async input => {
    const {output} = await assessRecipientNeedsPrompt(input);
    return output!;
  }
);
