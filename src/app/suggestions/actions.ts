// src/app/suggestions/actions.ts
'use server';
import { suggestArrangement, type ArrangementSuggestionInput, type ArrangementSuggestionOutput } from '@/ai/flows/arrangement-suggestion';
import { z } from 'zod';

// Define the input schema for validation on the server action side as well
// This should match ArrangementSuggestionInputSchema from the AI flow.
const ActionInputSchema = z.object({
  occasion: z.string().min(1, { message: "Occasion is required." }),
  customerPreferences: z.string().min(1, { message: "Customer preferences are required." }),
  availableInventory: z.string().min(1, { message: "Available inventory is required." }),
});

export interface SuggestionFormState {
  message: string | null;
  fields?: Record<string, string>;
  issues?: string[];
  data?: ArrangementSuggestionOutput;
}

export async function getArrangementSuggestion(
  prevState: SuggestionFormState,
  formData: FormData
): Promise<SuggestionFormState> {
  const rawFormData = {
    occasion: formData.get('occasion'),
    customerPreferences: formData.get('customerPreferences'),
    availableInventory: formData.get('availableInventory'),
  };

  const validatedFields = ActionInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: "Validation failed. Please check the form fields.",
      fields: rawFormData as Record<string, string>,
      issues: issues,
    };
  }

  try {
    const result = await suggestArrangement(validatedFields.data as ArrangementSuggestionInput);
    return { message: "Suggestion generated successfully!", data: result };
  } catch (error) {
    console.error("Error in arrangement suggestion action:", error);
    let errorMessage = "Failed to generate suggestion. Please try again.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { message: errorMessage };
  }
}
