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

    pages: {
      company: {
        metaTitle: "Nanoker | Company",
        hero: {
          eyebrow: "Company",
          titleHtml:
            "Industrial infrastructure for <span class=\"empresa-accent\">strategic technologies.</span>",
          text:
            "Nanoker is an industrial platform specialized in advanced materials for DeepTech sectors where reliability, certified specification, and supply continuity are mission-critical.",
        },
        mission: {
          title: "Our Mission",
          priorities: {
            title: "Industrial priorities",
            item1: "Purity and stability from batch to batch",
            item2: "Reduced supply-chain risk",
            item3: "End-to-end traceability",
            item4: "European industrial scale-up",
          },
          who: {
            title: "Who we are",
            item1: "Manufacturer of ceramic components",
            item2: "Developer of advanced formulations",
            item3: "Integrator of advanced technologies",
            item4: "Strategic partner to critical European OEMs",
          },
        },
        platform: {
          titleHtml: "Integrated <span class=\"empresa-accent\">Platform</span>",
          subtitle: "Complete vertical integration",
          card1: "Synthesis & Growth",
          card2: "Precision Machining",
          card3: "Finishing & Metrology",
          card4: "QA & Control",
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
          title: "Industrial Infrastructure",
          item1: "Progressive technical qualification (6-24 months by sector)",
          item2: "Wave-based scale-up",
          item3: "24/7 operation",
          item4: "Availability >95%",
        },
        advantage: {
          title: "European structural advantage",
          subtitle: "Energy, sustainability, and sovereignty",
          text:
            "Advanced-material manufacturing is energy-intensive. Operating in a competitive renewable-energy environment with low carbon intensity provides:",
          item1: "Structural cost advantage",
          item2: "CBAM compliance",
          item3: "Access to demanding markets (defense, aerospace, premium automotive)",
          item4: "European legal certainty and IP protection",
          closingHtml:
            "It is not only an environmental matter.<br />It is a durable competitive advantage.",
        },
        approach: {
          title: "Our approach",
          subtitle: "How we work with our customers",
          item1: "We define the critical material specification",
          item2: "We validate technically and metrologically",
          item3: "We qualify under sector standards",
          item4: "We scale production with industrial repeatability",
          text: "We integrate into each customer's technology roadmap.",
        },
        vision: {
          title: "Vision",
          subtitle: "Strategic infrastructure for European DeepTech",
          textHtml:
            "Europe cannot lead in advanced semiconductors, quantum technologies, or defense systems without controlling the materials that enable them.<br />Nanoker is building that industrial foundation.",
        },
        quote: "Whoever controls the material controls the technology.",
      },
      materials: {
        metaTitle: "Nanoker | Materials",
        hero: {
          eyebrow: "MATERIALS",
          titleHtml: "Strategic <span style=\"color: #3B82F6;\">DeepTech</span> Materials",
          text1:
            "To control materials is to control performance, reliability, and scalability in critical technologies.",
          text2:
            "Nanoker integrates a portfolio of advanced materials that form the physical foundation of Europe’s next DeepTech wave: wide-bandgap semiconductors, advanced photonics, quantum sensing, defense, and high-efficiency energy systems.",
        },
        philosophy: {
          title: "Philosophy",
          subtitle: "More than raw materials: material architecture",
          text: "We do not supply standard materials. We engineer materials:",
          item1: "With controlled purity",
          item2: "With optimized defect engineering",
          item3: "With designed functional properties",
          item4: "With full traceability",
          item5: "Ready for industrial qualification",
          deliverHtml:
            "Each material is delivered as <span class=\"mat-glow\">component-ready</span> or <span class=\"mat-glow\">device-ready</span>, not as a commodity.",
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
          subtitle: "Complete vertical integration",
          stage1: "Synthesis and Formulation",
          stage2: "Crystal Growth (CVD/PVT/HME)",
          stage3: "Advanced Densification (SPS/HIP)",
          stage4: "Precision Machining",
          stage5: "Surface Finishing and CMP",
          stage6: "Metrology and QA/QC",
          stage7: "Qualification and Industrial Scale-Up",
          strip:
            "Diamond | Silicon Carbide | Sapphire | Technical Ceramics | Carbon-Metal Composites",
          text: "This enables:",
          item1: "Dramatic supply-risk reduction",
          item2: "Optimization of total cost of ownership",
          item3: "Qualification-driven lock-in",
          item4: "Batch-to-batch stability",
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
            "Strategic materials are not interchangeable. They are technological infrastructure.",
          text2:
            "Controlling diamond, SiC, sapphire, and advanced ceramics in Europe means:",
          item1: "Reducing external dependency",
          item2: "Securing industrial continuity",
          item3: "Strengthening technological sovereignty",
          closing: "Nanoker is building that materials foundation.",
        },
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
        email: "info@nanoker.com",
        phone: "+34 985 000 000",
        address: "Polígono de Olloniego, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain",
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

    pages: {
      company: {
        metaTitle: "Nanoker | Empresa",
        hero: {
          eyebrow: "EMPRESA",
          titleHtml:
            "Infraestructura industrial para <span class=\"empresa-accent\">tecnologías estratégicas.</span>",
          text:
            "Nanoker es una plataforma industrial especializada en materiales avanzados para sectores DeepTech donde la fiabilidad, la especificación certificada y la continuidad de suministro son críticas.",
        },
        mission: {
          title: "Nuestra Misión",
          priorities: {
            title: "Prioridades industriales",
            item1: "Pureza y estabilidad lote a lote",
            item2: "Reducción de riesgo de suministro",
            item3: "Trazabilidad completa",
            item4: "Escalado industrial europeo",
          },
          who: {
            title: "Quiénes somos",
            item1: "Fabricante de componentes cerámicos",
            item2: "Desarrollador de formulaciones avanzadas",
            item3: "Integrador de tecnologías avanzadas",
            item4: "Socio de OEMs europeos críticos",
          },
        },
        platform: {
          titleHtml: "Plataforma <span class=\"empresa-accent\">Integrada</span>",
          subtitle: "Integración vertical completa",
          card1: "Síntesis & Crecimiento",
          card2: "Mecanizado de Precisión",
          card3: "Acabado & Metrología",
          card4: "QA & Control",
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
          title: "Infraestructura Industrial",
          item1: "Cualificación técnica progresiva (6–24 meses según sector)",
          item2: "Escalado en oleadas",
          item3: "Operación 24/7",
          item4: "Disponibilidad >95%",
        },
        advantage: {
          title: "Ventaja estructural europea",
          subtitle: "Energía, sostenibilidad y soberanía",
          text:
            "La fabricación de materiales avanzados es intensiva en energía. Operar en un entorno con energía renovable competitiva y baja intensidad de carbono proporciona:",
          item1: "Ventaja estructural de coste",
          item2: "Cumplimiento CBAM",
          item3: "Acceso a mercados exigentes (defensa, aeroespacial, automoción premium)",
          item4: "Seguridad jurídica e IP europea",
          closingHtml:
            "No es solo una cuestión medioambiental.<br />Es una ventaja competitiva permanente.",
        },
        approach: {
          title: "Nuestro enfoque",
          subtitle: "Cómo trabajamos con nuestros clientes",
          item1: "Definimos la especificación crítica del material",
          item2: "Validamos técnica y metrológicamente",
          item3: "Cualificamos bajo estándares sectoriales",
          item4: "Escalamos producción con repetibilidad industrial",
          text: "Nos integramos en los roadmaps tecnológicos del cliente.",
        },
        vision: {
          title: "Visión",
          subtitle: "Infraestructura estratégica para la DeepTech europea",
          textHtml:
            "Europa no puede liderar en semiconductores avanzados, tecnologías cuánticas o sistemas de defensa sin controlar los materiales que los hacen posibles.<br />Nanoker trabaja para construir esa base industrial.",
        },
        quote: "Quien controla el material controla la tecnología.",
      },
      materials: {
        metaTitle: "Nanoker | Materiales",
        hero: {
          eyebrow: "MATERIALES",
          titleHtml: "Materiales Estratégicos <span style=\"color: #3B82F6;\">DeepTech</span>",
          text1:
            "Controlar el material es controlar el rendimiento, la fiabilidad y la escalabilidad de las tecnologías críticas.",
          text2:
            "Nanoker integra un portfolio de materiales avanzados que constituyen la base física de la nueva DeepTech europea: semiconductores de banda ancha, fotónica avanzada, sensores cuánticos, defensa y sistemas energéticos de alta eficiencia.",
        },
        philosophy: {
          title: "Filosofía",
          subtitle: "Más que materias primas: arquitectura material",
          text: "No suministramos materiales estándar. Desarrollamos materiales:",
          item1: "Con pureza controlada",
          item2: "Con defectología optimizada",
          item3: "Con propiedades funcionales diseñadas",
          item4: "Con trazabilidad completa",
          item5: "Listos para cualificación industrial",
          deliverHtml:
            "Cada material se entrega como <span class=\"mat-glow\">component-ready</span> o <span class=\"mat-glow\">device-ready</span>, no como commodity.",
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
          subtitle: "Integración vertical completa",
          stage1: "Síntesis y Formulación",
          stage2: "Crecimiento Cristalino (CVD/PVT/HME)",
          stage3: "Densificación Avanzada (SPS/HIP)",
          stage4: "Mecanizado de Precisión",
          stage5: "Acabado Superficial y CMP",
          stage6: "Metrología y QA/QC",
          stage7: "Cualificación y Escalado Industrial",
          strip:
            "Diamante | Carburo de Silicio | Zafiro | Cerámicas Técnicas | Composites Carbono-Metal",
          text: "Esto permite:",
          item1: "Reducción dramática del riesgo de suministro",
          item2: "Optimización del coste total de propiedad",
          item3: "Lock-in por cualificación",
          item4: "Estabilidad lote a lote",
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
          text1: "Los materiales estratégicos no son intercambiables. Son infraestructura tecnológica.",
          text2: "Controlar diamante, SiC, zafiro y cerámicas avanzadas en Europa significa:",
          item1: "Reducir dependencia externa",
          item2: "Asegurar continuidad industrial",
          item3: "Fortalecer soberanía tecnológica",
          closing: "Nanoker construye esa base material.",
        },
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
        email: "info@nanoker.com",
        phone: "+34 985 000 000",
        address: "Polígono de Olloniego, Parcela 22A, Nave 6, 33660 Oviedo, Asturias, Spain",
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
