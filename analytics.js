// WithSeismic Analytics & Lead Tracking System V2
// Page-centric tracking with session-based behavior

(function () {
  "use strict";

  console.log("WithSeismic Analytics V2 - Page-Centric Tracking");

  // Configuration
  const CONFIG = {
    storageKey: "withseismic_visitor_v2",
    sessionKey: "withseismic_session_v2",
    debugMode: false,
    trackingEvents: {
      pageView: 5,
      scroll25: 2,
      scroll50: 3,
      scroll75: 5,
      scroll100: 7,
      timeOnPage30s: 3,
      timeOnPage60s: 5,
      timeOnPage120s: 10,
      linkClick: 2,
      codeBlockCopy: 10,
      toolUsed: 15,
      calculationPerformed: 20,
      emailProvided: 30,
      companyInfoProvided: 25,
      bookingInitiated: 50,
    },
  };

  // Utility functions
  const log = (...args) => {
    if (CONFIG.debugMode) console.log("[WithSeismic V2]", ...args);
  };

  const generateId = (prefix) => {
    return `${prefix}_${Math.random()
      .toString(36)
      .substring(2, 11)}${Date.now().toString(36)}`;
  };

  const detectSource = () => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const ref = params.get("ref");

    if (utmSource) return { type: "utm", value: utmSource };
    if (ref) return { type: "referral", value: ref };
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        if (!referrerUrl.hostname.includes(window.location.hostname)) {
          return { type: "external", value: referrerUrl.hostname };
        }
      } catch (e) {}
    }
    return { type: "direct", value: null };
  };

  // Storage Manager with new page-centric structure
  class StorageManager {
    static getVisitorProfile() {
      try {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
          const profile = JSON.parse(stored);
          this.migrateProfile(profile);
          return profile;
        }
      } catch (e) {
        log("Error loading visitor profile:", e);
      }

      // Create new profile with page-centric structure
      const profile = {
        visitorId: generateId("visitor"),
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        source: detectSource(),

        // Company & Contact info
        company: {},
        contact: {},

        // Page-centric behavior tracking
        behavior: {
          // Individual page data
          pages: {},

          // Global aggregates
          totalPageViews: 0,
          uniquePagesViewed: 0,
          totalTimeSpent: 0,
          averageTimePerPage: 0,

          // Global behaviors
          toolsUsed: [],
          calculationsPerformed: [],
          interests: [],
          contentCategories: [],
          globalLinksClicked: [], // Links clicked across all pages
        },

        // Current session
        currentSession: {
          sessionId: generateId("session"),
          startTime: Date.now(),
          currentPage: null,
          pageStartTime: null,
        },

        // Engagement scoring
        engagement: {
          score: 0,
          level: "cold",
          signals: [],
          lastEngagement: null,
        },

        // Metadata
        metadata: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          deviceType: this.detectDeviceType(),
        },
      };

      this.saveVisitorProfile(profile);
      return profile;
    }

    static detectDeviceType() {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    }

    static saveVisitorProfile(profile) {
      try {
        profile.lastVisit = new Date().toISOString();
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(profile));
        return true;
      } catch (e) {
        log("Error saving visitor profile:", e);
        return false;
      }
    }

    static updateVisitorProfile(updates) {
      const profile = this.getVisitorProfile();
      Object.keys(updates).forEach((key) => {
        if (typeof updates[key] === "object" && !Array.isArray(updates[key])) {
          profile[key] = { ...profile[key], ...updates[key] };
        } else {
          profile[key] = updates[key];
        }
      });
      this.saveVisitorProfile(profile);
      return profile;
    }

    static migrateProfile(profile) {
      // Ensure new structure exists
      if (!profile.behavior) profile.behavior = {};
      if (!profile.behavior.pages) profile.behavior.pages = {};
      if (!profile.currentSession) {
        profile.currentSession = {
          sessionId: generateId("session"),
          startTime: Date.now(),
          currentPage: null,
          pageStartTime: null,
        };
      }

      // Migrate old pagesViewed array to new pages object if needed
      if (Array.isArray(profile.behavior.pagesViewed)) {
        profile.behavior.pagesViewed.forEach(page => {
          if (!profile.behavior.pages[page.path]) {
            profile.behavior.pages[page.path] = {
              path: page.path,
              title: page.title,
              category: page.category || "general",
              firstVisit: page.firstVisit || page.timestamp,
              lastVisit: page.lastVisit || page.timestamp,
              visitCount: page.viewCount || 1,
              totalTimeSpent: page.totalTime || 0,
              averageTimeSpent: 0,
              maxScrollDepth: 0,
              sessions: []
            };
          }
        });
        delete profile.behavior.pagesViewed;
      }

      // Ensure all required fields exist
      if (typeof profile.behavior.totalPageViews === 'undefined') {
        profile.behavior.totalPageViews = 0;
      }
      if (typeof profile.behavior.uniquePagesViewed === 'undefined') {
        profile.behavior.uniquePagesViewed = Object.keys(profile.behavior.pages).length;
      }
      if (!Array.isArray(profile.behavior.toolsUsed)) {
        profile.behavior.toolsUsed = [];
      }
      if (!Array.isArray(profile.behavior.globalLinksClicked)) {
        profile.behavior.globalLinksClicked = [];
      }
      if (!profile.engagement) {
        profile.engagement = {
          score: 0,
          level: "cold",
          signals: [],
          lastEngagement: null
        };
      }
    }
  }

  // Page Tracker with new structure
  class PageTracker {
    constructor() {
      this.startTime = Date.now();
      this.pagePath = window.location.pathname;
      this.pageTitle = document.title;
      this.category = this.detectCategory();
      this.scrollDepth = 0;
      this.timeouts = [];
      this.sessionData = {
        sessionId: null,
        timestamp: new Date().toISOString(),
        timeSpent: 0,
        scrollDepth: 0,
        linksClicked: [],
        actions: []
      };
    }

    detectCategory() {
      const path = window.location.pathname;
      if (path.includes("/services")) return "services";
      if (path.includes("/case-studies")) return "case-studies";
      if (path.includes("/tool-ideas")) return "tool-ideas";
      if (path.includes("/resources")) return "resources";
      if (path.includes("/contact")) return "contact";
      if (path.includes("/approach")) return "approach";
      if (path.includes("/build")) return "build";
      return "general";
    }

    initializePage() {
      const profile = StorageManager.getVisitorProfile();

      // Initialize or update page data
      if (!profile.behavior.pages[this.pagePath]) {
        profile.behavior.pages[this.pagePath] = {
          path: this.pagePath,
          title: this.pageTitle,
          category: this.category,
          firstVisit: new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          visitCount: 1,
          totalTimeSpent: 0,
          averageTimeSpent: 0,
          maxScrollDepth: 0,
          sessions: []
        };
        profile.behavior.uniquePagesViewed++;
      } else {
        profile.behavior.pages[this.pagePath].visitCount++;
        profile.behavior.pages[this.pagePath].lastVisit = new Date().toISOString();
        profile.behavior.pages[this.pagePath].title = this.pageTitle; // Update in case it changed
      }

      // Update session info
      profile.currentSession.currentPage = this.pagePath;
      profile.currentSession.pageStartTime = Date.now();
      this.sessionData.sessionId = profile.currentSession.sessionId;

      // Update global counters
      profile.behavior.totalPageViews++;

      // Track content category
      if (!profile.behavior.contentCategories.includes(this.category)) {
        profile.behavior.contentCategories.push(this.category);
      }

      // Update engagement
      this.updateEngagement(profile, "pageView");

      StorageManager.saveVisitorProfile(profile);
      log("Page initialized:", this.pagePath);
    }

    trackTimeOnPage() {
      const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
      const profile = StorageManager.getVisitorProfile();
      const pageData = profile.behavior.pages[this.pagePath];

      if (pageData) {
        // Update page-specific time
        pageData.totalTimeSpent += timeSpent;
        pageData.averageTimeSpent = Math.floor(
          pageData.totalTimeSpent / pageData.visitCount
        );

        // Update session data
        this.sessionData.timeSpent = timeSpent;

        // Update global time
        profile.behavior.totalTimeSpent += timeSpent;
        profile.behavior.averageTimePerPage = Math.floor(
          profile.behavior.totalTimeSpent / profile.behavior.totalPageViews
        );

        StorageManager.saveVisitorProfile(profile);
        log(`Time on ${this.pagePath}: ${timeSpent}s`);
      }
    }

    saveSessionData() {
      const profile = StorageManager.getVisitorProfile();
      const pageData = profile.behavior.pages[this.pagePath];

      if (pageData) {
        // Save this session's data
        this.sessionData.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        this.sessionData.scrollDepth = this.scrollDepth;

        // Add session to page's session history
        pageData.sessions.push({ ...this.sessionData });

        // Keep only last 10 sessions per page to avoid excessive storage
        if (pageData.sessions.length > 10) {
          pageData.sessions = pageData.sessions.slice(-10);
        }

        // Update max scroll depth
        if (this.scrollDepth > pageData.maxScrollDepth) {
          pageData.maxScrollDepth = this.scrollDepth;
        }

        StorageManager.saveVisitorProfile(profile);
        log(`Session saved for ${this.pagePath}:`, this.sessionData);
      }
    }

    setupScrollTracking() {
      let ticking = false;

      const updateScrollProgress = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = Math.round(
          (scrollTop / (documentHeight - windowHeight)) * 100
        );

        if (scrollPercent > this.scrollDepth) {
          this.scrollDepth = scrollPercent;

          // Track milestones
          [25, 50, 75, 100].forEach((milestone) => {
            if (scrollPercent >= milestone && this.scrollDepth < milestone + 25) {
              this.updateEngagement(null, `scroll${milestone}`);
              this.sessionData.actions.push({
                type: `scroll_${milestone}`,
                timestamp: new Date().toISOString()
              });
              log(`Scroll depth ${milestone}% reached on ${this.pagePath}`);
            }
          });
        }

        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollProgress);
          ticking = true;
        }
      };

      window.addEventListener("scroll", requestTick, { passive: true });
    }

    setupTimeTracking() {
      [30, 60, 120].forEach((seconds) => {
        const timeout = setTimeout(() => {
          this.updateEngagement(null, `timeOnPage${seconds}s`);
          this.sessionData.actions.push({
            type: `time_${seconds}s`,
            timestamp: new Date().toISOString()
          });
          log(`Time milestone ${seconds}s reached on ${this.pagePath}`);
        }, seconds * 1000);
        this.timeouts.push(timeout);
      });
    }

    trackLinkClick(href, text) {
      this.sessionData.linksClicked.push({
        href,
        text: text.substring(0, 50),
        timestamp: new Date().toISOString()
      });

      // Also add to global links
      const profile = StorageManager.getVisitorProfile();
      profile.behavior.globalLinksClicked.push({
        href,
        text: text.substring(0, 50),
        fromPage: this.pagePath,
        timestamp: new Date().toISOString()
      });
      StorageManager.saveVisitorProfile(profile);
    }

    trackAction(actionType, data) {
      this.sessionData.actions.push({
        type: actionType,
        data,
        timestamp: new Date().toISOString()
      });
    }

    updateEngagement(profile = null, eventType) {
      if (!profile) profile = StorageManager.getVisitorProfile();

      if (!profile.engagement) {
        profile.engagement = {
          score: 0,
          level: "cold",
          signals: [],
          lastEngagement: null
        };
      }

      const score = CONFIG.trackingEvents[eventType] || 0;
      profile.engagement.score += score;
      profile.engagement.lastEngagement = new Date().toISOString();

      // Determine engagement level
      if (profile.engagement.score >= 100) {
        profile.engagement.level = "qualified";
        if (!profile.engagement.signals.includes("qualified_lead")) {
          profile.engagement.signals.push("qualified_lead");
          this.notifyHighValueLead(profile);
        }
      } else if (profile.engagement.score >= 50) {
        profile.engagement.level = "hot";
      } else if (profile.engagement.score >= 25) {
        profile.engagement.level = "warm";
      }

      this.detectEngagementSignals(profile);
      StorageManager.saveVisitorProfile(profile);
    }

    detectEngagementSignals(profile) {
      const signals = [];

      // Page engagement
      if (profile.behavior.uniquePagesViewed >= 3) signals.push("multi_page_visitor");
      if (profile.behavior.uniquePagesViewed >= 5) signals.push("deep_explorer");

      // Time engagement
      if (profile.behavior.averageTimePerPage >= 60) signals.push("engaged_reader");
      if (profile.behavior.totalTimeSpent >= 300) signals.push("high_time_investment");

      // Content engagement
      const pageKeys = Object.keys(profile.behavior.pages);
      const deepPages = pageKeys.filter(key =>
        profile.behavior.pages[key].maxScrollDepth >= 75
      );
      if (deepPages.length >= 3) signals.push("deep_content_consumer");

      // Tool usage
      if (profile.behavior.toolsUsed.length > 0) signals.push("tool_user");
      if (profile.behavior.contentCategories.includes("case-studies")) signals.push("case_study_reader");
      if (profile.behavior.contentCategories.includes("contact")) signals.push("contact_visitor");

      // Add new signals
      signals.forEach(signal => {
        if (!profile.engagement.signals.includes(signal)) {
          profile.engagement.signals.push(signal);
        }
      });
    }

    notifyHighValueLead(profile) {
      log("🔥 HIGH VALUE LEAD DETECTED:", {
        visitorId: profile.visitorId,
        score: profile.engagement.score,
        level: profile.engagement.level,
        signals: profile.engagement.signals,
        pagesViewed: profile.behavior.uniquePagesViewed,
        timeSpent: profile.behavior.totalTimeSpent,
        topPages: Object.values(profile.behavior.pages)
          .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent)
          .slice(0, 3)
          .map(p => ({ path: p.path, time: p.totalTimeSpent })),
        company: profile.company,
        contact: profile.contact
      });

      if (window.gtag) {
        window.gtag("event", "qualified_lead", {
          value: profile.engagement.score,
          engagement_level: profile.engagement.level,
          signals: profile.engagement.signals.join(",")
        });
      }
    }

    cleanup() {
      // Save current session data
      this.saveSessionData();

      // Track final time on page
      this.trackTimeOnPage();

      // Clear timeouts
      this.timeouts.forEach(timeout => clearTimeout(timeout));
    }

    init() {
      this.initializePage();
      this.setupScrollTracking();
      this.setupTimeTracking();

      // Track time when leaving page
      window.addEventListener("beforeunload", () => {
        this.cleanup();
      });

      // Track when tab becomes hidden
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.trackTimeOnPage();
        }
      });
    }
  }

  // Global API
  window.WithSeismicTracker = {
    getProfile: () => StorageManager.getVisitorProfile(),

    getPageData: (path) => {
      const profile = StorageManager.getVisitorProfile();
      return profile.behavior.pages[path || window.location.pathname];
    },

    getTopPages: (limit = 5) => {
      const profile = StorageManager.getVisitorProfile();
      return Object.values(profile.behavior.pages)
        .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent)
        .slice(0, limit);
    },

    updateProfile: (updates) => StorageManager.updateVisitorProfile(updates),

    trackEvent: (eventName, data = {}) => {
      if (currentTracker) {
        currentTracker.trackAction(eventName, data);
        currentTracker.updateEngagement(null, eventName);
      }
      log("Custom event tracked:", eventName, data);
    },

    captureCompany: (companyData) => {
      const profile = StorageManager.updateVisitorProfile({ company: companyData });
      if (currentTracker) {
        currentTracker.updateEngagement(profile, "companyInfoProvided");
        currentTracker.trackAction("company_captured", companyData);
      }
      log("Company info captured:", companyData);
    },

    captureContact: (contactData) => {
      const profile = StorageManager.updateVisitorProfile({ contact: contactData });
      if (currentTracker) {
        currentTracker.updateEngagement(profile, "emailProvided");
        currentTracker.trackAction("contact_captured", contactData);
      }
      log("Contact info captured:", contactData);
    },

    captureInterest: (topic) => {
      const profile = StorageManager.getVisitorProfile();
      if (!profile.behavior.interests.includes(topic)) {
        profile.behavior.interests.push(topic);
        StorageManager.saveVisitorProfile(profile);
        if (currentTracker) {
          currentTracker.trackAction("interest_captured", { topic });
        }
        log("Interest captured:", topic);
      }
    },

    trackTool: (toolName, data = {}) => {
      const profile = StorageManager.getVisitorProfile();
      if (!profile.behavior.toolsUsed.includes(toolName)) {
        profile.behavior.toolsUsed.push(toolName);
      }
      if (currentTracker) {
        currentTracker.updateEngagement(profile, "toolUsed");
        currentTracker.trackAction("tool_used", { toolName, ...data });
      }
      StorageManager.saveVisitorProfile(profile);
      log("Tool used:", toolName, data);
    },

    trackCalculation: (data) => {
      const profile = StorageManager.getVisitorProfile();
      profile.behavior.calculationsPerformed.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      if (currentTracker) {
        currentTracker.updateEngagement(profile, "calculationPerformed");
        currentTracker.trackAction("calculation_performed", data);
      }
      StorageManager.saveVisitorProfile(profile);
      log("Calculation performed:", data);
    },

    reset: () => {
      localStorage.removeItem(CONFIG.storageKey);
      localStorage.removeItem(CONFIG.sessionKey);
      log("Tracker data reset");
    },

    enableDebug: () => {
      CONFIG.debugMode = true;
      log("Debug mode enabled");
      log("Current profile:", StorageManager.getVisitorProfile());
    }
  };

  // Initialize tracking
  let currentTracker = null;
  let globalListenersSetup = false;

  // Setup global event listeners only once
  const setupGlobalListeners = () => {
    if (globalListenersSetup) return;
    globalListenersSetup = true;

    // Global link tracking
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && currentTracker) {
        const href = link.getAttribute("href");
        if (href) {
          currentTracker.trackLinkClick(href, link.textContent.trim());

          // Special handling for high-intent links
          if (
            href.includes("/contact") ||
            href.includes("book") ||
            href.includes("consultation")
          ) {
            currentTracker.updateEngagement(null, "bookingInitiated");
            currentTracker.trackAction("booking_intent", { href });
          } else {
            currentTracker.updateEngagement(null, "linkClick");
          }

          log("Link clicked:", href);
        }
      }
    });

    // Global code block copy tracking
    document.addEventListener("copy", () => {
      const selection = window.getSelection();
      if (selection && selection.anchorNode && currentTracker) {
        const codeBlock = selection.anchorNode.parentElement?.closest("pre, code");
        if (codeBlock) {
          currentTracker.updateEngagement(null, "codeBlockCopy");
          currentTracker.trackAction("code_copied", {
            snippet: selection.toString().substring(0, 100)
          });
          log("Code block copied");
        }
      }
    });
  };

  const init = () => {
    // Clean up previous tracker
    if (currentTracker) {
      currentTracker.cleanup();
    }

    currentTracker = new PageTracker();
    currentTracker.init();
    log("Tracker initialized for page:", window.location.pathname);
  };

  // Listen for SPA navigation
  const setupNavigationTracking = () => {
    let lastPath = window.location.pathname;

    // Check for URL changes periodically
    setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        log("Navigation detected:", lastPath, "->", currentPath);
        lastPath = currentPath;
        init();
      }
    }, 500);

    // Listen for popstate
    window.addEventListener("popstate", () => {
      log("Popstate navigation detected");
      init();
    });

    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(() => {
        log("PushState navigation detected");
        init();
      }, 0);
    };

    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      setTimeout(() => {
        log("ReplaceState navigation detected");
        init();
      }, 0);
    };
  };

  // Initialize everything
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupGlobalListeners();
      init();
      setupNavigationTracking();
    });
  } else {
    setupGlobalListeners();
    init();
    setupNavigationTracking();
  }
})();