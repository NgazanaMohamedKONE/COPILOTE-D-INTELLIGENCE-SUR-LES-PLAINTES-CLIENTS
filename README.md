# COPILOTE-D-INTELLIGENCE-SUR-LES-PLAINTES-CLIENTS



Complaintscope 🛡️🤖
Copilote d'Intelligence Exécutive, de Gestion des Plaintes & de Détection des Risques

Complaintscope est une plateforme analytique d'entreprise conçue pour les directions du risque, de la conformité et de l'expérience client. Elle permet de superviser en temps réel les réclamations bancaires et financières (issues des flux CFPB/interne), d'anticiper le risque d'attrition client ( Churn ), de détecter automatiquement les anomalies financières et de dialoguer avec un Copilote IA RAG alimenté par Google Gemini .

🌟 Fonctionnalités Clés
📊 Tableau de Bord Stratégique

Métriques de haut niveau : Volume global, urgences critiques (<24h), taux de résolution (85%), délai moyen, score de satisfaction et indice de confiance IA.
Vues chronologiques (journalières & mensuelles) et cartographie des zones réseau à fort volume.
Filtrage multicritère intelligent (Critiques, Clients VIP, Churn > 60%, Anomalies).
🧠 Copilote IA RAG (Génération augmentée par récupération)

Intégration de l'API Google Gemini 2.5 Flash avec moteur RAG personnalisé.
Extraction de contexte pertinente par mots-clés et partitions sémantiques.
Citations interactives et cliquables vers les fiches de plaintes ( CFPB-2026-XXXX).
Questions suggérées en un clic et mode secours intelligent local.
🌐 Support Multilingue (FR/EN)

Basculement dynamique instantané entre Français et Anglais (conservé en mémoire locale).
🚨 Détection d'Anomalies & Gestion des Risques

Identification automatique des erreurs système (ex : doublons de prélèvement, bogues d'application mobile, erreurs d'agios).
Calcul prédictif du risque d'attrition client (Churn Risk) avec alertes prioritaires pour les comptes VIP.
📥 Importation & Qualité des Données

Assistant d'importation de fichiers CSV / JSON avec nettoyage automatique par IA.
📄 Rapports & Conformité (Piste d'Audit)

Génération et exportation de rapports exécutifs.
Journal de traçabilité complet (Audit Log) garantissant la conformité réglementaire.
🎨 Interface & Typographie Soignée

Typographie professionnelle Plus Jakarta Sans pour l'interface et JetBrains Mono pour les identifiants et données financières.
Mode sombre / clair adaptable.
🛠️ Technique d'empilement
Frontend : React 18, Vite, TypeScript, Tailwind CSS v4, Lucide React, Recharts.
Backend & Serveur : Node.js, Express.js (Mode mixte Dev Vite / Prod CJS).
Intelligence Artificielle : Google Gemini API ( @google/genai) avec modèle gemini-2.5-flash.
Internationalisation : Contexte React personnalisé ( LanguageContext).
🚀 Installation et Lancement
Prérequis
Node.js (version 18+ recommandée)
npm (ou yarn / pnpm)
1. Cloner le projet et installer les dépendances
npm install
2. Configuration des variables d'environnement
Créez un fichier .envà la racine (ou inspirez-vous de .env.example) :

GEMINI_API_KEY=votre_cle_api_gemini
3. Lancer l'application en mode Développement
npm run dev
L'application sera accessible sur http://localhost:3000.

4. Build et Lancement en Production
npm run build
npm start
📁 Structure du projet
├── src/
│   ├── components/         # Composants React (Navbar, Sidebar, Dashboard, Copilot, etc.)
│   ├── data/               # Jeu de données de démonstration (Mock Complaints, Alerts)
│   ├── i18n/               # Gestion des traductions (translations.tsx - FR/EN)
│   ├── types.ts            # Définitions des types TypeScript
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée React
│   └── index.css           # Styles globaux & configuration Tailwind v4
├── server.ts               # Serveur Express & Moteur RAG / API Gemini
├── index.html              # Fichier HTML principal avec import des polices
├── package.json            # Dépendances et scripts de build
└── README.md               # Documentation du projet
🔒 Sécurité & Confidentialité
Toutes les requêtes vers l'API Gemini transitent exclusivement par le serveur backend ( /api/copilot/chat) afin de préserver la sécurité de la clé d'API GEMINI_API_KEYet d'éviter toute exposition côté navigateur.

📝 Licence
Projet sous licence MIT.
