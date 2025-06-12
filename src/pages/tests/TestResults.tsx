import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Award,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { Test, TestSubmission } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

const TestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState<Test | null>(null);
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setIsLoading(true);

    // Load tests from localStorage (assumed JSON array of Test)
    const storedTestsJSON = localStorage.getItem("qcm_questions");
    let storedTests: Test[] = [];
    if (storedTestsJSON) {
      try {
        storedTests = JSON.parse(storedTestsJSON);
      } catch (err) {
        console.error("Error parsing tests from localStorage", err);
      }
    }

    const foundTest = storedTests.find((t) => t.id === id) || null;
    setTest(foundTest);

    // Try to get submission from location.state (passed via navigate)
    const submissionFromState = location.state?.submission as
      | TestSubmission
      | undefined;

    if (submissionFromState) {
      // Dates may be strings when passed, so convert to Date objects:
      const normalizedSubmission = {
        ...submissionFromState,
        startTime: new Date(submissionFromState.startTime),
        endTime: new Date(submissionFromState.endTime),
      };
      setSubmission(normalizedSubmission);
      setIsLoading(false);
    } else if (foundTest) {
      // Create a mock submission for demo purposes if none passed
      const mockSubmission: TestSubmission = {
        id: "123",
        testId: foundTest.id,
        candidateId: user?.id || "",
        testTitle: foundTest.titre,
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        endTime: new Date(Date.now() - 5 * 60 * 1000),
        answers: foundTest.questions.map((q) => ({
          questionId: q.id,
          answer:
            q.type === "single"
              ? q.options?.[0] ?? ""
              : q.type === "multiple"
              ? [q.options?.[0] ?? ""]
              : "Sample answer",
        })),
        score: 85,
        maxScore: 100,
        percentage: 85,
      };
      setSubmission(mockSubmission);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [id, location.state, user?.id]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  // Returns null if no result found
  const getQuestionResult = (questionId: string) => {
    if (!test || !submission) return null;

    const question = test.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const answer = submission.answers.find((a) => a.questionId === questionId);
    if (!answer)
      return {
        isCorrect: false,
        userAnswer: null,
        correctAnswer: question.correctAnswers,
      };

    let isCorrect = false;

    if (question.type === "single") {
      isCorrect = answer.answer === question.correctAnswers;
    } else if (question.type === "multiple") {
      if (
        Array.isArray(answer.answer) &&
        Array.isArray(question.correctAnswers)
      ) {
        const correctAnswers = question.correctAnswers;
        isCorrect =
          correctAnswers.length === answer.answer.length &&
          correctAnswers.every((a) => answer.answer.includes(a));
      }
    } else if (question.type === "text") {
      if (
        typeof answer.answer === "string" &&
        typeof question.correctAnswers === "string"
      ) {
        isCorrect =
          answer.answer.trim().toLowerCase() ===
          question.correctAnswers.trim().toLowerCase();
      }
    }

    return {
      isCorrect,
      userAnswer: answer.answer,
      correctAnswer: question.correctAnswers,
    };
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return "excellent";
    if (percentage >= 80) return "good";
    if (percentage >= 70) return "satisfactory";
    if (percentage >= 60) return "needs improvement";
    return "poor";
  };

  const performanceLevelMessages: Record<string, string> = {
    excellent:
      "Outstanding performance! You demonstrated comprehensive knowledge of the subject matter.",
    good: "Good job! You have a solid understanding of most concepts tested.",
    satisfactory:
      "You have a reasonable grasp of the fundamentals, but there's room for improvement.",
    "needs improvement":
      "You demonstrated basic knowledge but need to strengthen your understanding of key concepts.",
    poor: "You need significant improvement in your understanding of the subject matter.",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test || !submission) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Results not found
        </h2>
        <p className="text-gray-500 mb-4">
          We couldn&apos;t find the test results you&apos;re looking for.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // Calculate test duration in minutes
  const testDuration =
    submission.endTime && submission.startTime
      ? Math.round(
          (new Date(submission.endTime).getTime() -
            new Date(submission.startTime).getTime()) /
            60000
        )
      : test.dureeMinutes;

  const performanceLevel = getPerformanceLevel(submission.percentage);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
      </div>

      {/* Test info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 p-6">
          <h2 className="text-xl font-medium text-gray-900">{test.titre}</h2>
          <p className="mt-1 text-gray-600">
            {submission.testTitle || test.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Score:{" "}
                <span className="font-medium">
                  {submission.score}/{submission.maxScore} (
                  {submission.percentage}%)
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Duration:{" "}
                <span className="font-medium">{testDuration} minutes</span>
              </span>
            </div>

            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Completed:{" "}
                <span className="font-medium">
                  {submission.endTime
                    ? new Date(submission.endTime).toLocaleString()
                    : "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Summary
              </h3>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  submission.percentage >= 80
                    ? "bg-green-100 text-green-800"
                    : submission.percentage >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submission.percentage}%
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full ${
                  submission.percentage >= 80
                    ? "bg-green-600"
                    : submission.percentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
                style={{ width: `${submission.percentage}%` }}
              />
            </div>

            <p className="text-sm text-gray-700">
              {performanceLevelMessages[performanceLevel]}
            </p>
          </div>

          {/* Questions breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Questions Breakdown</h3>
            <ul className="divide-y divide-gray-100 border rounded-md border-gray-200">
              {test.questions.map((question, index) => {
                const result = getQuestionResult(question.id);
                const isExpanded = expandedQuestions.has(question.id);

                return (
                  <li key={question.id} className="p-4 flex flex-col">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="font-semibold text-gray-900">
                          {index + 1}. {question.enonce}
                        </div>
                        {result && result.isCorrect ? (
                          <Check className="text-green-500 w-5 h-5" />
                        ) : (
                          <X className="text-red-500 w-5 h-5" />
                        )}
                      </div>
                      <div className="flex items-center text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {isExpanded && result && (
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <div>
                          <strong>Your answer:</strong>{" "}
                          {Array.isArray(result.userAnswer)
                            ? result.userAnswer.join(", ")
                            : result.userAnswer || "No answer"}
                        </div>
                        <div>
                          <strong>Correct answer:</strong>{" "}
                          {Array.isArray(result.correctAnswer)
                            ? result.correctAnswer.join(", ")
                            : result.correctAnswer}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
