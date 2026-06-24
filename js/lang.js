// js/lang.js
import { BASE_LOCALES, I18N, LOCALE_OVERRIDES } from "./i18n.js";

const KEY = "nanoker-lang";
const SEO_BASE_URL = "https://nanoker.com";
const SEO_DEFAULT_IMAGE = `${SEO_BASE_URL}/img/og/og-default.png`;
const SUPPORTED_LANGS = ["es", "en", "fr", "de", "it"];
const DEFAULT_LANG = "en";
const SEO_PAGE_CONFIG = {
  "/": { titleKey: "seo.home.metaTitle", descriptionKey: "seo.home.metaDescription" },
  "/index.html": { titleKey: "seo.home.metaTitle", descriptionKey: "seo.home.metaDescription" },
  "/empresa.html": {
    titleKey: "seo.company.metaTitle",
    descriptionKey: "seo.company.metaDescription",
  },
  "/capacidades.html": {
    titleKey: "seo.capabilities.metaTitle",
    descriptionKey: "seo.capabilities.metaDescription",
  },
  "/materiales.html": {
    titleKey: "seo.materials.metaTitle",
    descriptionKey: "seo.materials.metaDescription",
  },
  "/sectores.html": {
    titleKey: "seo.sectors.metaTitle",
    descriptionKey: "seo.sectors.metaDescription",
  },
  "/id.html": { titleKey: "seo.rnd.metaTitle", descriptionKey: "seo.rnd.metaDescription" },
  "/contacto.html": {
    titleKey: "seo.contact.metaTitle",
    descriptionKey: "seo.contact.metaDescription",
  },
  "/evaluacion-tecnica.html": {
    titleKey: "seo.evaluation.metaTitle",
    descriptionKey: "seo.evaluation.metaDescription",
  },
  "/certifications.html": {
    titleKey: "seo.certifications.metaTitle",
    descriptionKey: "seo.certifications.metaDescription",
  },
  "/privacy.html": {
    titleKey: "seo.privacy.metaTitle",
    descriptionKey: "seo.privacy.metaDescription",
  },
  "/cookies.html": {
    titleKey: "seo.cookies.metaTitle",
    descriptionKey: "seo.cookies.metaDescription",
  },
  "/legal-notice.html": {
    titleKey: "seo.legalNotice.metaTitle",
    descriptionKey: "seo.legalNotice.metaDescription",
  },
  "/publicidad-proyectos-idi/": {
    titleKey: "seo.publicProjects.metaTitle",
    descriptionKey: "seo.publicProjects.metaDescription",
  },
  "/publicidad-proyectos-idi/index.html": {
    titleKey: "seo.publicProjects.metaTitle",
    descriptionKey: "seo.publicProjects.metaDescription",
  },
};
const SEO_LOCALES = {
  es: { og: "es_ES", alternates: ["en_US", "fr_FR", "de_DE", "it_IT"] },
  en: { og: "en_US", alternates: ["es_ES", "fr_FR", "de_DE", "it_IT"] },
  fr: { og: "fr_FR", alternates: ["en_US", "es_ES", "de_DE", "it_IT"] },
  de: { og: "de_DE", alternates: ["en_US", "es_ES", "fr_FR", "it_IT"] },
  it: { og: "it_IT", alternates: ["en_US", "es_ES", "fr_FR", "de_DE"] },
};

// Normaliza: "es-ES" -> "es"
function normalizeLang(raw) {
  const base = String(raw || "").toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.includes(base) ? base : DEFAULT_LANG;
}

function getLangFromUrl() {
  try {
    const raw = new URLSearchParams(window.location.search).get("lang");
    if (!raw) return null;
    const normalizedRaw = String(raw).toLowerCase();
    if (!SUPPORTED_LANGS.includes(normalizedRaw)) return null;
    return normalizeLang(normalizedRaw);
  } catch (_error) {
    return null;
  }
}

function safeGetStoredLang() {
  try {
    return localStorage.getItem(KEY);
  } catch (_error) {
    return null;
  }
}

function safeSetStoredLang(lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch (_error) {
    // Ignore storage write errors (private mode / disabled storage).
  }
}

const initialDocLang =
  document.documentElement.getAttribute("data-lang") ||
  document.documentElement.lang;

let current = normalizeLang(getLangFromUrl() || safeGetStoredLang() || initialDocLang || navigator.language);
if (!I18N[current]) current = DEFAULT_LANG;

let domObserver = null;
let hasBoundNoopHashGuard = false;
let hasInitializedCookieBanner = false;

const COOKIE_CONSENT_KEY = "cookieConsent";
const COOKIE_CONSENT_VALUES = new Set(["accepted", "rejected"]);

export function getLang() {
  return current;
}

function getValueByPath(locale, path) {
  return String(path || "")
    .split(".")
    .reduce((obj, key) => (obj && typeof obj === "object" ? obj[key] : undefined), locale);
}

function hasExplicitLocaleValue(lang, path) {
  if (!LOCALE_OVERRIDES[lang]) return false;
  const value = getValueByPath(LOCALE_OVERRIDES[lang], path);
  return value !== undefined;
}

function preserveCase(source, translated) {
  if (!source || !translated) return translated;
  if (source === source.toUpperCase()) return translated.toUpperCase();
  if (source[0] === source[0].toUpperCase()) {
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }
  return translated;
}

