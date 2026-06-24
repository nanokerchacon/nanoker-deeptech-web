import {
  ENABLE_QUALITY_FORM_EMBED,
  FORM_URL,
  POLICIES,
  getPolicyById,
} from "./policies-data.js";

const SUPPORTED_LANGS = new Set(["es", "en", "fr", "de", "it"]);
const POLICY_LOCALES = {
  es: { og: "es_ES", alternates: ["en_US", "fr_FR", "de_DE", "it_IT"] },
  en: { og: "en_US", alternates: ["es_ES", "fr_FR", "de_DE", "it_IT"] },
  fr: { og: "fr_FR", alternates: ["en_US", "es_ES", "de_DE", "it_IT"] },
  de: { og: "de_DE", alternates: ["en_US", "es_ES", "fr_FR", "it_IT"] },
  it: { og: "it_IT", alternates: ["en_US", "es_ES", "fr_FR", "de_DE"] },
};

const UI_COPY = {
  es: {
    kicker: "POLÍTICAS",
    intro: "Introducción",
    commitments: "Nuestro compromiso",
    scope: "Alcance",
    certifications: "Certificados disponibles",
    certificationCta: "Ver certificado (PDF)",
    accessPolicy: "Accede a la política completa",
    viewDocument: "Ver documento",
    surveyTitle: "NANOKER Customer Satisfaction Survey",
    surveyLead: "Comparte tu experiencia para ayudarnos a mejorar continuamente nuestros procesos y soporte técnico.",
    surveyCta: "Rellenar formulario",
    related: "También te puede interesar",
    close: "Cerrar",
    preview: "Vista previa PDF",
    openTab: "Abrir en pestaña",
    download: "Descargar PDF",
    document: "Documento",
  },
  en: {
    kicker: "POLICIES",
    intro: "Introduction",
    commitments: "Our commitment",
    scope: "Scope",
    certifications: "Available certificates",
    certificationCta: "View certificate (PDF)",
    accessPolicy: "Access the full policy",
    viewDocument: "View document",
    surveyTitle: "NANOKER Customer Satisfaction Survey",
    surveyLead: "Share your experience to help us continuously improve our processes and technical support.",
    surveyCta: "Fill out form",
    related: "You may also be interested in",
    close: "Close",
    preview: "PDF preview",
    openTab: "Open in tab",
    download: "Download PDF",
    document: "Document",
  },
  fr: {
    kicker: "POLITIQUES",
    intro: "Introduction",
    commitments: "Notre engagement",
    scope: "Portée",
    certifications: "Certificats disponibles",
    certificationCta: "Voir le certificat (PDF)",
    accessPolicy: "Accéder à la politique complète",
    viewDocument: "Voir le document",
    surveyTitle: "NANOKER Customer Satisfaction Survey",
    surveyLead: "Partagez votre expérience pour nous aider à améliorer en continu nos processus et notre support technique.",
    surveyCta: "Remplir le formulaire",
    related: "Cela peut aussi vous intéresser",
    close: "Fermer",
    preview: "Aperçu PDF",
    openTab: "Ouvrir dans un onglet",
    download: "Télécharger le PDF",
    document: "Document",
  },
  de: {
    kicker: "RICHTLINIEN",
    intro: "Einführung",
    commitments: "Unser Anspruch",
    scope: "Geltungsbereich",
    certifications: "Verfügbare Zertifikate",
    certificationCta: "Zertifikat ansehen (PDF)",
    accessPolicy: "Vollständige Richtlinie öffnen",
    viewDocument: "Dokument ansehen",
    surveyTitle: "NANOKER Customer Satisfaction Survey",
    surveyLead: "Teilen Sie Ihre Erfahrung, damit wir unsere Prozesse und unseren technischen Support kontinuierlich verbessern können.",
    surveyCta: "Formular ausfüllen",
    related: "Das könnte Sie auch interessieren",
    close: "Schließen",
    preview: "PDF-Vorschau",
    openTab: "In Tab öffnen",
    download: "PDF herunterladen",
    document: "Dokument",
  },
  it: {
    kicker: "POLITICHE",
    intro: "Introduzione",
    commitments: "Il nostro impegno",
    scope: "Ambito",
    certifications: "Certificati disponibili",
    certificationCta: "Visualizza certificato (PDF)",
    accessPolicy: "Accedi alla politica completa",
    viewDocument: "Visualizza documento",
    surveyTitle: "Sondaggio di soddisfazione clienti NANOKER",
    surveyLead: "Condividi la tua esperienza per aiutarci a migliorare continuamente processi e supporto tecnico.",
    surveyCta: "Compila il modulo",
    related: "Potrebbe interessarti anche",
    close: "Chiudi",
    preview: "Anteprima PDF",
    openTab: "Apri in una scheda",
    download: "Scarica PDF",
    document: "Documento",
  },
};

