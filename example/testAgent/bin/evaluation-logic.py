from dataclasses import dataclass
from enum import Enum
from typing import List, Optional, Deque
import csv
import time
import os
import re
from collections import deque

# External libraries (will be installed via pip)
# pip install sentence-transformers google-generativeai
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai

# Domain types from REAL IMPLEMENTATION CONTEXT
from domain import TestCaseEntity, ValidationMethodType, ValidationResultEntity

# --- Internal Domain Definitions (based on ISL implied types) ---

class ScoreType(Enum):
    """
    Represents the score assigned during evaluation.
    """
    SCORE_1 = 1
    SCORE_5 = 5

@dataclass(frozen=True)
class TestCaseEvaluationContextEntity:
    """
    Context for evaluating a single test case, including the agent's answer.
    """
    question: str
    expected_answer: str
    agent_answer: str

@dataclass(frozen=True)
class TestCaseResultEntity:
    """
    The comprehensive result of evaluating a single test case.
    """
    question: str
    expected_answer: str
    agent_answer: str
    evaluation_method: ValidationMethodType
    score: ScoreType
    explanation: str

@dataclass(frozen=True)
class SemanticSimilarityThresholds:
    """
    Configuration for semantic similarity thresholds.
    """
    HIGH_SIMILARITY_THRESHOLD: float
    LOW_SIMILARITY_THRESHOLD: float

@dataclass(frozen=True)
class RateLimitConfiguration:
    """
    Configuration for the rate limiter.
    """
    max_calls: int
    time_window: float # in seconds

@dataclass(frozen=True)
class LLMJudgeResult:
    """
    Result structure for the LLM Judge.
    """
    score: ScoreType
    explanation: str

# --- Component Implementations ---

class RateLimiter:
    """
    Manages API call rates to prevent exceeding limits.
    """
    _config: RateLimitConfiguration
    _call_history: Deque[float]

    def __init__(self, config: RateLimitConfiguration):
        self._config = config
        self._call_history = deque()

    def WaitIfNecessary(self) -> None:
        """
        Pauses execution if the configured rate limit for API calls is about to be exceeded.
        """
        try:
            current_time = time.time()

            # Remove calls older than the time window
            while self._call_history and self._call_history[0] <= current_time - self._config.time_window:
                self._call_history.popleft()

            # If current calls exceed max_calls, wait
            if len(self._call_history) >= self._config.max_calls:
                # Calculate time until the oldest call leaves the window
                time_to_wait = self._config.time_window - (current_time - self._call_history[0])
                if time_to_wait > 0:
                    time.sleep(time_to_wait)
                    current_time = time.time() # Update current time after waiting

            # Add the current call to history
            self._call_history.append(current_time)
        except Exception as e:
            # In a real application, this should be logged. For now, print.
            print(f"RateLimiter error: {e}")

class SemanticEmbeddingProvider:
    """
    Provides semantic similarity calculation using a local embedding model.
    """
    _model: SentenceTransformer

    def __init__(self, model_name: str):
        try:
            self._model = SentenceTransformer(model_name)
        except Exception as e:
            raise RuntimeError(f"Failed to load SentenceTransformer model '{model_name}': {e}")

    def CalculateSimilarity(self, text1: str, text2: str) -> float:
        """
        Computes the cosine similarity between the embeddings of two text strings.
        """
        try:
            embeddings1 = self._model.encode(text1, convert_to_tensor=True)
            embeddings2 = self._model.encode(text2, convert_to_tensor=True)
            cosine_scores = util.cos_sim(embeddings1, embeddings2)
            return cosine_scores[0][0].item()
        except Exception as e:
            print(f"Error calculating semantic similarity: {e}")
            return 0.0 # Default to no similarity on error

