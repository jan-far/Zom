"use client";

import { useAuth, signInWithGoogle } from "@/lib/firebase/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  if (user && !loading) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 selection:bg-primary-200 selection:text-primary-900">
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">Episteme</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
              <div className="mt-24 sm:mt-32 lg:mt-16">
                <span className="rounded-full bg-accent-100/50 dark:bg-accent-900/20 px-3 py-1 text-sm font-semibold leading-6 text-accent-700 dark:text-accent-400 ring-1 ring-inset ring-accent-500/20">
                  Built for Doctoral Research
                </span>
              </div>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
                Synthesize literature with unprecedented clarity.
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                An advanced platform mapping the epistemological topology of academic literature. Grounded in the CARS framework, we help you pinpoint exact research gaps, methodological contradictions, and theoretical niches across vast corpuses.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button
                  onClick={handleSignIn}
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Start Synthesizing
                </button>
                <a href="#features" className="text-sm font-semibold leading-6 text-neutral-900 dark:text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <div className="relative rounded-xl bg-neutral-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-neutral-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 shadow-2xl">
                  {/* Mock Interface Visual */}
                  <div className="w-[800px] h-[500px] rounded-md bg-white dark:bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
                    <div className="h-10 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-accent-400"></div>
                      <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                    </div>
                    <div className="flex-1 flex p-4 gap-4 bg-neutral-50 dark:bg-neutral-950">
                      <div className="w-1/3 space-y-3">
                        <div className="h-20 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3">
                          <div className="h-2 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded mb-1"></div>
                          <div className="h-2 w-4/5 bg-neutral-100 dark:bg-neutral-800/50 rounded"></div>
                        </div>
                        <div className="h-20 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 ring-1 ring-primary-500">
                          <div className="h-2 w-1/2 bg-primary-200 dark:bg-primary-900 rounded mb-2"></div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded mb-1"></div>
                          <div className="h-2 w-2/3 bg-neutral-100 dark:bg-neutral-800/50 rounded"></div>
                        </div>
                        <div className="h-20 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3">
                          <div className="h-2 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded mb-1"></div>
                          <div className="h-2 w-3/4 bg-neutral-100 dark:bg-neutral-800/50 rounded"></div>
                        </div>
                      </div>
                      <div className="w-2/3 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center relative overflow-hidden">
                        {/* Mock Nodes */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center"></div>
                        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full border-2 border-accent-500 bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center"></div>
                        {/* Mock Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                          <line x1="30%" y1="30%" x2="70%" y2="40%" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300 dark:text-neutral-700" />
                          <line x1="30%" y1="30%" x2="40%" y2="70%" stroke="currentColor" strokeWidth="1.5" className="text-primary-300 dark:text-primary-800" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="py-24 sm:py-32 bg-white dark:bg-black">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Advanced Research Pipeline</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                Everything you need to map your domain
              </p>
              <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                From ingestion to publication, Episteme streamlines the entire literature review lifecycle using established epistemological frameworks.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-neutral-900 dark:text-white">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    Deep Context Ingestion
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-neutral-600 dark:text-neutral-400">
                    <p className="flex-auto">Federated search across premium databases (Scopus) and open-access repositories (OpenAlex) using advanced Boolean logic to build highly curated datasets.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-neutral-900 dark:text-white">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/30">
                      <svg className="h-6 w-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    CARS Model AI Extraction
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-neutral-600 dark:text-neutral-400">
                    <p className="flex-auto">Leveraging large context windows, we extract exact rhetorical moves—counter-claims, methodological gaps, and tradition continuation—following John Swales' academic framework.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-neutral-900 dark:text-white">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <svg className="h-6 w-6 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    Interactive Topology Graph
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-neutral-600 dark:text-neutral-400">
                    <p className="flex-auto">Visualize semantic similarities and theoretical lineage across your literature using high-performance force-directed graphs powered by D3.js and React Flow.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}