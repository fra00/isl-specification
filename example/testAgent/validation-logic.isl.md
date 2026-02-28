# Project: Validation Logic

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./validation-logic

> **Reference**: Domain entities and enums in `./domain.isl.md`

## Component: ExactMatchEvaluator
### Role: Business Logic

⚡ Capabilities
#### evaluate
**Contract**: Determines if an agent's answer is an exact match to the ground truth (case-insensitive).
**Signature**:
- Input: `ground_truth: string`, `agent_answer: string`
- Output: `score: number (1-5)`, `explanation: string`, `method: ValidationMethodType`
**Flow**:
1.  Convert `ground_truth` and `agent_answer` to lowercase.
2.  `IF` the lowercase `ground_truth` `IS IDENTICAL TO` the lowercase `agent_answer` `THEN`
    *   Return `score: 5`, `explanation: "Exact match found."`, `method: ValidationMethodType.EXACT_MATCH`.
3.  `ELSE`
    *   Return `score: 0`, `explanation: "No exact match."`, `method: ValidationMethodType.EXACT_MATCH` (score 0 indicates not applicable for this method, prompting further evaluation).

## Component: SemanticSimilarityEvaluator
### Role: Business Logic
**Signature**: `semantic_model_instance` (an initialized `sentence-transformers` model)

⚡ Capabilities
#### evaluate
**Contract**: Calculates semantic similarity between two texts and assigns a score based on predefined thresholds.
**Signature**:
- Input: `ground_truth: string`, `agent_answer: string`
- Output: `score: number (1-5)`, `explanation: string`, `method: ValidationMethodType`, `similarity_score: number (0-1)`
**Flow**:
1.  Generate embeddings for `ground_truth` using `semantic_model_instance`.
2.  Generate embeddings for `agent_answer` using `semantic_model_instance`.
3.  Calculate the cosine similarity between the two embeddings, resulting in `similarity_score`.
4.  `IF` `similarity_score` `IS GREATER THAN` `0.95` `THEN`
    *   Return `score: 5`, `explanation: "High semantic similarity."`, `method: ValidationMethodType.SEMANTIC_SIMILARITY`, `similarity_score`.
5.  `ELSE IF` `similarity_score` `IS LESS THAN` `0.40` `THEN`
    *   Return `score: 1`, `explanation: "Low semantic similarity."`, `method: ValidationMethodType.SEMANTIC_SIMILARITY`, `similarity_score`.
6.  `ELSE` (similarity between 0.40 and 0.95)
    *   Return `score: 0`, `explanation: "Moderate semantic similarity, requires LLM judgment."`, `method: ValidationMethodType.SEMANTIC_SIMILARITY`, `similarity_score`.

## Component: LLMJudgeEvaluator
### Role: Business Logic
**Signature**: `llm_client_instance` (an initialized `google-generativeai` model client), `rate_limiter_instance: RateLimiter`

⚡ Capabilities
#### evaluate
**Contract**: Uses an LLM to judge the quality of an agent's response against a ground truth.
**Signature**:
- Input: `question: string`, `ground_truth: string`, `agent_answer: string`
- Output: `score: number (1-5)`, `explanation: string`, `method: ValidationMethodType`
**Flow**:
1.  `rate_limiter_instance.wait_for_slot`.
2.  Construct a prompt for the LLM using the provided `question`, `ground_truth`, and `agent_answer`.
    *   **Prompt Structure**:
        ```
        You are an expert in evaluating the quality and accuracy of AI agent responses against a given ground truth.
        Your task is to assign a score from 1 to 5 and provide a concise explanation.

        Scoring Guidelines:
        - Score 5: The agent's response is excellent, highly accurate, and fully addresses the question. It is semantically equivalent to the ground truth, even if phrased differently.
        - Score 4: The agent's response is good, mostly accurate, but might miss minor details or have slight inaccuracies compared to the ground truth.
        - Score 3: The agent's response is acceptable, partially accurate, but contains some noticeable inaccuracies or omissions.
        - Score 2: The agent's response is poor, largely inaccurate, or fails to address the core of the question.
        - Score 1: The agent's response is very poor, completely incorrect, or irrelevant.

        Provide your evaluation in the following JSON format:
        {
          "score": [1-5],
          "explanation": "Your concise explanation here."
        }

        ---
        Question: {question}
        Ground Truth: {ground_truth}
        Agent's Response: {agent_answer}
        ---
        ```