const AUTO_TRANSLATION_RULES = {
  fr: {
    phrases: [
      ["DeepTech Materials for Critical Industries", "Matériaux DeepTech pour les industries critiques"],
      [
        "Nanoker is an industrial platform for advanced materials and high-specification components in sectors where qualification cycles are long, failure is expensive, and supply continuity is strategic.",
        "Nanoker est une plateforme industrielle pour les matériaux avancés et les composants à haute spécification dans des secteurs où les cycles de qualification sont longs, où l'échec est coûteux et où la continuité d'approvisionnement est stratégique.",
      ],
      [
        "Material control defines performance, qualification risk and industrial scalability in critical technologies.",
        "La maîtrise des matériaux définit la performance, le risque de qualification et l'évolutivité industrielle dans les technologies critiques.",
      ],
      [
        "Advanced materials for industries where reliability depends on controlling material functionality.",
        "Matériaux avancés pour les secteurs où la fiabilité dépend du contrôle de la fonctionnalité du matériau.",
      ],
      [
        "Nanoker combines crystal growth, densification, precision machining and metrology in one industrial flow to deliver specification control, repeatability and scalable output for critical applications.",
        "Nanoker combine croissance cristalline, densification, usinage de précision et métrologie dans un flux industriel intégré afin d'assurer le contrôle des spécifications, la répétabilité et une production évolutive pour les applications critiques.",
      ],
      [
        "Access to and browsing of this site grants the status of user and implies acceptance of this legal notice. Users agree to make appropriate use of the site, its contents, and the services available in accordance with the law, good faith, and public order.",
        "L'accès et la navigation sur ce site confèrent la qualité d'utilisateur et impliquent l'acceptation des présentes mentions légales. Les utilisateurs s'engagent à faire un usage approprié du site, de ses contenus et des services disponibles conformément à la loi, à la bonne foi et à l'ordre public.",
      ],
      [
        "Cookies are small files downloaded to the user's device when accessing a website. They are used to store and retrieve information about browsing activity, remember preferences, or enable certain technical services.",
        "Les cookies sont de petits fichiers téléchargés sur l'appareil de l'utilisateur lors de l'accès à un site web. Ils servent à stocker et récupérer des informations sur l'activité de navigation, à mémoriser des préférences ou à activer certains services techniques.",
      ],
      [
        "Tell us about your application and let us work together on the material architecture that makes it viable.",
        "Parlez-nous de votre application et travaillons ensemble sur l'architecture matière qui la rend viable.",
      ],
      [
        "Architecting the invisible layer of innovation.",
        "Nous architecturons la couche invisible de l'innovation.",
      ],
      ["European Sovereignty in Advanced Materials.", "Souveraineté européenne dans les matériaux avancés."],
      ["2. Terms of Use", "2. Conditions d'utilisation"],
      [
        "Design, development and industrial manufacturing of advanced technical materials.",
        "Conception, développement et fabrication industrielle de matériaux techniques avancés.",
      ],
      [
        "Request a technical assessment for critical technologies and align material architecture, engineering execution and validation roadmap with Nanoker experts.",
        "Demandez une évaluation technique pour des technologies critiques et alignez l'architecture matière, l'exécution d'ingénierie et la feuille de route de validation avec les experts de Nanoker.",
      ],
      ["Select the areas where you need support.", "Sélectionnez les domaines où vous avez besoin d'accompagnement."],
      ["Qualification-ready documentation and traceability", "Documentation prête pour la qualification et traçabilité"],
      ["Manufacture advanced ceramic and crystal-based components", "Fabriquer des composants céramiques avancés et à base cristalline"],
      ["Integrate processing, metrology and qualification logic", "Intégrer les procédés, la métrologie et la logique de qualification"],
      ["Support European OEMs in long-cycle critical applications", "Accompagner les OEM européens dans des applications critiques à cycle long"],
      [
        "Nanoker integrates advanced capabilities in single-crystal diamond growth and atomic-scale doping control, expanding the portfolio toward next-generation quantum, thermal, and semiconductor applications.",
        "Nanoker intègre des capacités avancées en croissance de diamant monocristallin et en contrôle du dopage à l'échelle atomique, élargissant le portefeuille vers des applications quantiques, thermiques et semi-conductrices de nouvelle génération.",
      ],
      ["Progressive qualification routes aligned with sector requirements", "Parcours de qualification progressifs alignés sur les exigences sectorielles"],
      [
        "Europe cannot lead in advanced semiconductors, quantum technologies or defense systems without controlling the materials and process know-how that enable them.<br />Nanoker is building part of that industrial foundation.",
        "L'Europe ne peut pas être leader dans les semi-conducteurs avancés, les technologies quantiques ou les systèmes de défense sans maîtriser les matériaux et le savoir-faire procédé qui les rendent possibles.<br />Nanoker construit une partie de cette base industrielle.",
      ],
      [
        "Europe cannot lead in advanced semiconductors, quantum technologies or defense systems without controlling the materials and process know-how that enable them.",
        "L'Europe ne peut pas être leader dans les semi-conducteurs avancés, les technologies quantiques ou les systèmes de défense sans maîtriser les matériaux et le savoir-faire procédé qui les rendent possibles.",
      ],
      ["Nanoker is building part of that industrial foundation.", "Nanoker construit une partie de cette base industrielle."],
      [
        "Our industrial platform covers the full process chain required to move from material design to qualified part:",
        "Notre plateforme industrielle couvre l'ensemble de la chaîne de procédé nécessaire pour passer de la conception matière à une pièce qualifiée :",
      ],
      ["3. Advanced densification", "3. Densification avancée"],
      ["7. Qualification and scale-up", "7. Qualification et montée en cadence"],
      [
        "Vertical integration reduces handoff risk, compresses qualification loops and limits quality variability.",
        "L'intégration verticale réduit le risque de transfert, raccourcit les boucles de qualification et limite la variabilité qualité.",
      ],
      ["Optimization for SPS/HIP and crystal-growth routes", "Optimisation pour les voies SPS/HIP et de croissance cristalline"],
      [
        "The material is engineered around the application and process window, not adapted afterward.",
        "Le matériau est conçu autour de l'application et de la fenêtre de procédé, et non adapté a posteriori.",
      ],
      ["Advanced growth technologies", "Technologies de croissance avancées"],
      ["Advanced Densification", "Densification avancée"],
      ["Process control from precursor engineering to qualified component.", "Contrôle du procédé depuis l'ingénierie des précurseurs jusqu'au composant qualifié."],
      [
        "Environmental management of advanced materials manufacturing and associated industrial services.",
        "Gestion environnementale de la fabrication de matériaux avancés et des services industriels associés.",
      ],
      ["Select one or more categories.", "Sélectionnez une ou plusieurs catégories."],
      ["We need these details to coordinate a technical session.", "Nous avons besoin de ces informations pour coordonner une session technique."],
      ["Full control of process, metrology and QA/QC.", "Contrôle complet du procédé, de la métrologie et de la QA/QC."],
      ["industrial platform", "plateforme industrielle"],
      ["advanced materials", "matériaux avancés"],
      ["critical technologies", "technologies critiques"],
      ["critical applications", "applications critiques"],
      ["technical evaluation", "évaluation technique"],
      ["technical request", "demande technique"],
      ["technical contact", "contact technique"],
      ["technical assessment", "évaluation technique"],
      ["engineering needs", "besoins d'ingénierie"],
      ["material/component selection", "sélection matériau/composant"],
      ["performance optimization", "optimisation des performances"],
      ["validation/testing", "validation/tests"],
      ["scale-up / industrialization", "montée en cadence / industrialisation"],
      ["batch-to-batch", "lot à lot"],
      ["qualification-ready", "prêt pour la qualification"],
      ["critical-to-quality", "critique pour la qualité"],
      ["proof of concept", "preuve de concept"],
      ["ready-to-process", "prêt pour le procédé"],
      ["ready-to-device", "prêt pour le dispositif"],
      ["end-to-end vertical integration", "intégration verticale de bout en bout"],
      ["qualification-driven lock-in", "ancrage piloté par la qualification"],
      ["next-generation", "nouvelle génération"],
      ["long-cycle", "à cycle long"],
      ["advanced-material", "matériau avancé"],
      ["process-capability", "capabilité procédé"],
      ["atomic-scale", "à l'échelle atomique"],
      ["guided assessment", "évaluation guidée"],
      ["industrial capabilities", "capacités industrielles"],
      ["integrated industrial capabilities", "capacités industrielles intégrées"],
      ["vertical integration architecture", "architecture d'intégration verticale"],
      ["process control", "contrôle du procédé"],
      ["process window", "fenêtre de procédé"],
      ["process windows", "fenêtres de procédé"],
      ["precision machining", "usinage de précision"],
      ["surface finishing", "finition de surface"],
      ["quality management system", "système de management de la qualité"],
      ["environmental management system", "système de management environnemental"],
      ["full traceability", "traçabilité complète"],
      ["industrial scalability", "évolutivité industrielle"],
      ["supply continuity", "continuité d'approvisionnement"],
      ["supply resilience", "résilience d'approvisionnement"],
      ["qualification logic", "logique de qualification"],
      ["qualification cycles", "cycles de qualification"],
      ["qualified component", "composant qualifié"],
      ["qualified data", "données qualifiées"],
      ["industrial execution", "exécution industrielle"],
      ["industrial scale-up", "montée en cadence industrielle"],
      ["industrial scale", "échelle industrielle"],
      ["critical programs", "programmes critiques"],
      ["strategic sectors", "secteurs stratégiques"],
      ["strategic technologies", "technologies stratégiques"],
      ["European sovereignty", "souveraineté européenne"],
      ["European industrial", "industriel européen"],
      ["European energy", "énergie européenne"],
      ["high specification", "haute spécification"],
      ["high-specification", "haute spécification"],
      ["high purity", "haute pureté"],
      ["single-crystal", "monocristallin"],
      ["surface engineering", "ingénierie de surface"],
      ["metrology", "métrologie"],
      ["validation plan", "plan de validation"],
      ["success criteria", "critères de succès"],
      ["industrial manufacturing", "fabrication industrielle"],
      ["operating conditions", "conditions d'exploitation"],
      ["operating environment", "environnement d'utilisation"],
      ["customer roadmap", "feuille de route client"],
      ["material architecture", "architecture matière"],
      ["material functionality", "fonctionnalité du matériau"],
      ["industrial readiness", "préparation industrielle"],
      ["technical rigor", "rigueur technique"],
      ["continuous improvement", "amélioration continue"],
      ["occupational safety", "sécurité au travail"],
      ["information security", "sécurité de l'information"],
      ["ethics and compliance", "éthique et conformité"],
      ["equality and diversity", "égalité et diversité"],
      ["legal notice", "mentions légales"],
      ["privacy policy", "politique de confidentialité"],
      ["cookie policy", "politique de cookies"],
      ["last updated", "dernière mise à jour"],
      ["legal basis", "base légale"],
      ["data retention", "conservation des données"],
      ["user rights", "droits de l'utilisateur"],
      ["customer satisfaction survey", "enquête de satisfaction client"],
      ["fill out form", "remplir le formulaire"],
      ["view document", "voir le document"],
      ["download certificate", "télécharger le certificat"],
      ["Whoever controls the material controls the technology.", "Qui maîtrise le matériau maîtrise la technologie."],
    ],
    words: {
      the: "le", and: "et", to: "à", for: "pour", with: "avec", from: "de", of: "de", in: "dans",
      on: "sur", under: "selon", as: "comme", if: "si", is: "est", are: "sont", be: "être", been: "été",
      being: "étant", it: "il", its: "ses", this: "ce", that: "cela", these: "ces", those: "ceux-là",
      we: "nous", our: "notre", you: "vous", your: "votre", they: "ils", them: "eux", their: "leur",
      all: "tous", any: "tout", more: "plus", one: "un", where: "où", when: "quand", which: "qui",
      what: "quoi", how: "comment", why: "pourquoi", can: "peut", may: "peut", must: "doit",
      will: "va", should: "doit", would: "serait", could: "pourrait", please: "veuillez",
      provide: "fournir", required: "obligatoires", details: "détails", work: "travail",
      works: "fonctionne", working: "fonctionnement", lead: "mener", leads: "mène",
      depends: "dépend", define: "définir", defines: "définit", build: "construire",
      builds: "construit", built: "construit", make: "faire", makes: "rend", agree: "acceptent",
      acceptance: "acceptation", implies: "implique", grants: "confère", status: "statut",
      users: "utilisateurs", user: "utilisateur", contents: "contenus", appropriate: "approprié",
      accordance: "conformité", law: "loi", good: "bonne", faith: "foi", public: "public",
      order: "ordre", small: "petits", accessing: "accédant", used: "utilisés",
      store: "stocker", retrieve: "récupérer", about: "sur", activity: "activité",
      remember: "mémoriser", preferences: "préférences", enable: "activer", certain: "certains",
      categories: "catégories", need: "besoin", coordinate: "coordonner", session: "session",
      full: "complet", tell: "parlez", let: "laissez", together: "ensemble", viable: "viable",
      architecting: "architecturer", invisible: "invisible", layer: "couche", select: "sélectionnez",
      failure: "échec", expensive: "coûteux", risk: "risque",
      controlling: "maîtrise", combines: "combine", flow: "flux", advanceds: "avancés",
      areas: "domaines", assessment: "évaluation", execution: "exécution", experts: "experts",
      optimization: "optimisation", testing: "tests", purity: "pureté", documentation: "documentation",
      manufacture: "fabriquer", develop: "développer", proprietary: "propriétaires", formulations: "formulations",
      routes: "voies", expanding: "élargissant", toward: "vers", portfolio: "portefeuille", low: "faible",
      carbon: "carbone", intensity: "intensité", provides: "fournit", covers: "couvre", move: "passer",
      reduces: "réduit", compresses: "compresse", limits: "limite", around: "autour de", adapted: "adapté",
      afterward: "ensuite", workflows: "flux de travail", months: "mois", depending: "selon", fit: "s'adapter",
      result: "résultat", tighter: "plus serré", defensible: "défendable", bridge: "relier", creates: "crée",
      survive: "survivre", convert: "convertir", proof: "preuve", concept: "concept", manufacturable: "industrialisables",
      repeatable: "répétable", ability: "capacité", secured: "sécurisé", only: "seulement", foundation: "fondation",
      whoever: "qui", oems: "OEM", know: "savoir", "know-how": "savoir-faire",
      home: "accueil",
      company: "entreprise", capabilities: "capacités", capability: "capacité", materials: "matériaux",
      sectors: "secteurs", contact: "contact", evaluation: "évaluation", guided: "guidée",
      research: "recherche", innovation: "innovation", industrial: "industriel", integrated: "intégré",
      platform: "plateforme", applications: "applications", application: "application",
      components: "composants", component: "composant", specification: "spécification",
      specifications: "spécifications", guaranteed: "garantie", guaranteeds: "garanties",
      traceability: "traçabilité", repeatability: "répétabilité", output: "production",
      scalability: "évolutivité", scale: "échelle", supply: "approvisionnement", chain: "chaîne",
      continuity: "continuité", strategic: "stratégique", quality: "qualité", system: "système",
      systems: "systèmes", operational: "opérationnel", policy: "politique", cookies: "cookies",
      legal: "légal", notice: "notice", terms: "conditions", use: "utilisation", privacy: "confidentialité",
      rights: "droits", security: "sécurité", information: "information", equality: "égalité",
      diversity: "diversité", sustainability: "durabilité", certifications: "certifications",
      form: "formulaire", submit: "envoyer", send: "envoyer", sending: "envoi", continue: "continuer",
      back: "retour", name: "nom", companys: "entreprises", email: "e-mail", phone: "téléphone",
      country: "pays", project: "projet", description: "description", brief: "brève", request: "demande",
      type: "type", current: "actuel", situation: "situation", phase: "phase", estimated: "estimée",
      quantity: "quantité", approximate: "approximatives", dimensions: "dimensions", exact: "exactes",
      technology: "technologie", environment: "environnement", sector: "secteur", operating: "fonctionnement",
      temperature: "température", function: "fonction", main: "principale", material: "matériau",
      considered: "envisagé", upload: "téléverser", files: "fichiers", optional: "optionnel",
      manufacturing: "fabrication", selection: "sélection", development: "développement",
      quotation: "devis", inquiry: "consultation", technical: "technique", drawings: "plans",
      model: "modèle", existing: "existante", part: "pièce", defined: "définies", requirements: "exigences",
      idea: "idée", prototype: "prototype", serial: "série", production: "production",
      improvement: "amélioration", batch: "lot", not: "non", yet: "encore", dimensionss: "dimensions",
      optics: "optique", photonics: "photonique", energy: "énergie", electronics: "électronique",
      industry: "industrie", machinery: "machines", aerospace: "aéronautique", space: "spatial",
      medical: "médical", biotechnology: "biotechnologie", scientific: "scientifique", vacuum: "vide",
      chemical: "chimique", corrosive: "corrosif", wear: "usure", abrasion: "abrasion",
      semiconductors: "semi-conducteurs", high: "haute", hardness: "dureté", electrical: "électrique",
      insulation: "isolation", resistance: "résistance", mechanical: "mécanique", structural: "structurelle",
      friction: "friction", tribological: "tribologiques", thermal: "thermique", conductivity: "conductivité",
      dimensional: "dimensionnelle", stability: "stabilité", precision: "précision", biocompatibility: "biocompatibilité",
      optical: "optique", other: "autre", sapphire: "saphir", silicon: "silicium", carbide: "carbure",
      wafers: "plaquettes", opticss: "optiques", alumina: "alumine", zirconia: "zircone", boron: "bore",
      aluminum: "aluminium", nitride: "nitrure", ceramic: "céramique", ceramics: "céramiques",
      nanocomposites: "nanocomposites", unsure: "incertain", guidance: "conseil", title: "titre",
      subtitle: "sous-titre", text: "texte", item: "élément", process: "procédé", control: "contrôle",
      controls: "contrôles", management: "gestion", architecture: "architecture", risks: "risques",
      validation: "validation", pathways: "voies", critical: "critiques", decisions: "décisions",
      reliability: "fiabilité", objectives: "objectifs", constraints: "contraintes",
      propose: "proposer", plan: "plan", measurable: "mesurables", milestones: "jalons",
      deliver: "livrer", recommendations: "recommandations", weeks: "semaines", quarters: "trimestres",
      survey: "enquête", available: "disponibles", certificates: "certificats", access: "accès",
      complete: "compléter", close: "fermer", open: "ouvrir", tab: "onglet", download: "télécharger",
      downloaded: "téléchargés", device: "appareil", website: "site web", site: "site",
      browsing: "navigation", introduction: "introduction", commitment: "engagement", scope: "portée",
      related: "associé", standard: "norme", valid: "valide", number: "numéro", body: "organisme",
      strategics: "stratégiques", european: "européen", customer: "client", clients: "clients",
      roadmap: "feuille de route", readiness: "préparation", performance: "performance",
      processes: "processus", growth: "croissance", crystal: "cristal", engineering: "ingénierie",
      surface: "surface", support: "support", growths: "croissances", densification: "densification",
      finishing: "finition", polishing: "polissage", qualification: "qualification",
      qualified: "qualifié", scaling: "montée en cadence", pureza: "pureté"
    },
  },
  de: {
    phrases: [
      ["DeepTech Materials for Critical Industries", "DeepTech-Materialien für kritische Industrien"],
      [
        "Nanoker is an industrial platform for advanced materials and high-specification components in sectors where qualification cycles are long, failure is expensive, and supply continuity is strategic.",
        "Nanoker ist eine Industrieplattform für fortschrittliche Materialien und hochspezifizierte Komponenten in Sektoren, in denen Qualifizierungszyklen lang sind, Ausfälle kostspielig sind und Versorgungskontinuität strategisch ist.",
      ],
      [
        "Material control defines performance, qualification risk and industrial scalability in critical technologies.",
        "Die Materialbeherrschung bestimmt Leistung, Qualifizierungsrisiko und industrielle Skalierbarkeit in kritischen Technologien.",
      ],
      [
        "Advanced materials for industries where reliability depends on controlling material functionality.",
        "Fortschrittliche Materialien für Branchen, in denen die Zuverlässigkeit von der Kontrolle der Materialfunktionalität abhängt.",
      ],
      [
        "Nanoker combines crystal growth, densification, precision machining and metrology in one industrial flow to deliver specification control, repeatability and scalable output for critical applications.",
        "Nanoker kombiniert Kristallwachstum, Verdichtung, Präzisionsbearbeitung und Metrologie in einem integrierten industriellen Ablauf, um Spezifikationskontrolle, Wiederholbarkeit und skalierbaren Ausstoß für kritische Anwendungen zu liefern.",
      ],
      [
        "Access to and browsing of this site grants the status of user and implies acceptance of this legal notice. Users agree to make appropriate use of the site, its contents, and the services available in accordance with the law, good faith, and public order.",
        "Der Zugang zu und das Browsen auf dieser Website verleihen den Status eines Nutzers und implizieren die Annahme dieses Impressums. Nutzer verpflichten sich, die Website, ihre Inhalte und die verfügbaren Dienste in Übereinstimmung mit dem Gesetz, Treu und Glauben sowie der öffentlichen Ordnung angemessen zu nutzen.",
      ],
      [
        "Cookies are small files downloaded to the user's device when accessing a website. They are used to store and retrieve information about browsing activity, remember preferences, or enable certain technical services.",
        "Cookies sind kleine Dateien, die beim Zugriff auf eine Website auf das Gerät des Nutzers heruntergeladen werden. Sie dienen dazu, Informationen über das Browsing-Verhalten zu speichern und abzurufen, Präferenzen zu merken oder bestimmte technische Dienste zu ermöglichen.",
      ],
      [
        "Tell us about your application and let us work together on the material architecture that makes it viable.",
        "Erzählen Sie uns von Ihrer Anwendung und lassen Sie uns gemeinsam an der Materialarchitektur arbeiten, die sie tragfähig macht.",
      ],
      [
        "Architecting the invisible layer of innovation.",
        "Wir gestalten die unsichtbare Schicht der Innovation.",
      ],
      ["European Sovereignty in Advanced Materials.", "Europäische Souveränität bei fortschrittlichen Materialien."],
      ["2. Terms of Use", "2. Nutzungsbedingungen"],
      [
        "Design, development and industrial manufacturing of advanced technical materials.",
        "Design, Entwicklung und industrielle Fertigung fortschrittlicher technischer Materialien.",
      ],
      [
        "Request a technical assessment for critical technologies and align material architecture, engineering execution and validation roadmap with Nanoker experts.",
        "Fordern Sie eine technische Bewertung für kritische Technologien an und stimmen Sie Materialarchitektur, Engineering-Umsetzung und Validierungs-Roadmap mit den Experten von Nanoker ab.",
      ],
      ["Select the areas where you need support.", "Wählen Sie die Bereiche aus, in denen Sie Unterstützung benötigen."],
      ["Qualification-ready documentation and traceability", "Qualifizierungsbereite Dokumentation und Rückverfolgbarkeit"],
      ["Manufacture advanced ceramic and crystal-based components", "Fortschrittliche keramische und kristallbasierte Komponenten fertigen"],
      ["Integrate processing, metrology and qualification logic", "Prozessierung, Metrologie und Qualifizierungslogik integrieren"],
      ["Support European OEMs in long-cycle critical applications", "Europäische OEMs bei kritischen Anwendungen mit langen Zyklen unterstützen"],
      [
        "Nanoker integrates advanced capabilities in single-crystal diamond growth and atomic-scale doping control, expanding the portfolio toward next-generation quantum, thermal, and semiconductor applications.",
        "Nanoker integriert fortschrittliche Fähigkeiten in Einkristall-Diamantwachstum und Dotierungskontrolle auf atomarer Ebene und erweitert das Portfolio in Richtung quantischer, thermischer und halbleiterbezogener Anwendungen der nächsten Generation.",
      ],
      ["Progressive qualification routes aligned with sector requirements", "Schrittweise Qualifizierungspfade, abgestimmt auf die Anforderungen des Sektors"],
      [
        "Europe cannot lead in advanced semiconductors, quantum technologies or defense systems without controlling the materials and process know-how that enable them.<br />Nanoker is building part of that industrial foundation.",
        "Europa kann bei fortschrittlichen Halbleitern, Quantentechnologien oder Verteidigungssystemen nicht führend sein, ohne die Materialien und das Prozess-Know-how zu beherrschen, die sie ermöglichen.<br />Nanoker baut einen Teil dieser industriellen Grundlage auf.",
      ],
      [
        "Europe cannot lead in advanced semiconductors, quantum technologies or defense systems without controlling the materials and process know-how that enable them.",
        "Europa kann bei fortschrittlichen Halbleitern, Quantentechnologien oder Verteidigungssystemen nicht führend sein, ohne die Materialien und das Prozess-Know-how zu beherrschen, die sie ermöglichen.",
      ],
      ["Nanoker is building part of that industrial foundation.", "Nanoker baut einen Teil dieser industriellen Grundlage auf."],
      [
        "Our industrial platform covers the full process chain required to move from material design to qualified part:",
        "Unsere Industrieplattform deckt die gesamte Prozesskette ab, die erforderlich ist, um von Materialdesign zu einem qualifizierten Bauteil zu gelangen:",
      ],
      ["3. Advanced densification", "3. Fortschrittliche Verdichtung"],
      ["7. Qualification and scale-up", "7. Qualifizierung und Hochlauf"],
      [
        "Vertical integration reduces handoff risk, compresses qualification loops and limits quality variability.",
        "Vertikale Integration reduziert Übergaberisiken, verkürzt Qualifizierungsschleifen und begrenzt Qualitätsvariabilität.",
      ],
      ["Optimization for SPS/HIP and crystal-growth routes", "Optimierung für SPS/HIP- und Kristallwachstumspfade"],
      [
        "The material is engineered around the application and process window, not adapted afterward.",
        "Das Material wird um die Anwendung und das Prozessfenster herum entwickelt und nicht nachträglich angepasst.",
      ],
      ["Advanced growth technologies", "Fortschrittliche Wachstumstechnologien"],
      ["Advanced Densification", "Fortschrittliche Verdichtung"],
      ["Process control from precursor engineering to qualified component.", "Prozesskontrolle von der Vorstufenentwicklung bis zum qualifizierten Bauteil."],
      [
        "Environmental management of advanced materials manufacturing and associated industrial services.",
        "Umweltmanagement für die Fertigung fortschrittlicher Materialien und zugehörige industrielle Dienstleistungen.",
      ],
      ["Select one or more categories.", "Wählen Sie eine oder mehrere Kategorien aus."],
      ["We need these details to coordinate a technical session.", "Wir benötigen diese Angaben, um eine technische Sitzung zu koordinieren."],
      ["Full control of process, metrology and QA/QC.", "Vollständige Kontrolle von Prozess, Metrologie und QA/QC."],
      ["industrial platform", "Industrieplattform"],
      ["advanced materials", "fortschrittliche Materialien"],
      ["critical technologies", "kritische Technologien"],
      ["critical applications", "kritische Anwendungen"],
      ["technical evaluation", "technische Bewertung"],
      ["technical request", "technische Anfrage"],
      ["technical contact", "technischer Kontakt"],
      ["technical assessment", "technische Bewertung"],
      ["engineering needs", "Engineering-Bedarfe"],
      ["material/component selection", "Material-/Komponentenauswahl"],
      ["performance optimization", "Leistungsoptimierung"],
      ["validation/testing", "Validierung/Tests"],
      ["scale-up / industrialization", "Hochlauf / Industrialisierung"],
      ["batch-to-batch", "von Charge zu Charge"],
      ["qualification-ready", "qualifizierungsbereit"],
      ["critical-to-quality", "qualitätskritisch"],
      ["proof of concept", "Machbarkeitsnachweis"],
      ["ready-to-process", "prozessbereit"],
      ["ready-to-device", "gerätebereit"],
      ["end-to-end vertical integration", "durchgängige vertikale Integration"],
      ["qualification-driven lock-in", "qualifizierungsgetriebene Verankerung"],
      ["next-generation", "nächste Generation"],
      ["long-cycle", "mit langem Zyklus"],
      ["advanced-material", "fortschrittliches Material"],
      ["process-capability", "Prozessfähigkeit"],
      ["atomic-scale", "auf atomarer Ebene"],
      ["guided assessment", "geführte Bewertung"],
      ["industrial capabilities", "industrielle Fähigkeiten"],
      ["integrated industrial capabilities", "integrierte industrielle Fähigkeiten"],
      ["vertical integration architecture", "Architektur der vertikalen Integration"],
      ["process control", "Prozesskontrolle"],
      ["process window", "Prozessfenster"],
      ["process windows", "Prozessfenster"],
      ["precision machining", "Präzisionsbearbeitung"],
      ["surface finishing", "Oberflächenbearbeitung"],
      ["quality management system", "Qualitätsmanagementsystem"],
      ["environmental management system", "Umweltmanagementsystem"],
      ["full traceability", "vollständige Rückverfolgbarkeit"],
      ["industrial scalability", "industrielle Skalierbarkeit"],
      ["supply continuity", "Versorgungskontinuität"],
      ["supply resilience", "Resilienz der Lieferkette"],
      ["qualification logic", "Qualifizierungslogik"],
      ["qualification cycles", "Qualifizierungszyklen"],
      ["qualified component", "qualifiziertes Bauteil"],
      ["qualified data", "qualifizierte Daten"],
      ["industrial execution", "industrielle Umsetzung"],
      ["industrial scale-up", "industrieller Hochlauf"],
      ["industrial scale", "industrieller Maßstab"],
      ["critical programs", "kritische Programme"],
      ["strategic sectors", "strategische Sektoren"],
      ["strategic technologies", "strategische Technologien"],
      ["European sovereignty", "europäische Souveränität"],
      ["high specification", "hohe Spezifikation"],
      ["high-specification", "Hochspezifikations-"],
      ["high purity", "hohe Reinheit"],
      ["single-crystal", "einkristallin"],
      ["surface engineering", "Oberflächentechnik"],
      ["validation plan", "Validierungsplan"],
      ["success criteria", "Erfolgskriterien"],
      ["industrial manufacturing", "industrielle Fertigung"],
      ["operating conditions", "Betriebsbedingungen"],
      ["operating environment", "Einsatzumgebung"],
      ["customer roadmap", "Kunden-Roadmap"],
      ["material architecture", "Materialarchitektur"],
      ["material functionality", "Materialfunktionalität"],
      ["industrial readiness", "industrielle Einsatzbereitschaft"],
      ["technical rigor", "technische Strenge"],
      ["continuous improvement", "kontinuierliche Verbesserung"],
      ["occupational safety", "Arbeitssicherheit"],
      ["information security", "Informationssicherheit"],
      ["ethics and compliance", "Ethik und Compliance"],
      ["equality and diversity", "Gleichstellung und Vielfalt"],
      ["legal notice", "Impressum"],
      ["privacy policy", "Datenschutzerklärung"],
      ["cookie policy", "Cookie-Richtlinie"],
      ["last updated", "zuletzt aktualisiert"],
      ["legal basis", "Rechtsgrundlage"],
      ["data retention", "Datenspeicherung"],
      ["user rights", "Nutzerrechte"],
      ["customer satisfaction survey", "Kundenzufriedenheitsumfrage"],
      ["fill out form", "Formular ausfüllen"],
      ["view document", "Dokument ansehen"],
      ["download certificate", "Zertifikat herunterladen"],
      ["Whoever controls the material controls the technology.", "Wer das Material beherrscht, beherrscht die Technologie."],
    ],
    words: {
      the: "der", and: "und", to: "zu", for: "für", with: "mit", from: "von", of: "von", in: "in",
      on: "auf", under: "gemäß", as: "als", if: "wenn", is: "ist", are: "sind", be: "sein", been: "gewesen",
      being: "seiend", it: "es", its: "seine", this: "dies", that: "das", these: "diese", those: "jene",
      we: "wir", our: "unser", you: "Sie", your: "Ihr", they: "sie", them: "ihnen", their: "ihr",
      all: "alle", any: "jede", more: "mehr", one: "eins", where: "wo", when: "wenn", which: "welche",
      what: "was", how: "wie", why: "warum", can: "kann", may: "kann", must: "muss", will: "wird",
      should: "sollte", would: "würde", could: "könnte", please: "bitte", provide: "angeben",
      required: "erforderlich", details: "Details", work: "Arbeit", works: "funktioniert",
      working: "Arbeitsweise", lead: "führen", leads: "führt", depends: "hängt ab",
      define: "definieren", defines: "definiert", build: "aufbauen", builds: "baut auf",
      built: "aufgebaut", make: "machen", makes: "macht", agree: "stimmen zu",
      acceptance: "Akzeptanz", implies: "impliziert", grants: "verleiht", status: "Status",
      users: "Nutzer", user: "Nutzer", contents: "Inhalte", appropriate: "angemessen",
      accordance: "Übereinstimmung", law: "Gesetz", good: "gutem", faith: "Glauben",
      public: "öffentlichen", order: "Ordnung", small: "kleine", accessing: "zugreifen",
      used: "verwendet", store: "speichern", retrieve: "abrufen", about: "über",
      activity: "Aktivität", remember: "merken", preferences: "Präferenzen", enable: "ermöglichen",
      certain: "bestimmte", categories: "Kategorien", need: "benötigen", coordinate: "koordinieren",
      session: "Sitzung", full: "vollständige", tell: "erzählen", let: "lassen",
      together: "gemeinsam", viable: "tragfähig", architecting: "gestalten", invisible: "unsichtbare",
      layer: "Schicht", select: "wählen", failure: "Ausfall",
      expensive: "kostspielig", risk: "Risiko", controlling: "Beherrschung", combines: "kombiniert",
      areas: "Bereiche", assessment: "Bewertung", execution: "Umsetzung", experts: "Experten",
      optimization: "Optimierung", testing: "Tests", purity: "Reinheit", documentation: "Dokumentation",
      manufacture: "fertigen", develop: "entwickeln", proprietary: "proprietär", formulations: "Formulierungen",
      routes: "Pfade", expanding: "erweitert", toward: "hin zu", portfolio: "Portfolio", low: "niedriger",
      carbon: "Kohlenstoff", intensity: "Intensität", provides: "liefert", covers: "deckt ab", move: "wechseln",
      reduces: "reduziert", compresses: "verkürzt", limits: "begrenzt", around: "um", adapted: "angepasst",
      afterward: "anschließend", workflows: "Workflows", months: "Monate", depending: "abhängig", fit: "passen",
      result: "Ergebnis", tighter: "engeres", defensible: "robusteres", bridge: "verbinden", creates: "schafft",
      survive: "überstehen", convert: "umwandeln", proof: "Nachweis", concept: "Konzept", manufacturable: "fertigbaren",
      repeatable: "wiederholbaren", ability: "Fähigkeit", secured: "gesichert", only: "nur", foundation: "Grundlage",
      whoever: "wer", oems: "OEM", know: "wissen", "know-how": "Know-how",
      flow: "Ablauf", advanceds: "fortschrittliche", home: "Start", company: "Unternehmen",
      capabilities: "Fähigkeiten", capability: "Fähigkeit", materials: "Materialien", sectors: "Sektoren",
      contact: "Kontakt", evaluation: "Bewertung", guided: "geführt", research: "Forschung",
      innovation: "Innovation", industrial: "industriell", integrated: "integriert", platform: "Plattform",
      applications: "Anwendungen", application: "Anwendung", components: "Komponenten",
      component: "Komponente", specification: "Spezifikation", specifications: "Spezifikationen",
      guaranteed: "garantiert", traceability: "Rückverfolgbarkeit", repeatability: "Wiederholbarkeit",
      output: "Ausstoß", scalability: "Skalierbarkeit", scale: "Maßstab", supply: "Versorgung",
      chain: "Kette", continuity: "Kontinuität", strategic: "strategisch", quality: "Qualität",
      system: "System", systems: "Systeme", operational: "betriebsbereit", policy: "Richtlinie",
      cookies: "Cookies", legal: "rechtlich", notice: "Hinweis", terms: "Bedingungen",
      use: "Nutzung", privacy: "Datenschutz", rights: "Rechte", security: "Sicherheit",
      information: "Information", equality: "Gleichstellung", diversity: "Vielfalt",
      sustainability: "Nachhaltigkeit", certifications: "Zertifizierungen", form: "Formular",
      submit: "senden", send: "senden", sending: "senden", continue: "weiter", back: "zurück",
      name: "Name", email: "E-Mail", phone: "Telefon", country: "Land", project: "Projekt",
      description: "Beschreibung", brief: "kurze", request: "Anfrage", type: "Typ", current: "aktuell",
      situation: "Situation", phase: "Phase", estimated: "geschätzte", quantity: "Menge",
      approximate: "ungefähre", dimensions: "Abmessungen", exact: "genaue", material: "Material",
      technology: "Technologie", environment: "Umgebung", sector: "Sektor", operating: "Betrieb",
      temperature: "Temperatur", function: "Funktion", main: "Haupt", considered: "vorgesehen",
      upload: "hochladen", files: "Dateien", optional: "optional", manufacturing: "Fertigung",
      selection: "Auswahl", development: "Entwicklung", quotation: "Angebot", inquiry: "Anfrage",
      technical: "technisch", drawings: "Zeichnungen", model: "Modell", existing: "bestehend",
      part: "Bauteil", defined: "definiert", requirements: "Anforderungen", idea: "Idee",
      prototype: "Prototyp", serial: "Serie", production: "Produktion", improvement: "Verbesserung",
      batch: "Serie", not: "nicht", yet: "noch", optics: "Optik", photonics: "Photonik",
      energy: "Energie", electronics: "Elektronik", industry: "Industrie", machinery: "Maschinenbau",
      aerospace: "Luftfahrt", space: "Raumfahrt", medical: "medizinisch", biotechnology: "Biotechnologie",
      scientific: "wissenschaftlich", vacuum: "Vakuum", chemical: "chemisch", corrosive: "korrosiv",
      wear: "Verschleiß", abrasion: "Abrieb", semiconductors: "Halbleiter", high: "hoch",
      hardness: "Härte", electrical: "elektrisch", insulation: "Isolation", resistance: "Beständigkeit",
      mechanical: "mechanisch", structural: "strukturell", friction: "Reibung", tribological: "tribologisch",
      thermal: "thermisch", conductivity: "Leitfähigkeit", dimensional: "Maß", stability: "Stabilität",
      precision: "Präzision", biocompatibility: "Biokompatibilität", optical: "optisch", other: "andere",
      sapphire: "Saphir", silicon: "Silizium", carbide: "Karbid", wafers: "Wafer",
      alumina: "Aluminiumoxid", zirconia: "Zirkonoxid", boron: "Bor", aluminum: "Aluminium",
      nitride: "Nitrid", ceramic: "Keramik", ceramics: "Keramiken", nanocomposites: "Nanokomposite",
      unsure: "unsicher", guidance: "Beratung", title: "Titel", subtitle: "Untertitel", text: "Text",
      item: "Punkt", process: "Prozess", control: "Kontrolle", controls: "Kontrollen",
      management: "Management", architecture: "Architektur", risks: "Risiken", validation: "Validierung",
      pathways: "Pfade", critical: "kritisch", decisions: "Entscheidungen", reliability: "Zuverlässigkeit",
      objectives: "Ziele", constraints: "Einschränkungen", propose: "vorschlagen",
      plan: "Plan", measurable: "messbar", milestones: "Meilensteine", deliver: "liefern",
      recommendations: "Empfehlungen", weeks: "Wochen", quarters: "Quartale", survey: "Umfrage",
      available: "verfügbar", certificates: "Zertifikate", access: "Zugang", complete: "abschließen",
      close: "schließen", open: "öffnen", tab: "Tab", download: "herunterladen",
      downloaded: "heruntergeladen", device: "Gerät", website: "Website", site: "Website",
      browsing: "Browsing", introduction: "Einführung", commitment: "Verpflichtung", scope: "Geltungsbereich",
      related: "verwandt", standard: "Norm", valid: "gültig", number: "Nummer", body: "Stelle",
      european: "europäisch", customer: "Kunde", clients: "Kunden", roadmap: "Roadmap",
      readiness: "Bereitschaft", performance: "Leistung", processes: "Prozesse", growth: "Wachstum",
      crystal: "Kristall", engineering: "Engineering", surface: "Oberfläche", support: "Support",
      densification: "Verdichtung", finishing: "Bearbeitung", polishing: "Polieren",
      qualification: "Qualifizierung", qualified: "qualifiziert", scaling: "Skalierung"
    },
  },
  it: {
    phrases: [
      ["DeepTech Materials for Critical Industries", "Materiali DeepTech per industrie critiche"],
      [
        "Nanoker is an industrial platform for advanced materials and high-specification components in sectors where qualification cycles are long, failure is expensive, and supply continuity is strategic.",
        "Nanoker è una piattaforma industriale per materiali avanzati e componenti ad alta specifica in settori in cui i cicli di qualificazione sono lunghi, il guasto è costoso e la continuità di fornitura è strategica.",
      ],
      [
        "Material control defines performance, qualification risk and industrial scalability in critical technologies.",
        "Il controllo del materiale definisce prestazioni, rischio di qualificazione e scalabilità industriale nelle tecnologie critiche.",
      ],
      [
        "Advanced materials for industries where reliability depends on controlling material functionality.",
        "Materiali avanzati per industrie in cui l'affidabilità dipende dal controllo della funzionalità del materiale.",
      ],
      [
        "Tell us about your application and let us work together on the material architecture that makes it viable.",
        "Raccontaci la tua applicazione e lavoriamo insieme sull'architettura del materiale che la rende praticabile.",
      ],
      ["Architecting the invisible layer of innovation.", "Progettiamo lo strato invisibile dell'innovazione."],
      ["European Sovereignty in Advanced Materials.", "Sovranità europea nei materiali avanzati."],
      ["2. Terms of Use", "2. Condizioni d'uso"],
      ["Select one or more categories.", "Seleziona una o più categorie."],
      ["We need these details to coordinate a technical session.", "Ci servono questi dati per coordinare una sessione tecnica."],
      ["Full control of process, metrology and QA/QC.", "Controllo completo di processo, metrologia e QA/QC."],
      ["Whoever controls the material controls the technology.", "Chi controlla il materiale controlla la tecnologia."],
      ["industrial platform", "piattaforma industriale"],
      ["advanced materials", "materiali avanzati"],
      ["critical technologies", "tecnologie critiche"],
      ["critical applications", "applicazioni critiche"],
      ["technical evaluation", "valutazione tecnica"],
      ["technical request", "richiesta tecnica"],
      ["technical contact", "contatto tecnico"],
      ["technical assessment", "valutazione tecnica"],
      ["engineering needs", "esigenze di ingegneria"],
      ["material/component selection", "selezione materiale/componente"],
      ["performance optimization", "ottimizzazione delle prestazioni"],
      ["validation/testing", "validazione/test"],
      ["scale-up / industrialization", "scale-up / industrializzazione"],
      ["batch-to-batch", "lotto a lotto"],
      ["qualification-ready", "pronto per la qualificazione"],
      ["next-generation", "di nuova generazione"],
      ["long-cycle", "a ciclo lungo"],
      ["atomic-scale", "su scala atomica"],
      ["guided assessment", "valutazione guidata"],
      ["industrial capabilities", "capacità industriali"],
      ["integrated industrial capabilities", "capacità industriali integrate"],
      ["vertical integration", "integrazione verticale"],
      ["process control", "controllo di processo"],
      ["process window", "finestra di processo"],
      ["precision machining", "lavorazione di precisione"],
      ["surface finishing", "finitura superficiale"],
      ["quality management system", "sistema di gestione della qualità"],
      ["environmental management system", "sistema di gestione ambientale"],
      ["full traceability", "tracciabilità completa"],
      ["industrial scalability", "scalabilità industriale"],
      ["supply continuity", "continuità di fornitura"],
      ["supply resilience", "resilienza della fornitura"],
      ["qualification logic", "logica di qualificazione"],
      ["qualification cycles", "cicli di qualificazione"],
      ["qualified component", "componente qualificato"],
      ["industrial execution", "esecuzione industriale"],
      ["industrial scale-up", "scale-up industriale"],
      ["critical programs", "programmi critici"],
      ["strategic sectors", "settori strategici"],
      ["strategic technologies", "tecnologie strategiche"],
      ["European sovereignty", "sovranità europea"],
      ["high specification", "alta specifica"],
      ["single-crystal", "monocristallino"],
      ["surface engineering", "ingegneria di superficie"],
      ["validation plan", "piano di validazione"],
      ["success criteria", "criteri di successo"],
      ["industrial manufacturing", "produzione industriale"],
      ["operating conditions", "condizioni operative"],
      ["operating environment", "ambiente operativo"],
      ["material architecture", "architettura del materiale"],
      ["material functionality", "funzionalità del materiale"],
      ["industrial readiness", "preparazione industriale"],
      ["technical rigor", "rigore tecnico"],
      ["continuous improvement", "miglioramento continuo"],
      ["occupational safety", "sicurezza sul lavoro"],
      ["information security", "sicurezza delle informazioni"],
      ["ethics and compliance", "etica e conformità"],
      ["equality and diversity", "uguaglianza e diversità"],
      ["legal notice", "note legali"],
      ["privacy policy", "informativa sulla privacy"],
      ["cookie policy", "informativa sui cookie"],
      ["last updated", "ultimo aggiornamento"],
      ["legal basis", "base giuridica"],
      ["data retention", "conservazione dei dati"],
      ["user rights", "diritti dell'utente"],
      ["customer satisfaction survey", "sondaggio di soddisfazione cliente"],
      ["fill out form", "compila il modulo"],
      ["view document", "visualizza documento"],
      ["download certificate", "scarica certificato"],
    ],
    words: {
      home: "home", company: "azienda", capabilities: "capacità", materials: "materiali", sectors: "settori",
      contact: "contatto", evaluation: "valutazione", guided: "guidata", research: "ricerca",
      innovation: "innovazione", industrial: "industriale", integrated: "integrato", platform: "piattaforma",
      applications: "applicazioni", application: "applicazione", components: "componenti",
      component: "componente", specification: "specifica", specifications: "specifiche",
      guaranteed: "garantite", traceability: "tracciabilità", repeatability: "ripetibilità",
      output: "produzione", scalability: "scalabilità", scale: "scala", supply: "fornitura",
      chain: "catena", continuity: "continuità", strategic: "strategico", quality: "qualità",
      system: "sistema", systems: "sistemi", operational: "operativo", policy: "politica",
      cookies: "cookie", legal: "legale", notice: "avviso", terms: "condizioni",
      use: "uso", privacy: "privacy", rights: "diritti", security: "sicurezza",
      information: "informazioni", equality: "uguaglianza", diversity: "diversità",
      sustainability: "sostenibilità", certifications: "certificazioni", form: "modulo",
      submit: "invia", send: "invia", sending: "invio", continue: "continua", back: "indietro",
      name: "nome", email: "email", phone: "telefono", country: "paese", project: "progetto",
      description: "descrizione", brief: "breve", request: "richiesta", type: "tipo", current: "attuale",
      situation: "situazione", phase: "fase", estimated: "stimata", quantity: "quantità",
      approximate: "approssimative", dimensions: "dimensioni", exact: "esatte", material: "materiale",
      technology: "tecnologia", environment: "ambiente", sector: "settore", operating: "operativo",
      temperature: "temperatura", function: "funzione", main: "principale", considered: "considerato",
      upload: "carica", files: "file", optional: "opzionale", manufacturing: "produzione",
      selection: "selezione", development: "sviluppo", quotation: "offerta", inquiry: "richiesta",
      technical: "tecnico", drawings: "disegni", model: "modello", existing: "esistente",
      part: "pezzo", defined: "definiti", requirements: "requisiti", idea: "idea",
      prototype: "prototipo", serial: "serie", production: "produzione", improvement: "miglioramento",
      batch: "lotto", not: "non", yet: "ancora", optics: "ottica", photonics: "fotonica",
      energy: "energia", electronics: "elettronica", industry: "industria", machinery: "macchinari",
      aerospace: "aerospazio", space: "spazio", medical: "medicale", biotechnology: "biotecnologia",
      scientific: "scientifica", vacuum: "vuoto", chemical: "chimico", corrosive: "corrosivo",
      wear: "usura", abrasion: "abrasione", semiconductors: "semiconduttori", high: "alta",
      hardness: "durezza", electrical: "elettrico", insulation: "isolamento", resistance: "resistenza",
      mechanical: "meccanica", structural: "strutturale", friction: "attrito", tribological: "tribologiche",
      thermal: "termico", conductivity: "conducibilità", dimensional: "dimensionale", stability: "stabilità",
      precision: "precisione", biocompatibility: "biocompatibilità", optical: "ottico", other: "altro",
      sapphire: "zaffiro", silicon: "silicio", carbide: "carburo", wafers: "wafer",
      alumina: "allumina", zirconia: "zirconia", boron: "boro", aluminum: "alluminio",
      nitride: "nitruro", ceramic: "ceramico", ceramics: "ceramiche", nanocomposites: "nanocompositi",
      unsure: "incerto", guidance: "supporto", title: "titolo", subtitle: "sottotitolo", text: "testo",
      item: "elemento", process: "processo", control: "controllo", controls: "controlli",
      management: "gestione", architecture: "architettura", risks: "rischi", validation: "validazione",
      pathways: "percorsi", critical: "critico", decisions: "decisioni", reliability: "affidabilità",
      objectives: "obiettivi", constraints: "vincoli", plan: "piano", measurable: "misurabili",
      milestones: "milestone", recommendations: "raccomandazioni", weeks: "settimane", quarters: "trimestri",
      survey: "sondaggio", available: "disponibili", certificates: "certificati", access: "accesso",
      complete: "completa", close: "chiudi", open: "apri", tab: "scheda", download: "scarica",
      device: "dispositivo", website: "sito", site: "sito", browsing: "navigazione",
      introduction: "introduzione", commitment: "impegno", scope: "ambito", related: "correlati",
      standard: "standard", valid: "valido", number: "numero", body: "ente", european: "europeo",
      customer: "cliente", clients: "clienti", roadmap: "roadmap", readiness: "preparazione",
      performance: "prestazioni", processes: "processi", growth: "crescita", crystal: "cristallo",
      engineering: "ingegneria", surface: "superficie", support: "supporto", densification: "densificazione",
      finishing: "finitura", polishing: "lucidatura", qualification: "qualificazione",
      qualified: "qualificato", scaling: "scalabilità"
    },
  },
};

