import React, { useEffect, useState } from "react";

export interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "text";
  options?: string[];
  correctAnswers?: string | string[];
  points: number;
}

const TakeTest: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use this state to hold answers (string for single/text, array for multiple)
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("qcm_questions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQuestions(parsed.questions || []);
      } catch (e) {
        console.error("Erreur parsing QCM localStorage :", e);
      }
    }
  }, []);

  const handleSingleChoiceAnswer = (questionId: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleMultipleChoiceAnswer = (questionId: string, choice: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (current.includes(choice)) {
        return { ...prev, [questionId]: current.filter((c) => c !== choice) };
      } else {
        return { ...prev, [questionId]: [...current, choice] };
      }
    });
  };

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };
  const applicationFromHere = () => {
    console.log("Application from here with score:");
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmitTest();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    let total = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];

      if (q.type === "text") {
        // For text answers, you might want to implement custom validation
        // Here we just skip scoring text answers
        return;
      }

      const correct = Array.isArray(q.correctAnswers)
        ? q.correctAnswers
        : q.correctAnswers
        ? [q.correctAnswers]
        : [];

      if (q.type === "single" && typeof userAnswer === "string") {
        if (correct.includes(userAnswer)) {
          total += q.points;
        }
      }

      if (q.type === "multiple" && Array.isArray(userAnswer)) {
        // Check if user's answers match correct answers exactly (order not important)
        const userSet = new Set(userAnswer);
        const correctSet = new Set(correct);
        if (
          userSet.size === correctSet.size &&
          [...userSet].every((a) => correctSet.has(a))
        ) {
          total += q.points;
        }
      }
    });

    setScore(total);
    setShowResult(true);
  };

  if (questions.length === 0) {
    return <p>Chargement des questions...</p>;
  }

  const currentQuestion = questions[currentIndex];
  console.log("Current Question:", currentQuestion, currentIndex);
  return (
    <div className="max-w-3xl mx-auto">
      {showResult ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Résultat final</h2>
          <p className="text-lg">
            Score: <span className="font-bold">{score}</span> /{" "}
            {questions.reduce((sum, q) => sum + q.points, 0)}
          </p>
          <button
            onClick={applicationFromHere}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 p-4 flex justify-between items-center">
            <div>
              <h1 className="text-lg font-medium text-gray-900">Test QCM</h1>
              <p className="text-sm text-gray-600">
                Question {currentIndex + 1} sur {questions.length}
              </p>
            </div>
          </div>

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
              {currentQuestion.type === "single" && currentQuestion.options && (
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

              {currentQuestion.type === "multiple" &&
                currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                          (answers[currentQuestion.id] || []).includes(option)
                            ? "bg-blue-50 border-blue-300"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={(answers[currentQuestion.id] || []).includes(
                            option
                          )}
                          onChange={() =>
                            handleMultipleChoiceAnswer(
                              currentQuestion.id,
                              option
                            )
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
                    placeholder="Tapez votre réponse ici..."
                  ></textarea>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentIndex === 0}
              className={`px-4 py-2 flex items-center text-sm font-medium rounded-md ${
                currentIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Précédent
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  Object.keys(answers).length === questions.length
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-400 text-white cursor-not-allowed"
                }`}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Terminer
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md"
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTest;
