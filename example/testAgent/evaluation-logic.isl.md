# Project: Evaluation Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./evaluation-logic

> **Reference**: Domain concepts in `./domain.isl.md`

## Component: EvaluationService
### Role: Business Logic
**Signature**:
- `semantic_provider`: `SemanticEmbeddingProvider`
- `llm_judge_provider`: `LLMJudgeProvider`
- `rate_limiter`: `RateLimiter`
- `similarity_thresholds`: `SemanticSimilarityThresholds`

### ⚡ Capabilities

#### EvaluateTestCase
**Contract**: Evaluates a single test case using a hybrid approach (Exact Match, Semantic Similarity, LLM as Judge).
**Signature**:
- Input: `test_case_context: TestCaseEvaluationContextEntity`
- Output: `TestCaseResultEntity`
**Flow**:
1.  **Perform Exact Match**:
    IF `test_case_context.agent_answer` is case-insensitively identical to `test_case_context.expected_answer` THEN
        RETURN `TestCaseResultEntity` with `score: ScoreType.SCORE_5`, `evaluation_method: EvaluationMethodType.EXACT_MATCH`, `explanation: "Exact match found."`
2.  **Calculate Semantic Similarity**:
    LET `similarity_score` = `semantic_provider.CalculateSimilarity(test_case_context.agent_answer, test_case_context.expected_answer)`
    IF `similarity_score` > `similarity_thresholds.HIGH_SIMILARITY_THRESHOLD` THEN
        RETURN `TestCaseResultEntity` with `score: ScoreType.SCORE_5`, `evaluation_method: EvaluationMethodType.SEMANTIC_SIMILARITY`, `explanation: "High semantic similarity."`
    ELSE IF `similarity_score` < `similarity_thresholds.LOW_SIMILARITY_THRESHOLD` THEN
        RETURN `TestCaseResultEntity` with `score: ScoreType.SCORE_1`, `evaluation_method: EvaluationMethodType.SEMANTIC_SIMILARITY`, `explanation: "Low semantic similarity."`
3.  **LLM as Judge (Fallback)**:
    // Only if similarity is between LOW_SIMILARITY_THRESHOLD and HIGH_SIMILARITY_THRESHOLD
    `rate_limiter.WaitIfNecessary()`
    LET `llm_result` = `llm_judge_provider.Judge(test_case_context.question, test_case_context.expected_answer, test_case_context.agent_answer)`
    RETURN `TestCaseResultEntity` with `score: llm_result.score`, `evaluation_method: EvaluationMethodType.LLM_JUDGE`, `explanation: llm_result.explanation`
**🚨 Constraint**: The evaluation order (Exact Match -> Semantic Similarity -> LLM) MUST be strictly followed.

#### LoadTestCases
**Contract**: Reads test cases from a CSV file.
**Signature**:
- Input: `file_path: string (CSV)`
- Output: `List<TestCaseInputEntity>`
**Flow**:
1.  Read CSV file from `file_path`.
2.  Parse each row into a `TestCaseInputEntity`.
3.  Collect all parsed entities into a list.
4.  RETURN the list.
**🚨 Constraint**: The CSV file MUST contain columns for 'question' and 'expected_answer'.

#### SaveResultsIncrementally
**Contract**: Appends evaluation results to a CSV file in batches.
**Signature**:
- Input:
    - `file_path: string (CSV)`
    - `results_batch: List<TestCaseResultEntity>`
    - `is_first_batch: boolean`
- Output: `void`
**Flow**:
1.  IF `is_first_batch` THEN
    Write CSV header row to `file_path`.
2.  FOR EACH `result` IN `results_batch` THEN
    Append `result` data (question, expected_answer, agent_answer, evaluation_method, score, explanation) as a new row to `file_path`.
**🚨 Constraint**: The output CSV file MUST include columns: `domanda`, `risposta_attesa`, `risposta_agente`, `metodo_valutazione`, `score`, `spiegazione`.

## Component: SemanticEmbeddingProvider
### Role: Business Logic
**Contract**: Provides semantic similarity calculation using a local embedding model.
**Signature**:
- `model_name: string` (e.g., 'all-MiniLM-L6-v2')

### ⚡ Capabilities

#### CalculateSimilarity
**Contract**: Computes the cosine similarity between the embeddings of two text strings.
**Signature**:
- Input:
    - `text1: string`
    - `text2: string`
- Output: `similarity_score: float (0.0-1.0)`
**Flow**:
1.  Generate embedding for `text1` using the configured local model.
2.  Generate embedding for `text2` using the configured local model.
3.  Calculate cosine similarity between the two embeddings.
4.  RETURN the similarity score.
**🚨 Constraint**: MUST use a local, free embedding model (e.g., 'all-MiniLM-L6-v2' from `sentence-transformers`).

## Component: LLMJudgeProvider
### Role: Business Logic
**Contract**: Uses an external Large Language Model (LLM) to judge test cases.
**Signature**:
- `llm_model_name: string` (e.g., 'gemini-1.5-flash')

### ⚡ Capabilities

#### Judge
**Contract**: Sends a test case to the LLM for evaluation and retrieves a score and explanation.
**Signature**:
- Input:
    - `question: string`
    - `expected_answer: string`
    - `agent_answer: string`
- Output:
    - `score: ScoreType`
    - `explanation: string`
**Flow**:
1.  Construct a prompt for the LLM using `question`, `expected_answer`, and `agent_answer`.
2.  Send the prompt to the configured LLM.
3.  Parse the LLM's response to extract a `score` (either `ScoreType.SCORE_1` or `ScoreType.SCORE_5`) and an `explanation`.
4.  RETURN `score` and `explanation`.
**🚨 Constraint**: MUST use Gemini 1.5 Flash via `google-generativeai` library to leverage the free tier. The prompt MUST instruct the LLM to provide a score of 1 or 5 and a brief explanation.

## Component: RateLimiter
### Role: Business Logic
**Contract**: Manages API call rates to prevent exceeding limits.
**Signature**:
- `config: RateLimitConfiguration`

### ⚡ Capabilities

#### WaitIfNecessary
**Contract**: Pauses execution if the configured rate limit for API calls is about to be exceeded.
**Signature**:
- Input: `void`
- Output: `void`
**Flow**:
1.  Record the current time for the API call.
2.  Check the history of recent calls within the `config.time_window`.
3.  IF the number of calls in the current window exceeds `config.max_calls` THEN
    Calculate the remaining time until the next call is allowed.
    Pause execution for that duration.
4.  Update the call history.
**🚨 Constraint**: MUST enforce a maximum of `config.max_calls` within `config.time_window`.