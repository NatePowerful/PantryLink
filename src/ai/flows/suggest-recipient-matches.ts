'use server';

/**
 * @fileOverview A flow to suggest recipient matches for a given food item.
 *
 * - suggestRecipientMatches - A function that suggests potential recipient or partner organizations for a given food item.
 * - SuggestRecipientMatchesInput - The input type for the suggestRecipientMatches function.
 * - SuggestRecipientMatchesOutput - The return type for the suggestRecipientMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipientMatchesInputSchema = z.object({
  foodItemId: z.string().describe('The ID of the food item to find matches for.'),
  expirationDate: z.string().describe('The expiration date of the food item (ISO format).'),
  dietaryTags: z.array(z.string()).describe('An array of dietary tags associated with the food item (e.g., vegetarian, gluten-free).'),
  weight: z.number().describe('The weight of the food item in kilograms.'),
  pickupLocation: z.object({
    latitude: z.number().describe('The latitude of the food item pickup location.'),
    longitude: z.number().describe('The longitude of the food item pickup location.'),
  }).describe('The pickup location of the food item.'),
});
export type SuggestRecipientMatchesInput = z.infer<typeof SuggestRecipientMatchesInputSchema>;

const SuggestRecipientMatchesOutputSchema = z.array(z.object({
  recipientId: z.string().describe('The ID of the potential recipient or partner organization.'),
  matchScore: z.number().describe('A score indicating how well the recipient matches the food item (higher is better).'),
  reason: z.string().describe('Explanation of why the recipient is a good match.'),
}));
export type SuggestRecipientMatchesOutput = z.infer<typeof SuggestRecipientMatchesOutputSchema>;

export async function suggestRecipientMatches(input: SuggestRecipientMatchesInput): Promise<SuggestRecipientMatchesOutput> {
  return suggestRecipientMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipientMatchesPrompt',
  input: {schema: SuggestRecipientMatchesInputSchema},
  output: {schema: SuggestRecipientMatchesOutputSchema},
  prompt: `You are an AI assistant helping staff members of a food bank to allocate food items to recipient organizations.

  Given the following information about a food item, suggest a list of potential recipient or partner organizations, ranked by how well they match the food item's characteristics.

  Food Item ID: {{{foodItemId}}}
  Expiration Date: {{{expirationDate}}}
  Dietary Tags: {{#each dietaryTags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Weight: {{{weight}}} kg
  Pickup Location: Latitude: {{{pickupLocation.latitude}}}, Longitude: {{{pickupLocation.longitude}}}

  Consider the following factors when suggesting matches:
  - Expiration date: Prioritize recipients who can use the food item before it expires.
  - Dietary constraints: Only suggest recipients whose dietary needs align with the food item's dietary tags.
  - Urgency: Prioritize recipients with urgent needs.
  - Family size/quantity fit: Suggest recipients whose needs align with the quantity of the food item.
  - Distance/pickup window: Prioritize recipients who are close to the pickup location and have a compatible pickup window.

  Return a JSON array of recipient objects, where each object has the following keys:
  - recipientId: The ID of the recipient or partner organization.
  - matchScore: A score indicating how well the recipient matches the food item (higher is better).
  - reason: A brief explanation of why the recipient is a good match.

  Make sure that the returned JSON is parseable.
  `,
});

const suggestRecipientMatchesFlow = ai.defineFlow(
  {
    name: 'suggestRecipientMatchesFlow',
    inputSchema: SuggestRecipientMatchesInputSchema,
    outputSchema: SuggestRecipientMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
