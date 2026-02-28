# Project: Domain

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Implementation**: ./domain

## Domain Concepts

### TestCaseEntity
📦 Content/Structure:
- `question`: `string` - The user's query or prompt.
- `ground_truth_answer`: `string` - The expected correct answer.

### ValidationMethodType
📦 Content/Structure:
- `EXACT_MATCH`: `string` - Validation performed via direct string comparison.
- `SEMANTIC_SIMILARITY`: `string` - Validation performed via semantic embedding comparison.
- `LLM_JUDGE`: `string` - Validation performed by a Large Language Model.

### ValidationResultEntity
📦 Content/Structure:
- `question`: `string` - The original question from the test case.
- `ground_truth_answer`: `string` - The expected correct answer.
- `agent_answer`: `string` - The response provided by the agent under test.
- `validation_method`: `ValidationMethodType` - The method used to determine the score.
- `score`: `number (1-5)` - The assigned validation score.
- `explanation`: `string` - A brief explanation for the assigned score.