function applyPhraseRules(text, lang) {
  const rules = AUTO_TRANSLATION_RULES[lang]?.phrases || [];
  return rules.reduce(
    (acc, [source, target]) => acc.replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), target),
    text
  );
}

function translateWords(text, lang) {
  const dictionary = AUTO_TRANSLATION_RULES[lang]?.words || {};
  return text.replace(/\b[A-Za-z][A-Za-z'/-]*\b/g, (token) => {
    const normalized = token.toLowerCase();
    const translated = dictionary[normalized];
    return translated ? preserveCase(token, translated) : token;
  });
}

export function translateVisibleText(text, lang = current) {
  if (lang !== "fr" && lang !== "de" && lang !== "it") return text;
  if (typeof text !== "string" || text.trim() === "") return text;

  return text
    .split(/(<[^>]+>)/g)
    .map((chunk) => {
      if (chunk.startsWith("<") && chunk.endsWith(">")) return chunk;
      return translateWords(applyPhraseRules(chunk, lang), lang);
    })
    .join("");
}

export function t(path, fallback) {
  if (current === "fr" || current === "de" || current === "it") {
    const explicitCurrent = hasExplicitLocaleValue(current, path)
      ? getValueByPath(LOCALE_OVERRIDES[current], path)
      : undefined;
    if (typeof explicitCurrent === "string" && explicitCurrent.trim() !== "") return explicitCurrent;
    if (typeof explicitCurrent === "number" || typeof explicitCurrent === "boolean") {
      return String(explicitCurrent);
    }

    const englishSource = getValueByPath(BASE_LOCALES.en, path);
    if (typeof englishSource === "string" && englishSource.trim() !== "") {
      return translateVisibleText(englishSource, current);
    }
    if (typeof englishSource === "number" || typeof englishSource === "boolean") {
      return String(englishSource);
    }
  }

  const localesToCheck = [current];
  if (current !== "en") localesToCheck.push("en");
  if (current !== "es") localesToCheck.push("es");

  let value;
  for (const localeKey of localesToCheck) {
    value = getValueByPath(I18N[localeKey], path);
    if (typeof value === "string" && value.trim() !== "") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }

  return fallback;
}

