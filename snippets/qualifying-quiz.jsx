import { useState } from 'react';

export const QualifyingQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [fitScore, setFitScore] = useState(0);

  const questions = [
    {
      id: "revenue",
      question: "What's your current revenue situation?",
      type: "choice",
      options: [
        { value: "pre-revenue", label: "Pre-revenue / Just starting", score: 0 },
        { value: "under-100k", label: "Under $100K ARR", score: 1 },
        { value: "100k-500k", label: "$100K - $500K ARR", score: 3 },
        { value: "500k-2m", label: "$500K - $2M ARR", score: 5 },
        { value: "over-2m", label: "Over $2M ARR", score: 5 },
      ],
    },
    {
      id: "problem",
      question: "What's your biggest pain point right now?",
      type: "choice",
      options: [
        {
          value: "team-drowning",
          label: "Team drowning in manual work",
          score: 5,
        },
        {
          value: "cant-scale",
          label: "Can't scale without hiring more people",
          score: 5,
        },
        {
          value: "inefficient",
          label: "Operations feel inefficient",
          score: 3,
        },
        {
          value: "exploring",
          label: "Just exploring automation",
          score: 1,
        },
      ],
    },
    {
      id: "budget",
      question: "What can you invest monthly in engineering?",
      type: "choice",
      options: [
        { value: "under-3k", label: "Under $3K/month", score: 0 },
        { value: "3k-7k", label: "$3K - $7K/month", score: 3 },
        { value: "7k-15k", label: "$7K - $15K/month", score: 5 },
        { value: "over-15k", label: "$15K+/month", score: 5 },
        { value: "roi-based", label: "Depends on ROI", score: 4 },
      ],
    },
    {
      id: "timeline",
      question: "When do you need this?",
      type: "choice",
      options: [
        { value: "asap", label: "Yesterday (urgent)", score: 5 },
        { value: "2-weeks", label: "Within 2 weeks", score: 4 },
        { value: "month", label: "Next month", score: 3 },
        { value: "researching", label: "Just researching", score: 1 },
      ],
    },
    {
      id: "decision",
      question: "Who makes the final call?",
      type: "choice",
      options: [
        { value: "founder", label: "I'm the founder/CEO", score: 5 },
        {
          value: "exec",
          label: "I'm an executive with budget",
          score: 5,
        },
        { value: "manager", label: "I manage a department", score: 2 },
        { value: "contributor", label: "I'm building the case", score: 1 },
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
        title: "Perfect Fit - Let's Talk",
        message:
          "You have real pain, budget authority, and urgency. This is exactly what I solve. Let's skip the pitch and talk specifics—I can likely start within a week.",
        cta: "Book a Call",
        ctaLink: "/contact",
        pricing: "Starting at $3,500/month",
        note: "Most clients start with 1-3 months, then continue month-to-month",
      };
    } else if (fitScore >= 60) {
      return {
        title: "Strong Fit - Worth Exploring",
        message:
          "You have the fundamentals. Let's talk through your specific situation and see if the timing makes sense for both of us.",
        cta: "Schedule a Chat",
        ctaLink: "/contact",
        pricing: "Starting at $3,500/month",
        note: "Pricing depends on scope and timeline",
      };
    } else if (fitScore >= 40) {
      return {
        title: "Potentially a Fit",
        message:
          "There are some gaps, but depending on your specific needs, we might be able to work together. Email me your situation and I'll give you honest feedback.",
        cta: "Email Your Details",
        ctaLink: "mailto:hello@withseismic.com?subject=Qualifying Quiz - Need Advice",
        pricing: "Typically $3,500-$10K/month",
        note: "Custom scoping based on your business problem",
      };
    } else {
      const isEarlyStage = revenueAnswer === "pre-revenue" || budgetAnswer === "under-3k";
      return {
        title: isEarlyStage ? "Not There Yet" : "Timing Might Be Off",
        message: isEarlyStage
          ? "At your stage, you're better off with freelancers or no-code tools. I work with companies doing $100K+ ARR with operational bottlenecks. Bookmark this for when you're scaling and hitting growth walls."
          : "Based on your answers, we're probably not aligned right now. You might be in research mode or not have urgency/authority. That's fine! Check out the case studies to see what's possible, then come back when timing's better.",
        cta: isEarlyStage ? "See What's Possible" : "Read Case Studies",
        ctaLink: "/case-studies/introduction",
        pricing: null,
        note: null,
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
              {results.note && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {results.note}
                </div>
              )}
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
            Answers tracked for analytics. No spam. Just honest feedback on fit.
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
            Are We a Good Fit?
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentStep + 1} of {questions.length}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          5 quick questions. Takes 90 seconds. I'll give you honest feedback on whether we should talk.
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