# Project: Main

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./main

> **Reference**: Domain entities and enums in `./domain.isl.md`
> **Reference**: Validation logic components in `./validation-logic.isl.md`

## Component: Main
### Role: Presentation (Entry Point)

⚡ Capabilities
#### run_validation_script
**Contract**: Orchestrates the entire test case validation process from input to output.
**Signature**: Void
**Flow**:
1.  Define `input_csv_path: string` as `"input.csv"`.
2.  Define `agent_answers_csv_path: string` as `"agent_answers.csv"`.
3.  Define `output_csv_path: string` as `"output.csv"`.
4.  Define `semantic_model_name: string` as `"all-MiniLM-L6-v2"`.
5.  Define `llm_api_key: string` (read from environment variable or configuration).
6.  Instantiate `csv_handler: CSVHandler`.
7.  `test_cases = csv_handler.read_input_test_cases(input_csv_path)`.
8.  `agent_answers = csv_handler.read_agent_answers(agent_answers_csv_path)`.
9.  `IF` `len(test_cases)` `IS NOT EQUAL TO` `len(agent_answers)` `THEN`
    *   Display error message: "Mismatch between number of test cases and agent answers."
    *   Terminate execution.
10. Instantiate `semantic_model_instance` using `semantic_model_name` (e.g., `SentenceTransformer(semantic_model_name)`).
11. Configure `llm_client_instance` using `llm_api_key` (e.g., `google.generativeai.configure(api_key=llm_api_key)` and `genai.GenerativeModel('gemini-1.5-flash')`).
12. Instantiate `rate_limiter: RateLimiter` with `max_calls: 15`, `period_seconds: 60 (seconds)`.
13. Instantiate `exact_match_evaluator: ExactMatchEvaluator`.
14. Instantiate `semantic_similarity_evaluator: SemanticSimilarityEvaluator` with `semantic_model_instance`.
15. Instantiate `llm_judge_evaluator: LLMJudgeEvaluator` with `llm_client_instance`, `rate_limiter`.
16. Instantiate `test_case_validator: TestCaseValidator` with `exact_match_evaluator`, `semantic_similarity_evaluator`, `llm_judge_evaluator`.
17. `test_case_validator.process_test_cases(test_cases, agent_answers, output_csv_path, csv_handler)`.
18. Display success message: "Test case validation completed. Results saved to {output_csv_path}."

✅ Acceptance Criteria:
- The script successfully reads test cases and agent answers from specified CSV files.
- The validation process follows the hybrid cascade: Exact Match -> Semantic Similarity -> LLM as Judge.
- Semantic similarity uses the 'all-MiniLM-L6-v2' model locally.
- LLM calls to Gemini 1.5 Flash respect a rate limit of 15 calls per minute.
- An output CSV file is generated with the specified columns: `domanda`, `risposta_attesa`, `risposta_agente`, `metodo_valutazione`, `score`, `spiegazione`.
- A progress bar is displayed during processing.
- Results are incrementally saved to the output CSV every 10 rows.

🧪 Test Scenarios:
- **Scenario 1: All Exact Matches**
    - Input CSV: `Q1, A1`, `Q2, A2`
    - Agent Answers CSV: `A1`, `A2`
    - Expected Output: All scores 5, method "EXACT_MATCH".
- **Scenario 2: High Semantic Similarity**
    - Input CSV: `Q1, The quick brown fox jumps over the lazy dog.`, `Q2, Hello world.`
    - Agent Answers CSV: `Q1, A fast brown fox leaps over a sleepy canine.`, `Q2, Hi there.`
    - Expected Output: All scores 5, method "SEMANTIC_SIMILARITY".
- **Scenario 3: Low Semantic Similarity**
    - Input CSV: `Q1, The capital of France is Paris.`, `Q2, What is 2+2?`
    - Agent Answers CSV: `Q1, The sky is blue.`, `Q2, The moon is made of cheese.`
    - Expected Output: All scores 1, method "SEMANTIC_SIMILARITY".
- **Scenario 4: Mixed Similarity (LLM Judge Triggered)**
    - Input CSV: `Q1, The capital of France is Paris.`, `Q2, What is the largest ocean?`
    - Agent Answers CSV: `Q1, Paris is the main city in France.`, `Q2, The Pacific is the biggest ocean.`
    - Expected Output: Scores between 2-4, method "LLM_JUDGE" for cases where semantic similarity is moderate.
- **Scenario 5: Rate Limiting Enforcement**
    - Simulate many LLM calls in quick succession.
    - Expected: Processing time should reflect rate limiting, no API errors due to exceeding limits.
- **Scenario 6: Incremental Saving**
    - Process 25 test cases with `increment_save_interval: 10`.
    - Expected: Output CSV should be written/updated after 10 and 20 rows, and then finalized.
- **Scenario 7: Input Mismatch**
    - Input CSV: 2 rows
    - Agent Answers CSV: 1 row
    - Expected: Script terminates with an error message.