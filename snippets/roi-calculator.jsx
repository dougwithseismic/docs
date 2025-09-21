export const ROICalculator = ({
  defaultMonthlyPrice = 99,
  defaultCustomers = 50,
  toolCost = 4997,
  defaultHostingCost = 50,
  defaultApiCost = 100
}) => {
  const [monthlyPrice, setMonthlyPrice] = useState(defaultMonthlyPrice);
  const [customers, setCustomers] = useState(defaultCustomers);
  const [hostingCost, setHostingCost] = useState(defaultHostingCost);
  const [apiCost, setApiCost] = useState(defaultApiCost);

  const monthlyRevenue = monthlyPrice * customers;
  const monthlyProfit = monthlyRevenue - hostingCost - apiCost;
  const yearlyRevenue = monthlyRevenue * 12;
  const yearlyProfit = monthlyProfit * 12;
  const paybackMonths = toolCost / monthlyProfit;
  const firstYearROI = ((yearlyProfit - toolCost) / toolCost * 100).toFixed(1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProfitColor = (profit) => {
    if (profit >= 10000) return "text-green-600 dark:text-green-400";
    if (profit >= 5000) return "text-yellow-600 dark:text-yellow-400";
    if (profit >= 0) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };


  const milestones = [
    { customers: 10, label: "MVP Validation" },
    { customers: 25, label: "Break Even" },
    { customers: 50, label: "Profitable" },
    { customers: 100, label: "Scaling" },
    { customers: 250, label: "Market Leader" },
  ];

  const currentMilestone = milestones.reduce((prev, curr) => {
    return customers >= curr.customers ? curr : prev;
  }, milestones[0]);

  const nextMilestone = milestones.find(m => m.customers > customers) || milestones[milestones.length - 1];

  return (
    <div className="bg-background rounded-lg p-6 my-6 border border-neutral-500/20 shadow-sm">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-lg my-0 font-semibold text-gray-900 dark:text-gray-100">
          ROI Calculator
        </h3>
        <div className="flex items-end gap-3">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            First Year ROI:
          </span>
          <span className={`text-3xl font-bold ${getProfitColor(firstYearROI)}`}>
            {firstYearROI}%
          </span>
        </div>
      </div>

      {/* Quick Payback Summary */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Payback Period
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {paybackMonths < 1 ? "< 1" : Math.ceil(paybackMonths)} month{Math.ceil(paybackMonths) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Pricing Section */}
        <div className="bg-neutral-500/5 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pricing Model
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Monthly Subscription Price
              </label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Number of Customers
              </label>
              <input
                type="number"
                value={customers}
                onChange={(e) => setCustomers(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Costs Section */}
        <div className="bg-neutral-500/5 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Operating Costs
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Monthly Hosting Cost
              </label>
              <input
                type="number"
                value={hostingCost}
                onChange={(e) => setHostingCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Monthly API Costs (AI/Data)
              </label>
              <input
                type="number"
                value={apiCost}
                onChange={(e) => setApiCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>{currentMilestone.label}</span>
          <span>{customers}/{nextMilestone.customers} customers</span>
          <span>{nextMilestone.label}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
            style={{
              width: `${Math.min((customers / 250) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Revenue Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-neutral-500/5 p-3 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Monthly Revenue
          </div>
          <div className={`text-lg font-semibold ${getProfitColor(monthlyRevenue)}`}>
            {formatCurrency(monthlyRevenue)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            recurring
          </div>
        </div>

        <div className="bg-neutral-500/5 p-3 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Monthly Profit
          </div>
          <div className={`text-lg font-semibold ${getProfitColor(monthlyProfit)}`}>
            {formatCurrency(monthlyProfit)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            after costs
          </div>
        </div>

        <div className="bg-neutral-500/5 p-3 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Yearly Revenue
          </div>
          <div className={`text-lg font-semibold ${getProfitColor(yearlyRevenue)}`}>
            {formatCurrency(yearlyRevenue)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            ARR
          </div>
        </div>

        <div className="bg-neutral-500/5 p-3 rounded">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Yearly Profit
          </div>
          <div className={`text-lg font-semibold ${getProfitColor(yearlyProfit)}`}>
            {formatCurrency(yearlyProfit)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            net income
          </div>
        </div>
      </div>

      {/* Package Comparison */}
      <div className="bg-neutral-500/5/50 rounded-lg p-4 mb-6 border border-neutral-500/10">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Package ROI Comparison
        </div>
        <div className="space-y-2">
          {[
            { name: "Starter", cost: 4997, color: "blue" },
            { name: "Professional", cost: 9997, color: "purple" },
            { name: "Enterprise", cost: 19997, color: "orange" },
          ].map((pkg) => {
            const pkgPayback = pkg.cost / monthlyProfit;
            const pkgROI = ((yearlyProfit - pkg.cost) / pkg.cost * 100).toFixed(1);
            return (
              <div key={pkg.name} className="bg-neutral-500/5 p-3 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {pkg.name} Package
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(pkg.cost)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Payback: </span>
                    <span className={getProfitColor(pkgPayback <= 6 ? 10000 : 1000)}>
                      {pkgPayback < 1 ? "< 1" : Math.ceil(pkgPayback)} months
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Year 1 ROI: </span>
                    <span className={getProfitColor(pkgROI)}>
                      {pkgROI}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Scenarios */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Quick Scenarios
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { price: 49, customers: 100, label: "Low Price, High Volume" },
            { price: 99, customers: 50, label: "Balanced Approach" },
            { price: 299, customers: 20, label: "Premium Pricing" },
          ].map((scenario, i) => (
            <button
              key={i}
              onClick={() => {
                setMonthlyPrice(scenario.price);
                setCustomers(scenario.customers);
              }}
              className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="font-medium">{scenario.label}</div>
              <div className="mt-1">
                ${scenario.price}/mo × {scenario.customers} = {formatCurrency(scenario.price * scenario.customers)}/mo
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profit Margin Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Profit Margin
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Margin: <span className="font-medium">{((monthlyProfit / monthlyRevenue) * 100).toFixed(1)}%</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {monthlyProfit >= 0 ? "Profitable" : "Not Profitable"}
          </span>
        </div>
      </div>
    </div>
  );
};