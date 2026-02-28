from dataclasses import dataclass
from enum import Enum
from typing import List, Optional, Any, Dict
import csv
import os
import time
from datetime import datetime, timedelta
import json
import numpy as np
from numpy.linalg import norm
from tqdm import tqdm

# Domain entities from REAL IMPLEMENTATION CONTEXT
from domain import TestCaseEntity, ValidationMethodType, ValidationResultEntity

# Helper for cosine similarity
def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculates the cosine similarity between two vectors."""
    norm_a = norm(a)
    norm_b = norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0 # Handle zero vectors to avoid division by zero
    return np.dot(a, b) / (norm_a * norm_b)

class ExactMatchEvaluator:
    """
    Component: ExactMatchEvaluator
    Role: Business Logic
    """
    def evaluate(self, ground_truth: str, agent_answer: str) -> Dict[str, Any]:
        """
        Contract: Determines if an agent's answer is an exact match to the ground truth (case-insensitive).
        """
        ground_truth_lower = ground_truth.lower()
        agent_answer_lower = agent_answer.lower()

        if ground_truth_lower == agent_answer_lower:
            return {
                "score": 5,
                "explanation": "Exact match found.",
                "method": ValidationMethodType.EXACT_MATCH
            }
        else:
            return {
                "score": 0, # Score 0 indicates not applicable for this method, prompting further evaluation.
                "explanation": "No exact match.",
                "method": ValidationMethodType.EXACT_MATCH
            }

class SemanticSimilarityEvaluator:
    """
    Component: SemanticSimilarityEvaluator
    Role: Business Logic
    """
    def __init__(self, semantic_model_instance: Any): # Type hint as Any due to strict import rules
        self.semantic_model_instance = semantic_model_instance

    def evaluate(self, ground_truth: str, agent_answer: str) -> Dict[str, Any]:
        """
        Contract: Calculates semantic similarity between two texts and assigns a score based on predefined thresholds.
        """
        try:
            # 1. Generate embeddings for ground_truth using semantic_model_instance.
            # Assuming .encode() method exists and returns a numpy array or list convertible to it.
            ground_truth_embedding = self.semantic_model_instance.encode(ground_truth, convert_to_tensor=False)
            # 2. Generate embeddings for agent_answer using semantic_model_instance.
            agent_answer_embedding = self.semantic_model_instance.encode(agent_answer, convert_to_tensor=False)

            # Ensure embeddings are numpy arrays for calculation
            ground_truth_embedding = np.asarray(ground_truth_embedding)
            agent_answer_embedding = np.asarray(agent_answer_embedding)

            # 3. Calculate the cosine similarity between the two embeddings, resulting in similarity_score.
            similarity_score = _cosine_similarity(ground_truth_embedding, agent_answer_embedding)

            score: int
            explanation: str

            # 4. IF similarity_score IS GREATER THAN 0.95 THEN
            if similarity_score > 0.95:
                score = 5
                explanation = "High semantic similarity."
            # 5. ELSE IF similarity_score IS LESS THAN 0.40 THEN
            elif similarity_score < 0.40:
                score = 1
                explanation = "Low semantic similarity."
            # 6. ELSE (similarity between 0.40 and 0.95)
            else:
                score = 0 # Score 0 indicates moderate similarity, requires LLM judgment.
                explanation = "Moderate semantic similarity, requires LLM judgment."

            return {
                "score": score,
                "explanation": explanation,
                "method": ValidationMethodType.SEMANTIC_SIMILARITY,
                "similarity_score": similarity_score
            }
        except Exception as e:
            # Error Handling: Use try/except blocks for external operations (API calls)
            return {
                "score": 1,
                "explanation": f"Semantic similarity evaluation failed: {str(e)}",
                "method": ValidationMethodType.SEMANTIC_SIMILARITY,
                "similarity_score": 0.0
            }

class LLMJudgeEvaluator:
    """
    Component: LLMJudgeEvaluator
    Role: Business Logic
    """
    def __init__(self, llm_client_instance: Any, rate_limiter_instance: "RateLimiter"): # Type hint as Any for LLM client
        self.llm_client_instance = llm_client_instance
        self.rate_limiter_instance = rate_limiter_instance

    def evaluate(self, question: str, ground_truth: str, agent_answer: str) -> Dict[str, Any]:
        """
        Contract: Uses an LLM to judge the quality of an agent's response against a ground truth.
        """
        # 1. rate_limiter_instance.wait_for_slot.
        self.rate_limiter_instance.wait_for_slot()

        # 2. Construct a prompt for the LLM
        prompt = f"""
        You are an expert in evaluating the quality and accuracy of AI agent responses against a given ground truth.
        Your task is to assign a score from 1 to 5 and provide a concise explanation.

        Scoring Guidelines:
        - Score 5: The agent's response is excellent, highly accurate, and fully addresses the question. It is semantically equivalent to the ground truth, even if phrased differently.
        - Score 4: The agent's response is good, mostly accurate, but might miss minor details or have slight inaccuracies compared to the ground truth.
        - Score 3: The agent's response is acceptable, partially accurate, but contains some noticeable inaccuracies or omissions.
        - Score 2: The agent's response is poor, largely inaccurate, or fails to address the core of the question.
        - Score 1: The agent's response is very poor, completely incorrect, or irrelevant.

        Provide your evaluation in the following JSON format:
        {{
          "score": [1-5],
          "explanation": "Your concise explanation here."
        }}

        ---
        Question: {question}
        Ground Truth: {ground_truth}
        Agent's Response: {agent_answer}
        ---
        """

        # 3. TRY
        try:
            # Send the constructed prompt to llm_client_instance.
            # Assuming llm_client_instance has a method like .generate_content() that returns a response object
            # and that response object has a .text attribute containing the JSON string.
            response = self.llm_client_instance.generate_content(prompt)
            llm_response_text = response.text

            # Parse the LLM's response, expecting a JSON object with score and explanation fields.
            parsed_response = json.loads(llm_response_text)

            score = parsed_response.get("score")
            explanation = parsed_response.get("explanation", "No explanation provided by LLM.")

            # Validate score is within 1-5. If not, default to 1.
            if not isinstance(score, (int, float)) or not (1 <= score <= 5):
                score = 1
                explanation = f"LLM returned invalid score '{score}'. Defaulting to 1. Original explanation: {explanation}"
            else:
                score = int(score) # Ensure it's an integer as per contract

            return {
                "score": score,
                "explanation": explanation,
                "method": ValidationMethodType.LLM_JUDGE
            }
        # 4. CATCH any API errors or parsing failures:
        except (json.JSONDecodeError, AttributeError, Exception) as e:
            return {
                "score": 1,
                "explanation": f"LLM evaluation failed due to API error or invalid response: {str(e)}",
                "method": ValidationMethodType.LLM_JUDGE
            }

class CSVHandler:
    """
    Component: CSVHandler
    Role: Business Logic
    """
    _HEADERS = ["domanda", "risposta_attesa", "risposta_agente", "metodo_valutazione", "score", "spiegazione"]

    def read_input_test_cases(self, file_path: str) -> List[TestCaseEntity]:
        """
        Contract: Reads test cases from an input CSV file.
        """
        test_cases: List[TestCaseEntity] = []
        try:
            with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                # Constraint: Input CSV MUST contain `domanda` and `risposta_attesa` columns.
                if not reader.fieldnames or 'domanda' not in reader.fieldnames or 'risposta_attesa' not in reader.fieldnames:
                    raise ValueError("Input CSV must contain 'domanda' and 'risposta_attesa' columns.")

                for row in reader:
                    question = row.get('domanda', '')
                    ground_truth_answer = row.get('risposta_attesa', '')
                    if question and ground_truth_answer: # Only add if both are present
                        test_cases.append(TestCaseEntity(question=question, ground_truth_answer=ground_truth_answer))
            return test_cases
        except FileNotFoundError:
            print(f"Error: Input test cases file not found at {file_path}")
            return []
        except Exception as e:
            print(f"Error reading input test cases CSV from {file_path}: {e}")
            return []

    def read_agent_answers(self, file_path: str) -> List[str]:
        """
        Contract: Reads agent answers from a separate CSV file.
        """
        agent_answers: List[str] = []
        try:
            with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                for row in reader:
                    if row: # Ensure row is not empty
                        agent_answers.append(row[0]) # Expecting a single column
            return agent_answers
        except FileNotFoundError:
            print(f"Error: Agent answers file not found at {file_path}")
            return []
        except Exception as e:
            print(f"Error reading agent answers CSV from {file_path}: {e}")
            return []

    def append_results(self, file_path: str, results: List[ValidationResultEntity]) -> None:
        """
        Contract: Appends validation results to an output CSV file, creating headers if the file is new.
        """
        file_exists = os.path.exists(file_path)
        mode = 'a' if file_exists else 'w'
        try:
            with open(file_path, mode=mode, newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                # 1. IF file_path DOES NOT EXIST THEN Write CSV headers
                if not file_exists:
                    writer.writerow(self._HEADERS)
                # 2. Append each ValidationResultEntity in results as a new row to the CSV file.
                for result in results:
                    writer.writerow([
                        result.question,
                        result.ground_truth_answer,
                        result.agent_answer,
                        result.validation_method.value, # Use .value for Enum
                        result.score,
                        result.explanation
                    ])
        except Exception as e:
            print(f"Error appending results to CSV file {file_path}: {e}")

    def write_final_results(self, file_path: str, results: List[ValidationResultEntity]) -> None:
        """
        Contract: Writes all validation results to an output CSV file, overwriting existing content.
        """
        try:
            with open(file_path, mode='w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                # 1. Write CSV headers
                writer.writerow(self._HEADERS)
                # 2. Write each ValidationResultEntity in results as a new row to the CSV file.
                for result in results:
                    writer.writerow([
                        result.question,
                        result.ground_truth_answer,
                        result.agent_answer,
                        result.validation_method.value, # Use .value for Enum
                        result.score,
                        result.explanation
                    ])
        except Exception as e:
            print(f"Error writing final results to CSV file {file_path}: {e}")

class ProgressReporter:
    """
    Component: ProgressReporter
    Role: Business Logic
    """
    def __init__(self, total_items: int, increment_save_interval: int):
        self.total_items = total_items
        self.increment_save_interval = increment_save_interval
        self.current_progress: int = 0
        self.tqdm_instance: Optional[tqdm] = None

    def initialize(self) -> None:
        """
        Contract: Initializes the progress bar.
        """
        # 1. Create a new progress bar instance with total_items.
        self.tqdm_instance = tqdm(total=self.total_items, desc="Processing Test Cases")
        self.current_progress = 0

    def update_progress(self) -> None:
        """
        Contract: Increments the progress bar and internal counter.
        """
        # 1. Increment current_progress by 1.
        self.current_progress += 1
        # 2. Update the tqdm_instance progress bar.
        if self.tqdm_instance is not None:
            self.tqdm_instance.update(1)

    def should_save_incrementally(self) -> bool:
        """
        Contract: Checks if it's time to perform an incremental save.
        """
        # 1. IF current_progress IS GREATER THAN 0 AND current_progress IS A MULTIPLE OF increment_save_interval THEN
        if self.current_progress > 0 and (self.current_progress % self.increment_save_interval == 0):
            # Return TRUE.
            return True
        # 2. ELSE Return FALSE.
        return False

    def close(self) -> None:
        """
        Contract: Closes the progress bar.
        """
        # 1. Close the tqdm_instance.
        if self.tqdm_instance is not None:
            self.tqdm_instance.close()

class RateLimiter:
    """
    Component: RateLimiter
    Role: Business Logic
    """
    def __init__(self, max_calls: int, period_seconds: int):
        self.max_calls = max_calls
        self.period_seconds = period_seconds
        self.call_timestamps: List[datetime] = []

    def wait_for_slot(self) -> None:
        """
        Contract: Pauses execution to ensure calls do not exceed the rate limit.
        """
        # 1. Remove any timestamps from call_timestamps that are older than period_seconds from the current time.
        now = datetime.now()
        self.call_timestamps = [ts for ts in self.call_timestamps if now - ts < timedelta(seconds=self.period_seconds)]

        # 2. WHILE the number of entries in call_timestamps IS GREATER THAN OR EQUAL TO max_calls THEN
        while len(self.call_timestamps) >= self.max_calls:
            # Calculate the time difference between the current time and the oldest timestamp in call_timestamps plus period_seconds.
            if not self.call_timestamps: # Should not happen if len >= max_calls, but for safety
                time_to_wait_seconds = self.period_seconds
            else:
                oldest_call_time = self.call_timestamps[0]
                time_to_wait = (oldest_call_time + timedelta(seconds=self.period_seconds)) - now
                time_to_wait_seconds = time_to_wait.total_seconds()

            if time_to_wait_seconds > 0:
                # Pause execution for this calculated duration.
                time.sleep(time_to_wait_seconds)

            # Re-evaluate and remove expired timestamps.
            now = datetime.now()
            self.call_timestamps = [ts for ts in self.call_timestamps if now - ts < timedelta(seconds=self.period_seconds)]

        # 3. Add the current timestamp to call_timestamps.
        self.call_timestamps.append(datetime.now())

class TestCaseValidator:
    """
    Component: TestCaseValidator
    Role: Business Logic
    """
    def __init__(self,
                 exact_match_evaluator: ExactMatchEvaluator,
                 semantic_similarity_evaluator: SemanticSimilarityEvaluator,
                 llm_judge_evaluator: LLMJudgeEvaluator):
        self.exact_match_evaluator = exact_match_evaluator
        self.semantic_similarity_evaluator = semantic_similarity_evaluator
        self.llm_judge_evaluator = llm_judge_evaluator
        self.all_results: List[ValidationResultEntity] = [] # State for process_test_cases

    def evaluate_test_case(self, test_case: TestCaseEntity, agent_answer: str) -> ValidationResultEntity:
        """
        Contract: Applies the hybrid validation logic to a single test case.
        """
        # 1. score_exact, explanation_exact, method_exact = exact_match_evaluator.evaluate(...)
        exact_match_eval_result = self.exact_match_evaluator.evaluate(test_case.ground_truth_answer, agent_answer)
        score_exact = exact_match_eval_result["score"]
        explanation_exact = exact_match_eval_result["explanation"]
        method_exact = exact_match_eval_result["method"]

        # 2. IF score_exact IS EQUAL TO 5 THEN
        if score_exact == 5:
            # Return ValidationResultEntity with ...
            return ValidationResultEntity(
                question=test_case.question,
                ground_truth_answer=test_case.ground_truth_answer,
                agent_answer=agent_answer,
                validation_method=method_exact,
                score=score_exact,
                explanation=explanation_exact
            )
        # 3. ELSE
        else:
            # score_semantic, explanation_semantic, method_semantic, similarity_score = semantic_similarity_evaluator.evaluate(...)
            semantic_eval_result = self.semantic_similarity_evaluator.evaluate(test_case.ground_truth_answer, agent_answer)
            score_semantic = semantic_eval_result["score"]
            explanation_semantic = semantic_eval_result["explanation"]
            method_semantic = semantic_eval_result["method"]
            # similarity_score = semantic_eval_result["similarity_score"] # Not used in flow logic, but available

            # IF score_semantic IS EQUAL TO 5 OR score_semantic IS EQUAL TO 1 THEN
            if score_semantic == 5 or score_semantic == 1:
                # Return ValidationResultEntity with ...
                return ValidationResultEntity(
                    question=test_case.question,
                    ground_truth_answer=test_case.ground_truth_answer,
                    agent_answer=agent_answer,
                    validation_method=method_semantic,
                    score=score_semantic,
                    explanation=explanation_semantic
                )
            # ELSE (semantic similarity between 0.40 and 0.95, requiring LLM judgment)
            else:
                # score_llm, explanation_llm, method_llm = llm_judge_evaluator.evaluate(...)
                llm_eval_result = self.llm_judge_evaluator.evaluate(test_case.question, test_case.ground_truth_answer, agent_answer)
                score_llm = llm_eval_result["score"]
                explanation_llm = llm_eval_result["explanation"]
                method_llm = llm_eval_result["method"]

                # Return ValidationResultEntity with ...
                return ValidationResultEntity(
                    question=test_case.question,
                    ground_truth_answer=test_case.ground_truth_answer,
                    agent_answer=agent_answer,
                    validation_method=method_llm,
                    score=score_llm,
                    explanation=explanation_llm
                )

    def process_test_cases(self,
                           test_cases: List[TestCaseEntity],
                           agent_answers: List[str],
                           output_file_path: str,
                           csv_handler: CSVHandler) -> None:
        """
        Contract: Orchestrates the validation of a list of test cases, including progress reporting and incremental saving.
        """
        # State: all_results: list<ValidationResultEntity> (initialized as empty)
        # This state is part of the class, so it's self.all_results
        self.all_results = []

        # 1. Instantiate progress_reporter: ProgressReporter with total_items: len(test_cases) and increment_save_interval: 10 (rows).
        progress_reporter = ProgressReporter(total_items=len(test_cases), increment_save_interval=10)
        # 2. progress_reporter.initialize.
        progress_reporter.initialize()

        # 3. FOR EACH index from 0 to len(test_cases) - 1:
        for index in range(len(test_cases)):
            # current_test_case = test_cases[index].
            current_test_case = test_cases[index]
            # current_agent_answer = agent_answers[index].
            current_agent_answer = agent_answers[index]

            # result = evaluate_test_case(current_test_case, current_agent_answer).
            result = self.evaluate_test_case(current_test_case, current_agent_answer)

            # Add result to all_results.
            self.all_results.append(result)

            # progress_reporter.update_progress.
            progress_reporter.update_progress()

            # IF progress_reporter.should_save_incrementally THEN
            if progress_reporter.should_save_incrementally():
                # csv_handler.append_results(output_file_path, [result])
                # The ISL specifies `[result]` for incremental save, meaning only the *latest* result.
                # The `CSVHandler.append_results` is designed to handle this by checking file existence for headers
                # and then appending the provided list of results.
                csv_handler.append_results(output_file_path, [result])

        # 4. progress_reporter.close.
        progress_reporter.close()

        # 5. csv_handler.write_final_results(output_file_path, all_results).
        # This step ensures that even if incremental saves happened, the final, complete, and correct
        # set of results is written to the file, overwriting any potentially incomplete or malformed
        # incremental saves.
        csv_handler.write_final_results(output_file_path, self.all_results)