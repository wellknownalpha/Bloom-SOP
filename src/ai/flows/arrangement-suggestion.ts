// arrangement-suggestion.ts
'use server';
/**
 * @fileOverview Suggests floral arrangements based on occasion, preferences, and inventory.
 *
 * - suggestArrangement - A function to generate floral arrangement suggestions.
 * - ArrangementSuggestionInput - The input type for the suggestArrangement function.
 * - ArrangementSuggestionOutput - The return type for the suggestArrangement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArrangementSuggestionInputSchema = z.object({
  occasion: z.string().describe('The occasion for the floral arrangement.'),
  customerPreferences: z.string().describe('The customer preferences for the arrangement, including colors, flower types, and style.'),
  availableInventory: z.string().describe('The available inventory of flowers, vases, and other items.'),
});
export type ArrangementSuggestionInput = z.infer<typeof ArrangementSuggestionInputSchema>;

const ArrangementSuggestionOutputSchema = z.object({
  arrangementDescription: z.string().describe('A detailed description of the suggested floral arrangement, including flower types, colors, vase type, and style.'),
  reasoning: z.string().describe('The reasoning behind the suggested arrangement based on the occasion, customer preferences and available inventory.')
});
export type ArrangementSuggestionOutput = z.infer<typeof ArrangementSuggestionOutputSchema>;

export async function suggestArrangement(input: ArrangementSuggestionInput): Promise<ArrangementSuggestionOutput> {
  return suggestArrangementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'arrangementSuggestionPrompt',
  input: {schema: ArrangementSuggestionInputSchema},
  output: {schema: ArrangementSuggestionOutputSchema},
  prompt: `You are an expert florist, skilled at creating beautiful and appropriate floral arrangements. A customer has requested a floral arrangement for a specific occasion with specific preferences, and you must suggest an arrangement based on the available inventory.

Occasion: {{{occasion}}}
Customer Preferences: {{{customerPreferences}}}
Available Inventory: {{{availableInventory}}}

Based on the information above, create a detailed description of the suggested floral arrangement, including flower types, colors, vase type, and style. Also, provide a reasoning behind the suggested arrangement based on the occasion, customer preferences and available inventory.

Follow the schema to create a detailed suggestion that is appropriate and delightful for the customer.`, 
});

const suggestArrangementFlow = ai.defineFlow(
  {
    name: 'suggestArrangementFlow',
    inputSchema: ArrangementSuggestionInputSchema,
    outputSchema: ArrangementSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
