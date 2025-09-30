export const QualifyingQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [fitScore, setFitScore] = useState(0);

  const questions = [
    {
      id: "revenue",
      question: "What's your current annual recurring revenue (ARR)?",
      type: "choice",
      options: [
        { value: "pre-revenue", label: "Pre-revenue", score: 0 },
        { value: "under-300k", label: "Under $300K", score: 1 },
        { value: "300k-1m", label: "$300K - $1M", score: 3 },
        { value: "1m-5m", label: "$1M - $5M", score: 5 },
        { value: "over-5m", label: "Over $5M", score: 4 },
      ],
    },
    {
      id: "problem",
      question: "How would you describe your biggest operational challenge?",
      type: "choice",
      options: [
        {
          value: "manual-bottleneck",
          label: "Manual processes blocking growth",
          score: 5,
        },
        {
          value: "scaling-issues",
          label: "Can't scale current operations",
          score: 4,
        },
        {
          value: "exploring",
          label: "Just exploring automation options",
          score: 2,
        },
        {
          value: "no-problem",
          label: "No specific problem yet",
          score: 0,
        },
      ],
    },
    {
      id: "budget",
      question: "What's your monthly budget for automation/tooling?",
      type: "choice",
      options: [
        { value: "under-5k", label: "Under $5K/month", score: 1 },
        { value: "5k-10k", label: "$5K - $10K/month", score: 4 },
        { value: "10k-20k", label: "$10K - $20K/month", score: 5 },
        { value: "over-20k", label: "Over $20K/month", score: 5 },
        { value: "flexible", label: "Flexible for the right solution", score: 3 },
      ],
    },
    {
      id: "timeline",
      question: "When do you need to start?",
      type: "choice",
      options: [
        { value: "asap", label: "ASAP (within 2 weeks)", score: 5 },
        { value: "month", label: "Within a month", score: 4 },
        { value: "quarter", label: "This quarter", score: 3 },
        { value: "researching", label: "Just researching now", score: 1 },
      ],
    },
    {
      id: "champion",
      question: "Who will drive this internally?",
      type: "choice",
      options: [
        { value: "founder", label: "Founder/CEO (me)", score: 5 },
        {
          value: "exec",
          label: "Executive team member with authority",
          score: 4,
        },
        { value: "manager", label: "Department manager", score: 3 },
        { value: "exploring", label: "Still building the case", score: 1 },
      ],
    },
  ];

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Track the answer
    if (window.WithSeismicTracker) {
      window.WithSeismicTracker.trackEvent("qualifying_question_answered", {
        questionId,
        answer: answer.value,
        score: answer.score,
      });
    }

    // Move to next question or show results
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Calculate fit score
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

      // Track completion
      if (window.WithSeismicTracker) {
        window.WithSeismicTracker.trackEvent("qualifying_quiz_completed", {
          totalScore,
          maxScore,
          percentage,
          answers: Object.fromEntries(
            Object.entries(newAnswers).map(([k, v]) => [k, v.value])
          ),
        });
        // Add significant engagement points for completing the quiz
        window.WithSeismicTracker.trackEvent("calculationPerformed", {
          tool: "qualifying_quiz",
          result: percentage,
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
    if (score >= 80) return { level: "excellent", emoji: "🎯", color: "green" };
    if (score >= 60) return { level: "good", emoji: "✓", color: "blue" };
    if (score >= 40) return { level: "moderate", emoji: "~", color: "yellow" };
    return { level: "exploratory", emoji: "?", color: "gray" };
  };

  const getResultsContent = () => {
    const fit = getFitLevel(fitScore);
    const revenueAnswer = answers.revenue?.value;
    const budgetAnswer = answers.budget?.value;

    if (fitScore >= 80) {
      return {
        title: "You're an Excellent Fit!",
        message:
          "Based on your answers, we should absolutely talk. You have clear pain points, budget allocated, and decision-making authority. Let's skip the sales dance and get to work.",
        cta: "Book a Strategy Call",
        ctaLink: "/contact",
        pricing: "$7,500/month (3-month minimum)",
      };
    } else if (fitScore >= 60) {
      return {
        title: "You're a Good Fit",
        message:
          "You have the foundation in place, but there might be some gaps to address. Let's talk about your specific situation and see if we can make this work.",
        cta: "Discuss Your Situation",
        ctaLink: "/contact",
        pricing: "$7,500/month (3-month minimum)",
      };
    } else if (fitScore >= 40) {
      return {
        title: "We Might Be Able to Help",
        message:
          "You're in the middle ground. Depending on your specific needs, we could potentially work together, but it'll require a conversation to understand the details.",
        cta: "Email Your Situation",
        ctaLink: "mailto:hello@withseismic.com?subject=Qualifying Quiz Results",
        pricing:
          "Custom pricing based on scope - typically $7,500+/month for 3 months",
      };
    } else {
      return {
        title: "Let's Be Honest...",
        message:
          revenueAnswer === "pre-revenue" || budgetAnswer === "under-5k"
            ? "Right now, you're better off with freelancers on Upwork or exploring no-code tools. Our minimum engagement is $22,500 (3 months × $7,500), which might not make sense at your stage. Come back when you're doing $300K+ ARR and have operational bottlenecks blocking growth."
            : "Based on your answers, we might not be the right fit right now. You're either still in research mode or don't have the urgency/authority to move forward. That's completely fine! Bookmark us for when things change.",
        cta: "Explore Case Studies Instead",
        ctaLink: "/case-studies/introduction",
        pricing: null,
      };
    }
  };

  if (showResults) {
    const results = getResultsContent();
    const fit = getFitLevel(fitScore);

    return (
      <div className="bg-background rounded-lg p-6 my-6 border border-neutral-500/20 shadow-sm">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{fit.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {results.title}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Fit Score: {fitScore}%
          </div>
          <div
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6"
          >
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                fit.color === "green"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : fit.color === "blue"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : fit.color === "yellow"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}
              style={{ width: `${fitScore}%` }}
            />
          </div>
        </div>

        <div className="bg-neutral-500/5 rounded-lg p-6 mb-6 border border-neutral-500/10">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
            {results.message}
          </p>
          {results.pricing && (
            <div className="pt-4 border-t border-neutral-500/20">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Investment
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {results.pricing}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <a
            href={results.ctaLink}
            className="flex-1 block text-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
          >
            {results.cta}
          </a>
          <button
            onClick={restart}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Retake
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-500/20">
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Your answers are tracked to help us understand our ideal customer
            profile.
            <br />
            No spam, no hard sells. Just honest assessment.
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="bg-background rounded-lg p-6 my-6 border border-neutral-500/20 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Save Us Both Time
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentStep + 1} of {questions.length}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Answer 5 quick questions so we can have a focused conversation about what matters to you. Takes 2 minutes.
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              className="w-full text-left p-4 rounded-lg border border-neutral-500/20 bg-neutral-500/5 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {option.label}
                </span>
                <span className="text-gray-400 group-hover:text-orange-500 transition-colors">
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
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
};