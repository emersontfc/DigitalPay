import { ProductTranslation } from '../types';

/**
 * Catálogo pré-compilado de traduções completas para os 14 Modelos Prontos do Digitall Pay.
 * Garante carregamento instantâneo (0ms) sem requisições de rede para todos os templates do sistema.
 */
export const PRECOMPILED_MODEL_TRANSLATIONS: Record<string, { en: ProductTranslation; es: ProductTranslation }> = {
  // 1. MODELO VSL
  'model-vsl': {
    en: {
      name: '10K Millionaire VSL Method',
      headline: 'The Exact Blueprint to Sell Every Single Day on Autopilot',
      subheadline: 'Watch the 8-minute video below to discover how to unlock consistent daily sales without burning your budget.',
      badge_text: 'LIMITED TIME SPECIAL OFFER',
      cta_text: 'GET INSTANT ACCESS NOW',
      cta_subtext: '🔒 100% Encrypted Payment • Instant Access by Email',
      installments_text: 'or 12x flexible payments on card • Single payment available',
      features: [
        'Instant and Lifetime Access to Full HD Video Lessons',
        'Ready-to-Use High-Converting Ad & Sales Page Templates',
        'Exclusive Student Community for Networking and Active Support',
        'Bonus: Real-Time Traffic Management & ROI Spreadsheet',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Module 1: Strategic Alignment & Mindset',
          description: 'Discover the hidden structure of the top-selling campaigns worldwide.',
          lessonsCount: '4 Practical Lessons',
        },
        {
          id: 'm-2',
          title: 'Module 2: The Automated Traffic Engine',
          description: 'Pixel configuration, key metrics, and building creatives that convert clicks into buyers.',
          lessonsCount: '6 Practical Lessons',
        },
        {
          id: 'm-3',
          title: 'Module 3: Safe Horizontal & Vertical Scaling',
          description: 'How to double and triple your revenue without proportionally increasing costs.',
          lessonsCount: '5 Practical Lessons',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Rodrigo Alencar',
          role: 'Affiliate & Digital Creator',
          content: 'After applying the lesson 3 framework, I went from 2 sales a week to over 10 automated sales every day!',
          rating: 5,
        },
        {
          id: 't-2',
          name: 'Mariana Duarte',
          role: 'Infoproduct Specialist',
          content: 'Direct to the point with zero fluff. Absolutely the best investment I made this year.',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: 'How and when do I receive my access?',
          answer: 'Access is delivered immediately to your email inbox right after payment confirmation.',
        },
        {
          id: 'f-2',
          question: 'Do I need previous experience?',
          answer: 'No! The training is structured from absolute beginner to advanced with click-by-click practical walkthroughs.',
        },
        {
          id: 'f-3',
          question: 'Is there a money-back satisfaction guarantee?',
          answer: 'Yes, you have a 100% unconditional 7-day money-back guarantee. If you do not love it, you get a full refund.',
        },
      ],
    },
    es: {
      name: 'Método VSL Millonario 10K',
      headline: 'El Paso a Paso Exacto Para Vender Todos los Días en Piloto Automático',
      subheadline: 'Mira el video de 8 minutos a continuación para descubrir cómo desbloquear ventas diarias consistentes.',
      badge_text: 'OFERTA POR TIEMPO LIMITADO',
      cta_text: 'QUIERO EMPEZAR AHORA MISMO',
      cta_subtext: '🔒 Pago 100% Cifrado • Acceso Inmediato por E-mail',
      installments_text: 'o en hasta 12 cuotas con tarjeta • Pago único disponible',
      features: [
        'Acceso Inmediato y de por Vida a Clases en Alta Definición',
        'Plantillas Listas de Anuncios y Páginas de Alta Conversión',
        'Comunidad Exclusiva de Alumnos para Networking y Soporte',
        'Bono: Hoja de Gestión de Tráfico y ROI en Tiempo Real',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Módulo 1: Alineación Estratégica y Mentalidad',
          description: 'Descubre la estructura invisible de las campañas más exitosas a nivel mundial.',
          lessonsCount: '4 Lecciones Prácticas',
        },
        {
          id: 'm-2',
          title: 'Módulo 2: El Motor de Tráfico Automático',
          description: 'Configuración de píxeles, métricas clave y creativos que transforman clics en clientes.',
          lessonsCount: '6 Lecciones Prácticas',
        },
        {
          id: 'm-3',
          title: 'Módulo 3: Escala Horizontal y Vertical Segura',
          description: 'Cómo duplicar y triplicar tu facturación sin aumentar proporcionalmente tus costos.',
          lessonsCount: '5 Lecciones Prácticas',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Rodrigo Alencar',
          role: 'Afiliado y Productor Digital',
          content: '¡Después de aplicar el método de la lección 3, pasé de 2 ventas por semana a más de 10 ventas diarias automáticas!',
          rating: 5,
        },
        {
          id: 't-2',
          name: 'Mariana Duarte',
          role: 'Especialista en Infoproductos',
          content: 'Didáctica directa al grano, sin rodeos. Sin duda la mejor inversión que hice este año.',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: '¿Cómo y cuándo recibo mi acceso?',
          answer: 'El envío es inmediato por correo electrónico en cuanto el pago sea aprobado por la plataforma.',
        },
        {
          id: 'f-2',
          question: '¿Necesito experiencia previa?',
          answer: '¡No! La formación está estructurada desde cero hasta avanzado con ejemplos prácticos paso a paso.',
        },
        {
          id: 'f-3',
          question: '¿Existe garantía de satisfacción?',
          answer: 'Sí, tienes garantía incondicional de 7 días. Si no te convence, te reembolsamos el 100% de tu dinero.',
        },
      ],
    },
  },

  // 2. MODELO EBOOK
  'model-ebook': {
    en: {
      name: 'Ultimate Profitable Business Guidebook',
      headline: 'The Practical Blueprint to Build Your Online Income Stream in 21 Days',
      subheadline: 'A step-by-step digital manual designed for busy professionals seeking direct, actionable results.',
      badge_text: 'UPDATED 2026 DIGITAL EDITION',
      cta_text: 'DOWNLOAD THE DIGITAL MANUAL NOW',
      cta_subtext: '📥 Instant PDF Download + Included Action Bonuses',
      installments_text: 'or single card payment available',
      features: [
        'Complete high-resolution PDF e-book with executive layout and formatting',
        'Hands-on implementation checklists to monitor milestones',
        'Access on any device (smartphone, tablet, laptop or Kindle)',
        '3 Exclusive Productivity and Free Software Bonuses',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Part 1: Choosing Your High-Yield Business Model',
          description: 'Identify low-risk, high-reward digital opportunities with immediate traction.',
          lessonsCount: 'Chapters 1 to 3',
        },
        {
          id: 'm-2',
          title: 'Part 2: Crafting Your Irresistible Offer',
          description: 'Build an offer your ideal customers would feel foolish to turn down.',
          lessonsCount: 'Chapters 4 to 7',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Beatriz Fonseca',
          role: 'Reader & Digital Entrepreneur',
          content: 'I read the handbook in a single afternoon and the next morning I was already executing. Highly practical!',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: 'In what format is the material delivered?',
          answer: 'Delivered in high-quality PDF format, compatible with Kindle, mobile, computer, and tablet.',
        },
        {
          id: 'f-2',
          question: 'Can I print the guide?',
          answer: 'Yes! The file has no print restrictions and can be printed anytime.',
        },
      ],
    },
    es: {
      name: 'Manual Definitivo de Negocios Rentables',
      headline: 'La Guía Práctica Para Crear Tu Fuente de Ingresos Online en 21 Días',
      subheadline: 'Un plan paso a paso en formato digital para personas con poco tiempo que buscan resultados concretos.',
      badge_text: 'EDICIÓN DIGITAL ACTUALIZADA 2026',
      cta_text: 'DESCARGAR LA GUÍA DIGITAL AHORA',
      cta_subtext: '📥 Descarga Inmediata en PDF + Bonos Incluidos',
      installments_text: 'o pago único con tarjeta disponible',
      features: [
        'E-book completo en PDF con diseño ejecutivo y diagramación profesional',
        'Listas de control para seguir y cumplir objetivos fácilmente',
        'Acceso en cualquier dispositivo (móvil, tablet o computadora)',
        '3 Bonos Exclusivos de Productividad y Herramientas Gratuitas',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Parte 1: Elección del Modelo de Negocio',
          description: 'Identifica oportunidades de bajo riesgo y alto retorno inmediato.',
          lessonsCount: 'Capítulos 1 al 3',
        },
        {
          id: 'm-2',
          title: 'Parte 2: Montaje de la Oferta Irresistible',
          description: 'Crea una propuesta que tus clientes consideren una locura rechazar.',
          lessonsCount: 'Capítulos 4 al 7',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Beatriz Fonseca',
          role: 'Lectora y Emprendedora',
          content: 'Leí el e-book en una sola tarde y al día siguiente ya estaba aplicando las instrucciones. ¡Muy práctico!',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: '¿En qué formato se entrega el material?',
          answer: 'En formato PDF de alta resolución, compatible con Kindle, teléfono celular, computadora y tablet.',
        },
        {
          id: 'f-2',
          question: '¿Puedo imprimir el contenido?',
          answer: '¡Sí! El archivo no tiene bloqueos de impresión y puedes imprimirlo cuando lo desees.',
        },
      ],
    },
  },

  // 3. MODELO MENTORIA
  'model-mentoria': {
    en: {
      name: 'Black Elite Mentorship: Business Scaling',
      headline: 'Private Strategic Mentorship to Exponentially Scale Your Company Revenue',
      subheadline: 'Only 15 spots per cohort. Direct insider access to the highest performing operators in modern business.',
      badge_text: 'EXCLUSIVE SELECTION • LIMITED SPOTS',
      cta_text: 'APPLY FOR EXCLUSIVE MENTORSHIP',
      cta_subtext: '⭐ Application screening process • Reviewed within 24 hours',
      installments_text: 'or flexible installments on credit card / single payment',
      features: [
        'Bi-weekly live intensive masterclasses with in-depth project audits',
        'Direct VIP WhatsApp master group with the Mentor',
        'Individual teardown of your sales funnel and customer acquisition machine',
        'Unrestricted access to all masterclass recordings, blueprints, and templates',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Stage 1: Diagnosis & Brand Positioning',
          description: 'Crafting your unique authority narrative and undisputed market positioning.',
          lessonsCount: 'Live Session 1',
        },
        {
          id: 'm-2',
          title: 'Stage 2: High-Ticket Sales Machine',
          description: 'How to charge 5x to 10x higher with qualified clients who never negotiate down.',
          lessonsCount: 'Live Session 2',
        },
        {
          id: 'm-3',
          title: 'Stage 3: Systems Architecture & Global Scale',
          description: 'Intelligent automation, autonomous team delegation, and cross-border expansion.',
          lessonsCount: 'Live Session 3',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Guilherme Sampaio',
          role: 'Tech Startup CEO',
          content: 'Just one single strategic review paid for the entire investment 5 times over in the same month!',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: 'How do the live sessions work?',
          answer: 'Sessions take place via private Zoom calls in small groups so each participant receives personalized guidance.',
        },
        {
          id: 'f-2',
          question: 'What if I miss a live session?',
          answer: 'All masterclasses are recorded in 4K and uploaded to the private VIP member vault with 1-year full access.',
        },
      ],
    },
    es: {
      name: 'Mentoría Black Elite: Aceleración de Resultados',
      headline: 'Acompañamiento Estratégico y Personal Para Multiplicar Tu Facturación',
      subheadline: 'Solo 15 cupos por ciclo. Acceso directo a las estrategias exclusivas de los mayores operadores del mercado.',
      badge_text: 'SELECCIÓN EXCLUSIVA • CUPOS LIMITADOS',
      cta_text: 'APLICAR A LA MENTORÍA EXCLUSIVA',
      cta_subtext: '⭐ Proceso selectivo de aplicación • Análisis en menos de 24 horas',
      installments_text: 'o en cómodas cuotas con tarjeta de crédito / pago único',
      features: [
        'Encuentros quincenales en vivo con análisis profundo de proyectos',
        'Grupo VIP exclusivo en WhatsApp directamente con el Mentor',
        'Auditoría individual de tu modelo de ventas y embudo de conversión',
        'Acceso irrestricto a todos los materiales y grabaciones de todas las sesiones',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Etapa 1: Diagnóstico y Posicionamiento de Marca',
          description: 'Estructuración de tu narrativa única y posicionamiento de autoridad incuestionable.',
          lessonsCount: 'Sesión en Vivo 1',
        },
        {
          id: 'm-2',
          title: 'Etapa 2: Embudo de Ventas High-Ticket',
          description: 'Cómo cobrar de 5x a 10x más con clientes calificados que valoran tu entrega.',
          lessonsCount: 'Sesión en Vivo 2',
        },
        {
          id: 'm-3',
          title: 'Etapa 3: Máquina de Operaciones y Escala',
          description: 'Delegación, automatizaciones inteligentes y expansión internacional.',
          lessonsCount: 'Sesión en Vivo 3',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Guilherme Sampaio',
          role: 'CEO Startup Digital',
          content: '¡Solo una de las sesiones de mentoría multiplicó la inversión por 5 en el mismo mes. Nivel de entrega insuperable!',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: '¿Cómo funcionan los encuentros en vivo?',
          answer: 'Las sesiones se realizan vía Zoom con grupos reducidos para que cada participante reciba dirección personalizada.',
        },
        {
          id: 'f-2',
          question: 'Si me pierdo una sesión, ¿queda grabada?',
          answer: 'Sí, todas las grabaciones quedan disponibles en el área de miembros VIP durante 1 año completo.',
        },
      ],
    },
  },

  // 4. MODELO TITAN FITNESS
  'model-titan-fitness': {
    en: {
      name: 'Titan Alpha Protocol 60D: Hypertrophy & Power',
      headline: 'The Scientific Protocol That Builds Dense Muscle and Burns Fat in 60 Days',
      subheadline: 'High-tension periodized training, flexible nutrition architecture, and the exact supplementation used by elite athletes.',
      badge_text: 'HIGH PERFORMANCE PROTOCOL • 2026 EDITION',
      cta_text: 'UNLOCK MY PHYSICAL BREAKTHROUGH',
      cta_subtext: '⚡ Instant App Download + PDF & 4K Video Training Sheets',
      installments_text: 'or single payment available',
      features: [
        'Periodized Training Splits (PPL, Upper/Lower, and Muscle Hypertrophy)',
        'Automated Daily Macronutrient and Calorie Tracker Spreadsheet',
        'Evidence-Based Science-Backed Supplementation Manual',
        '4K Video Library with Flawless Technique for Over 120 Exercises',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Phase 1: Neural Base & Raw Strength',
          description: 'Joint mobility priming, neuromuscular activation, and progressive overload tracking.',
          lessonsCount: 'Weeks 1 to 3',
        },
        {
          id: 'm-2',
          title: 'Phase 2: Metabolic Hypertrophy & Density',
          description: 'High-intensity shock techniques: rest-pause, controlled drop-sets, and maximal mechanical tension.',
          lessonsCount: 'Weeks 4 to 6',
        },
        {
          id: 'm-3',
          title: 'Phase 3: Peak Vascularity & Shredding',
          description: 'Smart caloric deficit strategies that protect lean muscle while shredding body fat.',
          lessonsCount: 'Weeks 7 to 9',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Lucas Brandão',
          role: 'Lifting Enthusiast (4 years)',
          content: 'I was plateaued at the same weight for over a year. In 45 days of Titan Protocol I dropped 4% bodyfat and gained 3cm on arms!',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: 'Can I do this program at any gym?',
          answer: 'Yes! All workouts are designed using standard barbells, dumbbells, cables, and machines available in every gym.',
        },
        {
          id: 'f-2',
          question: 'Do I need expensive supplements?',
          answer: 'No. 90% of your results come from whole food and progressive training. We only recommend scientifically proven basics.',
        },
      ],
    },
    es: {
      name: 'Titan Alpha Protocol 60D: Fuerza e Hipertrofia',
      headline: 'El Protocolo Científico Que Desarrolla Músculo Denso y Quema Grasa en 60 Días',
      subheadline: 'Entrenamientos periodizados de alta tensión, plan nutricional flexible y la suplementación exacta utilizada por atletas de élite.',
      badge_text: 'PROTOCOLO DE ALTO RENDIMIENTO • EDICIÓN 2026',
      cta_text: 'DESBLOQUEAR MI EVOLUCIÓN FÍSICA',
      cta_subtext: '⚡ Descarga Inmediata de la App + Rutinas en PDF y Video 4K',
      installments_text: 'o pago único disponible',
      features: [
        'Divisiones de Entrenamiento Periodizadas (Push/Pull/Legs, Torso/Pierna)',
        'Calculadora Automática de Macronutrientes y Calorías Diarias',
        'Guía Completa de Suplementación Basada en Evidencia Científica',
        'Biblioteca en Video 4K con la Ejecución Correcta de más de 120 Ejercicios',
      ],
      modules: [
        {
          id: 'm-1',
          title: 'Fase 1: Construcción de Base Neural y Fuerza',
          description: 'Movilidad articular, activación neuromuscular y sobrecarga progresiva en ejercicios básicos.',
          lessonsCount: 'Semanas 1 a 3',
        },
        {
          id: 'm-2',
          title: 'Fase 2: Hipertrofia Metabólica y Densidad',
          description: 'Técnicas avanzadas de intensidad: rest-pause, drop-sets controlados y máxima tensión mecánica.',
          lessonsCount: 'Semanas 4 a 6',
        },
        {
          id: 'm-3',
          title: 'Fase 3: Definición Estética y Quema de Grasa',
          description: 'Estrategias de déficit calórico inteligente protegiendo la masa muscular y maximizando vascularización.',
          lessonsCount: 'Semanas 7 a 9',
        },
      ],
      testimonials: [
        {
          id: 't-1',
          name: 'Lucas Brandão',
          role: 'Atleta de Musculación',
          content: 'Estuve estancado durante un año. En 45 días con Titan Protocol bajé 4% de grasa corporal y gané 3 cm de bíceps.',
          rating: 5,
        },
      ],
      faqs: [
        {
          id: 'f-1',
          question: '¿Sirve para cualquier gimnasio?',
          answer: '¡Sí! Diseñado para barras, mancuernas y máquinas convencionales presentes en todos los gimnasios del mundo.',
        },
        {
          id: 'f-2',
          question: '¿Necesito gastar mucho en suplementos?',
          answer: 'No. El 90% de los resultados provienen de comida real y entrenamiento intenso. Solo sugerimos suplementos esenciales comprobados.',
        },
      ],
    },
  },
};

