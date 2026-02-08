// settings-manager.js
const SettingsManager = {
  // Default settings
  defaults: {
    theme: 'pink',
    defaultView: 'daily',
    weekStart: '0',
    autoProgress: true,
    reminderTime: '09:00',
    autoResetTasks: false,
    showStreaks: true,
    enableHabitSnooze: false,
    focusDuration: 25,
    breakDuration: 5,
    sessionsGoal: 4,
    focusVisualMode: 'tree',
    enableFocusSounds: true,
    autoStartBreaks: false,
    enableNotifications: false,
    reminderFrequency: 'both',
    streakReminders: false,
    focusReminders: false
  },

  // Initialize settings
  init() {
    this.loadSettings();
    this.applyTheme();
    this.setupAutoReset();
  },

  // Load settings from localStorage
  loadSettings() {
    const saved = localStorage.getItem('dailyLoopSettings');
    this.settings = saved ? JSON.parse(saved) : { ...this.defaults };
    
    // Apply default values for any missing settings
    this.settings = { ...this.defaults, ...this.settings };
  },

  // Save settings to localStorage
  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('dailyLoopSettings', JSON.stringify(this.settings));
    
    // Apply changes immediately
    this.applyTheme();
    this.applyFocusSettings();
    this.applyNotificationSettings();
    
    return this.settings;
  },

  // Apply theme to entire app
  applyTheme() {
    const theme = this.settings.theme || 'pink';
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    
    // Also set as data attribute for CSS
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Apply focus timer settings
  applyFocusSettings() {
    if (typeof window.updateTimerSettings === 'function') {
      window.updateTimerSettings({
        duration: this.settings.focusDuration * 60,
        breakDuration: this.settings.breakDuration * 60,
        visualMode: this.settings.focusVisualMode
      });
    }
  },

  // Apply notification settings
  applyNotificationSettings() {
    // Save notification permission status
    if (this.settings.enableNotifications && "Notification" in window) {
      Notification.requestPermission();
    }
  },

  // Setup auto-reset for tasks
  setupAutoReset() {
    if (!this.settings.autoResetTasks) return;
    
    const lastReset = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      this.resetDailyTasks();
      localStorage.setItem('lastResetDate', today);
    }
  },

  // Reset daily tasks
  resetDailyTasks() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(today);
  },

  // Get a specific setting
  get(key) {
    return this.settings[key] || this.defaults[key];
  },

  // Get all settings
  getAll() {
    return { ...this.settings };
  },

  // Export settings
  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  },

  // Import settings
  importSettings(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.settings = { ...this.defaults, ...imported };
      localStorage.setItem('dailyLoopSettings', JSON.stringify(this.settings));
      this.init(); // Re-initialize with new settings
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
};

// Make it globally available
window.SettingsManager = SettingsManager;