function formatWithArgs(template, args) {
  if (typeof template !== "string" || !Array.isArray(args) || !args.length) return template;
  return template.replace(/\{(\d+)\}/g, (match, idx) => {
    const i = Number(idx);
    return Number.isInteger(i) && i >= 0 && i < args.length ? args[i] : match;
  });
}

function parseArgs(rawArgs) {
  if (typeof rawArgs !== "string") return [];
  return rawArgs
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
}

function setHtmlLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
}

function normalizeCanonicalPath(pathname) {
  const raw = String(pathname || "/").replace(/\\/g, "/");
  if (raw === "/" || raw === "") return "/";
  if (/\/index\.html?$/i.test(raw)) {
    return raw.replace(/index\.html?$/i, "");
  }
  return raw;
}

function buildCanonicalUrl() {
  return new URL(normalizeCanonicalPath(window.location.pathname), `${SEO_BASE_URL}/`).toString();
}

function buildLocalizedUrl(lang) {
  const url = new URL(buildCanonicalUrl());
  url.searchParams.set("lang", lang);
  return url.toString();
}

function isSkippableHref(rawHref) {
  const href = String(rawHref || "").trim();
  return (
    href === "" ||
    href === "#" ||
    href.startsWith("#") ||
    /^(?:mailto|tel|sms|javascript|data):/i.test(href)
  );
}

