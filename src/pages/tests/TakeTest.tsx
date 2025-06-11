import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
// import { mockTests } from '../../mocks/testMocks'; // Removed mock data
import { Test, Question, TestSubmission } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

const TakeTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  useEffect(() => {
    const rawTest = localStorage.getItem("qcm_questions");
    if (rawTest) {
      try {
        const parsed: Test = JSON.parse(rawTest);
        if (parsed.id === id && Array.isArray(parsed.questions)) {
          setTest(parsed);
          setTimeLeft(parsed.dureeMinutes * 60);
        }
      } catch (err) {
        console.error("Error parsing test:", err);
      }
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    if (!testStarted || testCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSingleChoiceAnswer = (questionId: string, answer: string) => {
    handleAnswer(questionId, answer);
  };

  const handleMultipleChoiceAnswer = (questionId: string, answer: string) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    if (currentAnswers.includes(answer)) {
      handleAnswer(
        questionId,
        currentAnswers.filter((a) => a !== answer)
      );
    } else {
      handleAnswer(questionId, [...currentAnswers, answer]);
    }
  };

  const handleTextAnswer = (questionId: string, answer: string) => {
    handleAnswer(questionId, answer);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    if (!test || !user) return;

    // Calculate score
    let score = 0;
    let maxScore = 0;

    test.questions.forEach((question) => {
      maxScore += question.points;

      const userAnswer = answers[question.id];
      if (!userAnswer) return;

      if (question.type === "single") {
        if (userAnswer === question.correctAnswers) {
          score += question.points;
        }
      } else if (question.type === "multiple") {
        const correctAnswers = question.correctAnswers as string[];
        if (Array.isArray(userAnswer)) {
          // Simple scoring: full points if all correct answers are selected and no incorrect ones
          const isCorrect =
            correctAnswers.length === userAnswer.length &&
            correctAnswers.every((a) => userAnswer.includes(a));
          if (isCorrect) {
            score += question.points;
          }
        }
      } else if (question.type === "text") {
        // Text questions would typically be reviewed by a human
        // For demo, we'll simulate auto-scoring for exact matches
        if (
          userAnswer.toLowerCase() ===
          (question.correctAnswers as string).toLowerCase()
        ) {
          score += question.points;
        }
      }
    });

    const percentage = Math.round((score / maxScore) * 100);

    // Create test submission record
    const submission: TestSubmission = {
      id: Date.now().toString(),
      testId: test.id,
      candidateId: user.id,
      testTitle: test.titre,
      startTime: new Date(
        Date.now() - test.dureeMinutes * 60 * 1000 + timeLeft * 1000
      ),
      endTime: new Date(),
      answers: Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
      })),
      score,
      maxScore,
      percentage,
    };

    // In a real app, this would be sent to an API
    console.log("Test submission:", submission);

    setTestCompleted(true);

    // Navigate to results page
    setTimeout(() => {
      navigate(`/results/${test.id}`, { state: { submission } });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Test not found
        </h2>
        <p className="text-gray-500 mb-4">
          The test you're looking for doesn't exist or has been removed.
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

  if (testCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test Submitted Successfully!
        </h2>
        <p className="text-gray-500 mb-6">
          Your answers have been recorded and are being processed.
        </p>
        <p className="text-gray-500">Redirecting to results page...</p>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 p-6">
          <h1 className="text-2xl font-bold text-gray-900">{test.titre}</h1>
          <p className="mt-2 text-gray-600">
            {test.description ||
              "Please complete this assessment to the best of your ability."}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Duration</p>
                <p className="text-sm text-gray-500">
                  {test.dureeMinutes} minutes
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Questions</p>
                <p className="text-sm text-gray-500">
                  {test.questions.length} questions
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Scoring</p>
                <p className="text-sm text-gray-500">
                  Results will be available immediately after completion.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Do not refresh or close this page during the test.
                      </li>
                      <li>
                        The timer will start as soon as you begin the test.
                      </li>
                      <li>Ensure you have a stable internet connection.</li>
                      <li>
                        Once started, you must complete the test in one sitting.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={startTest}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion: Question = test.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium text-gray-900">{test.titre}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </p>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-1" />
            <span
              className={`font-medium ${
                timeLeft < 60
                  ? "text-red-600"
                  : timeLeft < 300
                  ? "text-yellow-600"
                  : "text-gray-700"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {currentQuestion.question}
            </h2>
            <div className="text-sm text-gray-500">
              {currentQuestion.points}{" "}
              {currentQuestion.points === 1 ? "point" : "points"}
            </div>
          </div>

          <div className="space-y-4">
            {/* Single choice */}
            {currentQuestion.type === "single" &&
              currentQuestion.options?.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? "bg-blue-50 border-blue-300"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={() =>
                          handleSingleChoiceAnswer(currentQuestion.id, option)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

            {/* Multiple choice */}
            {currentQuestion.type === "multiple" &&
              currentQuestion.options?.length > 0 && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                        (
                          (answers[currentQuestion.id] as string[]) || []
                        ).includes(option)
                          ? "bg-blue-50 border-blue-300"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={(
                          (answers[currentQuestion.id] as string[]) || []
                        ).includes(option)}
                        onChange={() =>
                          handleMultipleChoiceAnswer(currentQuestion.id, option)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

            {/* Text answer */}
            {currentQuestion.type === "text" && (
              <div>
                <textarea
                  name={`question-${currentQuestion.id}`}
                  rows={5}
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) =>
                    handleTextAnswer(currentQuestion.id, e.target.value)
                  }
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Type your answer here..."
                ></textarea>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 flex items-center text-sm font-medium rounded-md ${
              currentQuestionIndex === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Previous
          </button>

          <button
            onClick={
              currentQuestionIndex === test.questions.length - 1
                ? submitAnswers
                : goToNextQuestion
            }
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            {currentQuestionIndex === test.questions.length - 1
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
