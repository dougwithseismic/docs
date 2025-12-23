export const QualifyingQuiz = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showResults, setShowResults] = React.useState(false);
  const [fitScore, setFitScore] = React.useState(0);

  const questions = [
    {
      id: "project_type",
      question: "What are we building?",
      options: [
        { value: "mvp", label: "New Product / MVP", score: 5 },
        { value: "extension", label: "Chrome Extension", score: 5 },
        { value: "automation", label: "Internal Automation / AI", score: 5 },
        { value: "legacy", label: "Fixing Legacy Code", score: 1 },
      ],
    },
    {
      id: "stage",
      question: "What is the current state?",
      options: [
        { value: "idea", label: "Just an idea (Napkin sketch)", score: 3 },
        { value: "ready", label: "Designs/Specs ready", score: 5 },
        { value: "live_broken", label: "Live but needs fixing", score: 4 },
        { value: "scaling", label: "Scaling (Need optimization)", score: 5 },
      ],
    },
    {
      id: "goal",
      question: "What is the primary goal?",
      options: [
        { value: "revenue", label: "Drive Revenue / Get Customers", score: 5 },
        { value: "efficiency", label: "Save Time / Automate Ops", score: 5 },
        { value: "acquisition", label: "Prepare for Acquisition", score: 4 },
        { value: "maintenance", label: "General Maintenance", score: 1 },
      ],
    },
    {
      id: "model",
      question: "How do you want to work?",
      options: [
        { value: "partner", label: "I need a Technical Partner to lead", score: 5 },
        { value: "hands", label: "I need hands to code my specs", score: 2 },
        { value: "fix", label: "I need a quick one-off fix", score: 3 },
        { value: "consult", label: "I just need advice", score: 3 },
      ],
    },
  ];

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (window.WithSeismicTracker) {
      window.WithSeismicTracker.trackEvent("qualifying_question_answered", {
        questionId,
        answer: answer.value,
        score: answer.score,
      });
    }

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      const totalScore = Object.values(newAnswers).reduce(
        (sum, ans) => sum + ans.score,
        0
      );
      const maxScore = questions.reduce(
        (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
        0
      );
      const percentage = Math.round((totalScore / maxScore) * 100);
      setFitScore(percentage);

      if (window.WithSeismicTracker) {
        window.WithSeismicTracker.trackEvent("qualifying_quiz_completed", {
          totalScore,
          maxScore,
          percentage,
          answers: Object.fromEntries(
            Object.entries(newAnswers).map(([k, v]) => [k, v.value])
          ),
        });
      }

      setShowResults(true);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setFitScore(0);
  };

  const getFitLevel = (score) => {
    if (score >= 80) return { level: "excellent", emoji: "🚀", color: "green" };
    if (score >= 60) return { level: "good", emoji: "✨", color: "blue" };
    return { level: "exploratory", emoji: "💡", color: "yellow" };
  };

  const getResultsContent = () => {
    const fit = getFitLevel(fitScore);
    const stageAnswer = answers.stage?.value;
    const modelAnswer = answers.model?.value;

    // Logic to determine recommendation based on scope
    let recommendation = "Recommended: Single Sprint ($7,000)";
    if (stageAnswer === "scaling" || stageAnswer === "live_broken" || modelAnswer === "partner") {
      recommendation = "Recommended: Multi-Sprint Engagement ($21,000 - $28,000)";
    }

    if (fitScore >= 80) {
      return {
        title: "We Should Build This.",
        message:
          "You have a clear goal and need a technical partner. This is exactly the type of high-impact work I specialize in.",
        cta: "Book a Technical Discovery",
        ctaLink: "/contact",
        recommendation: recommendation,
      };
    } else if (fitScore >= 60) {
      return {
        title: "Worth a Conversation",
        message:
          "I can definitely help, but we should clarify the scope first. Let's chat to see if a Sprint or a Partnership makes more sense.",
        cta: "Schedule a Chat",
        ctaLink: "/contact",
        recommendation: recommendation,
      };
    } else {
      return {
        title: "Might Not Be a Fit (Yet)",
        message:
          modelAnswer === "hands"
            ? "It sounds like you need a freelancer to execute specific tasks, rather than a technical partner. I recommend looking at Upwork or Toptal for this stage."
            : "Based on your answers, you might be looking for something smaller or different than what I offer. Check out my case studies to see the scale of projects I usually take on.",
        cta: "View Case Studies",
        ctaLink: "/case-studies/introduction",
        recommendation: null,
      };
    }
  };

  if (showResults) {
    const results = getResultsContent();
    const fit = getFitLevel(fitScore);

    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 my-8 border border-neutral-200 dark:border-neutral-800 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{fit.emoji}</div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {results.title}
          </h3>
          <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2 mb-6 max-w-xs mx-auto overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${fit.color === "green"
                ? "bg-green-500"
                : fit.color === "blue"
                  ? "bg-blue-500"
                  : "bg-yellow-500"
                }`}
              style={{ width: `${fitScore}%` }}
            />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
            {results.message}
          </p>
          {results.recommendation && (
            <div className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800">
              {results.recommendation}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={results.ctaLink}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-center no-underline"
          >
            {results.cta}
          </a>
          <button
            onClick={restart}
            className="px-8 py-4 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 my-8 border border-neutral-200 dark:border-neutral-800 shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Technical Discovery
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentStep + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {currentQuestion.question}
        </h4>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              className="w-full text-left p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group bg-white dark:bg-neutral-800/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {option.label}
                </span>
                <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors flex items-center gap-2"
        >
          ← Back
        </button>
      )}
    </div>
  );
};