const POLICY_LOCALIZED_COPY = {
  calidad: {
    en: {
      titleShort: "Quality",
      titleFull: "Quality Policy",
      titlePrefix: "Quality",
      titleHighlight: "Policy",
      description: "Quality management framework focused on traceability, continuous improvement and compliance with critical specifications.",
      intro: [
        "Nanoker's Quality Policy establishes an operating framework focused on consistency, continuous improvement, and satisfaction for customers and collaborators.",
        "This approach reinforces a culture of technical rigor and coordination across teams to maintain homogeneous standards at every stage of operations.",
      ],
      commitments: [
        "Define and maintain clear quality criteria for processes, products and services.",
        "Promote continuous improvement through periodic review of practices and results.",
        "Prevent incidents through planning, control and follow-up.",
        "Strengthen team capabilities through training and best-practice sharing.",
        "Maintain transparent communication with customers and interested parties.",
      ],
      scope: "This policy applies across Nanoker's activities, internal processes and professional relationships.",
    },
    fr: {
      titleShort: "Qualité",
      titleFull: "Politique de Qualité",
      titlePrefix: "Politique de",
      titleHighlight: "Qualité",
      description: "Cadre de management de la qualité axé sur la traçabilité, l'amélioration continue et le respect des spécifications critiques.",
      intro: [
        "La Politique de Qualité de Nanoker établit un cadre opérationnel orienté vers la cohérence, l'amélioration continue et la satisfaction des clients et collaborateurs.",
        "Cette approche consolide une culture de rigueur technique et de coordination entre équipes afin de maintenir des standards homogènes à chaque étape de l'activité.",
      ],
      commitments: [
        "Définir et maintenir des critères qualité clairs pour les processus, produits et services.",
        "Promouvoir l'amélioration continue par la révision régulière des pratiques et des résultats.",
        "Prévenir les incidents grâce à la planification, au contrôle et au suivi.",
        "Renforcer les compétences de l'équipe par la formation et les bonnes pratiques.",
        "Maintenir une communication transparente avec les clients et parties prenantes.",
      ],
      scope: "Cette politique s'applique à l'ensemble des activités, processus internes et relations professionnelles de Nanoker.",
    },
    de: {
      titleShort: "Qualität",
      titleFull: "Qualitätspolitik",
      titlePrefix: "Qualitäts",
      titleHighlight: "politik",
      description: "Qualitätsmanagement-Rahmen mit Fokus auf Rückverfolgbarkeit, kontinuierliche Verbesserung und Einhaltung kritischer Spezifikationen.",
      intro: [
        "Die Qualitätspolitik von Nanoker definiert einen operativen Rahmen, der auf Konsistenz, kontinuierliche Verbesserung und Zufriedenheit von Kunden und Partnern ausgerichtet ist.",
        "Dieser Ansatz stärkt eine Kultur technischer Sorgfalt und teamübergreifender Abstimmung, um in jeder Phase der Tätigkeit einheitliche Standards sicherzustellen.",
      ],
      commitments: [
        "Klare Qualitätskriterien für Prozesse, Produkte und Dienstleistungen definieren und aufrechterhalten.",
        "Kontinuierliche Verbesserung durch regelmäßige Überprüfung von Praktiken und Ergebnissen fördern.",
        "Vorfälle durch Planung, Kontrolle und Nachverfolgung vorbeugen.",
        "Kompetenzen des Teams durch Schulung und Best Practices stärken.",
        "Transparente Kommunikation mit Kunden und relevanten Stakeholdern sichern.",
      ],
      scope: "Diese Richtlinie gilt für sämtliche Aktivitäten, internen Prozesse und professionellen Beziehungen von Nanoker.",
    },
    it: {
      titleShort: "Qualità",
      titleFull: "Politica della Qualità",
      titlePrefix: "Politica della",
      titleHighlight: "Qualità",
      description: "Quadro di gestione della qualità focalizzato su tracciabilità, miglioramento continuo e conformità alle specifiche critiche.",
      intro: [
        "La Politica della Qualità di Nanoker definisce un quadro operativo orientato a coerenza, miglioramento continuo e soddisfazione di clienti e collaboratori.",
        "Questo approccio rafforza una cultura di rigore tecnico e coordinamento tra team per mantenere standard omogenei in ogni fase dell'attività.",
      ],
      commitments: [
        "Definire e mantenere criteri di qualità chiari per processi, prodotti e servizi.",
        "Promuovere il miglioramento continuo tramite revisione periodica di pratiche e risultati.",
        "Prevenire incidenti attraverso pianificazione, controllo e monitoraggio.",
        "Rafforzare le competenze del team con formazione e condivisione di buone pratiche.",
        "Mantenere una comunicazione trasparente con clienti e parti interessate.",
      ],
      scope: "Questa politica si applica a tutte le attività, ai processi interni e alle relazioni professionali di Nanoker.",
    },
  },
  sostenibilidad: {
    en: {
      titleShort: "Sustainability",
      titleFull: "Sustainability Policy",
      titlePrefix: "Sustainability",
      titleHighlight: "Policy",
      description: "Environmental commitments, resource efficiency and continuous improvement for a sustainable industrial operation.",
      intro: [
        "Nanoker's Sustainability Policy guides decision-making toward a responsible management model that balances technical performance with efficient use of resources.",
        "Its purpose is to integrate environmental and organizational criteria into day-to-day operations to support sustainable progress over time.",
      ],
      commitments: [
        "Promote responsible management of resources and consumption in daily operations.",
        "Foster continuous improvement practices with a preventive and long-term perspective.",
        "Promote an internal culture aligned with corporate responsibility principles.",
        "Integrate sustainability criteria into process planning, review and monitoring.",
        "Maintain clear communication on sustainability objectives and progress.",
      ],
      scope: "This policy applies to operational and support processes, as well as to Nanoker's relationships with suppliers and collaborators.",
    },
    fr: {
      titleShort: "Durabilité",
      titleFull: "Politique de Durabilité",
      titlePrefix: "Politique de",
      titleHighlight: "Durabilité",
      description: "Engagements environnementaux, efficacité des ressources et amélioration continue pour une activité industrielle durable.",
      intro: [
        "La Politique de Durabilité de Nanoker oriente la prise de décision vers un modèle de gestion responsable, conciliant performance technique et usage efficace des ressources.",
        "Son objectif est d'intégrer des critères environnementaux et organisationnels dans l'activité quotidienne afin de soutenir une évolution durable dans le temps.",
      ],
      commitments: [
        "Promouvoir une gestion responsable des ressources et des consommations dans l'activité quotidienne.",
        "Développer des pratiques d'amélioration continue avec une approche préventive et long terme.",
        "Renforcer une culture interne alignée sur les principes de responsabilité d'entreprise.",
        "Intégrer la durabilité dans la planification, la revue et le suivi des processus.",
        "Maintenir une communication claire sur les objectifs et progrès en matière de durabilité.",
      ],
      scope: "Cette politique s'applique aux processus opérationnels et de support ainsi qu'aux relations de Nanoker avec fournisseurs et collaborateurs.",
    },
    de: {
      titleShort: "Nachhaltigkeit",
      titleFull: "Nachhaltigkeitspolitik",
      titlePrefix: "Nachhaltigkeits",
      titleHighlight: "politik",
      description: "Umweltbezogene Verpflichtungen, Ressourceneffizienz und kontinuierliche Verbesserung für einen nachhaltigen Industriebetrieb.",
      intro: [
        "Die Nachhaltigkeitspolitik von Nanoker richtet Entscheidungen auf ein verantwortungsvolles Managementmodell aus, das technische Leistung und effizienten Ressourceneinsatz in Einklang bringt.",
        "Ihr Ziel ist es, ökologische und organisatorische Kriterien in den täglichen Betrieb zu integrieren und so eine nachhaltige Entwicklung zu sichern.",
      ],
      commitments: [
        "Verantwortungsvolle Steuerung von Ressourcen und Verbräuchen im Tagesgeschäft fördern.",
        "Kontinuierliche Verbesserungspraktiken mit präventivem und langfristigem Blick etablieren.",
        "Eine interne Kultur stärken, die an Grundsätzen unternehmerischer Verantwortung ausgerichtet ist.",
        "Nachhaltigkeitskriterien in Planung, Review und Monitoring von Prozessen integrieren.",
        "Klare Kommunikation über Nachhaltigkeitsziele und Fortschritte gewährleisten.",
      ],
      scope: "Diese Richtlinie gilt für operative und unterstützende Prozesse sowie für die Beziehungen von Nanoker zu Lieferanten und Partnern.",
    },
    it: {
      titleShort: "Sostenibilità",
      titleFull: "Politica di Sostenibilità",
      titlePrefix: "Politica di",
      titleHighlight: "Sostenibilità",
      description: "Impegni ambientali, efficienza delle risorse e miglioramento continuo per un'attività industriale sostenibile.",
      intro: [
        "La Politica di Sostenibilità di Nanoker orienta le decisioni verso un modello di gestione responsabile che bilancia prestazioni tecniche e uso efficiente delle risorse.",
        "Il suo obiettivo è integrare criteri ambientali e organizzativi nell'attività quotidiana per sostenere un progresso duraturo.",
      ],
      commitments: [
        "Promuovere una gestione responsabile di risorse e consumi nelle attività quotidiane.",
        "Favorire pratiche di miglioramento continuo con approccio preventivo e di lungo periodo.",
        "Rafforzare una cultura interna allineata ai principi di responsabilità aziendale.",
        "Integrare criteri di sostenibilità nella pianificazione, revisione e monitoraggio dei processi.",
        "Mantenere una comunicazione chiara su obiettivi e progressi di sostenibilità.",
      ],
      scope: "Questa politica si applica ai processi operativi e di supporto, nonché ai rapporti di Nanoker con fornitori e collaboratori.",
    },
  },
  "seguridad-laboral": {
    en: {
      titleShort: "Occupational Safety",
      titleFull: "Occupational Safety Policy",
      titlePrefix: "Occupational Safety",
      titleHighlight: "Policy",
      description: "Commitment to risk prevention, occupational health and a safety culture across plant and laboratories.",
      intro: [
        "Nanoker's Occupational Health and Safety Policy reinforces the protection of people as an essential principle for a solid and sustainable operation.",
        "The organization promotes a preventive culture based on risk identification, continuous learning and shared responsibility.",
      ],
      commitments: [
        "Promote safe and healthy working environments for everyone.",
        "Integrate prevention into planning and execution of activities.",
        "Encourage active team participation in occupational safety matters.",
        "Drive training and awareness actions on safe practices.",
        "Review preventive measures periodically to improve their effectiveness.",
      ],
      scope: "This policy applies to all activities carried out by Nanoker, including workplaces, operations and collaboration with third parties.",
    },
    fr: {
      titleShort: "Sécurité au travail",
      titleFull: "Politique de Sécurité au travail",
      titlePrefix: "Politique de",
      titleHighlight: "Sécurité au travail",
      description: "Engagement envers la prévention des risques, la santé au travail et une culture sécurité en production et en laboratoire.",
      intro: [
        "La Politique de Santé et Sécurité au travail de Nanoker renforce la protection des personnes comme principe essentiel d'une activité solide et durable.",
        "L'organisation promeut une culture préventive fondée sur l'identification des risques, l'apprentissage continu et la coresponsabilité.",
      ],
      commitments: [
        "Promouvoir des environnements de travail sûrs et sains pour tous.",
        "Intégrer la prévention dans la planification et l'exécution des activités.",
        "Encourager la participation active des équipes sur les sujets de sécurité au travail.",
        "Déployer des actions de formation et de sensibilisation aux pratiques sûres.",
        "Réviser périodiquement les mesures préventives pour renforcer leur efficacité.",
      ],
      scope: "Cette politique s'applique à toutes les activités de Nanoker, y compris les lieux de travail, les opérations et la collaboration avec des tiers.",
    },
    de: {
      titleShort: "Arbeitssicherheit",
      titleFull: "Richtlinie zur Arbeitssicherheit",
      titlePrefix: "Arbeits",
      titleHighlight: "sicherheit",
      description: "Verpflichtung zu Risikoprävention, Gesundheitsschutz und einer Sicherheitskultur in Produktion und Laboren.",
      intro: [
        "Die Richtlinie für Arbeitssicherheit und Gesundheitsschutz von Nanoker stärkt den Schutz von Menschen als wesentliches Prinzip für einen stabilen und nachhaltigen Betrieb.",
        "Das Unternehmen fördert eine Präventionskultur auf Basis von Risikoerkennung, kontinuierlichem Lernen und gemeinsamer Verantwortung.",
      ],
      commitments: [
        "Sichere und gesunde Arbeitsumgebungen für alle fördern.",
        "Prävention in Planung und Ausführung von Aktivitäten integrieren.",
        "Aktive Beteiligung des Teams an Arbeitssicherheitsthemen fördern.",
        "Schulungs- und Sensibilisierungsmaßnahmen zu sicheren Arbeitsweisen vorantreiben.",
        "Präventionsmaßnahmen regelmäßig überprüfen und verbessern.",
      ],
      scope: "Diese Richtlinie gilt für alle von Nanoker durchgeführten Aktivitäten, einschließlich Arbeitsumgebungen, Betriebsabläufen und Zusammenarbeit mit Dritten.",
    },
    it: {
      titleShort: "Sicurezza sul lavoro",
      titleFull: "Politica di Sicurezza sul lavoro",
      titlePrefix: "Politica di",
      titleHighlight: "Sicurezza sul lavoro",
      description: "Impegno per prevenzione dei rischi, salute occupazionale e cultura della sicurezza in stabilimento e laboratori.",
      intro: [
        "La Politica di Salute e Sicurezza sul lavoro di Nanoker rafforza la protezione delle persone come principio essenziale per un'operazione solida e sostenibile.",
        "L'organizzazione promuove una cultura preventiva basata su identificazione dei rischi, apprendimento continuo e responsabilità condivisa.",
      ],
      commitments: [
        "Promuovere ambienti di lavoro sicuri e sani per tutte le persone.",
        "Integrare la prevenzione nella pianificazione e nell'esecuzione delle attività.",
        "Incoraggiare la partecipazione attiva del team sui temi di sicurezza sul lavoro.",
        "Promuovere formazione e sensibilizzazione sulle pratiche sicure.",
        "Rivedere periodicamente le misure preventive per migliorarne l'efficacia.",
      ],
      scope: "Questa politica si applica a tutte le attività svolte da Nanoker, inclusi luoghi di lavoro, operazioni e collaborazione con terzi.",
    },
  },
  "seguridad-informacion": {
    en: {
      titleShort: "Information Security",
      titleFull: "Information Security Policy",
      titlePrefix: "Information Security",
      titleHighlight: "Policy",
      description: "Guidelines to protect technical and corporate information, ensuring confidentiality, integrity and availability.",
      intro: [
        "Nanoker's Information Security Policy sets out guidelines to protect corporate and technical information while supporting operational continuity.",
        "Its objective is to reinforce protection practices and responsible information management across the organization.",
      ],
      commitments: [
        "Protect confidentiality, integrity and availability of information.",
        "Apply security measures aligned with identified risks.",
        "Promote a culture of responsible use of systems and digital assets.",
        "Foster early detection and coordinated response to incidents.",
        "Review and update security controls periodically.",
      ],
      scope: "This policy applies to information and systems used by Nanoker, including internal processing and collaboration with third parties.",
    },
    fr: {
      titleShort: "Sécurité de l'information",
      titleFull: "Politique de Sécurité de l'information",
      titlePrefix: "Politique de",
      titleHighlight: "Sécurité de l'information",
      description: "Lignes directrices pour protéger les informations techniques et corporate en garantissant confidentialité, intégrité et disponibilité.",
      intro: [
        "La Politique de Sécurité de l'information de Nanoker définit des lignes directrices pour protéger les informations corporate et techniques tout en soutenant la continuité d'activité.",
        "Son objectif est de renforcer les pratiques de protection et la gestion responsable de l'information dans toute l'organisation.",
      ],
      commitments: [
        "Protéger la confidentialité, l'intégrité et la disponibilité des informations.",
        "Appliquer des mesures de sécurité alignées sur les risques identifiés.",
        "Promouvoir une culture d'usage responsable des systèmes et actifs numériques.",
        "Favoriser la détection précoce et la réponse coordonnée aux incidents.",
        "Réviser et mettre à jour périodiquement les contrôles de sécurité.",
      ],
      scope: "Cette politique s'applique aux informations et systèmes utilisés par Nanoker, y compris leur traitement interne et la collaboration avec des tiers.",
    },
    de: {
      titleShort: "Informationssicherheit",
      titleFull: "Richtlinie zur Informationssicherheit",
      titlePrefix: "Informations",
      titleHighlight: "sicherheit",
      description: "Leitlinien zum Schutz technischer und unternehmensbezogener Informationen mit Fokus auf Vertraulichkeit, Integrität und Verfügbarkeit.",
      intro: [
        "Die Richtlinie zur Informationssicherheit von Nanoker definiert Vorgaben zum Schutz technischer und unternehmensbezogener Informationen und unterstützt die operative Kontinuität.",
        "Ziel ist es, Schutzmaßnahmen und einen verantwortungsvollen Umgang mit Informationen im gesamten Unternehmen zu stärken.",
      ],
      commitments: [
        "Vertraulichkeit, Integrität und Verfügbarkeit von Informationen schützen.",
        "Sicherheitsmaßnahmen entsprechend identifizierter Risiken anwenden.",
        "Eine Kultur des verantwortungsvollen Umgangs mit Systemen und digitalen Assets fördern.",
        "Früherkennung und koordinierte Reaktion auf Vorfälle stärken.",
        "Sicherheitskontrollen regelmäßig überprüfen und aktualisieren.",
      ],
      scope: "Diese Richtlinie gilt für Informationen und Systeme von Nanoker einschließlich interner Verarbeitung und Zusammenarbeit mit Dritten.",
    },
    it: {
      titleShort: "Sicurezza delle informazioni",
      titleFull: "Politica di Sicurezza delle informazioni",
      titlePrefix: "Politica di",
      titleHighlight: "Sicurezza delle informazioni",
      description: "Linee guida per proteggere informazioni tecniche e aziendali garantendo riservatezza, integrità e disponibilità.",
      intro: [
        "La Politica di Sicurezza delle informazioni di Nanoker definisce linee guida per proteggere informazioni aziendali e tecniche, sostenendo la continuità operativa.",
        "Il suo obiettivo è rafforzare pratiche di protezione e gestione responsabile delle informazioni in tutta l'organizzazione.",
      ],
      commitments: [
        "Proteggere riservatezza, integrità e disponibilità delle informazioni.",
        "Applicare misure di sicurezza allineate ai rischi identificati.",
        "Promuovere una cultura di uso responsabile di sistemi e asset digitali.",
        "Favorire rilevazione precoce e risposta coordinata agli incidenti.",
        "Rivedere e aggiornare periodicamente i controlli di sicurezza.",
      ],
      scope: "Questa politica si applica alle informazioni e ai sistemi utilizzati da Nanoker, inclusi trattamento interno e collaborazione con terzi.",
    },
  },
  "etica-y-cumplimiento": {
    en: {
      titleShort: "Ethics & Compliance",
      titleFull: "Ethics and Compliance Policy",
      titlePrefix: "Ethics and Compliance",
      titleHighlight: "Policy",
      description: "Principles of conduct, integrity and regulatory compliance across commercial, institutional and operational relationships.",
      intro: [
        "Nanoker's Ethics and Compliance Policy defines conduct principles that strengthen integrity in professional relationships and day-to-day management.",
        "The organization promotes a culture based on responsibility, respect and compliance with applicable rules.",
      ],
      commitments: [
        "Act with integrity in every decision and professional relationship.",
        "Promote behaviors aligned with ethical principles and respect.",
        "Support awareness of regulatory obligations in each work area.",
        "Maintain internal communication channels for questions and concerns.",
        "Continuously improve compliance and good-governance practices.",
      ],
      scope: "This policy applies to all people and activities linked to Nanoker, as well as interactions with customers, suppliers and collaborators.",
    },
    fr: {
      titleShort: "Éthique et conformité",
      titleFull: "Politique d'Éthique et de conformité",
      titlePrefix: "Politique d'",
      titleHighlight: "Éthique et conformité",
      description: "Principes de conduite, d'intégrité et de conformité réglementaire dans les relations commerciales, institutionnelles et opérationnelles.",
      intro: [
        "La Politique d'Éthique et de conformité de Nanoker définit des principes de conduite visant à renforcer l'intégrité dans les relations professionnelles et la gestion quotidienne.",
        "L'organisation promeut une culture fondée sur la responsabilité, le respect et le respect des règles applicables.",
      ],
      commitments: [
        "Agir avec intégrité dans toutes les décisions et relations professionnelles.",
        "Promouvoir des comportements alignés sur des principes éthiques et de respect.",
        "Renforcer la connaissance des obligations réglementaires dans chaque domaine de travail.",
        "Maintenir des canaux internes pour poser des questions et signaler des préoccupations.",
        "Améliorer en continu les pratiques de conformité et de bonne gouvernance.",
      ],
      scope: "Cette politique s'applique à toutes les personnes et activités liées à Nanoker ainsi qu'aux interactions avec clients, fournisseurs et collaborateurs.",
    },
    de: {
      titleShort: "Ethik & Compliance",
      titleFull: "Ethik- und Compliance-Richtlinie",
      titlePrefix: "Ethik- und",
      titleHighlight: "Compliance-Richtlinie",
      description: "Grundsätze für Verhalten, Integrität und regulatorische Konformität in geschäftlichen, institutionellen und operativen Beziehungen.",
      intro: [
        "Die Ethik- und Compliance-Richtlinie von Nanoker definiert Verhaltensgrundsätze, die Integrität in professionellen Beziehungen und im Tagesgeschäft stärken.",
        "Das Unternehmen fördert eine Kultur auf Basis von Verantwortung, Respekt und Einhaltung geltender Regeln.",
      ],
      commitments: [
        "In allen Entscheidungen und professionellen Beziehungen integer handeln.",
        "Verhaltensweisen fördern, die an ethischen Prinzipien und Respekt ausgerichtet sind.",
        "Bewusstsein für regulatorische Pflichten in jedem Arbeitsbereich stärken.",
        "Interne Kommunikationskanäle für Fragen und Hinweise aufrechterhalten.",
        "Compliance- und Good-Governance-Praktiken kontinuierlich verbessern.",
      ],
      scope: "Diese Richtlinie gilt für alle mit Nanoker verbundenen Personen und Aktivitäten sowie für die Interaktion mit Kunden, Lieferanten und Partnern.",
    },
    it: {
      titleShort: "Etica e conformità",
      titleFull: "Politica di Etica e conformità",
      titlePrefix: "Politica di",
      titleHighlight: "Etica e conformità",
      description: "Principi di condotta, integrità e conformità normativa nelle relazioni commerciali, istituzionali e operative.",
      intro: [
        "La Politica di Etica e conformità di Nanoker definisce principi di condotta che rafforzano l'integrità nelle relazioni professionali e nella gestione quotidiana.",
        "L'organizzazione promuove una cultura basata su responsabilità, rispetto e conformità alle norme applicabili.",
      ],
      commitments: [
        "Agire con integrità in ogni decisione e relazione professionale.",
        "Promuovere comportamenti allineati a principi etici e di rispetto.",
        "Rafforzare la conoscenza degli obblighi normativi in ogni area di lavoro.",
        "Mantenere canali interni di comunicazione per domande e segnalazioni.",
        "Migliorare continuamente le pratiche di conformità e buona governance.",
      ],
      scope: "Questa politica si applica a tutte le persone e attività collegate a Nanoker, nonché alle interazioni con clienti, fornitori e collaboratori.",
    },
  },
  "igualdad-y-diversidad": {
    en: {
      titleShort: "Equality & Diversity",
      titleFull: "Equality and Diversity Policy",
      titlePrefix: "Equality and Diversity",
      titleHighlight: "Policy",
      description: "Commitment to equal opportunity, non-discrimination and inclusive work environments.",
      intro: [
        "Nanoker's Equality and Diversity Policy promotes an inclusive professional environment based on fairness, respect and non-discrimination.",
        "This commitment supports an organizational culture that values plurality and people's development.",
      ],
      commitments: [
        "Promote equal opportunity in recruitment and development processes.",
        "Foster a respectful, inclusive and discrimination-free work environment.",
        "Advance people-management practices based on objective criteria.",
        "Encourage internal awareness of diversity and inclusion.",
        "Review measures periodically to strengthen equity.",
      ],
      scope: "This policy applies to the entire organization and its professional relationships, especially within people-management processes.",
    },
    fr: {
      titleShort: "Égalité et diversité",
      titleFull: "Politique d'Égalité et diversité",
      titlePrefix: "Politique d'",
      titleHighlight: "Égalité et diversité",
      description: "Engagement en faveur de l'égalité des chances, de la non-discrimination et d'environnements de travail inclusifs.",
      intro: [
        "La Politique d'Égalité et diversité de Nanoker promeut un environnement professionnel inclusif, fondé sur l'équité, le respect et la non-discrimination.",
        "Cet engagement contribue à consolider une culture organisationnelle qui valorise la pluralité et le développement des personnes.",
      ],
      commitments: [
        "Promouvoir l'égalité des chances dans les processus de recrutement et de développement.",
        "Favoriser un environnement de travail respectueux, inclusif et exempt de discrimination.",
        "Déployer des pratiques RH fondées sur des critères objectifs.",
        "Encourager la sensibilisation interne à la diversité et à l'inclusion.",
        "Réviser périodiquement les mesures destinées à renforcer l'équité.",
      ],
      scope: "Cette politique s'applique à l'ensemble de l'organisation et à ses relations professionnelles, notamment dans les processus de gestion des personnes.",
    },
    de: {
      titleShort: "Gleichstellung & Vielfalt",
      titleFull: "Richtlinie zu Gleichstellung und Vielfalt",
      titlePrefix: "Gleichstellung und",
      titleHighlight: "Vielfalt",
      description: "Verpflichtung zu Chancengleichheit, Nichtdiskriminierung und inklusiven Arbeitsumgebungen.",
      intro: [
        "Die Richtlinie zu Gleichstellung und Vielfalt von Nanoker fördert ein inklusives berufliches Umfeld auf Basis von Fairness, Respekt und Nichtdiskriminierung.",
        "Dieses Engagement unterstützt eine Unternehmenskultur, die Vielfalt und die Entwicklung von Menschen wertschätzt.",
      ],
      commitments: [
        "Chancengleichheit in Rekrutierungs- und Entwicklungsprozessen fördern.",
        "Ein respektvolles, inklusives und diskriminierungsfreies Arbeitsumfeld stärken.",
        "HR-Praktiken auf Basis objektiver Kriterien weiterentwickeln.",
        "Internes Bewusstsein für Vielfalt und Inklusion fördern.",
        "Maßnahmen regelmäßig überprüfen, um Fairness weiter zu stärken.",
      ],
      scope: "Diese Richtlinie gilt für die gesamte Organisation und ihre professionellen Beziehungen, insbesondere in Personalprozessen.",
    },
    it: {
      titleShort: "Uguaglianza e diversità",
      titleFull: "Politica di Uguaglianza e diversità",
      titlePrefix: "Politica di",
      titleHighlight: "Uguaglianza e diversità",
      description: "Impegno per pari opportunità, non discriminazione e ambienti di lavoro inclusivi.",
      intro: [
        "La Politica di Uguaglianza e diversità di Nanoker promuove un ambiente professionale inclusivo basato su equità, rispetto e non discriminazione.",
        "Questo impegno sostiene una cultura organizzativa che valorizza pluralità e sviluppo delle persone.",
      ],
      commitments: [
        "Promuovere pari opportunità nei processi di selezione e sviluppo.",
        "Rafforzare un ambiente di lavoro rispettoso, inclusivo e libero da discriminazioni.",
        "Sviluppare pratiche di gestione delle persone basate su criteri oggettivi.",
        "Favorire la consapevolezza interna su diversità e inclusione.",
        "Rivedere periodicamente le misure destinate a rafforzare l'equità.",
      ],
      scope: "Questa politica si applica all'intera organizzazione e alle sue relazioni professionali, in particolare nei processi di gestione delle persone.",
    },
  },
  certificaciones: {
    en: {
      titleShort: "Certifications",
      titleFull: "Certifications",
      description: "Certified reference documentation for management systems and regulatory authorizations.",
      intro: [
        "This section centralizes key certificates and resolutions for technical, commercial and regulatory review.",
        "All linked documents correspond to Nanoker's current official files.",
      ],
      files: [
        { label: "ISO 9001", description: "Management system focused on continuous improvement, process consistency and customer focus." },
        { label: "ISO 13485", description: "Reference framework for quality management in regulated medical environments." },
        { label: "Medical device manufacturer license", description: "Official document linked to manufacturing activity in the medical-device field." },
        { label: "InPerio CE marking (0222 MDR 2025)", description: "Documentation associated with InPerio CE marking within the applicable regulatory framework." },
      ],
    },
    fr: {
      titleShort: "Certifications",
      titleFull: "Certifications",
      description: "Documentation certifiée de référence pour les systèmes de management et les autorisations réglementaires.",
      intro: [
        "Cette section centralise les certificats et résolutions clés pour l'évaluation technique, commerciale et réglementaire.",
        "Tous les documents liés correspondent aux fichiers officiels en vigueur de Nanoker.",
      ],
      files: [
        { label: "ISO 9001", description: "Système de management orienté vers l'amélioration continue, la cohérence des processus et l'approche client." },
        { label: "ISO 13485", description: "Cadre de référence pour le management de la qualité dans les environnements médicaux réglementés." },
        { label: "Licence de fabricant de dispositif médical", description: "Document officiel lié à l'activité de fabrication dans le domaine des dispositifs médicaux." },
        { label: "Marquage CE InPerio (0222 MDR 2025)", description: "Documentation associée au marquage CE du système InPerio dans le cadre réglementaire applicable." },
      ],
    },
    de: {
      titleShort: "Zertifizierungen",
      titleFull: "Zertifizierungen",
      description: "Zertifizierte Referenzdokumentation für Managementsysteme und regulatorische Zulassungen.",
      intro: [
        "In diesem Bereich werden wichtige Zertifikate und Bescheide für technische, kommerzielle und regulatorische Bewertungen gebündelt.",
        "Alle verlinkten Dokumente entsprechen den aktuell gültigen offiziellen Unterlagen von Nanoker.",
      ],
      files: [
        { label: "ISO 9001", description: "Managementsystem mit Fokus auf kontinuierliche Verbesserung, Prozesskonsistenz und Kundenorientierung." },
        { label: "ISO 13485", description: "Referenzrahmen für Qualitätsmanagement in regulierten medizinischen Umgebungen." },
        { label: "Herstellerlizenz für Medizinprodukte", description: "Offizielles Dokument zur Fertigungstätigkeit im Bereich Medizinprodukte." },
        { label: "CE-Kennzeichnung InPerio (0222 MDR 2025)", description: "Dokumentation zur CE-Kennzeichnung des InPerio-Systems im geltenden regulatorischen Rahmen." },
      ],
    },
    it: {
      titleShort: "Certificazioni",
      titleFull: "Certificazioni",
      description: "Documentazione certificata di riferimento per sistemi di gestione e autorizzazioni regolatorie.",
      intro: [
        "Questa sezione centralizza certificati e risoluzioni chiave per revisione tecnica, commerciale e regolatoria.",
        "Tutti i documenti collegati corrispondono ai file ufficiali vigenti di Nanoker.",
      ],
      files: [
        { label: "ISO 9001", description: "Sistema di gestione orientato a miglioramento continuo, coerenza dei processi e attenzione al cliente." },
        { label: "ISO 13485", description: "Quadro di riferimento per la gestione della qualità in ambienti medicali regolati." },
        { label: "Licenza di fabbricante di dispositivi medici", description: "Documento ufficiale collegato all'attività produttiva nel settore dei dispositivi medici." },
        { label: "Marcatura CE InPerio (0222 MDR 2025)", description: "Documentazione associata alla marcatura CE del sistema InPerio nel quadro regolatorio applicabile." },
      ],
    },
  },
};

