// Global visitor tracking for Mintlify
(function() {
  // Storage manager
  const STORAGE_KEY = 'withseismic_visitor';
  const SESSION_KEY = 'withseismic_session';

  function generateId(prefix) {
    return prefix + '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  function getVisitorProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load visitor profile:', e);
    }

    const profile = {
      visitorId: generateId('visitor'),
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      company: {},
      contact: {},
      behavior: {
        pagesViewed: [],
        toolsUsed: [],
        calculationsPerformed: [],
        totalTimeSpent: 0,
        engagementScore: 0,
        interests: []
      },
      leadScore: {
        score: 0,
        intent: 'low',
        signals: []
      },
      metadata: {
        source: detectSource(),
        referrer: document.referrer || null,
        userAgent: navigator.userAgent
      }
    };

    saveVisitorProfile(profile);
    return profile;
  }

  function detectSource() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source')) return params.get('utm_source');
    if (params.get('ref')) return params.get('ref');
    if (document.referrer) {
      try {
        return new URL(document.referrer).hostname;
      } catch (e) {}
    }
    return 'direct';
  }

  function saveVisitorProfile(profile) {
    try {
      profile.lastVisit = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save visitor profile:', e);
    }
  }

  function trackPageView() {
    const profile = getVisitorProfile();
    const page = {
      path: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString()
    };

    const existingPage = profile.behavior.pagesViewed.find(p => p.path === page.path);
    if (!existingPage) {
      profile.behavior.pagesViewed.push({
        ...page,
        visitCount: 1
      });
    } else {
      existingPage.visitCount++;
      existingPage.lastVisit = page.timestamp;
    }

    // Update engagement score
    profile.leadScore.score += 5;
    calculateIntent(profile);

    saveVisitorProfile(profile);
  }

  function calculateIntent(profile) {
    const score = profile.leadScore.score;

    if (score >= 100) {
      profile.leadScore.intent = 'high';
    } else if (score >= 50) {
      profile.leadScore.intent = 'medium';
    } else {
      profile.leadScore.intent = 'low';
    }

    // Check for high-intent signals
    const signals = [];
    if (profile.behavior.pagesViewed.length >= 5) signals.push('high_page_count');
    if (profile.behavior.toolsUsed.length >= 2) signals.push('multiple_tools');
    if (profile.contact.email) signals.push('email_captured');
    if (profile.company.name) signals.push('company_identified');

    profile.leadScore.signals = signals;

    if (signals.length >= 3) {
      profile.leadScore.intent = 'high';
      notifyHighIntentLead(profile);
    }
  }

  function trackAction(action) {
    const profile = getVisitorProfile();

    // Score different actions
    const scores = {
      'tool_used': 10,
      'calculation_performed': 15,
      'form_started': 5,
      'form_completed': 25,
      'email_provided': 30,
      'company_info_provided': 20,
      'scroll_depth_50': 3,
      'scroll_depth_75': 5,
      'scroll_depth_100': 7
    };

    profile.leadScore.score += scores[action.type] || 5;

    // Track specific behaviors
    if (action.type === 'tool_used' && action.toolName) {
      if (!profile.behavior.toolsUsed.includes(action.toolName)) {
        profile.behavior.toolsUsed.push(action.toolName);
      }
    }

    if (action.type === 'calculation_performed') {
      profile.behavior.calculationsPerformed.push(action.data);
    }

    if (action.type === 'interest_captured' && action.topic) {
      if (!profile.behavior.interests.includes(action.topic)) {
        profile.behavior.interests.push(action.topic);
      }
    }

    calculateIntent(profile);
    saveVisitorProfile(profile);
    return profile;
  }

  function updateProfile(updates) {
    const profile = getVisitorProfile();

    // Deep merge updates
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        profile[key] = { ...profile[key], ...updates[key] };
      } else {
        profile[key] = updates[key];
      }
    });

    calculateIntent(profile);
    saveVisitorProfile(profile);
    return profile;
  }

  function notifyHighIntentLead(profile) {
    console.log('🔥 High Intent Lead:', {
      visitorId: profile.visitorId,
      score: profile.leadScore.score,
      signals: profile.leadScore.signals,
      company: profile.company,
      contact: profile.contact
    });

    // Could send to webhook, analytics, etc.
    if (window.gtag) {
      window.gtag('event', 'high_intent_lead', {
        lead_score: profile.leadScore.score,
        signals: profile.leadScore.signals.join(',')
      });
    }
  }

  // Track scroll depth
  let scrollTracked = { 25: false, 50: false, 75: false, 100: false };

  function trackScroll() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    [25, 50, 75, 100].forEach(depth => {
      if (scrollPercent >= depth && !scrollTracked[depth]) {
        scrollTracked[depth] = true;
        trackAction({ type: `scroll_depth_${depth}`, depth });
      }
    });
  }

  // Track time on page
  let startTime = Date.now();

  function trackTimeOnPage() {
    const profile = getVisitorProfile();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    profile.behavior.totalTimeSpent += timeSpent;
    saveVisitorProfile(profile);
  }

  // Expose global API
  window.WithSeismicTracker = {
    trackAction,
    updateProfile,
    getProfile: getVisitorProfile,
    trackTool: (toolName, data) => trackAction({
      type: 'tool_used',
      toolName,
      data
    }),
    trackCalculation: (data) => trackAction({
      type: 'calculation_performed',
      data
    }),
    captureEmail: (email, name) => {
      updateProfile({
        contact: { email, name }
      });
      trackAction({ type: 'email_provided' });
    },
    captureCompany: (companyData) => {
      updateProfile({
        company: companyData
      });
      trackAction({ type: 'company_info_provided' });
    },
    captureInterest: (topic) => trackAction({
      type: 'interest_captured',
      topic
    })
  };

  // Initialize tracking
  document.addEventListener('DOMContentLoaded', function() {
    trackPageView();

    // Scroll tracking
    window.addEventListener('scroll', trackScroll, { passive: true });

    // Time tracking on page unload
    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track visibility changes
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        trackTimeOnPage();
        startTime = Date.now(); // Reset for when they come back
      }
    });
  });

  // Also track if DOM already loaded
  if (document.readyState !== 'loading') {
    trackPageView();
  }
})();