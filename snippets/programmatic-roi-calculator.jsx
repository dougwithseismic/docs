
export const ProgrammaticROICalculator = () => {
  // Track initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.WithSeismicTracker) {
      window.WithSeismicTracker.trackTool('programmatic-roi-calculator', {
        action: 'loaded',
        timestamp: new Date().toISOString()
      });
    }
  }, []);
  const [inputs, setInputs] = useState({
    // Catalog Size
    products: 1000,
    categories: 7,
    styles: 5,
    intents: 4,

    // Ad Spend & Performance
    monthlyBudget: 5000,
    avgCPC: 0.85,
    conversionRate: 2.5,
    avgOrderValue: 89,

    // Costs
    platformFees: 15, // percentage
    setupCost: 2500,
    monthlySoftwareCost: 299,

    // Advanced Settings
    ctRate: 3.5,
    qualityScore: 7,
    impressionShare: 45,
  });

  const [results, setResults] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeframe, setTimeframe] = useState('monthly'); // monthly, quarterly, yearly
  const [hasTrackedCalculation, setHasTrackedCalculation] = useState(false);

  useEffect(() => {
    calculateROI();
  }, [inputs, timeframe]);

  const calculateROI = () => {
    // Calculate keyword combinations
    const keywordCombinations = inputs.products * inputs.categories * inputs.styles * inputs.intents;
    const activeKeywords = Math.min(keywordCombinations, Math.floor(keywordCombinations * 0.3)); // Assume 30% are active

    // Calculate traffic metrics
    const monthlyClicks = Math.floor(inputs.monthlyBudget / inputs.avgCPC);
    const monthlyImpressions = Math.floor(monthlyClicks / (inputs.ctRate / 100));

    // Calculate conversions and revenue
    const monthlyConversions = Math.floor(monthlyClicks * (inputs.conversionRate / 100));
    const monthlyRevenue = monthlyConversions * inputs.avgOrderValue;
    const netRevenue = monthlyRevenue * (1 - inputs.platformFees / 100);

    // Calculate costs
    const totalMonthlyCost = inputs.monthlyBudget + inputs.monthlySoftwareCost;
    const firstMonthCost = totalMonthlyCost + inputs.setupCost;

    // Calculate profit
    const monthlyProfit = netRevenue - totalMonthlyCost;
    const firstMonthProfit = netRevenue - firstMonthCost;

    // Calculate ROAS
    const roas = (netRevenue / inputs.monthlyBudget).toFixed(2);
    const netROI = ((monthlyProfit / totalMonthlyCost) * 100).toFixed(1);

    // Timeframe multipliers
    const multiplier = timeframe === 'yearly' ? 12 : timeframe === 'quarterly' ? 3 : 1;

    // Quality Score Impact
    const qualityImpact = inputs.qualityScore >= 8 ? 0.85 : inputs.qualityScore >= 6 ? 1 : 1.25;
    const adjustedCPC = (inputs.avgCPC * qualityImpact).toFixed(2);

    setResults({
      keywordCombinations,
      activeKeywords,
      monthlyClicks: monthlyClicks * multiplier,
      monthlyImpressions: monthlyImpressions * multiplier,
      monthlyConversions: monthlyConversions * multiplier,
      revenue: netRevenue * multiplier,
      totalCost: totalMonthlyCost * multiplier + (timeframe === 'monthly' ? inputs.setupCost : inputs.setupCost),
      profit: timeframe === 'monthly' ? firstMonthProfit : monthlyProfit * multiplier + (firstMonthProfit - monthlyProfit),
      roas,
      netROI,
      breakEvenMonth: firstMonthProfit > 0 ? 1 : Math.ceil(inputs.setupCost / monthlyProfit),
      adjustedCPC,
      costPerConversion: (inputs.monthlyBudget / monthlyConversions).toFixed(2),
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));

    // Track significant interactions
    if (!hasTrackedCalculation && typeof window !== 'undefined' && window.WithSeismicTracker) {
      // Track when user starts interacting significantly
      const significantFields = ['monthlyBudget', 'products', 'conversionRate'];
      if (significantFields.includes(field)) {
        window.WithSeismicTracker.trackCalculation({
          calculatorName: 'programmatic-roi',
          action: 'adjusted-parameters',
          field: field,
          value: value,
          currentROAS: results.roas,
          currentProfit: results.profit
        });
        setHasTrackedCalculation(true);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(value));
  };

  const getProfitColor = (profit) => {
    if (profit > 10000) return 'text-green-600 dark:text-green-400';
    if (profit > 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getROASColor = (roas) => {
    if (roas >= 4) return 'bg-green-600';
    if (roas >= 2.5) return 'bg-yellow-500';
    if (roas >= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-background rounded-lg p-6 my-6 border border-neutral-500/20 shadow-sm">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-lg my-0 font-semibold text-gray-900 dark:text-gray-100">
            Programmatic Acquisition ROI Calculator
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Calculate potential returns from systematic keyword generation
          </p>
        </div>
        <div className="flex gap-2">
          {['monthly', 'quarterly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => {
                setTimeframe(period);
                // Track timeframe change
                if (typeof window !== 'undefined' && window.WithSeismicTracker) {
                  window.WithSeismicTracker.trackEvent('roi-calculator-timeframe', {
                    period: period,
                    currentROAS: results.roas,
                    currentProfit: results.profit
                  });
                }
              }}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                timeframe === period
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-500/10 text-gray-600 dark:text-gray-400 hover:bg-neutral-500/20'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {timeframe === 'yearly' ? 'Annual' : timeframe === 'quarterly' ? 'Quarterly' : 'Monthly'} Profit
            </div>
            <div className={`text-2xl font-bold ${getProfitColor(results.profit)}`}>
              {formatCurrency(results.profit)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">ROAS</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {results.roas}x
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Net ROI</div>
            <div className={`text-2xl font-bold ${parseFloat(results.netROI) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {results.netROI}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Break-even</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {results.breakEvenMonth} mo
            </div>
          </div>
        </div>

        {/* ROAS Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>ROAS Performance</span>
            <span>{results.roas}x / 5x target</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getROASColor(results.roas)}`}
              style={{ width: `${Math.min((results.roas / 5) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Catalog Configuration */}
        <div className="space-y-4">
          <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
            📦 Catalog Configuration
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Products in Catalog
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(inputs.products)}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={inputs.products}
                onChange={(e) => handleInputChange('products', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Categories
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.categories}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={inputs.categories}
                onChange={(e) => handleInputChange('categories', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Style Variations
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.styles}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={inputs.styles}
                onChange={(e) => handleInputChange('styles', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Intent Modifiers
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.intents}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={inputs.intents}
                onChange={(e) => handleInputChange('intents', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Keyword Generation Stats */}
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="text-xs text-green-700 dark:text-green-400 mb-1">
              🎯 Keyword Generation Potential
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Total Combinations:</span>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">
                {formatNumber(results.keywordCombinations)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Active Keywords:</span>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">
                ~{formatNumber(results.activeKeywords)}
              </span>
            </div>
          </div>
        </div>

        {/* Performance & Costs */}
        <div className="space-y-4">
          <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
            💰 Performance & Costs
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Monthly Ad Budget
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(inputs.monthlyBudget)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={inputs.monthlyBudget}
                onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Average CPC
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${inputs.avgCPC}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="5"
                step="0.05"
                value={inputs.avgCPC}
                onChange={(e) => handleInputChange('avgCPC', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={inputs.conversionRate}
                onChange={(e) => handleInputChange('conversionRate', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Average Order Value
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(inputs.avgOrderValue)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={inputs.avgOrderValue}
                onChange={(e) => handleInputChange('avgOrderValue', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Platform Fees
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.platformFees}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={inputs.platformFees}
                onChange={(e) => handleInputChange('platformFees', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mt-6">
        <button
          onClick={() => {
            setShowAdvanced(!showAdvanced);
            // Track advanced settings toggle
            if (typeof window !== 'undefined' && window.WithSeismicTracker) {
              window.WithSeismicTracker.trackEvent('roi-calculator-advanced', {
                action: showAdvanced ? 'closed' : 'opened',
                currentSettings: {
                  ctr: inputs.ctRate,
                  qualityScore: inputs.qualityScore,
                  setupCost: inputs.setupCost
                }
              });
            }
          }}
          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-2"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Settings
        </button>

        {showAdvanced && (
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  CTR (Click-Through Rate)
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.ctRate}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="60"
                step="0.5"
                value={inputs.ctRate}
                onChange={(e) => handleInputChange('ctRate', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Quality Score
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {inputs.qualityScore}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={inputs.qualityScore}
                onChange={(e) => handleInputChange('qualityScore', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Adjusted CPC: ${results.adjustedCPC}
              </div>
            </div>

            <div className="bg-neutral-500/5 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Setup Cost
                </label>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(inputs.setupCost)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="250"
                value={inputs.setupCost}
                onChange={(e) => handleInputChange('setupCost', e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
          📊 Projected Performance Metrics
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-neutral-500/5 p-3 rounded border border-neutral-500/10">
            <div className="text-xs text-gray-600 dark:text-gray-400">Impressions</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatNumber(results.monthlyImpressions)}
            </div>
          </div>
          <div className="bg-neutral-500/5 p-3 rounded border border-neutral-500/10">
            <div className="text-xs text-gray-600 dark:text-gray-400">Clicks</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatNumber(results.monthlyClicks)}
            </div>
          </div>
          <div className="bg-neutral-500/5 p-3 rounded border border-neutral-500/10">
            <div className="text-xs text-gray-600 dark:text-gray-400">Conversions</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatNumber(results.monthlyConversions)}
            </div>
          </div>
          <div className="bg-neutral-500/5 p-3 rounded border border-neutral-500/10">
            <div className="text-xs text-gray-600 dark:text-gray-400">Cost/Conversion</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${results.costPerConversion}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="mt-6 bg-neutral-500/5 rounded-lg p-4 border border-neutral-500/10">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💵 Financial Breakdown ({timeframe})
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Gross Revenue</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(results.revenue / (1 - inputs.platformFees / 100))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Platform Fees (-{inputs.platformFees}%)</span>
            <span className="text-red-600 dark:text-red-400">
              -{formatCurrency(results.revenue * (inputs.platformFees / 100) / (1 - inputs.platformFees / 100))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Net Revenue</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(results.revenue)}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Costs</span>
              <span className="text-red-600 dark:text-red-400">
                -{formatCurrency(results.totalCost)}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Net Profit
              </span>
              <span className={`font-bold text-lg ${getProfitColor(results.profit)}`}>
                {formatCurrency(results.profit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
          💡 Optimization Tips
        </div>
        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          {results.roas < 2 && (
            <li>• Your ROAS is below 2x. Consider improving conversion rate or increasing AOV.</li>
          )}
          {results.roas >= 10 && typeof window !== 'undefined' && window.WithSeismicTracker && (() => {
            // Track high ROAS achievement
            window.WithSeismicTracker.trackEvent('roi-calculator-milestone', {
              milestone: 'high-roas',
              roas: results.roas,
              settings: {
                products: inputs.products,
                budget: inputs.monthlyBudget,
                conversionRate: inputs.conversionRate
              }
            });
            return null;
          })()}
          {inputs.qualityScore < 7 && (
            <li>• Improve your Quality Score to reduce CPC by up to 25%.</li>
          )}
          {results.activeKeywords > 10000 && (
            <li>• With {formatNumber(results.activeKeywords)} active keywords, use automated bidding strategies.</li>
          )}
          {inputs.conversionRate < 2 && (
            <li>• Your conversion rate is low. Focus on landing page optimization.</li>
          )}
          <li>• Start with your top-performing categories before scaling to all {formatNumber(results.keywordCombinations)} combinations.</li>
        </ul>
      </div>
    </div>
  );
};