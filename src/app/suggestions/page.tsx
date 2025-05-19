"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Sparkles, AlertTriangle } from "lucide-react";
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
      {pending ? "Generating Suggestion..." : "Get Suggestion"}
      <Sparkles className="ml-2 h-4 w-4" />
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

        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle>AI Suggestion</CardTitle>
            <CardDescription>Here's what our AI florist recommends:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.data ? (
              <>
                <div>
                  <h3 className="font-semibold text-lg">Arrangement Description:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.data.arrangementDescription}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reasoning:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground italic">
                {state.message && !state.data ? "Could not generate suggestion due to an error." : "Your suggestion will appear here once generated."}
              </p>
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