class LLMJudgeProvider:
    """
    Uses an external Large Language Model (LLM) to judge test cases.
    """
    _model: genai.GenerativeModel
    _llm_model_name: str

    def __init__(self, llm_model_name: str):
        self._llm_model_name = llm_model_name
        try:
            # API key should be configured externally, e.g., via environment variable.
            # For this exercise, we assume it's set or provide a placeholder.
            # In a real application, consider using a dedicated configuration management.
            if not genai.get_default_retriever(): # Check if already configured to avoid re-configuring
                 genai.configure(api_key=os.getenv("GEMINI_API_KEY", "AIzaSyD2kBXpXUHx0Ncs9yBEMRTlYXkQb8NtQJw"))
            self._model = genai.GenerativeModel(llm_model_name)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Gemini LLM model '{llm_model_name}': {e}")

    def Judge(self, question: str, expected_answer: str, agent_answer: str) -> LLMJudgeResult:
        """
        Sends a test case to the LLM for evaluation and retrieves a score and explanation.
        """
        prompt = f"""
        You are an AI assistant tasked with evaluating the quality of an agent's answer against a ground truth answer.
        Your goal is to provide a score (1 or 5) and a brief explanation.

        Score 5: The agent's answer is correct, relevant, and fully addresses the question, aligning well with the expected answer.
        Score 1: The agent's answer is incorrect, irrelevant, or significantly deviates from the expected answer.

        Question: {question}
        Expected Answer: {expected_answer}
        Agent's Answer: {agent_answer}

        Please provide your evaluation in the following format:
        SCORE: [1 or 5]
        EXPLANATION: [Your brief explanation here]
        """
        try:
            response = self._model.generate_content(prompt)
            llm_text = response.text.strip()

            score_match = re.search(r"SCORE:\s*(\d+)", llm_text, re.IGNORECASE)
            explanation_match = re.search(r"EXPLANATION:\s*(.*)", llm_text, re.IGNORECASE | re.DOTALL)

            score = ScoreType.SCORE_1
            explanation = "LLM evaluation failed to parse or provided no explanation."

            if score_match:
                parsed_score = int(score_match.group(1))
                if parsed_score == 5:
                    score = ScoreType.SCORE_5
                elif parsed_score == 1:
                    score = ScoreType.SCORE_1
                # If parsed_score is not 1 or 5, it defaults to SCORE_1

            if explanation_match:
                explanation = explanation_match.group(1).strip()
                if not explanation: # Ensure explanation is not empty if parsed
                    explanation = "LLM provided an empty explanation."

            return LLMJudgeResult(score=score, explanation=explanation)

        except Exception as e:
            print(f"Error during LLM judging: {e}")
            return LLMJudgeResult(score=ScoreType.SCORE_1, explanation=f"LLM judging failed due to error: {e}")

