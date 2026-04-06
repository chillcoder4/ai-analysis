/* =============================================
   PureScan — Health Intelligence Modules
   ADDITIVE ONLY — Does NOT modify existing code.
   Injects new UI components dynamically.
   ============================================= */

(function () {
  'use strict';

  // ==========================================
  // CONSTANTS & CONFIG
  // ==========================================
  const PS_CHAT_HISTORY_KEY = 'purescan_chat_history';
  const PS_DAILY_TIP_KEY = 'purescan_tip_index';
  const PS_BMI_KEY = 'purescan_bmi';

  // ==========================================
  // DAILY HEALTH TIPS DATA
  // ==========================================
  const DAILY_TIPS = [
    { emoji: '💧', title: 'Stay Hydrated', text: 'Drink at least 8 glasses (2L) of water daily. It boosts metabolism, improves skin, and helps in weight management.' },
    { emoji: '🥗', title: 'Eat the Rainbow', text: 'Include colorful fruits & vegetables daily. Each color provides different vitamins and antioxidants your body needs.' },
    { emoji: '🚶', title: '10,000 Steps', text: 'Walking 10,000 steps daily can burn ~400 calories. Start with small walks and gradually increase your daily step count.' },
    { emoji: '😴', title: 'Sleep Well', text: 'Getting 7-8 hours of quality sleep is crucial for weight management. Poor sleep increases hunger hormones.' },
    { emoji: '🍌', title: 'Potassium Power', text: 'Bananas, spinach, and sweet potatoes are rich in potassium — essential for heart health and muscle function.' },
    { emoji: '🧘', title: 'Mindful Eating', text: 'Eat slowly, chew thoroughly, and avoid screens while eating. This reduces overeating by 20-30%.' },
    { emoji: '🥚', title: 'Protein First', text: 'Start your meals with protein. It keeps you full longer and helps build lean muscle mass.' },
    { emoji: '🫒', title: 'Good Fats Matter', text: 'Include healthy fats like olive oil, nuts, and avocados. They support brain health and vitamin absorption.' },
    { emoji: '🍵', title: 'Green Tea Benefits', text: 'Green tea contains catechins that boost metabolism and aid fat burning. Have 2-3 cups daily.' },
    { emoji: '🧂', title: 'Watch Your Salt', text: 'Limit sodium to 2,300mg/day. Excess salt causes water retention, high BP, and bloating.' },
  ];

  // ==========================================
  // VITAMIN & NUTRITION DATA
  // ==========================================
  const VITAMINS_DATA = [
    {
      name: 'Vitamin A', badge: 'A', color: '#f59e0b',
      subtitle: 'Vision & Immunity',
      functions: 'Essential for good vision, immune function, skin health, and cell growth. Acts as an antioxidant protecting cells from damage.',
      deficiency: 'Night blindness, dry skin, frequent infections, poor wound healing, dry eyes.',
      sources: ['Carrots', 'Sweet Potato', 'Spinach', 'Mango', 'Eggs', 'Liver', 'Papaya']
    },
    {
      name: 'Vitamin B Complex', badge: 'B', color: '#6366f1',
      subtitle: 'Energy & Nerves',
      functions: 'B vitamins (B1-B12) help convert food into energy, support nervous system, produce red blood cells, and maintain healthy brain function.',
      deficiency: 'Fatigue, weakness, anemia, numbness in hands/feet, mouth ulcers, confusion, depression.',
      sources: ['Whole Grains', 'Eggs', 'Milk', 'Lentils', 'Chicken', 'Bananas', 'Leafy Greens']
    },
    {
      name: 'Vitamin C', badge: 'C', color: '#f97316',
      subtitle: 'Immunity & Skin',
      functions: 'Powerful antioxidant that boosts immunity, helps iron absorption, supports collagen production for healthy skin, and speeds wound healing.',
      deficiency: 'Scurvy, bleeding gums, slow wound healing, dry/rough skin, frequent colds, joint pain.',
      sources: ['Orange', 'Lemon', 'Amla', 'Guava', 'Bell Pepper', 'Kiwi', 'Strawberry']
    },
    {
      name: 'Vitamin D', badge: 'D', color: '#eab308',
      subtitle: 'Bones & Mood',
      functions: 'Critical for calcium absorption, strong bones and teeth, immune regulation, and mood balance. Often called the "sunshine vitamin".',
      deficiency: 'Bone pain, muscle weakness, fatigue, depression, frequent illness, hair loss.',
      sources: ['Sunlight', 'Fatty Fish', 'Egg Yolks', 'Mushrooms', 'Fortified Milk', 'Cheese']
    },
    {
      name: 'Vitamin E', badge: 'E', color: '#10b981',
      subtitle: 'Antioxidant & Skin',
      functions: 'Protects cells from oxidative damage, supports immune function, skin health, and acts as a natural anti-inflammatory.',
      deficiency: 'Muscle weakness, vision problems, weakened immunity, numbness and tingling.',
      sources: ['Almonds', 'Sunflower Seeds', 'Spinach', 'Peanuts', 'Avocado', 'Olive Oil']
    },
    {
      name: 'Vitamin K', badge: 'K', color: '#22c55e',
      subtitle: 'Blood & Bones',
      functions: 'Essential for blood clotting, bone metabolism, and regulating calcium levels. Helps prevent excessive bleeding.',
      deficiency: 'Easy bruising, excessive bleeding from cuts, heavy menstrual bleeding, weak bones.',
      sources: ['Kale', 'Spinach', 'Broccoli', 'Brussels Sprouts', 'Green Beans', 'Soybeans']
    },
    {
      name: 'Iron', badge: 'Fe', color: '#ef4444',
      subtitle: 'Blood & Energy',
      functions: 'Crucial for hemoglobin production, oxygen transport, energy metabolism, and cognitive function. One of the most common deficiencies.',
      deficiency: 'Anemia, fatigue, pale skin, shortness of breath, cold hands/feet, brittle nails.',
      sources: ['Spinach', 'Red Meat', 'Lentils', 'Chickpeas', 'Fortified Cereals', 'Dates', 'Jaggery']
    },
    {
      name: 'Calcium', badge: 'Ca', color: '#8b5cf6',
      subtitle: 'Bones & Teeth',
      functions: 'Building block for strong bones and teeth, nerve transmission, muscle contractions, and blood clotting.',
      deficiency: 'Osteoporosis, muscle cramps, numbness in fingers, dental problems, brittle nails.',
      sources: ['Milk', 'Curd', 'Paneer', 'Ragi', 'Broccoli', 'Sesame Seeds', 'Almonds']
    }
  ];

  // ==========================================
  // WEIGHT MANAGEMENT CONTENT
  // ==========================================
  const WEIGHT_LOSS_TIPS = [
    { emoji: '🔥', text: '<strong>Calorie Deficit:</strong> Eat 300-500 calories less than your body burns daily. This is the #1 science-backed fat loss method.' },
    { emoji: '🥩', text: '<strong>High Protein:</strong> Eat 1.6-2.2g protein per kg body weight. Protein preserves muscle and keeps you full longer.' },
    { emoji: '⏰', text: '<strong>Intermittent Fasting:</strong> Try 16:8 method — eat within 8 hours, fast for 16. Helps burn stored fat effortlessly.' },
    { emoji: '🚫', text: '<strong>Cut Processed Foods:</strong> Avoid packaged snacks, sugary drinks, and anything with palm oil. These are empty calories.' },
    { emoji: '🏃', text: '<strong>Move More:</strong> Combine strength training + cardio. Muscle burns more calories even at rest.' },
    { emoji: '📏', text: '<strong>Track Progress:</strong> Measure waist, not just weight. Muscle gain can mask fat loss on the scale.' },
  ];

  const WEIGHT_GAIN_TIPS = [
    { emoji: '📈', text: '<strong>Calorie Surplus:</strong> Eat 300-500 calories MORE than your body burns daily. Focus on nutrient-dense foods, not junk.' },
    { emoji: '💪', text: '<strong>Strength Training:</strong> Lift heavy weights 3-4 times per week. This tells your body to build muscle, not store fat.' },
    { emoji: '🥜', text: '<strong>Calorie-Dense Foods:</strong> Nuts, peanut butter, dried fruits, whole milk, cheese, and avocados are your friends.' },
    { emoji: '🍚', text: '<strong>Complex Carbs:</strong> Brown rice, oats, sweet potato, and whole wheat roti provide sustained energy for muscle growth.' },
    { emoji: '🥛', text: '<strong>Post-Workout Shake:</strong> Blend banana + milk + peanut butter + oats = 600+ calorie muscle-building shake.' },
    { emoji: '😴', text: '<strong>Rest & Sleep:</strong> Muscles grow during rest, not in the gym. Get 8 hours of sleep and take rest days.' },
  ];

  const FOODS_AVOID_LOSS = [
    { emoji: '🍟', name: 'Fried Foods', info: 'Trans fats, empty calories' },
    { emoji: '🥤', name: 'Sugary Drinks', info: '40g+ sugar per serving' },
    { emoji: '🍰', name: 'Refined Sugar', info: 'Spikes insulin, stores fat' },
    { emoji: '🍕', name: 'Processed Foods', info: 'Palm oil, preservatives' },
    { emoji: '🍞', name: 'White Bread', info: 'High glycemic index' },
    { emoji: '🧃', name: 'Packaged Juice', info: 'Added sugar, no fiber' },
  ];

  const FOODS_GAIN = [
    { emoji: '🥜', name: 'Peanut Butter', info: '588 cal / 100g' },
    { emoji: '🥛', name: 'Whole Milk', info: '149 cal / glass' },
    { emoji: '🍌', name: 'Banana Shake', info: '~400 cal / glass' },
    { emoji: '🧀', name: 'Paneer / Cheese', info: '265 cal / 100g' },
    { emoji: '🥣', name: 'Oats + Honey', info: '~350 cal / bowl' },
    { emoji: '🥚', name: 'Whole Eggs', info: '155 cal / 2 eggs' },
    { emoji: '🫘', name: 'Rajma / Chickpeas', info: '~330 cal / cup' },
    { emoji: '🍠', name: 'Sweet Potato', info: '86 cal, complex carbs' },
  ];

  // ==========================================
  // FITNESS & GYM CONTENT
  // ==========================================
  const PRE_WORKOUT_FOODS = [
    { emoji: '🍌', name: 'Banana', info: 'Quick energy, potassium' },
    { emoji: '🥣', name: 'Oatmeal', info: 'Sustained energy release' },
    { emoji: '🍞', name: 'Whole Wheat Toast', info: 'Complex carbs + fiber' },
    { emoji: '🍎', name: 'Apple + PB', info: 'Carbs + healthy fats' },
    { emoji: '☕', name: 'Black Coffee', info: 'Boosts performance 12%' },
    { emoji: '🥤', name: 'Smoothie', info: 'Quick absorption fuel' },
  ];

  const POST_WORKOUT_FOODS = [
    { emoji: '🥚', name: 'Eggs + Toast', info: 'Protein + carbs recovery' },
    { emoji: '🥛', name: 'Whey Shake', info: '25g fast protein' },
    { emoji: '🍗', name: 'Chicken + Rice', info: 'Complete recovery meal' },
    { emoji: '🍌', name: 'Banana + Curd', info: 'Glycogen replenishment' },
    { emoji: '🥜', name: 'Paneer + Roti', info: 'Indian muscle meal' },
    { emoji: '🫘', name: 'Dal + Rice', info: 'Plant-based protein combo' },
  ];

  const WEEKLY_DIET = [
    { day: 'Monday', breakfast: 'Oats + Banana + Almonds', lunch: 'Brown Rice + Dal + Salad', dinner: 'Grilled Paneer + Roti + Raita' },
    { day: 'Tuesday', breakfast: 'Egg Omelette + Toast', lunch: 'Chicken Curry + Rice', dinner: 'Moong Dal + Chapati + Veggies' },
    { day: 'Wednesday', breakfast: 'Poha + Sprouts', lunch: 'Rajma + Rice + Curd', dinner: 'Grilled Fish + Sweet Potato' },
    { day: 'Thursday', breakfast: 'Smoothie Bowl', lunch: 'Chole + Roti + Salad', dinner: 'Palak Paneer + Brown Rice' },
    { day: 'Friday', breakfast: 'Idli + Sambar + Chutney', lunch: 'Egg Curry + Roti', dinner: 'Tofu Stir-Fry + Quinoa' },
    { day: 'Saturday', breakfast: 'Besan Chilla + Curd', lunch: 'Biryani (Brown Rice) + Raita', dinner: 'Dal Tadka + Roti + Salad' },
    { day: 'Sunday', breakfast: 'Pancakes + Fruits', lunch: 'Fish Curry + Rice + Veggies', dinner: 'Soup + Grilled Chicken Salad' },
  ];

  const GYM_TIPS = [
    { emoji: '🏋️', text: '<strong>Start with Compound Exercises:</strong> Squats, Deadlifts, Bench Press, Pull-ups. These build the most muscle efficiently.' },
    { emoji: '⏱️', text: '<strong>Progressive Overload:</strong> Gradually increase weight, reps, or sets every week. Your body adapts — make it work harder.' },
    { emoji: '💧', text: '<strong>Hydrate During Workout:</strong> Drink small sips of water every 15 minutes. Dehydration drops performance by 20%.' },
    { emoji: '🔄', text: '<strong>Don\'t Skip Warm-Up:</strong> 5-10 min dynamic stretching before every session prevents injuries and improves performance.' },
    { emoji: '📊', text: '<strong>Track Your Lifts:</strong> Keep a workout journal. Consistency and tracking is the #1 difference between results and stagnation.' },
  ];

  // ==========================================
  // CHAT SUGGESTIONS
  // ==========================================
  const CHAT_SUGGESTIONS = [
    'Is Maggi healthy?',
    'Best diet for weight loss?',
    'High protein Indian foods?',
    'Pre-workout meal ideas?',
    'How to reduce belly fat?',
    'Best foods for muscle gain?',
  ];

  // ==========================================
  // INITIALIZATION — Wait for existing app
  // ==========================================
  function initHealthModules() {
    // Don't inject if already injected
    if (document.getElementById('psBottomNav')) return;

    injectBottomNav();
    injectChatPanel();
    injectWeightPanel();
    injectFitnessPanel();
    injectNutritionPanel();
    injectSmartSuggestions();
    bindNavEvents();
    initDailyTip();
    initBMI();
    initChatFromHistory();
    hookIntoScanResults();

    document.body.classList.add('ps-has-nav');

    // Re-init lucide icons
    if (window.lucide) {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  // Wait for the existing app to initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initHealthModules, 200));
  } else {
    setTimeout(initHealthModules, 200);
  }

  // ==========================================
  // INJECT BOTTOM NAVIGATION
  // ==========================================
  function injectBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'ps-bottom-nav';
    nav.id = 'psBottomNav';
    nav.innerHTML = `
      <button class="ps-nav-item ps-nav-active" data-panel="home" aria-label="Home">
        <i data-lucide="home"></i>
        <span>Home</span>
      </button>
      <button class="ps-nav-item" data-panel="chat" aria-label="AI Chat">
        <i data-lucide="message-circle"></i>
        <span>AI Chat</span>
      </button>
      <button class="ps-nav-item" data-panel="weight" aria-label="Weight">
        <i data-lucide="weight"></i>
        <span>Weight</span>
      </button>
      <button class="ps-nav-item" data-panel="fitness" aria-label="Fitness">
        <i data-lucide="dumbbell"></i>
        <span>Fitness</span>
      </button>
      <button class="ps-nav-item" data-panel="nutrition" aria-label="Nutrition">
        <i data-lucide="apple"></i>
        <span>Nutrition</span>
      </button>
    `;
    document.body.appendChild(nav);
  }

  // ==========================================
  // INJECT AI CHAT PANEL
  // ==========================================
  function injectChatPanel() {
    const panel = document.createElement('div');
    panel.className = 'ps-panel';
    panel.id = 'psChatPanel';
    panel.innerHTML = `
      <div class="ps-panel-header">
        <h2><i data-lucide="bot"></i> AI Health Assistant</h2>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="ps-chat-history-btn" id="psClearChat" aria-label="Clear chat">
            <i data-lucide="trash-2"></i> Clear
          </button>
          <button class="ps-panel-close" id="psChatClose" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="ps-chat-messages" id="psChatMessages">
        <div class="ps-chat-msg ps-msg-ai">
          <div class="ps-msg-avatar"><i data-lucide="bot"></i></div>
          <div class="ps-msg-content">
            <p>👋 Hello! I'm your <strong>AI Health Assistant</strong>.</p>
            <p>Ask me anything about:</p>
            <ul>
              <li>🔍 Product analysis & ingredients</li>
              <li>🥗 Diet advice & meal plans</li>
              <li>⚖️ Weight loss / weight gain tips</li>
              <li>💪 Fitness & workout nutrition</li>
              <li>💊 Vitamins & nutrition info</li>
            </ul>
            <p>Just type your question below!</p>
          </div>
        </div>
      </div>
      <div class="ps-chat-suggestions" id="psChatSuggestions">
        ${CHAT_SUGGESTIONS.map(s => `<button class="ps-chat-suggest-btn">${s}</button>`).join('')}
      </div>
      <div class="ps-chat-barcode-preview" id="psChatBarcodePreview">
        <i data-lucide="scan-line" class="barcode-icon"></i>
        <span class="barcode-text" id="psChatBarcodeText"></span>
        <button class="barcode-remove" id="psChatBarcodeRemove"><i data-lucide="x"></i></button>
      </div>
      <div class="ps-chat-input">
        <div class="ps-chat-input-wrapper">
          <button class="ps-chat-barcode-btn" id="psChatBarcodeBtn" aria-label="Scan Barcode">
            <i data-lucide="scan-line"></i>
          </button>
          <input type="text" id="psChatInput" placeholder="Ask about health or scan a barcode..." autocomplete="off">
        </div>
        <button class="ps-chat-send" id="psChatSend" aria-label="Send message">
          <i data-lucide="send"></i>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    // Bind chat events
    const sendBtn = document.getElementById('psChatSend');
    const input = document.getElementById('psChatInput');
    const clearBtn = document.getElementById('psClearChat');
    const barcodeBtn = document.getElementById('psChatBarcodeBtn');
    const barcodePreview = document.getElementById('psChatBarcodePreview');
    const barcodeText = document.getElementById('psChatBarcodeText');
    const barcodeRemove = document.getElementById('psChatBarcodeRemove');

    // Barcode scan button — open scanning modal
    barcodeBtn.addEventListener('click', () => openChatBarcodeModal());

    // Remove barcode preview
    barcodeRemove.addEventListener('click', () => {
      clearChatBarcode();
    });

    sendBtn.addEventListener('click', () => sendChatMessage());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (input.value.trim() || currentChatBarcode)) sendChatMessage();
    });

    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all chat history?')) {
        localStorage.removeItem(PS_CHAT_HISTORY_KEY);
        const msgs = document.getElementById('psChatMessages');
        msgs.innerHTML = '';
        addAIWelcomeMessage();
        if (window.lucide) lucide.createIcons();
      }
    });

    // Suggestion buttons
    document.querySelectorAll('.ps-chat-suggest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.textContent;
        sendChatMessage();
      });
    });
  }

  // ==========================================
  // INJECT WEIGHT MANAGEMENT PANEL
  // ==========================================
  function injectWeightPanel() {
    const panel = document.createElement('div');
    panel.className = 'ps-panel';
    panel.id = 'psWeightPanel';

    const lossHTML = `
      <div class="ps-mode-content ps-mode-visible" id="psWeightLossContent">
        <h3 class="ps-panel-section-title"><i data-lucide="flame"></i> Fat Loss Tips</h3>
        ${WEIGHT_LOSS_TIPS.map(t => `
          <div class="ps-tip-card">
            <div class="ps-tip-icon ps-tip-icon-red">${t.emoji}</div>
            <div class="ps-tip-text">${t.text}</div>
          </div>
        `).join('')}

        <h3 class="ps-panel-section-title"><i data-lucide="ban"></i> Foods to Avoid</h3>
        <div class="ps-food-grid">
          ${FOODS_AVOID_LOSS.map(f => `
            <div class="ps-food-card">
              <span class="ps-food-emoji">${f.emoji}</span>
              <div class="ps-food-name">${f.name}</div>
              <div class="ps-food-info">${f.info}</div>
            </div>
          `).join('')}
        </div>

        <h3 class="ps-panel-section-title" style="margin-top:1.5rem"><i data-lucide="calculator"></i> BMI Calculator</h3>
        <div class="ps-section-card">
          <div class="ps-bmi-calculator">
            <div class="ps-bmi-inputs">
              <div class="ps-bmi-field">
                <label>Weight (kg)</label>
                <input type="number" id="psBmiWeight" placeholder="e.g. 70" min="20" max="300">
              </div>
              <div class="ps-bmi-field">
                <label>Height (cm)</label>
                <input type="number" id="psBmiHeight" placeholder="e.g. 170" min="100" max="250">
              </div>
            </div>
            <button class="ps-bmi-btn" id="psBmiCalc">
              <i data-lucide="calculator"></i> Calculate BMI
            </button>
            <div class="ps-bmi-result" id="psBmiResult">
              <div class="ps-bmi-value" id="psBmiValue">—</div>
              <div class="ps-bmi-category" id="psBmiCategory">—</div>
              <div class="ps-bmi-bar"><div class="ps-bmi-marker" id="psBmiMarker"></div></div>
              <div class="ps-bmi-labels"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
              <p class="ps-bmi-desc" id="psBmiDesc"></p>
            </div>
          </div>
        </div>
      </div>
    `;

    const gainHTML = `
      <div class="ps-mode-content" id="psWeightGainContent">
        <h3 class="ps-panel-section-title"><i data-lucide="trending-up"></i> Muscle Building Tips</h3>
        ${WEIGHT_GAIN_TIPS.map(t => `
          <div class="ps-tip-card">
            <div class="ps-tip-icon ps-tip-icon-green">${t.emoji}</div>
            <div class="ps-tip-text">${t.text}</div>
          </div>
        `).join('')}

        <h3 class="ps-panel-section-title"><i data-lucide="utensils"></i> High Calorie Healthy Foods</h3>
        <div class="ps-food-grid">
          ${FOODS_GAIN.map(f => `
            <div class="ps-food-card">
              <span class="ps-food-emoji">${f.emoji}</span>
              <div class="ps-food-name">${f.name}</div>
              <div class="ps-food-info">${f.info}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    panel.innerHTML = `
      <div class="ps-panel-header">
        <h2><i data-lucide="weight"></i> Weight Management</h2>
        <button class="ps-panel-close" id="psWeightClose" aria-label="Close">✕</button>
      </div>
      <div class="ps-panel-body">
        <div class="ps-mode-toggle">
          <button class="ps-mode-btn ps-mode-active" data-mode="loss">
            <i data-lucide="flame"></i> Weight Loss
          </button>
          <button class="ps-mode-btn" data-mode="gain">
            <i data-lucide="trending-up"></i> Weight Gain
          </button>
        </div>
        ${lossHTML}
        ${gainHTML}
      </div>
    `;
    document.body.appendChild(panel);

    // Mode toggle
    panel.querySelectorAll('.ps-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        panel.querySelectorAll('.ps-mode-btn').forEach(b => b.classList.remove('ps-mode-active'));
        btn.classList.add('ps-mode-active');
        const mode = btn.getAttribute('data-mode');
        document.getElementById('psWeightLossContent').classList.toggle('ps-mode-visible', mode === 'loss');
        document.getElementById('psWeightGainContent').classList.toggle('ps-mode-visible', mode === 'gain');
      });
    });
  }

  // ==========================================
  // INJECT FITNESS PANEL
  // ==========================================
  function injectFitnessPanel() {
    const panel = document.createElement('div');
    panel.className = 'ps-panel';
    panel.id = 'psFitnessPanel';

    panel.innerHTML = `
      <div class="ps-panel-header">
        <h2><i data-lucide="dumbbell"></i> Gym & Fitness Diet</h2>
        <button class="ps-panel-close" id="psFitnessClose" aria-label="Close">✕</button>
      </div>
      <div class="ps-panel-body">
        <div class="ps-section-card ps-daily-tip" id="psDailyTipCard">
          <h3><i data-lucide="lightbulb"></i> Daily Health Tip</h3>
          <div id="psDailyTipContent"></div>
          <div class="ps-tip-dots" id="psTipDots">
            ${DAILY_TIPS.map((_, i) => `<span class="ps-tip-dot ${i === 0 ? 'ps-tip-dot-active' : ''}" data-tip="${i}"></span>`).join('')}
          </div>
        </div>

        <h3 class="ps-panel-section-title"><i data-lucide="zap"></i> Pre-Workout Foods</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem;">Eat 30-60 minutes before training</p>
        <div class="ps-food-grid">
          ${PRE_WORKOUT_FOODS.map(f => `
            <div class="ps-food-card">
              <span class="ps-food-emoji">${f.emoji}</span>
              <div class="ps-food-name">${f.name}</div>
              <div class="ps-food-info">${f.info}</div>
            </div>
          `).join('')}
        </div>

        <h3 class="ps-panel-section-title" style="margin-top:1.5rem"><i data-lucide="battery-charging"></i> Post-Workout Foods</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem;">Eat within 30 minutes after training</p>
        <div class="ps-food-grid">
          ${POST_WORKOUT_FOODS.map(f => `
            <div class="ps-food-card">
              <span class="ps-food-emoji">${f.emoji}</span>
              <div class="ps-food-name">${f.name}</div>
              <div class="ps-food-info">${f.info}</div>
            </div>
          `).join('')}
        </div>

        <h3 class="ps-panel-section-title" style="margin-top:1.5rem"><i data-lucide="target"></i> Beginner Gym Tips</h3>
        ${GYM_TIPS.map(t => `
          <div class="ps-tip-card">
            <div class="ps-tip-icon ps-tip-icon-blue">${t.emoji}</div>
            <div class="ps-tip-text">${t.text}</div>
          </div>
        `).join('')}

        <h3 class="ps-panel-section-title" style="margin-top:1.5rem"><i data-lucide="calendar-days"></i> Weekly Diet Plan</h3>
        <div class="ps-section-card" style="padding:0.5rem;overflow-x:auto;">
          <table class="ps-diet-table">
            <thead>
              <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
            </thead>
            <tbody>
              ${WEEKLY_DIET.map(d => `
                <tr>
                  <td>${d.day}</td>
                  <td>${d.breakfast}</td>
                  <td>${d.lunch}</td>
                  <td>${d.dinner}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  // ==========================================
  // INJECT NUTRITION (VITAMIN) PANEL
  // ==========================================
  function injectNutritionPanel() {
    const panel = document.createElement('div');
    panel.className = 'ps-panel';
    panel.id = 'psNutritionPanel';

    panel.innerHTML = `
      <div class="ps-panel-header">
        <h2><i data-lucide="apple"></i> Nutrition Knowledge Hub</h2>
        <button class="ps-panel-close" id="psNutritionClose" aria-label="Close">✕</button>
      </div>
      <div class="ps-panel-body">
        <p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:1.25rem;line-height:1.6;">
          Learn about essential vitamins, minerals, and nutrients your body needs. Tap any item to expand and learn about its functions, deficiency symptoms, and natural food sources.
        </p>
        <div class="ps-vitamin-list">
          ${VITAMINS_DATA.map((v, i) => `
            <div class="ps-vitamin-item" data-vitamin="${i}">
              <div class="ps-vitamin-header">
                <div class="ps-vitamin-header-left">
                  <div class="ps-vitamin-badge" style="background:${v.color}">${v.badge}</div>
                  <div>
                    <div class="ps-vitamin-name">${v.name}</div>
                    <div class="ps-vitamin-subtitle">${v.subtitle}</div>
                  </div>
                </div>
                <i data-lucide="chevron-down" class="ps-vitamin-chevron"></i>
              </div>
              <div class="ps-vitamin-body">
                <div class="ps-vitamin-section">
                  <div class="ps-vitamin-section-title">Functions</div>
                  <p>${v.functions}</p>
                </div>
                <div class="ps-vitamin-section">
                  <div class="ps-vitamin-section-title">Deficiency Symptoms</div>
                  <p>${v.deficiency}</p>
                </div>
                <div class="ps-vitamin-section">
                  <div class="ps-vitamin-section-title">Best Natural Sources</div>
                  <div class="ps-vitamin-sources">
                    ${v.sources.map(s => `<span class="ps-vitamin-source-tag">${s}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Accordion toggle
    panel.querySelectorAll('.ps-vitamin-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.ps-vitamin-item');
        const wasOpen = item.classList.contains('ps-vitamin-open');
        // Close all
        panel.querySelectorAll('.ps-vitamin-item').forEach(v => v.classList.remove('ps-vitamin-open'));
        // Open clicked (toggle)
        if (!wasOpen) item.classList.add('ps-vitamin-open');
      });
    });
  }

  // ==========================================
  // INJECT SMART SUGGESTIONS (into result screen)
  // ==========================================
  function injectSmartSuggestions() {
    const resultScreen = document.getElementById('resultScreen');
    if (!resultScreen) return;

    const container = document.createElement('div');
    container.className = 'ps-smart-suggestions';
    container.id = 'psSmartSuggestions';
    container.innerHTML = `
      <div class="ps-smart-badge"><i data-lucide="sparkles"></i> AI Smart Suggestions</div>
      <div id="psSmartContent"></div>
    `;

    // Insert before the buttons
    const btnViewReport = document.getElementById('btnViewReport');
    if (btnViewReport) {
      btnViewReport.parentNode.insertBefore(container, btnViewReport);
    }
  }

  // ==========================================
  // NAVIGATION EVENTS
  // ==========================================
  function bindNavEvents() {
    const navItems = document.querySelectorAll('.ps-nav-item');
    const panels = {
      chat: document.getElementById('psChatPanel'),
      weight: document.getElementById('psWeightPanel'),
      fitness: document.getElementById('psFitnessPanel'),
      nutrition: document.getElementById('psNutritionPanel'),
    };

    // Close buttons
    document.querySelectorAll('.ps-panel-close').forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllPanels(panels);
        setActiveNav('home');
      });
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const panelName = item.getAttribute('data-panel');

        if (panelName === 'home') {
          closeAllPanels(panels);
          setActiveNav('home');
          return;
        }

        const targetPanel = panels[panelName];
        if (!targetPanel) return;

        const isAlreadyOpen = targetPanel.classList.contains('ps-panel-open');

        // Close all first
        closeAllPanels(panels);

        if (!isAlreadyOpen) {
          targetPanel.classList.add('ps-panel-open');
          setActiveNav(panelName);
          if (window.lucide) setTimeout(() => lucide.createIcons(), 50);

          // Focus chat input when opening chat
          if (panelName === 'chat') {
            setTimeout(() => {
              const input = document.getElementById('psChatInput');
              if (input) input.focus();
            }, 400);
          }
        } else {
          setActiveNav('home');
        }
      });
    });
  }

  function closeAllPanels(panels) {
    Object.values(panels).forEach(p => {
      if (p) p.classList.remove('ps-panel-open');
    });
  }

  function setActiveNav(name) {
    document.querySelectorAll('.ps-nav-item').forEach(item => {
      item.classList.toggle('ps-nav-active', item.getAttribute('data-panel') === name);
    });
  }

  // ==========================================
  // AI CHAT LOGIC
  // ==========================================
  let chatIsSending = false;
  let currentChatBarcode = null;

  function openChatBarcodeModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'ps-barcode-modal-overlay';
    overlay.id = 'psChatBarcodeModalOverlay';
    overlay.innerHTML = `
      <div class="ps-barcode-modal">
        <button class="ps-barcode-modal-close" id="psChatBarcodeModalClose"><i data-lucide="x"></i></button>
        <h3><i data-lucide="scan-line"></i> Scan Barcode</h3>
        <div class="ps-barcode-modal-scanner" id="psChatBarcodeScanner"></div>
        <div class="barcode-upload-divider"><span>or</span></div>
        <div class="ps-barcode-modal-upload">
          <button class="btn-scanner-action btn-upload-barcode" id="psChatBarcodeUploadBtn" style="width:100%">
            <i data-lucide="image"></i>
            <span>Upload Barcode Image</span>
          </button>
          <input type="file" id="psChatBarcodeFileInput" accept="image/*" hidden>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    if (window.lucide) lucide.createIcons();

    // Start scanner in the modal
    if (!window.isSecureContext) {
      console.warn('[Chat Barcode] Camera access requires HTTPS');
      document.getElementById('psChatBarcodeScanner').innerHTML = '<p style="color:white; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center; height: 100%;">Camera requires a secure HTTPS connection. Please use the Upload button below.</p>';
    } else {
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length > 0) {
          let selectedCameraId = devices[0].id;
          for (const device of devices) {
            const label = device.label.toLowerCase();
            if (label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('0')) {
              selectedCameraId = device.id;
              if (label.includes('back')) break;
            }
          }

          const chatScanner = new Html5Qrcode('psChatBarcodeScanner', {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.QR_CODE
            ],
            verbose: false
          });

          chatScanner.start(
            { deviceId: { exact: selectedCameraId } },
          {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              let minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              let qrboxWidth = Math.floor(minEdge * 0.85);
              let qrboxHeight = Math.floor(qrboxWidth * 0.45);
              return { width: Math.max(qrboxWidth, 200), height: Math.max(qrboxHeight, 80) };
            },
            aspectRatio: 1.0,
            disableFlip: false
          },
          (decodedText) => {
            setChatBarcode(decodedText);
            closeChatBarcodeModal(chatScanner, overlay);
          },
          () => {}
        ).catch(err => {
          console.warn('[Chat Barcode] Camera failed to start:', err.message);
        });

        // Store chatScanner so close button can clear it
        window._currentChatScanner = chatScanner;
      } else {
        document.getElementById('psChatBarcodeScanner').innerHTML = '<p style="color:white; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center; height: 100%;">No camera found on this device. Please use the Upload button below.</p>';
      }
    }).catch(err => {
      console.warn('[Chat Barcode] Camera permission denied, upload only:', err.message);
      document.getElementById('psChatBarcodeScanner').innerHTML = '<p style="color:white; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center; height: 100%;">Camera permission denied. Please allow access or use the Upload button below.</p>';
    });
    }

    // Upload button
    const uploadBtn = document.getElementById('psChatBarcodeUploadBtn');
    const fileInput = document.getElementById('psChatBarcodeFileInput');
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        let tempDiv = document.getElementById('tempChatBarcodeScanner');
        if (!tempDiv) {
          tempDiv = document.createElement('div');
          tempDiv.id = 'tempChatBarcodeScanner';
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
        }
        const tempScanner = new Html5Qrcode('tempChatBarcodeScanner', {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          verbose: false
        });
        const result = await tempScanner.scanFile(file, true);
        setChatBarcode(result);
        await tempScanner.clear();
        closeChatBarcodeModal(window._currentChatScanner, overlay);
      } catch (err) {
        alert('Could not detect barcode from image. Please try again.');
      }
    });

    // Close button
    document.getElementById('psChatBarcodeModalClose').addEventListener('click', () => {
      closeChatBarcodeModal(window._currentChatScanner, overlay);
    });

    // Click overlay to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeChatBarcodeModal(window._currentChatScanner, overlay);
    });
  }

  async function closeChatBarcodeModal(scanner, overlay) {
    try {
      if (scanner) {
        const state = scanner.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scanner.stop();
        }
        await scanner.clear();
      }
    } catch (e) {}
    window._currentChatScanner = null;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  function setChatBarcode(barcode) {
    currentChatBarcode = barcode;
    const preview = document.getElementById('psChatBarcodePreview');
    const text = document.getElementById('psChatBarcodeText');
    if (preview && text) {
      text.textContent = barcode;
      preview.classList.add('ps-visible');
    }
    if (navigator.vibrate) navigator.vibrate(100);
    if (window.lucide) lucide.createIcons();
  }

  function clearChatBarcode() {
    currentChatBarcode = null;
    const preview = document.getElementById('psChatBarcodePreview');
    if (preview) preview.classList.remove('ps-visible');
  }

  function sendChatMessage() {
    const input = document.getElementById('psChatInput');
    const message = input.value.trim();
    
    // Allow sending if there is a message OR a barcode
    if ((!message && !currentChatBarcode) || chatIsSending) return;

    input.value = '';
    chatIsSending = true;

    const sentBarcode = currentChatBarcode;
    clearChatBarcode();

    // Build the actual query to send
    let queryMessage = message;
    if (sentBarcode) {
      const barcodeQuery = `${sentBarcode} food product ingredients nutrition brand details India`;
      queryMessage = message 
        ? `Barcode: ${sentBarcode} - ${message}. Search context: ${barcodeQuery}`
        : `Analyze this barcode product: ${barcodeQuery}. Provide product name, health analysis, ingredients breakdown, health score (0-10), and healthier alternatives.`;
    }

    // Add user message (display original message + barcode badge)
    addChatMessage('user', message, sentBarcode);

    // Hide suggestions
    const suggestions = document.getElementById('psChatSuggestions');
    if (suggestions) suggestions.style.display = 'none';

    // Show typing indicator
    const typing = showTypingIndicator();

    // Call API
    fetchChatResponse(queryMessage)
      .then(response => {
        removeTypingIndicator(typing);
        addChatMessage('ai', response);
        saveChatHistory();
      })
      .catch(err => {
        removeTypingIndicator(typing);
        addChatMessage('ai', 'Sorry, I couldn\'t process your request right now. Please try again. Error: ' + err.message);
      })
      .finally(() => {
        chatIsSending = false;
      });
  }

  function addChatMessage(type, content, barcodeValue = null) {
    const messagesContainer = document.getElementById('psChatMessages');
    const msg = document.createElement('div');
    msg.className = `ps-chat-msg ps-msg-${type === 'user' ? 'user' : 'ai'}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let barcodeHtml = '';
    if (barcodeValue) {
      barcodeHtml = `<div class="ps-chat-barcode-preview ps-visible" style="margin:0 0 0.5rem;"><i data-lucide="scan-line" class="barcode-icon"></i><span class="barcode-text">${escapeHTML(barcodeValue)}</span></div>`;
    }

    if (type === 'user') {
      msg.innerHTML = `
        <div class="ps-msg-avatar">U</div>
        <div class="ps-msg-content">
          ${barcodeHtml}
          ${content ? `<p>${escapeHTML(content)}</p>` : ''}
          <span class="ps-msg-time">${time}</span>
        </div>
      `;
    } else {
      msg.innerHTML = `
        <div class="ps-msg-avatar"><i data-lucide="bot"></i></div>
        <div class="ps-msg-content">
          ${formatAIResponse(content)}
          <span class="ps-msg-time">${time}</span>
        </div>
      `;
    }

    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (window.lucide) setTimeout(() => lucide.createIcons(), 50);
  }

  function addAIWelcomeMessage() {
    const messagesContainer = document.getElementById('psChatMessages');
    const msg = document.createElement('div');
    msg.className = 'ps-chat-msg ps-msg-ai';
    msg.innerHTML = `
      <div class="ps-msg-avatar"><i data-lucide="bot"></i></div>
      <div class="ps-msg-content">
        <p>👋 Hello! I'm your <strong>AI Health Assistant</strong>.</p>
        <p>Ask me anything about nutrition, diet, weight management, or fitness!</p>
      </div>
    `;
    messagesContainer.appendChild(msg);
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById('psChatMessages');
    const typing = document.createElement('div');
    typing.className = 'ps-chat-msg ps-msg-ai';
    typing.id = 'psTypingIndicator';
    typing.innerHTML = `
      <div class="ps-msg-avatar"><i data-lucide="bot"></i></div>
      <div class="ps-typing">
        <div class="ps-typing-dot"></div>
        <div class="ps-typing-dot"></div>
        <div class="ps-typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    if (window.lucide) lucide.createIcons();
    return typing;
  }

  function removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  async function fetchChatResponse(message) {
    try {
      const payload = {
        message: message,
        context: getRecentChatContext()
      };

      const response = await fetch('/.netlify/functions/health-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // If server returned a fallback reply, use it
        if (errData.reply) return errData.reply;
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();
      return data.reply || 'I couldn\'t generate a response. Please try again.';
    } catch (err) {
      throw err;
    }
  }

  function getRecentChatContext() {
    const msgs = document.querySelectorAll('#psChatMessages .ps-chat-msg');
    const recent = [];
    const allMsgs = Array.from(msgs).slice(-6); // Last 6 messages for context
    allMsgs.forEach(msg => {
      const isUser = msg.classList.contains('ps-msg-user');
      const content = msg.querySelector('.ps-msg-content')?.textContent?.trim() || '';
      if (content) {
        recent.push({ role: isUser ? 'user' : 'assistant', content: content.substring(0, 300) });
      }
    });
    return recent;
  }

  function formatAIResponse(text) {
    // Convert markdown-like formatting to HTML
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^[-•] (.+)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li>$2</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap lists
    html = html.replace(/((?:<li>.+?<\/li>\s*)+)/g, '<ul>$1</ul>');

    // Wrap in paragraphs
    if (!html.startsWith('<')) html = '<p>' + html + '</p>';
    if (!html.endsWith('>')) html += '</p>';

    return html;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================
  // CHAT HISTORY (localStorage)
  // ==========================================
  function saveChatHistory() {
    const msgs = document.querySelectorAll('#psChatMessages .ps-chat-msg');
    const history = [];
    msgs.forEach(msg => {
      const isUser = msg.classList.contains('ps-msg-user');
      const content = msg.querySelector('.ps-msg-content')?.innerHTML || '';
      const time = msg.querySelector('.ps-msg-time')?.textContent || '';
      history.push({ type: isUser ? 'user' : 'ai', content, time });
    });
    // Keep last 50 messages
    const trimmed = history.slice(-50);
    try {
      localStorage.setItem(PS_CHAT_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (e) {
      // localStorage full — clear old data
      localStorage.removeItem(PS_CHAT_HISTORY_KEY);
    }
  }

  function initChatFromHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(PS_CHAT_HISTORY_KEY));
      if (!saved || saved.length === 0) return;

      const messagesContainer = document.getElementById('psChatMessages');
      messagesContainer.innerHTML = ''; // Clear welcome message

      saved.forEach(item => {
        const msg = document.createElement('div');
        msg.className = `ps-chat-msg ps-msg-${item.type === 'user' ? 'user' : 'ai'}`;

        if (item.type === 'user') {
          msg.innerHTML = `
            <div class="ps-msg-avatar">U</div>
            <div class="ps-msg-content">${item.content}</div>
          `;
        } else {
          msg.innerHTML = `
            <div class="ps-msg-avatar"><i data-lucide="bot"></i></div>
            <div class="ps-msg-content">${item.content}</div>
          `;
        }
        messagesContainer.appendChild(msg);
      });

      // Hide suggestions if there's history
      const suggestions = document.getElementById('psChatSuggestions');
      if (suggestions && saved.length > 2) suggestions.style.display = 'none';

    } catch (e) {
      // Invalid data — ignore
    }
  }

  // ==========================================
  // DAILY TIP ROTATION
  // ==========================================
  function initDailyTip() {
    let tipIndex = 0;
    try {
      const saved = localStorage.getItem(PS_DAILY_TIP_KEY);
      if (saved !== null) tipIndex = parseInt(saved) || 0;
    } catch (e) {}

    renderDailyTip(tipIndex);

    // Dots click
    document.querySelectorAll('.ps-tip-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-tip'));
        renderDailyTip(idx);
      });
    });

    // Auto-rotate every 8 seconds
    setInterval(() => {
      tipIndex = (tipIndex + 1) % DAILY_TIPS.length;
      renderDailyTip(tipIndex);
    }, 8000);
  }

  function renderDailyTip(index) {
    const tip = DAILY_TIPS[index];
    if (!tip) return;

    const container = document.getElementById('psDailyTipContent');
    if (!container) return;

    container.innerHTML = `
      <div class="ps-daily-tip-content">
        <div class="ps-daily-tip-icon">${tip.emoji}</div>
        <div class="ps-daily-tip-text">
          <h4>${tip.title}</h4>
          <p>${tip.text}</p>
        </div>
      </div>
    `;

    // Update dots
    document.querySelectorAll('.ps-tip-dot').forEach((dot, i) => {
      dot.classList.toggle('ps-tip-dot-active', i === index);
    });

    try {
      localStorage.setItem(PS_DAILY_TIP_KEY, index.toString());
    } catch (e) {}
  }

  // ==========================================
  // BMI CALCULATOR
  // ==========================================
  function initBMI() {
    const calcBtn = document.getElementById('psBmiCalc');
    if (!calcBtn) return;

    // Load saved BMI
    try {
      const saved = JSON.parse(localStorage.getItem(PS_BMI_KEY));
      if (saved) {
        document.getElementById('psBmiWeight').value = saved.weight;
        document.getElementById('psBmiHeight').value = saved.height;
        calculateBMI(saved.weight, saved.height);
      }
    } catch (e) {}

    calcBtn.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('psBmiWeight').value);
      const height = parseFloat(document.getElementById('psBmiHeight').value);

      if (!weight || !height || weight <= 0 || height <= 0) {
        alert('Please enter valid weight and height.');
        return;
      }

      calculateBMI(weight, height);

      try {
        localStorage.setItem(PS_BMI_KEY, JSON.stringify({ weight, height }));
      } catch (e) {}
    });
  }

  function calculateBMI(weight, height) {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    let category, desc, color;
    if (bmi < 18.5) {
      category = 'Underweight';
      desc = 'You are below the healthy weight range. Focus on nutrient-dense, calorie-rich foods. Consider consulting a nutritionist.';
      color = '#f59e0b';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      desc = 'Great! You are in the healthy weight range. Maintain a balanced diet and regular exercise to stay fit.';
      color = '#10b981';
    } else if (bmi < 30) {
      category = 'Overweight';
      desc = 'You are above the healthy weight range. Consider a moderate calorie deficit and increasing physical activity.';
      color = '#f59e0b';
    } else {
      category = 'Obese';
      desc = 'Your BMI indicates obesity. Please consult a healthcare professional for a personalized weight management plan.';
      color = '#ef4444';
    }

    document.getElementById('psBmiValue').textContent = bmiRounded;
    document.getElementById('psBmiValue').style.color = color;
    document.getElementById('psBmiCategory').textContent = category;
    document.getElementById('psBmiCategory').style.color = color;
    document.getElementById('psBmiDesc').textContent = desc;

    // Position marker on bar (BMI 15-40 range)
    const percent = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));
    document.getElementById('psBmiMarker').style.left = `${percent}%`;

    const result = document.getElementById('psBmiResult');
    result.classList.add('ps-bmi-visible');
  }

  // ==========================================
  // SMART SUGGESTIONS ENGINE (post-scan)
  // ==========================================
  function hookIntoScanResults() {
    // Override the navigateTo function to detect when result screen shows
    const originalNavigateTo = window.navigateTo;

    // We can't override directly since it's module-scoped.
    // Instead, observe DOM changes on result screen
    const resultScreen = document.getElementById('resultScreen');
    if (!resultScreen) return;

    const observer = new MutationObserver(() => {
      if (resultScreen.classList.contains('active')) {
        generateSmartSuggestions();
      }
    });

    observer.observe(resultScreen, { attributes: true, attributeFilter: ['class'] });
  }

  function generateSmartSuggestions() {
    const container = document.getElementById('psSmartSuggestions');
    const content = document.getElementById('psSmartContent');
    if (!container || !content) return;

    // Read current analysis data from DOM
    const score = parseFloat(document.getElementById('resultScore')?.textContent) || 5;
    const sugarLevel = document.getElementById('hlSugarVal')?.textContent || '';
    const processingLevel = document.getElementById('hlProcessingVal')?.textContent || '';
    const additivesLevel = document.getElementById('hlAdditivesVal')?.textContent || '';

    const suggestions = [];

    // Sugar-based suggestions
    if (['High', 'Very High'].includes(sugarLevel)) {
      suggestions.push({ icon: '🍬', text: '<strong>High Sugar Alert!</strong> Look for sugar-free or naturally sweetened alternatives. Try fresh fruits instead of sugary snacks.' });
      suggestions.push({ icon: '🥤', text: 'Replace sugary drinks with <strong>infused water, coconut water, or buttermilk</strong>.' });
    }

    // Processing-based
    if (['High', 'Ultra-Processed'].includes(processingLevel)) {
      suggestions.push({ icon: '🏭', text: '<strong>Ultra-processed!</strong> Try to replace with homemade versions. Cook at home using whole, fresh ingredients.' });
    }

    // Additives-based
    if (['Several', 'Many'].includes(additivesLevel)) {
      suggestions.push({ icon: '⚗️', text: '<strong>Many additives detected.</strong> Look for products with shorter ingredient lists and no E-numbers.' });
    }

    // Score-based
    if (score < 4) {
      suggestions.push({ icon: '🚫', text: '<strong>Consider avoiding this product.</strong> There are healthier options available. Check the Alternatives section in the full report.' });
      suggestions.push({ icon: '💬', text: 'Ask our <strong>AI Health Assistant</strong> for better alternatives — tap the Chat tab below!' });
    } else if (score < 7) {
      suggestions.push({ icon: '⚠️', text: '<strong>Use in moderation.</strong> This product is not the worst, but there are better options. Balance it with nutrition-rich meals.' });
    } else {
      suggestions.push({ icon: '✅', text: '<strong>Good choice!</strong> This product is relatively healthy. Just watch your portions and maintain a balanced diet.' });
    }

    // Always add
    suggestions.push({ icon: '📊', text: 'Track your daily calorie and nutrient intake. Use the <strong>Weight Management</strong> tab for personalized tips.' });

    if (suggestions.length > 0) {
      content.innerHTML = suggestions.map(s => `
        <div class="ps-suggestion-item">
          <span class="ps-suggestion-icon">${s.icon}</span>
          <span class="ps-suggestion-text">${s.text}</span>
        </div>
      `).join('');
      container.classList.add('ps-suggestions-visible');
      if (window.lucide) setTimeout(() => lucide.createIcons(), 50);
    }
  }

  // ==========================================
  // UTILITY — Hide bottom nav on splash/loading
  // ==========================================
  function checkNavVisibility() {
    const nav = document.getElementById('psBottomNav');
    if (!nav) return;

    const splashActive = document.getElementById('splashScreen')?.classList.contains('active');
    const howActive = document.getElementById('howItWorksScreen')?.classList.contains('active');
    const loadingActive = document.getElementById('loadingScreen')?.classList.contains('active');

    if (splashActive || howActive || loadingActive) {
      nav.classList.add('ps-nav-hidden');
    } else {
      nav.classList.remove('ps-nav-hidden');
    }
  }

  // Observe screen changes for nav visibility
  const screenObserver = new MutationObserver(() => {
    checkNavVisibility();
  });

  // Start observing after DOM is ready
  function observeScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
      screenObserver.observe(screen, { attributes: true, attributeFilter: ['class'] });
    });
    checkNavVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(observeScreens, 300));
  } else {
    setTimeout(observeScreens, 300);
  }

})();
