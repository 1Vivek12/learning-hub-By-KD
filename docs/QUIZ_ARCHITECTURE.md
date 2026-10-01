# Quiz Architecture

## Overview
The Learning Hub Quiz Engine is a robust, database-backed assessment system that prevents client-side manipulation of grades and correct answers.

## Models
- `Quiz`: Contains settings like passing score and time limit.
- `QuizQuestion` & `QuizOption`: The actual quiz structure.
- `QuizAttempt`: Tracks each student's attempt securely.
- `QuizAnswer`: Records the exact selections made.

## Security flow
1. **Fetching**: `GET /api/lessons/[lessonId]/quiz` returns questions and options but **excludes** `isCorrect` flags. 
2. **Submitting**: `POST /api/lessons/[lessonId]/quiz/attempt` sends the `questionId: optionId` pairs.
3. **Scoring**: The server performs scoring against the hidden `isCorrect` flags in PostgreSQL. 
4. **Completion**: If the score meets or exceeds the `passingScore`, the lesson is automatically marked completed via `ProgressService.markLessonComplete()`.

This ensures that network interception cannot reveal the correct answers to a cheating user.
