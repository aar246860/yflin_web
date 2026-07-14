# 2026 SEO and AI Search Sources

This note records the external sources used to design the website exposure system on 2026-06-12.

## Official Search and Crawler Guidance

- Google Search Central, "Optimizing your website for generative AI features on Google Search"  
  URL: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide  
  Relevance: Google states that generative AI features in Search are still grounded in core Search ranking and quality systems, including retrieval-augmented generation and query fan-out. The practical implication is that the site should prioritize helpful, unique, well-structured content rather than isolated keyword pages.

- Google Search Central, "Introduction to structured data markup in Google Search"  
  URL: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data  
  Relevance: Structured data gives explicit clues about page meaning. For this site, JSON-LD should clarify the Person, WebSite, WebPage, DefinedTerm, and Article relationships around Lagging Theory.

- Google Search Central, "Introduction to robots.txt"  
  URL: https://developers.google.com/search/docs/crawling-indexing/robots/intro  
  Relevance: robots.txt controls crawler access but is not a privacy or indexing block. The site should keep public pages crawlable and avoid accidental crawler exclusions.

- OpenAI, "Overview of OpenAI Crawlers"  
  URL: https://developers.openai.com/api/docs/bots  
  Relevance: OpenAI identifies `OAI-SearchBot` as the search crawler for surfacing websites in ChatGPT search features. The site should explicitly allow it in robots.txt.

- Perplexity, "Perplexity Crawlers"  
  URL: https://docs.perplexity.ai/docs/resources/perplexity-crawlers  
  Relevance: Perplexity distinguishes `PerplexityBot` for search results from `Perplexity-User` for user-triggered fetches. Both should be allowed for public research pages.

- Bing Webmaster Tools, "IndexNow"  
  URL: https://www.bing.com/indexnow  
  Relevance: IndexNow can notify participating search engines when pages are added, updated, or removed. This is useful for a research site with frequent concept-note updates.

## AI-Readable Web Conventions

- Answer.AI, `llms.txt` proposal  
  URL: https://github.com/answerdotai/llms-txt  
  Relevance: The proposal is not a universal search-engine standard, but it is useful for AI agents because it provides a concise map of important pages and definitions.

## Research Literature

- Aggarwal et al. (2024), "GEO: Generative Engine Optimization"  
  URL: https://arxiv.org/abs/2311.09735  
  Relevance: The paper frames generative engines as systems that synthesize multiple sources and introduces visibility metrics and optimization ideas for generative responses.

- Chen et al. (2025), "Generative Engine Optimization: How to Dominate AI Search"  
  URL: https://arxiv.org/abs/2509.08919  
  Relevance: The paper reports that AI search systems favor machine-scannable, well-justified content and earned authoritative media. This supports a strategy beyond owned-site metadata.

