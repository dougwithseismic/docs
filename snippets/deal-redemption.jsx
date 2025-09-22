export const DealRedemption = ({
  title = "Special Offer",
  description = "Get exclusive access to this limited-time deal",
  code = "SAVE20",
  link = "#",
  validUntil,
  type = "offer",
  offerText = "Get Offer →"
}) => {
  const [copied, setCopied] = React.useState(false);
  const isCodeType = type === "code";

  const handleCopy = async () => {
    if (!isCodeType) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRedeem = () => {
    if (isCodeType) {
      handleCopy();
    }
    window.open(link, '_blank');
  };

  const handleGetOffer = () => {
    window.open(link, '_blank');
  };

  return (
    <div className="card block font-normal group relative my-2 ring-2 ring-transparent rounded-2xl bg-white dark:bg-background-dark border border-gray-950/10 dark:border-white/10 overflow-hidden w-full">
      <div className="px-6 py-5 relative flex items-center justify-between">
        <div className="flex-1 pr-5">
          <h3 className="not-prose font-semibold text-base text-gray-800 dark:text-white m-0 mb-2">
            {title}
          </h3>
          <p className="prose font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>
          {validUntil && (
            <p className="text-xs text-gray-500 dark:text-gray-500 italic">
              Valid until: {validUntil}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end justify-between min-w-[180px]">
          {isCodeType ? (
            <>
              <div
                className="relative bg-orange-500 text-white px-6 py-4 rounded-lg text-center transition-all shadow-sm hover:shadow-md w-full mb-3 cursor-pointer group"
                onClick={handleCopy}
                title="Click to copy code"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-base font-semibold tracking-wider">
                    {code}
                  </div>
                  <div className="text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? 'Copied!' : 'Click to copy'}
                  </div>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-white dark:bg-gray-700 text-orange-500 dark:text-orange-400 border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:bg-orange-50 dark:hover:bg-gray-600 hover:-translate-y-0.5"
                onClick={handleRedeem}
              >
                {offerText}
              </button>
            </>
          ) : (
            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              onClick={handleGetOffer}
            >
              {offerText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};