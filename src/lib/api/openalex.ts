export interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  doi: string | null;
  authorships: Array<{
    author: { display_name: string };
  }>;
  primary_location?: { landing_page_url?: string };
}

export const fetchOpenAlexData = async (query: string): Promise<OpenAlexWork[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    // Using OpenAlex concepts/text search API endpoint
    const res = await fetch(`https://api.openalex.org/works?search=${encodedQuery}&per-page=25`);
    if (!res.ok) throw new Error("Failed to fetch from OpenAlex");
    const data = await res.json();
    return data.results as OpenAlexWork[];
  } catch (error) {
    console.error("OpenAlex fetch error:", error);
    return [];
  }
};