function normalizeLang(raw) {
  const base = String(raw || "").toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.has(base) ? base : "en";
}

function getPolicyLanguage() {
  return normalizeLang(document.documentElement.getAttribute("data-lang") || document.documentElement.lang || "en");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function localizePolicy(policy, lang) {
  if (lang === "es") return policy;
  const localized = POLICY_LOCALIZED_COPY[policy.id]?.[lang];
  if (!localized) return policy;

  const merged = { ...policy, ...localized };
  if (Array.isArray(localized.intro)) merged.intro = localized.intro;
  if (Array.isArray(localized.commitments)) merged.commitments = localized.commitments;
  if (Array.isArray(localized.files)) {
    merged.files = (policy.files || []).map((file, index) => ({ ...file, ...(localized.files[index] || {}) }));
  }
  return merged;
}

function relatedPolicies(currentPolicy) {
  if (currentPolicy.category === "policy") {
    return POLICIES.filter((item) => item.category === "policy" && item.id !== currentPolicy.id);
  }
  return POLICIES.filter((item) => item.category === "policy");
}

function createMetaDescription(policy) {
  return policy.description || `Information about ${policy.titleFull} at Nanoker.`;
}

function policyTitle(policy) {
  return `${policy.titleFull} | Nanoker`;
}

function policyCanonical(policy) {
  return `https://nanoker.com/politicas/${policy.slug}/`;
}

function policyLocalizedUrl(policy, lang) {
  const url = new URL(policyCanonical(policy));
  url.searchParams.set("lang", lang);
  return url.toString();
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

function renderIntro(introParagraphs) {
  return introParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
}
function renderPolicyHeading(policy) {
  if (policy.category === "policy" && policy.titlePrefix && policy.titleHighlight) {
    const colorStyle = policy.titleHighlightColor ? ` style="color: ${escapeHtml(policy.titleHighlightColor)};"` : "";
    return `${escapeHtml(policy.titlePrefix)} <span class="policy-highlight"${colorStyle}>${escapeHtml(policy.titleHighlight)}</span>`;
  }
  return escapeHtml(policy.titleFull);
}

function renderDownloadSection(policy, strings) {
  if (policy.category === "certifications") {
    const links = (policy.files || [])
      .map(
        (file) => `<li>
            <div class="policy-download-copy">
              <strong>${escapeHtml(file.label)}</strong>
              <p>${escapeHtml(file.description || "")}</p>
            </div>
            <a class="footer-action" href="${file.path}" target="_blank" rel="noopener noreferrer">${escapeHtml(strings.certificationCta)}</a>
          </li>`
      )
      .join("\n");

    return `
      <section class="policy-card" aria-labelledby="descargas-certificaciones">
        <h2 id="descargas-certificaciones">${escapeHtml(strings.certifications)}</h2>
        <ul class="policy-download-list">
          ${links}
        </ul>
      </section>
    `;
  }

  return `
    <section class="policy-card" aria-labelledby="descargar-pdf">
      <h2 id="descargar-pdf">${escapeHtml(strings.accessPolicy)}</h2>
      <a
        class="footer-action"
        href="#"
        data-policy-preview="${policy.pdfPath}"
        data-policy-title="${escapeHtml(policy.titleFull)}"
      >
        ${escapeHtml(strings.viewDocument)}
      </a>
    </section>
  `;
}

function renderCommitments(policy, strings) {
  if (policy.category !== "policy" || !Array.isArray(policy.commitments)) return "";
  const items = policy.commitments.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  return `
    <section class="policy-card" aria-labelledby="nuestro-compromiso">
      <h2 id="nuestro-compromiso">${escapeHtml(strings.commitments)}</h2>
      <ul class="policy-commitments">
        ${items}
      </ul>
    </section>
  `;
}

function renderScope(policy, strings) {
  if (policy.category !== "policy" || !policy.scope) return "";
  return `
    <section class="policy-card" aria-labelledby="alcance-politica">
      <h2 id="alcance-politica">${escapeHtml(strings.scope)}</h2>
      <p class="policy-scope">${escapeHtml(policy.scope)}</p>
    </section>
  `;
}

function renderQualityForm(policy, strings) {
  if (policy.id !== "calidad") return "";

  const embedMarkup = ENABLE_QUALITY_FORM_EMBED
    ? `
      <iframe
        src="${FORM_URL}"
        title="${escapeHtml(strings.surveyTitle)}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        style="width: 100%; min-height: 640px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px;"
      ></iframe>
    `
    : `
      <!--
      Optional embed (toggle with ENABLE_QUALITY_FORM_EMBED=true):
      <iframe
        src="${FORM_URL}"
        title="${escapeHtml(strings.surveyTitle)}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        style="width: 100%; min-height: 640px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px;"
      ></iframe>
      -->
    `;

  return `
    <section class="policy-card" aria-labelledby="customer-survey">
      <h2 id="customer-survey">${escapeHtml(strings.surveyTitle)}</h2>
      <p>${escapeHtml(strings.surveyLead)}</p>
      <a class="footer-action" href="${FORM_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(strings.surveyCta)}</a>
      ${embedMarkup}
    </section>
  `;
}

function renderRelated(policy, strings, lang) {
  const cards = relatedPolicies(policy)
    .map((item) => {
      const localized = localizePolicy(item, lang);
      return `
        <li>
          <a href="../${item.slug}/">
            <strong>${escapeHtml(localized.titleShort)}</strong>
            <span>${escapeHtml(localized.titleFull)}</span>
          </a>
        </li>
      `;
    })
    .join("\n");

  return `
    <section class="policy-card" aria-labelledby="tambien-interesa">
      <h2 id="tambien-interesa">${escapeHtml(strings.related)}</h2>
      <ul class="policy-related-list">
        ${cards}
      </ul>
    </section>
  `;
}

function renderPolicyModal(strings) {
  return `
    <div class="policy-modal" id="policyModal" aria-hidden="true">
      <div class="policy-modal-backdrop" data-policy-close></div>
      <div class="policy-modal-panel" role="dialog" aria-modal="true" aria-labelledby="policyModalTitle" tabindex="-1">
        <div class="policy-modal-header">
          <h3 id="policyModalTitle"></h3>
          <button type="button" class="policy-modal-close" data-policy-close aria-label="${escapeHtml(strings.close)}">✕</button>
        </div>
        <div class="policy-modal-body">
          <iframe id="policyModalFrame" title="${escapeHtml(strings.preview)}" loading="lazy"></iframe>
        </div>
        <div class="policy-modal-footer">
          <a id="policyModalOpen" class="policy-modal-open" href="#" target="_blank" rel="noopener noreferrer">${escapeHtml(strings.openTab)}</a>
          <a id="policyModalDownload" class="policy-modal-download" href="#" target="_blank" rel="noopener noreferrer">${escapeHtml(strings.download)}</a>
        </div>
      </div>
    </div>
  `;
}

function renderPolicyMarkup(policy, strings, lang) {
  return `
    <main class="policy-main" id="top">
      <header class="policy-hero">
        <p class="policy-kicker">${escapeHtml(strings.kicker)}</p>
        <h1>${renderPolicyHeading(policy)}</h1>
        <p class="policy-lead">${escapeHtml(policy.description)}</p>
      </header>

      <section class="policy-content" aria-labelledby="introduccion-politica">
        <article class="policy-card">
          <h2 id="introduccion-politica">${escapeHtml(strings.intro)}</h2>
          <div class="policy-intro">
            ${renderIntro(policy.intro || [])}
          </div>
        </article>

        ${renderCommitments(policy, strings)}
        ${renderScope(policy, strings)}
        ${renderDownloadSection(policy, strings)}
        ${renderQualityForm(policy, strings)}
        ${renderRelated(policy, strings, lang)}
      </section>
    </main>
    ${renderPolicyModal(strings)}
  `;
}
function initPolicyPreviewModal(root, strings) {
  const modal = root.querySelector("#policyModal");
  if (!modal || modal.dataset.initialized === "true") return;

  const panel = modal.querySelector(".policy-modal-panel");
  const title = modal.querySelector("#policyModalTitle");
  const frame = modal.querySelector("#policyModalFrame");
  const openLink = modal.querySelector("#policyModalOpen");
  const downloadLink = modal.querySelector("#policyModalDownload");
  const closeTargets = modal.querySelectorAll("[data-policy-close]");
  let lastTrigger = null;

  function getFocusableElements() {
    return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(
      (element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden")
    );
  }

  function handleTabTrap(event) {
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onModalKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    handleTabTrap(event);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onModalKeydown);
    frame.setAttribute("src", "about:blank");
    lastTrigger?.focus?.();
  }

  function openModal({ pdf, policyTitle }, trigger) {
    lastTrigger = trigger;
    title.textContent = policyTitle;
    frame.setAttribute("src", pdf);
    openLink.setAttribute("href", pdf);
    downloadLink.setAttribute("href", pdf);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onModalKeydown);
    panel.focus();
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-policy-preview]");
    if (!trigger || !root.contains(trigger)) return;

    event.preventDefault();
    const pdf = trigger.getAttribute("data-policy-preview");
    const policyTitle = trigger.getAttribute("data-policy-title") || strings.document;
    if (!pdf) return;
    openModal({ pdf, policyTitle }, trigger);
  });

  closeTargets.forEach((element) => {
    element.addEventListener("click", () => closeModal());
  });

  modal.dataset.initialized = "true";
}

