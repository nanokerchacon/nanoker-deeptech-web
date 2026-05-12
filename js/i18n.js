// js/i18n.js
// Single source of truth for UI copy.
// Tip: Keep keys identical between languages.

import { DE_OVERRIDES, FR_OVERRIDES } from "./i18n-overrides.js";

function deepFreeze(obj) {
  if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop]));
  return obj;
}

function mergeDeep(base, overrides) {
  if (Array.isArray(base)) {
    if (!Array.isArray(overrides)) return base.map((item) => mergeDeep(item, undefined));
    return base.map((item, index) => mergeDeep(item, overrides[index]));
  }

  if (!base || typeof base !== "object") {
    return overrides === undefined ? base : overrides;
  }

  const result = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(overrides || {})]);
  keys.forEach((key) => {
    result[key] = mergeDeep(base[key], overrides?.[key]);
  });
  return result;
}

const BASE_I18N = deepFreeze({
  en: {
    nav: {
      // ✅ NAV MENU (matches index.html data-i18n)
      home: "Home",
      company: "Company",
      capabilities: "Capabilities",
      materials: "Materials",
      sectors: "Sectors",
      rnd: "R&D",
      advantages: "Advantages",
      contact: "Contact",

      // ✅ Optional label (legacy / if you ever show "Sectors:" somewhere)
      sectorsLabel: "Sectors:",

      // Existing keys you already had
        partner: "Partner Access",
        menu: "Open menu",
        closeMenu: "Close menu",
        mobileNavigationLabel: "Site navigation",
        quantum: "Quantum",
      semi: "Semiconductors",
      extreme: "Defense & Space",
      medical: "Medical",
      implants: "Implants",
      lang: "EN",
    },

    hero: {
      headline: "DeepTech Materials for Critical Industries.",
      lead: "Advanced materials with guaranteed specification, full traceability and industrial scalability. From precursor to finished component.",
      bridgeEyebrow: "EU DEEPTECH · MATERIALS INFRASTRUCTURE",
      bridgeSectionAria: "Introduction",
      bridgeHtml: "Europe’s DeepTech transition from prototype to industrial production depends on a critical factor: mastery of advanced materials.<br /><br />Nanoker integrates capabilities in technical ceramics, CVD diamond, SiC and sapphire to deliver solutions with guaranteed specifications, full traceability and industrial scalability.",
      bridgeCtaSectors: "Explore sectors",
      bridgeCtaContact: "Contact engineering",
      title: "nanoker",
      subtitleHtml:
        "<b>DeepTech Materials for Critical Industries.</b><br/>Advanced materials with guaranteed specification, full traceability and industrial scalability. From precursor to finished component.",
      tagline:
        "Architecting the invisible layer of innovation.<br/>European Sovereignty in Advanced Materials.",
      scroll: "Scroll to Explore",
    },

    seo: {
      home: {
        metaTitle: "Nanoker | DeepTech Advanced Materials",
        metaDescription:
          "Nanoker manufactures advanced ceramics, CVD diamond, SiC and sapphire for critical industries with guaranteed specification, full traceability and industrial scale.",
      },
      company: {
        metaTitle: "Nanoker | Company",
        metaDescription:
          "Learn how Nanoker builds European industrial capacity in advanced materials, combining process control, qualification and scalable manufacturing for strategic technology programs.",
      },
      capabilities: {
        metaTitle: "Nanoker | Capabilities",
        metaDescription:
          "Review Nanoker capabilities across formulation, growth, qualification and industrialization, enabling repeatable material performance for mission-critical applications.",
      },
      rnd: {
        metaTitle: "Nanoker | Research and Innovation",
        metaDescription:
          "Explore Nanoker research and innovation capabilities in advanced materials, crystal growth, quantum-grade diamond and industrial transfer for strategic technologies.",
      },
      materials: {
        metaTitle: "Nanoker | Materials",
        metaDescription:
          "Discover Nanoker material portfolio in advanced ceramics, CVD diamond, SiC and sapphire, engineered for certified performance, qualification and industrial scalability.",
      },
      sectors: {
        metaTitle: "Nanoker | Sectors",
        metaDescription:
          "Explore the sectors Nanoker serves, from defense and aerospace to semiconductors, energy and medical systems, with materials engineered for mission-critical reliability.",
      },
      contact: {
        metaTitle: "Technical Contact | Nanoker",
        metaDescription:
          "Contact Nanoker engineering to discuss applications, critical specifications and qualification paths for advanced-material industrial programs.",
      },
      evaluation: {
        metaTitle: "Technical Evaluation | Nanoker",
        metaDescription:
          "Request a technical assessment for critical technologies and align material architecture, engineering execution and validation roadmap with Nanoker experts.",
      },
      certifications: {
        metaTitle: "Nanoker | Quality & Certifications",
        metaDescription:
          "Review Nanoker quality framework, certifications and regulated manufacturing standards supporting reliability, compliance and full traceability.",
      },
      privacy: {
        metaTitle: "Privacy Policy | Nanoker",
        metaDescription:
          "Nanoker Research S.L. Privacy Policy with information on the data controller, purposes, legal basis, retention, user rights, and security.",
      },
      cookies: {
        metaTitle: "Cookie Policy | Nanoker",
        metaDescription:
          "Nanoker Cookie Policy explaining what cookies are, the types of cookies used, third-party cookies, and how to manage them.",
      },
      legalNotice: {
        metaTitle: "Legal Notice | Nanoker",
        metaDescription:
          "Nanoker Research S.L. legal notice including identifying details, terms of use, intellectual property, and limitation of liability.",
      },
    },

    contact: {
      metaTitle: "Technical Contact | Nanoker",
      hero: {
        kicker: "CONTACT",
        titleHtml: "Technical <span class=\"page-hero__accent\">contact</span>",
        lead: "The right material decision starts with the right technical brief.",
        text:
          "If you are qualifying a component, de-risking a supply chain or defining a new material architecture, our engineering team can review the application with an industrial lens.",
        cta: "Open technical form",
      },
      work: {
        title: "How we work",
        intro: "To accelerate the first review, please share:",
        items: {
          application: "Application description",
          specification: "Target specification or drawing set (if available)",
          requirements: "Critical requirements (temperature, pressure, tolerances, lifetime, etc.)",
          volume: "Estimated demand, qualification phase or project maturity",
        },
        outro: "This helps us frame feasibility, qualification logic and next technical steps with precision.",
      },
      wizard: {
        kicker: "ENGINEERING INTERFACE",
        title: "Technical intake",
        progress: "Step 1 of 6",
        progressTemplate: "STEP {current} OF {total}",
        steps: {
          step1: "STEP 1",
          step2: "STEP 2",
          step3: "STEP 3",
          step4: "STEP 4",
          step5: "STEP 5",
          step6: "STEP 6",
        },
      },
      form: {
        actions: {
          continue: "Continue",
        },
        step1: {
          title: "Inquiry type",
          options: {
            eval: "Material technical assessment",
            coengineering: "Joint development / co-engineering",
            sample: "Sample request",
            rfq: "Quotation request (RFQ)",
            rnd: "R&D collaboration",
            institutional: "Investment / institutional",
            other: "Other",
          },
        },
        step2: {
          title: "Sector",
          options: {
            industry: "Industry",
            energy: "Energy",
            health: "Health",
            semiconductors: "Semiconductors",
            photonics: "Photonics",
            quantum: "Quantum",
            defense: "Defense / Space",
            science: "Science and infrastructures",
          },
        },
        step3: {
          title: "Material of interest (optional)",
          options: {
            diamond: "Diamond evo",
            sic: "SiC",
            sapphire: "Sapphire",
            ceramics: "Technical ceramics",
            composites: "Thermal composites",
            undefined: "Not defined",
          },
        },
        step4: {
          title: "Technical information",
          label: "Technical information",
          placeholder: "Describe your application, operating environment, and key requirements.",
        },
        step5: {
          title: "Contact details",
          fields: {
            name: "Name *",
            company: "Company *",
            role: "Role",
            email: "Corporate email *",
            country: "Country *",
            phone: "Phone (optional)",
          },
        },
        step6: {
          title: "Submit request",
          submit: "Send technical request",
          note: "We process technical requests within 3-5 business days.",
        },
      },
      processingNote: "WE PROCESS TECHNICAL REQUESTS WITHIN 3–5 BUSINESS DAYS",
      duo: {
        strategic: {
          title: "Strategic relations",
          text:
            "For industrial alliances, institutional collaborations, or corporate information, you can write directly to:",
        },
        presence: {
          title: "Industrial presence",
          oviedo: "Oviedo - Development and validation",
          leon: "León - Strategic industrial hub",
        },
        readiness: {
          title: "Ready for critical programs",
          text:
            "Initial conversations are handled with engineering rigor, confidentiality discipline and industrial-qualification criteria.",
          item1: "Technical counterpart from the first review",
          item2: "Focus on CTQs, risk and scale-up",
          item3: "Initial response within 3-5 business days",
        },
      },
      close: {
        title: "Materials engineering aligned with qualification and scale-up",
        text:
          "In DeepTech, commercial traction depends on technical credibility. We support customers from first specification review through industrial qualification and supply continuity.",
      },
    },

    evaluation: {
      metaTitle: "Technical Evaluation | Nanoker",
      metaDescription:
        "Request a technical assessment for critical technologies and align material architecture, engineering execution and validation roadmap with Nanoker experts.",
      hero: {
        kicker: "EVALUATION",
        titleHtml:
          "Technical assessment for <span class=\"page-hero__accent\">critical technologies</span>",
        lead:
          "We define material architecture, engineering risks, and validation pathways to accelerate critical decisions with industrial-grade reliability.",
      },
      work: {
        title: "How we work",
        items: {
          scope: "We align technical objectives, constraints, and system criticality.",
          architecture:
            "We propose material and electronics architecture with manufacturing readiness in mind.",
          validation: "We design a validation plan with measurable milestones and success criteria.",
          execution:
            "We deliver actionable recommendations for execution in weeks, not quarters.",
        },
      },
      wizard: {
        kicker: "ENGINEERING INTERFACE",
        title: "Guided assessment",
        progress: "STEP 1 OF 5",
        progressTemplate: "STEP {current} OF {total}",
        confidentiality:
          "All information will be handled confidentially.",
        steps: {
          step1: "STEP 1",
          step2: "STEP 2",
          step3: "STEP 3",
          step4: "STEP 4",
          step5: "STEP 5",
        },
      },
      form: {
        actions: {
          continue: "Continue",
          back: "Back",
        },
        validation: {
          minCharacters: "Please provide at least 30 characters.",
        },
        step1: {
          title: "Technology type",
          help: "Select one or more categories.",
          options: {
            ai: "AI",
            robotics: "Robotics",
            electronics: "Electronic hardware",
            embedded: "Embedded systems",
            iot: "IoT",
            deeptech: "Applied Science / DeepTech",
            other: "Other",
          },
        },
        step2: {
          title: "Project phase",
          help: "Select the current phase.",
          options: {
            concept: "Concept",
            prototype: "Prototype",
            mvp: "MVP",
            functional: "Functional product",
            scale: "Scale-up / industrialization",
          },
        },
        step3: {
          title: "Technical challenge",
          label: "Technical challenge",
          help: "Share the key challenge you need to solve.",
          placeholder:
            "Describe current architecture, technical bottlenecks, operating conditions, and target metrics.",
        },
        step4: {
          title: "Engineering needs",
          help: "Select the areas where you need support.",
          options: {
            hardwareArchitecture: "Hardware architecture",
            materialSelection: "Material/component selection",
            embedded: "Embedded systems",
            edgeAi: "Edge AI",
            performance: "Performance optimization",
            industrialization: "Industrialization/manufacturing",
            validation: "Validation/testing",
            other: "Other",
          },
        },
        step5: {
          title: "Contact details",
          help: "We need these details to coordinate a technical session.",
          submit: "Request technical evaluation",
          sending: "Sending...",
          fields: {
            name: "Name *",
            email: "Business email *",
            company: "Company *",
            role: "Role *",
            start: "When do you need to start? *",
          },
          startOptions: {
            placeholder: "Select an option",
            immediate: "Immediate",
            oneThreeMonths: "1-3 months",
            threeSixMonths: "3-6 months",
            exploring: "Exploring",
          },
        },
        status: {
          requiredFields: "Complete required fields to continue.",
          completePrevious: "Complete previous steps before submitting.",
          challengeTooShort:
            "Please provide at least 30 characters in the technical challenge.",
          sending: "Sending evaluation request...",
          success:
            "Request received. Our engineering team will contact you shortly.",
          error: "We could not process your request. Please try again.",
        },
      },
    },

    certifications: {
      metaTitle: "Nanoker | Quality & Certifications",
      kicker: "QUALITY FRAMEWORK",
      titleHtml: "Quality & <span class=\"cert-accent\">Certifications</span>",
      intro:
        "Nanoker operates under internationally recognized standards to ensure product reliability, regulatory compliance and full industrial traceability.",
      labels: {
        standard: "Standard",
        scope: "Scope",
        body: "Certification body",
        number: "Certificate number",
        valid: "Valid until",
      },
      cards: {
        iso9001: {
          title: "ISO 9001",
          desc:
            "Certified Quality Management System ensuring consistent processes, continuous improvement and customer-focused performance across all operations.",
          fields: {
            standard: "ISO 9001:2015",
            scope: "Design, development and industrial manufacturing of advanced technical materials.",
            body: "TUV Rheinland",
            number: "QMS-9001-NAK-2026-001",
            valid: "December 31, 2028",
          },
          download: "Download certificate",
          file: "[PDF] iso-9001-nanoker.pdf",
        },
        iso14001: {
          title: "ISO 14001",
          desc:
            "Environmental Management System ensuring responsible resource use, emissions control and sustainable industrial practices.",
          fields: {
            standard: "ISO 14001:2015",
            scope: "Environmental management of advanced materials manufacturing and associated industrial services.",
            body: "Bureau Veritas",
            number: "EMS-14001-NAK-2026-014",
            valid: "September 30, 2028",
          },
          download: "Download certificate",
          file: "[PDF] iso-14001-nanoker.pdf",
        },
        iso13485: {
          title: "ISO 13485",
          desc:
            "Quality Management System for regulated environments, supporting medical-grade requirements and robust documentation.",
          fields: {
            standard: "ISO 13485:2016",
            scope: "Development and manufacturing controls for advanced materials in regulated medical environments.",
            body: "SGS",
            number: "MDQ-13485-NAK-2026-008",
            valid: "June 30, 2028",
          },
          download: "Download certificate",
          file: "[PDF] iso-13485-nanoker.pdf",
        },
      },
    },

    pages: {
      company: {
        metaTitle: "Nanoker | Company",
        hero: {
          eyebrow: "Company",
          titleHtml:
            "Industrial infrastructure for <span class=\"empresa-accent\">strategic technologies.</span>",
          text:
            "Nanoker is an industrial platform for advanced materials and high-specification components in sectors where qualification cycles are long, failure is expensive, and supply continuity is strategic.",
        },
        mission: {
          title: "Industrial Positioning",
          priorities: {
            title: "What customers need us to solve",
            item1: "Batch-to-batch purity and process stability",
            item2: "Qualification-ready documentation and traceability",
            item3: "Reduced exposure to fragile external supply chains",
            item4: "European industrial scale-up for critical programs",
          },
          who: {
            title: "What Nanoker is built to do",
            item1: "Manufacture advanced ceramic and crystal-based components",
            item2: "Develop proprietary formulations and material routes",
            item3: "Integrate processing, metrology and qualification logic",
            item4: "Support European OEMs in long-cycle critical applications",
          },
        },
        platform: {
          titleHtml: "Integrated <span class=\"empresa-accent\">Platform</span>",
          subtitle: "From material architecture to qualified component",
          card1: "Synthesis, Formulation & Growth",
          card2: "Precision Machining",
          card3: "Surface Engineering & Metrology",
          card4: "QA, Traceability & Control",
        },
        alliance: {
          title: "Strategic Technology Alliance",
          text:
            "Nanoker integrates advanced capabilities in single-crystal diamond growth and atomic-scale doping control, expanding the portfolio toward next-generation quantum, thermal, and semiconductor applications.",
          item1: "CVD Diamond",
          item2: "Silicon Carbide",
          item3: "Sapphire",
          item4: "Extreme Ceramics",
        },
        infrastructure: {
          title: "Industrial Execution Model",
          item1: "Progressive qualification routes aligned with sector requirements",
          item2: "Wave-based industrial scale-up",
          item3: "24/7 operation",
          item4: "Target availability above 95%",
        },
        advantage: {
          title: "European structural advantage",
          subtitle: "Energy, sustainability, and sovereignty",
          text:
            "Advanced-material manufacturing is energy-intensive and capital-sensitive. Operating in a competitive renewable-energy environment with low carbon intensity provides:",
          item1: "Structural cost advantage",
          item2: "CBAM compliance",
          item3: "Access to regulated and demanding markets",
          item4: "European legal certainty and IP protection",
          closingHtml:
            "This is not only a sustainability argument.<br />It is an industrial positioning advantage.",
        },
        approach: {
          title: "Customer engagement model",
          subtitle: "How we move from requirement to industrial execution",
          item1: "Define the critical-to-quality material specification",
          item2: "Validate through metrology, process windows and technical evidence",
          item3: "Qualify under sector-specific constraints and standards",
          item4: "Scale with industrial repeatability and supply continuity",
          text: "We work inside the customer roadmap, not outside it.",
        },
        vision: {
          title: "Vision",
          subtitle: "Strategic infrastructure for European DeepTech",
          textHtml:
            "Europe cannot lead in advanced semiconductors, quantum technologies or defense systems without controlling the materials and process know-how that enable them.<br />Nanoker is building part of that industrial foundation.",
        },
        quote: "Whoever controls the material controls the technology.",
      },
      capabilities: {
        metaTitle: "Nanoker | Capabilities",
        hero: {
          eyebrow: "CAPABILITIES",
          titleHtml: "Integrated Industrial <span class=\"mat-accent\">Capabilities</span>",
          subtitle: "Process control from precursor engineering to qualified component.",
          text:
            "Nanoker combines crystal growth, densification, precision machining and metrology in one industrial flow to deliver specification control, repeatability and scalable output for critical applications.",
        },
        integration: {
          title: "Vertical Integration Architecture",
          subtitle: "From precursor to component",
          intro: "Our industrial platform covers the full process chain required to move from material design to qualified part:",
          item1: "1. Synthesis and formulation",
          item2: "2. Crystal growth",
          item3: "3. Advanced densification",
          item4: "4. Precision machining",
          item5: "5. Surface finishing and CMP",
          item6: "6. Metrology and QA/QC",
          item7: "7. Qualification and scale-up",
          outro: "Vertical integration reduces handoff risk, compresses qualification loops and limits quality variability.",
        },
        synthesis: {
          title: "Synthesis and Formulation",
          subtitle: "Control at the source",
          item1: "Development of proprietary formulations",
          item2: "Purity tuning up to semiconductor grade",
          item3: "Particle-size and microstructure control",
          item4: "Optimization for SPS/HIP and crystal-growth routes",
          outro: "The material is engineered around the application and process window, not adapted afterward.",
        },
        growth: {
          title: "Crystal Growth",
          subtitle: "Advanced growth technologies",
          card1Title: "A) CVD (Chemical Vapor Deposition)",
          card1Item1: "Single-crystal diamond",
          card1Item2: "Atomic-scale defect engineering",
          card1Item3: "NV / B / P doping",
          card1Item4: "Custom multilayer stacks",
          card2Title: "B) PVT / CVD for SiC",
          card2Item1: "High-purity boule growth",
          card2Item2: "Wafering-ready preparation",
          card2Item3: "EPI-compatible substrates",
          card3Title: "C) HME (Horizontal Multi-Edge) for Sapphire",
          card3Item1: "Large-diameter wafers",
          card3Item2: "Low internal stress",
          card3Item3: "High optical uniformity",
        },
        densification: {
          title: "Advanced Densification",
          subtitle: "SPS / HIP",
          card1Title: "A) SPS (Spark Plasma Sintering)",
          card1Item1: "Rapid densification",
          card1Item2: "Nanostructure preservation",
          card1Item3: "High purity",
          card1Item4: "Fine microstructural control",
          card2Title: "B) HIP (Hot Isostatic Pressing)",
          card2Item1: "Residual porosity removal",
          card2Item2: "Improved mechanical properties",
          card2Item3: "Extreme structural stability",
          card3Title: "Applicable to",
          card3Item1: "Aluminas and ATZ-ZTA composites",
          card3Item2: "AlN",
          card3Item3: "Thermal composites",
          card3Item4: "Polycrystalline SiC",
        },
        machining: {
          title: "Precision Machining",
          subtitle: "Fabrication of complex components",
          item1: "EDM on electrically conductive ceramics",
          item2: "Micro-waterjet",
          item3: "Precision grinding",
          item4: "Wire-saw wafering",
          item5: "Complex geometries with critical tolerances",
          outro: "Capability to deliver finished parts ready for integration.",
        },
        finishing: {
          title: "Surface Finishing and CMP",
          subtitle: "Ready-to-Process / Ready-to-Device",
          item1: "Chemical Mechanical Polishing (CMP)",
          item2: "Optical-grade surfaces",
          item3: "\"Device-ready\" finishing",
          item4: "Controlled flatness and roughness",
          criticalTitle: "Critical for:",
          critical1: "SiC wafers",
          critical2: "Semiconductor-grade diamond",
          critical3: "EPI-ready sapphire",
        },
        metrology: {
          title: "Metrology and QA/QC",
          subtitle: "Certified specification",
          item1: "High-precision dimensional control",
          item2: "Microstructural analysis",
          item3: "Optical characterization",
          item4: "Statistical process control",
          item5: "Full traceability",
          outro:
            "Documentation aligned with industrial qualification workflows (6-24 months depending on sector).",
        },
        qualification: {
          title: "Qualification and Scale-Up",
          subtitle: "Qualification before volume",
          flow: "Install -> Qualify -> Stabilize -> Scale",
          item1: "CTQ definition and acceptance logic",
          item2: "Technical validation under use conditions",
          item3: "Yield and process-capability optimization",
          item4: "24/7 operation",
          item5: "Availability >95%",
          outro: "Designed to fit OEM qualification roadmaps and long-cycle industrial programs.",
        },
        advantage: {
          title: "Why this matters commercially",
          subtitle: "Industrial leverage created by capability integration",
          item1: "End-to-end vertical integration",
          item2: "In-house defectology control",
          item3: "Structural energy advantage",
          item4: "European industrial base",
          item5: "Qualification-driven lock-in",
          outro: "The result is a tighter, more defensible supply chain for high-value programs.",
        },
        diagram: {
          title: "Visual Diagram",
          subtitle: "PREMIUM INDUSTRIAL HORIZONTAL INTEGRATION CHAIN",
          svgTitle: "Premium Industrial Horizontal Integration Chain",
          svgDesc:
            "Seven-stage flow: synthesis, crystal growth, densification, machining, finishing, metrology, and industrial qualification.",
          stage1Line1: "SYNTHESIS AND",
          stage1Line2: "FORMULATION",
          stage2Line1: "CRYSTAL",
          stage2Line2: "GROWTH",
          stage3Line1: "ADVANCED",
          stage3Line2: "DENSIFICATION SPS/HIP",
          stage4Line1: "PRECISION",
          stage4Line2: "MACHINING",
          stage5Line1: "FINISHING AND",
          stage5Line2: "CMP",
          stage6Line1: "METROLOGY",
          stage6Line2: "AND QA/QC",
          stage7Line1: "QUALIFICATION",
          stage7Line2: "AND SCALE-UP",
          strip:
            "Diamond | Silicon Carbide | Sapphire | Technical Ceramics | Carbon-Metal Composites",
        },
        closing: {
          title: "DeepTech Industrialization",
          text:
            "In DeepTech, competitive advantage is not secured only in the device architecture. It is secured in the ability to manufacture material with certified specification, industrial repeatability and qualified supply continuity.",
          statement: "Nanoker integrates that capability.",
        },
      },
      rnd: {
        metaTitle: "Nanoker | Research and Innovation",
        hero: {
          eyebrow: "INDUSTRIAL R&D",
          titleHtml: "<span class=\"id-accent id-glow\">Research</span> engineered for industrialization",
          subtitle: "Research creates value only when it can survive qualification and scale-up.",
          text:
            "Our R&D model is designed to convert advanced-material research into manufacturable routes, qualified data and repeatable industrial output.",
        },
        philosophy: {
          title: "Philosophy",
          subtitle: "From laboratory to 24/7 production",
          introHtml:
            "Most advanced-material programs stop at proof of concept.<br />Our model is built to bridge research, qualification and production:",
          card1Title: "High-demand materials",
          card1Claim: "Structure and functionality",
          card1Item1: "Advanced microstructural control",
          card1Item2: "Thermal and mechanical optimization",
          card1Item3: "Formulations for extreme environments",
          card2Title: "Scalable processes",
          card2Claim: "Industry-first design",
          card2Item1: "Reproducible process windows",
          card2Item2: "Statistical manufacturing robustness",
          card2Item3: "Supply-chain compatibility",
          card3Title: "Validation and qualification",
          card3Claim: "Technical evidence",
          card3Item1: "Accelerated verification protocols",
          card3Item2: "Metrology and full traceability",
          card3Item3: "Integration with OEM requirements",
          card4Title: "Diamond and quantum materials",
          card4Item1: "Advanced MPCVD growth",
          card4Item2: "NV-center control",
          card4Item3: "Controlled atomic doping",
          card4Item4: "Multilayer architectures",
          card4ApplicationsTitle: "Applications in:",
          card4Application1: "Quantum sensors",
          card4Application2: "Magnetometry",
          card4Application3: "Power electronics",
          card4Application4: "Extreme thermal management",
          pipeline:
            "Basic research -> Technical validation -> Industrial qualification -> Production scale-up",
          outro:
            "The objective is not only to prove scientific feasibility, but to establish a route to stable industrial manufacturing.",
        },
        areas: {
          title: "Strategic research domains",
          card1Title: "Defect engineering control",
          card1Item1: "Dislocation reduction in crystal growth",
          card1Item2: "Defect engineering in diamond (NV, B, P)",
          card1Item3: "Microstructural optimization in SPS/HIP",
          card1Item4: "Semiconductor-grade purity control",
          card1Text: "In advanced materials, defects define the performance ceiling.",
          card2Title: "Beyond Standard materials",
          card2Text:
            "Development of proprietary formulations that exceed conventional commercial specifications when standard materials are no longer sufficient for thermal, mechanical or reliability targets.",
          card3Title: "Diamond and quantum materials",
          card3Item1: "Advanced MPCVD growth",
          card3Item2: "NV-center control",
          card3Item3: "Controlled atomic doping",
          card3Item4: "Multilayer architectures",
          card3ApplicationsTitle: "Applications in:",
          card3Application1: "Quantum sensors",
          card3Application2: "Magnetometry",
          card3Application3: "Power electronics",
          card3Application4: "Extreme thermal management",
          card4Title: "SiC and WBG",
          card4Item1: "PVT/CVD growth optimization",
          card4Item2: "Defect reduction in substrates",
          card4Item3: "Advanced densification",
          card4Item4: "EPI-ready preparation",
          card4Text:
            "Focused on wide-bandgap semiconductors and high-efficiency electronics.",
          card5Title: "Material-device integration",
          card5Item1: "Thermal interfaces",
          card5Item2: "Compatibility with fab processes",
          card5Item3: "Plasma stability",
          card5Item4: "Component-ready fabrication",
          card5Text:
            "We do not research isolated materials; we engineer real system integration.",
        },
        infrastructure: {
          title: "R&D infrastructure",
          subtitle: "Experimental platforms with industrial intent",
          item1: "MPCVD reactors",
          item2: "SPS/HIP",
          item3: "Crystal-growth systems",
          item4: "Characterization laboratories",
          item5: "Advanced metrology",
          outro:
            "Facilities are configured to shorten transfer from experimental validation to industrial implementation.",
        },
        collaboration: {
          title: "Scientific and industrial collaboration",
          subtitle: "European ecosystem",
          intro: "We work with:",
          item1: "Research centers",
          item2: "Universities",
          item3: "Industrial OEMs",
          item4: "European strategic programs",
          outro:
            "Scientific collaboration is valuable only if it translates into validated industrial capability.",
        },
        roadmap: {
          title: "Technology roadmap",
          subtitle: "Industrialization in waves",
          item1: "Phase 1 - Development and qualification",
          item2: "Phase 2 - Process stabilization",
          item3: "Phase 3 - Industrial scale-up",
          item4: "Phase 4 - Continuous 24/7 operations",
          outro: "Every R&D advance is designed for production integration.",
        },
        impact: {
          title: "Strategic impact",
          subtitle: "Material infrastructure for technological sovereignty",
          intro: "Europe cannot lead in:",
          item1: "Advanced semiconductors",
          item2: "Quantum technologies",
          item3: "Next-generation defense",
          item4: "Integrated photonics",
          text: "Without controlling the materials that enable them.",
          outroHtml: "Our R&D is not disconnected from industry.<br />It is structural industrial capability in formation.",
        },
        closing: {
          title: "Final message",
          subtitle: "Research with industrial purpose",
          text:
            "The difference between laboratory output and industrial leadership is the ability to manufacture with certified specification, process stability and repeatable qualification outcomes.",
          statement: "That is where we focus our research.",
        },
      },
      materials: {
        metaTitle: "Nanoker | Materials",
        hero: {
          eyebrow: "MATERIALS",
          titleHtml: "Strategic <span style=\"color: #3B82F6;\">DeepTech</span> Materials",
          text1:
            "Material control defines performance, qualification risk and industrial scalability in critical technologies.",
          text2:
            "Nanoker integrates a portfolio of advanced materials that supports the physical layer of Europe’s next DeepTech wave: wide-bandgap semiconductors, advanced photonics, quantum sensing, defense and high-efficiency power systems.",
        },
        philosophy: {
          title: "Philosophy",
          subtitle: "Material architecture, not catalog commodity",
          text: "We do not position materials as interchangeable catalog references. We engineer them:",
          item1: "With controlled purity",
          item2: "With optimized defect engineering",
          item3: "With designed functional properties",
          item4: "With full traceability",
          item5: "Ready for industrial qualification",
          deliverHtml:
            "Each material is delivered as <span class=\"mat-glow\">component-ready</span> or <span class=\"mat-glow\">device-ready</span>, aligned with real qualification pathways.",
        },
        portfolio: {
          title: "Materials Portfolio",
          diamond: {
            title: "CVD DIAMOND (Poly & Single Crystal)",
            claim: "The extreme-performance material",
            text:
              "Diamond is the semiconductor with the highest thermal conductivity, highest breakdown field, and highest known hardness.",
            capabilitiesTitle: "Key capabilities",
            capability1: "MPCVD growth with proprietary technology",
            capability2: "Single crystal up to 4\" (scalable)",
            capability3: "Atomic-scale defect control",
            capability4: "On-demand doping (NV / B / P)",
            capability5: "Customized multilayer stacks",
            gradesTitle: "Available grades",
            grade1: "Quantum Grade (controlled NV centers)",
            grade2: "Thermal Grade (extreme heat spreading)",
            grade3: "Optical Grade (broad UV-IR transmission)",
            grade4: "Semiconductor Grade (SBD / FET ready)",
            applicationsTitle: "Applications",
            application1: "Quantum sensors",
            application2: "Magnetometry",
            application3: "RF thermal management",
            application4: "Power electronics",
            application5: "Optical and X-ray windows",
          },
          sic: {
            title: "SILICON CARBIDE (SiC)",
            claim: "The backbone of power electronics",
            text:
              "Critical material for WBG (Wide Band Gap), high efficiency, and operation above 200C.",
            capabilitiesTitle: "Capabilities",
            capability1: "PVT / evo growth",
            capability2: "4H-SiC substrates",
            capability3: "EPI-ready",
            capability4: "SPS/HIP densification for structural substrate-grade applications",
            capability5: "Wafering + CMP",
            advantagesTitle: "Advantages",
            advantage1: "Reduced energy losses",
            advantage2: "Higher power density",
            advantage3: "European industrial scalability",
            applicationsTitle: "Applications",
            application1: "EV inverters",
            application2: "High-efficiency converters",
            application3: "High-frequency RF",
            application4: "Fab-grade components",
          },
          sapphire: {
            title: "SAPPHIRE (Monocrystalline Al2O3)",
            claim: "High-stability optics and electronics",
            text:
              "Strategic material for optical applications and SOS (Silicon-on-Sapphire).",
            capabilitiesTitle: "Capabilities",
            capability1: "KV growth",
            capability2: "Wafers up to 8\"",
            capability3: "EPI-ready",
            capability4: "High-transmission optics",
            capability5: "Low internal stress",
            applicationsTitle: "Applications",
            application1: "SOS (rad-hard electronics)",
            application2: "Optical windows",
            application3: "IR domes",
            application4: "Integrated photonics",
          },
          ceramics: {
            title: "TECHNICAL CERAMICS SPS / HIP",
            claim: "Beyond Standard Ceramics",
            text:
              "Nanoker develops proprietary formulations that outperform conventional commercial specifications.",
            materialsTitle: "Materials",
            material1: "Aluminas 92/96/99.7/99.8/99.99% purity",
            material2: "Zirconias (YTZP, MgPSZ, YFSZ, CaPSZ, CaFSZ)",
            material3: "AlN",
            material4: "ATZ / ZTA composites",
            material5: "CeTZP-A nanocomposites",
            material6: "Electroconductive composites (EDM)",
            material7: "Thermal composites (Graphite-Mo/Cr, KALMAN, KBNC, Diamond-Cu/Al)",
            material8: "Zero-CTE LAS-SiC composites",
            capabilitiesTitle: "Capabilities",
            capability1: "SPS (Spark Plasma Sintering)",
            capability2: "HIP",
            capability3: "Pressure fitting",
            capability4: "Chemical synthesis",
            capability5: "High-precision machining",
            capability6: "EDM machining",
            capability7: "Micro-waterjet",
            applicationsTitle: "Applications",
            application1: "Plasma-resistant components",
            application2: "Thermal management",
            application3: "Transparent shielding",
            application4: "Medical devices",
            application5: "Extreme structural components",
          },
          bioceramics: {
            title: "BIOCERAMICS",
            claim: "Materials for longevity and biocompatibility",
            text:
              "Designed for advanced medical devices under stringent regulatory frameworks.",
            capabilitiesTitle: "Capabilities",
            capability1: "ISO 13485",
            capability2: "Full traceability",
            capability3: "Integration with sensors and digital systems",
            applicationsTitle: "Applications",
            application1: "Implants",
            application2: "Image-guided surgery",
            application3: "Interventional oncology",
          },
        },
        differential: {
          title: "Differential Advantage",
          subtitle: "Industrial control across the full chain",
          stage1: "Synthesis and Formulation",
          stage2: "Crystal Growth (CVD/PVT/HME)",
          stage3: "Advanced Densification (SPS/HIP)",
          stage4: "Precision Machining",
          stage5: "Surface Finishing and CMP",
          stage6: "Metrology and QA/QC",
          stage7: "Qualification and Industrial Scale-Up",
          strip:
            "Diamond | Silicon Carbide | Sapphire | Technical Ceramics | Carbon-Metal Composites",
          text: "This creates concrete industrial advantages:",
          item1: "Reduced supply and handoff risk",
          item2: "Better total cost of ownership",
          item3: "Faster alignment with qualification workflows",
          item4: "Higher batch-to-batch stability",
        },
        map: {
          title: "Visual Map",
          layer1: "APPLICATIONS",
          layer2: "STRATEGIC MATERIALS",
          layer3: "INDUSTRIAL CAPABILITIES",
          top1Html: "<tspan x=\"110\" dy=\"0\">Quantum</tspan><tspan x=\"110\" dy=\"15\">Technologies</tspan>",
          top2Html: "<tspan x=\"290\" dy=\"0\">Photonics &amp;</tspan><tspan x=\"290\" dy=\"15\">Optics</tspan>",
          top3Html: "<tspan x=\"470\" dy=\"0\">Semiconductors</tspan><tspan x=\"470\" dy=\"15\">(WBG)</tspan>",
          top4Html: "<tspan x=\"650\" dy=\"0\">Defense &amp;</tspan><tspan x=\"650\" dy=\"15\">Aerospace</tspan>",
          top5Html: "<tspan x=\"830\" dy=\"0\">Energy &amp;</tspan><tspan x=\"830\" dy=\"15\">Power</tspan>",
          top6Html: "<tspan x=\"1010\" dy=\"0\">Medical</tspan><tspan x=\"1010\" dy=\"15\">Devices</tspan>",
          top7Html:
            "<tspan x=\"1190\" dy=\"0\">Scientific</tspan><tspan x=\"1190\" dy=\"15\">Infrastructure</tspan>",
          mid1Html: "<tspan x=\"170\" dy=\"0\">Diamond CVD</tspan><tspan x=\"170\" dy=\"14\">(poly / sc)</tspan>",
          mid2: "Silicon Carbide",
          mid3: "Sapphire",
          mid4Html:
            "<tspan x=\"970\" dy=\"0\">Technical Ceramics</tspan><tspan x=\"970\" dy=\"14\">(Alumina, AlN, B₄C)</tspan>",
          mid5Html: "<tspan x=\"1230\" dy=\"0\">Carbon-Metal</tspan><tspan x=\"1230\" dy=\"14\">Composites</tspan>",
          bottom1Html:
            "<tspan x=\"140\" dy=\"0\">Crystal Growth</tspan><tspan x=\"140\" dy=\"15\">(CVD / PVT / HME)</tspan>",
          bottom2: "SPS / HIP",
          bottom3Html: "<tspan x=\"580\" dy=\"0\">Precision</tspan><tspan x=\"580\" dy=\"15\">Machining</tspan>",
          bottom4Html: "<tspan x=\"800\" dy=\"0\">CMP &amp; Surface</tspan><tspan x=\"800\" dy=\"15\">Engineering</tspan>",
          bottom5Html: "<tspan x=\"1020\" dy=\"0\">QA/QC &amp;</tspan><tspan x=\"1020\" dy=\"15\">Traceability</tspan>",
          bottom6Html: "<tspan x=\"1240\" dy=\"0\">Industrial</tspan><tspan x=\"1240\" dy=\"15\">Scale-Up</tspan>",
        },
        europe: {
          title: "DeepTech Materials for Europe",
          text1:
            "Strategic materials are not interchangeable inputs. They are industrial infrastructure.",
          text2:
            "Controlling diamond, SiC, sapphire, and advanced ceramics in Europe means:",
          item1: "Reducing external dependency",
          item2: "Securing industrial continuity",
          item3: "Strengthening technological sovereignty",
          closing: "Nanoker is building that materials foundation.",
        },
        datasheets: {
          title: "Technical Datasheets",
          subtitle: "Technical references for engineering review",
          text:
            "Access ceramic datasheets directly within the materials portfolio. Filter by family to review relevant references faster during specification and sourcing.",
          filters: {
            all: "All",
            alumina: "Alumina",
            zirconia: "Zirconia",
            carbides: "Carbides",
            composites: "Composites",
            nanocomposites: "Nanocomposites",
          },
          categoryLabel: "Category",
          cta: "View PDF",
          empty: "No datasheets available in this category.",
        },
      },
      sectors: {
        metaTitle: "Nanoker | Sectors",
        hero: {
          titleHtml: "<span class=\"accent\">Sectors</span>",
          subtitle:
            "Advanced materials for industries where reliability depends on controlling material functionality.",
          intro:
            "Nanoker supports sectors where material choice directly affects qualification time, operating reliability and supply resilience.",
        },
        industry: {
          title: "Industry and Advanced Manufacturing",
          phrase: "Materials engineered for uptime, wear resistance and repeatable production.",
          text:
            "Advanced manufacturing requires materials capable of operating under wear, corrosion, high temperatures, and continuous mechanical stress.",
          challengesTitle: "Challenges",
          challenge1: "Wear and abrasion",
          challenge2: "High-temperature stability",
          challenge3: "Controlled thermal conductivity",
          challenge4: "Dimensional precision",
          challenge5: "Batch-to-batch repeatability",
          solutionsTitle: "Industrial responses",
          solution1: "Advanced technical ceramics",
          solution2: "Thermal functional composites",
          solution3: "Industrial precision components",
          materialsTitle: "Key materials",
          material1: "Alumina at 92/96/99.7/99.8/99.99% purity",
          material2: "Zirconia (YTZP, CeTZP, CaPSZ, MgPSZ, YFSZ)",
          material3: "Composites (ATZ, ZTA, ATiCSiC, ZTiN)",
          material4: "B4C, SiC, Si3N4, TiB2",
          material5: "AlN and machinable AlN",
          material6: "Graphite-Mo/Cr and Diamond-Cu/Al composites",
          casesTitle: "Use cases",
          case1: "EDM components",
          case2: "Structural heat sinks",
          case3: "Automation parts",
        },
        energy: {
          title: "Energy and Power Electronics",
          phrase:
            "Materials for high power density, thermal stress and long operating life.",
          challengesTitle: "Challenges",
          challenge1: "Extreme thermal management",
          challenge2: "Electrical insulation with high thermal conductivity",
          challenge3: "Operation above 200C",
          challenge4: "Reduction of Joule losses",
          challenge5: "Long-term reliability",
          solutionsTitle: "Solutions",
          solution1: "SiC WBG",
          solution2: "Thermal-grade CVD diamond",
          solution3: "High-conductivity AlN",
          solution4: "Machinable AlN",
          solution5: "Thermal composites",
          materialsTitle: "Materials",
          material1: "SiC (poly & SC)",
          material2: "CVD diamond (thermal grade)",
          material3: "AlN and machinable AlN (Shapal-type)",
          material4: "Carbon-metal composites: Graphite-Mo/Cr, Diamond-Cu/Al",
          casesTitle: "Use cases",
          case1: "Heat sinks for power modules",
          case2: "Thermal components for aerospace systems",
          case3: "High-frequency electronics",
          applicationsTitle: "Applications",
          application1: "Power heat sinks",
          application2: "Aerospace electronics",
          application3: "High frequency",
        },
        health: {
          title: "Health and Medical Devices",
          phrase:
            "Technical ceramics and bioceramics for regulated applications where traceability and consistency are mandatory.",
          text:
            "The biomedical sector requires biocompatible, stable, and fully traceable materials under strict standards (ISO 13485, MDR). Nanoker contributes validated industrial expertise in high-precision devices.",
          challengesTitle: "Challenges",
          challenge1: "Certified biocompatibility",
          challenge2: "Mechanical and chemical stability",
          challenge3: "Integration with electronic systems",
          challenge4: "Full traceability",
          solutionsTitle: "Solutions",
          solution1: "Biomedical-grade bioceramics",
          solution2: "Biomedical-grade biocompatible nanocomposites",
          solution3: "Complex components for image-guided surgery",
          solution4: "Implants and interventional systems",
          materialsTitle: "Materials",
          material1: "Biomedical-grade alumina",
          material2: "Biomedical-grade YTZP zirconia",
          material3: "ATZ and TZP composites",
          material4: "CeTZP-A nanocomposites",
          casesTitle: "Use cases",
          case1: "Screws for image-guided brain surgery",
          case2: "Components for interventional oncology",
          case3: "Inperio implant",
          case4: "Cerioss system",
        },
        semiconductors: {
          title: "Semiconductors and Manufacturing Equipment",
          phrase:
            "Fab-grade materials for process-critical environments with control of specification, defects and traceability.",
          text:
            "DeepTech industrialization depends on materials with extreme purity, batch-to-batch stability, and scale-up capability. Nanoker integrates technical ceramics with strategic substrates such as SiC, diamond, and sapphire.",
          challengesTitle: "Challenges",
          challenge1: "Semiconductor-grade purity",
          challenge2: "Defect control",
          challenge3: "Plasma-attack resistance",
          challenge4: "Lead-time reduction",
          challenge5: "Independence from external suppliers",
          solutionsTitle: "Solutions",
          solution1: "SiC wafers and components",
          solution2: "CVD diamond (thermal / quantum / optical grade)",
          solution3: "EPI-ready sapphire",
          solution4: "SPS/HIP ceramics for extreme environments",
          capabilitiesTitle: "Key capabilities",
          capability1: "MPCVD",
          capability2: "KV",
          capability3: "PVT",
          capability4: "SPS/HIP",
          capability5: "NV / B / P doping",
          capability6: "CMP and device-ready finishing",
          capability7: "Full QA/QC",
          casesTitle: "Use cases",
          case1: "Components for EUV systems",
          case2: "Plasma-resistant ceramics",
          case3: "Diamond for RF thermal management",
        },
        photonics: {
          title: "Photonics and Advanced Optics",
          phrase:
            "Optical materials for high power, spectral stability and precision surfaces.",
          text:
            "Advanced photonics requires materials with low absorption, high transmission, and exceptional thermal stability.",
          challengesTitle: "Challenges",
          challenge1: "High laser power",
          challenge2: "UV / IR / THz transmission",
          challenge3: "Chemical resistance",
          challenge4: "Optical precision",
          solutionsTitle: "Solutions",
          solution1: "Optical diamond",
          solution2: "Optical sapphire",
          solution3: "ALON and spinels",
          solution4: "Integrated photonics in AlN",
          applicationsTitle: "Applications",
          application1: "X-ray windows",
          application2: "IR domes",
          application3: "High-power laser",
          application4: "Multi-wavelength spectroscopy",
        },
        quantum: {
          title: "Quantum and Next-Generation Sensors",
          phrase:
            "Enabling materials for quantum devices and ultra-precision sensing architectures.",
          text:
            "Diamond with NV centers enables magnetometry, GPS-denied navigation, and high-sensitivity sensing without cryogenics.",
          challengesTitle: "Challenges",
          challenge1: "Atomic-scale defect control",
          challenge2: "Precise doping",
          challenge3: "Thermal stability",
          challenge4: "Industrial scalability",
          solutionsTitle: "Solutions",
          solution1: "NV-grade diamond",
          solution2: "On-demand doping (B / P / N)",
          solution3: "Custom multilayer structures",
          applicationsTitle: "Applications",
          application1: "Quantum gyroscopes",
          application2: "Advanced magnetometry",
          application3: "Sensors in hostile environments",
        },
        defense: {
          title: "Aerospace, Defense and Space",
          phrase: "Materials for mission-critical systems where failure is not an option.",
          challengesTitle: "Challenges",
          challenge1: "Radiation",
          challenge2: "Extreme temperatures",
          challenge3: "Transparent shielding",
          challenge4: "Critical thermal management",
          challenge5: "Zero or custom CTE",
          solutionsTitle: "Solutions",
          solution1: "ALON",
          solution2: "CVD diamond",
          solution3: "Structural SiC",
          solution4: "B4C",
          solution5: "LAS-SiC",
          applicationsTitle: "Applications",
          application1: "Radar",
          application2: "IR sensors",
          application3: "Rad-hard electronics",
          application4: "Advanced ballistic protection",
        },
        science: {
          title: "Science and Infrastructure",
          phrase:
            "Materials and components for large scientific facilities and advanced instrumentation under extreme constraints.",
          text:
            "Big Science demands extreme dimensional stability, material purity, and reliability under non-standard industrial conditions.",
          challengesTitle: "Challenges",
          challenge1: "Radiation environments",
          challenge2: "Vacuum and plasma",
          challenge3: "Thermal stability",
          challenge4: "Ultra-stable components",
          solutionsTitle: "Solutions",
          solution1: "CERN-grade ceramics",
          solution2: "Radiation windows",
          solution3: "Advanced thermal composites",
          applicationsTitle: "Applications",
          application1: "Detectors",
          application2: "Collimation systems",
          application3: "Scientific instrumentation",
        },
        cta: "Discuss your sector requirements with Nanoker engineering.",
      },
    },

    ui: {
      viewDetails: "View details",
      arrow: "→",
    },

    // ✅ Sections used by index.html (sections.*)
    sections: {
      bottleneck: {
        tag: "01 · Market Bottleneck",
        titleHtml: "The bottleneck<br /><b>is materials.</b>",
        text:
          "Equipment can be designed quickly. But producing materials with extreme purity, defect control and batch-to-batch stability takes years of development. In DeepTech, the real constraint is the material.",
        specs: {
          risk: "Risk",
          riskVal: "Supply",
          variation: "Variation",
          variationVal: "Batch",
          leadtime: "Lead time",
          leadtimeVal: "Long",
          impact: "Impact",
          impactVal: "System",
        },
        cta: "See the integrated solution",
      },

      platform: {
        tag: "02 · Integrated Platform",
        titleHtml: "Integrated platform<br /><b>for advanced materials.</b>",
        text:
          "We vertically integrate the full chain to deliver materials and components with certified specification, industrial repeatability, and European supply continuity.",
        specs: {
          synthesis: "Synthesis",
          synthesisVal: "In-house",
          growth: "Growth",
          growthVal: "CVD / PVT / KY",
          densification: "Densification",
          densificationVal: "SPS / HIP",
          qaqc: "QA/QC",
          qaqcVal: "Full",
        },
        cta: "See strategic materials",
      },

      strategic: {
        tag: "03 · Strategic Materials",
        titleHtml: "Strategic materials<br /><b>DeepTech.</b>",
        text:
          "An integrated portfolio of critical materials for industries where performance depends on material control: CVD diamond, SiC, sapphire and technical ceramics (SPS/HIP).",
        tiles: {
          diamond: {
            title: "CVD Diamond",
            text: "Quantum / Thermal / Optical. NV/B/P control.",
          },
          sic: {
            title: "Silicon Carbide (SiC)",
            text: "SC wafers + PC components for WBG and extreme environments.",
          },
          sapphire: {
            title: "Sapphire",
            text: "EPI-ready, SOS, optics and advanced electronics.",
          },
          ceramics: {
            title: "SPS/HIP Ceramics",
            text: "Beyond standard for plasma, thermal and precision.",
          },
        },
        cta: "See application sectors",
      },

      capabilities: {
        tag: "04 · Industrial Capabilities",
        titleHtml: "Industrial capabilities<br /><b>built for specification control.</b>",
        text:
          "Nanoker combines strategic materials, precision processes and industrial discipline to move from feasibility to repeatable production without losing control of specification.",
        specs: {
          materials: "MATERIALS",
          materialsVal: "SiC / CVD diamond / ceramics / sapphire",
          processes: "PROCESSES",
          processesVal: "Growth / densification / machining / metrology",
          precision: "PRECISION",
          precisionVal: "Tight tolerances and controlled finishing routes",
          scale: "SCALABILITY",
          scaleVal: "Qualification-ready scale-up",
        },
        cards: {
          materials: {
            label: "Material stack",
            title: "Critical materials under one industrial flow",
            text: "SiC, CVD diamond, technical ceramics and sapphire aligned to application-specific performance windows.",
          },
          manufacturing: {
            label: "Manufacturing",
            title: "From synthesis and growth to finished component",
            text: "Crystal growth, SPS/HIP densification, precision machining, polishing and metrology integrated to reduce handoff risk.",
          },
          precision: {
            label: "Precision",
            title: "Tolerance discipline for critical assemblies",
            text: "Dimensional control, surface finishing and batch repeatability designed to support qualification and downstream integration.",
          },
          scale: {
            label: "Industrial scale",
            title: "Scalable output with qualification logic",
            text: "Industrialization paths designed for pilot runs, documentation packages and progressive volume ramp without requalifying the full stack.",
          },
        },
        cta: "See industrial readiness",
      },

      readiness: {
        tag: "05 · Trust and Readiness",
        titleHtml: "Industrial readiness<br /><b>customers can qualify.</b>",
        text:
          "Credibility in critical sectors is built on documentation, process control and compliance discipline. Nanoker structures delivery around what quality teams and procurement teams need to approve.",
        items: {
          spec: {
            title: "Guaranteed specification",
            text: "Controlled material and component specifications tied to agreed technical requirements.",
          },
          traceability: {
            title: "Traceability",
            text: "Lot-level traceability from precursor, process route and inspection record to delivered component.",
          },
          qc: {
            title: "Quality control",
            text: "Incoming, in-process and final inspection logic designed to detect deviation before it becomes system risk.",
          },
          compliance: {
            title: "Compliance and standards",
            text: "Industrial controls and documentation aligned with qualification, audits and regulated manufacturing environments.",
          },
        },
        cta: "See strategic sectors",
      },

      sectors: {
        tag: "06 · Strategic Sectors",
        titleHtml: "Sectors where material control<br /><b>becomes strategic leverage.</b>",
        text:
          "Aerospace, defense, energy and advanced industry are not just end markets. They are strategic programs where qualified materials determine readiness, resilience and system-level advantage.",
        cards: {
          aerospace: {
            label: "Aerospace",
            title: "Flight-qualified reliability starts at material level",
            text: "Thermal stability, lightweight architectures and dimensional consistency for high-consequence environments.",
          },
          defense: {
            label: "Defense",
            title: "Supply resilience for sovereign critical systems",
            text: "Materials and components engineered for harsh environments, controlled supply and qualification-sensitive programs.",
          },
          energy: {
            label: "Energy",
            title: "Efficiency and thermal control where uptime is non-negotiable",
            text: "SiC, thermal diamond and advanced ceramics supporting power density, reliability and long operating windows.",
          },
          industry: {
            label: "Advanced industry",
            title: "Process stability for next-generation industrial equipment",
            text: "Precision components and engineered materials for wear, plasma, corrosion and high-throughput production environments.",
          },
        },
        specs: {
          positioning: "POSITIONING",
          positioningVal: "Strategic programs",
          requirement: "COMMON REQUIREMENT",
          requirementVal: "Qualified reliability",
          value: "VALUE DRIVER",
          valueVal: "Material control",
          outcome: "PROGRAM OUTCOME",
          outcomeVal: "Readiness and supply resilience",
        },
        cta: "See industrial transfer model",
      },

      rnd: {
        tag: "08 · R&D to 24/7",
        titleHtml: "From research<br /><b>to 24/7 production.</b>",
        text:
          "15+ years in materials science oriented to industrialization: experimental development, validation, customer qualification (6–24 months) and progressive scale-up in waves.",
        specs: {
          qual: "Qualification",
          qualVal: "6–24 m",
          model: "Model",
          modelVal: "Waves",
          uptime: "Availability",
          uptimeVal: ">95%",
          ops: "Operations",
          opsVal: "24/7",
        },
        cta: "European structural advantage",
      },
    },

    // ✅ Advantages used by index.html (advantages.*)
    advantages: {
      tag: "BLOCK 7 · COMPETITIVE ADVANTAGE",
      titleHtml: "Structural<br /><b>advantages.</b>",
      subtitle:
        "Vertical integration + certified specification + European supply security. Critical materials are not interchangeable: they are technological infrastructure.",
      items: [
        {
          title: "Vertical integration",
          text: "Full control of process, metrology and QA/QC.",
        },
        {
          title: "Energy advantage",
          text: "Optimized and competitive energy-intensive production.",
        },
        {
          title: "CBAM-ready & sustainability",
          text: "Aligned with defense, aerospace and the green transition.",
        },
        {
          title: "European IP protection",
          text: "Robust legal framework and proximity to strategic customers.",
        },
      ],
      closing:
        "Europe cannot lead in semiconductors, quantum or defense while relying on external chains for critical materials. Nanoker helps build that industrial base.",
      cta: "View strategic message",
    },

    sovereignty: {
      tag: "BLOCK 9 · STRATEGIC MESSAGE",
      titleHtml: "European technological<br /><b>sovereignty</b>",
      text1:
        "Europe cannot lead in semiconductors, quantum or defense while depending on external supply chains for critical materials.",
      text2:
        "<b>Nanoker</b> helps build a European industrial infrastructure capable of guaranteeing quality, cost and supply in strategic sectors.",
      cta: "Go to final CTA",
    },

    finalCta: {
      tag: "BLOCK 10 · FINAL CTA",
      titleHtml: "Are you developing<br /><b>a critical technology?</b>",
      text:
        "Tell us about your application and let us work together on the material architecture that makes it viable.",
      primary: "Start technical evaluation",
      secondary: "Contact",
    },

    // ✅ Footer used by index.html (footer.*)
    footer: {
      brandTitle: "nanoker",
      brandTextHtml:
        "European industrial platform for critical technologies.<br/>Advanced materials with guaranteed specification, full traceability and industrial scalability.",
      noteHtml:
        "<b>Technical contact:</b> we process requests within <b>3–5 business days</b>.",

      colSite: {
        title: "Site",
        links: {
          home: "Home",
          company: "Company",
          sectors: "Sectors",
          materials: "Materials",
          capabilities: "Capabilities",
          rnd: "R&D",
          contact: "Contact",
        },
      },

      colHubs: {
        title: "Industrial Hubs",
        links: {
          oviedo: "Oviedo — Development & Validation",
          leon: "León — Industrial Hub",
          supply: "European Supply",
        },
      },

      colPolicies: {
        title: "Policies",
        links: {
          quality: "Quality",
          sustainability: "Sustainability",
          occupationalSafety: "Occupational safety",
          infoSecurity: "Information security",
          ethicsCompliance: "Ethics & compliance",
          equalityDiversity: "Equality & diversity",
          certifications: "Certifications →",
        },
      },

      colConnect: {
        title: "Connect",
        email: "info@nanoker.com",
        phone: "+34 985 000 000",
        address: "Parque Empresarial de Oviedo, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain",
        links: {
          linkedin: "LinkedIn ↗",
        },
      },

      system: {
        label: "SYSTEM STATUS:",
        value: "OPERATIONAL",
      },

      legal: {
        copyright: "© 2026 Nanoker Research S.L.",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        notice: "Legal Notice",
      },
    },

    legalCommon: {
      summary: "Summary",
      moreInfo: "More information",
      footerLegalTitle: "Legal",
    },

    cookieBanner: {
      title: "Cookies",
      description: "We use cookies to improve your experience and analyze website usage.",
      accept: "Accept",
      reject: "Reject",
      learnMore: "Learn more",
    },

    privacy: {
      metaTitle: "Privacy Policy | Nanoker",
      metaDescription:
        "Nanoker Research S.L. Privacy Policy with information on the data controller, purposes, legal basis, retention, user rights, and security.",
      ogLocale: "en_US",
      hero: {
        kicker: "Legal / GDPR",
        titleHtml: "Privacy <span>Policy</span>",
        lead:
          "This policy explains how Nanoker Research S.L. collects, uses, retains, and protects personal data obtained through the corporate website and the professional communications connected to its activity.",
        metaUpdated: "Last updated: March 24, 2026",
        metaLaw: "Framework: GDPR and Spanish data protection law",
        metaScope: "Scope: corporate website and business contact",
      },
      sections: {
        controller: {
          title: "1. Data Controller",
          labelCompany: "Controller",
          valueCompany: "Nanoker Research S.L.",
          labelAddress: "Address",
          valueAddress: "Parque Empresarial de Oviedo, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain.",
          labelEmail: "Email",
          valueEmail: "info@nanoker.com",
          labelPhone: "Phone",
          valuePhone: "+34 985 000 000",
        },
        purpose: {
          title: "2. Purpose of Processing",
          p1: "We process personal data to handle enquiries, manage business and technical opportunities, maintain contractual relationships, and protect the security of the website and corporate communications.",
          p2: "When users submit information through forms, email, or phone calls, the data is used solely to respond, process the request, or support the relevant professional relationship.",
        },
        legalBasis: {
          title: "3. Legal Basis",
          item1: "The data subject's consent when requests are submitted or optional processing is accepted.",
          item2: "Pre-contractual measures to prepare proposals, technical assessments, or quotations.",
          item3: "Performance of a contract when a commercial or supply relationship exists.",
          item4: "Compliance with legal obligations in corporate, tax, or regulatory matters.",
          item5: "Legitimate interest in preserving the security, continuity, and traceability of corporate activity.",
        },
        retention: {
          title: "4. Data Retention",
          p1: "Data is retained only for as long as strictly necessary to fulfil the purpose for which it was collected and, afterwards, for the legally required retention periods.",
          item1: "General enquiries: up to 24 months from the last interaction.",
          item2: "Commercial or technical requests: while the opportunity remains active and for the applicable legal defence periods.",
          item3: "Contractual and administrative data: for the statutory corporate, tax, and accounting retention periods.",
          item4: "Processing based on consent: until consent is withdrawn or the data is no longer needed.",
        },
        rights: {
          title: "5. User Rights",
          p1: "Data subjects may exercise their rights of access, rectification, erasure, objection, restriction of processing, portability, and withdrawal of consent.",
          p2: 'To do so, they may contact <a href="mailto:info@nanoker.com">info@nanoker.com</a>. They may also lodge a complaint with the <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Spanish Data Protection Agency</a> if they believe the processing does not comply with applicable law.',
        },
        security: {
          title: "6. Security",
          p1: "Nanoker applies reasonable technical and organisational measures to prevent loss, alteration, unauthorised access, or improper disclosure of data. These measures include access controls, supplier reviews, internal procedures, and incident monitoring.",
          p2: "However, no Internet-connected environment can guarantee absolute security, so protection is applied under a standard of diligence and continuous improvement.",
        },
      },
      summary: {
        item1Title: "Controller",
        item1Text: "Nanoker Research S.L.",
        item2Title: "Purpose",
        item2Text: "Contact, business management, operations, and security.",
        item3Title: "Legal basis",
        item3Text: "Consent, contract, legal obligation, and legitimate interest.",
        item4Title: "Rights",
        item4Text: "Access, rectification, erasure, objection, restriction, and portability.",
      },
      more: {
        cookiesTitle: "Cookie Policy",
        cookiesText: "Use of cookies, similar technologies, and consent management.",
        noticeTitle: "Legal Notice",
        noticeText: "Terms of use, intellectual property, and liability.",
      },
    },

    cookies: {
      metaTitle: "Cookie Policy | Nanoker",
      metaDescription:
        "Nanoker Cookie Policy explaining what cookies are, the types of cookies used, third-party cookies, and how to manage them.",
      ogLocale: "en_US",
      hero: {
        kicker: "Legal / Cookies",
        titleHtml: "Cookie <span>Policy</span>",
        lead:
          "This policy explains the use of cookies and similar technologies on the Nanoker website, their purpose, the possible involvement of third parties, and the options available to manage them.",
        metaUpdated: "Last updated: March 24, 2026",
        metaLaw: "Framework: GDPR, LSSI-CE, and AEPD guidance",
        metaScope: "Scope: website browsing",
      },
      sections: {
        definition: {
          title: "1. What Cookies Are",
          p1: "Cookies are small files downloaded to the user's device when accessing a website. They are used to store and retrieve information about browsing activity, remember preferences, or enable certain technical services.",
          p2: "In addition to cookies, the site may use equivalent technologies such as browser local storage to retain basic interface settings.",
        },
        types: {
          title: "2. Types of Cookies",
          item1: "<strong>Technical:</strong> required for basic operation, security, browsing, and session handling.",
          item2: "<strong>Preferences:</strong> remember settings such as language or display options.",
          item3: "<strong>Analytics:</strong> help measure site usage and improve performance.",
          item4: "<strong>Marketing:</strong> intended for advertising tracking and commercial personalisation.",
        },
        thirdParty: {
          title: "3. Third-Party Cookies",
          p1: "Certain services integrated into the site may set third-party cookies, such as analytics tools, maps, embedded video, or external platforms. In those cases, cookie management and duration depend on each provider.",
          p2: "In the website's current configuration, Nanoker does not enable advertising cookies by default. If optional third-party services subject to consent are added, users will be informed in advance and the corresponding consent mechanism will be enabled.",
        },
        manage: {
          title: "4. How to Manage Them",
          p1: "Users can allow, block, or delete cookies through their browser settings. Disabling certain technical cookies may affect the proper operation of the site.",
          item1: "Chrome: privacy and security settings.",
          item2: "Firefox: privacy and cookies preferences.",
          item3: "Safari: website data and cookie management.",
          item4: "Edge: site permissions and browsing data removal.",
        },
      },
      summary: {
        item1Title: "Technical cookies",
        item1Text: "Required for security, browsing, and core functionality.",
        item2Title: "Optional cookies",
        item2Text: "Analytics or third-party cookies only where applicable and with prior notice.",
        item3Title: "Management",
        item3Text: "Users can configure or delete cookies through their browser.",
      },
      more: {
        privacyTitle: "Privacy Policy",
        privacyText: "Personal data processing and user rights.",
        noticeTitle: "Legal Notice",
        noticeText: "Terms of use, intellectual property, and limitation of liability.",
      },
    },

    legalNotice: {
      metaTitle: "Legal Notice | Nanoker",
      metaDescription:
        "Nanoker Research S.L. legal notice including identifying details, terms of use, intellectual property, and limitation of liability.",
      ogLocale: "en_US",
      hero: {
        kicker: "Legal / Corporate",
        titleHtml: "Legal <span>Notice</span>",
        lead:
          "This document governs access to, browsing of, and use of the Nanoker Research S.L. website, together with the conditions applicable to its contents, intellectual property rights, and limitation of liability.",
        metaUpdated: "Last updated: March 24, 2026",
        metaScope: "Scope: corporate website",
        metaLaw: "Applicable law: Spain",
      },
      sections: {
        identification: {
          title: "1. Identifying Details",
          labelOwner: "Website owner",
          valueOwner: "Nanoker Research S.L.",
          labelAddress: "Address",
          valueAddress: "Polígono de Olloniego, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain.",
          labelEmail: "Email",
          valueEmail: "info@nanoker.com",
          labelPhone: "Phone",
          valuePhone: "+34 985 000 000",
        },
        terms: {
          title: "2. Terms of Use",
          p1: "Access to and browsing of this site grants the status of user and implies acceptance of this legal notice. Users agree to make appropriate use of the site, its contents, and the services available in accordance with the law, good faith, and public order.",
          p2: "It is prohibited to use the site for unlawful purposes, in a way that is harmful to Nanoker or third parties, or to introduce or distribute viruses, malicious scripts, or any action that may alter the operation of the platform.",
        },
        ip: {
          title: "3. Intellectual Property",
          p1: "All site content, including texts, designs, structure, graphics, logos, images, videos, source code, and distinctive elements, is owned by Nanoker or used with sufficient authorisation.",
          p2: "Any reproduction, distribution, transformation, public communication, or full or partial exploitation is prohibited without prior written authorisation, except where legally permitted.",
        },
        liability: {
          title: "4. Liability",
          p1: "Nanoker adopts reasonable measures to ensure the availability, accuracy, and updating of the site, but does not guarantee the absence of errors, interruptions, or occasional technical incidents.",
          p2: "Nanoker shall not be liable for damages arising from improper use of the site, decisions taken based on the published information, or third-party content linked from this website, except where required by law.",
        },
      },
      summary: {
        item1Title: "Owner",
        item1Text: "Nanoker Research S.L.",
        item2Title: "Permitted use",
        item2Text: "Legitimate browsing and consultation of corporate information.",
        item3Title: "Protection",
        item3Text: "The site's content and assets are protected by intellectual property rights.",
        item4Title: "Liability",
        item4Text: "Information is provided under a standard of diligence, without an absolute guarantee against incidents.",
      },
      more: {
        privacyTitle: "Privacy Policy",
        privacyText: "Data processing, retention, and user rights.",
        cookiesTitle: "Cookie Policy",
        cookiesText: "Cookies, similar technologies, and preference management.",
      },
    },

    // Keep your old "cards/value" blocks if you still use them elsewhere
    cards: {
      quantum: {
        tag: "01 · Resonance",
        title: "Quantum<br><b>Sensing.</b>",
        text:
          "Atomic-scale defect engineering. CVD diamond with Nitrogen-Vacancy (NV) centers exhibiting quantum coherence at room temperature.",
        spec: {
          coherence: "Coherence",
          defects: "Defects",
          growth: "Growth Rate",
          process: "Process",
        },
      },

      semi: {
        tag: "02 · Lithography",
        title: "Wide Bandgap<br><b>Power.</b>",
        text:
          "Silicon Carbide (SiC) and EPI-ready sapphire substrates. Atomically flat surfaces (< 0.2 nm) for next-generation power electronics.",
        spec: {
          material: "Material",
          purity: "Purity",
          roughness: "Roughness",
          focus: "Focus Ring",
        },
      },

      extreme: {
        tag: "03 · Shielding",
        title: "Extreme<br><b>Environ<wbr>ments.</b>",
        text:
          "Sintered technical ceramics (SPS). Alumina and B4C engineered for extreme abrasion, ballistic impact, and atmospheric re-entry.",
        spec: {
          temp: "Temp",
          thermal: "Thermal",
          cert: "Cert",
          density: "Density",
        },
      },

      medical: {
        tag: "04 · Medical",
        title: "Medical<br><b>Services.</b>",
        text:
          "Consultations, diagnostics, and clinical follow-up with advanced equipment and a patient-centered approach.",
        spec: {
          wait: "Wait Time",
          results: "Results",
          specialties: "Specialties",
          support: "Support",
        },
      },

      implants: {
        tag: "05 · Implants",
        title: "Dental<br><b>Implants.</b>",
        text:
          "Design, manufacturing and placement of high-precision biomedical implants with advanced biocompatible materials.",
        spec: {
          material: "Material",
          precision: "Precision",
          integration: "Integration",
          lifetime: "Lifetime",
        },
      },
    },

    value: {
      title: "Why<br><b>Nanoker.</b>",
      subtitle:
        "An integrated platform connecting advanced research, European manufacturing and full traceability.",
      items: [
        { eyebrow: "01", title: "Precision Materials", text: "Nanometric control and industrial repeatability." },
        { eyebrow: "02", title: "Industrial Scale", text: "From prototype to certified production." },
        { eyebrow: "03", title: "Trusted Quality", text: "QA/QC and European certifications." },
        { eyebrow: "04", title: "Strategic Resilience", text: "Industrial sovereignty and full traceability." },
      ],
    },
  },

  es: {
    nav: {
      // ✅ NAV MENU (matches index.html data-i18n)
      home: "Home",
      company: "Empresa",
      capabilities: "Capacidades",
      materials: "Materiales",
      sectors: "Sectores",
      rnd: "I+D",
      advantages: "Ventajas",
      contact: "Contacto",

      // ✅ Optional label (legacy / if you ever show "Sectores:" somewhere)
      sectorsLabel: "Sectores:",

      // Existing keys you already had
        partner: "Acceso Partners",
        menu: "Abrir menú",
        closeMenu: "Cerrar menú",
        mobileNavigationLabel: "Navegación del sitio",
        quantum: "Cuántica",
      semi: "Semiconductores",
      extreme: "Defensa y Espacio",
      medical: "Médico",
      implants: "Implantes",
      lang: "ES",
    },

    hero: {
      headline: "Materiales DeepTech para industrias críticas.",
      lead: "Materiales avanzados con especificación garantizada, trazabilidad completa y escalabilidad industrial. De precursor a componente terminado.",
      bridgeEyebrow: "DEEPTECH EUROPEA · INFRAESTRUCTURA DE MATERIALES",
      bridgeSectionAria: "Introducción",
      bridgeHtml: "La transición de la DeepTech europea desde prototipo a producción industrial depende de un factor crítico: el dominio de los materiales avanzados.<br /><br />Nanoker integra capacidades en cerámicas técnicas, diamante CVD, SiC y zafiro para ofrecer soluciones con especificación garantizada, trazabilidad completa y escalabilidad industrial.",
      bridgeCtaSectors: "Explorar sectores",
      bridgeCtaContact: "Contactar con ingeniería",
      title: "nanoker",
      subtitleHtml:
        "<b>DeepTech Materials for Critical Industries.</b><br/>Materiales avanzados con especificación garantizada, trazabilidad completa y escalabilidad industrial. De precursor a componente terminado.",
      tagline:
        "Arquitectura de la capa invisible de la innovación.<br/>Soberanía europea en materiales avanzados.",
      scroll: "Desplázate para explorar",
    },

    seo: {
      home: {
        metaTitle: "Nanoker | Materiales avanzados DeepTech",
        metaDescription:
          "Nanoker fabrica cerámicas avanzadas, diamante CVD, SiC y zafiro para industrias críticas con especificación garantizada, trazabilidad completa y escalado industrial.",
      },
      company: {
        metaTitle: "Nanoker | Empresa",
        metaDescription:
          "Descubre cómo Nanoker construye capacidad industrial europea en materiales avanzados, combinando control de proceso, cualificación y fabricación escalable para programas tecnológicos estratégicos.",
      },
      capabilities: {
        metaTitle: "Nanoker | Capacidades",
        metaDescription:
          "Revisa las capacidades de Nanoker en formulación, crecimiento, cualificación e industrialización para asegurar prestaciones repetibles en aplicaciones críticas.",
      },
      rnd: {
        metaTitle: "Nanoker | Investigación e Innovación",
        metaDescription:
          "Explora la capacidad de I+D de Nanoker en materiales avanzados, crecimiento cristalino, diamante de grado cuántico y transferencia industrial para tecnologías estratégicas.",
      },
      materials: {
        metaTitle: "Nanoker | Materiales",
        metaDescription:
          "Descubre el portfolio de Nanoker en cerámicas avanzadas, diamante CVD, SiC y zafiro, diseñado para rendimiento certificado, cualificación y escalabilidad industrial.",
      },
      sectors: {
        metaTitle: "Nanoker | Sectores",
        metaDescription:
          "Explora los sectores a los que sirve Nanoker, desde defensa y aeroespacial hasta semiconductores, energía y sistemas médicos, con materiales diseñados para fiabilidad crítica.",
      },
      contact: {
        metaTitle: "Contacto técnico | Nanoker",
        metaDescription:
          "Contacta con el equipo de ingeniería de Nanoker para revisar aplicaciones, especificaciones críticas y rutas de cualificación en programas industriales de materiales avanzados.",
      },
      evaluation: {
        metaTitle: "Evaluación técnica | Nanoker",
        metaDescription:
          "Solicita una evaluación técnica para tecnologías críticas y alinea arquitectura material, ejecución de ingeniería y plan de validación con expertos de Nanoker.",
      },
      certifications: {
        metaTitle: "Nanoker | Calidad y Certificaciones",
        metaDescription:
          "Consulta el marco de calidad, las certificaciones y los estándares de fabricación regulada de Nanoker para asegurar fiabilidad, cumplimiento y trazabilidad completa.",
      },
      privacy: {
        metaTitle: "Política de Privacidad | Nanoker",
        metaDescription:
          "Política de Privacidad de Nanoker Research S.L. con información sobre responsable del tratamiento, finalidades, bases jurídicas, conservación, derechos y seguridad.",
      },
      cookies: {
        metaTitle: "Política de Cookies | Nanoker",
        metaDescription:
          "Política de Cookies de Nanoker con explicación sobre qué son las cookies, sus tipos, cookies de terceros y cómo gestionarlas.",
      },
      legalNotice: {
        metaTitle: "Aviso Legal | Nanoker",
        metaDescription:
          "Aviso legal de Nanoker Research S.L. con datos identificativos, condiciones de uso, propiedad intelectual y limitación de responsabilidad.",
      },
    },

    contact: {
      metaTitle: "Contacto técnico | Nanoker",
      hero: {
        kicker: "CONTACTO",
        titleHtml: "Contacto <span class=\"page-hero__accent\">técnico</span>",
        lead: "La decisión correcta sobre material empieza con un briefing técnico sólido.",
        text:
          "Si estás cualificando un componente, reduciendo riesgo de suministro o definiendo una nueva arquitectura material, nuestro equipo de ingeniería puede revisar la aplicación con enfoque industrial.",
        cta: "Abrir formulario técnico",
      },
      work: {
        title: "Cómo trabajamos",
        intro: "Para acelerar la primera revisión, comparte:",
        items: {
          application: "Descripción de la aplicación",
          specification: "Especificación objetivo o plano técnico (si existe)",
          requirements: "Requisitos críticos (temperatura, presión, tolerancias, vida útil, etc.)",
          volume: "Demanda estimada, fase de cualificación o madurez del proyecto",
        },
        outro: "Esto nos permite valorar con precisión la viabilidad, la lógica de cualificación y los siguientes pasos técnicos.",
      },
      wizard: {
        kicker: "INTERFAZ DE INGENIERÍA",
        title: "Captura técnica",
        progress: "Paso 1 de 6",
        progressTemplate: "PASO {current} DE {total}",
        steps: {
          step1: "PASO 1",
          step2: "PASO 2",
          step3: "PASO 3",
          step4: "PASO 4",
          step5: "PASO 5",
          step6: "PASO 6",
        },
      },
      form: {
        actions: {
          continue: "Continuar",
        },
        step1: {
          title: "Tipo de consulta",
          options: {
            eval: "Evaluación técnica de material",
            coengineering: "Desarrollo conjunto/ co-engineering",
            sample: "Solicitud de muestra",
            rfq: "Solicitud de presupuesto (RFQ)",
            rnd: "Colaboración I+D",
            institutional: "Inversión/ institucional",
            other: "Otro",
          },
        },
        step2: {
          title: "Sector",
          options: {
            industry: "Industria",
            energy: "Energía",
            health: "Salud",
            semiconductors: "Semiconductores",
            photonics: "Fotónica",
            quantum: "Cuántica",
            defense: "Defensa / Espacio",
            science: "Ciencia e Infraestructuras",
          },
        },
        step3: {
          title: "Material de interés (opcional)",
          options: {
            diamond: "Diamante evo",
            sic: "SiC",
            sapphire: "Zafiro",
            ceramics: "Cerámicas técnicas",
            composites: "Composites térmicos",
            undefined: "No definido",
          },
        },
        step4: {
          title: "Información técnica",
          label: "Información técnica",
          placeholder: "Describe tu aplicación, entorno operativo y requisitos clave.",
        },
        step5: {
          title: "Datos de contacto",
          fields: {
            name: "Nombre *",
            company: "Empresa *",
            role: "Cargo",
            email: "Email corporativo *",
            country: "País *",
            phone: "Teléfono (opcional)",
          },
        },
        step6: {
          title: "Enviar solicitud",
          submit: "Enviar solicitud técnica",
          note: "Procesamos solicitudes técnicas en un plazo de 3-5 días laborables.",
        },
      },
      processingNote: "PROCESAMOS SOLICITUDES TÉCNICAS EN UN PLAZO DE 3–5 DÍAS LABORABLES",
      duo: {
        strategic: {
          title: "Relaciones estratégicas",
          text:
            "Para alianzas industriales, colaboraciones institucionales o información corporativa, puedes escribir directamente a:",
        },
        presence: {
          title: "Presencia industrial",
          oviedo: "Oviedo - Desarrollo y validación",
          leon: "León - Hub industrial estratégico",
        },
        readiness: {
          title: "Preparados para programas críticos",
          text:
            "Las primeras conversaciones se gestionan con rigor de ingeniería, disciplina de confidencialidad y criterios de cualificación industrial.",
          item1: "Interlocución técnica desde la primera revisión",
          item2: "Foco en CTQs, riesgo y escalado",
          item3: "Respuesta inicial en 3-5 días laborables",
        },
      },
      close: {
        title: "Ingeniería de materiales alineada con cualificación y escalado",
        text:
          "En DeepTech, la tracción comercial depende de la credibilidad técnica. Acompañamos a los clientes desde la primera revisión de especificación hasta la cualificación industrial y la continuidad de suministro.",
      },
    },

    evaluation: {
      metaTitle: "Evaluación técnica | Nanoker",
      metaDescription:
        "Solicita una evaluación técnica para tecnologías críticas y alinea arquitectura material, ejecución de ingeniería y ruta de validación con expertos de Nanoker.",
      hero: {
        kicker: "EVALUACIÓN",
        titleHtml:
          "Evaluación técnica de <span class=\"page-hero__accent\">tecnologías críticas</span>",
        lead:
          "Definimos arquitectura material, riesgos de ingeniería y rutas de validación para acelerar decisiones críticas con fiabilidad industrial.",
      },
      work: {
        title: "Cómo trabajamos",
        items: {
          scope:
            "Alineamos objetivos técnicos, restricciones y criticidad del sistema.",
          architecture:
            "Proponemos arquitectura de materiales y electrónica con enfoque de fabricación.",
          validation:
            "Diseñamos un plan de validación con hitos medibles y criterios de éxito.",
          execution:
            "Entregamos recomendaciones accionables para ejecución en semanas, no trimestres.",
        },
      },
      wizard: {
        kicker: "INTERFAZ DE INGENIERÍA",
        title: "Evaluación guiada",
        progress: "PASO 1 DE 5",
        progressTemplate: "PASO {current} DE {total}",
        confidentiality:
          "Toda la información se tratará de forma confidencial.",
        steps: {
          step1: "PASO 1",
          step2: "PASO 2",
          step3: "PASO 3",
          step4: "PASO 4",
          step5: "PASO 5",
        },
      },
      form: {
        actions: {
          continue: "Continuar",
          back: "Atrás",
        },
        validation: {
          minCharacters: "Describe el desafío con al menos 30 caracteres.",
        },
        step1: {
          title: "Tipo de tecnología",
          help: "Selecciona una o varias categorías.",
          options: {
            ai: "IA",
            robotics: "Robótica",
            electronics: "Hardware electrónico",
            embedded: "Sistemas embebidos",
            iot: "IoT",
            deeptech: "Ciencia aplicada / DeepTech",
            other: "Otro",
          },
        },
        step2: {
          title: "Fase del proyecto",
          help: "Selecciona la fase actual.",
          options: {
            concept: "Concepto",
            prototype: "Prototipo",
            mvp: "MVP",
            functional: "Producto funcional",
            scale: "Escalado/industrialización",
          },
        },
        step3: {
          title: "Desafío técnico",
          label: "Desafío técnico",
          help: "Comparte el problema clave que necesitas resolver.",
          placeholder:
            "Describe arquitectura actual, cuellos de botella técnicos, condiciones de operación y métricas objetivo.",
        },
        step4: {
          title: "Necesidades de ingeniería",
          help: "Selecciona las áreas donde necesitas soporte.",
          options: {
            hardwareArchitecture: "Arquitectura hardware",
            materialSelection: "Selección de materiales/componentes",
            embedded: "Sistemas embebidos",
            edgeAi: "Edge AI",
            performance: "Optimización rendimiento",
            industrialization: "Industrialización/fabricación",
            validation: "Validación/ensayos",
            other: "Otro",
          },
        },
        step5: {
          title: "Datos de contacto",
          help: "Necesitamos estos datos para coordinar una sesión técnica.",
          submit: "Solicitar evaluación técnica",
          sending: "Enviando...",
          fields: {
            name: "Nombre *",
            email: "Email profesional *",
            company: "Empresa *",
            role: "Cargo *",
            start: "Cuándo necesitas empezar *",
          },
          startOptions: {
            placeholder: "Selecciona una opción",
            immediate: "Inmediato",
            oneThreeMonths: "1-3 meses",
            threeSixMonths: "3-6 meses",
            exploring: "Explorando",
          },
        },
        status: {
          requiredFields: "Completa los campos obligatorios para continuar.",
          completePrevious: "Completa los pasos previos antes de enviar.",
          challengeTooShort:
            "Describe el desafío técnico con al menos 30 caracteres.",
          sending: "Enviando solicitud de evaluación...",
          success:
            "Solicitud recibida. Nuestro equipo de ingeniería te contactará en breve.",
          error: "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
        },
      },
    },

    certifications: {
      metaTitle: "Nanoker | Calidad y Certificaciones",
      kicker: "MARCO DE CALIDAD",
      titleHtml: "Calidad y <span class=\"cert-accent\">Certificaciones</span>",
      intro:
        "Nanoker opera bajo estándares internacionales reconocidos que garantizan fiabilidad del producto, cumplimiento normativo y trazabilidad industrial completa.",
      labels: {
        standard: "Norma",
        scope: "Alcance",
        body: "Entidad",
        number: "Nº",
        valid: "Vigencia",
      },
      cards: {
        iso9001: {
          title: "ISO 9001",
          desc:
            "Sistema de gestión de calidad certificado que asegura procesos consistentes, mejora continua y orientación al cliente.",
          fields: {
            standard: "ISO 9001:2015",
            scope: "Diseño, desarrollo y fabricación industrial de materiales técnicos avanzados.",
            body: "TUV Rheinland",
            number: "QMS-9001-NAK-2026-001",
            valid: "31 de diciembre de 2028",
          },
          download: "Descargar certificado",
          file: "[PDF] iso-9001-nanoker.pdf",
        },
        iso14001: {
          title: "ISO 14001",
          desc:
            "Sistema de gestión ambiental que garantiza el uso responsable de recursos, control de emisiones y prácticas industriales sostenibles.",
          fields: {
            standard: "ISO 14001:2015",
            scope: "Gestión ambiental de fabricación de materiales avanzados y servicios industriales asociados.",
            body: "Bureau Veritas",
            number: "EMS-14001-NAK-2026-014",
            valid: "30 de septiembre de 2028",
          },
          download: "Descargar certificado",
          file: "[PDF] iso-14001-nanoker.pdf",
        },
        iso13485: {
          title: "ISO 13485",
          desc:
            "Sistema de gestión de calidad para entornos regulados, orientado a requisitos de grado médico y documentación robusta.",
          fields: {
            standard: "ISO 13485:2016",
            scope: "Controles de desarrollo y fabricación para materiales avanzados en entornos médicos regulados.",
            body: "SGS",
            number: "MDQ-13485-NAK-2026-008",
            valid: "30 de junio de 2028",
          },
          download: "Descargar certificado",
          file: "[PDF] iso-13485-nanoker.pdf",
        },
      },
    },

    pages: {
      company: {
        metaTitle: "Nanoker | Empresa",
        hero: {
          eyebrow: "EMPRESA",
          titleHtml:
            "Infraestructura industrial para <span class=\"empresa-accent\">tecnologías estratégicas.</span>",
          text:
            "Nanoker es una plataforma industrial de materiales avanzados y componentes de alta especificación para sectores donde los ciclos de cualificación son largos, el fallo es costoso y la continuidad de suministro es estratégica.",
        },
        mission: {
          title: "Posicionamiento industrial",
          priorities: {
            title: "Lo que nuestros clientes necesitan resolver",
            item1: "Pureza y estabilidad de proceso lote a lote",
            item2: "Documentación y trazabilidad listas para cualificación",
            item3: "Menor exposición a cadenas de suministro frágiles",
            item4: "Escalado industrial europeo para programas críticos",
          },
          who: {
            title: "Para qué está construida Nanoker",
            item1: "Fabricar componentes avanzados basados en cerámica y cristal",
            item2: "Desarrollar formulaciones propietarias y rutas de material",
            item3: "Integrar proceso, metrología y lógica de cualificación",
            item4: "Acompañar a OEMs europeos en aplicaciones críticas de ciclo largo",
          },
        },
        platform: {
          titleHtml: "Plataforma <span class=\"empresa-accent\">Integrada</span>",
          subtitle: "De la arquitectura material al componente cualificado",
          card1: "Síntesis, Formulación & Crecimiento",
          card2: "Mecanizado de Precisión",
          card3: "Ingeniería Superficial & Metrología",
          card4: "QA, Trazabilidad & Control",
        },
        alliance: {
          title: "Alianza Tecnológica Estratégica",
          text:
            "Nanoker integra capacidades tecnológicas avanzadas en crecimiento de diamante monocristalino y control de dopaje a escala atómica, ampliando el portfolio hacia aplicaciones cuánticas, térmicas y semiconductoras de próxima generación.",
          item1: "Diamante CVD",
          item2: "Silicon Carbide",
          item3: "Zafiro",
          item4: "Cerámicas extremas",
        },
        infrastructure: {
          title: "Modelo de ejecución industrial",
          item1: "Rutas de cualificación progresiva alineadas con cada sector",
          item2: "Escalado industrial por oleadas",
          item3: "Operación 24/7",
          item4: "Disponibilidad objetivo superior al 95%",
        },
        advantage: {
          title: "Ventaja estructural europea",
          subtitle: "Energía, sostenibilidad y soberanía",
          text:
            "La fabricación de materiales avanzados es intensiva en energía y sensible a capital. Operar en un entorno con energía renovable competitiva y baja intensidad de carbono proporciona:",
          item1: "Ventaja estructural de coste",
          item2: "Cumplimiento CBAM",
          item3: "Acceso a mercados regulados y exigentes",
          item4: "Seguridad jurídica e IP europea",
          closingHtml:
            "No es solo un argumento de sostenibilidad.<br />Es una ventaja de posicionamiento industrial.",
        },
        approach: {
          title: "Modelo de trabajo con cliente",
          subtitle: "Cómo pasamos del requisito a la ejecución industrial",
          item1: "Definimos la especificación crítica del material y sus CTQs",
          item2: "Validamos con metrología, ventanas de proceso y evidencia técnica",
          item3: "Cualificamos bajo restricciones y estándares sectoriales",
          item4: "Escalamos con repetibilidad industrial y continuidad de suministro",
          text: "Trabajamos dentro del roadmap del cliente, no al margen.",
        },
        vision: {
          title: "Visión",
          subtitle: "Infraestructura estratégica para la DeepTech europea",
          textHtml:
            "Europa no puede liderar en semiconductores avanzados, tecnologías cuánticas o sistemas de defensa sin controlar los materiales y el know-how de proceso que los hacen posibles.<br />Nanoker contribuye a construir esa base industrial.",
        },
        quote: "Quien controla el material controla la tecnología.",
      },
      capabilities: {
        metaTitle: "Nanoker | Capacidades",
        hero: {
          eyebrow: "CAPACIDADES",
          titleHtml: "Capacidades Industriales <span class=\"mat-accent\">Integradas</span>",
          subtitle: "Control del proceso desde la ingeniería del precursor hasta el componente cualificado.",
          text:
            "Nanoker integra crecimiento cristalino, densificación, mecanizado de precisión y metrología en un único flujo industrial para asegurar control de especificación, repetibilidad y escalabilidad en aplicaciones críticas.",
        },
        integration: {
          title: "Arquitectura de integración vertical",
          subtitle: "De precursor a componente",
          intro: "Nuestra plataforma industrial cubre la cadena necesaria para pasar del diseño material a la pieza cualificada:",
          item1: "1. Síntesis y formulación",
          item2: "2. Crecimiento cristalino",
          item3: "3. Densificación avanzada",
          item4: "4. Mecanizado de precisión",
          item5: "5. Acabado superficial y CMP",
          item6: "6. Metrología y QA/QC",
          item7: "7. Cualificación y escalado",
          outro: "La integración reduce riesgo de traspaso, acorta bucles de cualificación y limita la variabilidad de calidad.",
        },
        synthesis: {
          title: "Síntesis y Formulación",
          subtitle: "Control desde el origen",
          item1: "Desarrollo de formulaciones propietarias",
          item2: "Ajuste de pureza hasta grado semiconductor",
          item3: "Control de tamaño de partícula y microestructura",
          item4: "Optimización para SPS/HIP o crecimiento cristalino",
          outro: "El material se diseña alrededor de la aplicación y la ventana de proceso, no se adapta a posteriori.",
        },
        growth: {
          title: "Crecimiento Cristalino",
          subtitle: "Tecnologías de crecimiento avanzadas",
          card1Title: "A) CVD (Chemical Vapor Deposition)",
          card1Item1: "Diamante monocristalino",
          card1Item2: "Control de defectos a escala atómica",
          card1Item3: "Dopaje NV / B / P",
          card1Item4: "Capas multicapa personalizadas",
          card2Title: "B) PVT / CVD para SiC",
          card2Item1: "Crecimiento de boules de alta pureza",
          card2Item2: "Preparación para wafering",
          card2Item3: "Compatibilidad con EPI",
          card3Title: "C) HME (Horizontal Multi-Edge) para Zafiro",
          card3Item1: "Wafers de gran diámetro",
          card3Item2: "Bajo estrés interno",
          card3Item3: "Alta uniformidad óptica",
        },
        densification: {
          title: "Densificación Avanzada",
          subtitle: "SPS / HIP",
          card1Title: "A) SPS (Spark Plasma Sintering)",
          card1Item1: "Densificación rápida",
          card1Item2: "Preservación de nanoestructura",
          card1Item3: "Alta pureza",
          card1Item4: "Control microestructural fino",
          card2Title: "B) HIP (Hot Isostatic Pressing)",
          card2Item1: "Eliminación de porosidad residual",
          card2Item2: "Mejora de propiedades mecánicas",
          card2Item3: "Estabilidad estructural extrema",
          card3Title: "Aplicable a",
          card3Item1: "Alúminas y composites ATZ-ZTA",
          card3Item2: "AlN",
          card3Item3: "Composites térmicos",
          card3Item4: "SiC policristalino",
        },
        machining: {
          title: "Mecanizado de Precisión",
          subtitle: "Fabricación de componentes complejos",
          item1: "EDM en cerámicas electroconductoras",
          item2: "Micro-waterjet",
          item3: "Rectificado de precisión",
          item4: "Wire-saw wafering",
          item5: "Geometrías complejas tolerancia crítica",
          outro: "Capacidad de fabricar pieza terminada lista para integración.",
        },
        finishing: {
          title: "Acabado Superficial y CMP",
          subtitle: "Ready-to-Process / Ready-to-Device",
          item1: "Chemical Mechanical Polishing (CMP)",
          item2: "Superficies ópticas",
          item3: "Acabado “device-ready”",
          item4: "Planitud y rugosidad controladas",
          criticalTitle: "Crítico para:",
          critical1: "Wafers SiC",
          critical2: "Diamante semiconductor",
          critical3: "Zafiro EPI-ready",
        },
        metrology: {
          title: "Metrología y QA/QC",
          subtitle: "Especificación certificada",
          item1: "Control dimensional de alta precisión",
          item2: "Análisis microestructural",
          item3: "Caracterización óptica",
          item4: "Control estadístico de proceso",
          item5: "Trazabilidad completa",
          outro:
            "Documentación compatible con procesos de cualificación industrial (6-24 meses según sector).",
        },
        qualification: {
          title: "Cualificación y Escalado",
          subtitle: "Cualificar antes de escalar volumen",
          flow: "Instalar -> Cualificar -> Estabilizar -> Escalar",
          item1: "Definición de CTQs y lógica de aceptación",
          item2: "Validación técnica bajo condiciones de uso",
          item3: "Optimización de yield y capacidad de proceso",
          item4: "Operación 24/7",
          item5: "Disponibilidad >95%",
          outro: "Diseñado para integrarse en roadmaps OEM y programas industriales de ciclo largo.",
        },
        advantage: {
          title: "Por qué esto importa comercialmente",
          subtitle: "Palancas industriales creadas por la integración de capacidades",
          item1: "Integración vertical completa",
          item2: "Control interno de defectología",
          item3: "Ventaja energética estructural",
          item4: "Base industrial europea",
          item5: "Lock-in por cualificación técnica",
          outro: "El resultado es una cadena más defendible para programas de alto valor y alta exigencia.",
        },
        diagram: {
          title: "Diagrama visual",
          subtitle: "CADENA DE INTEGRACIÓN HORIZONTAL INDUSTRIAL PREMIUM",
          svgTitle: "Cadena de Integración Horizontal Industrial Premium",
          svgDesc:
            "Flujo de siete etapas: síntesis, crecimiento cristalino, densificación, mecanizado, acabado, metrología y cualificación industrial.",
          stage1Line1: "SINTESIS Y",
          stage1Line2: "FORMULACION",
          stage2Line1: "CRECIMIENTO",
          stage2Line2: "CRISTALINO",
          stage3Line1: "DENSIFICACION",
          stage3Line2: "AVANZADA SPS/HIP",
          stage4Line1: "MECANIZADO",
          stage4Line2: "DE PRECISION",
          stage5Line1: "ACABADO Y",
          stage5Line2: "CMP",
          stage6Line1: "METROLOGIA",
          stage6Line2: "Y QA/QC",
          stage7Line1: "CUALIFICACION",
          stage7Line2: "Y SCALE-UP",
          strip:
            "Diamante | Carburo de Silicio | Zafiro | Cerámicas Técnicas | Composites Carbono-Metal",
        },
        closing: {
          title: "Industrialización de la DeepTech",
          text:
            "La ventaja competitiva en DeepTech no se asegura solo en la arquitectura del dispositivo. Se asegura en la capacidad de fabricar el material con especificación certificada, repetibilidad industrial y continuidad de suministro cualificada.",
          statement: "Nanoker integra esa capacidad.",
        },
      },
      rnd: {
        metaTitle: "Nanoker | Investigación e Innovación",
        hero: {
          eyebrow: "I+D INDUSTRIAL",
          titleHtml: "<span class=\"id-accent id-glow\">Investigación</span> orientada a industrialización",
          subtitle: "La investigación solo genera valor cuando sobrevive a la cualificación y al escalado.",
          text:
            "Nuestra actividad de I+D está diseñada para convertir investigación en rutas fabricables, datos cualificables y producción repetible de materiales avanzados.",
        },
        philosophy: {
          title: "Filosofía",
          subtitle: "Del laboratorio a la producción 24/7",
          introHtml:
            "La mayoría de programas de materiales avanzados se detienen en la prueba de concepto.<br />Nuestro modelo está diseñado para unir investigación, cualificación y producción:",
          card1Title: "Materiales de alta exigencia",
          card1Claim: "Estructura y funcionalidad",
          card1Item1: "Control microestructural avanzado",
          card1Item2: "Optimización térmica y mecánica",
          card1Item3: "Formulaciones para entornos extremos",
          card2Title: "Procesos escalables",
          card2Claim: "Diseño para industria",
          card2Item1: "Ventanas de proceso reproducibles",
          card2Item2: "Robustez estadística de fabricación",
          card2Item3: "Compatibilidad con cadena de suministro",
          card3Title: "Validación y cualificación",
          card3Claim: "Evidencia técnica",
          card3Item1: "Protocolos de verificación acelerada",
          card3Item2: "Metrología y trazabilidad completa",
          card3Item3: "Integración con requisitos OEM",
          card4Title: "Diamante y materiales cuánticos",
          card4Item1: "Crecimiento MPCVD avanzado",
          card4Item2: "Control de centros NV",
          card4Item3: "Dopaje atómico controlado",
          card4Item4: "Arquitecturas multicapa",
          card4ApplicationsTitle: "Aplicaciones en:",
          card4Application1: "Sensores cuánticos",
          card4Application2: "Magnetometría",
          card4Application3: "Electrónica de potencia",
          card4Application4: "Gestión térmica extrema",
          pipeline:
            "Investigación básica ➔ Validación técnica ➔ Cualificación industrial ➔ Escalado productivo",
          outro:
            "El objetivo no es solo demostrar viabilidad científica, sino establecer una ruta hacia fabricación industrial estable.",
        },
        areas: {
          title: "Áreas estratégicas de investigación",
          card1Title: "Control de defectología",
          card1Item1: "Reducción de dislocaciones en crecimiento cristalino",
          card1Item2: "Ingeniería de defectos en diamante (NV, B, P)",
          card1Item3: "Optimización microestructural en SPS/HIP",
          card1Item4: "Control de pureza grado semiconductor",
          card1Text: "En materiales avanzados, el defecto es el límite del rendimiento.",
          card2Title: "Materiales Beyond Standard",
          card2Text:
            "Desarrollamos formulaciones propietarias que superan especificaciones comerciales convencionales cuando los materiales estándar dejan de cumplir objetivos térmicos, mecánicos o de fiabilidad.",
          card3Title: "Diamante y materiales cuánticos",
          card3Item1: "Crecimiento MPCVD avanzado",
          card3Item2: "Control de centros NV",
          card3Item3: "Dopaje atómico controlado",
          card3Item4: "Arquitecturas multicapa",
          card3ApplicationsTitle: "Aplicaciones en:",
          card3Application1: "Sensores cuánticos",
          card3Application2: "Magnetometría",
          card3Application3: "Electrónica de potencia",
          card3Application4: "Gestión térmica extrema",
          card4Title: "SiC y WBG",
          card4Item1: "Optimización de crecimiento PVT/CVD",
          card4Item2: "Reducción de defectos en sustratos",
          card4Item3: "Densificación avanzada",
          card4Item4: "Preparación EPI-ready",
          card4Text:
            "Orientado a semiconductores de banda ancha y electrónica de alta eficiencia.",
          card5Title: "Integración material-dispositivo",
          card5Item1: "Interfaces térmicas",
          card5Item2: "Compatibilidad con procesos de fab",
          card5Item3: "Estabilidad bajo plasma",
          card5Item4: "Component-ready fabrication",
          card5Text:
            "No investigamos el material aislado, sino su integración real en sistema.",
        },
        infrastructure: {
          title: "Infraestructura de I+D",
          subtitle: "Plataformas experimentales con intención industrial",
          item1: "Reactores MPCVD",
          item2: "SPS/HIP",
          item3: "Sistemas de crecimiento cristalino",
          item4: "Laboratorios de caracterización",
          item5: "Metrología avanzada",
          outro:
            "Instalaciones configuradas para acortar la transferencia entre validación experimental e implementación industrial.",
        },
        collaboration: {
          title: "Colaboración científica e industrial",
          subtitle: "Ecosistema europeo",
          intro: "Trabajamos con:",
          item1: "Centros de investigación",
          item2: "Universidades",
          item3: "OEMs industriales",
          item4: "Programas estratégicos europeos",
          outro:
            "La colaboración científica solo aporta valor cuando se traduce en capacidad industrial validada.",
        },
        roadmap: {
          title: "Roadmap tecnológico",
          subtitle: "Industrialización en oleadas",
          item1: "Fase 1 — Desarrollo y cualificación",
          item2: "Fase 2 — Estabilización de proceso",
          item3: "Fase 3 — Escalado industrial",
          item4: "Fase 4 — Operación continua 24/7",
          outro:
            "Cada avance en I+D está diseñado para integrarse en producción.",
        },
        impact: {
          title: "Impacto estratégico",
          subtitle: "Infraestructura material para la soberanía tecnológica",
          intro: "Europa no puede liderar en:",
          item1: "Semiconductores avanzados",
          item2: "Tecnologías cuánticas",
          item3: "Defensa de nueva generación",
          item4: "Fotónica integrada",
          text: "Sin controlar los materiales que los habilitan.",
          outroHtml: "Nuestra I+D no está desconectada de la industria.<br />Es capacidad industrial estructural en formación.",
        },
        closing: {
          title: "Mensaje final",
          subtitle: "Investigación con propósito industrial",
          text:
            "La diferencia entre resultado de laboratorio y liderazgo industrial está en la capacidad de fabricar con especificación certificada, estabilidad de proceso y resultados de cualificación repetibles.",
          statement: "Ahí es donde enfocamos nuestra investigación.",
        },
      },
      materials: {
        metaTitle: "Nanoker | Materiales",
        hero: {
          eyebrow: "MATERIALES",
          titleHtml: "Materiales Estratégicos <span style=\"color: #3B82F6;\">DeepTech</span>",
          text1:
            "El control del material define el rendimiento, el riesgo de cualificación y la escalabilidad industrial de las tecnologías críticas.",
          text2:
            "Nanoker integra un portfolio de materiales avanzados que sostiene la capa física de la nueva DeepTech europea: semiconductores de banda ancha, fotónica avanzada, sensores cuánticos, defensa y sistemas energéticos de alta eficiencia.",
        },
        philosophy: {
          title: "Filosofía",
          subtitle: "Arquitectura material, no commodity de catálogo",
          text: "No tratamos el material como una referencia intercambiable. Lo desarrollamos:",
          item1: "Con pureza controlada",
          item2: "Con defectología optimizada",
          item3: "Con propiedades funcionales diseñadas",
          item4: "Con trazabilidad completa",
          item5: "Listos para cualificación industrial",
          deliverHtml:
            "Cada material se entrega como <span class=\"mat-glow\">component-ready</span> o <span class=\"mat-glow\">device-ready</span>, alineado con rutas reales de cualificación.",
        },
        portfolio: {
          title: "Portfolio de Materiales",
          diamond: {
            title: "DIAMANTE CVD (Poly & Single Crystal)",
            claim: "El material extremo",
            text:
              "El diamante es el semiconductor con mayor conductividad térmica, mayor campo de ruptura y mayor dureza conocida.",
            capabilitiesTitle: "Capacidades clave",
            capability1: "Crecimiento MPCVD con tecnología propietaria",
            capability2: "Monocristal hasta 4\" (escalable)",
            capability3: "Control de defectos a escala atómica",
            capability4: "Dopaje on-demand (NV / B / P)",
            capability5: "Capas multicapa personalizadas",
            gradesTitle: "Grados disponibles",
            grade1: "Quantum Grade (centros NV controlados)",
            grade2: "Thermal Grade (heat spreading extremo)",
            grade3: "Optical Grade (transmisión amplia UV-IR)",
            grade4: "Semiconductor Grade (SBD / FET ready)",
            applicationsTitle: "Aplicaciones",
            application1: "Sensores cuánticos",
            application2: "Magnetometría",
            application3: "Gestión térmica RF",
            application4: "Electrónica de potencia",
            application5: "Ventanas ópticas y X-ray",
          },
          sic: {
            title: "SILICON CARBIDE (SiC)",
            claim: "El pilar de la electrónica de potencia",
            text: "Material crítico para WBG (Wide Band Gap), alta eficiencia y operación >200ºC.",
            capabilitiesTitle: "Capacidades",
            capability1: "Crecimiento PVT / evo",
            capability2: "Sustratos 4H-SiC",
            capability3: "EPI-ready",
            capability4: "Densificación SPS/HIP para aplicaciones estructurales como sustrato",
            capability5: "Wafering + CMP",
            advantagesTitle: "Ventajas",
            advantage1: "Reducción de pérdidas energéticas",
            advantage2: "Mayor densidad de potencia",
            advantage3: "Escalabilidad industrial europea",
            applicationsTitle: "Aplicaciones",
            application1: "Inversores EV",
            application2: "Convertidores de alta eficiencia",
            application3: "RF de alta frecuencia",
            application4: "Componentes fab-grade",
          },
          sapphire: {
            title: "ZAFIRO (Al2O3 Monocristalino)",
            claim: "Óptica y electrónica de alta estabilidad",
            text: "Material estratégico para aplicaciones ópticas y SOS (Silicon-on-Sapphire).",
            capabilitiesTitle: "Capacidades",
            capability1: "Crecimiento KV",
            capability2: "Wafers hasta 8\"",
            capability3: "EPI-ready",
            capability4: "Óptica de alta transmisión",
            capability5: "Bajo estrés interno",
            applicationsTitle: "Aplicaciones",
            application1: "SOS (electrónica rad-hard)",
            application2: "Ventanas ópticas",
            application3: "Domos IR",
            application4: "Fotónica integrada",
          },
          ceramics: {
            title: "CERÁMICAS TÉCNICAS SPS / HIP",
            claim: "Beyond Standard Ceramics",
            text:
              "Nanoker desarrolla formulaciones propietarias que superan especificaciones comerciales convencionales.",
            materialsTitle: "Materiales",
            material1: "Alúminas 92/96/99,7/99,8/99,99% pureza",
            material2: "Circonas (YTZP, MgPSZ, YFSZ, CaPSZ, CaFSZ)",
            material3: "AIN",
            material4: "Composites ATZ / ZTA",
            material5: "Nanocomposites CeTZP-A",
            material6: "Composites electroconductores (EDM)",
            material7: "Composites térmicos (Grafito-Mo/Cr, KALMAN, KBNC, Diamond-Cu/Al)",
            material8: "Composites de CTE nulo LAS-SiC",
            capabilitiesTitle: "Capacidades",
            capability1: "SPS (Spark Plasma Sintering)",
            capability2: "HIP",
            capability3: "Calaje con presión",
            capability4: "Síntesis química",
            capability5: "Mecanizado de alta precisión",
            capability6: "Mecanizado EDM",
            capability7: "Micro-waterjet",
            applicationsTitle: "Aplicaciones",
            application1: "Componentes resistentes a plasma",
            application2: "Gestión térmica",
            application3: "Blindaje transparente",
            application4: "Dispositivos médicos",
            application5: "Componentes estructurales extremos",
          },
          bioceramics: {
            title: "BIOCERÁMICAS",
            claim: "Materiales para longevidad y biocompatibilidad",
            text: "Diseñadas para dispositivos médicos avanzados bajo normativa estricta.",
            capabilitiesTitle: "Capacidades",
            capability1: "ISO 13485",
            capability2: "Trazabilidad completa",
            capability3: "Integración con sensores y sistemas digitales",
            applicationsTitle: "Aplicaciones",
            application1: "Implantes",
            application2: "Cirugía guiada",
            application3: "Oncología intervencionista",
          },
        },
        differential: {
          title: "Ventaja diferencial",
          subtitle: "Control industrial a lo largo de toda la cadena",
          stage1: "Síntesis y Formulación",
          stage2: "Crecimiento Cristalino (CVD/PVT/HME)",
          stage3: "Densificación Avanzada (SPS/HIP)",
          stage4: "Mecanizado de Precisión",
          stage5: "Acabado Superficial y CMP",
          stage6: "Metrología y QA/QC",
          stage7: "Cualificación y Escalado Industrial",
          strip:
            "Diamante | Carburo de Silicio | Zafiro | Cerámicas Técnicas | Composites Carbono-Metal",
          text: "Esto genera ventajas industriales concretas:",
          item1: "Menor riesgo de suministro y de traspasos",
          item2: "Mejor coste total de propiedad",
          item3: "Mejor alineación con flujos de cualificación",
          item4: "Mayor estabilidad lote a lote",
        },
        map: {
          title: "Mapa visual",
          layer1: "APLICACIONES",
          layer2: "MATERIALES ESTRATÉGICOS",
          layer3: "CAPACIDADES INDUSTRIALES",
          top1Html: "<tspan x=\"110\" dy=\"0\">Tecnologías</tspan><tspan x=\"110\" dy=\"15\">Cuánticas</tspan>",
          top2Html: "<tspan x=\"290\" dy=\"0\">Fotónica y</tspan><tspan x=\"290\" dy=\"15\">Óptica</tspan>",
          top3Html: "<tspan x=\"470\" dy=\"0\">Semiconductores</tspan><tspan x=\"470\" dy=\"15\">(WBG)</tspan>",
          top4Html: "<tspan x=\"650\" dy=\"0\">Defensa y</tspan><tspan x=\"650\" dy=\"15\">Aeroespacial</tspan>",
          top5Html: "<tspan x=\"830\" dy=\"0\">Energía y</tspan><tspan x=\"830\" dy=\"15\">Potencia</tspan>",
          top6Html: "<tspan x=\"1010\" dy=\"0\">Dispositivos</tspan><tspan x=\"1010\" dy=\"15\">Médicos</tspan>",
          top7Html:
            "<tspan x=\"1190\" dy=\"0\">Infraestructura</tspan><tspan x=\"1190\" dy=\"15\">Científica</tspan>",
          mid1Html: "<tspan x=\"170\" dy=\"0\">Diamante CVD</tspan><tspan x=\"170\" dy=\"14\">(poly / sc)</tspan>",
          mid2: "Silicon Carbide",
          mid3: "Sapphire",
          mid4Html:
            "<tspan x=\"970\" dy=\"0\">Cerámicas Técnicas</tspan><tspan x=\"970\" dy=\"14\">(Alúmina, AlN, B₄C)</tspan>",
          mid5Html: "<tspan x=\"1230\" dy=\"0\">Composites</tspan><tspan x=\"1230\" dy=\"14\">Carbono-Metal</tspan>",
          bottom1Html:
            "<tspan x=\"140\" dy=\"0\">Crecimiento Cristalino</tspan><tspan x=\"140\" dy=\"15\">(CVD / PVT / HME)</tspan>",
          bottom2: "SPS / HIP",
          bottom3Html: "<tspan x=\"580\" dy=\"0\">Mecanizado de</tspan><tspan x=\"580\" dy=\"15\">Precisión</tspan>",
          bottom4Html: "<tspan x=\"800\" dy=\"0\">CMP y</tspan><tspan x=\"800\" dy=\"15\">Acabado Superficial</tspan>",
          bottom5Html: "<tspan x=\"1020\" dy=\"0\">QA/QC y</tspan><tspan x=\"1020\" dy=\"15\">Trazabilidad</tspan>",
          bottom6Html: "<tspan x=\"1240\" dy=\"0\">Escalado</tspan><tspan x=\"1240\" dy=\"15\">Industrial</tspan>",
        },
        europe: {
          title: "DeepTech Materials for Europe",
          text1: "Los materiales estratégicos no son inputs intercambiables. Son infraestructura industrial.",
          text2: "Controlar diamante, SiC, zafiro y cerámicas avanzadas en Europa significa:",
          item1: "Reducir dependencia externa",
          item2: "Asegurar continuidad industrial",
          item3: "Fortalecer soberanía tecnológica",
          closing: "Nanoker construye esa base material.",
        },
        datasheets: {
          title: "Fichas técnicas",
          subtitle: "Referencias técnicas para revisión de ingeniería",
          text:
            "Accede a las fichas técnicas cerámicas directamente dentro del portfolio de materiales. Filtra por familia para revisar más rápido las referencias relevantes durante la especificación y el sourcing técnico.",
          filters: {
            all: "Todas",
            alumina: "Alúmina",
            zirconia: "Circonia",
            carbides: "Carburos",
            composites: "Compuestos",
            nanocomposites: "Nanocompuestos",
          },
          categoryLabel: "Categoría",
          cta: "Ver PDF",
          empty: "No hay fichas técnicas disponibles en esta categoría.",
        },
      },
      sectors: {
        metaTitle: "Nanoker | Sectores",
        hero: {
          titleHtml: "<span class=\"accent\">Sectores</span>",
          subtitle:
            "Materiales avanzados para sectores donde la fiabilidad depende del control de la funcionalidad del material.",
          intro:
            "Nanoker trabaja con sectores donde la elección del material impacta directamente el tiempo de cualificación, la fiabilidad operativa y la resiliencia de suministro.",
        },
        industry: {
          title: "Industria y Fabricación Avanzada",
          phrase: "Materiales diseñados para uptime, resistencia al desgaste y producción repetible.",
          text:
            "La fabricación avanzada requiere materiales capaces de operar bajo desgaste, corrosión, altas temperaturas y esfuerzos mecánicos continuos.",
          challengesTitle: "Retos",
          challenge1: "Desgaste y abrasión",
          challenge2: "Estabilidad a alta temperatura",
          challenge3: "Conductividad térmica controlada",
          challenge4: "Precisión dimensional",
          challenge5: "Repetibilidad lote a lote",
          solutionsTitle: "Respuestas industriales",
          solution1: "Cerámicas técnicas avanzadas",
          solution2: "Composites funcionales térmicos",
          solution3: "Componentes de precisión industrial",
          materialsTitle: "Materiales clave",
          material1: "Alúmina del 92/96/99,7/99,8/99,99% de pureza",
          material2: "Circona (YTZP, CeTZP, CaPSZ, MgPSZ, YFSZ)",
          material3: "Composites (ATZ, ZTA, ATiCSiC, ZTiN)",
          material4: "B4C, SiC, Si3N4, TiB2",
          material5: "AIN y AIN mecanizable",
          material6: "Composites Grafito-Mo/Cr, Diamante-Cu/Al",
          casesTitle: "Casos",
          case1: "Componentes EDM",
          case2: "Heat sinks estructurales",
          case3: "Piezas para automatización",
        },
        energy: {
          title: "Energía y Electrónica de Potencia",
          phrase:
            "Materiales para alta densidad de potencia, estrés térmico y larga vida operativa.",
          challengesTitle: "Retos",
          challenge1: "Gestión térmica extrema",
          challenge2: "Aislamiento eléctrico con alta conductividad térmica",
          challenge3: "Operación a >200ºC",
          challenge4: "Reducción de pérdidas por efecto Joule",
          challenge5: "Fiabilidad a largo plazo",
          solutionsTitle: "Soluciones",
          solution1: "SiC WBG",
          solution2: "Diamante CVD térmico",
          solution3: "AIN alta conductividad",
          solution4: "AIN mecanizable",
          solution5: "Composites térmicos",
          materialsTitle: "Materiales",
          material1: "SiC (poly & SC)",
          material2: "Diamante CVD (thermal grade)",
          material3: "AIN y AIN mecanizable (tipo Shapal)",
          material4: "Carbon-Metal Composites: Grafito-Mo/Cr, Diamante-Cu/Al",
          casesTitle: "Casos",
          case1: "Disipadores para módulos de potencia",
          case2: "Componentes térmicos para sistemas aeroespaciales",
          case3: "Electrónica de alta frecuencia",
          applicationsTitle: "Aplicaciones",
          application1: "Disipadores de potencia",
          application2: "Electrónica aeroespacial",
          application3: "Alta frecuencia",
        },
        health: {
          title: "Salud y Dispositivos Médicos",
          phrase:
            "Cerámicas técnicas y biocerámicas para aplicaciones reguladas donde trazabilidad y consistencia son obligatorias.",
          text:
            "El sector biomédico requiere materiales biocompatibles, estables y totalmente trazables bajo normativa estricta (ISO 13485, MDR). Nanoker aporta experiencia industrial validada en dispositivos de alta precisión.",
          challengesTitle: "Retos",
          challenge1: "Biocompatibilidad certificada",
          challenge2: "Estabilidad mecánica y química",
          challenge3: "Integración con sistemas electrónicos",
          challenge4: "Trazabilidad completa",
          solutionsTitle: "Soluciones",
          solution1: "Biocerámicas grado biomédico",
          solution2: "Nanocomposites biocompatibles grado biomédico",
          solution3: "Componentes complejos para cirugía guiada",
          solution4: "Implantes y sistemas intervencionistas",
          materialsTitle: "Materiales",
          material1: "Alúmina grado biomédico",
          material2: "Circona YTZP grado biomédico",
          material3: "Composites ATZ y TZP",
          material4: "Nanocomposites CeTZP-A",
          casesTitle: "Casos",
          case1: "Tornillos para cirugía cerebral guiada",
          case2: "Componentes para oncología intervencionista",
          case3: "Implante Inperio",
          case4: "Sistema Cerioss",
        },
        semiconductors: {
          title: "Semiconductores y equipamiento de fabricación",
          phrase:
            "Materiales \"fab-grade\" para entornos de proceso críticos con control de especificación, defectos y trazabilidad.",
          text:
            "La industrialización DeepTech depende de materiales con pureza extrema, estabilidad lote a lote y capacidad de escalado. Nanoker integra cerámicas técnicas con sustratos estratégicos como SiC, diamante y zafiro.",
          challengesTitle: "Retos",
          challenge1: "Pureza grado semiconductor",
          challenge2: "Control de defectos",
          challenge3: "Resistencia al ataque por plasma",
          challenge4: "Reducción de lead times",
          challenge5: "Independencia de proveedores externos",
          solutionsTitle: "Soluciones",
          solution1: "SiC wafers y componentes",
          solution2: "Diamante CVD (thermal / quantum / optical grade)",
          solution3: "Zafiro EPI-ready",
          solution4: "Cerámicas SPS/HIP para entornos extremos",
          capabilitiesTitle: "Capacidades clave",
          capability1: "MPCVD",
          capability2: "KV",
          capability3: "PVT",
          capability4: "SPS/HIP",
          capability5: "Dopaje NV / B / P",
          capability6: "CMP y acabado device-ready",
          capability7: "QA/QC completo",
          casesTitle: "Casos",
          case1: "Componentes para sistemas EUV",
          case2: "Cerámicas resistentes a plasma",
          case3: "Diamante para gestión térmica RF",
        },
        photonics: {
          title: "Fotónica y Óptica Avanzada",
          phrase:
            "Materiales ópticos para alta potencia, estabilidad espectral y superficies de precisión.",
          text:
            "La fotónica avanzada requiere materiales con baja absorción, alta transmisión y estabilidad térmica excepcional.",
          challengesTitle: "Retos",
          challenge1: "Alta potencia láser",
          challenge2: "Transmisión UV / IR / THz",
          challenge3: "Resistencia química",
          challenge4: "Precisión óptica",
          solutionsTitle: "Soluciones",
          solution1: "Diamante óptico",
          solution2: "Zafiro óptico",
          solution3: "ALON y espinelas",
          solution4: "Fotónica integrada en AIN",
          applicationsTitle: "Aplicaciones",
          application1: "Ventanas X",
          application2: "Domos IR",
          application3: "Láser de alta potencia",
          application4: "Espectroscopía multi-longitud de onda",
        },
        quantum: {
          title: "Cuántica y Sensores de Nueva Generación",
          phrase:
            "Materiales habilitadores para dispositivos cuánticos y arquitecturas de sensado de ultra precisión.",
          text:
            "El diamante con centros NV permite magnetometría, navegación GPS-denied y sensado de alta sensibilidad sin criogenia.",
          challengesTitle: "Retos",
          challenge1: "Control de defectos a escala atómica",
          challenge2: "Dopaje preciso",
          challenge3: "Estabilidad térmica",
          challenge4: "Escalabilidad industrial",
          solutionsTitle: "Soluciones",
          solution1: "Diamante NV-grade",
          solution2: "Dopaje on-demand (B / P / N)",
          solution3: "Estructuras multicapa personalizadas",
          applicationsTitle: "Aplicaciones",
          application1: "Quantum gyroscopes",
          application2: "Magnetometría avanzada",
          application3: "Sensores en entornos hostiles",
        },
        defense: {
          title: "Aeroespacial, Defensa y Espacio",
          phrase: "Materiales para sistemas críticos donde el fallo no es una opción.",
          challengesTitle: "Retos",
          challenge1: "Radiación",
          challenge2: "Temperaturas extremas",
          challenge3: "Blindaje transparente",
          challenge4: "Gestión térmica crítica",
          challenge5: "TCE nulo o a la carta",
          solutionsTitle: "Soluciones",
          solution1: "ALON",
          solution2: "Diamante CVD",
          solution3: "SiC estructural",
          solution4: "B₄C",
          solution5: "LAS-SiC",
          applicationsTitle: "Aplicaciones",
          application1: "Radar",
          application2: "Sensores IR",
          application3: "Electrónica rad-hard",
          application4: "Protección balística avanzada",
        },
        science: {
          title: "Ciencia e Infraestructuras",
          phrase:
            "Materiales y componentes para grandes instalaciones científicas e instrumentación avanzada bajo restricciones extremas.",
          text:
            "Big Science exige estabilidad dimensional extrema, pureza material y fiabilidad en condiciones fuera de estándar industrial.",
          challengesTitle: "Retos",
          challenge1: "Entornos de radiación",
          challenge2: "Vacío y plasma",
          challenge3: "Estabilidad térmica",
          challenge4: "Componentes ultraestables",
          solutionsTitle: "Soluciones",
          solution1: "Cerámicas grado CERN",
          solution2: "Ventanas para radiación",
          solution3: "Composites térmicos avanzados",
          applicationsTitle: "Aplicaciones",
          application1: "Detectores",
          application2: "Sistemas de colimación",
          application3: "Instrumentación científica",
        },
        cta: "Habla con ingeniería de Nanoker sobre los requisitos de tu sector.",
      },
    },

    ui: {
      viewDetails: "Ver detalles",
      arrow: "→",
    },

    // ✅ Sections used by index.html (sections.*)
    sections: {
      bottleneck: {
        tag: "01 · Cuello de botella",
        titleHtml: "El cuello de botella<br /><b>está en los materiales.</b>",
        text:
          "Los equipos pueden diseñarse rápido. Pero fabricar materiales con pureza extrema, control de defectos y estabilidad lote a lote requiere años de desarrollo. En DeepTech, la restricción real es el material.",
        specs: {
          risk: "Riesgo",
          riskVal: "Supply",
          variation: "Variación",
          variationVal: "Batch",
          leadtime: "Lead time",
          leadtimeVal: "Long",
          impact: "Impacto",
          impactVal: "System",
        },
        cta: "Ver solución integrada",
      },

      platform: {
        tag: "02 · Plataforma integrada",
        titleHtml: "Plataforma integrada<br /><b>de materiales avanzados.</b>",
        text:
          "Integramos verticalmente la cadena completa para entregar materiales y componentes con especificación certificada, repetibilidad industrial y continuidad de suministro europea.",
        specs: {
          synthesis: "Síntesis",
          synthesisVal: "Propia",
          growth: "Crecimiento",
          growthVal: "CVD / PVT / KY",
          densification: "Densificación",
          densificationVal: "SPS / HIP",
          qaqc: "QA/QC",
          qaqcVal: "Completo",
        },
        cta: "Ver materiales estratégicos",
      },

      strategic: {
        tag: "03 · Materiales estratégicos",
        titleHtml: "Materiales estratégicos<br /><b>DeepTech.</b>",
        text:
          "Portfolio integrado de materiales críticos para industrias donde el rendimiento depende del control del material: diamante CVD, SiC, zafiro y cerámicas técnicas SPS/HIP.",
        tiles: {
          diamond: {
            title: "Diamante CVD",
            text: "Quantum / Thermal / Optical. Control NV/B/P.",
          },
          sic: {
            title: "Silicon Carbide (SiC)",
            text: "Wafers SC + componentes PC para WBG y extremos.",
          },
          sapphire: {
            title: "Zafiro",
            text: "EPI-ready, SOS, óptica y electrónica avanzada.",
          },
          ceramics: {
            title: "Cerámicas SPS/HIP",
            text: "Beyond standard para plasma, térmico y precisión.",
          },
        },
        cta: "Ver sectores de aplicación",
      },

      capabilities: {
        tag: "04 · Capacidades industriales",
        titleHtml: "Capacidades industriales<br /><b>diseñadas para controlar la especificación.</b>",
        text:
          "Nanoker combina materiales estratégicos, procesos de precisión y disciplina industrial para pasar de la viabilidad a la producción repetible sin perder control de especificación.",
        specs: {
          materials: "MATERIALES",
          materialsVal: "SiC / diamante CVD / cerámicas / zafiro",
          processes: "PROCESOS",
          processesVal: "Crecimiento / densificación / mecanizado / metrología",
          precision: "PRECISIÓN",
          precisionVal: "Tolerancias exigentes y rutas de acabado controladas",
          scale: "ESCALABILIDAD",
          scaleVal: "Escalado listo para cualificación",
        },
        cards: {
          materials: {
            label: "Stack material",
            title: "Materiales críticos bajo un mismo flujo industrial",
            text: "SiC, diamante CVD, cerámicas técnicas y zafiro alineados con ventanas de rendimiento específicas de aplicación.",
          },
          manufacturing: {
            label: "Fabricación",
            title: "De síntesis y crecimiento a componente terminado",
            text: "Crecimiento cristalino, densificación SPS/HIP, mecanizado de precisión, pulido y metrología integrados para reducir riesgo entre etapas.",
          },
          precision: {
            label: "Precisión",
            title: "Disciplina de tolerancias para ensamblajes críticos",
            text: "Control dimensional, acabado superficial y repetibilidad lote a lote orientados a soportar cualificación e integración aguas abajo.",
          },
          scale: {
            label: "Escala industrial",
            title: "Producción escalable con lógica de cualificación",
            text: "Rutas de industrialización diseñadas para lotes piloto, paquetes documentales y ramp-up progresivo de volumen sin recualificar toda la cadena.",
          },
        },
        cta: "Ver preparación industrial",
      },

      readiness: {
        tag: "05 · Confianza y preparación",
        titleHtml: "Preparación industrial<br /><b>que el cliente puede cualificar.</b>",
        text:
          "La credibilidad en sectores críticos se construye con documentación, control de proceso y disciplina de cumplimiento. Nanoker estructura la entrega en torno a lo que necesitan aprobar calidad y compras.",
        items: {
          spec: {
            title: "Especificación garantizada",
            text: "Especificaciones de material y componente controladas y vinculadas a requisitos técnicos acordados.",
          },
          traceability: {
            title: "Trazabilidad",
            text: "Trazabilidad a nivel de lote desde precursor, ruta de proceso y registro de inspección hasta el componente entregado.",
          },
          qc: {
            title: "Control de calidad",
            text: "Lógica de inspección de entrada, en proceso y final diseñada para detectar desviaciones antes de que se conviertan en riesgo de sistema.",
          },
          compliance: {
            title: "Cumplimiento y estándares",
            text: "Controles industriales y documentación alineados con cualificación, auditorías y entornos de fabricación regulados.",
          },
        },
        cta: "Ver sectores estratégicos",
      },

      sectors: {
        tag: "06 · Sectores estratégicos",
        titleHtml: "Sectores donde el control del material<br /><b>se convierte en ventaja estratégica.</b>",
        text:
          "Aeroespacial, defensa, energía e industria avanzada no son solo mercados finales. Son programas estratégicos donde los materiales cualificados determinan preparación, resiliencia y ventaja a nivel sistema.",
        cards: {
          aerospace: {
            label: "Aeroespacial",
            title: "La fiabilidad de vuelo empieza en el material",
            text: "Estabilidad térmica, arquitecturas ligeras y consistencia dimensional para entornos de alta consecuencia.",
          },
          defense: {
            label: "Defensa",
            title: "Resiliencia de suministro para sistemas soberanos críticos",
            text: "Materiales y componentes diseñados para entornos hostiles, suministro controlado y programas sensibles a la cualificación.",
          },
          energy: {
            label: "Energía",
            title: "Eficiencia y control térmico cuando el uptime no se negocia",
            text: "SiC, diamante térmico y cerámicas avanzadas para soportar densidad de potencia, fiabilidad y largas ventanas operativas.",
          },
          industry: {
            label: "Industria avanzada",
            title: "Estabilidad de proceso para equipamiento industrial de nueva generación",
            text: "Componentes de precisión y materiales diseñados para desgaste, plasma, corrosión y entornos de producción de alto throughput.",
          },
        },
        specs: {
          positioning: "POSICIONAMIENTO",
          positioningVal: "Programas estratégicos",
          requirement: "REQUISITO COMÚN",
          requirementVal: "Fiabilidad cualificada",
          value: "PALANCA DE VALOR",
          valueVal: "Control material",
          outcome: "RESULTADO DE PROGRAMA",
          outcomeVal: "Preparación y resiliencia de suministro",
        },
        cta: "Ver modelo de transferencia industrial",
      },

      rnd: {
        tag: "08 · I+D a 24/7",
        titleHtml: "De la investigación<br /><b>a la producción 24/7.</b>",
        text:
          "Más de 15 años en ciencia de materiales orientada a industrialización: desarrollo experimental, validación, cualificación cliente (6–24 meses) y escalado progresivo en oleadas.",
        specs: {
          qual: "Cualificación",
          qualVal: "6–24 m",
          model: "Modelo",
          modelVal: "Oleadas",
          uptime: "Disponibilidad",
          uptimeVal: ">95%",
          ops: "Operación",
          opsVal: "24/7",
        },
        cta: "Ventaja estructural europea",
      },
    },

    // ✅ Advantages used by index.html (advantages.*)
    advantages: {
      tag: "BLOQUE 7 · VENTAJA COMPETITIVA",
      titleHtml: "Ventajas<br /><b>estructurales.</b>",
      subtitle:
        "Integración vertical + especificación certificada + seguridad de suministro europea. Los materiales críticos no son intercambiables: son infraestructura tecnológica.",
      items: [
        { title: "Integración vertical", text: "Control total de proceso, metrología y QA/QC." },
        { title: "Ventaja energética", text: "Producción intensiva en energía optimizada y competitiva." },
        { title: "CBAM-ready & sostenibilidad", text: "Producción alineada con defensa, aeroespacial y transición verde." },
        { title: "Protección de IP europea", text: "Marco jurídico robusto y proximidad a clientes estratégicos." },
      ],
      closing:
        "Europa no puede liderar en semiconductores, cuántica o defensa mientras dependa de cadenas externas para materiales críticos. Nanoker contribuye a construir esa base industrial.",
      cta: "Ver mensaje estratégico",
    },

    sovereignty: {
      tag: "BLOQUE 9 · MENSAJE ESTRATÉGICO",
      titleHtml: "Soberanía<br /><b>tecnológica europea</b>",
      text1:
        "Europa no puede liderar en semiconductores, cuántica o defensa mientras dependa de cadenas de suministro externas para materiales críticos.",
      text2:
        "<b>Nanoker</b> contribuye a construir una infraestructura industrial europea capaz de garantizar calidad, coste y suministro en sectores estratégicos.",
      cta: "Ir al CTA final",
    },

    finalCta: {
      tag: "BLOQUE 10 · CTA FINAL",
      titleHtml: "¿Estás desarrollando<br /><b>una tecnología crítica?</b>",
      text:
        "Cuéntanos tu aplicación y trabajemos juntos en la arquitectura material que la haga viable.",
      primary: "Iniciar evaluación técnica",
      secondary: "Contactar",
    },

    // ✅ Footer used by index.html (footer.*)
    footer: {
      brandTitle: "nanoker",
      brandTextHtml:
        "Plataforma industrial europea para tecnologías críticas.<br/>Materiales avanzados con especificación garantizada, trazabilidad completa y escalabilidad industrial.",
      noteHtml:
        "<b>Contacto técnico:</b> procesamos solicitudes en <b>3–5 días laborables</b>.",

      colSite: {
        title: "Site",
        links: {
          home: "Home",
          company: "Empresa",
          sectors: "Sectores",
          materials: "Materiales",
          capabilities: "Capacidades",
          rnd: "I+D",
          contact: "Contacto",
        },
      },

      colHubs: {
        title: "Hubs industriales",
        links: {
          oviedo: "Oviedo — Desarrollo & Validación",
          leon: "León — Hub industrial",
          supply: "European Supply",
        },
      },

      colPolicies: {
        title: "Políticas",
        links: {
          quality: "Calidad",
          sustainability: "Sostenibilidad",
          occupationalSafety: "Seguridad laboral",
          infoSecurity: "Seguridad de la información",
          ethicsCompliance: "Ética y cumplimiento",
          equalityDiversity: "Igualdad y diversidad",
          certifications: "Certificaciones →",
        },
      },

      colConnect: {
        title: "Contacto",
        email: "info@nanoker.com",
        phone: "+34 985 000 000",
        address: "Parque Empresarial de Oviedo, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain",
        links: {
          linkedin: "LinkedIn ↗",
        },
      },

      system: {
        label: "ESTADO DEL SISTEMA:",
        value: "OPERATIVO",
      },

      legal: {
        copyright: "© 2026 Nanoker Research S.L.",
        privacy: "Política de privacidad",
        cookies: "Política de cookies",
        notice: "Aviso legal",
      },
    },

    legalCommon: {
      summary: "Resumen",
      moreInfo: "Más información",
      footerLegalTitle: "Legal",
    },

    cookieBanner: {
      title: "Cookies",
      description: "Utilizamos cookies para mejorar tu experiencia y analizar el uso de la web.",
      accept: "Aceptar",
      reject: "Rechazar",
      learnMore: "Más información",
    },

    privacy: {
      metaTitle: "Política de Privacidad | Nanoker",
      metaDescription:
        "Política de Privacidad de Nanoker Research S.L. con información sobre responsable del tratamiento, finalidades, bases jurídicas, conservación, derechos y seguridad.",
      ogLocale: "es_ES",
      hero: {
        kicker: "Legal / RGPD",
        titleHtml: "Política de <span>Privacidad</span>",
        lead:
          "Esta política explica cómo Nanoker Research S.L. recopila, utiliza, conserva y protege los datos personales obtenidos a través del sitio web corporativo y de las comunicaciones profesionales vinculadas a su actividad.",
        metaUpdated: "Última actualización: 24 de marzo de 2026",
        metaLaw: "Normativa: RGPD y LOPDGDD",
        metaScope: "Ámbito: web corporativa y contacto comercial",
      },
      sections: {
        controller: {
          title: "1. Responsable del tratamiento",
          labelCompany: "Responsable",
          valueCompany: "Nanoker Research S.L.",
          labelAddress: "Domicilio",
          valueAddress: "Parque Empresarial de Oviedo, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, España.",
          labelEmail: "Email",
          valueEmail: "info@nanoker.com",
          labelPhone: "Teléfono",
          valuePhone: "+34 985 000 000",
        },
        purpose: {
          title: "2. Finalidad del tratamiento",
          p1: "Tratamos datos personales para atender consultas, gestionar oportunidades comerciales y técnicas, mantener relaciones contractuales y proteger la seguridad del sitio web y de las comunicaciones corporativas.",
          p2: "Cuando el usuario remite información mediante formularios, correo electrónico o llamadas, los datos se utilizan exclusivamente para responder, tramitar solicitudes o desarrollar la relación profesional correspondiente.",
        },
        legalBasis: {
          title: "3. Base legal",
          item1: "Consentimiento del interesado cuando envía solicitudes o acepta tratamientos opcionales.",
          item2: "Aplicación de medidas precontractuales para preparar propuestas, evaluaciones técnicas o presupuestos.",
          item3: "Ejecución de un contrato cuando existe una relación comercial o de suministro.",
          item4: "Cumplimiento de obligaciones legales en materia mercantil, fiscal o regulatoria.",
          item5: "Interés legítimo para preservar la seguridad, continuidad y trazabilidad de la actividad corporativa.",
        },
        retention: {
          title: "4. Conservación de los datos",
          p1: "Los datos se conservan durante el tiempo estrictamente necesario para cumplir la finalidad que motivó su recogida y, posteriormente, durante los plazos legales exigibles.",
          item1: "Consultas generales: hasta 24 meses desde la última interacción.",
          item2: "Solicitudes comerciales o técnicas: mientras la oportunidad siga activa y durante los plazos de defensa jurídica aplicables.",
          item3: "Datos contractuales y administrativos: durante los plazos legales de conservación mercantil, fiscal y contable.",
          item4: "Tratamientos basados en consentimiento: hasta su retirada o hasta que dejen de ser necesarios.",
        },
        rights: {
          title: "5. Derechos del usuario",
          p1: "La persona interesada puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y retirada del consentimiento.",
          p2: 'Para ello puede escribir a <a href="mailto:info@nanoker.com">info@nanoker.com</a>. También puede presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a> si considera que el tratamiento no se ajusta a la normativa.',
        },
        security: {
          title: "6. Seguridad",
          p1: "Nanoker aplica medidas técnicas y organizativas razonables para evitar la pérdida, alteración, acceso no autorizado o divulgación indebida de los datos. Entre ellas se incluyen controles de acceso, revisión de proveedores, procedimientos internos y seguimiento de incidentes.",
          p2: "No obstante, ningún entorno conectado a Internet puede garantizar una seguridad absoluta, por lo que la protección se aplica con criterios de diligencia y mejora continua.",
        },
      },
      summary: {
        item1Title: "Responsable",
        item1Text: "Nanoker Research S.L.",
        item2Title: "Finalidad",
        item2Text: "Contacto, gestión comercial, operaciones y seguridad.",
        item3Title: "Base jurídica",
        item3Text: "Consentimiento, contrato, obligación legal e interés legítimo.",
        item4Title: "Derechos",
        item4Text: "Acceso, rectificación, supresión, oposición, limitación y portabilidad.",
      },
      more: {
        cookiesTitle: "Política de Cookies",
        cookiesText: "Uso de cookies, tecnologías similares y gestión del consentimiento.",
        noticeTitle: "Aviso legal",
        noticeText: "Condiciones de uso, propiedad intelectual y responsabilidad.",
      },
    },

    cookies: {
      metaTitle: "Política de Cookies | Nanoker",
      metaDescription:
        "Política de Cookies de Nanoker con explicación sobre qué son las cookies, sus tipos, cookies de terceros y cómo gestionarlas.",
      ogLocale: "es_ES",
      hero: {
        kicker: "Legal / Cookies",
        titleHtml: "Política de <span>Cookies</span>",
        lead:
          "Esta política informa sobre el uso de cookies y tecnologías similares en el sitio web de Nanoker, su finalidad, la posible intervención de terceros y las opciones disponibles para gestionarlas.",
        metaUpdated: "Última actualización: 24 de marzo de 2026",
        metaLaw: "Normativa: RGPD, LSSI-CE y guía AEPD",
        metaScope: "Ámbito: navegación web",
      },
      sections: {
        definition: {
          title: "1. Qué son cookies",
          p1: "Las cookies son pequeños archivos que se descargan en el dispositivo del usuario cuando accede a un sitio web. Sirven para almacenar y recuperar información sobre la navegación, recordar preferencias o facilitar determinados servicios técnicos.",
          p2: "Además de cookies, el sitio puede utilizar tecnologías equivalentes como almacenamiento local del navegador para mantener configuraciones básicas de interfaz.",
        },
        types: {
          title: "2. Tipos de cookies",
          item1: "<strong>Técnicas:</strong> necesarias para el funcionamiento básico, seguridad, navegación y gestión de sesión.",
          item2: "<strong>Preferencias:</strong> recuerdan configuraciones como idioma o visualización.",
          item3: "<strong>Analíticas:</strong> permiten medir el uso del sitio y mejorar su rendimiento.",
          item4: "<strong>Marketing:</strong> destinadas a seguimiento publicitario y personalización comercial.",
        },
        thirdParty: {
          title: "3. Cookies de terceros",
          p1: "Determinados servicios integrados en el sitio pueden instalar cookies de terceros, por ejemplo herramientas de analítica, mapas, vídeo embebido o plataformas externas. En esos casos, la gestión y duración de las cookies depende de cada proveedor.",
          p2: "En la configuración actual del sitio de Nanoker no se activan cookies publicitarias por defecto. Si se incorporan servicios opcionales de terceros sujetos a consentimiento, se informará previamente y se habilitará el mecanismo de aceptación correspondiente.",
        },
        manage: {
          title: "4. Cómo gestionarlas",
          p1: "El usuario puede permitir, bloquear o eliminar cookies desde la configuración de su navegador. La desactivación de determinadas cookies técnicas puede afectar al correcto funcionamiento del sitio.",
          item1: "Chrome: configuración de privacidad y seguridad.",
          item2: "Firefox: preferencias de privacidad y cookies.",
          item3: "Safari: gestión de cookies y datos de sitios web.",
          item4: "Edge: permisos del sitio y eliminación de datos de navegación.",
        },
      },
      summary: {
        item1Title: "Cookies técnicas",
        item1Text: "Necesarias para seguridad, navegación y funciones básicas.",
        item2Title: "Cookies opcionales",
        item2Text: "Analítica o terceros solo cuando proceda y bajo información previa.",
        item3Title: "Gestión",
        item3Text: "El usuario puede configurar o eliminar cookies desde su navegador.",
      },
      more: {
        privacyTitle: "Política de privacidad",
        privacyText: "Tratamiento de datos personales y derechos del usuario.",
        noticeTitle: "Aviso legal",
        noticeText: "Condiciones de uso, propiedad intelectual y limitación de responsabilidad.",
      },
    },

    legalNotice: {
      metaTitle: "Aviso Legal | Nanoker",
      metaDescription:
        "Aviso legal de Nanoker Research S.L. con datos identificativos, condiciones de uso, propiedad intelectual y limitación de responsabilidad.",
      ogLocale: "es_ES",
      hero: {
        kicker: "Legal / Corporate",
        titleHtml: "Aviso <span>Legal</span>",
        lead:
          "Este documento regula el acceso, navegación y uso del sitio web de Nanoker Research S.L., así como las condiciones aplicables a sus contenidos, derechos de propiedad intelectual y limitación de responsabilidad.",
        metaUpdated: "Última actualización: 24 de marzo de 2026",
        metaScope: "Ámbito: sitio web corporativo",
        metaLaw: "Legislación aplicable: España",
      },
      sections: {
        identification: {
          title: "1. Datos identificativos",
          labelOwner: "Titular del sitio",
          valueOwner: "Nanoker Research S.L.",
          labelAddress: "Domicilio",
          valueAddress: "Polígono de Olloniego, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, España.",
          labelEmail: "Email",
          valueEmail: "info@nanoker.com",
          labelPhone: "Teléfono",
          valuePhone: "+34 985 000 000",
        },
        terms: {
          title: "2. Condiciones de uso",
          p1: "El acceso y navegación por este sitio atribuyen la condición de usuario e implican la aceptación de este aviso legal. El usuario se compromete a hacer un uso adecuado del sitio, de sus contenidos y de los servicios disponibles conforme a la ley, la buena fe y el orden público.",
          p2: "Queda prohibido utilizar el sitio con fines ilícitos, lesivos para Nanoker o para terceros, así como introducir o difundir virus, scripts maliciosos o cualquier actuación que pueda alterar el funcionamiento de la plataforma.",
        },
        ip: {
          title: "3. Propiedad intelectual",
          p1: "Todos los contenidos del sitio, incluyendo textos, diseños, estructura, gráficos, logotipos, imágenes, vídeos, código fuente y elementos distintivos, son titularidad de Nanoker o se utilizan con autorización suficiente.",
          p2: "Queda prohibida la reproducción, distribución, transformación, comunicación pública o explotación total o parcial sin autorización previa y por escrito, salvo en los supuestos legalmente permitidos.",
        },
        liability: {
          title: "4. Responsabilidad",
          p1: "Nanoker adopta medidas razonables para asegurar la disponibilidad, exactitud y actualización del sitio, pero no garantiza la inexistencia de errores, interrupciones o incidencias técnicas puntuales.",
          p2: "Nanoker no será responsable de los daños derivados del uso indebido del sitio, de decisiones adoptadas a partir de la información publicada ni de contenidos de terceros enlazados desde esta web, salvo en los casos en que la ley disponga lo contrario.",
        },
      },
      summary: {
        item1Title: "Titular",
        item1Text: "Nanoker Research S.L.",
        item2Title: "Uso permitido",
        item2Text: "Navegación y consulta legítima de información corporativa.",
        item3Title: "Protección",
        item3Text: "Los contenidos y activos del sitio están protegidos por derechos de propiedad intelectual.",
        item4Title: "Responsabilidad",
        item4Text: "La información se ofrece con criterios de diligencia, sin garantía absoluta de ausencia de incidencias.",
      },
      more: {
        privacyTitle: "Política de privacidad",
        privacyText: "Tratamiento de datos, conservación y derechos del usuario.",
        cookiesTitle: "Política de cookies",
        cookiesText: "Cookies, tecnologías similares y gestión de preferencias.",
      },
    },

    // Keep your old "cards/value" blocks if you still use them elsewhere
    cards: {
      quantum: {
        tag: "01 · Resonancia",
        title: "Sensado<br><b>Cuántico.</b>",
        text:
          "Ingeniería de defectos a escala atómica. Diamante CVD con centros Nitrógeno-Vacante (NV) que exhiben coherencia cuántica a temperatura ambiente.",
        spec: {
          coherence: "Coherencia",
          defects: "Defectos",
          growth: "Crecimiento",
          process: "Proceso",
        },
      },

      semi: {
        tag: "02 · Litografía",
        title: "Potencia de<br><b>Banda Ancha.</b>",
        text:
          "Sustratos de Carburo de Silicio (SiC) y zafiro EPI-Ready. Superficies atómicamente planas (< 0.2 nm) para la próxima generación de electrónica de potencia.",
        spec: {
          material: "Material",
          purity: "Pureza",
          roughness: "Rugosidad",
          focus: "Anillo de foco",
        },
      },

      extreme: {
        tag: "03 · Blindaje",
        title: "Entornos<br><b>Extremos.</b>",
        text:
          "Cerámicas técnicas sinterizadas (SPS). Alúmina y B4C diseñados para soportar abrasión extrema, impacto balístico y reentrada atmosférica.",
        spec: {
          temp: "Temp",
          thermal: "Térmica",
          cert: "Cert",
          density: "Densidad",
        },
      },

      medical: {
        tag: "04 · Médico",
        title: "Servicios<br><b>Médicos.</b>",
        text:
          "Consultas, diagnóstico y seguimiento clínico con equipos avanzados y un enfoque centrado en el paciente.",
        spec: {
          wait: "Espera",
          results: "Resultados",
          specialties: "Especialidades",
          support: "Soporte",
        },
      },

      implants: {
        tag: "05 · Implantes",
        title: "Implantes<br><b>dentales.</b>",
        text:
          "Diseño, fabricación y colocación de implantes biomédicos de alta precisión con materiales avanzados y biocompatibles.",
        spec: {
          material: "Material",
          precision: "Precisión",
          integration: "Integración",
          lifetime: "Duración",
        },
      },
    },

    value: {
      title: "Por qué<br><b>Nanoker.</b>",
      subtitle:
        "Plataforma integrada que conecta investigación avanzada, fabricación europea y trazabilidad total.",
      items: [
        { eyebrow: "01", title: "Materiales de precisión", text: "Control nanométrico y repetibilidad industrial." },
        { eyebrow: "02", title: "Escala industrial", text: "Del prototipo a producción certificada." },
        { eyebrow: "03", title: "Calidad confiable", text: "QA/QC y certificaciones europeas." },
        { eyebrow: "04", title: "Resiliencia estratégica", text: "Soberanía industrial y trazabilidad total." },
      ],
    },
  },
});

export const BASE_LOCALES = deepFreeze({
  en: BASE_I18N.en,
  es: BASE_I18N.es,
});

export const LOCALE_OVERRIDES = deepFreeze({
  fr: FR_OVERRIDES,
  de: DE_OVERRIDES,
});

export const I18N = deepFreeze({
  ...BASE_I18N,
  fr: mergeDeep(BASE_I18N.en, FR_OVERRIDES),
  de: mergeDeep(BASE_I18N.en, DE_OVERRIDES),
});