function isStaticAssetPath(pathname) {
  return /\.(?:pdf|png|jpe?g|webp|gif|svg|ico|css|js|json|xml|txt|zip|dwg|step|stp)$/i.test(
    pathname
  );
}

function shouldPreserveLangForHref(rawHref) {
  if (isSkippableHref(rawHref)) return false;

  try {
    const url = new URL(rawHref, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (isStaticAssetPath(url.pathname)) return false;
    return true;
  } catch (_error) {
    return false;
  }
}

function hrefWithLang(rawHref, lang) {
  const href = String(rawHref || "");
  const isAbsolute = /^[a-z][a-z0-9+.-]*:/i.test(href);

  if (isAbsolute) {
    const url = new URL(href);
    url.searchParams.set("lang", lang);
    return url.toString();
  }

  const hashIndex = href.indexOf("#");
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const queryIndex = beforeHash.indexOf("?");
  const pathPart = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const queryPart = queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(queryPart);
  params.set("lang", lang);
  return `${pathPart}?${params.toString()}${hash}`;
}

function syncInternalLinks(root = document) {
  const context = root.nodeType === 1 ? root : document;
  const links = context.matches?.("a[href]")
    ? [context]
    : Array.from(context.querySelectorAll?.("a[href]") || []);

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!shouldPreserveLangForHref(href)) return;
    link.setAttribute("href", hrefWithLang(href, current));
  });
}

