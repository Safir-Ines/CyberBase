export const scenarios = [
  {
    id: 1,
    title: "Phishing Attack",
    badge: "Phishing Master",
    messages: [
      {
        type: "bot",
        text: "👋 Hey there! I'm CyberBot. Ready for your first mission? 🚀"
      },
      {
        type: "bot",
        text: "You just received an email from 'Algérie Poste' saying you have a package waiting, but you need to pay 50 DA for 'customs clearance' via a link. What do you do? 📦"
      }
    ],
    choices: [
      { 
        text: "Click the link and pay, it's just 50 DA", 
        correct: false, 
        feedback: "🛑 Careful! This is a classic phishing trick. Attackers use small amounts to get your credit card details.",
        aiPrompt: "Explain why clicking a link for a small payment like 50 DA in a suspicious email is dangerous."
      },
      { 
        text: "Ignore the email and delete it", 
        correct: false, 
        feedback: "⚠️ Good, but not perfect. If you ignore it, the attacker might target your coworkers next.",
        aiPrompt: "Why is simply ignoring a phishing email less effective than reporting it in an organization?"
      },
      { 
        text: "Report the email as phishing to IT", 
        correct: true, 
        feedback: "✅ Perfect! Reporting helps the security team block the sender for everyone. You're a pro! 🛡️" 
      }
    ],
    explanation: "Always verify the sender's actual email address. Official organizations like Algérie Poste won't ask for payment via suspicious links."
  },
  {
    id: 2,
    title: "Password Security",
    badge: "Password Guardian",
    messages: [
      {
        type: "bot",
        text: "Great job on the last one! Let's talk about passwords. 🔑"
      },
      {
        type: "bot",
        text: "You use a very strong password for your work account. Is it okay to use that same password for your personal Netflix or Facebook? 🍿"
      }
    ],
    choices: [
      { 
        text: "Yes, if it's strong, it's safe everywhere", 
        correct: false, 
        feedback: "❌ Oh no! If Netflix gets hacked, attackers will try that same password on your work account (Credential Stuffing).",
        aiPrompt: "Explain the risks of password reuse even if the password is very complex."
      },
      { 
        text: "No, every account needs a unique password", 
        correct: true, 
        feedback: "✅ Exactly! Use a password manager to keep track of unique passwords. You're guarding the gates! 🏰" 
      }
    ],
    explanation: "Password reuse is one of the leading causes of account takeovers. Use a different password for every service."
  },
  {
    id: 3,
    title: "Public WiFi Risks",
    badge: "Safe Browser",
    messages: [
      {
        type: "bot",
        text: "Last mission for today! You're at a café and see 'Free_Public_WiFi'. You need to access the company's internal HR portal. What's the plan? ☕"
      }
    ],
    choices: [
      { 
        text: "Connect and log in quickly", 
        correct: false, 
        feedback: "🛑 Danger! Public WiFi can be easily spoofed. An attacker could be 'listening' to everything you send.",
        aiPrompt: "What is a 'Man-in-the-Middle' attack on public WiFi?"
      },
      { 
        text: "Connect, but only after turning on the Company VPN", 
        correct: true, 
        feedback: "✅ Smart move! The VPN creates a secure tunnel for your data. You're invisible to hackers! 👻" 
      },
      { 
        text: "Wait until I'm back at the office", 
        correct: true, 
        feedback: "✅ Safest choice! If you don't have a VPN, waiting for a trusted network is the way to go. 🏢" 
      }
    ],
    explanation: "Public WiFi is inherently insecure. Always use a VPN for work-related tasks when off-site."
  },
  {
    id: 4,
    title: "Social Engineering",
    badge: "Voice Guardian",
    messages: [
      {
        type: "bot",
        text: "You receive a call from someone claiming to be 'Samir' from the IT department. He says there's a problem with your workstation and needs your password to fix it remotely. What do you do? 📞"
      }
    ],
    choices: [
      { 
        text: "Give him the password so he can fix it", 
        correct: false, 
        feedback: "🛑 Stop! Real IT departments will NEVER ask for your password over the phone.",
        aiPrompt: "Explain why IT staff don't need your password to perform maintenance."
      },
      { 
        text: "Tell him you'll call him back on the official IT number", 
        correct: true, 
        feedback: "✅ Perfect! Verifying the identity of the caller is the best way to stop social engineering. 📞" 
      }
    ],
    explanation: "Social engineering relies on psychological manipulation. Always verify identity through official channels."
  },
  {
    id: 5,
    title: "The Mysterious USB",
    badge: "Hardware Defender",
    messages: [
      {
        type: "bot",
        text: "You find a USB drive in the office parking lot. It has 'Q4 Finance Reports' written on it. You're curious what's inside. What do you do? 💾"
      }
    ],
    choices: [
      { 
        text: "Plug it into your computer to see who it belongs to", 
        correct: false, 
        feedback: "🛑 DANGER! USB drives can contain malware that executes automatically when plugged in (BadUSB).",
        aiPrompt: "How can a USB drive infect a computer without the user clicking any files?"
      },
      { 
        text: "Hand it over to the Security or IT team", 
        correct: true, 
        feedback: "✅ Excellent! They have isolated machines to safely inspect the drive. You saved the network! 🛡️" 
      }
    ],
    explanation: "Lost USB drives are a common 'baiting' technique used by attackers. Never plug unknown devices into your workstation."
  },
  {
    id: 6,
    title: "Social Media Slip-up",
    badge: "Privacy Shield",
    messages: [
      {
        type: "bot",
        text: "You're proud of your new office setup and want to post a photo on LinkedIn. Your screen is on, and there's a sticky note on your monitor. Is this okay? 📸"
      }
    ],
    choices: [
      { 
        text: "Yes, it looks professional and cool", 
        correct: false, 
        feedback: "❌ Careful! Zooming in on the photo might reveal sensitive code on your screen or the password on that sticky note.",
        aiPrompt: "What is 'Visual Hacking' in the context of social media posts?"
      },
      { 
        text: "Blur the screen and remove any sticky notes first", 
        correct: true, 
        feedback: "✅ Smart! Always do a 'Clean Desk' check before taking photos in a professional environment. 🛡️" 
      }
    ],
    explanation: "Incidental information in photos (screens, badges, notes) can be used by attackers for reconnaissance."
  },
  {
    id: 7,
    title: "Data Leakage",
    badge: "Data Guardian",
    difficulty: "Medium",
    messages: [
      {
        type: "bot",
        text: "You're working on a top-secret project. Your friend at another company asks how it's going and if you can share a 'small snippet' of the code just for 'inspiration'. What's your move? 🤫"
      }
    ],
    choices: [
      { 
        text: "Share a small, non-sensitive part", 
        correct: false, 
        feedback: "🛑 Danger! Even small snippets can reveal architectural secrets or project names. Never share internal code.",
        aiPrompt: "What is IP (Intellectual Property) theft in software development?"
      },
      { 
        text: "Politely decline and explain company policy", 
        correct: true, 
        feedback: "✅ Exactly! Protecting company secrets is part of your role. You're a true professional. 💼" 
      }
    ],
    explanation: "Internal code and project details are company property. Sharing them externally is a major policy violation."
  },
  {
    id: 8,
    title: "Advanced Phishing",
    badge: "Spear Fisher",
    difficulty: "Hard",
    messages: [
      {
        type: "bot",
        text: "You get an email from your 'CEO' (it looks real!) saying he's in a meeting and needs you to buy 5 iTunes gift cards for a client. He'll pay you back tomorrow. Urgent! 🏃‍♂️"
      }
    ],
    choices: [
      { 
        text: "Buy them quickly to impress the boss", 
        correct: false, 
        feedback: "🛑 This is a 'Business Email Compromise' (BEC) attack. CEOs don't ask employees for gift cards.",
        aiPrompt: "Explain the 'CEO Fraud' or BEC phishing technique."
      },
      { 
        text: "Check the sender's email carefully and call the CEO's assistant", 
        correct: true, 
        feedback: "✅ Brilliant! Always verify urgent, unusual requests via a second channel. You just saved thousands! 💸" 
      }
    ],
    explanation: "Attackers use urgency and authority to bypass your critical thinking. Always verify out-of-band."
  },
  {
    id: 9,
    title: "Physical Security",
    badge: "Office Sentinel",
    difficulty: "Easy",
    messages: [
      {
        type: "bot",
        text: "A person in a delivery uniform is holding two large boxes and asks you to 'hold the door' to the secure office area. They don't have a badge visible. What do you do? 📦"
      }
    ],
    choices: [
      { 
        text: "Hold the door, it's the polite thing to do", 
        correct: false, 
        feedback: "🛑 This is 'Tailgating'. Attackers often use disguises to gain physical access to secure areas.",
        aiPrompt: "What is 'Tailgating' or 'Piggybacking' in physical security?"
      },
      { 
        text: "Politely ask them to scan their badge or wait for the receptionist", 
        correct: true, 
        feedback: "✅ Perfect! Physical security is the first line of defense. No badge, no entry! 🛡️" 
      }
    ],
    explanation: "Social norms like 'politeness' are often exploited by attackers. Secure areas must stay secure."
  }
];
