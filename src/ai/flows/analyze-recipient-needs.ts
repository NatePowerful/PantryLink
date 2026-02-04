'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing recipient needs using an LLM.
 *
 * - analyzeRecipientNeeds - A function that analyzes recipient needs and returns an assessment.
 * - AnalyzeRecipientNeedsInput - The input type for the analyzeRecipientNeeds function.
 * - AnalyzeRecipientNeedsOutput - The output type for the analyzeRecipientNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRecipientNeedsInputSchema = z.object({
  recipientInfo: z
    .string()
    .describe('Information about the recipient, including family size, dietary restrictions, and urgency of need.'),
  foodItemInfo: z
    .string()
    .describe('Information about the available food items, including expiration date, category, and quantity.'),
});

export type AnalyzeRecipientNeedsInput = z.infer<
  typeof AnalyzeRecipientNeedsInputSchema
>;

const AnalyzeRecipientNeedsOutputSchema = z.object({
  suitabilityScore: z
    .number()
    .describe('A score indicating how well the food items match the recipient needs (0-100).'),
  recommendationRationale: z
    .string()
    .describe('A detailed explanation of why the food items are or are not a good match for the recipient.'),
  suggestedAdjustments: z
    .string()
    .optional()
    .describe('Suggestions for adjusting the food items or recipient criteria to improve the match.'),
});

export type AnalyzeRecipientNeedsOutput = z.infer<
  typeof AnalyzeRecipientNeedsOutputSchema
>;

export async function analyzeRecipientNeeds(
  input: AnalyzeRecipientNeedsInput
): Promise<AnalyzeRecipientNeedsOutput> {
  return analyzeRecipientNeedsFlow(input);
}

const analyzeRecipientNeedsPrompt = ai.definePrompt({
  name: 'analyzeRecipientNeedsPrompt',
  input: {schema: AnalyzeRecipientNeedsInputSchema},
  output: {schema: AnalyzeRecipientNeedsOutputSchema},
  prompt: `You are an AI assistant helping to match food donations with recipients in need.

  Analyze the following information about the recipient and available food items to determine how well they match.
  Provide a suitability score (0-100), a detailed rationale, and suggestions for improvement.

  Recipient Information: {{{recipientInfo}}}
  Food Item Information: {{{foodItemInfo}}}

  Consider factors such as dietary restrictions, expiration dates, quantity, and recipient urgency.
  Be specific in your rationale, explaining which factors contribute most to the suitability score.
  If the match is not ideal, suggest adjustments to either the food items (e.g., combining items, adjusting quantities) or recipient criteria (e.g., relaxing dietary restrictions if possible) to improve the match.
  `,
});

const analyzeRecipientNeedsFlow = ai.defineFlow(
  {
    name: 'analyzeRecipientNeedsFlow',
    inputSchema: AnalyzeRecipientNeedsInputSchema,
    outputSchema: AnalyzeRecipientNeedsOutputSchema,
  },
  async input => {
    const {output} = await analyzeRecipientNeedsPrompt(input);
    return output!;
  }
);
