"use client";
import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LearnForgeAi() {
  const [taskType, setTaskType] = useState<"search-suggestions" | "personalized-recommendations">("search-suggestions");
  const [userInput, setUserInput] = useState("");
  const [userContext, setUserContext] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/ai/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType, userInput, userContext }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-primary/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-blue-500/5 z-0 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors z-0" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight">LearnForge AI</h2>
            <p className="text-sm text-muted-foreground">Smart Tutor Matching & Suggestions</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3 bg-muted p-1.5 rounded-2xl">
            <Button 
              variant={taskType === "search-suggestions" ? "default" : "ghost"}
              onClick={() => { setTaskType("search-suggestions"); setResults([]); }}
              className={`flex-1 rounded-xl h-11 text-sm font-semibold transition-all ${taskType === "search-suggestions" ? "shadow-sm" : "hover:bg-background/50"}`}
            >
              Smart Search
            </Button>
            <Button 
              variant={taskType === "personalized-recommendations" ? "default" : "ghost"}
              onClick={() => { setTaskType("personalized-recommendations"); setResults([]); }}
              className={`flex-1 rounded-xl h-11 text-sm font-semibold transition-all ${taskType === "personalized-recommendations" ? "shadow-sm" : "hover:bg-background/50"}`}
            >
              AI Tutor Match
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder={taskType === "search-suggestions" ? "What do you want to learn? (e.g. Math, Python)" : "What are your learning goals?"}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="pl-12 h-14 text-base rounded-2xl bg-background border-primary/10 focus-visible:border-primary/30"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {taskType === "personalized-recommendations" && (
              <Input 
                placeholder="Any specific context? (e.g. preparing for exams, beginner)"
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                className="h-14 text-base rounded-2xl bg-background border-primary/10 focus-visible:border-primary/30"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}

            <Button 
              onClick={handleSearch} 
              disabled={loading || !userInput.trim()} 
              className="w-full h-14 text-base font-bold gap-2 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate {taskType === "search-suggestions" ? "Suggestions" : "Matches"}</>
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                {taskType === "search-suggestions" ? "Popular Searches" : "Recommended for you"}
              </h3>
              <ul className="grid gap-3">
                {results.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-background hover:bg-muted/50 rounded-xl border border-border/50 transition-colors cursor-pointer group">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {taskType === "search-suggestions" ? (
                        <Search className="w-3 h-3 text-primary" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