function syncLanguageQueryParam(lang) {
  try {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", lang);
    window.history.replaceState(window.history.state, "", nextUrl.toString());
  } catch (_error) {
    // Ignore history / URL parsing issues.
  }
}

function resolveSeoConfig() {
  const pathname = String(window.location.pathname || "/").replace(/\\/g, "/");
  return SEO_PAGE_CONFIG[pathname] || SEO_PAGE_CONFIG[normalizeCanonicalPath(pathname)] || null;
}

function ensureHeadNode(selector, tagName, attrs = {}) {
  const nodes = document.head.querySelectorAll(selector);
  const node = nodes[0];
  if (nodes.length > 1) {
    Array.from(nodes)
      .slice(1)
      .forEach((duplicate) => duplicate.parentNode?.removeChild(duplicate));
  }
  if (node) return node;

  const createdNode = document.createElement(tagName);
  Object.entries(attrs).forEach(([key, value]) => {
    createdNode.setAttribute(key, value);
  });
  document.head.appendChild(createdNode);
  return createdNode;
}

function setNodeContent(node, content) {
  if (!node) return;
  node.setAttribute("content", content);
}

function syncSeoMetadata() {
  const config = resolveSeoConfig();
  const existingDescription =
    document.head.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const title = config ? t(config.titleKey, document.title) : document.title;
  const description = config ? t(config.descriptionKey, existingDescription) : existingDescription;
  const canonicalUrl = buildCanonicalUrl();
  const localizedUrl = buildLocalizedUrl(current);
  const locales = SEO_LOCALES[current] || SEO_LOCALES[DEFAULT_LANG];

  if (typeof title === "string" && title.trim() !== "") {
    document.title = title;
    const titleTag = document.head.querySelector("title");
    if (titleTag) titleTag.textContent = title;
  }

  if (typeof description === "string" && description.trim() !== "") {
    [
      ensureHeadNode('meta[name="description"]', "meta", { name: "description" }),
      ensureHeadNode('meta[property="og:description"]', "meta", { property: "og:description" }),
      ensureHeadNode('meta[name="twitter:description"]', "meta", { name: "twitter:description" }),
    ].forEach((node) => setNodeContent(node, description));
  }

  [
    ensureHeadNode('meta[property="og:title"]', "meta", { property: "og:title" }),
    ensureHeadNode('meta[name="twitter:title"]', "meta", { name: "twitter:title" }),
  ].forEach((node) => setNodeContent(node, title));

  setNodeContent(
    ensureHeadNode('meta[property="og:type"]', "meta", { property: "og:type" }),
    "website"
  );
  setNodeContent(
    ensureHeadNode('meta[property="og:url"]', "meta", { property: "og:url" }),
    localizedUrl
  );
  setNodeContent(
    ensureHeadNode('meta[property="og:image"]', "meta", { property: "og:image" }),
    SEO_DEFAULT_IMAGE
  );
  setNodeContent(
    ensureHeadNode('meta[property="og:locale"]', "meta", { property: "og:locale" }),
    locales.og
  );
  const existingOgAlternates = Array.from(
    document.head.querySelectorAll('meta[property="og:locale:alternate"]')
  );
  existingOgAlternates.forEach((node) => node.parentNode?.removeChild(node));
  locales.alternates.forEach((locale) => {
    setNodeContent(
      ensureHeadNode(`meta[property="og:locale:alternate"][content="${locale}"]`, "meta", {
        property: "og:locale:alternate",
      }),
      locale
    );
  });

  setNodeContent(
    ensureHeadNode('meta[name="twitter:card"]', "meta", { name: "twitter:card" }),
    "summary_large_image"
  );
  setNodeContent(
    ensureHeadNode('meta[name="twitter:image"]', "meta", { name: "twitter:image" }),
    SEO_DEFAULT_IMAGE
  );

  ensureHeadNode('link[rel="canonical"]', "link", { rel: "canonical" }).setAttribute(
    "href",
    canonicalUrl
  );
  SUPPORTED_LANGS.forEach((lang) => {
    ensureHeadNode(`link[rel="alternate"][hreflang="${lang}"]`, "link", {
      rel: "alternate",
      hreflang: lang,
    }).setAttribute("href", buildLocalizedUrl(lang));
  });
  ensureHeadNode('link[rel="alternate"][hreflang="x-default"]', "link", {
    rel: "alternate",
    hreflang: "x-default",
  }).setAttribute("href", canonicalUrl);
}

