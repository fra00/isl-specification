from dataclasses import dataclass, field
from enum import Enum

# Domain Concepts

@dataclass(frozen=True)
class TestCaseEntity:
    """
    Represents a single test case with a user query and its expected correct answer.
    """
    question: str = field(default="")
    ground_truth_answer: str = field(default="")

class ValidationMethodType(str, Enum):
    """
    Defines the types of validation methods available for evaluating agent responses.
    """
    EXACT_MATCH = "EXACT_MATCH"
    SEMANTIC_SIMILARITY = "SEMANTIC_SIMILARITY"
    LLM_JUDGE = "LLM_JUDGE"

@dataclass(frozen=True)
class ValidationResultEntity:
    """
    Represents the outcome of validating an agent's response against a ground truth.
    """
    validation_method: ValidationMethodType
    question: str = field(default="")
    ground_truth_answer: str = field(default="")
    agent_answer: str = field(default="")
    score: float = field(default=0.0) # Score is typically between 1 and 5, 0.0 is a safe initial default
    explanation: str = field(default="")