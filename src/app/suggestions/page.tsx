
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Sparkles, AlertTriangle, Bot } from "lucide-react";
import { getArrangementSuggestion, type SuggestionFormState } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: SuggestionFormState = {
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Suggestion...
        </>
      ) : (
        <>
          Get Suggestion <Sparkles className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function SuggestionsPage() {
  const [state, formAction] = useFormState(getArrangementSuggestion, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.data) {
      toast({
        title: "Suggestion Ready!",
        description: state.message,
      });
    } else if (state.message && (state.issues || !state.data)) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <>
      <PageHeader
        title="Arrangement Suggestions"
        description="Let AI help you craft the perfect floral arrangement."
        icon={Lightbulb}
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Needs</CardTitle>
            <CardDescription>Provide details to get the best suggestion.</CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="occasion">Occasion</Label>
                <Input id="occasion" name="occasion" placeholder="e.g., Birthday, Anniversary, Sympathy" className="mt-1" defaultValue={state.fields?.occasion} />
                {state.issues && state.fields?.occasion !== undefined && state.issues.find(issue => issue.toLowerCase().includes('occasion')) && (
                   <p className="text-sm text-destructive mt-1">{state.issues.find(issue => issue.toLowerCase().includes('occasion'))}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerPreferences">Customer Preferences</Label>
                <Textarea
                  id="customerPreferences"
                  name="customerPreferences"
                  placeholder="e.g., Likes roses and lilies, prefers bright colors, modern style"
                  className="mt-1"
                  rows={3}
                  defaultValue={state.fields?.customerPreferences}
                />
                 {state.issues && state.fields?.customerPreferences !== undefined && state.issues.find(issue => issue.toLowerCase().includes('preferences')) && (
                   <p className="text-sm text-destructive mt-1">{state.issues.find(issue => issue.toLowerCase().includes('preferences'))}</p>
                )}
              </div>
              <div>
                <Label htmlFor="availableInventory">Available Inventory</Label>
                <Textarea
                  id="availableInventory"
                  name="availableInventory"
                  placeholder="e.g., Red roses, white lilies, eucalyptus, glass vases"
                  className="mt-1"
                  rows={4}
                  defaultValue={state.fields?.availableInventory}
                />
                {state.issues && state.fields?.availableInventory !== undefined && state.issues.find(issue => issue.toLowerCase().includes('inventory')) && (
                   <p className="text-sm text-destructive mt-1">{state.issues.find(issue => issue.toLowerCase().includes('inventory'))}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary"/> AI Suggestion
            </CardTitle>
            <CardDescription>Here's what our AI florist recommends:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.data ? (
              <>
                <div>
                  <h3 className="font-semibold text-lg">Arrangement Description:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.data.arrangementDescription}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">Reasoning:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                <Sparkles className="h-12 w-12 mb-3 text-primary/50" />
                <p className="italic">
                  {state.message && !state.data ? "Could not generate suggestion due to an error." : "Your suggestion will appear here once generated."}
                </p>
              </div>
              
            )}
            {state.message && !state.data && state.issues && (
              <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Input Error</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {state.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    