function localizeLanguageName(lang) {
  return t(`langSwitcher.names.${lang}`, lang.toUpperCase());
}

function closeAllLanguageMenus() {
  document.querySelectorAll("[data-lang-menu]").forEach((menu) => {
    menu.classList.remove("is-open");
  });
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
  });
}

function renderLanguageToggle(btn) {
  const currentName = localizeLanguageName(current);
  btn.setAttribute(
    "aria-label",
    formatWithArgs(t("langSwitcher.current", "Current language: {0}"), [currentName])
  );
  btn.setAttribute("aria-haspopup", "menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    `<span class="nav-lang__current">${current.toUpperCase()}</span>` +
    '<span class="nav-lang__chevron" aria-hidden="true">▾</span>';
}

function ensureLanguageMenu(btn) {
  let menu = btn.parentElement?.querySelector?.("[data-lang-menu]");
  if (menu) return menu;

  menu = document.createElement("div");
  menu.className = "nav-lang-menu";
  menu.setAttribute("data-lang-menu", "");
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", t("langSwitcher.choose", "Choose language"));

  SUPPORTED_LANGS.forEach((lang) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "nav-lang-menu__option";
    option.setAttribute("role", "menuitemradio");
    option.setAttribute("data-lang-option", lang);
    option.addEventListener("click", () => {
      closeAllLanguageMenus();
      setLang(lang);
    });
    menu.appendChild(option);
  });

  btn.insertAdjacentElement("afterend", menu);
  return menu;
}

function renderLanguageMenu(btn) {
  const menu = ensureLanguageMenu(btn);
  menu.setAttribute("aria-label", t("langSwitcher.choose", "Choose language"));
  menu.querySelectorAll("[data-lang-option]").forEach((option) => {
    const lang = option.getAttribute("data-lang-option");
    const name = localizeLanguageName(lang);
    option.textContent = `${lang.toUpperCase()} · ${name}`;
    option.setAttribute("aria-checked", String(lang === current));
    option.classList.toggle("is-active", lang === current);
    option.setAttribute(
      "aria-label",
      formatWithArgs(t("langSwitcher.optionLabel", "Switch site to {0}"), [name])
    );
  });
}

