export const InteractiveAssessmentWizard = () => {
  const [data, setData] = React.useState({
    // Business metrics
    deliveryHours: 20,
    hourlyRate: 150,
    clientsPerMonth: 4,
    employeeCost: 75,

    // Assessment scores
    urgency: 3,        // How critical for clients
    repeatability: 3,  // How often requested
    complexity: 3,     // Technical difficulty
    competition: 3,    // Market competition
  });

  const [editingField, setEditingField] = React.useState(null);
  const [tempValue, setTempValue] = React.useState('');

  const updateValue = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const startEditing = (key, value) => {
    setEditingField(key);
    setTempValue(value.toString());
  };

  const handleKeyDown = (e, key, min, max) => {
    if (e.key === 'Enter') {
      const val = Number(tempValue);
      if (!isNaN(val) && val >= min && val <= max) {
        updateValue(key, val);
      }
      setEditingField(null);
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const handleBlur = (key, min, max) => {
    const val = Number(tempValue);
    if (!isNaN(val) && val >= min && val <= max) {
      updateValue(key, val);
    }
    setEditingField(null);
  };

  // Calculate financials
  const monthlyRevenue = data.clientsPerMonth * data.deliveryHours * data.hourlyRate;
  const monthlyCost = data.clientsPerMonth * data.deliveryHours * data.employeeCost;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const profitMargin = monthlyRevenue > 0 ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(0) : 0;

  // Calculate productization score
  const score = (
    (data.urgency * 0.3) +
    (data.repeatability * 0.3) +
    ((6 - data.complexity) * 0.2) + // Inverse - lower complexity is better
    ((6 - data.competition) * 0.2)  // Inverse - less competition is better
  ).toFixed(1);

  const getRecommendation = () => {
    if (score >= 4) return { text: 'PRODUCTIZE NOW', color: 'var(--success)' };
    if (score >= 3) return { text: 'STRONG POTENTIAL', color: 'var(--primary)' };
    if (score >= 2) return { text: 'NEEDS WORK', color: 'var(--warning)' };
    return { text: 'NOT READY', color: 'var(--danger)' };
  };

  const recommendation = getRecommendation();

  const RangeInput = ({ label, field, min = 1, max = 5, prefix = '', suffix = '' }) => {
    const value = data[field];
    const isEditing = editingField === field;

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-muted">
            {label}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, field, min, max)}
              onBlur={() => handleBlur(field, min, max)}
              autoFocus
              className="text-xs font-semibold text-right w-16 px-1 border border-primary rounded outline-none"
            />
          ) : (
            <span
              onClick={() => startEditing(field, value)}
              className="text-xs font-semibold cursor-pointer px-1 rounded hover:bg-primary/10 transition-colors"
            >
              {prefix}{value}{suffix}
            </span>
          )}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) > 20 ? 5 : 1}
          value={value}
          onChange={(e) => updateValue(field, Number(e.target.value))}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%, var(--border) 100%)`
          }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-lg border border-border">
      {/* Header with Score */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground m-0">
            Productization Calculator
          </h3>
          <p className="text-sm text-muted mt-1">
            Should you turn this service into a product?
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: recommendation.color }}>
            {score}
          </div>
          <div className="text-xs font-semibold mt-1" style={{ color: recommendation.color }}>
            {recommendation.text}
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Left Column - Business Metrics */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
            Business Metrics
          </h4>

          <RangeInput
            label="Hours per delivery"
            field="deliveryHours"
            min={1}
            max={100}
            suffix=" hrs"
          />

          <RangeInput
            label="Hourly rate charged"
            field="hourlyRate"
            min={50}
            max={500}
            prefix="$"
          />

          <RangeInput
            label="Clients per month"
            field="clientsPerMonth"
            min={1}
            max={20}
          />

          <RangeInput
            label="Employee hourly cost"
            field="employeeCost"
            min={25}
            max={200}
            prefix="$"
          />
        </div>

        {/* Right Column - Assessment */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
            Service Assessment
          </h4>

          <RangeInput
            label="How critical for clients?"
            field="urgency"
            suffix="/5"
          />

          <RangeInput
            label="How often requested?"
            field="repeatability"
            suffix="/5"
          />

          <RangeInput
            label="Technical complexity"
            field="complexity"
            suffix="/5"
          />

          <RangeInput
            label="Market competition"
            field="competition"
            suffix="/5"
          />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-card rounded-md mb-4">
        <div>
          <div className="text-xs text-muted mb-1">Monthly Revenue</div>
          <div className="text-base font-semibold">${monthlyRevenue.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted mb-1">Monthly Cost</div>
          <div className="text-base font-semibold">${monthlyCost.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted mb-1">Monthly Profit</div>
          <div className="text-base font-semibold" style={{ color: monthlyProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            ${monthlyProfit.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted mb-1">Profit Margin</div>
          <div className="text-base font-semibold text-primary">{profitMargin}%</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-3 bg-card rounded-md text-xs text-muted">
        <strong className="text-foreground">Key Insights:</strong>
        <ul className="mt-2 ml-5 space-y-1">
          {score >= 3 ? (
            <>
              <li>Service generates ${(monthlyProfit * 12).toLocaleString()}/year profit</li>
              <li>{data.clientsPerMonth * 12} potential customers annually</li>
              <li>Focus on automation to reduce {data.deliveryHours}hr delivery time</li>
            </>
          ) : (
            <>
              <li>Current profit margin: {profitMargin}%</li>
              <li>Consider increasing prices or reducing delivery time</li>
              <li>Market demand may not justify productization yet</li>
            </>
          )}
        </ul>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: 0;
        }
      `}</style>
    </div>
  );
};