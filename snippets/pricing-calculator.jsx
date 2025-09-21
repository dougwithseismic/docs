import React from 'react';

export const CostComparison = () => {
  const [weeks, setWeeks] = React.useState(4);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const withSeismicCost = weeks * 3000;
  const freelancerCost = weeks * 40 * 100; // $100/hr * 40hrs/week
  const agencyCost = weeks * 40 * 200; // $200/hr * 40hrs/week
  const fullTimeCost = Math.round((150000 / 52) * weeks); // $150k/year senior dev

  const handleSliderChange = (value) => {
    setWeeks(value);

    // Track the first interaction with the pricing calculator
    if (!hasInteracted && window.WithSeismicTracker) {
      setHasInteracted(true);
      window.WithSeismicTracker.trackTool('pricing_calculator', {
        weeks: value,
        withSeismicCost: value * 3000
      });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 my-6 border border-neutral-500/20 shadow-sm">
      <div className="mb-6">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-3">
          Project Duration Calculator
        </label>
        <div className="bg-neutral-500/5 p-4 rounded border border-neutral-500/10">
          <input
            type="range"
            min="1"
            max="12"
            value={weeks}
            onChange={(e) => handleSliderChange(e.target.value)}
            className="w-full"
          />
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {weeks} {weeks === 1 ? 'week' : 'weeks'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${withSeismicCost.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
            WithSeismic
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Fixed price, guaranteed
          </div>
        </div>

        <div className="bg-neutral-500/5 p-4 rounded border border-neutral-500/10">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            ${freelancerCost.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
            Freelancer
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            ~$100/hr, variable
          </div>
        </div>

        <div className="bg-neutral-500/5 p-4 rounded border border-neutral-500/10">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            ${agencyCost.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
            Agency
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            ~$200/hr + overhead
          </div>
        </div>

        <div className="bg-neutral-500/5 p-4 rounded border border-neutral-500/10">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            ${fullTimeCost.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
            Full-Time Dev
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            $150k/yr + benefits
          </div>
        </div>
      </div>
    </div>
  );
};