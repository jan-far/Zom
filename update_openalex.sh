cat << 'INNER_EOF' > src/lib/api/openalex.ts
export interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  doi: string | null;
  authorships: Array<{
    author: { display_name: string };
  }>;
  primary_location?: { landing_page_url?: string };
  abstract_inverted_index?: Record<string, number[]> | null;
  abstract?: string;
}

// OpenAlex provides abstracts as an inverted index. This reconstructs the text.
function reconstructAbstract(invertedIndex: Record<string, number[]> | null | undefined): string | undefined {
  if (!invertedIndex) return undefined;

  const wordEntries = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      wordEntries.push({ word, pos });
    }
  }

  wordEntries.sort((a, b) => a.pos - b.pos);
  return wordEntries.map(entry => entry.word).join(" ");
}

export const fetchOpenAlexData = async (query: string): Promise<OpenAlexWork[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    // Using OpenAlex concepts/text search API endpoint
    const res = await fetch(`https://api.openalex.org/works?search=${encodedQuery}&per-page=15`);
    if (!res.ok) throw new Error("Failed to fetch from OpenAlex");
    const data = await res.json();

    // Reconstruct abstracts for all works
    return (data.results as OpenAlexWork[]).map(work => ({
      ...work,
      abstract: reconstructAbstract(work.abstract_inverted_index)
    }));
  } catch (error) {
    console.error("OpenAlex fetch error:", error);
    return [];
  }
};
INNER_EOF