3.  `TRY`
    *   Send the constructed prompt to `llm_client_instance`.
    *   Parse the LLM's response, expecting a JSON object with `score` and `explanation` fields.
    *   Validate `score` is within `1-5`. If not, default to `1`.
    *   Return `score`, `explanation`, `method: ValidationMethodType.LLM_JUDGE`.
4.  `CATCH` any API errors or parsing failures:
    *   Return `score: 1`, `explanation: "LLM evaluation failed due to API error or invalid response."`, `method: ValidationMethodType.LLM_JUDGE`.

## Component: CSVHandler
### Role: Business Logic

⚡ Capabilities
#### read_input_test_cases
**Contract**: Reads test cases from an input CSV file.
**Signature**:
- Input: `file_path: string`
- Output: `list<TestCaseEntity>`
**Flow**:
1.  Read the CSV file at `file_path`.
2.  Parse each row, expecting columns: `domanda`, `risposta_attesa`.
3.  Create a `TestCaseEntity` for each row.
4.  Return the list of `TestCaseEntity` objects.
🚨 Constraint: Input CSV MUST contain `domanda` and `risposta_attesa` columns.

#### read_agent_answers
**Contract**: Reads agent answers from a separate CSV file.
**Signature**:
- Input: `file_path: string`
- Output: `list<string>`
**Flow**:
1.  Read the CSV file at `file_path`.
2.  Parse each row, expecting a single column containing the agent's answer.
3.  Return the list of agent answers as strings.
🚨 Constraint: Agent answers CSV MUST contain one answer per row, corresponding to the order of test cases.

#### append_results
**Contract**: Appends validation results to an output CSV file, creating headers if the file is new.
**Signature**:
- Input: `file_path: string`, `results: list<ValidationResultEntity>`
**Flow**:
1.  `IF` `file_path` `DOES NOT EXIST` `THEN`
    *   Write CSV headers: `domanda`, `risposta_attesa`, `risposta_agente`, `metodo_valutazione`, `score`, `spiegazione`.
2.  Append each `ValidationResultEntity` in `results` as a new row to the CSV file.

#### write_final_results
**Contract**: Writes all validation results to an output CSV file, overwriting existing content.
**Signature**:
- Input: `file_path: string`, `results: list<ValidationResultEntity>`
**Flow**:
1.  Write CSV headers: `domanda`, `risposta_attesa`, `risposta_agente`, `metodo_valutazione`, `score`, `spiegazione`.
2.  Write each `ValidationResultEntity` in `results` as a new row to the CSV file.

## Component: ProgressReporter
### Role: Business Logic
**Signature**: `total_items: number`, `increment_save_interval: number (rows)`
**State**:
- `current_progress: number` - Current count of processed items.
- `tqdm_instance` - Instance of a progress bar utility.

⚡ Capabilities
#### initialize
**Contract**: Initializes the progress bar.
**Flow**:
1.  Create a new progress bar instance with `total_items`.

#### update_progress
**Contract**: Increments the progress bar and internal counter.
**Flow**:
1.  Increment `current_progress` by `1`.
2.  Update the `tqdm_instance` progress bar.

#### should_save_incrementally
**Contract**: Checks if it's time to perform an incremental save.
**Signature**: Void
**Returns**: `boolean`
**Flow**:
1.  `IF` `current_progress` `IS GREATER THAN` `0` `AND` `current_progress` `IS A MULTIPLE OF` `increment_save_interval` `THEN`
    *   Return `TRUE`.
2.  `ELSE`
    *   Return `FALSE`.

#### close
**Contract**: Closes the progress bar.
**Flow**:
1.  Close the `tqdm_instance`.

## Component: RateLimiter
### Role: Business Logic
**Signature**: `max_calls: number`, `period_seconds: number (seconds)`
**State**:
- `call_timestamps: list<datetime>` - A list of timestamps for recent calls.

