// WithSeismic Analytics & Lead Tracking System V2
// Page-centric tracking with session-based behavior

(function () {
  "use strict";

  console.log("WithSeismic Analytics V2 - Page-Centric Tracking");

  // Configuration
  const CONFIG = {
    storageKey: "withseismic_visitor",
    sessionKey: "withseismic_session",
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

  // Achievements System
  const ACHIEVEMENTS = [
    {
      id: "first_steps",
      name: "First Steps",
      icon: "👣",
      description: "Visit your first page",
      qualifier: (profile) => profile.behavior?.totalPageViews >= 1
    },
    {
      id: "explorer",
      name: "Explorer",
      icon: "🗺️",
      description: "Visit 5 different pages",
      qualifier: (profile) => profile.behavior?.uniquePagesViewed >= 5
    },
    {
      id: "deep_diver",
      name: "Deep Diver",
      icon: "🤿",
      description: "Scroll to 100% on 3 pages",
      qualifier: (profile) => {
        const pages = Object.values(profile.behavior?.pages || {});
        return pages.filter(p => p.maxScrollDepth >= 100).length >= 3;
      }
    },
    {
      id: "speed_reader",
      name: "Speed Reader",
      icon: "⚡",
      description: "Visit 10 pages in under 5 minutes",
      qualifier: (profile) => {
        return profile.behavior?.totalPageViews >= 10 &&
               profile.behavior?.totalTimeSpent < 300;
      }
    },
    {
      id: "dedicated_reader",
      name: "Dedicated Reader",
      icon: "📚",
      description: "Spend over 10 minutes reading",
      qualifier: (profile) => profile.behavior?.totalTimeSpent >= 600
    },
    {
      id: "case_study_enthusiast",
      name: "Case Study Enthusiast",
      icon: "📊",
      description: "Read 3 case studies",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        return pages.filter(p => p.includes('/case-studies/')).length >= 3;
      }
    },
    {
      id: "tool_tester",
      name: "Tool Tester",
      icon: "🔧",
      description: "Try at least one tool",
      qualifier: (profile) => profile.behavior?.toolsUsed?.length >= 1
    },
    {
      id: "night_owl",
      name: "Night Owl",
      icon: "🦉",
      description: "Browse after midnight",
      qualifier: (profile) => {
        const hour = new Date().getHours();
        return hour >= 0 && hour < 6;
      }
    },
    {
      id: "early_bird",
      name: "Early Bird",
      icon: "🐦",
      description: "Browse before 7 AM",
      qualifier: (profile) => {
        const hour = new Date().getHours();
        return hour >= 5 && hour < 7;
      }
    },
    {
      id: "return_visitor",
      name: "Return Visitor",
      icon: "🔄",
      description: "Come back for a second visit",
      qualifier: (profile) => {
        if (!profile.firstVisit) return false;
        const firstVisit = new Date(profile.firstVisit);
        const now = new Date();
        const hoursSinceFirst = (now - firstVisit) / (1000 * 60 * 60);
        return hoursSinceFirst > 1 && profile.behavior?.totalPageViews > 5;
      }
    },
    {
      id: "serious_buyer",
      name: "Serious Buyer",
      icon: "💼",
      description: "Visit pricing and contact pages",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        return pages.includes('/pricing') &&
               pages.some(p => p.includes('/contact'));
      }
    },
    {
      id: "code_copier",
      name: "Code Copier",
      icon: "📋",
      description: "Copy a code block",
      qualifier: (profile) => {
        const sessions = Object.values(profile.behavior?.pages || {})
          .flatMap(p => p.sessions || []);
        return sessions.some(s =>
          s.actions?.some(a => a.type === 'code_copied')
        );
      }
    },
    {
      id: "tracker_detective",
      name: "Tracker Detective",
      icon: "🕵️",
      description: "Discover the lead qualifier case study",
      qualifier: (profile) => {
        return Object.keys(profile.behavior?.pages || {})
          .includes('/case-studies/lead-qualifier');
      }
    },
    {
      id: "insider_trading",
      name: "Insider Trading",
      icon: "📈",
      description: "Read 100% of how I'm tracking you",
      qualifier: (profile) => {
        const leadQualifierPage = profile.behavior?.pages?.['/case-studies/lead-qualifier'];
        return leadQualifierPage && leadQualifierPage.maxScrollDepth >= 100;
      }
    },
    {
      id: "engagement_champion",
      name: "Engagement Champion",
      icon: "🏆",
      description: "Reach 'Hot' engagement level",
      qualifier: (profile) => profile.engagement?.score >= 2500
    },
    {
      id: "qualified_legend",
      name: "Qualified Legend",
      icon: "👑",
      description: "Become a qualified lead (5000 points)",
      qualifier: (profile) => profile.engagement?.score >= 5000
    },
    {
      id: "week_warrior",
      name: "Week Warrior",
      icon: "⚔️",
      description: "Visit 7 days in a row",
      qualifier: (profile) => {
        if (!profile.dailyVisits) return false;
        const today = new Date().toDateString();
        const dates = Object.keys(profile.dailyVisits || {})
          .sort((a, b) => new Date(b) - new Date(a));

        // Check for 7 consecutive days
        let consecutive = 1;
        for (let i = 1; i < dates.length; i++) {
          const diff = (new Date(dates[i-1]) - new Date(dates[i])) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            consecutive++;
            if (consecutive >= 7) return true;
          } else {
            consecutive = 1;
          }
        }
        return false;
      }
    },
    {
      id: "month_milestone",
      name: "Month Milestone",
      icon: "📅",
      description: "One month anniversary of first visit",
      qualifier: (profile) => {
        if (!profile.firstVisit) return false;
        const firstVisit = new Date(profile.firstVisit);
        const now = new Date();
        const daysSinceFirst = (now - firstVisit) / (1000 * 60 * 60 * 24);
        return daysSinceFirst >= 30;
      }
    },
    {
      id: "year_anniversary",
      name: "Year Anniversary",
      icon: "🎂",
      description: "One year anniversary of first visit",
      qualifier: (profile) => {
        if (!profile.firstVisit) return false;
        const firstVisit = new Date(profile.firstVisit);
        const now = new Date();
        const daysSinceFirst = (now - firstVisit) / (1000 * 60 * 60 * 24);
        return daysSinceFirst >= 365;
      }
    },
    {
      id: "number_of_beast",
      name: "Number of the Beast",
      icon: "😈",
      description: "Visit on day 666",
      qualifier: (profile) => {
        if (!profile.firstVisit) return false;
        const firstVisit = new Date(profile.firstVisit);
        const now = new Date();
        const daysSinceFirst = Math.floor((now - firstVisit) / (1000 * 60 * 60 * 24));
        return daysSinceFirst >= 666;
      }
    },
    {
      id: "fortnight_fanatic",
      name: "Fortnight Fanatic",
      icon: "🏰",
      description: "Visit 14 different days",
      qualifier: (profile) => {
        const uniqueDays = Object.keys(profile.dailyVisits || {}).length;
        return uniqueDays >= 14;
      }
    },
    {
      id: "habit_former",
      name: "Habit Former",
      icon: "🔥",
      description: "Visit 30 different days",
      qualifier: (profile) => {
        const uniqueDays = Object.keys(profile.dailyVisits || {}).length;
        return uniqueDays >= 30;
      }
    },
    {
      id: "weekend_warrior",
      name: "Weekend Warrior",
      icon: "🏖️",
      description: "Visit on 5 different weekends",
      qualifier: (profile) => {
        if (!profile.weekendVisits) return false;
        return profile.weekendVisits >= 5;
      }
    },
    {
      id: "century_club",
      name: "Century Club",
      icon: "💯",
      description: "Reach 100 total page views",
      qualifier: (profile) => profile.behavior?.totalPageViews >= 100
    },
    {
      id: "vampire_hours",
      name: "Vampire Hours",
      icon: "🧛",
      description: "Visit between midnight and 6 AM on 3 different nights",
      qualifier: (profile) => {
        if (!profile.vampireVisits) return false;
        return profile.vampireVisits >= 3;
      }
    },
    {
      id: "loyal_follower",
      name: "Loyal Follower",
      icon: "💎",
      description: "Visit at least once a week for 4 weeks",
      qualifier: (profile) => {
        if (!profile.weeklyStreak) return false;
        return profile.weeklyStreak >= 4;
      }
    },
    {
      id: "article_appetizer",
      name: "Article Appetizer",
      icon: "📖",
      description: "Read 5 articles",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        const articles = pages.filter(p => p.includes('/articles/'));
        return articles.length >= 5;
      }
    },
    {
      id: "article_enthusiast",
      name: "Article Enthusiast",
      icon: "📚",
      description: "Read 10 articles",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        const articles = pages.filter(p => p.includes('/articles/'));
        return articles.length >= 10;
      }
    },
    {
      id: "article_scholar",
      name: "Article Scholar",
      icon: "🎓",
      description: "Read 20 articles",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        const articles = pages.filter(p => p.includes('/articles/'));
        return articles.length >= 20;
      }
    },
    {
      id: "article_professor",
      name: "Article Professor",
      icon: "🏛️",
      description: "Read 50 articles",
      qualifier: (profile) => {
        const pages = Object.keys(profile.behavior?.pages || {});
        const articles = pages.filter(p => p.includes('/articles/'));
        return articles.length >= 50;
      }
    },
    {
      id: "price_savvy",
      name: "Price Savvy",
      icon: "💰",
      description: "Compare project costs using the pricing calculator",
      qualifier: (profile) => {
        return profile.behavior?.toolsUsed?.includes('pricing_calculator');
      }
    },
    {
      id: "localhost_hero",
      name: "There's No Place Like 127.0.0.1",
      icon: "🏠",
      description: "Browse from localhost - a true developer",
      qualifier: (profile) => {
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('.local');
      }
    }
  ];

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

        // Achievements
        achievements: {
          unlocked: [],
          unlockedAt: {}
        },

        // Long-term tracking
        dailyVisits: {}, // Object with date strings as keys
        weekendVisits: 0,
        vampireVisits: 0,
        weeklyStreak: 0,
        lastWeekVisit: null
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

        // Check for achievements before saving
        StorageManager.checkAchievements(profile);

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
        profile.behavior.pagesViewed.forEach((page) => {
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
              sessions: [],
            };
          }
        });
        delete profile.behavior.pagesViewed;
      }

      // Ensure all required fields exist
      if (typeof profile.behavior.totalPageViews === "undefined") {
        profile.behavior.totalPageViews = 0;
      }
      if (typeof profile.behavior.uniquePagesViewed === "undefined") {
        profile.behavior.uniquePagesViewed = Object.keys(
          profile.behavior.pages
        ).length;
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
          lastEngagement: null,
          previousLevel: "cold",
          toastShown: {},
        };
      }
      // Ensure new toast fields exist
      if (!profile.engagement.toastShown) {
        profile.engagement.toastShown = {};
      }
      // Ensure achievements exist
      if (!profile.achievements) {
        profile.achievements = {
          unlocked: [],
          unlockedAt: {}
        };
      }

      // Ensure long-term tracking fields exist
      if (!profile.dailyVisits) profile.dailyVisits = {};
      if (typeof profile.weekendVisits === "undefined") profile.weekendVisits = 0;
      if (typeof profile.vampireVisits === "undefined") profile.vampireVisits = 0;
      if (typeof profile.weeklyStreak === "undefined") profile.weeklyStreak = 0;
      if (!profile.weekendDates) profile.weekendDates = {};
      if (!profile.vampireDates) profile.vampireDates = {};
    }

    static checkAchievements(profile) {
      let newAchievements = [];

      ACHIEVEMENTS.forEach(achievement => {
        // Skip if already unlocked
        if (profile.achievements?.unlocked?.includes(achievement.id)) return;

        // Check if qualifier is met
        if (achievement.qualifier(profile)) {
          // Add to unlocked list
          if (!profile.achievements) {
            profile.achievements = { unlocked: [], unlockedAt: {} };
          }
          profile.achievements.unlocked.push(achievement.id);
          profile.achievements.unlockedAt[achievement.id] = new Date().toISOString();
          newAchievements.push(achievement);
        }
      });

      // Show toast for new achievements
      if (newAchievements.length > 0) {
        newAchievements.forEach((achievement, index) => {
          setTimeout(() => {
            const message = `Achievement Unlocked: ${achievement.name}!`;
            ToastManager.show(message, 'achievement', 6000);
            log(`Achievement unlocked: ${achievement.name} - ${achievement.description}`);
          }, index * 1500); // Stagger multiple achievements
        });
      }

      return newAchievements;
    }
  }

  // Page Tracker with new structure
  class PageTracker {
    constructor() {
      this.startTime = Date.now();
      this.lastUpdateTime = Date.now(); // Track last time update
      this.totalTrackedTime = 0; // Track cumulative time
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
        actions: [],
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

      // Track daily visits
      const now = new Date();
      const today = now.toDateString();
      if (!profile.dailyVisits) profile.dailyVisits = {};
      if (!profile.dailyVisits[today]) {
        profile.dailyVisits[today] = true;

        // Check for weekly streak
        const weekNumber = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        if (profile.lastWeekVisit && profile.lastWeekVisit === weekNumber - 1) {
          profile.weeklyStreak = (profile.weeklyStreak || 0) + 1;
        } else if (!profile.lastWeekVisit || profile.lastWeekVisit < weekNumber - 1) {
          profile.weeklyStreak = 1;
        }
        profile.lastWeekVisit = weekNumber;
      }

      // Track weekend visits
      const dayOfWeek = now.getDay();
      const weekNumber = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (!profile.weekendDates) profile.weekendDates = {};
        const weekendKey = `${now.getFullYear()}-W${weekNumber}-Weekend`;
        if (!profile.weekendDates[weekendKey]) {
          profile.weekendDates[weekendKey] = true;
          profile.weekendVisits = (profile.weekendVisits || 0) + 1;
        }
      }

      // Track vampire hours (midnight to 6 AM)
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 6) {
        const vampireKey = `vampire_${today}`;
        if (!profile.vampireDates) profile.vampireDates = {};
        if (!profile.vampireDates[vampireKey]) {
          profile.vampireDates[vampireKey] = true;
          profile.vampireVisits = (profile.vampireVisits || 0) + 1;
        }
      }

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
          sessions: [],
        };
        profile.behavior.uniquePagesViewed++;
      } else {
        profile.behavior.pages[this.pagePath].visitCount++;
        profile.behavior.pages[this.pagePath].lastVisit =
          new Date().toISOString();
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
      const now = Date.now();
      const deltaTime = Math.floor((now - this.lastUpdateTime) / 1000);

      // Only track time if it's reasonable (less than 5 minutes gap)
      // This prevents counting time when tab was inactive
      if (deltaTime > 300) {
        log(`Skipping excessive time delta: ${deltaTime}s`);
        this.lastUpdateTime = now;
        return;
      }

      // Skip if delta is 0 or negative (can happen with rapid calls)
      if (deltaTime <= 0) {
        return;
      }

      this.lastUpdateTime = now;
      this.totalTrackedTime += deltaTime;

      const profile = StorageManager.getVisitorProfile();
      const pageData = profile.behavior.pages[this.pagePath];

      if (pageData) {
        // Update page-specific time with ONLY the delta
        pageData.totalTimeSpent += deltaTime;
        pageData.averageTimeSpent = Math.floor(
          pageData.totalTimeSpent / pageData.visitCount
        );

        // Update session data with total time for this session
        this.sessionData.timeSpent = this.totalTrackedTime;

        // Update global time with ONLY the delta
        profile.behavior.totalTimeSpent += deltaTime;
        profile.behavior.averageTimePerPage = Math.floor(
          profile.behavior.totalTimeSpent / profile.behavior.totalPageViews
        );

        StorageManager.saveVisitorProfile(profile);
        log(
          `Time on ${this.pagePath}: +${deltaTime}s (session: ${this.totalTrackedTime}s, page total: ${pageData.totalTimeSpent}s)`
        );
      }
    }

    saveSessionData() {
      const profile = StorageManager.getVisitorProfile();
      const pageData = profile.behavior.pages[this.pagePath];

      if (pageData) {
        // Save this session's data with the tracked time
        this.sessionData.timeSpent = this.totalTrackedTime;
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
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = Math.round(
          (scrollTop / (documentHeight - windowHeight)) * 100
        );

        if (scrollPercent > this.scrollDepth) {
          this.scrollDepth = scrollPercent;

          // Track milestones
          [25, 50, 75, 100].forEach((milestone) => {
            if (
              scrollPercent >= milestone &&
              this.scrollDepth < milestone + 25
            ) {
              this.updateEngagement(null, `scroll${milestone}`);
              this.sessionData.actions.push({
                type: `scroll_${milestone}`,
                timestamp: new Date().toISOString(),
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
            timestamp: new Date().toISOString(),
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
        timestamp: new Date().toISOString(),
      });

      // Also add to global links
      const profile = StorageManager.getVisitorProfile();
      profile.behavior.globalLinksClicked.push({
        href,
        text: text.substring(0, 50),
        fromPage: this.pagePath,
        timestamp: new Date().toISOString(),
      });
      StorageManager.saveVisitorProfile(profile);
    }

    trackAction(actionType, data) {
      this.sessionData.actions.push({
        type: actionType,
        data,
        timestamp: new Date().toISOString(),
      });
    }

    getContentSuggestion(profile, level) {
      // Define content suggestions for each level
      const contentMap = {
        cold: [
          {
            path: "/services/why-productize",
            title: "Why Productize Your Services",
          },
          {
            path: "/tool-ideas/outbound-teams",
            title: "Tools for Outbound Teams",
          },
          {
            path: "/resources/productization-guide",
            title: "Productization Guide",
          },
          { path: "/build/internal-tools", title: "What We Build" },
        ],
        warm: [
          {
            path: "/case-studies/lead-qualifier",
            title: "How I'm Scoring Your Engagement Right Now",
            priority: true,
          },
          {
            path: "/case-studies/contra-linkedin-automation",
            title: "Contra's LinkedIn Automation",
          },
          {
            path: "/case-studies/vouchernaut-programmatic-ppc",
            title: "Vouchernaut's PPC System",
          },
        ],
        hot: [
          {
            path: "/approach/discovery-process",
            title: "Our Discovery Process",
          },
          { path: "/pricing", title: "Pricing & Packages" },
          {
            path: "/articles/from-lovable-to-production",
            title: "From Lovable to Production",
          },
          {
            path: "/resources/assessment-framework",
            title: "Assessment Framework",
          },
        ],
        qualified: [
          {
            path: "/contact/book-consultation",
            title: "Book Your Consultation",
          },
          {
            path: "/contact/project-requirements",
            title: "Project Requirements",
          },
          { path: "/contact/faq", title: "Frequently Asked Questions" },
        ],
      };

      const suggestions = contentMap[level] || contentMap.cold;
      const visitedPages = Object.keys(profile.behavior?.pages || {});

      // For warm level, prioritize the lead qualifier if not visited
      if (
        level === "warm" &&
        !visitedPages.includes("/case-studies/lead-qualifier")
      ) {
        return {
          path: "/case-studies/lead-qualifier",
          title: "How I'm Scoring Your Engagement Right Now",
        };
      }

      // Find unvisited suggestions
      const unvisited = suggestions.filter(
        (s) => !visitedPages.includes(s.path)
      );

      // If all suggested pages visited, pick from a broader list
      if (unvisited.length === 0) {
        const allPages = [
          {
            path: "/articles/corner-cutters-guide-building-future",
            title: "Corner Cutter's Guide to Building the Future",
          },
          {
            path: "/articles/great-job-search-delusion",
            title: "The Great Job Search Delusion",
          },
          { path: "/tool-ideas/seo-teams", title: "Tools for SEO Teams" },
          {
            path: "/tool-ideas/content-teams",
            title: "Tools for Content Teams",
          },
          {
            path: "/case-studies/growthrunner-devtools",
            title: "GrowthRunner's DevTools",
          },
          {
            path: "/case-studies/snacker-ai-video-platform",
            title: "Snacker's AI Video Platform",
          },
        ];
        const unvisitedBroad = allPages.filter(
          (p) => !visitedPages.includes(p.path)
        );
        if (unvisitedBroad.length > 0) {
          return unvisitedBroad[
            Math.floor(Math.random() * unvisitedBroad.length)
          ];
        }
      }

      // Return random unvisited suggestion
      return unvisited.length > 0
        ? unvisited[Math.floor(Math.random() * unvisited.length)]
        : null;
    }

    updateEngagement(profile = null, eventType) {
      if (!profile) profile = StorageManager.getVisitorProfile();

      if (!profile.engagement) {
        profile.engagement = {
          score: 0,
          level: "cold",
          signals: [],
          lastEngagement: null,
          previousLevel: "cold",
          toastShown: {},
        };
      }

      const score = CONFIG.trackingEvents[eventType] || 0;
      profile.engagement.score += score;
      profile.engagement.lastEngagement = new Date().toISOString();

      // Store previous level to detect changes
      const previousLevel = profile.engagement.level || "cold";

      // Determine engagement level with updated thresholds
      if (profile.engagement.score >= 5000) {
        profile.engagement.level = "qualified";
        if (!profile.engagement.signals.includes("qualified_lead")) {
          profile.engagement.signals.push("qualified_lead");
          this.notifyHighValueLead(profile);
          // Show Get in Touch widget for newly qualified leads
          setTimeout(() => GetInTouchWidget.checkAndShow(), 2000);
        }
      } else if (profile.engagement.score >= 2500) {
        profile.engagement.level = "hot";
      } else if (profile.engagement.score >= 1000) {
        profile.engagement.level = "warm";
      } else if (profile.engagement.score >= 100) {
        profile.engagement.level = "cold";
      }

      // Show toast if level changed with hard-coded suggestions
      if (previousLevel !== profile.engagement.level) {
        const levelMessages = {
          cold: {
            message: "Getting warmer! Check out: Why Productize Your Services",
            path: "/services/why-productize"
          },
          warm: {
            message: "Curious about these toasts? See How I'm Tracking You Right Now",
            path: "/case-studies/lead-qualifier"
          },
          hot: {
            message: "Things are heating up! Ready for: Our Discovery Process?",
            path: "/approach/discovery-process"
          },
          qualified: {
            message: "You're qualified! Let's talk: Book Your Consultation",
            path: "/contact/book-consultation"
          }
        };

        const toastData = levelMessages[profile.engagement.level];
        if (
          toastData &&
          !profile.engagement.toastShown[profile.engagement.level]
        ) {
          // Always create clickable toast with hard-coded path
          ToastManager.showWithLink(
            toastData.message,
            profile.engagement.level,
            toastData.path,
            8000
          );
          profile.engagement.toastShown[profile.engagement.level] = true;
        }
      }

      this.detectEngagementSignals(profile);
      StorageManager.saveVisitorProfile(profile);
    }

    detectEngagementSignals(profile) {
      const signals = [];

      // Page engagement
      if (profile.behavior.uniquePagesViewed >= 3)
        signals.push("multi_page_visitor");
      if (profile.behavior.uniquePagesViewed >= 5)
        signals.push("deep_explorer");

      // Time engagement
      if (profile.behavior.averageTimePerPage >= 60)
        signals.push("engaged_reader");
      if (profile.behavior.totalTimeSpent >= 300)
        signals.push("high_time_investment");

      // Content engagement
      const pageKeys = Object.keys(profile.behavior.pages);
      const deepPages = pageKeys.filter(
        (key) => profile.behavior.pages[key].maxScrollDepth >= 75
      );
      if (deepPages.length >= 3) signals.push("deep_content_consumer");

      // Tool usage
      if (profile.behavior.toolsUsed.length > 0) signals.push("tool_user");
      if (profile.behavior.contentCategories.includes("case-studies"))
        signals.push("case_study_reader");
      if (profile.behavior.contentCategories.includes("contact"))
        signals.push("contact_visitor");

      // Add new signals
      signals.forEach((signal) => {
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
          .map((p) => ({ path: p.path, time: p.totalTimeSpent })),
        company: profile.company,
        contact: profile.contact,
      });

      if (window.gtag) {
        window.gtag("event", "qualified_lead", {
          value: profile.engagement.score,
          engagement_level: profile.engagement.level,
          signals: profile.engagement.signals.join(","),
        });
      }
    }

    cleanup() {
      // Save current session data
      this.saveSessionData();

      // Track final time on page
      this.trackTimeOnPage();

      // Clear timeouts
      this.timeouts.forEach((timeout) => clearTimeout(timeout));

      // Clear time tracking interval
      if (this.timeTrackingInterval) {
        clearInterval(this.timeTrackingInterval);
      }
    }

    init() {
      this.initializePage();
      this.setupScrollTracking();
      this.setupTimeTracking();

      // Track time every 10 seconds for accurate measurement
      // Using 10 seconds to balance accuracy with performance
      this.timeTrackingInterval = setInterval(() => {
        if (!document.hidden) {
          this.trackTimeOnPage();
        }
      }, 10000);

      // Track time when leaving page
      window.addEventListener("beforeunload", () => {
        this.cleanup();
      });

      // Track when tab becomes hidden/visible
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          // Save time when tab loses focus
          this.trackTimeOnPage();
        } else {
          // Reset the last update time when tab regains focus
          // This prevents counting the time while the tab was hidden
          this.lastUpdateTime = Date.now();
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
      const profile = StorageManager.updateVisitorProfile({
        company: companyData,
      });
      if (currentTracker) {
        currentTracker.updateEngagement(profile, "companyInfoProvided");
        currentTracker.trackAction("company_captured", companyData);
      }
      log("Company info captured:", companyData);
    },

    captureContact: (contactData) => {
      const profile = StorageManager.updateVisitorProfile({
        contact: contactData,
      });
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
        timestamp: new Date().toISOString(),
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

    resetTimeData: () => {
      const profile = StorageManager.getVisitorProfile();
      // Reset global time
      profile.behavior.totalTimeSpent = 0;
      profile.behavior.averageTimePerPage = 0;

      // Reset time for all pages
      Object.keys(profile.behavior.pages).forEach((path) => {
        profile.behavior.pages[path].totalTimeSpent = 0;
        profile.behavior.pages[path].averageTimeSpent = 0;
        profile.behavior.pages[path].sessions = [];
      });

      StorageManager.saveVisitorProfile(profile);
      log("Time tracking data reset");
    },

    enableDebug: () => {
      CONFIG.debugMode = true;
      log("Debug mode enabled");
      log("Current profile:", StorageManager.getVisitorProfile());
    },

    getAchievements: () => {
      const profile = StorageManager.getVisitorProfile();
      const unlocked = profile.achievements?.unlocked || [];

      return ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: unlocked.includes(achievement.id),
        unlockedAt: profile.achievements?.unlockedAt?.[achievement.id] || null
      }));
    },

    getUnlockedAchievements: () => {
      const profile = StorageManager.getVisitorProfile();
      const unlocked = profile.achievements?.unlocked || [];

      return ACHIEVEMENTS.filter(a => unlocked.includes(a.id))
        .map(achievement => ({
          ...achievement,
          unlockedAt: profile.achievements?.unlockedAt?.[achievement.id]
        }));
    },

    checkForAchievements: () => {
      const profile = StorageManager.getVisitorProfile();
      const newAchievements = StorageManager.checkAchievements(profile);
      StorageManager.saveVisitorProfile(profile);
      return newAchievements;
    },

    resetAchievements: () => {
      const profile = StorageManager.getVisitorProfile();
      profile.achievements = {
        unlocked: [],
        unlockedAt: {}
      };
      StorageManager.saveVisitorProfile(profile);
      log("Achievements reset");
    },
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
        const codeBlock =
          selection.anchorNode.parentElement?.closest("pre, code");
        if (codeBlock) {
          currentTracker.updateEngagement(null, "codeBlockCopy");
          currentTracker.trackAction("code_copied", {
            snippet: selection.toString().substring(0, 100),
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
      currentTracker = null; // Ensure old tracker is fully cleared
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

    history.pushState = function () {
      originalPushState.apply(history, arguments);
      setTimeout(() => {
        log("PushState navigation detected");
        init();
      }, 0);
    };

    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      setTimeout(() => {
        log("ReplaceState navigation detected");
        init();
      }, 0);
    };
  };

  // Toast Notification System
  const ToastManager = {
    toasts: [],
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "withseismic-toast-container";
        this.container.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 10000;
          pointer-events: none;
        `;
        document.body.appendChild(this.container);
      }
    },

    show(message, level = "info", duration = 5000) {
      this.init();

      const toast = document.createElement("div");
      toast.className = "withseismic-toast";

      // Define colors based on engagement level
      const colors = {
        cold: { bg: "#f3f4f6", border: "#9ca3af", text: "#374151", icon: "❄️" },
        warm: { bg: "#fef3c7", border: "#fbbf24", text: "#92400e", icon: "🔥" },
        hot: { bg: "#fee2e2", border: "#f87171", text: "#991b1b", icon: "🔥" },
        qualified: {
          bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          border: "#f59e0b",
          text: "#ffffff",
          icon: "🎯",
        },
        achievement: {
          bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          border: "#7c3aed",
          text: "#ffffff",
          icon: "🏅",
        },
      };

      const color = colors[level] || colors.cold;

      // Responsive width based on viewport
      const isMobile = window.innerWidth < 640;
      const minWidth = isMobile ? "280px" : "320px";
      const maxWidth = isMobile ? "calc(100vw - 40px)" : "420px";

      toast.style.cssText = `
        background: ${color.bg};
        border: 2px solid ${color.border};
        color: ${color.text};
        padding: 12px 48px 12px 16px;
        margin-bottom: 12px;
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: ${minWidth};
        max-width: ${maxWidth};
        width: max-content;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        pointer-events: auto;
        animation: slideInLeft 0.3s ease-out;
        transition: all 0.3s ease;
        position: relative;
      `;

      // Create dismiss button
      const dismissBtn = document.createElement("button");
      dismissBtn.style.cssText = `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: ${color.text};
        cursor: pointer;
        padding: 4px;
        font-size: 18px;
        line-height: 1;
        opacity: 0.7;
        transition: opacity 0.2s;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      dismissBtn.innerHTML = "×";
      dismissBtn.title = "Dismiss";
      dismissBtn.onmouseover = () => (dismissBtn.style.opacity = "1");
      dismissBtn.onmouseout = () => (dismissBtn.style.opacity = "0.7");

      toast.innerHTML = `
        <span style="font-size: 20px; flex-shrink: 0;">${color.icon}</span>
        <span style="flex: 1; line-height: 1.4;">${message}</span>
      `;

      toast.appendChild(dismissBtn);

      // Add CSS animation if not already added
      if (!document.getElementById("withseismic-toast-styles")) {
        const style = document.createElement("style");
        style.id = "withseismic-toast-styles";
        style.textContent = `
          @keyframes slideInLeft {
            from {
              transform: translateX(-120%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutLeft {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-120%);
              opacity: 0;
            }
          }
          .withseismic-toast-clickable {
            cursor: pointer !important;
          }
          .withseismic-toast-clickable:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
          }
          @media (max-width: 640px) {
            #withseismic-toast-container {
              left: 10px !important;
              right: 10px !important;
              bottom: 10px !important;
            }
          }
        `;
        document.head.appendChild(style);
      }

      this.container.appendChild(toast);
      this.toasts.push(toast);

      // Dismiss function
      const dismissToast = () => {
        toast.style.animation = "slideOutLeft 0.3s ease-in";
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
          const index = this.toasts.indexOf(toast);
          if (index > -1) {
            this.toasts.splice(index, 1);
          }
        }, 300);
      };

      // Add dismiss button click handler
      dismissBtn.onclick = (e) => {
        e.stopPropagation();
        clearTimeout(toast.dismissTimeout);
        dismissToast();
      };

      // Auto-dismiss after duration
      toast.dismissTimeout = setTimeout(dismissToast, duration);

      return toast;
    },

    showWithLink(message, level = "info", link, duration = 8000) {
      const toast = this.show(message, level, duration);

      // Make toast clickable
      toast.classList.add("withseismic-toast-clickable");
      toast.style.cursor = "pointer";

      // Add click handler
      toast.addEventListener("click", () => {
        window.location.href = link;
      });

      // Add hover effect hint
      toast.title = "Click to explore this content";

      return toast;
    },
  };

  // Get in Touch Widget for Qualified Leads
  const GetInTouchWidget = {
    widget: null,
    dismissedKey: 'withseismic_getintouch_dismissed',

    init() {
      const profile = StorageManager.getVisitorProfile();

      // Only show for qualified leads
      if (profile.engagement?.score < 5000) return;

      // Check if dismissed recently (within 24 hours)
      const dismissedAt = localStorage.getItem(this.dismissedKey);
      if (dismissedAt) {
        const dismissTime = new Date(dismissedAt);
        const now = new Date();
        const hoursSinceDismiss = (now - dismissTime) / (1000 * 60 * 60);
        if (hoursSinceDismiss < 24) return;
      }

      this.createWidget();
    },

    createWidget() {
      // Don't create if already exists
      if (document.getElementById('withseismic-getintouch-widget')) return;

      this.widget = document.createElement('div');
      this.widget.id = 'withseismic-getintouch-widget';
      // Detect if dark mode
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.widget.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 320px;
        background: ${isDarkMode ? '#1f2937' : '#ffffff'};
        border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        z-index: 9998;
        animation: slideInRight 0.5s ease-out;
        cursor: default;
      `;

      this.widget.innerHTML = `
        <button id="withseismic-getintouch-close" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border-radius: 4px;
        "
        onmouseover="this.style.background='${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}'; this.style.color='${isDarkMode ? '#ffffff' : '#111827'}';"
        onmouseout="this.style.background='transparent'; this.style.color='${isDarkMode ? '#9ca3af' : '#6b7280'}';"
        title="Dismiss for 24 hours">×</button>

        <div style="margin-bottom: 12px;">
          <span style="
            color: #FF8000;
            font-weight: bold;
            font-size: 18px;
          ">Hey, I think we're a good fit!</span>
        </div>

        <p style="
          color: ${isDarkMode ? '#e5e7eb' : '#6b7280'};
          line-height: 1.6;
          margin: 0 0 16px 0;
          font-size: 14px;
        ">
          You've explored quite a bit of what we do, and it seems like there's real potential here.
          Why don't you reach out and let me know how I can help?
        </p>

        <a href="/contact/book-consultation" style="
          display: block;
          background: linear-gradient(to right, #FF8000, #CC6600);
          color: #ffffff;
          text-align: center;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s;
          box-shadow: 0 2px 10px rgba(255, 128, 0, 0.2);
        "
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(255, 128, 0, 0.3)';"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 10px rgba(255, 128, 0, 0.2)';">
          Let's Talk →
        </a>

        <p style="
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
          font-size: 11px;
          margin: 12px 0 0 0;
          text-align: center;
          font-style: italic;
        ">
          Based on your engagement score of ${StorageManager.getVisitorProfile().engagement?.score || 0} points
        </p>
      `;

      // Add styles for animations if not already added
      if (!document.getElementById('withseismic-getintouch-styles')) {
        const style = document.createElement('style');
        style.id = 'withseismic-getintouch-styles';
        style.textContent = `
          @keyframes slideInRight {
            from {
              transform: translateX(120%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @media (max-width: 640px) {
            #withseismic-getintouch-widget {
              width: calc(100vw - 40px) !important;
              left: 20px !important;
              right: 20px !important;
            }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(this.widget);

      // Add close handler
      document.getElementById('withseismic-getintouch-close').addEventListener('click', () => {
        this.dismiss();
      });
    },

    dismiss() {
      if (this.widget) {
        // Store dismissal time
        localStorage.setItem(this.dismissedKey, new Date().toISOString());

        // Animate out
        this.widget.style.animation = 'slideOutRight 0.3s ease-in';
        this.widget.style.cssText += 'animation: slideOutRight 0.3s ease-in;';

        // Add slide out animation if not present
        if (!document.querySelector('#withseismic-getintouch-slideout')) {
          const style = document.createElement('style');
          style.id = 'withseismic-getintouch-slideout';
          style.textContent = `
            @keyframes slideOutRight {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(120%);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }

        setTimeout(() => {
          if (this.widget && this.widget.parentNode) {
            this.widget.remove();
            this.widget = null;
          }
        }, 300);

        log("Get in Touch widget dismissed for 24 hours");
      }
    },

    checkAndShow() {
      // This can be called periodically to check if we should show the widget
      // (e.g., after engagement score updates)
      if (!this.widget) {
        this.init();
      }
    }
  };

  // Engagement Profile Widget
  const createEngagementWidget = () => {
    // Only create in development/debug mode
    if (!CONFIG.debugMode) return;

    const widget = document.createElement("div");
    widget.id = "withseismic-engagement-widget";
    widget.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      z-index: 9999;
      max-height: 400px;
      overflow-y: auto;
    `;

    const updateWidget = () => {
      const profile = StorageManager.getVisitorProfile();
      const currentPage = profile.behavior.pages[window.location.pathname];

      widget.innerHTML = `
        <div style="margin-bottom: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
          Visitor Analytics
        </div>

        <div style="margin-bottom: 8px;">
          <strong>Engagement:</strong> ${profile.engagement.level} (${
        profile.engagement.score
      } pts)
        </div>

        <div style="margin-bottom: 8px;">
          <strong>Pages Viewed:</strong> ${
            profile.behavior.uniquePagesViewed
          } unique / ${profile.behavior.totalPageViews} total
        </div>

        <div style="margin-bottom: 8px;">
          <strong>Total Time:</strong> ${Math.floor(
            profile.behavior.totalTimeSpent / 60
          )}m ${profile.behavior.totalTimeSpent % 60}s
        </div>

        <div style="margin-bottom: 8px;">
          <strong>Avg Time/Page:</strong> ${
            profile.behavior.averageTimePerPage
          }s
        </div>

        ${
          currentPage
            ? `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <div style="font-weight: bold; margin-bottom: 4px;">Current Page</div>
          <div style="font-size: 12px; color: #666;">
            <div>Visits: ${currentPage.visitCount}</div>
            <div>Total Time: ${currentPage.totalTimeSpent}s</div>
            <div>Avg Time: ${currentPage.averageTimeSpent}s</div>
          </div>
        </div>
        `
            : ""
        }

        ${
          profile.engagement.level === "qualified"
            ? `
        <div style="margin-top: 12px; padding: 12px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 6px; color: white;">
          <div style="font-weight: bold; margin-bottom: 8px;">🎯 You're a Qualified Lead!</div>
          <div style="font-size: 12px; line-height: 1.5;">
            Here's what happens next:
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
              <li>I've been notified of your interest</li>
              <li>You might see a "Let's talk" modal soon</li>
              <li>My content may appear in your Reddit & LinkedIn feeds</li>
              <li>I might send you a connection request</li>
              <li>You'll see me engaging with people you follow</li>
            </ul>
            <div style="margin-top: 8px; font-style: italic;">
              Just subtle ways to stay top of mind - because clearly, you're curious about what I have to say.
            </div>
          </div>
        </div>
        `
            : profile.engagement.score >= 50
            ? `
        <div style="margin-top: 12px; padding: 8px; background: #fef3c7; border-radius: 6px; border: 1px solid #fbbf24;">
          <div style="font-size: 12px; color: #92400e;">
            <strong>${
              5000 - profile.engagement.score
            } points</strong> until qualified status
          </div>
        </div>
        `
            : ""
        }

        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">
          <button
            onclick="WithSeismicTracker.resetTimeData(); location.reload();"
            style="flex: 1; padding: 6px 12px; background: #fbbf24; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
            onmouseover="this.style.background='#f59e0b'"
            onmouseout="this.style.background='#fbbf24'"
          >
            Reset Time Data
          </button>
          <button
            onclick="WithSeismicTracker.reset(); location.reload();"
            style="flex: 1; padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
            onmouseover="this.style.background='#dc2626'"
            onmouseout="this.style.background='#ef4444'"
          >
            Reset All Data
          </button>
        </div>

        <div style="margin-top: 8px;">
          <button
            onclick="document.getElementById('withseismic-engagement-widget').remove();"
            style="width: 100%; padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
            onmouseover="this.style.background='#4b5563'"
            onmouseout="this.style.background='#6b7280'"
          >
            Close Widget
          </button>
        </div>
      `;
    };

    document.body.appendChild(widget);
    updateWidget();

    // Update widget every 5 seconds
    setInterval(updateWidget, 5000);
  };

  // Add method to show widget
  window.WithSeismicTracker.showWidget = () => {
    CONFIG.debugMode = true;
    if (!document.getElementById("withseismic-engagement-widget")) {
      createEngagementWidget();
    }
  };

  // Toast methods for testing
  window.WithSeismicTracker.showToast = (
    message,
    level = "warm",
    duration = 5000
  ) => {
    ToastManager.show(message, level, duration);
  };

  window.WithSeismicTracker.testToasts = () => {
    // Hard-coded messages matching the actual toast suggestions
    const messages = [
      {
        text: "Getting warmer! Check out: Why Productize Your Services",
        level: "cold",
        delay: 0,
        link: "/services/why-productize"
      },
      {
        text: "Curious about these toasts? See How I'm Tracking You Right Now",
        level: "warm",
        delay: 2000,
        link: "/case-studies/lead-qualifier"
      },
      {
        text: "Things are heating up! Ready for: Our Discovery Process?",
        level: "hot",
        delay: 4000,
        link: "/approach/discovery-process"
      },
      {
        text: "You're qualified! Let's talk: Book Your Consultation",
        level: "qualified",
        delay: 6000,
        link: "/contact/book-consultation"
      }
    ];

    // Show all messages with delays
    messages.forEach(({ text, level, delay, link }) => {
      setTimeout(() => {
        if (link) {
          ToastManager.showWithLink(text, level, link, 8000);
        } else {
          ToastManager.show(text, level, 8000);
        }
      }, delay);
    });

    console.log(
      "🍞 Testing toasts with engagement level notifications!"
    );
  };

  // Test achievements
  window.WithSeismicTracker.testAchievement = (achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievement) {
      const message = `Achievement Unlocked: ${achievement.name}!`;
      ToastManager.show(message, 'achievement', 6000);
      console.log(`🏅 Testing achievement: ${achievement.name} - ${achievement.description}`);
    } else {
      console.log(`Achievement '${achievementId}' not found. Available IDs:`, ACHIEVEMENTS.map(a => a.id));
    }
  };

  window.WithSeismicTracker.showAllAchievements = () => {
    console.log("🏅 All Achievements:");
    const achievements = WithSeismicTracker.getAchievements();
    achievements.forEach(a => {
      const status = a.unlocked ? "✅ UNLOCKED" : "🔒 LOCKED";
      console.log(`${status} ${a.icon} ${a.name}: ${a.description}`);
      if (a.unlocked && a.unlockedAt) {
        console.log(`   Unlocked at: ${new Date(a.unlockedAt).toLocaleString()}`);
      }
    });
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    console.log(`\nProgress: ${unlockedCount}/${achievements.length} achievements unlocked`);
  };

  // Get in Touch widget controls
  window.WithSeismicTracker.showGetInTouch = () => {
    // Force show the widget regardless of score
    const originalScore = StorageManager.getVisitorProfile().engagement?.score;
    if (originalScore < 5000) {
      // Temporarily set score to qualified
      const profile = StorageManager.getVisitorProfile();
      profile.engagement.score = 5000;
      StorageManager.saveVisitorProfile(profile);
    }

    // Clear any dismissal
    localStorage.removeItem('withseismic_getintouch_dismissed');

    // Show the widget
    GetInTouchWidget.init();

    if (originalScore < 5000) {
      // Restore original score after a moment
      setTimeout(() => {
        const profile = StorageManager.getVisitorProfile();
        profile.engagement.score = originalScore;
        StorageManager.saveVisitorProfile(profile);
      }, 100);
    }

    console.log("📢 Get in Touch widget displayed");
  };

  window.WithSeismicTracker.hideGetInTouch = () => {
    GetInTouchWidget.dismiss();
    console.log("👋 Get in Touch widget dismissed");
  };

  window.WithSeismicTracker.clearGetInTouchDismissal = () => {
    localStorage.removeItem('withseismic_getintouch_dismissed');
    console.log("🔄 Get in Touch dismissal cleared - widget will show again for qualified leads");
  };

  // Initialize everything
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupGlobalListeners();
      init();
      setupNavigationTracking();
      if (CONFIG.debugMode) createEngagementWidget();
      // Check if we should show Get in Touch widget
      GetInTouchWidget.init();
    });
  } else {
    setupGlobalListeners();
    init();
    setupNavigationTracking();
    if (CONFIG.debugMode) createEngagementWidget();
    // Check if we should show Get in Touch widget
    GetInTouchWidget.init();
  }
})();
