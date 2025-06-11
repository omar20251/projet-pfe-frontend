import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  CheckCircle,
} from "lucide-react";
import { JobOffer } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import jobService from "../../services/jobService";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const generateTests = async () => {
    const prompt = `Generate 3 QCMs about "${job.competences.join(
      ", "
    )}" lists senior level`;
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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", // Remplace par ta clé
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            temperature: 0.5,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content;
      const questions = parseQCMString(generatedText);

      function parseQCMString(qcmString: string) {
        const questions = [];
        const qcmBlocks = qcmString.trim().split(/\n{2,}/); // split by double newlines
        let id = 1;

        for (const block of qcmBlocks) {
          const lines = block
            .trim()
            .split("\n")
            .map((line) => line.trim());
          const titleMatch = lines[0].match(/\*\*(.*?)\*\*/);
          const titre = titleMatch ? titleMatch[1] : `QCM ${id}`;
          const questionText = lines.find(
            (line) =>
              !line.startsWith("**") && !line.startsWith("Correct answer:")
          );

          const optionsMap: Record<string, string> = {};
          for (const line of lines) {
            const match = line.match(/^([A-D])\)\s+(.*)$/);
            if (match) {
              const [, letter, text] = match;
              optionsMap[letter] = text;
            }
          }

          const correctLetterMatch = block.match(
            /Correct answer:\s+([A-D])\)/i
          );
          const correctLetter = correctLetterMatch?.[1];
          const options = ["A", "B", "C", "D"].map((l) => optionsMap[l] ?? "");

          if (questionText) {
            questions.push({
              id: id++,
              titre,
              question: questionText,
              options,
              correctAnswer: correctLetter
                ? "ABCD".indexOf(correctLetter)
                : undefined,
            });
          }
        }

        return questions;
      }

      if (generatedText) {
        // Tu peux stocker le QCM dans le state ou le backend
        console.log("Generated QCMs:", generatedText);
        // Redirection vers une nouvelle page si tu veux
        navigate("/tests");
        console.log("questions", questions);
        localStorage.setItem("qcm_questions", JSON.stringify(questions));

        //navigate('/tests/generated', { state: { questions: generatedText } });
      } else {
        alert("No questions generated.");
      }
    } catch (error) {
      console.error("Failed to generate tests:", error);
      alert("Error generating tests.");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const jobData = await jobService.getJobById(id);

        // Transform backend data to frontend format
        const transformedJob: JobOffer = {
          id: jobData.id.toString(),
          titre: jobData.title,
          entreprise: jobData.entreprise_name,
          description: jobData.description,
          lieu: jobData.place,
          postes_vacants: jobData.open_postes,
          experience: jobData.experience,
          niveau_etude: jobData.education_level,
          langue: jobData.language,
          competences: jobData.skills
            ? jobData.skills.split(",").map((s: string) => s.trim())
            : [],
          salaire: jobData.salary,
          typeContrat: jobData.contract_type,
          datePublication: new Date(jobData.publication_date),
          dateExpiration: new Date(jobData.expiration_date),
          etat: jobData.statut === "valide" ? "active" : "closed",
        };

        setJob(transformedJob);

        // Check if user has applied (you might want to implement this API call)
        if (isAuthenticated && user?.role === "candidate") {
          try {
            const applications = await jobService.getCandidateApplications();
            const hasAppliedToThisJob = applications.some(
              (app: any) => app.offre_id === parseInt(id)
            );
            setHasApplied(hasAppliedToThisJob);
          } catch (appError) {
            console.error("Error checking application status:", appError);
          }
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    if (!job || user?.role !== "candidate") {
      return;
    }

    try {
      setIsApplying(true);
      await jobService.applyToJob({ offre_id: parseInt(job.id) });
      setHasApplied(true);

      // Show success message or redirect to tests if available
      // For now, just update the state
    } catch (err: any) {
      console.error("Error applying to job:", err);
      // Handle specific error messages
      if (err.response?.status === 400) {
        alert("You have already applied to this job.");
        setHasApplied(true);
      } else {
        alert("Failed to apply to job. Please try again later.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading job details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Job not found
        </h2>
        <p className="text-gray-500 mb-4">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.titre}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-700">
            {job.entreprise}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {hasApplied ? (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium flex items-center justify-center"
              disabled
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Applied
            </button>
          ) : (
            <button
              onClick={generateTests}
              disabled={isApplying}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors ${
                isApplying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isApplying ? "Generating..." : "take tests"}
            </button>
          )}
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Save offre
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {job.description}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Requirements
            </h3>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
              <li>Bachelor's degree or equivalent practical experience</li>
              <li>{job.experience} of professional experience</li>
              <li>Proficient in {job.langue} (written and verbal)</li>
              <li>Strong problem-solving abilities and analytical skills</li>
              <li>Experience with {job.competences.join(", ")}</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Benefits
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Competitive salary and performance bonuses</li>
              <li>Health insurance and retirement plans</li>
              <li>Flexible working hours and remote work options</li>
              <li>Professional development opportunities</li>
              <li>Friendly and collaborative work environment</li>
            </ul>
          </div>

          {job.tests && job.tests.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assessment Tests
              </h2>
              <p className="text-gray-500 mb-4">
                This position requires completing the following tests as part of
                the application process:
              </p>

              <div className="space-y-4">
                {job.tests.map((test, index) => (
                  <div
                    key={test.id}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {test.titre}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {test.description ||
                            `Test ${index + 1} for this position`}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{test.dureeMinutes} minutes</span>
                          <span className="mx-2">•</span>
                          <span>{test.questions.length} questions</span>
                        </div>
                      </div>
                      {hasApplied && (
                        <button
                          onClick={() => navigate(`/tests/${test.id}`)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Take Test
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Job Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{job.lieu}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Job Type</p>
                  <p className="text-gray-900">{job.typeContrat}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Experience
                  </p>
                  <p className="text-gray-900">{job.experience}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Posted On</p>
                  <p className="text-gray-900">
                    {new Date(job.datePublication).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Expires On
                  </p>
                  <p className="text-gray-900">
                    {new Date(job.dateExpiration).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Skills & Competencies
            </h2>

            <div className="flex flex-wrap gap-2">
              {job.competences.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              About the Company
            </h2>

            <p className="text-gray-700 mb-4">
              {job.entreprise} is a leading company in its industry, committed
              to innovation and excellence.
            </p>

            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit Company Profile
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ready to apply for this job?
            </h2>
            <p className="text-gray-600 mt-1">
              Complete the assessments to showcase your skills to the employer.
            </p>
          </div>

          {hasApplied ? (
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-md font-medium flex items-center justify-center"
              disabled
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