⚡ Capabilities
#### wait_for_slot
**Contract**: Pauses execution to ensure calls do not exceed the rate limit.
**Flow**:
1.  Remove any timestamps from `call_timestamps` that are older than `period_seconds` from the current time.
2.  `WHILE` the number of entries in `call_timestamps` `IS GREATER THAN OR EQUAL TO` `max_calls` `THEN`
    *   Calculate the time difference between the current time and the oldest timestamp in `call_timestamps` plus `period_seconds`.
    *   Pause execution for this calculated duration.
    *   Re-evaluate and remove expired timestamps.
3.  Add the current timestamp to `call_timestamps`.

## Component: TestCaseValidator
### Role: Business Logic
**Signature**:
- `exact_match_evaluator: ExactMatchEvaluator`
- `semantic_similarity_evaluator: SemanticSimilarityEvaluator`
- `llm_judge_evaluator: LLMJudgeEvaluator`

⚡ Capabilities
#### evaluate_test_case
**Contract**: Applies the hybrid validation logic to a single test case.
**Signature**:
- Input: `test_case: TestCaseEntity`, `agent_answer: string`
- Output: `ValidationResultEntity`
**Flow**:
1.  `score_exact, explanation_exact, method_exact = exact_match_evaluator.evaluate(test_case.ground_truth_answer, agent_answer)`.
2.  `IF` `score_exact` `IS EQUAL TO` `5` `THEN`
    *   Return `ValidationResultEntity` with `test_case.question`, `test_case.ground_truth_answer`, `agent_answer`, `method_exact`, `score_exact`, `explanation_exact`.
3.  `ELSE`
    *   `score_semantic, explanation_semantic, method_semantic, similarity_score = semantic_similarity_evaluator.evaluate(test_case.ground_truth_answer, agent_answer)`.
    *   `IF` `score_semantic` `IS EQUAL TO` `5` `OR` `score_semantic` `IS EQUAL TO` `1` `THEN`
        *   Return `ValidationResultEntity` with `test_case.question`, `test_case.ground_truth_answer`, `agent_answer`, `method_semantic`, `score_semantic`, `explanation_semantic`.
    *   `ELSE` (semantic similarity between 0.40 and 0.95, requiring LLM judgment)
        *   `score_llm, explanation_llm, method_llm = llm_judge_evaluator.evaluate(test_case.question, test_case.ground_truth_answer, agent_answer)`.
        *   Return `ValidationResultEntity` with `test_case.question`, `test_case.ground_truth_answer`, `agent_answer`, `method_llm`, `score_llm`, `explanation_llm`.

#### process_test_cases
**Contract**: Orchestrates the validation of a list of test cases, including progress reporting and incremental saving.
**Signature**:
- Input: `test_cases: list<TestCaseEntity>`, `agent_answers: list<string>`, `output_file_path: string`, `csv_handler: CSVHandler`
**State**: `all_results: list<ValidationResultEntity>` (initialized as empty)
**Flow**:
1.  Instantiate `progress_reporter: ProgressReporter` with `total_items: len(test_cases)` and `increment_save_interval: 10 (rows)`.
2.  `progress_reporter.initialize`.
3.  `FOR EACH` `index` from `0` to `len(test_cases) - 1`:
    *   `current_test_case = test_cases[index]`.
    *   `current_agent_answer = agent_answers[index]`.
    *   `result = evaluate_test_case(current_test_case, current_agent_answer)`.
    *   Add `result` to `all_results`.
    *   `progress_reporter.update_progress`.
    *   `IF` `progress_reporter.should_save_incrementally` `THEN`
        *   `csv_handler.append_results(output_file_path, all_results)` (This should append only the *new* results since the last save, or the entire list if the handler manages deduplication. For simplicity, `append_results` will handle appending the current `all_results` and ensuring headers are written once. The `CSVHandler` should be smart enough to only write new rows or overwrite the file with the full list each time for robustness).
        *   **Correction**: `append_results` should receive only the *newly processed* result or a batch of new results. To simplify, `csv_handler.append_results` will be called with a list of results that have been processed since the last save.
        *   **Revised incremental save**: `csv_handler.append_results(output_file_path, [result])` for each row, and `append_results` handles the header logic. This is simpler than managing batches in `TestCaseValidator`.
4.  `progress_reporter.close`.
5.  `csv_handler.write_final_results(output_file_path, all_results)`.