// js/i18n.js
// Single source of truth for UI copy (EN/ES).
// Tip: Keep keys identical between languages.

function deepFreeze(obj) {
  if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop]));
  return obj;
}

export const I18N = deepFreeze({
  en: {
    nav: {
      // ✅ NAV MENU (matches index.html data-i18n)
      home: "Home",
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
      quantum: "Quantum",
      semi: "Semiconductors",
      extreme: "Defense & Space",
      medical: "Medical",
      implants: "Implants",
      lang: "EN",
    },

    hero: {
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

      sectors: {
        tag: "04 · Critical Sectors",
        titleHtml: "Sectors where materials<br /><b>are critical.</b>",
        text:
          "A shared challenge: reliability under extreme conditions. We integrate into OEM roadmaps and systems where the material defines performance, total cost, and scalability.",
        tiles: {
          semiconductors: {
            title: "Semiconductors",
            text: "Fab-grade, purity, defects, traceability.",
          },
          quantum: {
            title: "Quantum & Sensors",
            text: "Atomic control, NV centers, stability.",
          },
          energy: {
            title: "Energy & Power",
            text: "Thermal management, >200°C, high voltage.",
          },
          defense: {
            title: "Defense & Space",
            text: "Rad-hard, extreme environments, zero failure tolerance.",
          },
          photonics: {
            title: "Photonics",
            text: "UV–IR, high power, advanced optics.",
          },
          health: {
            title: "Health",
            text: "Biocompatibility, traceability, regulation.",
          },
        },
        cta: "See R&D and scale-up",
      },

      rnd: {
        tag: "05 · R&D to 24/7",
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
          title: "European IP & lock-in",
          text: "Robust legal framework + qualification that anchors supply.",
        },
      ],
      closing:
        "Europe cannot lead in semiconductors, quantum or defense while relying on external chains for critical materials. Nanoker helps build that industrial base.",
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
          capabilities: "Capabilities",
          materials: "Materials",
          sectors: "Sectors",
          rnd: "R&D",
          advantages: "Advantages",
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

      colConnect: {
        title: "Connect",
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
        notice: "Legal Notice",
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
      quantum: "Cuántica",
      semi: "Semiconductores",
      extreme: "Defensa y Espacio",
      medical: "Médico",
      implants: "Implantes",
      lang: "ES",
    },

    hero: {
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

      sectors: {
        tag: "04 · Sectores críticos",
        titleHtml: "Sectores donde el material<br /><b>es crítico.</b>",
        text:
          "Un reto común: fiabilidad bajo condiciones extremas. Nos integramos en roadmaps tecnológicos de OEMs y sistemas donde el material define rendimiento, coste total y escalabilidad.",
        tiles: {
          semiconductors: {
            title: "Semiconductores",
            text: "Fab-grade, pureza, defectos, trazabilidad.",
          },
          quantum: {
            title: "Cuántica & Sensores",
            text: "Control atómico, centros NV, estabilidad.",
          },
          energy: {
            title: "Energía & Potencia",
            text: "Gestión térmica, >200°C, alta tensión.",
          },
          defense: {
            title: "Defensa & Espacio",
            text: "Rad-hard, extremos, fallo no permitido.",
          },
          photonics: {
            title: "Fotónica",
            text: "UV–IR, alta potencia, óptica avanzada.",
          },
          health: {
            title: "Salud",
            text: "Biocompatibilidad, trazabilidad, regulación.",
          },
        },
        cta: "Ver I+D y escalado",
      },

      rnd: {
        tag: "05 · I+D a 24/7",
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
      titleHtml: "Ventajas<br /><b>estructurales.</b>",
      subtitle:
        "Integración vertical + especificación certificada + seguridad de suministro europea. Los materiales críticos no son intercambiables: son infraestructura tecnológica.",
      items: [
        { title: "Integración vertical", text: "Control total de proceso, metrología y QA/QC." },
        { title: "Ventaja energética", text: "Producción intensiva en energía optimizada y competitiva." },
        { title: "CBAM-ready & sostenibilidad", text: "Producción alineada con defensa, aeroespacial y transición verde." },
        { title: "IP europea & lock-in", text: "Marco jurídico robusto + cualificación que consolida suministro." },
      ],
      closing:
        "Europa no puede liderar en semiconductores, cuántica o defensa mientras dependa de cadenas externas para materiales críticos. Nanoker contribuye a construir esa base industrial.",
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
          capabilities: "Capacidades",
          materials: "Materiales",
          sectors: "Sectores",
          rnd: "I+D",
          advantages: "Ventajas",
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

      colConnect: {
        title: "Contacto",
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
        notice: "Aviso legal",
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