function bindLanguageControls(root = document) {
  const toggles = root.matches?.("[data-lang-toggle]")
    ? [root]
    : Array.from(root.querySelectorAll?.("[data-lang-toggle]") || []);

  toggles.forEach((btn) => {
    if (btn.dataset.langBound !== "1") {
      btn.dataset.langBound = "1";
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const menu = ensureLanguageMenu(btn);
        const nextOpen = !menu.classList.contains("is-open");
        closeAllLanguageMenus();
        menu.classList.toggle("is-open", nextOpen);
        btn.setAttribute("aria-expanded", String(nextOpen));
      });
    }

    renderLanguageToggle(btn);
    renderLanguageMenu(btn);
  });
}

function bindNoopHashGuard() {
  if (hasBoundNoopHashGuard) return;
  hasBoundNoopHashGuard = true;

  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.hasAttribute("data-allow-empty-hash")) return;

      const href = anchor.getAttribute("href");
      const normalized = String(href || "").trim();
      const isNoopHref =
        normalized === "#" ||
        normalized === "" ||
        normalized === "." ||
        normalized === "./";

      if (!isNoopHref) return;
      event.preventDefault();
    },
    true
  );
}

function safeGetCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (_error) {
    return null;
  }
}

function safeSetCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (_error) {
    // Ignore storage write errors (private mode / disabled storage).
  }
}

function resolveCookiesPolicyHref() {
  const pathname = String(window.location.pathname || "").replace(/\\/g, "/");
  return pathname.includes("/politicas/") ? "../../cookies.html" : "./cookies.html";
}

function removeCookieBanner(banner) {
  if (!banner || !banner.parentNode) return;
  banner.parentNode.removeChild(banner);
}

function dismissCookieBanner(banner, value) {
  if (!banner || banner.dataset.closing === "1") return;
  banner.dataset.closing = "1";
  safeSetCookieConsent(value);
  banner.classList.remove("is-visible");
  banner.classList.add("is-hiding");

  let removed = false;
  const finalize = () => {
    if (removed) return;
    removed = true;
    removeCookieBanner(banner);
  };

  banner.addEventListener("animationend", finalize, { once: true });
  window.setTimeout(finalize, 420);
}

function createCookieBanner() {
  if (!document.body || document.querySelector("[data-cookie-consent]")) return;

  const banner = document.createElement("aside");
  banner.className = "cookie-consent";
  banner.setAttribute("data-cookie-consent", "");
  banner.setAttribute("aria-labelledby", "cookie-consent-title");
  banner.setAttribute("aria-describedby", "cookie-consent-description");

  const panel = document.createElement("div");
  panel.className = "cookie-consent__panel";

  const content = document.createElement("div");
  content.className = "cookie-consent__content";

  const title = document.createElement("h2");
  title.id = "cookie-consent-title";
  title.className = "cookie-consent__title";
  title.setAttribute("data-i18n", "cookieBanner.title");
  title.textContent = "Cookies";

  const description = document.createElement("p");
  description.id = "cookie-consent-description";
  description.className = "cookie-consent__description";
  description.setAttribute("data-i18n", "cookieBanner.description");
  description.textContent = "We use cookies to improve your experience and analyze website usage.";

  const link = document.createElement("a");
  link.className = "cookie-consent__link";
  link.href = resolveCookiesPolicyHref();
  link.setAttribute("data-i18n", "cookieBanner.learnMore");
  link.textContent = "Learn more";

  content.append(title, description, link);

  const actions = document.createElement("div");
  actions.className = "cookie-consent__actions";

  const rejectButton = document.createElement("button");
  rejectButton.type = "button";
  rejectButton.className = "cookie-consent__button cookie-consent__button--ghost";
  rejectButton.setAttribute("data-cookie-action", "rejected");
  rejectButton.setAttribute("data-i18n", "cookieBanner.reject");
  rejectButton.textContent = "Reject";

  const acceptButton = document.createElement("button");
  acceptButton.type = "button";
  acceptButton.className = "cookie-consent__button cookie-consent__button--primary";
  acceptButton.setAttribute("data-cookie-action", "accepted");
  acceptButton.setAttribute("data-i18n", "cookieBanner.accept");
  acceptButton.textContent = "Accept";

  actions.append(rejectButton, acceptButton);
  panel.append(content, actions);
  banner.append(panel);

  banner.addEventListener("click", (event) => {
    const actionButton = event.target?.closest?.("[data-cookie-action]");
    if (!actionButton) return;

    const value = actionButton.getAttribute("data-cookie-action");
    if (!COOKIE_CONSENT_VALUES.has(value)) return;
    dismissCookieBanner(banner, value);
  });

  document.body.appendChild(banner);
  applyTranslations(banner);

  window.requestAnimationFrame(() => {
    banner.classList.add("is-visible");
  });
}

function initCookieBanner() {
  if (hasInitializedCookieBanner) return;
  hasInitializedCookieBanner = true;

  if (COOKIE_CONSENT_VALUES.has(safeGetCookieConsent())) return;
  createCookieBanner();
}

function applyAttributeTranslation(el, attrName, key, fallback = "") {
  const value = t(key, fallback);
  if (typeof value === "string" && value.trim() !== "") {
    el.setAttribute(attrName, value);
  }
}

function applyCommonAttributeTranslations(root = document) {
  const context = root.nodeType === 1 ? root : document;
  const mappings = [
    [".nav-logo", "aria-label", "nav.home"],
    [".mobile-menu-logo", "aria-label", "nav.home"],
    [".nav-toggle", "aria-label", "nav.menu"],
    [".mobile-menu-close", "aria-label", "nav.closeMenu"],
    ["[data-mobile-menu]", "aria-label", "nav.mobileNavigationLabel"],
    [".nk-hero__scroll", "aria-label", "hero.scroll"],
  ];

  mappings.forEach(([selector, attr, key]) => {
    const nodes = context.matches?.(selector)
      ? [context]
      : Array.from(context.querySelectorAll?.(selector) || []);
    nodes.forEach((node) => applyAttributeTranslation(node, attr, key, node.getAttribute(attr) || ""));
  });
}

export function applyTranslations(root = document) {
  // data-i18n => textContent
  root.querySelectorAll?.("[data-i18n]")?.forEach((el) => {
    const key = el.dataset.i18n;
    const fallback = el.textContent;
    const args = parseArgs(el.dataset.i18nArgs);
    const val = formatWithArgs(t(key, fallback), args);
    if (typeof val === "string" && val.trim() !== "") el.textContent = val;
  });

  // data-i18n-html => innerHTML
  root.querySelectorAll?.("[data-i18n-html]")?.forEach((el) => {
    const key = el.dataset.i18nHtml;
    const fallback = el.innerHTML;
    const val = t(key, fallback);
    if (typeof val === "string" && val.trim() !== "") el.innerHTML = val;
  });

  // data-i18n-placeholder => placeholder
  root.querySelectorAll?.("[data-i18n-placeholder]")?.forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const fallback = el.getAttribute("placeholder") || "";
    const val = t(key, fallback);
    if (typeof val === "string" && val.trim() !== "") el.setAttribute("placeholder", val);
  });

  [
    ["data-i18n-aria-label", "aria-label"],
    ["data-i18n-title", "title"],
    ["data-i18n-alt", "alt"],
  ].forEach(([dataKey, attr]) => {
    root.querySelectorAll?.(`[${dataKey}]`)?.forEach((el) => {
      const key = el.getAttribute(dataKey);
      applyAttributeTranslation(el, attr, key, el.getAttribute(attr) || "");
    });
  });

  root.querySelectorAll?.("[data-i18n-attr]")?.forEach((el) => {
    const raw = el.getAttribute("data-i18n-attr");
    raw
      ?.split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry) => {
        const [attrName, key] = entry.split(":").map((part) => part.trim());
        if (!attrName || !key) return;
        applyAttributeTranslation(el, attrName, key, el.getAttribute(attrName) || "");
      });
  });

  applyCommonAttributeTranslations(root);
  bindLanguageControls(root);
  syncInternalLinks(root);
}

export function setLang(lang) {
  const next = normalizeLang(lang);
  if (!I18N[next] || next === current) return;

  current = next;
  closeAllLanguageMenus();
  safeSetStoredLang(next);
  syncLanguageQueryParam(next);
  setHtmlLang(next);

  applyTranslations();
  syncInternalLinks();
  syncSeoMetadata();

  window.dispatchEvent(new CustomEvent("lang:change", { detail: { lang: next } }));
}

export function initLanguageSwitcher(options = {}) {
  safeSetStoredLang(current);
  syncLanguageQueryParam(current);
  setHtmlLang(current);
  applyTranslations();
  syncSeoMetadata();
  initCookieBanner();
  bindLanguageControls(document);

  if (document.documentElement.dataset.langGlobalBound !== "1") {
    document.documentElement.dataset.langGlobalBound = "1";

    document.addEventListener("click", (event) => {
      if (event.target?.closest?.("[data-lang-toggle], [data-lang-menu]")) return;
      closeAllLanguageMenus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllLanguageMenus();
    });
  }

  if (options.observeDOM) {
    if (domObserver) domObserver.disconnect();

    domObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes?.forEach((n) => {
          if (n && n.nodeType === 1) applyTranslations(n);
        });
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  bindNoopHashGuard();
  document.documentElement.setAttribute("data-i18n-ready", "1");
}
