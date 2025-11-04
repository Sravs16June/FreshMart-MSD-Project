import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChefHat, Sparkles, Loader2, Mic, MicOff, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { generateRecipe as generateRecipeApi } from "@/lib/api";

const Recipes = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, startListening, stopListening } = useVoiceRecognition((transcript) => {
    setIngredients((prev) => (prev ? `${prev}, ${transcript}` : transcript));
    toast({
      title: "Voice input received",
      description: transcript,
    });
  });

  const suggestions = [
    "Chicken, tomatoes, garlic, olive oil",
    "Pasta, cream, mushrooms, parmesan",
    "Eggs, milk, cheese, bread",
    "Rice, vegetables, soy sauce",
  ];

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    toast({
      title: "Feature not available",
      description: "Image ingredient analysis will be added soon.",
    });
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe("");

    try {
      const { recipe } = await generateRecipeApi(ingredients.trim());
      setRecipe(recipe);
      toast({
        title: "Recipe generated!",
        description: "Your custom recipe is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to generate recipe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <ChefHat className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Recipe Generator</h1>
          <p className="text-muted-foreground text-lg">Enter your available ingredients and let AI create a delicious recipe for you</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Your Ingredients</CardTitle>
            <p className="text-sm text-muted-foreground">List the ingredients you have available (separate with commas)</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Textarea placeholder="e.g., chicken breast, tomatoes, garlic, olive oil, basil..." value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="min-h-[120px] resize-none pr-24" />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Try these suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setIngredients(suggestion)}>{suggestion}</Badge>
                ))}
              </div>
            </div>
            <Button size="lg" className="w-full" disabled={!ingredients.trim() || loading} onClick={generateRecipe}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              Generate Recipe
            </Button>
          </CardContent>
        </Card>

        {recipe && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Your Recipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">{recipe}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recipes;
