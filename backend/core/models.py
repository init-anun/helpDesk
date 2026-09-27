from typing import List, Literal
from pydantic import BaseModel, Field


class LanguageQuestionLLM(BaseModel):
    question: str = Field(
        description="A multiple-choice question that tests the provided concept."
    )

    questionType: Literal[
        "multiple_choice",
        "fill_in_the_blank",
        "true_false",
        "scenario_based",
        "grammar_correction",
        "sentence_selection",
        "meaning_based",
        "usage_based",
    ] = Field(
        description="The type/style of the multiple-choice question."
    )

    difficulty: Literal[
        "easy",
        "medium",
        "hard",
    ] = Field(
        description="The difficulty level of the question."
    )

    options: List[str] = Field(
        description=(
            "The answer choices. "
            "For 'true_false', this list must contain exactly ['True', 'False']. "
            "For all other question types, it must contain exactly four options."
        )
    )

    correctAnswer: str = Field(
        description="The correct answer. It must exactly match one of the values in the options list."
    )

    explanation: str = Field(
        description="A concise explanation of why the correct answer is correct."
    )


class LanguageTutorResponseLLM(BaseModel):
    concept: str = Field(
        description="The concept provided by the learner for knowledge testing."
    )

    questions: List[LanguageQuestionLLM] = Field(
        description="A list of 10-12 multiple-choice questions that assess understanding of the concept."
    )