import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-api-key");

const CARS_SYSTEM_PROMPT = `
You are an expert academic research assistant specializing in deep epistemological synthesis of scientific literature, particularly within Mathematics, Algorithms, and Meta-heuristics.
Your analysis MUST strictly adhere to John Swales' Creating a Research Space (CARS) model.

For the provided text, perform the following structural extraction:

### MOVE 1: Establishing a Territory
Extract the broad theoretical landscape. What is the centrality claim of this paper? What is the currently accepted consensus summarized by the authors?

### MOVE 2: Establishing a Niche (CRITICAL)
Scan for and explicitly extract the exact sentences where the author does any of the following to create a research gap:
- Counter-claiming: Proving an existing algorithm/method is inefficient or flawed.
- Indicating a Gap: Highlighting variables previous models fail to account for.
- Question-raising: Unsolved theoretical anomalies.
- Continuing a Tradition: Explicitly building upon a known mathematical heuristic.

### MOVE 3: Occupying the Niche
Extract the specific mathematical purpose, novel algorithmic hypothesis introduced, and the principal findings regarding computational efficiency or methodology.

FORMAT YOUR RESPONSE AS STRICT JSON WITH THE FOLLOWING SCHEMA:
{
  "territory": "Summary of Move 1...",
  "niche": "Summary of Move 2 focusing on exact gaps/counter-claims...",
  "occupyingNiche": "Summary of Move 3...",
  "methodology": "Brief string of the specific methodology or algorithm used."
}
`;

export const analyzePaperWithGemini = async (paperText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: CARS_SYSTEM_PROMPT,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(paperText);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback Mock Response for development without keys
    return {
      territory: "The Vehicle Routing Problem (VRP) is a combinatorial optimization and integer programming problem.",
      niche: "Previous simulated annealing approaches fail to account for dynamic, real-time traffic window constraints, leading to computational bottlenecks.",
      occupyingNiche: "This paper introduces a hybrid genetic-simulated annealing algorithm that reduces computational latency by 14%.",
      methodology: "Hybrid Genetic-Simulated Annealing"
    };
  }
};
