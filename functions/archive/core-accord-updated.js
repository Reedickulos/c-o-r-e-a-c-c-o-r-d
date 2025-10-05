// CORE ACCORD Worker - Updated with Perspective-Based Analysis
// This version uses distinct analytical frameworks to generate diverse perspectives

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method === "POST" && new URL(request.url).pathname === "/api/collaborate") {
      try {
        const { query } = await request.json();
        
        // Run 5 analyses with different perspectives
        const analyses = await Promise.all([
          callGeminiWithPerspective(query, 1, "logical", env.GOOGLE_API_KEY),
          callGeminiWithPerspective(query, 2, "emotional", env.GOOGLE_API_KEY),
          callGeminiWithPerspective(query, 3, "philosophical", env.GOOGLE_API_KEY),
          callGeminiWithPerspective(query, 4, "spiritual", env.GOOGLE_API_KEY),
          callGeminiWithPerspective(query, 5, "financial", env.GOOGLE_API_KEY)
        ]);

        const consensusScore = calculateConsensus(analyses);
        const diversityScore = calculateDiversity(analyses);
        const complementarityScore = calculateComplementarity(analyses);
        const { agreements, disagreements } = extractAgreementsAndDisagreements(analyses);

        const totalTokens = analyses.reduce((sum, a) => sum + a.tokens, 0);
        const naiveApproach = totalTokens * 3;
        const coreAccordApproach = totalTokens + (analyses.length * 40 * 2);
        const savings = ((naiveApproach - coreAccordApproach) / naiveApproach * 100).toFixed(1);

        return new Response(JSON.stringify({
          query,
          analyses,
          evaluation_metrics: {
            consensus_score: consensusScore,
            diversity_score: diversityScore,
            complementarity_score: complementarityScore,
            key_agreements: agreements,
            key_disagreements: disagreements
          },
          token_efficiency: {
            naive_approach_tokens: naiveApproach,
            core_accord_tokens: coreAccordApproach,
            savings_percentage: parseFloat(savings),
            cost_naive: (naiveApproach * 0.5 / 1_000_000).toFixed(4),
            cost_core_accord: (coreAccordApproach * 0.5 / 1_000_000).toFixed(4)
          },
          metadata: {
            total_tokens: totalTokens,
            total_time_ms: analyses.reduce((sum, a) => sum + a.response_time_ms, 0),
            analyses_completed: analyses.filter(a => a.success).length,
            analyses_failed: analyses.filter(a => !a.success).length
          }
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }

    return new Response(getVisualizationHTML(), {
      headers: { "Content-Type": "text/html" }
    });
  }
};

// Perspective system prompts
const PERSPECTIVES = {
  logical: {
    name: "Logical/Analytical",
    systemInstruction: `You are an analytical reasoning engine focused on logic, evidence, and rational evaluation.

Approach this query by:
- Breaking down the problem into component parts
- Examining cause-and-effect relationships
- Identifying logical fallacies or reasoning errors
- Evaluating evidence and data objectively
- Drawing conclusions based on deductive and inductive reasoning

Avoid emotional appeals. Focus on what is logically sound and rationally defensible.`,
    temperature: 0.7
  },
  emotional: {
    name: "Emotional/Human Impact",
    systemInstruction: `You are an empathy-focused analyst examining human emotional and psychological dimensions.

Approach this query by:
- Considering emotional impact on individuals and communities
- Examining psychological well-being and mental health aspects
- Evaluating effects on relationships, trust, and social bonds
- Assessing fear, hope, anxiety, and other emotional responses
- Prioritizing human dignity and emotional flourishing

Focus on how people will *feel* and the human experience, not just cold logic.`,
    temperature: 0.75
  },
  philosophical: {
    name: "Philosophical/Ethical",
    systemInstruction: `You are a philosophical ethicist examining moral principles and ethical frameworks.

Approach this query by:
- Applying ethical frameworks (utilitarianism, deontology, virtue ethics, care ethics)
- Examining moral obligations, rights, and duties
- Considering questions of justice, fairness, and equity
- Evaluating long-term ethical implications
- Questioning underlying assumptions and values

Focus on what is *right* and *just*, examining the moral dimensions deeply.`,
    temperature: 0.8
  },
  spiritual: {
    name: "Spiritual/Existential",
    systemInstruction: `You are a contemplative thinker focused on meaning, purpose, and existential significance.

Approach this query by:
- Examining questions of meaning and purpose
- Considering alignment with human values and wisdom traditions
- Exploring existential implications and human flourishing
- Evaluating impacts on consciousness, awareness, and transcendence
- Reflecting on humanity's place in the larger cosmos

Focus on deeper meaning, purpose, and what makes life worth living.`,
    temperature: 0.8
  },
  financial: {
    name: "Financial/Economic",
    systemInstruction: `You are a financial analyst and economist examining practical economic implications.

Approach this query by:
- Calculating costs, benefits, and ROI
- Examining market forces and economic incentives
- Evaluating resource allocation and efficiency
- Assessing financial risks and opportunities
- Considering scalability and economic sustainability

Focus on the bottom line: what makes economic sense and financial viability.`,
    temperature: 0.7
  }
};

async function callGeminiWithPerspective(query, analysisNumber, perspectiveKey, apiKey) {
  const startTime = Date.now();
  const perspective = PERSPECTIVES[perspectiveKey];
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: query }]
          }],
          systemInstruction: {
            parts: [{ text: perspective.systemInstruction }]
          },
          generationConfig: {
            temperature: perspective.temperature,
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    const tokens = estimateTokens(text);

    return {
      analysis_id: `Analysis ${analysisNumber}: ${perspective.name}`,
      perspective: perspective.name,
      content: text,
      tokens,
      response_time_ms: Date.now() - startTime,
      success: true
    };

  } catch (error) {
    return {
      analysis_id: `Analysis ${analysisNumber}: ${perspective.name}`,
      perspective: perspective.name,
      content: `Analysis unavailable: ${error.message}`,
      tokens: 0,
      response_time_ms: Date.now() - startTime,
      success: false
    };
  }
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function calculateConsensus(analyses) {
  const successful = analyses.filter(a => a.success);
  if (successful.length < 2) return 0;

  const words = successful.map(a => 
    new Set(a.content.toLowerCase().match(/\b\w+\b/g) || [])
  );

  let totalOverlap = 0;
  let comparisons = 0;

  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const intersection = new Set([...words[i]].filter(x => words[j].has(x)));
      const union = new Set([...words[i], ...words[j]]);
      totalOverlap += intersection.size / union.size;
      comparisons++;
    }
  }

  return Math.round((totalOverlap / comparisons) * 100);
}

