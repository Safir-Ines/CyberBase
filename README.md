# 🛡️ CyberBase Cockpit
### **Enterprise Security Governance & Maturity Operating System**

CyberBase is a premium, high-fidelity cybersecurity cockpit designed to unify organizational security maturity, asset intelligence, and employee awareness into a single monolithic interface. Engineered with a professional "Intelligence Cockpit" aesthetic, the platform provides decision-ready intelligence for executive leadership while equipping technical teams with advanced discovery and remediation tools.

---

## 💎 The "Intelligence Cockpit" Experience

CyberBase has been meticulously restyled to provide a premium, state-of-the-art user experience:
*   **Unified Cyber Blue Palette**: A cohesive dark-theme design system centered around `#0f172a` (Cyber Blue), optimized for low-fatigue, high-focus operations.
*   **Glassmorphic UI**: High-end translucent interfaces with intense backdrop-blur, refined borders, and professional depth.
*   **Motion-Driven Intelligence**: Fluid Framer Motion animations provide real-time feedback and smooth transitions between telemetry modules.
*   **Functional Global Command**: Integrated header with real-time Search, functional Intelligence Notifications, and role-aware User Menu.

---

## 🛠️ System Overview

The platform operates through three specialized interfaces tailored to organizational roles:

*   **Executive Cockpit (CEO)**: High-level maturity scoring, strategic risk distribution, and automated ROI-focused recommendations.
*   **Operational Command (IT Manager)**: Advanced network scanning, multi-dimensional asset anomaly detection, and centralized risk management.
*   **Awareness Academy (Employee)**: Interactive, gamified training modules designed to cultivate a security-first culture through simulation.

---

## 🚀 Deployment & Setup

CyberBase is designed for rapid deployment. By default, the system initializes in **High-Fidelity Demo Mode**, utilizing an optimized in-memory data engine for immediate evaluation.

### Prerequisites
*   **Node.js** (v18.0.0 or higher)
*   **npm** (v9.0.0 or higher)

### Installation

1.  **Clone and Prepare**
    ```bash
    git clone <repository-url>
    cd cybercockpit
    ```

2.  **Initialize Backend**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

3.  **Initialize Frontend**
    ```bash
    # Open a secondary terminal
    cd frontend
    npm install
    npm start
    ```

### Access Credentials (Pre-seeded)
| Organizational Role | Authentication Email | Password |
|---|---|---|
| **Chief Executive Officer** | `ceo@acme.com` | `password123` |
| **IT Infrastructure Manager** | `manager@acme.com` | `password123` |
| **Standard Employee** | `employee1@acme.com` | `password123` |

---

## 🕵️ Core Intelligence Capabilities

### Shadow-IT Mismatch Matrix
The platform implements a proprietary discovery logic: `Detected Assets - Registered Inventory = Rogue Threats`. This surfaces unauthorized hardware through an animated radar-scan interface, automatically integrating critical vulnerabilities into the risk management workflow.

### Anomaly Intelligence Engine
Assets are analyzed across five dimensions of deviation:
*   **Type Rarity**: Statistical frequency of asset classes.
*   **Criticality Shift**: Deviations in expected importance.
*   **Owner Outlier**: Behavioral anomalies in asset assignment.
*   **Shadow Status**: Real-time registration verification.
*   **System Staleness**: Automated lifecycle and update monitoring.

### ⚖️ Regulatory Alignment (Law 18-07)
Architected to meet the requirements of cybersecurity governance frameworks:
*   **Granular RBAC**: Strict role-based access control for data integrity.
*   **Auditability**: Comprehensive logging of intelligence alerts and risk mitigations.
*   **Intelligence Transparency**: Embedded formula tooltips and "Why" sections explain the logic behind every auto-generated recommendation.

---

## 🏗️ Technical Architecture
*   **Frontend**: React.js with Framer Motion and Recharts.
*   **Backend**: Node.js and Express.
*   **Intelligence Layer**: Service-oriented architecture for risk scoring and network simulation.
*   **Storage**: Hybrid support for MongoDB (Production) and In-Memory (Evaluation).

> [!TIP]
> For a deep dive into the system design, component interactions, and data flow diagrams, see the [Architecture Overview](docs/ARCHITECTURE.md).

---

## 📈 Operational Walkthrough

1.  **Evaluation Phase**: Authenticate as `manager@acme.com` and execute a **Network Scan**. Observe how rogue devices are identified and automatically escalated to the **Risk Matrix**.
2.  **Intelligence Phase**: Explore the **Asset Map** to view multi-dimensional anomaly scores and their plain-language explanations.
3.  **Governance Phase**: Authenticate as `ceo@acme.com` to review the **Maturity Scorecard** and strategically evaluate auto-generated recommendations.
4.  **Training Phase**: Authenticate as `employee1@acme.com` to engage with the **Academy Hub** and complete a security simulation.

---