class EvaluationService:
    """
    Evaluates test cases using a hybrid approach (Exact Match, Semantic Similarity, LLM as Judge).
    """
    _semantic_provider: SemanticEmbeddingProvider
    _llm_judge_provider: LLMJudgeProvider
    _rate_limiter: RateLimiter
    _similarity_thresholds: SemanticSimilarityThresholds

    def __init__(self,
                 semantic_provider: SemanticEmbeddingProvider,
                 llm_judge_provider: LLMJudgeProvider,
                 rate_limiter: RateLimiter,
                 similarity_thresholds: SemanticSimilarityThresholds):
        self._semantic_provider = semantic_provider
        self._llm_judge_provider = llm_judge_provider
        self._rate_limiter = rate_limiter
        self._similarity_thresholds = similarity_thresholds

    def EvaluateTestCase(self, test_case_context: TestCaseEvaluationContextEntity) -> TestCaseResultEntity:
        """
        Evaluates a single test case using a hybrid approach (Exact Match, Semantic Similarity, LLM as Judge).
        """
        question = test_case_context.question
        expected_answer = test_case_context.expected_answer
        agent_answer = test_case_context.agent_answer

        # 1. Perform Exact Match
        if agent_answer.lower() == expected_answer.lower():
            return TestCaseResultEntity(
                question=question,
                expected_answer=expected_answer,
                agent_answer=agent_answer,
                evaluation_method=ValidationMethodType.EXACT_MATCH,
                score=ScoreType.SCORE_5,
                explanation="Exact match found."
            )

        # 2. Calculate Semantic Similarity
        try:
            similarity_score = self._semantic_provider.CalculateSimilarity(agent_answer, expected_answer)
            if similarity_score > self._similarity_thresholds.HIGH_SIMILARITY_THRESHOLD:
                return TestCaseResultEntity(
                    question=question,
                    expected_answer=expected_answer,
                    agent_answer=agent_answer,
                    evaluation_method=ValidationMethodType.SEMANTIC_SIMILARITY,
                    score=ScoreType.SCORE_5,
                    explanation=f"High semantic similarity ({similarity_score:.2f})."
                )
            elif similarity_score < self._similarity_thresholds.LOW_SIMILARITY_THRESHOLD:
                return TestCaseResultEntity(
                    question=question,
                    expected_answer=expected_answer,
                    agent_answer=agent_answer,
                    evaluation_method=ValidationMethodType.SEMANTIC_SIMILARITY,
                    score=ScoreType.SCORE_1,
                    explanation=f"Low semantic similarity ({similarity_score:.2f})."
                )
        except Exception as e:
            print(f"Warning: Semantic similarity calculation failed, falling back to LLM. Error: {e}")
            # Continue to LLM judge if semantic similarity fails

        # 3. LLM as Judge (Fallback)
        try:
            self._rate_limiter.WaitIfNecessary()
            llm_result = self._llm_judge_provider.Judge(question, expected_answer, agent_answer)
            return TestCaseResultEntity(
                question=question,
                expected_answer=expected_answer,
                agent_answer=agent_answer,
                evaluation_method=ValidationMethodType.LLM_JUDGE,
                score=llm_result.score,
                explanation=llm_result.explanation
            )
        except Exception as e:
            print(f"Error during LLM judging fallback: {e}")
            return TestCaseResultEntity(
                question=question,
                expected_answer=expected_answer,
                agent_answer=agent_answer,
                evaluation_method=ValidationMethodType.LLM_JUDGE, # Still report as LLM_JUDGE attempt
                score=ScoreType.SCORE_1,
                explanation=f"LLM judging failed entirely: {e}"
            )

    def LoadTestCases(self, file_path: str) -> List[TestCaseEntity]:
        """
        Reads test cases from a CSV file.
        The 'expected_answer' column is mapped to TestCaseEntity's 'ground_truth_answer'.
        """
        test_cases: List[TestCaseEntity] = []
        if not os.path.exists(file_path):
            print(f"Error: CSV file not found at {file_path}")
            return []

        try:
            with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                # Check for required columns
                if 'question' not in reader.fieldnames or 'expected_answer' not in reader.fieldnames:
                    raise ValueError("CSV file must contain 'question' and 'expected_answer' columns.")

                for row in reader:
                    question = row.get('question')
                    expected_answer = row.get('expected_answer')

                    if question is not None and expected_answer is not None:
                        test_cases.append(TestCaseEntity(question=question, ground_truth_answer=expected_answer))
                    else:
                        print(f"Warning: Skipping row due to missing 'question' or 'expected_answer': {row}")
            return test_cases
        except FileNotFoundError:
            print(f"Error: File not found at {file_path}")
            return []
        except ValueError as ve:
            print(f"Error parsing CSV: {ve}")
            return []
        except Exception as e:
            print(f"An unexpected error occurred while loading test cases: {e}")
            return []

    def SaveResultsIncrementally(self, file_path: str, results_batch: List[TestCaseResultEntity], is_first_batch: bool) -> None:
        """
        Appends evaluation results to a CSV file in batches.
        """
        fieldnames = ['domanda', 'risposta_attesa', 'risposta_agente', 'metodo_valutazione', 'score', 'spiegazione']
        mode = 'w' if is_first_batch else 'a'
        
        try:
            # Determine if header needs to be written
            # Write header if it's the first batch OR if the file doesn't exist/is empty
            write_header = is_first_batch or (not os.path.exists(file_path) or os.path.getsize(file_path) == 0)

            with open(file_path, mode, newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                if write_header:
                    writer.writeheader()

                for result in results_batch:
                    writer.writerow({
                        'domanda': result.question,
                        'risposta_attesa': result.expected_answer,
                        'risposta_agente': result.agent_answer,
                        'metodo_valutazione': result.evaluation_method.value, # Use .value for Enum
                        'score': result.score.value, # Use .value for Enum
                        'spiegazione': result.explanation
                    })
        except Exception as e:
            print(f"Error saving results incrementally to {file_path}: {e}")