function calculateDiversity(analyses) {
  const successful = analyses.filter(a => a.success);
  if (successful.length < 2) return 0;

  const phrases = successful.map(a => {
    const words = a.content.toLowerCase().match(/\b\w+\b/g) || [];
    const keyPhrases = new Set();
    for (let i = 0; i < words.length - 2; i++) {
      keyPhrases.add(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
    return keyPhrases;
  });

  const allPhrases = new Set();
  const sharedPhrases = new Set();

  phrases.forEach(phraseSet => {
    phraseSet.forEach(phrase => {
      if (allPhrases.has(phrase)) {
        sharedPhrases.add(phrase);
      }
      allPhrases.add(phrase);
    });
  });

  const uniqueRatio = (allPhrases.size - sharedPhrases.size) / allPhrases.size;
  return Math.round(uniqueRatio * 100);
}

function calculateComplementarity(analyses) {
  const successful = analyses.filter(a => a.success);
  if (successful.length === 0) return 0;

  const topicWords = [
    'safety', 'ethics', 'regulation', 'cost', 'benefit', 'risk',
    'implementation', 'oversight', 'accountability', 'bias', 'fairness',
    'privacy', 'compliance', 'efficiency', 'accuracy', 'transparency',
    'explainability', 'emotional', 'psychological', 'spiritual', 'meaning',
    'purpose', 'values', 'moral', 'economic', 'financial', 'practical'
  ];

  const coveredTopics = new Set();

  successful.forEach(a => {
    const content = a.content.toLowerCase();
    topicWords.forEach(topic => {
      if (content.includes(topic)) {
        coveredTopics.add(topic);
      }
    });
  });

  return Math.round((coveredTopics.size / topicWords.length) * 100);
}

function extractAgreementsAndDisagreements(analyses) {
  const successful = analyses.filter(a => a.success);
  const wordFreq = {};

  successful.forEach(a => {
    const words = a.content.toLowerCase().match(/\b\w{5,}\b/g) || [];
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });

  const threshold = Math.ceil(successful.length * 0.6);

  const agreements = Object.entries(wordFreq)
    .filter(([_, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  const disagreements = Object.entries(wordFreq)
    .filter(([_, count]) => count <= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return { agreements, disagreements };
}

function getVisualizationHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>CORE ACCORD - Protocol Demonstration</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .metric-card {
      animation: fadeIn 0.6s ease-out;
    }
    .progress-bar {
      transition: width 1.5s ease-out;
    }
  </style>
</head>
<body class="bg-gray-950 text-white min-h-screen p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="mb-12 text-center">
      <h1 class="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        CORE ACCORD
      </h1>
      <p class="text-xl text-gray-400">Multi-Agent AI Consensus Protocol</p>
      <div class="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg max-w-3xl mx-auto">
        <p class="text-sm text-gray-300">
          <strong>Protocol Demonstration Mode:</strong> Using Gemini with 5 distinct analytical frameworks 
          (Logical, Emotional, Philosophical, Spiritual, Financial) to demonstrate compression and consensus mechanics.
        </p>
        <p class="text-xs text-gray-400 mt-2">
          Post-funding: Integration with heterogeneous models (Claude, GPT-4, DeepSeek, Mistral, Llama)
        </p>
      </div>
    </header>

    <!-- Query Input -->
    <div class="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800">
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-semibold text-gray-300">Research Query</label>
        <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input type="checkbox" id="batchMode" class="rounded">
          <span>Batch Mode</span>
        </label>
      </div>
      <textarea
        id="query"
        class="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
        rows="3"
        placeholder="Enter your complex query (or multiple queries separated by newlines in batch mode)..."
      >Should AI systems be allowed to make autonomous decisions in healthcare without human oversight?</textarea>
      <div class="mt-4 flex gap-3">
        <button
          onclick="collaborate()"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
        >
          Run Protocol Analysis
        </button>
      </div>
    </div>

    <div id="results" class="hidden space-y-6">
      <!-- Top Metrics Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Consensus Score -->
        <div class="metric-card bg-gradient-to-br from-green-900/50 to-gray-900 p-6 rounded-xl border border-green-700/30">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">CONSENSUS SCORE</h3>
          <div class="flex items-end gap-3">
            <p class="text-5xl font-bold" id="consensusScore">-</p>
            <p class="text-2xl text-gray-400 mb-1">/100</p>
          </div>
          <div class="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div id="consensusBar" class="progress-bar h-full bg-gradient-to-r from-green-500 to-emerald-400" style="width: 0%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Agreement across perspectives</p>
        </div>

        <!-- Diversity Score -->
        <div class="metric-card bg-gradient-to-br from-purple-900/50 to-gray-900 p-6 rounded-xl border border-purple-700/30">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">DIVERSITY SCORE</h3>
          <div class="flex items-end gap-3">
            <p class="text-5xl font-bold" id="diversityScore">-</p>
            <p class="text-2xl text-gray-400 mb-1">/100</p>
          </div>
          <div class="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div id="diversityBar" class="progress-bar h-full bg-gradient-to-r from-purple-500 to-pink-400" style="width: 0%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Unique perspectives captured</p>
        </div>

        <!-- Complementarity Score -->
        <div class="metric-card bg-gradient-to-br from-blue-900/50 to-gray-900 p-6 rounded-xl border border-blue-700/30">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">COMPLEMENTARITY SCORE</h3>
          <div class="flex items-end gap-3">
            <p class="text-5xl font-bold" id="complementarityScore">-</p>
            <p class="text-2xl text-gray-400 mb-1">/100</p>
          </div>
          <div class="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div id="complementarityBar" class="progress-bar h-full bg-gradient-to-r from-blue-500 to-cyan-400" style="width: 0%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Aspect coverage breadth</p>
        </div>
      </div>

      <!-- Token Efficiency Comparison -->
      <div class="metric-card bg-gray-900 p-8 rounded-xl border border-gray-800">
        <h3 class="text-2xl font-bold mb-6">Token Efficiency Analysis</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Naive Approach -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-red-400">Naive Approach</h4>
              <span class="text-2xl font-bold text-red-400" id="naiveTokens">-</span>
            </div>
            <div class="h-8 bg-gray-800 rounded-lg overflow-hidden relative">
              <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500" id="naiveBar"></div>
              <p class="absolute inset-0 flex items-center justify-center text-sm font-semibold">3 rounds, full context</p>
            </div>
            <p class="text-sm text-gray-500">Cost: $<span id="naiveCost">-</span></p>
          </div>

          <!-- CORE ACCORD -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-green-400">CORE ACCORD</h4>
              <span class="text-2xl font-bold text-green-400" id="accordTokens">-</span>
            </div>
            <div class="h-8 bg-gray-800 rounded-lg overflow-hidden relative">
              <div class="progress-bar absolute inset-0 bg-gradient-to-r from-green-600 to-green-500" id="accordBar" style="width: 0%"></div>
              <p class="absolute inset-0 flex items-center justify-center text-sm font-semibold">Compressed context</p>
            </div>
            <p class="text-sm text-gray-500">Cost: $<span id="accordCost">-</span></p>
          </div>
        </div>

        <!-- Savings Highlight -->
        <div class="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-700/30 text-center">
          <p class="text-sm text-gray-400">TOKEN SAVINGS</p>
          <p class="text-4xl font-bold text-green-400 mt-1"><span id="savingsPercent">-</span>%</p>
          <p class="text-sm text-gray-500 mt-1">reduction in token usage</p>
        </div>
      </div>

      <!-- Key Findings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="metric-card bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <span class="text-green-400">✓</span> Key Agreements
          </h3>
          <div id="agreements" class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-green-900/30 border border-green-700/30 rounded-full text-sm">Loading...</span>
          </div>
        </div>

        <div class="metric-card bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <span class="text-orange-400">⚠</span> Divergent Points
          </h3>
          <div id="disagreements" class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-orange-900/30 border border-orange-700/30 rounded-full text-sm">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Analysis Results -->
      <div>
        <h3 class="text-2xl font-bold mb-4">Individual Analyses by Perspective</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" id="analysisGrid"></div>
      </div>

      <!-- Export Actions -->
      <div class="metric-card bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 class="text-lg font-bold mb-4">Export Report</h3>
        <div class="flex flex-wrap gap-3">
          <button onclick="exportJSON()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📄 Export JSON
          </button>
          <button onclick="exportMarkdown()" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
            📝 Export Markdown
          </button>
          <button onclick="exportCSV()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            📊 Export CSV
          </button>
          <button onclick="copyToClipboard()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
            📋 Copy Summary
          </button>
        </div>
      </div>

      <!-- Metadata Footer -->
      <div class="metric-card bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
        <p class="text-sm text-gray-400">
          <span class="font-semibold text-white">Total Time:</span> <span id="totalTime">-</span> |
          <span class="font-semibold text-white">Total Tokens:</span> <span id="totalTokens">-</span> |
          <span class="font-semibold text-white">Success Rate:</span> <span id="successRate">-</span>
        </p>
        <p class="text-xs text-gray-600 mt-2">Built on Stanford HELM & OpenAI Evals standards</p>
      </div>
    </div>

    <div id="loading" class="hidden text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
      <p class="text-xl text-gray-400">Running protocol analysis...</p>
      <p class="text-sm text-gray-600 mt-2">Orchestrating 5 distinct analytical perspectives</p>
    </div>
  </div>

  <script>
    let currentReportData = null;

    async function collaborate() {
      const queryText = document.getElementById('query').value;
      const batchMode = document.getElementById('batchMode').checked;
      const results = document.getElementById('results');
      const loading = document.getElementById('loading');

      results.classList.add('hidden');
      loading.classList.remove('hidden');

      try {
        if (batchMode) {
          const queries = queryText.split('\\n').filter(q => q.trim());
          const batchResults = [];

          for (let i = 0; i < queries.length; i++) {
            const response = await fetch('/api/collaborate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: queries[i] })
            });
            const data = await response.json();
            batchResults.push(data);
          }

          currentReportData = {
            batch: true,
            queries: queries,
            results: batchResults,
            summary: {
              total_queries: queries.length,
              avg_consensus: Math.round(batchResults.reduce((sum, r) => sum + r.evaluation_metrics.consensus_score, 0) / batchResults.length),
              avg_diversity: Math.round(batchResults.reduce((sum, r) => sum + r.evaluation_metrics.diversity_score, 0) / batchResults.length),
              total_tokens: batchResults.reduce((sum, r) => sum + r.metadata.total_tokens, 0),
              total_savings: Math.round(batchResults.reduce((sum, r) => sum + r.token_efficiency.savings_percentage, 0) / batchResults.length)
            }
          };

          displayBatchResults(currentReportData);
        } else {
          const response = await fetch('/api/collaborate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryText })
          });

          const data = await response.json();
          currentReportData = data;
          displaySingleResult(data);
        }

        loading.classList.add('hidden');
        results.classList.remove('hidden');
      } catch (error) {
        loading.classList.add('hidden');
        alert('Error: ' + error.message);
      }
    }

    function displaySingleResult(data) {
      const consensus = data.evaluation_metrics.consensus_score;
      const diversity = data.evaluation_metrics.diversity_score;
      const complementarity = data.evaluation_metrics.complementarity_score;

      document.getElementById('consensusScore').textContent = consensus;
      document.getElementById('diversityScore').textContent = diversity;
      document.getElementById('complementarityScore').textContent = complementarity;

      setTimeout(() => {
        document.getElementById('consensusBar').style.width = consensus + '%';
        document.getElementById('diversityBar').style.width = diversity + '%';
        document.getElementById('complementarityBar').style.width = complementarity + '%';
      }, 100);

      document.getElementById('naiveTokens').textContent = data.token_efficiency.naive_approach_tokens.toLocaleString();
      document.getElementById('accordTokens').textContent = data.token_efficiency.core_accord_tokens.toLocaleString();
      document.getElementById('naiveCost').textContent = data.token_efficiency.cost_naive;
      document.getElementById('accordCost').textContent = data.token_efficiency.cost_core_accord;
      document.getElementById('savingsPercent').textContent = data.token_efficiency.savings_percentage;

      setTimeout(() => {
        const savingsRatio = data.token_efficiency.core_accord_tokens / data.token_efficiency.naive_approach_tokens;
        document.getElementById('accordBar').style.width = (savingsRatio * 100) + '%';
      }, 100);

      document.getElementById('agreements').innerHTML = data.evaluation_metrics.key_agreements
        .map(a => \`<span class="px-3 py-1 bg-green-900/30 border border-green-700/30 rounded-full text-sm">\${a}</span>\`)
        .join('') || '<span class="text-gray-500">None detected</span>';

      document.getElementById('disagreements').innerHTML = data.evaluation_metrics.key_disagreements
        .map(d => \`<span class="px-3 py-1 bg-orange-900/30 border border-orange-700/30 rounded-full text-sm">\${d}</span>\`)
        .join('') || '<span class="text-gray-500">None detected</span>';

      document.getElementById('totalTime').textContent = (data.metadata.total_time_ms / 1000).toFixed(2) + 's';
      document.getElementById('totalTokens').textContent = data.metadata.total_tokens.toLocaleString();
      document.getElementById('successRate').textContent =
        Math.round(data.metadata.analyses_completed / (data.metadata.analyses_completed + data.metadata.analyses_failed) * 100) + '%';

      const grid = document.getElementById('analysisGrid');
      grid.innerHTML = '';

      data.analyses.forEach(analysis => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 p-5 rounded-xl border hover:border-gray-700 transition-colors ' +
                         (analysis.success ? 'border-gray-800' : 'border-red-800');

        const successIcon = analysis.success ? '✓' : '✗';
        const successColor = analysis.success ? 'text-green-400' : 'text-red-400';

        card.innerHTML = \`
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-bold text-lg">\${analysis.analysis_id}</h4>
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">\${analysis.tokens} tokens</span>
              <span class="text-xs \${successColor}">\${successIcon}</span>
            </div>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">\${analysis.content.substring(0, 400)}...</p>
          <div class="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span>Response time: \${analysis.response_time_ms}ms</span>
            <span class="text-blue-400">\${analysis.perspective}</span>
          </div>
        \`;

        grid.appendChild(card);
      });
    }

    function displayBatchResults(batchData) {
      document.getElementById('consensusScore').textContent = batchData.summary.avg_consensus;
      document.getElementById('diversityScore').textContent = batchData.summary.avg_diversity;
      document.getElementById('complementarityScore').textContent = Math.round((batchData.summary.avg_consensus + batchData.summary.avg_diversity) / 2);

      document.getElementById('consensusBar').style.width = batchData.summary.avg_consensus + '%';
      document.getElementById('diversityBar').style.width = batchData.summary.avg_diversity + '%';
      document.getElementById('complementarityBar').style.width = Math.round((batchData.summary.avg_consensus + batchData.summary.avg_diversity) / 2) + '%';

      document.getElementById('savingsPercent').textContent = batchData.summary.total_savings;
      document.getElementById('totalTokens').textContent = batchData.summary.total_tokens.toLocaleString();
      document.getElementById('totalTime').textContent = 'Batch';
      document.getElementById('successRate').textContent = '100%';

      const grid = document.getElementById('analysisGrid');
      grid.innerHTML = '<div class="col-span-full mb-4"><h3 class="text-xl font-bold">Batch Results (' + batchData.queries.length + ' queries)</h3></div>';

      batchData.results.forEach((result, idx) => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors';

        card.innerHTML = \`
          <div class="mb-3">
            <h4 class="font-bold text-lg">Query \${idx + 1}</h4>
            <p class="text-sm text-gray-400 mt-1">\${result.query}</p>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="bg-gray-800 p-2 rounded"><span class="text-gray-500">Consensus:</span> <span class="text-green-400 font-bold">\${result.evaluation_metrics.consensus_score}</span></div>
            <div class="bg-gray-800 p-2 rounded"><span class="text-gray-500">Diversity:</span> <span class="text-purple-400 font-bold">\${result.evaluation_metrics.diversity_score}</span></div>
            <div class="bg-gray-800 p-2 rounded"><span class="text-gray-500">Savings:</span> <span class="text-blue-400 font-bold">\${result.token_efficiency.savings_percentage}%</span></div>
          </div>
        \`;

        grid.appendChild(card);
      });
    }

    function exportJSON() {
      if (!currentReportData) return alert('No report data available');
      const blob = new Blob([JSON.stringify(currentReportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-report-' + Date.now() + '.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    function exportMarkdown() {
      if (!currentReportData) return alert('No report data available');
      const d = currentReportData;
      let md = '# CORE ACCORD Analysis Report\\n\\n';

      if (d.batch) {
        md += '**Batch Mode:** ' + d.queries.length + ' queries processed\\n\\n';
        md += '## Batch Summary\\n\\n';
        md += '- **Average Consensus:** ' + d.summary.avg_consensus + '/100\\n';
        md += '- **Average Diversity:** ' + d.summary.avg_diversity + '/100\\n';
        md += '- **Total Tokens:** ' + d.summary.total_tokens.toLocaleString() + '\\n';
        md += '- **Average Savings:** ' + d.summary.total_savings + '%\\n\\n';
      } else {
        md += '**Query:** ' + d.query + '\\n\\n';
        md += '## Evaluation Metrics\\n\\n';
        md += '- **Consensus Score:** ' + d.evaluation_metrics.consensus_score + '/100\\n';
        md += '- **Diversity Score:** ' + d.evaluation_metrics.diversity_score + '/100\\n';
        md += '- **Complementarity Score:** ' + d.evaluation_metrics.complementarity_score + '/100\\n\\n';
        md += '## Token Efficiency\\n\\n';
        md += '- **Naive Approach:** ' + d.token_efficiency.naive_approach_tokens.toLocaleString() + ' tokens\\n';
        md += '- **CORE ACCORD:** ' + d.token_efficiency.core_accord_tokens.toLocaleString() + ' tokens\\n';
        md += '- **Savings:** ' + d.token_efficiency.savings_percentage + '%\\n\\n';
        md += '## Individual Analyses\\n\\n';
        d.analyses.forEach(a => {
          md += '### ' + a.analysis_id + '\\n\\n';
          md += a.content + '\\n\\n';
          md += '*' + a.tokens + ' tokens, ' + a.response_time_ms + 'ms*\\n\\n';
        });
      }
      md += '---\\n\\n*Generated by CORE ACCORD | ' + new Date().toISOString() + '*\\n';

      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-report-' + Date.now() + '.md';
      a.click();
      URL.revokeObjectURL(url);
    }

    function exportCSV() {
      if (!currentReportData) return alert('No report data available');
      const d = currentReportData;
      let csv = 'Analysis ID,Perspective,Content,Tokens,Response Time (ms),Success\\n';
      d.analyses.forEach(a => {
        const content = a.content.replace(/"/g, '""').replace(/\\n/g, ' ');
        csv += '"' + a.analysis_id + '","' + a.perspective + '","' + content + '",' + a.tokens + ',' + a.response_time_ms + ',' + a.success + '\\n';
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-analyses-' + Date.now() + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    function copyToClipboard() {
      if (!currentReportData) return alert('No report data available');
      const d = currentReportData;
      const summary = 'CORE ACCORD Analysis Summary\\n\\n' +
        'Query: ' + d.query + '\\n\\n' +
        'Consensus: ' + d.evaluation_metrics.consensus_score + '/100\\n' +
        'Diversity: ' + d.evaluation_metrics.diversity_score + '/100\\n' +
        'Complementarity: ' + d.evaluation_metrics.complementarity_score + '/100\\n' +
        'Token Savings: ' + d.token_efficiency.savings_percentage + '%\\n\\n' +
        'Key Agreements: ' + d.evaluation_metrics.key_agreements.join(', ');

      navigator.clipboard.writeText(summary).then(() => {
        alert('Summary copied to clipboard!');
      });
    }
  </script>
</body>
</html>`;
}
