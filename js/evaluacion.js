(function () {
  const API_BASE_URL = "https://nanoker-deeptech-web.vercel.app";
  const STORAGE_KEY = "nanoker_eval_wizard_v1";
  const TOTAL_STEPS = 11;
  const SUPPORTED_LANGS = new Set(["es", "en", "fr", "de"]);
  const MAX_TOTAL_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "dwg", "step", "stp", "png", "jpg", "jpeg"]);
  const REQUEST_TIMEOUT_MS = 25000;

  const COPY = {
    es: {
      tablist: "Pasos de evaluación",
      stepLabel: "PASO {n}",
      progress: "PASO {current} DE {total}",
      next: "Continuar",
      back: "Atrás",
      submit: "Enviar evaluación técnica",
      sending: "Enviando...",
      fileMeta: {
        idle: "Formatos permitidos: PDF, DWG, STEP, PNG, JPG. Tamaño total recomendado: hasta 5 MB.",
        selected: "{count} archivo(s) seleccionado(s) · {size}. Formatos permitidos: PDF, DWG, STEP, PNG, JPG.",
      },
      status: {
        idle: "",
        required: "Completa los campos obligatorios para continuar.",
        completePrevious: "Completa los pasos previos antes de enviar.",
        otherRequired: "Si seleccionas 'Otro', especifica el detalle.",
        descriptionShort: "La descripción del proyecto debe tener al menos 20 caracteres.",
        invalidEmail: "Introduce un email válido para poder responder a la solicitud.",
        fileType: "Revisa los adjuntos. Solo se admiten archivos PDF, DWG, STEP, PNG y JPG.",
        fileSize: "El tamaño total de los adjuntos no puede superar 5 MB.",
        sending: "Enviando...",
        success: "Solicitud técnica enviada correctamente. Hemos recibido tu información y el equipo de Nanoker revisará tu caso.",
        error: 'No hemos podido enviar la solicitud técnica en este momento. Por favor, inténtalo de nuevo o escribe a <a href="mailto:web@nanoker.com">web@nanoker.com</a>.',
      },
      fields: { specify: "Especifica" },
      steps: {
        1: { title: "Tipo de solicitud", help: "¿Qué tipo de ayuda necesita?", options: { "request-manufacturing": "Fabricación de una pieza en material cerámico o cristalino avanzado (incluye evaluación de viabilidad)", "request-selection": "Selección del material adecuado para una aplicación", "request-rd": "Desarrollo tecnológico o proyecto de I+D", "request-general": "Solicitud de presupuesto o consulta general" } },
        2: { title: "Situación actual", help: "¿Qué información tiene actualmente sobre la pieza o aplicación?", options: { "current-drawings": "Plano/s técnico/s", "current-cad": "Modelo 3D (CAD)", "current-existing-part": "Una pieza existente", "current-functional": "Requisitos funcionales definidos", "current-idea": "Solo una idea inicial" } },
        3: { title: "Fase del proyecto", help: "¿En qué fase se encuentra el proyecto?", options: { "phase-concept": "Concepto / estudio inicial", "phase-design": "Desarrollo o diseño", "phase-prototype": "Prototipo", "phase-series": "Producción en serie", "phase-improvement": "Producto existente que necesita mejora" } },
        4: { title: "Cantidad estimada", help: "¿Qué volumen aproximado necesitaría?", options: { "qty-prototype": "Prototipo (1-10 unidades)", "qty-small": "Serie pequeña (10-100)", "qty-medium": "Serie media (100-1000)", "qty-industrial": "Producción industrial (+1000)", "qty-undefined": "Aún no definido" } },
        5: { title: "Dimensiones aproximadas", help: "¿Cuáles son las dimensiones aproximadas de la pieza?", options: { "dim-lt10": "< 10 mm", "dim-10-50": "10 - 50 mm", "dim-50-200": "50 - 200 mm", "dim-200-500": "200 - 500 mm", "dim-gt500": "> 500 mm", "dim-undefined": "No definido todavía" }, exactLabel: "Dimensiones exactas (mm)", exactPlaceholder: "Ej.: 30x20x5" },
        6: { title: "Aplicación o entorno tecnológico", help: "¿En qué tipo de aplicación se utilizará la pieza?", options: { "app-semiconductors": "Semiconductores / microelectrónica (Fab, epitaxia, wafers)", "app-optics": "Óptica / fotónica", "app-energy": "Energía", "app-electronics": "Electrónica", "app-industry": "Industria / maquinaria", "app-space": "Aeroespacial / espacio", "app-medical": "Medicina / biotecnología", "app-research": "Investigación científica", "app-vacuum": "Vacío", "app-chemical": "Ambiente químico o corrosivo", "app-wear": "Alto desgaste o abrasión", "app-other": "Otro" } },
        7: { title: "Sector industrial", help: "¿En qué sector se enmarca principalmente el proyecto?", options: { "sector-semiconductors": "Semiconductores", "sector-space": "Aeroespacial / espacio", "sector-energy": "Energía", "sector-industrial": "Industrial / maquinaria", "sector-electronics": "Electrónica", "sector-medical": "Medicina / biotech", "sector-research": "Investigación / laboratorio", "sector-other": "Otro" } },
        8: { title: "Temperatura de operación", help: "¿En qué rango de temperatura operará aproximadamente la pieza?", options: { "temp-cryo": "< -100 °C (criogenia / espacio)", "temp-minus100-0": "-100 - 0 °C", "temp-0-200": "0 - 200 °C", "temp-200-800": "200 - 800 °C", "temp-gt800": "> 800 °C", "temp-unknown": "No lo sé todavía" } },
        9: { title: "Función principal de la pieza", help: "¿Qué función debe cumplir principalmente la pieza? (puede seleccionar varias)", options: { "func-wear": "Resistencia al desgaste o abrasión", "func-hardness": "Alta dureza", "func-insulation": "Aislamiento eléctrico", "func-high-temp": "Resistencia a altas temperaturas", "func-chemical": "Resistencia química o a la corrosión", "func-mechanical": "Alta resistencia mecánica o estructural", "func-tribology": "Baja fricción o propiedades tribológicas", "func-thermal": "Gestión térmica / alta conductividad térmica", "func-stability": "Estabilidad dimensional o precisión", "func-biocompatibility": "Biocompatibilidad", "func-optical": "Aplicación óptica", "func-other": "Otra" } },
        10: { title: "Material considerado", help: "¿Qué material está considerando para su aplicación?", options: { "mat-sapphire": "Zafiro (EPI / SOS / soluciones ópticas)", "mat-sic": "Carburo de silicio (SiC) - wafers o componentes para Fab", "mat-cvd-diamond": "Diamante CVD - cuántica, óptica o gestión térmica", "mat-alumina": "Alúmina (Al2O3)", "mat-zirconia": "Circona estabilizada (ZrO2 / Y-TZP)", "mat-b4c": "Carburo de boro (B4C)", "mat-aln": "Nitruro de aluminio (AlN)", "mat-nanocomposites": "Nanocompuestos cerámicos", "mat-other": "Otro material cerámico avanzado", "mat-unsure": "No estoy seguro / necesito asesoramiento" } },
        11: { title: "Contacto y descripción", help: "Comparte tus datos y una descripción breve para iniciar la evaluación técnica.", labels: { "eval-name": "Nombre *", "eval-company": "Empresa / organización *", "eval-role": "Cargo", "eval-email": "Email *", "eval-phone": "Teléfono", "eval-country": "País *", "eval-project-description": "Descripción breve del proyecto *", "eval-files": "Subir archivos (opcional, múltiples): PDF, DWG, STEP, PNG, JPG" }, projectPlaceholder: "Describe la aplicación, el entorno de operación y los requisitos principales." },
      },
    },
    en: {
      tablist: "Evaluation steps",
      stepLabel: "STEP {n}",
      progress: "STEP {current} OF {total}",
      next: "Continue",
      back: "Back",
      submit: "Submit technical evaluation",
      sending: "Sending...",
      fileMeta: {
        idle: "Allowed formats: PDF, DWG, STEP, PNG, JPG. Recommended total size: up to 5 MB.",
        selected: "{count} file(s) selected · {size}. Allowed formats: PDF, DWG, STEP, PNG, JPG.",
      },
      status: {
        idle: "",
        required: "Complete the required fields to continue.",
        completePrevious: "Complete the previous steps before submitting.",
        otherRequired: "If you select 'Other', please specify the detail.",
        descriptionShort: "The project description must contain at least 20 characters.",
        invalidEmail: "Enter a valid email so we can respond to your request.",
        fileType: "Please review the attachments. Only PDF, DWG, STEP, PNG, and JPG files are allowed.",
        fileSize: "The total attachment size cannot exceed 5 MB.",
        sending: "Sending...",
        success: "Technical request sent successfully. We have received your information and the Nanoker team will review your case.",
        error: 'We could not send your technical request right now. Please try again or email <a href="mailto:web@nanoker.com">web@nanoker.com</a>.',
      },
      fields: { specify: "Specify" },
      steps: {
        1: { title: "Request type", help: "What kind of support do you need?", options: { "request-manufacturing": "Manufacturing of a part in advanced ceramic or crystalline material (includes feasibility assessment)", "request-selection": "Selection of the right material for an application", "request-rd": "Technology development or R&D project", "request-general": "Quotation request or general inquiry" } },
        2: { title: "Current situation", help: "What information do you currently have about the part or application?", options: { "current-drawings": "Technical drawing(s)", "current-cad": "3D model (CAD)", "current-existing-part": "An existing part", "current-functional": "Defined functional requirements", "current-idea": "Just an initial idea" } },
        3: { title: "Project phase", help: "What phase is the project currently in?", options: { "phase-concept": "Concept / initial study", "phase-design": "Development or design", "phase-prototype": "Prototype", "phase-series": "Serial production", "phase-improvement": "Existing product requiring improvement" } },
        4: { title: "Estimated quantity", help: "What approximate volume would you need?", options: { "qty-prototype": "Prototype (1-10 units)", "qty-small": "Small batch (10-100)", "qty-medium": "Mid-size batch (100-1000)", "qty-industrial": "Industrial production (+1000)", "qty-undefined": "Not yet defined" } },
        5: { title: "Approximate dimensions", help: "What are the approximate dimensions of the part?", options: { "dim-lt10": "< 10 mm", "dim-10-50": "10 - 50 mm", "dim-50-200": "50 - 200 mm", "dim-200-500": "200 - 500 mm", "dim-gt500": "> 500 mm", "dim-undefined": "Not defined yet" }, exactLabel: "Exact dimensions (mm)", exactPlaceholder: "Ex.: 30x20x5" },
        6: { title: "Application or technology environment", help: "In what type of application will the part be used?", options: { "app-semiconductors": "Semiconductors / microelectronics (Fab, epitaxy, wafers)", "app-optics": "Optics / photonics", "app-energy": "Energy", "app-electronics": "Electronics", "app-industry": "Industry / machinery", "app-space": "Aerospace / space", "app-medical": "Medical / biotechnology", "app-research": "Scientific research", "app-vacuum": "Vacuum", "app-chemical": "Chemical or corrosive environment", "app-wear": "High wear or abrasion", "app-other": "Other" } },
        7: { title: "Industrial sector", help: "Which sector best describes the project?", options: { "sector-semiconductors": "Semiconductors", "sector-space": "Aerospace / space", "sector-energy": "Energy", "sector-industrial": "Industrial / machinery", "sector-electronics": "Electronics", "sector-medical": "Medical / biotech", "sector-research": "Research / laboratory", "sector-other": "Other" } },
        8: { title: "Operating temperature", help: "Within what temperature range will the part operate approximately?", options: { "temp-cryo": "< -100 °C (cryogenics / space)", "temp-minus100-0": "-100 - 0 °C", "temp-0-200": "0 - 200 °C", "temp-200-800": "200 - 800 °C", "temp-gt800": "> 800 °C", "temp-unknown": "I do not know yet" } },
        9: { title: "Main function of the part", help: "What main function must the part fulfill? (you may select several)", options: { "func-wear": "Wear or abrasion resistance", "func-hardness": "High hardness", "func-insulation": "Electrical insulation", "func-high-temp": "High-temperature resistance", "func-chemical": "Chemical or corrosion resistance", "func-mechanical": "High mechanical or structural strength", "func-tribology": "Low friction or tribological properties", "func-thermal": "Thermal management / high thermal conductivity", "func-stability": "Dimensional stability or precision", "func-biocompatibility": "Biocompatibility", "func-optical": "Optical application", "func-other": "Other" } },
        10: { title: "Material under consideration", help: "Which material are you considering for your application?", options: { "mat-sapphire": "Sapphire (EPI / SOS / optical solutions)", "mat-sic": "Silicon carbide (SiC) - wafers or Fab components", "mat-cvd-diamond": "CVD diamond - quantum, optics or thermal management", "mat-alumina": "Alumina (Al2O3)", "mat-zirconia": "Stabilized zirconia (ZrO2 / Y-TZP)", "mat-b4c": "Boron carbide (B4C)", "mat-aln": "Aluminum nitride (AlN)", "mat-nanocomposites": "Ceramic nanocomposites", "mat-other": "Other advanced ceramic material", "mat-unsure": "I am not sure / I need guidance" } },
        11: { title: "Contact and description", help: "Share your details and a brief description to start the technical assessment.", labels: { "eval-name": "Name *", "eval-company": "Company / organization *", "eval-role": "Role", "eval-email": "Email *", "eval-phone": "Phone", "eval-country": "Country *", "eval-project-description": "Brief project description *", "eval-files": "Upload files (optional, multiple): PDF, DWG, STEP, PNG, JPG" }, projectPlaceholder: "Describe the application, operating environment, and main requirements." },
      },
    },
    fr: {
      tablist: "Étapes de l'évaluation",
      stepLabel: "ÉTAPE {n}",
      progress: "ÉTAPE {current} SUR {total}",
      next: "Continuer",
      back: "Retour",
      submit: "Envoyer l'évaluation technique",
      sending: "Envoi...",
      fileMeta: {
        idle: "Formats autorisés : PDF, DWG, STEP, PNG, JPG. Taille totale recommandée : jusqu'à 5 Mo.",
        selected: "{count} fichier(s) sélectionné(s) · {size}. Formats autorisés : PDF, DWG, STEP, PNG, JPG.",
      },
      status: {
        idle: "",
        required: "Complétez les champs obligatoires pour continuer.",
        completePrevious: "Complétez les étapes précédentes avant l'envoi.",
        otherRequired: "Si vous choisissez « Autre », précisez le détail.",
        descriptionShort: "La description du projet doit contenir au moins 20 caractères.",
        invalidEmail: "Saisissez une adresse e-mail valide afin que nous puissions vous répondre.",
        fileType: "Vérifiez les pièces jointes. Seuls les fichiers PDF, DWG, STEP, PNG et JPG sont acceptés.",
        fileSize: "La taille totale recommandée des pièces jointes est de 5 Mo maximum.",
        sending: "Envoi de la demande d'évaluation technique...",
        success: "Demande envoyée. L'équipe Nanoker examinera l'évaluation et répondra par e-mail.",
        error: "Nous n'avons pas pu traiter votre demande pour le moment. Veuillez réessayer dans quelques minutes.",
      },
      fields: { specify: "Préciser" },
      steps: {
        1: { title: "Type de demande", help: "De quel type d'aide avez-vous besoin ?", options: { "request-manufacturing": "Fabrication d'une pièce en matériau céramique ou cristallin avancé (inclut l'évaluation de faisabilité)", "request-selection": "Sélection du matériau adapté à une application", "request-rd": "Développement technologique ou projet de R&D", "request-general": "Demande de devis ou consultation générale" } },
        2: { title: "Situation actuelle", help: "Quelles informations avez-vous actuellement sur la pièce ou l'application ?", options: { "current-drawings": "Plan(s) technique(s)", "current-cad": "Modèle 3D (CAO)", "current-existing-part": "Une pièce existante", "current-functional": "Exigences fonctionnelles définies", "current-idea": "Seulement une idée initiale" } },
        3: { title: "Phase du projet", help: "À quelle phase se trouve actuellement le projet ?", options: { "phase-concept": "Concept / étude initiale", "phase-design": "Développement ou conception", "phase-prototype": "Prototype", "phase-series": "Production en série", "phase-improvement": "Produit existant nécessitant une amélioration" } },
        4: { title: "Quantité estimée", help: "Quel volume approximatif vous faudrait-il ?", options: { "qty-prototype": "Prototype (1-10 unités)", "qty-small": "Petite série (10-100)", "qty-medium": "Série moyenne (100-1000)", "qty-industrial": "Production industrielle (+1000)", "qty-undefined": "Pas encore défini" } },
        5: { title: "Dimensions approximatives", help: "Quelles sont les dimensions approximatives de la pièce ?", options: { "dim-lt10": "< 10 mm", "dim-10-50": "10 - 50 mm", "dim-50-200": "50 - 200 mm", "dim-200-500": "200 - 500 mm", "dim-gt500": "> 500 mm", "dim-undefined": "Pas encore défini" }, exactLabel: "Dimensions exactes (mm)", exactPlaceholder: "Ex. : 30x20x5" },
        6: { title: "Application ou environnement technologique", help: "Dans quel type d'application la pièce sera-t-elle utilisée ?", options: { "app-semiconductors": "Semi-conducteurs / microélectronique (Fab, épitaxie, wafers)", "app-optics": "Optique / photonique", "app-energy": "Énergie", "app-electronics": "Électronique", "app-industry": "Industrie / machines", "app-space": "Aéronautique / spatial", "app-medical": "Médecine / biotechnologie", "app-research": "Recherche scientifique", "app-vacuum": "Vide", "app-chemical": "Environnement chimique ou corrosif", "app-wear": "Usure ou abrasion élevée", "app-other": "Autre" } },
        7: { title: "Secteur industriel", help: "Dans quel secteur s'inscrit principalement le projet ?", options: { "sector-semiconductors": "Semi-conducteurs", "sector-space": "Aéronautique / spatial", "sector-energy": "Énergie", "sector-industrial": "Industrie / machines", "sector-electronics": "Électronique", "sector-medical": "Médecine / biotech", "sector-research": "Recherche / laboratoire", "sector-other": "Autre" } },
        8: { title: "Température de fonctionnement", help: "Dans quelle plage de température la pièce fonctionnera-t-elle approximativement ?", options: { "temp-cryo": "< -100 °C (cryogénie / spatial)", "temp-minus100-0": "-100 - 0 °C", "temp-0-200": "0 - 200 °C", "temp-200-800": "200 - 800 °C", "temp-gt800": "> 800 °C", "temp-unknown": "Je ne sais pas encore" } },
        9: { title: "Fonction principale de la pièce", help: "Quelle fonction principale la pièce doit-elle remplir ? (plusieurs choix possibles)", options: { "func-wear": "Résistance à l'usure ou à l'abrasion", "func-hardness": "Grande dureté", "func-insulation": "Isolation électrique", "func-high-temp": "Résistance aux hautes températures", "func-chemical": "Résistance chimique ou à la corrosion", "func-mechanical": "Haute résistance mécanique ou structurelle", "func-tribology": "Faible friction ou propriétés tribologiques", "func-thermal": "Gestion thermique / haute conductivité thermique", "func-stability": "Stabilité dimensionnelle ou précision", "func-biocompatibility": "Biocompatibilité", "func-optical": "Application optique", "func-other": "Autre" } },
        10: { title: "Matériau envisagé", help: "Quel matériau envisagez-vous pour votre application ?", options: { "mat-sapphire": "Saphir (EPI / SOS / solutions optiques)", "mat-sic": "Carbure de silicium (SiC) - wafers ou composants pour Fab", "mat-cvd-diamond": "Diamant CVD - quantique, optique ou gestion thermique", "mat-alumina": "Alumine (Al2O3)", "mat-zirconia": "Zircone stabilisée (ZrO2 / Y-TZP)", "mat-b4c": "Carbure de bore (B4C)", "mat-aln": "Nitrure d'aluminium (AlN)", "mat-nanocomposites": "Nanocomposites céramiques", "mat-other": "Autre matériau céramique avancé", "mat-unsure": "Je ne suis pas sûr / j'ai besoin de conseil" } },
        11: { title: "Contact et description", help: "Partagez vos coordonnées et une brève description pour lancer l'évaluation technique.", labels: { "eval-name": "Nom *", "eval-company": "Entreprise / organisation *", "eval-role": "Fonction", "eval-email": "E-mail *", "eval-phone": "Téléphone", "eval-country": "Pays *", "eval-project-description": "Brève description du projet *", "eval-files": "Téléverser des fichiers (optionnel, multiples) : PDF, DWG, STEP, PNG, JPG" }, projectPlaceholder: "Décrivez l'application, l'environnement d'utilisation et les principales exigences." },
      },
    },
    de: {
      tablist: "Bewertungsschritte",
      stepLabel: "SCHRITT {n}",
      progress: "SCHRITT {current} VON {total}",
      next: "Weiter",
      back: "Zurück",
      submit: "Technische Bewertung senden",
      sending: "Wird gesendet...",
      fileMeta: {
        idle: "Erlaubte Formate: PDF, DWG, STEP, PNG, JPG. Empfohlene Gesamtgröße: bis zu 5 MB.",
        selected: "{count} Datei(en) ausgewählt · {size}. Erlaubte Formate: PDF, DWG, STEP, PNG, JPG.",
      },
      status: {
        idle: "",
        required: "Bitte füllen Sie die Pflichtfelder aus, um fortzufahren.",
        completePrevious: "Bitte schließen Sie die vorherigen Schritte vor dem Senden ab.",
        otherRequired: "Wenn Sie 'Andere' wählen, geben Sie bitte Details an.",
        descriptionShort: "Die Projektbeschreibung muss mindestens 20 Zeichen enthalten.",
        invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein, damit wir antworten können.",
        fileType: "Bitte prüfen Sie die Anhänge. Nur PDF-, DWG-, STEP-, PNG- und JPG-Dateien sind erlaubt.",
        fileSize: "Die empfohlene Gesamtgröße der Anhänge beträgt maximal 5 MB.",
        sending: "Anfrage zur technischen Bewertung wird gesendet...",
        success: "Anfrage gesendet. Das Nanoker-Team prüft die Bewertung und antwortet per E-Mail.",
        error: "Ihre Anfrage konnte im Moment nicht verarbeitet werden. Bitte versuchen Sie es in einigen Minuten erneut.",
      },
      fields: { specify: "Bitte angeben" },
      steps: {
        1: { title: "Anfragetyp", help: "Welche Art von Unterstützung benötigen Sie?", options: { "request-manufacturing": "Fertigung eines Bauteils aus fortschrittlichem keramischem oder kristallinem Material (inklusive Machbarkeitsbewertung)", "request-selection": "Auswahl des geeigneten Materials für eine Anwendung", "request-rd": "Technologieentwicklung oder F&E-Projekt", "request-general": "Angebotsanfrage oder allgemeine Anfrage" } },
        2: { title: "Aktueller Stand", help: "Welche Informationen liegen Ihnen derzeit zur Komponente oder Anwendung vor?", options: { "current-drawings": "Technische Zeichnung(en)", "current-cad": "3D-Modell (CAD)", "current-existing-part": "Ein vorhandenes Bauteil", "current-functional": "Definierte Funktionsanforderungen", "current-idea": "Nur eine erste Idee" } },
        3: { title: "Projektphase", help: "In welcher Phase befindet sich das Projekt derzeit?", options: { "phase-concept": "Konzept / erste Studie", "phase-design": "Entwicklung oder Konstruktion", "phase-prototype": "Prototyp", "phase-series": "Serienproduktion", "phase-improvement": "Bestehendes Produkt mit Verbesserungsbedarf" } },
        4: { title: "Geschätzte Menge", help: "Welches ungefähre Volumen benötigen Sie?", options: { "qty-prototype": "Prototyp (1-10 Stück)", "qty-small": "Kleine Serie (10-100)", "qty-medium": "Mittlere Serie (100-1000)", "qty-industrial": "Industrielle Fertigung (+1000)", "qty-undefined": "Noch nicht definiert" } },
        5: { title: "Ungefähre Abmessungen", help: "Wie groß ist das Bauteil ungefähr?", options: { "dim-lt10": "< 10 mm", "dim-10-50": "10 - 50 mm", "dim-50-200": "50 - 200 mm", "dim-200-500": "200 - 500 mm", "dim-gt500": "> 500 mm", "dim-undefined": "Noch nicht definiert" }, exactLabel: "Genaue Abmessungen (mm)", exactPlaceholder: "Bsp.: 30x20x5" },
        6: { title: "Anwendung oder Technologieumfeld", help: "In welcher Art von Anwendung wird das Bauteil eingesetzt?", options: { "app-semiconductors": "Halbleiter / Mikroelektronik (Fab, Epitaxie, Wafer)", "app-optics": "Optik / Photonik", "app-energy": "Energie", "app-electronics": "Elektronik", "app-industry": "Industrie / Maschinenbau", "app-space": "Luft- und Raumfahrt / Space", "app-medical": "Medizin / Biotechnologie", "app-research": "Wissenschaftliche Forschung", "app-vacuum": "Vakuum", "app-chemical": "Chemische oder korrosive Umgebung", "app-wear": "Hoher Verschleiß oder Abrieb", "app-other": "Andere" } },
        7: { title: "Industriesektor", help: "Welcher Sektor beschreibt das Projekt am besten?", options: { "sector-semiconductors": "Halbleiter", "sector-space": "Luft- und Raumfahrt / Space", "sector-energy": "Energie", "sector-industrial": "Industrie / Maschinenbau", "sector-electronics": "Elektronik", "sector-medical": "Medizin / Biotech", "sector-research": "Forschung / Labor", "sector-other": "Andere" } },
        8: { title: "Betriebstemperatur", help: "In welchem Temperaturbereich wird das Bauteil ungefähr betrieben?", options: { "temp-cryo": "< -100 °C (Kryotechnik / Raumfahrt)", "temp-minus100-0": "-100 - 0 °C", "temp-0-200": "0 - 200 °C", "temp-200-800": "200 - 800 °C", "temp-gt800": "> 800 °C", "temp-unknown": "Ich weiß es noch nicht" } },
        9: { title: "Hauptfunktion des Bauteils", help: "Welche Hauptfunktion muss das Bauteil erfüllen? (Mehrfachauswahl möglich)", options: { "func-wear": "Verschleiß- oder Abriebfestigkeit", "func-hardness": "Hohe Härte", "func-insulation": "Elektrische Isolation", "func-high-temp": "Beständigkeit gegen hohe Temperaturen", "func-chemical": "Chemikalien- oder Korrosionsbeständigkeit", "func-mechanical": "Hohe mechanische oder strukturelle Festigkeit", "func-tribology": "Geringe Reibung oder tribologische Eigenschaften", "func-thermal": "Thermisches Management / hohe Wärmeleitfähigkeit", "func-stability": "Maßstabilität oder Präzision", "func-biocompatibility": "Biokompatibilität", "func-optical": "Optische Anwendung", "func-other": "Andere" } },
        10: { title: "Vorgesehenes Material", help: "Welches Material ziehen Sie für Ihre Anwendung in Betracht?", options: { "mat-sapphire": "Saphir (EPI / SOS / optische Lösungen)", "mat-sic": "Siliziumkarbid (SiC) - Wafer oder Fab-Komponenten", "mat-cvd-diamond": "CVD-Diamant - Quanten, Optik oder Wärmemanagement", "mat-alumina": "Aluminiumoxid (Al2O3)", "mat-zirconia": "Stabilisiertes Zirkonoxid (ZrO2 / Y-TZP)", "mat-b4c": "Borkarbid (B4C)", "mat-aln": "Aluminiumnitrid (AlN)", "mat-nanocomposites": "Keramische Nanokomposite", "mat-other": "Anderes fortschrittliches Keramikmaterial", "mat-unsure": "Ich bin nicht sicher / ich brauche Beratung" } },
        11: { title: "Kontakt und Beschreibung", help: "Teilen Sie Ihre Kontaktdaten und eine kurze Beschreibung, um die technische Bewertung zu starten.", labels: { "eval-name": "Name *", "eval-company": "Unternehmen / Organisation *", "eval-role": "Position", "eval-email": "E-Mail *", "eval-phone": "Telefon", "eval-country": "Land *", "eval-project-description": "Kurze Projektbeschreibung *", "eval-files": "Dateien hochladen (optional, mehrere): PDF, DWG, STEP, PNG, JPG" }, projectPlaceholder: "Beschreiben Sie die Anwendung, die Einsatzumgebung und die wichtigsten Anforderungen." },
      },
    },
  };

  const wizard = document.getElementById("eval-wizard");
  const form = document.getElementById("evaluation-form");
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const stepButtons = Array.from(document.querySelectorAll(".wizard-stepBtn"));
  const progressFill = document.getElementById("eval-progress-fill");
  const progressText = document.getElementById("eval-progress-text");
  const statusEl = document.getElementById("eval-form-status");
  const submitBtn = document.getElementById("eval-submit-btn");
  const filesInput = document.getElementById("eval-files");
  const filesMeta = document.getElementById("eval-files-meta");
  const honeypotInput = document.getElementById("evaluation-website");

  if (!wizard || !form || !steps.length || !progressFill || !progressText || !statusEl || !submitBtn || !filesInput || !filesMeta || !honeypotInput) {
    return;
  }

  let runtimeLang = normalizeLang(document.documentElement.getAttribute("data-lang") || document.documentElement.lang || "en");
  let activeStep = 1;
  let unlockedStep = 1;
  let isSubmitting = false;
  let statusState = "idle";

  function normalizeLang(raw) {
    const base = String(raw || "").toLowerCase().split("-")[0];
    return SUPPORTED_LANGS.has(base) ? base : "en";
  }

  function copyFor(lang = runtimeLang) {
    return COPY[normalizeLang(lang)] || COPY.en;
  }

  function format(template, params) {
    return String(template || "").replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
    );
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(mb >= 1 ? 1 : 2)} MB`;
  }

  function getStepSection(step) {
    return steps.find((section) => Number(section.dataset.step) === step) || null;
  }

  function getConditionalTextInput(wrapper) {
    return wrapper?.querySelector('input[type="text"], textarea') || null;
  }

  function clearFieldInvalidState(field) {
    field?.classList.remove("is-invalid-field");
  }

  function toggleConditionalFields(scope = form) {
    scope.querySelectorAll(".conditional-field[data-conditional-wrapper]").forEach((wrapper) => {
      const targetId = wrapper.getAttribute("data-conditional-wrapper");
      const trigger = form.querySelector(`[data-other-target="${targetId}"]`);
      const input = getConditionalTextInput(wrapper);
      const shouldShow = Boolean(trigger?.checked);

      wrapper.classList.toggle("is-hidden", !shouldShow);
      if (input) {
        input.disabled = !shouldShow;
        input.required = shouldShow;
        if (!shouldShow) {
          input.value = "";
          clearFieldInvalidState(input);
        }
      }
    });
  }

  function isStepComplete(step) {
    const section = getStepSection(step);
    if (!section) return false;

    if (step <= 10) {
      const hasSelection = Array.from(section.querySelectorAll('input[type="radio"], input[type="checkbox"]')).some((input) => input.checked);
      if (!hasSelection) return false;

      const otherTrigger = section.querySelector("[data-other-target]:checked");
      if (otherTrigger) {
        const otherField = document.getElementById(otherTrigger.getAttribute("data-other-target"));
        if (!otherField || otherField.value.trim() === "") return false;
      }

      return true;
    }

    const description = document.getElementById("eval-project-description");
    const requiredFields = Array.from(section.querySelectorAll("[required]")).filter((field) => !field.disabled && field.type !== "file");
    return requiredFields.every((field) => field.value.trim() !== "" && field.checkValidity()) && Boolean(description?.value.trim().length >= 20);
  }

  function getSequentialUnlockedStep() {
    let unlocked = 1;
    for (let step = 1; step <= TOTAL_STEPS; step += 1) {
      if (!isStepComplete(step)) break;
      unlocked = Math.min(TOTAL_STEPS, step + 1);
    }
    return unlocked;
  }

  function updateProgress() {
    const percent = TOTAL_STEPS <= 1 ? 100 : Math.round(((activeStep - 1) / (TOTAL_STEPS - 1)) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = format(copyFor().progress, { current: activeStep, total: TOTAL_STEPS });
  }

  function setStatus(state) {
    statusState = state;
    const message = copyFor().status[state] || "";
    if (message.includes("<a ")) {
      statusEl.innerHTML = message;
    } else {
      statusEl.textContent = message;
    }
    statusEl.classList.toggle("is-sending", state === "sending");
    statusEl.classList.toggle("is-error", !["idle", "sending", "success"].includes(state));
    statusEl.classList.toggle("is-success", state === "success");
  }

  function updateActionLabels() {
    form.querySelectorAll(".step-next-btn").forEach((button) => {
      button.textContent = copyFor().next;
    });
    form.querySelectorAll(".wizard-back-btn").forEach((button) => {
      button.textContent = copyFor().back;
    });
    submitBtn.textContent = isSubmitting ? copyFor().sending : copyFor().submit;
    submitBtn.classList.toggle("is-loading", isSubmitting);
  }

  function updateFilesMeta(mode = "idle", files = filesInput.files) {
    if (mode === "selected") {
      const totalSize = Array.from(files || []).reduce((sum, file) => sum + (file.size || 0), 0);
      filesMeta.textContent = format(copyFor().fileMeta.selected, {
        count: files?.length || 0,
        size: formatFileSize(totalSize),
      });
      return;
    }

    filesMeta.textContent = copyFor().fileMeta.idle;
  }

  function localizeStep(step) {
    const section = getStepSection(step);
    const stepCopy = copyFor().steps[step];
    if (!section || !stepCopy) return;

    const title = section.querySelector("h3");
    const help = section.querySelector(".wizard-help");
    if (title) title.textContent = stepCopy.title;
    if (help) help.textContent = stepCopy.help;

    Object.entries(stepCopy.options || {}).forEach(([id, value]) => {
      const label = section.querySelector(`label[for="${id}"]`);
      if (label) label.textContent = value;
    });

    if (step === 5) {
      const exactLabel = section.querySelector('label[for="eval-exact-dimensions"]');
      const exactInput = document.getElementById("eval-exact-dimensions");
      if (exactLabel) exactLabel.textContent = stepCopy.exactLabel;
      if (exactInput) exactInput.setAttribute("placeholder", stepCopy.exactPlaceholder);
    }

    if (step === 11) {
      Object.entries(stepCopy.labels || {}).forEach(([id, value]) => {
        const label = section.querySelector(`label[for="${id}"]`);
        if (label) label.textContent = value;
      });
      const description = document.getElementById("eval-project-description");
      if (description) description.setAttribute("placeholder", stepCopy.projectPlaceholder);
    }
  }

  function syncI18nText() {
    wizard.querySelector(".wizard-steps")?.setAttribute("aria-label", copyFor().tablist);
    stepButtons.forEach((button) => {
      const step = Number(button.dataset.stepJump);
      button.textContent = format(copyFor().stepLabel, { n: step });
    });

    for (let step = 1; step <= TOTAL_STEPS; step += 1) {
      localizeStep(step);
    }

    form.querySelectorAll(".conditional-field[data-conditional-wrapper]").forEach((wrapper) => {
      const input = getConditionalTextInput(wrapper);
      const label = input ? wrapper.querySelector(`label[for="${input.id}"]`) : null;
      if (label) label.textContent = copyFor().fields.specify;
    });

    updateFilesMeta(filesInput.files?.length ? "selected" : "idle");
    updateActionLabels();
    updateProgress();
    if (statusState !== "idle") setStatus(statusState);
  }

  function renderWizard() {
    steps.forEach((section) => {
      const step = Number(section.dataset.step);
      const isActive = step === activeStep;
      section.classList.toggle("is-active", isActive);
      section.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    stepButtons.forEach((button) => {
      const step = Number(button.dataset.stepJump);
      const isCurrent = step === activeStep;
      const isComplete = step < activeStep && isStepComplete(step);
      const canOpen = step <= unlockedStep;
      button.disabled = !canOpen;
      button.classList.toggle("is-current", isCurrent);
      button.classList.toggle("is-complete", isComplete);
      button.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });

    updateProgress();
  }

  function focusStep(step) {
    const section = getStepSection(step);
    section?.querySelector("input, textarea, button")?.focus?.({ preventScroll: true });
  }

  function goToStep(step, shouldFocus = true) {
    activeStep = Math.max(1, Math.min(step, unlockedStep));
    renderWizard();
    persistState();
    if (shouldFocus) focusStep(activeStep);
  }

  function validateOtherField(step) {
    const section = getStepSection(step);
    const otherTrigger = section?.querySelector("[data-other-target]:checked");
    if (!otherTrigger) return true;

    const otherField = document.getElementById(otherTrigger.getAttribute("data-other-target"));
    const valid = Boolean(otherField && otherField.value.trim() !== "");
    otherField?.classList.toggle("is-invalid-field", !valid);
    if (!valid) {
      setStatus("otherRequired");
      otherField?.focus?.({ preventScroll: true });
    }
    return valid;
  }

  function validateFiles() {
    const files = Array.from(filesInput.files || []);
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const hasInvalidExtension = files.some((file) => {
      const parts = String(file.name || "").toLowerCase().split(".");
      const extension = parts.length > 1 ? parts.pop() : "";
      return !ALLOWED_FILE_EXTENSIONS.has(extension || "");
    });

    filesInput.classList.toggle("is-invalid-field", hasInvalidExtension || totalSize > MAX_TOTAL_FILE_SIZE);

    if (hasInvalidExtension) {
      setStatus("fileType");
      return false;
    }

    if (totalSize > MAX_TOTAL_FILE_SIZE) {
      setStatus("fileSize");
      return false;
    }

    return true;
  }

  function validateStep(step) {
    if (!isStepComplete(step)) {
      if (step === 11) {
        const description = document.getElementById("eval-project-description");
        if (description && description.value.trim().length > 0 && description.value.trim().length < 20) {
          description.classList.add("is-invalid-field");
          setStatus("descriptionShort");
          description.focus({ preventScroll: true });
          return false;
        }

        const invalidField = Array.from(getStepSection(step)?.querySelectorAll("input, textarea") || []).find((field) => {
          if (field.type === "file" || field.disabled) return false;
          const value = typeof field.value === "string" ? field.value.trim() : "";
          const valid = !field.required || (value !== "" && field.checkValidity());
          field.classList.toggle("is-invalid-field", !valid);
          return !valid;
        });

        if (invalidField) {
          if (invalidField.type === "email") {
            setStatus("invalidEmail");
          } else {
            setStatus("required");
          }
          invalidField.focus({ preventScroll: true });
          return false;
        }
      } else {
        setStatus("required");
        getStepSection(step)?.querySelector('input[type="radio"], input[type="checkbox"]')?.focus?.({ preventScroll: true });
        return false;
      }
    }

    if (!validateOtherField(step)) return false;

    if (step === 11) {
      const description = document.getElementById("eval-project-description");
      const email = document.getElementById("eval-email");

      if (description && description.value.trim().length < 20) {
        description.classList.add("is-invalid-field");
        setStatus("descriptionShort");
        description.focus({ preventScroll: true });
        return false;
      }

      if (email && !email.checkValidity()) {
        email.classList.add("is-invalid-field");
        setStatus("invalidEmail");
        email.focus({ preventScroll: true });
        return false;
      }

      if (!validateFiles()) {
        filesInput.focus({ preventScroll: true });
        return false;
      }
    }

    setStatus("idle");
    return true;
  }

  function persistState() {
    const state = { activeStep, checked: {}, values: {} };

    form.querySelectorAll("input, textarea").forEach((field) => {
      if (!field.id || field.type === "file") return;
      if (field.type === "radio" || field.type === "checkbox") {
        state.checked[field.id] = field.checked;
      } else {
        state.values[field.id] = field.value;
      }
    });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function restoreState() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const state = JSON.parse(raw);
      Object.entries(state.checked || {}).forEach(([id, checked]) => {
        const field = document.getElementById(id);
        if (field && (field.type === "radio" || field.type === "checkbox")) {
          field.checked = Boolean(checked);
        }
      });
      Object.entries(state.values || {}).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field && field.type !== "file") field.value = typeof value === "string" ? value : "";
      });
      toggleConditionalFields();
      unlockedStep = Math.max(1, getSequentialUnlockedStep());
      activeStep = Math.max(1, Math.min(Number(state.activeStep || 1), unlockedStep));
    } catch (_error) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  function resetWizard() {
    form.reset();
    form.querySelectorAll(".is-invalid-field").forEach((field) => field.classList.remove("is-invalid-field"));
    toggleConditionalFields();
    activeStep = 1;
    unlockedStep = 1;
    isSubmitting = false;
    submitBtn.disabled = false;
    updateActionLabels();
    updateFilesMeta("idle");
    sessionStorage.removeItem(STORAGE_KEY);
    renderWizard();
  }

  async function submitForm() {
    const formData = new FormData(form);
    formData.set("website", honeypotInput.value.trim());

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/send-evaluation`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch (_error) {
      payload = null;
    }

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.message || "mail_delivery_failed");
    }
  }

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.stepJump);
      if (step <= unlockedStep) goToStep(step);
    });
  });

  form.querySelectorAll("[data-next-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.getAttribute("data-next-step"));
      if (!validateStep(step)) return;
      unlockedStep = Math.max(unlockedStep, Math.min(TOTAL_STEPS, step + 1));
      goToStep(step + 1);
    });
  });

  form.querySelectorAll("[data-prev-step]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStep = Math.max(1, Number(button.getAttribute("data-prev-step")));
      renderWizard();
      persistState();
      focusStep(activeStep);
    });
  });

  form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((field) => {
    field.addEventListener("change", () => {
      toggleConditionalFields(field.closest(".wizard-step") || form);
      unlockedStep = Math.max(1, getSequentialUnlockedStep());
      if (statusState !== "idle") setStatus("idle");
      persistState();
      renderWizard();
    });
  });

  form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldInvalidState(field);
      unlockedStep = Math.max(1, getSequentialUnlockedStep());
      if (statusState !== "idle") setStatus("idle");
      persistState();
      renderWizard();
    });
  });

  filesInput.addEventListener("change", () => {
    clearFieldInvalidState(filesInput);
    if (filesInput.files?.length) {
      updateFilesMeta("selected");
      if (validateFiles()) {
        if (statusState === "fileType" || statusState === "fileSize") setStatus("idle");
      }
    } else {
      updateFilesMeta("idle");
      if (statusState === "fileType" || statusState === "fileSize") setStatus("idle");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    unlockedStep = Math.max(1, getSequentialUnlockedStep());
    if (unlockedStep < TOTAL_STEPS) {
      goToStep(unlockedStep);
      setStatus("completePrevious");
      return;
    }

    if (!validateStep(TOTAL_STEPS)) return;

    isSubmitting = true;
    submitBtn.disabled = true;
    updateActionLabels();
    setStatus("sending");

    try {
      await submitForm();
      resetWizard();
      setStatus("success");
    } catch (_error) {
      isSubmitting = false;
      submitBtn.disabled = false;
      updateActionLabels();
      setStatus("error");
    }
  });

  window.addEventListener("lang:change", (event) => {
    runtimeLang = normalizeLang(event.detail?.lang || runtimeLang);
    syncI18nText();
  });

  restoreState();
  toggleConditionalFields();
  unlockedStep = Math.max(1, getSequentialUnlockedStep());
  if (activeStep > unlockedStep) activeStep = unlockedStep;
  syncI18nText();
  renderWizard();
  persistState();
})();
