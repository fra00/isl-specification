import os
import sys
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from typing import List, Optional

# Internal imports based on REAL IMPLEMENTATION CONTEXT and DEPENDENCY INTERFACES
# From ./domain (used by validation-logic, but included for type context)
from domain import TestCaseEntity, ValidationMethodType, ValidationResultEntity

# From ./validation-logic
from validation_logic import (
    ExactMatchEvaluator,
    SemanticSimilarityEvaluator,
    LLMJudgeEvaluator,
    CSVHandler,
    RateLimiter,
    TestCaseValidator,
    ProgressReporter # Although not directly instantiated by Main, it's part of the validation-logic module
)

class Main:
    """
    Orchestrates the entire test case validation process from input to output.
    Role: Presentation (Entry Point)
    """

    def run_validation_script(self) -> None:
        """
        Orchestrates the entire test case validation process from input to output.
        """
        # 1. Define input_csv_path: string as "input.csv".
        input_csv_path: str = "input.csv"
        # 2. Define agent_answers_csv_path: string as "agent_answers.csv".
        agent_answers_csv_path: str = "agent_answers.csv"
        # 3. Define output_csv_path: string as "output.csv".
        output_csv_path: str = "output.csv"
        # 4. Define semantic_model_name: string as "all-MiniLM-L6-v2".
        semantic_model_name: str = "all-MiniLM-L6-v2"
        # 5. Define llm_api_key: string (read from environment variable or configuration).
        llm_api_key: Optional[str] = os.getenv("GEMINI_API_KEY")

        if llm_api_key is None:
            print("Error: GEMINI_API_KEY environment variable not set. Please set it to proceed.")
            sys.exit(1)

        # 6. Instantiate csv_handler: CSVHandler.
        csv_handler: CSVHandler = CSVHandler()

        # 7. test_cases = csv_handler.read_input_test_cases(input_csv_path).
        try:
            test_cases: List[TestCaseEntity] = csv_handler.read_input_test_cases(input_csv_path)
        except FileNotFoundError:
            print(f"Error: Input test cases file not found at '{input_csv_path}'. Please ensure it exists.")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading input test cases from '{input_csv_path}': {e}")
            sys.exit(1)

        # 8. agent_answers = csv_handler.read_agent_answers(agent_answers_csv_path).
        try:
            agent_answers: List[str] = csv_handler.read_agent_answers(agent_answers_csv_path)
        except FileNotFoundError:
            print(f"Error: Agent answers file not found at '{agent_answers_csv_path}'. Please ensure it exists.")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading agent answers from '{agent_answers_csv_path}': {e}")
            sys.exit(1)

        # 9. IF len(test_cases) IS NOT EQUAL TO len(agent_answers) THEN
        #    Display error message: "Mismatch between number of test cases and agent answers."
        #    Terminate execution.
        if len(test_cases) != len(agent_answers):
            print("Error: Mismatch between number of test cases and agent answers.")
            print(f"Found {len(test_cases)} test cases but {len(agent_answers)} agent answers.")
            sys.exit(1)

        # 10. Instantiate semantic_model_instance using semantic_model_name (e.g., SentenceTransformer(semantic_model_name)).
        try:
            print(f"Loading semantic model: {semantic_model_name}...")
            semantic_model_instance = SentenceTransformer(semantic_model_name)
            print("Semantic model loaded successfully.")
        except Exception as e:
            print(f"Error initializing SemanticTransformer model '{semantic_model_name}': {e}")
            print("Please ensure the model name is correct and necessary libraries are installed.")
            sys.exit(1)

        # 11. Configure llm_client_instance using llm_api_key (e.g., google.generativeai.configure(api_key=llm_api_key) and genai.GenerativeModel('gemini-2.5-flash')).
        try:
            print("Configuring LLM client...")
            genai.configure(api_key=llm_api_key)
            llm_client_instance = genai.GenerativeModel('gemini-2.5-flash')
            print("LLM client configured successfully.")
        except Exception as e:
            print(f"Error configuring Google Generative AI client: {e}")
            print("Please check your API key and network connection.")
            sys.exit(1)

        # 12. Instantiate rate_limiter: RateLimiter with max_calls: 15, period_seconds: 60 (seconds).
        rate_limiter: RateLimiter = RateLimiter(max_calls=15, period_seconds=60)

        # 13. Instantiate exact_match_evaluator: ExactMatchEvaluator.
        exact_match_evaluator: ExactMatchEvaluator = ExactMatchEvaluator()

        # 14. Instantiate semantic_similarity_evaluator: SemanticSimilarityEvaluator with semantic_model_instance.
        semantic_similarity_evaluator: SemanticSimilarityEvaluator = SemanticSimilarityEvaluator(semantic_model_instance)

        # 15. Instantiate llm_judge_evaluator: LLMJudgeEvaluator with llm_client_instance, rate_limiter.
        llm_judge_evaluator: LLMJudgeEvaluator = LLMJudgeEvaluator(llm_client_instance, rate_limiter)

        # 16. Instantiate test_case_validator: TestCaseValidator with exact_match_evaluator, semantic_similarity_evaluator, llm_judge_evaluator.
        test_case_validator: TestCaseValidator = TestCaseValidator(
            exact_match_evaluator=exact_match_evaluator,
            semantic_similarity_evaluator=semantic_similarity_evaluator,
            llm_judge_evaluator=llm_judge_evaluator
        )

        # 17. test_case_validator.process_test_cases(test_cases, agent_answers, output_csv_path, csv_handler).
        print("\nStarting test case validation process...")
        try:
            test_case_validator.process_test_cases(test_cases, agent_answers, output_csv_path, csv_handler)
        except Exception as e:
            print(f"An unexpected error occurred during test case validation processing: {e}")
            sys.exit(1)

        # 18. Display success message: "Test case validation completed. Results saved to {output_csv_path}."
        print(f"\nTest case validation completed. Results saved to '{output_csv_path}'.")

# This block allows the script to be run directly.
if __name__ == "__main__":
    main_app = Main()
    main_app.run_validation_script()