function setSeo(policy, lang) {
  const title = policyTitle(policy);
  const description = createMetaDescription(policy);
  const canonicalUrl = policyCanonical(policy);
  const localizedUrl = policyLocalizedUrl(policy, lang);
  const locales = POLICY_LOCALES[lang] || POLICY_LOCALES.en;

  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  document.title = title;

  const titleTag = ensureHeadNode("title", "title");
  titleTag.textContent = title;

  [
    ensureHeadNode('meta[name="description"]', "meta", { name: "description" }),
    ensureHeadNode('meta[property="og:description"]', "meta", { property: "og:description" }),
    ensureHeadNode('meta[name="twitter:description"]', "meta", { name: "twitter:description" }),
  ].forEach((node) => setNodeContent(node, description));

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
    "https://nanoker.com/img/og/og-default.png"
  );

  ensureHeadNode('link[rel="canonical"]', "link", { rel: "canonical" }).setAttribute(
    "href",
    canonicalUrl
  );
  ["es", "en", "fr", "de", "it"].forEach((supportedLang) => {
    ensureHeadNode(`link[rel="alternate"][hreflang="${supportedLang}"]`, "link", {
      rel: "alternate",
      hreflang: supportedLang,
    }).setAttribute("href", policyLocalizedUrl(policy, supportedLang));
  });
  ensureHeadNode('link[rel="alternate"][hreflang="x-default"]', "link", {
    rel: "alternate",
    hreflang: "x-default",
  }).setAttribute("href", canonicalUrl);
}

export function initPolicyPage(policyId) {
  const basePolicy = getPolicyById(policyId);
  const mount = document.querySelector("[data-policy-page]");
  if (!basePolicy || !mount) return;

  const render = () => {
    const lang = getPolicyLanguage();
    const strings = UI_COPY[lang] || UI_COPY.en;
    const policy = localizePolicy(basePolicy, lang);
    setSeo(policy, lang);
    mount.innerHTML = renderPolicyMarkup(policy, strings, lang);
    initPolicyPreviewModal(mount, strings);
  };

  render();

  if (mount.dataset.policyLangBound !== "1") {
    mount.dataset.policyLangBound = "1";
    window.addEventListener("lang:change", () => {
      render();
    });
  }
}
