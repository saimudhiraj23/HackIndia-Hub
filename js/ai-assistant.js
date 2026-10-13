/**
 * HACKINDIA HUB - AI HACKATHON & TEAM MATCHER ASSISTANT
 * Interactive conversational assistant that matches students to hackathons,
 * suggests complementary team roles, and gives winning hackathon strategies.
 */

let aiChatHistory = [
  {
    role: "bot",
    text: "Namaste! I am your **HackIndia AI Assistant** 🤖. Tell me your college year, skills, or favorite tech (e.g., *'I'm a 1st year beginner with Python in Hyderabad'*) and I will find your ideal hackathon and team structure!"
  }
];

function initAiAssistant() {
  const container = document.getElementById("aiMessagesContainer");
  if (!container) return;

  renderAiMessages();
}

function renderAiMessages() {
  const container = document.getElementById("aiMessagesContainer");
  if (!container) return;

  container.innerHTML = aiChatHistory.map(msg => `
    <div class="ai-msg ${msg.role}">
      <div class="ai-msg-bubble">
        ${formatAiMessageText(msg.text)}
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function formatAiMessageText(text) {
  // Simple markdown formatting
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return formatted;
}

function toggleAiDrawer() {
  const drawer = document.getElementById("aiAssistantDrawer");
  if (!drawer) return;
  drawer.classList.toggle("active");
  if (drawer.classList.contains("active")) {
    renderAiMessages();
    setTimeout(() => {
      document.getElementById("aiChatInput")?.focus();
    }, 300);
  }
}

function sendAiMessage(promptText) {
  const input = document.getElementById("aiChatInput");
  const query = promptText || (input ? input.value.trim() : "");
  if (!query) return;

  if (input) input.value = "";

  // Append user message
  aiChatHistory.push({ role: "user", text: query });
  renderAiMessages();

  // Generate intelligent response with slight realistic delay
  setTimeout(() => {
    const reply = generateAiResponse(query);
    aiChatHistory.push({ role: "bot", text: reply });
    renderAiMessages();
  }, 400);
}

function generateAiResponse(rawQuery) {
  const q = rawQuery.toLowerCase();

  // Case 1: First-year / Beginner questions
  if (q.includes("beginner") || q.includes("1st year") || q.includes("first year") || q.includes("freshman") || q.includes("first time")) {
    return `🎉 **Great news for Beginners & First-Year Students!**
Here are the top 2 curated hackathons built specifically for learning:

1. **Microsoft Future Ready Student Hackathon** (Online)
   • 💰 ₹8,00,000 Prize Pool • Difficulty: **Beginner**
   • Perks: Free Azure credits ($200) + starter GitHub repos with mentorship!
   • Closes: Oct 22, 2026

2. **VITHack 2026 Marathon** (Hybrid / Vellore)
   • 💰 ₹4,50,000 Prize Pool • Dedicated **"Freshers Spotlight Award"** (₹50,000) reserved exclusively for 1st-year teams.

💡 *Pro Tip for 1st years:* Don't worry about building a full enterprise app! Focus on solving one clear student or campus problem with clean UI and a live working demo.`;
  }

  // Case 2: AI / GenAI / ML query
  if (q.includes("ai") || q.includes("machine learning") || q.includes("llm") || q.includes("genai") || q.includes("deep learning")) {
    return `🧠 **Top AI & Machine Learning Hackathons in India:**

1. **AI Innovation Challenge 2026** (IIT Hyderabad & T-Hub)
   • 💰 ₹5,00,000 Prize Pool • Hybrid
   • Tracks: Vernacular AI for Indian languages, Healthcare AI, and Agritech.
   • Ideal stack: Python, PyTorch, Hugging Face, LangChain.

2. **Bengal AI Vision Summit** (Kolkata & Jadavpur University)
   • 💰 ₹4,00,000 Prize Pool • Computer Vision & Video Analytics.

💡 *Winning AI Idea:* Build a WhatsApp-integrated vernacular voice agent that lets rural workers check government schemes or healthcare triage in Telugu/Hindi.`;
  }

  // Case 3: Blockchain / Web3 query
  if (q.includes("web3") || q.includes("blockchain") || q.includes("crypto") || q.includes("solidity") || q.includes("eth")) {
    return `⚡ **Premier Web3 Hackathon:**

• **ETHIndia Bengaluru 2026** (Nov 6–8 at KTPO Whitefield)
  • 💰 ₹25,00,000+ Prize Pool • Asia's largest Ethereum event.
  • Bounties from Polygon, Arbitrum, Base, and ENS.
  • Looking for team members? Check the **Teams Tab**; Sneha Reddy from BMSCE is looking for a Solidity developer right now!`;
  }

  // Case 4: City based (Hyderabad, Bengaluru, Delhi, etc.)
  if (q.includes("hyderabad")) {
    return `📍 **Top Hackathons in Hyderabad:**
• **AI Innovation Challenge 2026** (IIT Hyderabad & T-Hub) — Hybrid, ₹5 Lakhs prize.
• **Telangana Cyber Security Grand Challenge** (Pending Verification approval).
• You can switch to **Map View** to see all 14 active hackathons in Telangana!`;
  }

  if (q.includes("bengaluru") || q.includes("bangalore")) {
    return `📍 **Top Hackathons in Bengaluru (Silicon Valley of India):**
• **ETHIndia Bengaluru 2026** — ₹25 Lakhs+ at KTPO Whitefield.
• **Bengaluru HealthTech Sprint** (IISc & Narayana Health) — ₹6 Lakhs AI for Medicine hackathon.
• 28 total events listed in Karnataka on the interactive map!`;
  }

  // Case 5: Team formation advice
  if (q.includes("team") || q.includes("complementary") || q.includes("squad") || q.includes("roles")) {
    return `👥 **The Golden 4-Person Hackathon Dream Team Formula:**

1. **Frontend Lead (UI/UX)**: React/Next.js/Tailwind — builds the polished demo the judges see.
2. **Backend & Cloud Architect**: Python/FastAPI/Node.js — handles databases, APIs, and auth.
3. **Core Domain Specialist**: AI/ML prompt engineer, smart contract coder, or hardware engineer.
4. **Product Lead & Pitcher**: Builds the slide deck, defines user stories, and delivers the 3-minute winning demo.

👉 Want teammates right now? Click **Teams** in the top navigation to post or join an active squad!`;
  }

  // Case 6: What should I build / Strategy to win
  if (q.includes("build") || q.includes("win") || q.includes("idea") || q.includes("strategy")) {
    return `🏆 **How Top Student Teams Win Indian Hackathons:**

1. **Focus on Indian Context (Bharat-first)**: Judges love vernacular voice support, low-bandwidth resilience, and offline-first UPI integration.
2. **Never Show Slide-Only Presentations**: Have a clickable prototype ready even if it's running on localhost. A 30-second live demo beats 20 slides.
3. **Keep the Scope Tight**: Build 1 feature that works 100% reliably instead of 5 half-broken pages.
4. **Prepare the 3-Minute Hook**: "The problem in India is X, existing tools fail because of Y, here is our 1-click solution Z."`;
  }

  // Default fallback recommendation using student's profile
  const userCity = currentUserProfile ? currentUserProfile.city : "India";
  const userBranch = currentUserProfile ? currentUserProfile.branch : "Tech";
  return `✨ Based on your profile (${userBranch} student in ${userCity}):
I recommend checking out **Smart India Hackathon (SIH 2026)** with ₹1 Crore in total prizes, or **AI Innovation Challenge 2026** in Hyderabad.

Would you like advice on **team formation**, **beginner-friendly tracks**, or **winning project ideas**?`;
}

function openAiMatcherWithProfile() {
  toggleAiDrawer();
  const year = currentUserProfile?.year || "2nd Year";
  const college = currentUserProfile?.college || "Engineering College";
  const city = currentUserProfile?.city || "Hyderabad";
  const skills = (currentUserProfile?.skills || ["Python", "AI", "Web"]).slice(0, 3).join(", ");
  const summary = `I'm a ${year} student from ${college} in ${city}. My skills are ${skills}. Which hackathons suit me best?`;
  sendAiMessage(summary);
}
