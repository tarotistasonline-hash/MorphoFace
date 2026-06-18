import { Profile } from "../types";

export const demoProfiles: Record<"es" | "en" | "fr", Profile[]> = {
  es: [
    {
      id: "profile-oval",
      name: "Elena (La Intuición Receptiva)",
      description: "Rostro ovalado con zona cerebral dominante, ojos claros y abiertos, y proporciones de gran armonía.",
      gender: "female",
      imagePlaceholder: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Ovalado",
        overallType: "Dilatado (Abierto/Receptivo)",
        temperament: "Sanguíneo-Melancólico",
        zones: {
          intellectual: {
            score: 85,
            interpretation: "Una frente alta y redondeada con sienes despejadas indica un sector cerebral dominante. Los pensamientos se procesan con una imaginación fluida, valorando las ideas abstractas, la estética y la reflexión profunda antes de precipitarse a la acción."
          },
          emotional: {
            score: 70,
            interpretation: "La zona media está muy equilibrada con pómulos sutilmente modelados. Elena muestra una adaptabilidad social abierta, con receptores relacionales cálidos y una empatía natural con su entorno."
          },
          instinctive: {
            score: 55,
            interpretation: "Una línea mandibular suave y un mentón de trazos redondeados. Elena prioriza la exploración mental y la armonía en las relaciones por encima de la competencia física o material, actuando cuando se siente intelectualmente inspirada."
          }
        },
        features: {
          eyes: {
            style: "Grandes, luminosos y receptivos",
            interpretation: "La amplia apertura de sus ojos indica una magnífica receptividad global. Elena percibe los estímulos visuales y sensoriales con facilidad, dejándose influir de manera positiva por la atmósfera y la estética de su entorno."
          },
          nose: {
            style: "Rectilínea y esbelta",
            interpretation: "El tabique nasal recto simboliza un firme equilibrio emocional. Elena posee filtros de defensa saludables, manteniendo límites amigables pero firmes sin necesidad de caer en confrontaciones directas."
          },
          mouthAndJaw: {
            style: "Labios bien definidos con mentón suave",
            interpretation: "Una boca relajada con labios suavemente curvados indica una comunicación fluida y alta sensibilidad física. El mentón redondeado prioriza la asimilación pacífica frente al conflicto material."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 42, y: 18 },
          { label: "Forehead Right", x: 58, y: 18 },
          { label: "Left Eye", x: 41, y: 38 },
          { label: "Right Eye", x: 59, y: 38 },
          { label: "Nose Tip", x: 50, y: 52 },
          { label: "Left Cheekbone", x: 34, y: 54 },
          { label: "Right Cheekbone", x: 66, y: 54 },
          { label: "Mouth Left", x: 44, y: 70 },
          { label: "Mouth Right", x: 56, y: 70 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Magnífica inteligencia emocional y empatía profunda hacia las dinámicas de grupo.",
          "Pensamiento conceptual excepcional, visualización creativa y resolución innovadora de problemas.",
          "Estilo de comunicación verbal de gran fluidez que une e inspira a las comunidades con comodidad."
        ],
        growthAreas: [
          "Vulnerabilidad a la sobrecarga sensorial debido a receptores altamente dilatados y abiertos.",
          "Tendencia a postergar la ejecución material o física cuando los modelos mentales aún se sienten incompletos.",
          "Dificultad para decir 'no' ante las constantes demandas de recursos y atención de los demás."
        ],
        pastIns: "Su base ósea equilibrada sugiere un entorno temprano pacífico que fomentó la libre expresión creativa y el autodescubrimiento. Sus receptores abiertos reflejan una infancia donde la curiosidad y la exploración fueron recompensadas.",
        presentIns: "El tono de los músculos faciales y su expresión cálida indican una participación social activa y valiosa, aunque ligeros signos de cansancio en la zona temporal sugieren la necesidad de buscar momentos de introspección.",
        futureIns: "Elena avanza con naturalidad hacia un camino de liderazgo empático, docencia o consultoría de alto nivel. Al grounding (conectar) sus ideales conceptuales con rutinas ordenadas, su calidez innata florecerá al máximo."
      }
    },
    {
      id: "profile-square",
      name: "Marcus (El Ejecutivo Firme)",
      description: "Mandíbula ancha y cuadrada, arcos óseos marcados y facciones concentradas y protectoras.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Cuadrado",
        overallType: "Concentrado-Tónico (Activo/Selectivo)",
        temperament: "Colérico-Flemático",
        zones: {
          intellectual: {
            score: 60,
            interpretation: "Frente amplia y compacta en pauta plana, indicando un pensamiento pragmático, estructural e instrumental. Marcus destaca en sistemas lógicos, secuencias y ejecución rigurosa a ras de tierra."
          },
          emotional: {
            score: 55,
            interpretation: "Un contorno facial altamente protector. Sus pómulos firmes y robustos y sus ojos concentrados denotan intercambios afectivos muy selectivos, basados en la lealtad absoluta y principios compartidos."
          },
          instinctive: {
            score: 90,
            interpretation: "Una mandíbula ancha y de gran vigor óseo con un mentón plano bien dibujado. Indica una inmensa resistencia física, persistencia, realismo práctico y un instinto natural para salvaguardar sus límites."
          }
        },
        features: {
          eyes: {
            style: "Enfocados y profundos",
            interpretation: "Las cuencas oculares protegidas y profundas revelan a un observador analítico muy selectivo. Filtra rigurosamente la información antes de permitir influencias externas."
          },
          nose: {
            style: "Pirámide nasal firme con tabique bien estructurado",
            interpretation: "Su fuerte estructura nasal muestra una notable independencia psicológica. Posee límites energéticos muy protectores, defendiendo a su equipo y sus convicciones con firmeza."
          },
          mouthAndJaw: {
            style: "Labios tónicos con mandíbula ancha y cuadrada",
            interpretation: "El cierre firme de los labios representa una gran determinación y firmeza de carácter. Marcus posee una capacidad increíble de persistencia física y de trabajo continuo bajo presión."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 39, y: 22 },
          { label: "Forehead Right", x: 61, y: 22 },
          { label: "Left Eye", x: 42, y: 41 },
          { label: "Right Eye", x: 58, y: 41 },
          { label: "Nose Tip", x: 50, y: 55 },
          { label: "Left Cheekbone", x: 33, y: 56 },
          { label: "Right Cheekbone", x: 67, y: 56 },
          { label: "Mouth Left", x: 43, y: 72 },
          { label: "Mouth Right", x: 57, y: 72 },
          { label: "Chin Point", x: 50, y: 86 }
        ],
        strengths: [
          "Perseverancia inquebrantable, confiabilidad absoluta y liderazgo resolutivo ante las crisis.",
          "Habilidad pragmática insuperable para simplificar problemas complejos en planes de acción directos.",
          "Límites profesionales sumamente claros que brindan orden y seguridad total a sus proyectos."
        ],
        growthAreas: [
          "Riesgo de cierta rigidez mental o reticencia a pivots rápidos cuando se enfrenta a entornos caóticos.",
          "Tendencia a ocultar o reprimir el cansancio emocional acumulado bajo la armadura de la obligación.",
          "Puede ser percibido inicialmente como frío o demasiado riguroso por personas de sensibilidad más abierta."
        ],
        pastIns: "Su fuerte estructura ósea sugiere una infancia que demandó resiliencia temprana, asunción de responsabilidades y un aprendizaje enfocado en la perseverancia y la autoprotección.",
        presentIns: "La tensión activa de los músculos maceteros de su mandíbula refleja un período de intenso de enfoque profesional, guiando procesos complejos con alto sentido del deber.",
        futureIns: "Su evolución apunta a la siembra de legados duraderos. Reservar espacios conscientes para la escucha pasiva agudizará su inteligencia relacional, convirtiendo a un jefe fuerte en un líder verdaderamente inspirador."
      }
    },
    {
      id: "profile-triangle",
      name: "Yuki (El Catalizador Visionario)",
      description: "Rostro de triángulo invertido (corazón), gran amplitud temporal y receptores estrechos y analíticos.",
      gender: "other",
      imagePlaceholder: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Trígono (Corazón)",
        overallType: "Concentrado-Sensible (Retraído/Reflexivo)",
        temperament: "Melancólico-Colérico",
        zones: {
          intellectual: {
            score: 90,
            interpretation: "Un sector cerebral expandido y de gran anchura en las sienes. Yuki procesa ideas de forma hiperveloz, orientándose de forma natural a la innovación de sistemas y a la síntesis conceptual de vanguardia."
          },
          emotional: {
            score: 65,
            interpretation: "Los pómulos son moderados y el rostro se estrecha progresivamente. La conexión afectiva es muy selectiva e inteligente, procesando las emociones a través de filtros reflexivos de alto estándar estético."
          },
          instinctive: {
            score: 45,
            interpretation: "Un mentón estrecho y puntiagudo con una mandíbula ligera. Consume pocas reservas biológicas básicas, prefiriendo canalizar su energía a través de una alta vivacidad intelectual y nerviosa."
          }
        },
        features: {
          eyes: {
            style: "Expresivos y de inclinación ascendente",
            interpretation: "Los párpados afinados con ángulo marcado demuestran una gran precisión cognitiva y agudeza analítica. Yuki es capaz de percibir con suma rapidez las fallas lógicas o las asimetrías de diseño."
          },
          nose: {
            style: "Estrecha con punta delicada y perfilada",
            interpretation: "Refleja un filtro emocional sumamente selectivo y depurado. Busca intercambios de alto valor y autenticidad en lugar de conexiones de carácter superficial, necesitando calma para recargar energías."
          },
          mouthAndJaw: {
            style: "Labios finos y rígidos con mentón en punta",
            interpretation: "Una boca que denota prudencia verbal e introspección a la hora de compartir sus planes. El mentón cónico confirma que las dinámicas de exploración mental priman sobre la búsqueda de posesiones materiales."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 36, y: 16 },
          { label: "Forehead Right", x: 64, y: 16 },
          { label: "Left Eye", x: 41, y: 39 },
          { label: "Right Eye", x: 59, y: 39 },
          { label: "Nose Tip", x: 50, y: 53 },
          { label: "Left Cheekbone", x: 35, y: 55 },
          { label: "Right Cheekbone", x: 65, y: 55 },
          { label: "Mouth Left", x: 45, y: 71 },
          { label: "Mouth Right", x: 55, y: 71 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Foco sistemático sobresaliente, precisión crítica excepcional y gran originalidad conceptual y artística.",
          "Capacidad innata para detectar patrones, ineficiencias intangibles y proponer rediseños de vanguardia.",
          "Inmensa resistencia para el trabajo solitario y la investigación detallada en entornos de alta exigencia mental."
        ],
        growthAreas: [
          "Inclinación al perfeccionismo excesivo, lo que puede elevar las cuotas de autoexigencia y retrasar el lanzamiento de obras.",
          "Fatiga física acelerada ante entornos de sobreestimulación acústica o ante labores operacionales de carácter caótico.",
          "Tendencia a racionalizar las dinámicas sentimentales en lugar de vivirlas con espontaneidad pura."
        ],
        pastIns: "Su delicado mentón y su amplia frente revelan una juventud donde se incentivó profundamente la vida mental, el estudio, la lectura analítica y el desarrollo de pautas reflexivas.",
        presentIns: "La piel firme de su frente y sus ojos resplandecientes indican un presente de gran actividad intelectual y síntesis constructiva, que requiere cuidar conscientemente las horas de reposo profundo.",
        futureIns: "Al nutrir de manera activa su zona baja (mediante ejercicios físicos, respiración rítmica y manualidades tangibles), Yuki materializará con un orden asombroso sus ideas visionarias en obras sólidas."
      }
    },
    {
      id: "profile-trapezoid",
      name: "Carlos (El Constructor Dinámico)",
      description: "Rostro trapezoidal muy enraizado en su base, mejillas amplias con pómulos firmes y mirada de gran cercanía.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Trapezoide / Pera",
        overallType: "Dilatado-Tónico (Activo/Expansivo)",
        temperament: "Sanguíneo-Flemático",
        zones: {
          intellectual: {
            score: 55,
            interpretation: "Frente de dimensiones más reducidas y compactas, eminentemente práctica. Carlos aprende haciendo, mostrando un gran sentido común, enfoque empírico y gusto por los resultados tangibles."
          },
          emotional: {
            score: 80,
            interpretation: "Una zona media excepcionalmente amplia con pómulos prominentes y firmes. Carlos teje lazos amigables y de alta lealtad, encontrando su plenitud en el bienestar comunitario y el espíritu de equipo."
          },
          instinctive: {
            score: 85,
            interpretation: "Una base mandibular robusta y un mentón de gran presencia ósea. Es un constructor físico con gran empuje y vitalidad corporal, afín a los oficios prácticos, al contacto con la naturaleza y a la solidez."
          }
        },
        features: {
          eyes: {
            style: "Redondeados, amigables y abiertos",
            interpretation: "Ojos muy expresivos que invitan a la confidencia y desbordan cordialidad. Absorbe las vibraciones sociales de manera transparente, logrando que sus colaboradores se sientan apreciados y cómodos."
          },
          nose: {
            style: "Ancha y con alas nasales tónicas y abiertas",
            interpretation: "Nariz con raíces sólidas que muestra una gran asimilación de energía vital y afectiva. Carlos es directo, generoso y maneja de forma saludable los desacuerdos diarios gracias a una alta resiliencia."
          },
          mouthAndJaw: {
            style: "Labios carnosos con mentón ancho y poderoso",
            interpretation: "Una boca de amplios trazados que refleja entusiasmo por la comunicación abierta, la expresión oral y el disfrute. Su mentón ancho le dota de una duradera base motora para el esfuerzo continuo."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 44, y: 25 },
          { label: "Forehead Right", x: 56, y: 25 },
          { label: "Left Eye", x: 42, y: 42 },
          { label: "Right Eye", x: 58, y: 42 },
          { label: "Nose Tip", x: 50, y: 57 },
          { label: "Left Cheekbone", x: 32, y: 59 },
          { label: "Right Cheekbone", x: 68, y: 59 },
          { label: "Mouth Left", x: 42, y: 73 },
          { label: "Mouth Right", x: 58, y: 73 },
          { label: "Chin Point", x: 50, y: 88 }
        ],
        strengths: [
          "Inteligencia social empática y carismática que estabiliza la armonía de los equipos de trabajo.",
          "Sabiduría pragmática muy desarrollada, alta vitalidad corporal y resistencia excepcional.",
          "Enorme resiliencia emocional, manteniendo un enfoque constructivo incluso en situaciones apremiantes."
        ],
        growthAreas: [
          "Dificultad inicial frente a visiones abstractas de carácter exclusivamente teórico que carecen de una vía de aplicación práctica.",
          "Tendencia a descuidar su propio descanso por priorizar el bienestar biológico y emocional de su entorno.",
          "Sutil rechazo a entablar conflictos que requieran posturas de carácter frío, combativo o puramente analítico."
        ],
        pastIns: "La amplitud progresiva y firmeza de su rostro denotan un entorno temprano o pautas familiares ligadas al trabajo directo con la materia, al deporte al aire libre y a la valoración del esfuerzo honesto.",
        presentIns: "Sus mejillas nutridas y líneas de sonrisa dibujadas reflejan un estado óptimo de intercambio afectivo activo, encontrando felicidad en coordinar o cuidar proyectos grupales.",
        futureIns: "Al potenciar de forma metódica su zona mental superior (mediante lectura estratégica, planificación rigurosa y diarios reflexivos), Carlos fusionará su asombrosa capacidad de ejecución con una mirada directiva insuperable, consolidándose como un mentor excepcional."
      }
    }
  ],
  en: [
    {
      id: "profile-oval",
      name: "Elena (Receptive Intuitive)",
      description: "Oval face structure with dominant cerebral zone, bright, open eyes and harmonious proportions.",
      gender: "female",
      imagePlaceholder: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Oval",
        overallType: "Dilated (Open & Receptive)",
        temperament: "Sanguine-Melancholic",
        zones: {
          intellectual: {
            score: 85,
            interpretation: "A high, rounded forehead with clear temples points to a dominant cerebral sector. Thoughts are processed with a fluid imagination, valuing abstract theories, design aesthetics, and deep reflection before leaping into action."
          },
          emotional: {
            score: 70,
            interpretation: "The middle zone is exceptionally balanced with subtly modeled cheekbones. Elena shows open social adaptability, with warm relational receptors and a natural empathy for her surroundings."
          },
          instinctive: {
            score: 55,
            interpretation: "A gentle jawline with a soft, rounded chin. Elena prioritizes mental exploration and relationship harmony over physical or material competition, acting when intellectually inspired."
          }
        },
        features: {
          eyes: {
            style: "Large, bright and receptive",
            interpretation: "The wide opening of her eyes indicates superb global receptivity. Elena absorbs visual stimuli with ease and is highly influenced by the aesthetic atmosphere of her environment."
          },
          nose: {
            style: "Straight and slender",
            interpretation: "Her straight profile symbolizes emotional equilibrium. She possesses healthy defense filters, maintaining warm yet firm boundaries without falling into direct confrontations."
          },
          mouthAndJaw: {
            style: "Well-defined lips with a soft chin",
            interpretation: "A relaxed mouth with gently curved lips indicates fluid communication and physical sensitivity. The rounded chin prioritizes peaceful assimilation over material conflicts."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 42, y: 18 },
          { label: "Forehead Right", x: 58, y: 18 },
          { label: "Left Eye", x: 41, y: 38 },
          { label: "Right Eye", x: 59, y: 38 },
          { label: "Nose Tip", x: 50, y: 52 },
          { label: "Left Cheekbone", x: 34, y: 54 },
          { label: "Right Cheekbone", x: 66, y: 54 },
          { label: "Mouth Left", x: 44, y: 70 },
          { label: "Mouth Right", x: 56, y: 70 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Outstanding emotional intelligence and deep empathy for group dynamics.",
          "Exceptional conceptual thinking, imaginative visualization, and innovative problem solving.",
          "High-fluency verbal communication style that naturally bridges and inspires communities."
        ],
        growthAreas: [
          "Vulnerability to sensory overload due to highly dilated, welcoming receptors.",
          "Tendency to procrastinate material execution when mental models still feel incomplete.",
          "Difficulty saying 'no' to social demands on her time and energy."
        ],
        pastIns: "Her balanced skeletal baseline suggests a peaceful early environment that fostered free creative expression and curiosity. Open receptors reflect an active childhood where exploration was rewarded.",
        presentIns: "Active facial muscle tone and warm expression show valuable social engagement, though subtle fatigue lines in the temple area suggest a need for introspection and quiet restoration.",
        futureIns: "Elena naturally advances toward compassionate leadership, teaching, or expert consultancy. By grounding her conceptual ideals in structured routines, her warmth will reach its peak."
      }
    },
    {
      id: "profile-square",
      name: "Marcus (The Firm Executive)",
      description: "Broad, square jawline, strong bony structure, and highly protected, selective features.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Square",
        overallType: "Concentrated-Tonic (Active & Selective)",
        temperament: "Choleric-Phlegmatic",
        zones: {
          intellectual: {
            score: 60,
            interpretation: "Flat and compact forehead pointing to pragmatic, structured, and instrumental thinking. Marcus excels in logical sequences, systems structure, and hard field implementation."
          },
          emotional: {
            score: 55,
            interpretation: "A protective middle face profile. Solid cheekbones and nested eyes indicate highly selective emotional exchanges, based on loyalty and shared principles."
          },
          instinctive: {
            score: 90,
            interpretation: "A broad, powerful jawline with a firm, straight chin. Indicates immense physical endurance, persistence, practical realism, and a natural drive to safeguard his limits."
          }
        },
        features: {
          eyes: {
            style: "Focused and deep-set",
            interpretation: "Protected sockets and focused eyes reveal a highly selective analyst. He filters external information strictly before allowing any influence inside."
          },
          nose: {
            style: "Firm nasal pyramid with robust bridge",
            interpretation: "His strong nose structure shows excellent psychological independence. He maintains strong boundaries, defending his team and convictions with absolute resolve."
          },
          mouthAndJaw: {
            style: "Tonic lips with broad, square jaw",
            interpretation: "Firm closure of the lips represents determination and control. Marcus has an amazing capacity for physical perseverance and continuous performance under high pressure."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 39, y: 22 },
          { label: "Forehead Right", x: 61, y: 22 },
          { label: "Left Eye", x: 42, y: 41 },
          { label: "Right Eye", x: 58, y: 41 },
          { label: "Nose Tip", x: 50, y: 55 },
          { label: "Left Cheekbone", x: 33, y: 56 },
          { label: "Right Cheekbone", x: 67, y: 56 },
          { label: "Mouth Left", x: 43, y: 72 },
          { label: "Mouth Right", x: 57, y: 72 },
          { label: "Chin Point", x: 50, y: 86 }
        ],
        strengths: [
          "Unwavering perseverance, absolute reliability, and decisive leadership during crises.",
          "Superb pragmatic ability to simplify complex situations into straightforward action plans.",
          "Extremely clear boundaries that bring order, stability, and security to his projects."
        ],
        growthAreas: [
          "Risk of mental rigidity or resistance to quick changes when dealing with chaotic environments.",
          "Tendency to hide or suppress emotional fatigue behind an armor of duty and compliance.",
          "May initialy be perceived as cold or overly strict by individuals with more sensitive temperaments."
        ],
        pastIns: "His solid osseous frame suggests an early childhood that demanded resilience, taking on responsibilities, and learning focused on perseverance and self-defense.",
        presentIns: "Active tension in the master muscles of the jaw reflects a period of intense professional focus, driving complex physical processes with maximum duty.",
        futureIns: "His evolution points to building lasting legacies. Actively dedicating spaces for quiet, passive listening will enhance his emotional intelligence, turning a tough manager into a truly inspiring leader."
      }
    },
    {
      id: "profile-triangle",
      name: "Yuki (The Visionary Catalyst)",
      description: "Inverted triangular face shape, broad temporal width, and deep analytical, focused receptors.",
      gender: "other",
      imagePlaceholder: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Triangle (Heart)",
        overallType: "Concentrated-Sensitive (Reflective/Retracted)",
        temperament: "Melancholic-Choleric",
        zones: {
          intellectual: {
            score: 90,
            interpretation: "An expanded cerebral zone with great temple width. Yuki processes ideas at lightspeed, naturally focusing on system innovations and high-concept creative synthesis."
          },
          emotional: {
            score: 65,
            interpretation: "Moderate cheekbones with a face tapering downward. Emotional connections are selective and intelligent, processing feelings through rigorous artistic filters."
          },
          instinctive: {
            score: 45,
            interpretation: "A narrow, pointed chin with a lighter jawline. Yuki consumes low physical reserves, preferring to channel energy through quick intellectual and mental activities."
          }
        },
        features: {
          eyes: {
            style: "Expressive with upward inclination",
            interpretation: "Sharp eyelids with a marked angle show high cognitive precision and analytical focus. Yuki quickly identifies logical gaps or architectural design flaws."
          },
          nose: {
            style: "Narrow with a delicate, sharp-pointed tip",
            interpretation: "Reflects a highly selective emotional filter. Prefers deep, authentic, high-value connections over superficial social gatherings, needing quiet to recharge."
          },
          mouthAndJaw: {
            style: "Fine, rigid lips with a pointed chin",
            interpretation: "A mouth indicating verbal caution and introspection before sharing core plans. The conical chin confirms mental exploration rules over material capture."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 36, y: 16 },
          { label: "Forehead Right", x: 64, y: 16 },
          { label: "Left Eye", x: 41, y: 39 },
          { label: "Right Eye", x: 59, y: 39 },
          { label: "Nose Tip", x: 50, y: 53 },
          { label: "Left Cheekbone", x: 35, y: 55 },
          { label: "Right Cheekbone", x: 65, y: 55 },
          { label: "Mouth Left", x: 45, y: 71 },
          { label: "Mouth Right", x: 55, y: 71 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Outstanding systematic focus, exceptional critical precision, and deep artistic originality.",
          "Innate capability to map patterns, intangible gaps, and propose cutting-edge redesigns.",
          "Incredible stamina for isolated research and detailed projects under high cognitive demand."
        ],
        growthAreas: [
          "Prone to intense perfectionism, which can elevate self-criticism and delay the launch of projects.",
          "Fast physical exhaustion under high auditory noise or chaotic manual/operative tasks.",
          "Tendency to analyze emotional dynamics theoretically instead of experiencing them with warm spontaneity."
        ],
        pastIns: "A delicate chin and expansive forehead reveal a youth that deeply encouraged mental growth, study, reading, and structured logical thinking.",
        presentIns: "Smooth forehead skin and active eye brightness indicate a present filled with active intellectual synthesis, requiring conscious sleep intervals.",
        futureIns: "By deliberately feeding the physical/vital zone (through breathing exercises, physical movement, and manual crafts), Yuki will solidify visionary concepts into robust realities."
      }
    },
    {
      id: "profile-trapezoid",
      name: "Carlos (The Dynamic Builder)",
      description: "Trapezoidal outline firmly rooted at its base, wide cheeks, firm bones, and warm, close gaze.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Trapezoid / Pear",
        overallType: "Dilated-Tonic (Active & Open)",
        temperament: "Sanguine-Phlegmatic",
        zones: {
          intellectual: {
            score: 55,
            interpretation: "A compact, highly practical forehead. Carlos learns by doing, showing strong common sense, empiricism, and a taste for immediate, tangible results."
          },
          emotional: {
            score: 80,
            interpretation: "An exceptionally wide middle zone with prominent cheekbones. Carlos builds loyal, friendly bridges, finding happiness in community well-being and team spirit."
          },
          instinctive: {
            score: 85,
            interpretation: "A massive, robust jaw base and powerful chin. A material creator with great body stamina, aligned with mechanical arts, nature, and solid execution."
          }
        },
        features: {
          eyes: {
            style: "Round, friendly and wide open",
            interpretation: "Highly expressive eyes that build trust and overflow with warmth. He absorbs social dynamics directly, making his team feel respected and valued instantly."
          },
          nose: {
            style: "Broad with wide, active nostrils",
            interpretation: "A nose with solid roots reflecting high vital and affection absorption. Carlos is honest, generous, and resolves conflicts constructively thanks to immense resilience."
          },
          mouthAndJaw: {
            style: "Fleshy lips with a broad, powerful chin",
            interpretation: "A large mouth demonstrating enthusiasm for open debate, oral sharing, and enjoyment. His wide jaw gives him a durable motor base for endless efforts."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 44, y: 25 },
          { label: "Forehead Right", x: 56, y: 25 },
          { label: "Left Eye", x: 42, y: 42 },
          { label: "Right Eye", x: 58, y: 42 },
          { label: "Nose Tip", x: 50, y: 57 },
          { label: "Left Cheekbone", x: 32, y: 59 },
          { label: "Right Cheekbone", x: 68, y: 59 },
          { label: "Mouth Left", x: 42, y: 73 },
          { label: "Mouth Right", x: 58, y: 73 },
          { label: "Chin Point", x: 50, y: 88 }
        ],
        strengths: [
          "Empathetic, charismatic social intelligence that stabilizes team harmony.",
          "Superb practical wisdom, immense bodily energy, and outstanding physical stamina.",
          "Enormous emotional resilience, always maintaining a constructive layout in pressure situations."
        ],
        growthAreas: [
          "Initial difficulty dealing with highly abstract ideas that lack any practical physical translation.",
          "Prone to neglecting his own rest needs to prioritize the material and emotional comfort of others.",
          "Subtle rejection of engaging in conflicts that require rigid, cold, or purely calculating positions."
        ],
        pastIns: "The step-by-step widening of his face points to early roots in physical work, outdoor sports, and a deep appreciation for honest, raw effort.",
        presentIns: "Plump cheeks and prominent laughter lines reveal great emotional exchange and happiness in leading or safeguarding group efforts.",
        futureIns: "By methodically training his upper zone (through strategic reading, detailed planning, and journals), Carlos will merge practical execution with managerial foresight, becoming a standout mentor."
      }
    }
  ],
  fr: [
    {
      id: "profile-oval",
      name: "Elena (L'Intuition Réceptive)",
      description: "Visage ovalisé avec zone cérébrale dominante, yeux clairs et ouverts, et proportions d'une grande harmonie.",
      gender: "female",
      imagePlaceholder: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Ovale",
        overallType: "Dilaté (Ouvert/Réceptif)",
        temperament: "Sanguin-Mélancolique",
        zones: {
          intellectual: {
            score: 85,
            interpretation: "Un front haut et arrondi avec des tempes dégagées indique un secteur cérébral dominant. Les pensées sont traitées avec une imagination fluide, privilégiant les idées abstraites, l'esthétique et la réflexion profonde avant d'agir."
          },
          emotional: {
            score: 70,
            interpretation: "La zone médiane est très équilibrée avec des pommettes subtilement modelées. Elena fait preuve d'une adaptabilité sociale ouverte, avec des récepteurs relationnels chaleureux et une empathie naturelle."
          },
          instinctive: {
            score: 55,
            interpretation: "Une ligne mandibulaire douce et un menton arrondi. Elena priorise l'exploration mentale et l'harmonie relationnelle au détriment de la compétition physique ou matérielle, agissant sous l'inspiration intellectuelle."
          }
        },
        features: {
          eyes: {
            style: "Grands, lumineux et réceptifs",
            interpretation: "La large ouverture de ses yeux indique une magnifique réceptivité globale. Elena perçoit les stimuli visuels et sensoriels avec facilité, se laissant influencer positivement par l'ambiance et l'esthétique."
          },
          nose: {
            style: "Rectiligne et élancé",
            interpretation: "Le nez droit symbolise un ferme équilibre émotionnel. Elena possède des filtres de défense sains, maintenant des limites amicales mais fermes sans jamais tomber dans la confrontation directe."
          },
          mouthAndJaw: {
            style: "Lèvres bien dessinées avec menton doux",
            interpretation: "Une bouche détendue avec des lèvres doucement incurvées indique une communication fluide et une grande sensibilité physique. Le menton rond privilégie l'assimilation pacifique."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 42, y: 18 },
          { label: "Forehead Right", x: 58, y: 18 },
          { label: "Left Eye", x: 41, y: 38 },
          { label: "Right Eye", x: 59, y: 38 },
          { label: "Nose Tip", x: 50, y: 52 },
          { label: "Left Cheekbone", x: 34, y: 54 },
          { label: "Right Cheekbone", x: 66, y: 54 },
          { label: "Mouth Left", x: 44, y: 70 },
          { label: "Mouth Right", x: 56, y: 70 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Magnifique intelligence émotionnelle et empathie profonde envers les dynamiques de groupe.",
          "Pensée conceptuelle exceptionnelle, visualisation créative et résolution innovante.",
          "Style de communication verbale d'une grande fluidité qui unit et inspire naturellement sa communauté."
        ],
        growthAreas: [
          "Vulnérabilité à la surcharge sensorielle due à des récepteurs hautement dilatés et ouverts.",
          "Tendance à reporter l'exécution matérielle ou physique lorsque les concepts mentaux semblent incomplets.",
          "Difficulté à dire 'non' devant les exigences constantes de son entourage."
        ],
        pastIns: "Sa structure osseuse équilibrée suggère un environnement précoce paisible qui a favorisé la libre expression créatrice. Ses récepteurs ouverts reflètent une enfance où la curiosité a été récompensée.",
        presentIns: "Le tonus des muscles faciaux et son expression chaleureuse indiquent une participation sociale active, bien que de légers signes de fatigue suggèrent un besoin de solitude reconstructrice.",
        futureIns: "Elena progresse avec naturel vers un leadership empathique, l'enseignement ou le conseil d'expert. En ancrant ses idéaux dans des routines régulières, sa chaleur innée s'épanouira pleinement."
      }
    },
    {
      id: "profile-square",
      name: "Marcus (Le Cadre Ferme)",
      description: "Mâchoire large et carrée, structure osseuse vigoureuse et récepteurs concentrés et protecteurs.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Carré",
        overallType: "Concentré-Tonique (Actif/Sélectif)",
        temperament: "Colérique-Flegmatique",
        zones: {
          intellectual: {
            score: 60,
            interpretation: "Front large et compact, indiquant une pensée pragmatique, structurelle et opérationnelle. Marcus excelle dans les systèmes logiques et l'exécution rigoureuse sur le terrain."
          },
          emotional: {
            score: 55,
            interpretation: "Un profil facial très protecteur. Ses pommettes robustes et ses yeux concentrés dénotent des échanges affectifs très sélectifs, fondés sur une loyauté absolue."
          },
          instinctive: {
            score: 90,
            interpretation: "Une mâchoire large de grande présence osseuse avec un menton ferme. Indique une immense endurance physique, de la persévérance et un instinct naturel pour protéger ses limites."
          }
        },
        features: {
          eyes: {
            style: "Focalisés et profonds",
            interpretation: "Des orbites protégées et des yeux profonds révèlent un observateur analytique très sélectif. Il filtre rigoureusement l'information avant de l'assimiler."
          },
          nose: {
            style: "Pyramide nasale ferme avec arête structurée",
            interpretation: "Sa forte structure nasale montre une indépendance psychologique remarquable. Il possède un bouclier affectif protecteur, défendant ses convictions avec force."
          },
          mouthAndJaw: {
            style: "Lèvres toniques avec mâchoire large et carrée",
            interpretation: "La fermeture ferme des lèvres représente une grande détermination. Marcus possède une capacité incroyable de persévérance et de travail sous pression."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 39, y: 22 },
          { label: "Forehead Right", x: 61, y: 22 },
          { label: "Left Eye", x: 42, y: 41 },
          { label: "Right Eye", x: 58, y: 41 },
          { label: "Nose Tip", x: 50, y: 55 },
          { label: "Left Cheekbone", x: 33, y: 56 },
          { label: "Right Cheekbone", x: 67, y: 56 },
          { label: "Mouth Left", x: 43, y: 72 },
          { label: "Mouth Right", x: 57, y: 72 },
          { label: "Chin Point", x: 50, y: 86 }
        ],
        strengths: [
          "Persévérance inébranlable, fiabilité absolue et leadership résolutif face aux crises.",
          "Capacité pragmatique inégalable à simplifier les problèmes complexes en plans d'action directs.",
          "Limites professionnelles très claires qui créent ordre et sécurité totale pour ses projets."
        ],
        growthAreas: [
          "Risque de rigidité d'adaptation devant les virages hâtifs imposés par les environnements chaotiques.",
          "Tendance à cacher la fatigue émotionnelle cumulative sous l'armure du devoir et de l'obligation.",
          "Peut être perçu initialement comme distant ou trop sévère par des personnes de sensibilité plus ouverte."
        ],
        pastIns: "Sa solide structure osseuse suggère une enfance ayant exigé une résilience précoce, une responsabilisation et un apprentissage axé sur l'effort soutenu.",
        presentIns: "La tension active de ses muscles mâcheurs témoigne d'une période d'intense focalisation professionnelle, guidant des processus complexes avec rigueur.",
        futureIns: "Son évolution s'oriente vers des legs durables. Se ménager des plages d'écoute passive adoucira son intelligence relationnelle, changeant un manager fort en un leader inspirant."
      }
    },
    {
      id: "profile-triangle",
      name: "Yuki (Le Catalyseur Visionnaire)",
      description: "Visage en triangle inversé (cœur), grande largeur temporale et récepteurs fins et analytiques.",
      gender: "other",
      imagePlaceholder: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Triangle (Cœur)",
        overallType: "Concentré-Sensible (Retiré/Réfléchi)",
        temperament: "Mélancolique-Colérique",
        zones: {
          intellectual: {
            score: 90,
            interpretation: "Un secteur cérébral élargi avec une grande largeur au niveau des tempes. Yuki traite les concepts à la vitesse de la lumière, se tournant naturellement vers l'innovation."
          },
          emotional: {
            score: 65,
            interpretation: "Des pommettes modérées et un visage qui s'affine vers le bas. La connexion affective est très sélective, filtrée à travers de hauts standards esthétiques."
          },
          instinctive: {
            score: 45,
            interpretation: "Un menton fin et pointu avec une mâchoire légère. Consomme peu de ressources biologiques basiques, préférant catalyser son énergie dans l'activité intellectuelle."
          }
        },
        features: {
          eyes: {
            style: "Expressifs avec inclinaison ascendante",
            interpretation: "Des paupières finement dessinées montrent une grande rigueur cognitive. Yuki perçoit instantanément les failles logiques de conception ou de structure."
          },
          nose: {
            style: "Étroit avec un bout fin et profilé",
            interpretation: "Révèle un bouclier affectif très affiné. Recherche des liens authentiques à haute valeur ajoutée plutôt que des contacts superficiels, nécessitant du calme pour récupérer."
          },
          mouthAndJaw: {
            style: "Lèvres fines et rigides avec menton pointu",
            interpretation: "Une bouche qui dénote une grande prudence verbale avant de livrer ses plans. Le menton conique montre que l'aventure intellectuelle prime sur les appétits matériels."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 36, y: 16 },
          { label: "Forehead Right", x: 64, y: 16 },
          { label: "Left Eye", x: 41, y: 39 },
          { label: "Right Eye", x: 59, y: 39 },
          { label: "Nose Tip", x: 50, y: 53 },
          { label: "Left Cheekbone", x: 35, y: 55 },
          { label: "Right Cheekbone", x: 65, y: 55 },
          { label: "Mouth Left", x: 45, y: 71 },
          { label: "Mouth Right", x: 55, y: 71 },
          { label: "Chin Point", x: 50, y: 84 }
        ],
        strengths: [
          "Focalisation systématique brillante, précision critique exceptionnelle et grande originalité artistique.",
          "Capacité innée à détecter les motifs, les inefficacités abstraites et de proposer des solutions de rupture.",
          "Grande endurance pour la recherche solitaire et détaillée dans des contextes de haute exigence mentale."
        ],
        growthAreas: [
          "Tendance à un perfectionnisme excessif qui élève les doutes et retarde l'aboutissement de ses travaux.",
          "Fatigue physique accélérée face au bruit ou aux tâches d'exécution manuelle chaotique.",
          "Propension à intellectualiser les dynamiques amoureuses plutôt que de les vivre avec spontanéité."
        ],
        pastIns: "Son menton délicat et son grand front révèlent une jeunesse axée sur le développement de l'esprit, l'étude, la lecture et l'esprit d'analyse.",
        presentIns: "Une peau lisse sur le front et des yeux pétillants indiquent un présent d'intense bouillonnement de synthèse, exigeant de préserver des cycles de sommeil.",
        futureIns: "En nourrissant activement sa zone basse (par des exercices de respiration, de la marche et du travail manuel), Yuki matérialisera ses concepts en œuvres solides."
      }
    },
    {
      id: "profile-trapezoid",
      name: "Carlos (Le Bâtisseur Dynamique)",
      description: "Visage trapézoïdal bien enraciné, joues pleines avec pommettes fermes et regard réconfortant.",
      gender: "male",
      imagePlaceholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
      mockResult: {
        faceShape: "Trapèze / Poire",
        overallType: "Dilaté-Tonique (Actif/Expansif)",
        temperament: "Sanguin-Flegmatique",
        zones: {
          intellectual: {
            score: 55,
            interpretation: "Front plus compact et ramassé, résolument pratique. Carlos apprend par l'action, montrant un solide bon sens et un goût pour les résultats palpables."
          },
          emotional: {
            score: 80,
            interpretation: "Une zone moyenne très généreuse avec des pommettes massives. Carlos tisse des liens d'une amitié loyale, s'épanouissant dans le bien-être collectif."
          },
          instinctive: {
            score: 85,
            interpretation: "Une mâchoire robuste et un menton puissant. C'est un constructeur doté d'une formidable énergie vitale, proche de la terre et des tâches matérielles."
          }
        },
        features: {
          eyes: {
            style: "Ronds, bienveillants et ouverts",
            interpretation: "Des yeux expressifs qui inspirent confiance et débordent de bonté. Il capte les ondes avec sérénité, sachant valoriser ses collaborateurs sans effort."
          },
          nose: {
            style: "Large avec narines toniques et ouvertes",
            interpretation: "Nez solidement ancré marquant une excellente assimilation vitale et affective. Carlos est sincère, généreux et gère bien les désaccords quotidiens."
          },
          mouthAndJaw: {
            style: "Lèvres charnues avec menton large et robuste",
            interpretation: "Une bouche généreuse reflétant un goût pour les débats ouverts et la convivialité. Sa mâchoire large lui offre une batterie d'endurance physique."
          }
        },
        landmarks: [
          { label: "Forehead Left", x: 44, y: 25 },
          { label: "Forehead Right", x: 56, y: 25 },
          { label: "Left Eye", x: 42, y: 42 },
          { label: "Right Eye", x: 58, y: 42 },
          { label: "Nose Tip", x: 50, y: 57 },
          { label: "Left Cheekbone", x: 32, y: 59 },
          { label: "Right Cheekbone", x: 68, y: 59 },
          { label: "Mouth Left", x: 42, y: 73 },
          { label: "Mouth Right", x: 58, y: 73 },
          { label: "Chin Point", x: 50, y: 88 }
        ],
        strengths: [
          "Intelligence sociale empalique et chaleureuse qui préserve l'harmonie des équipes.",
          "Sagesse pratique éprouvée, excellente vitalité corporelle et endurance.",
          "Immense résilience émotionnelle, sachant garder une attitude constructive sous la contrainte."
        ],
        growthAreas: [
          "Difficulté de départ face à des idées purement théoriques privées de toute application immédiate.",
          "Tendance à ignorer ses propres besoins physiques pour privilégier le confort de sa bande.",
          "Léger évitement des conflits qui réclament des arbitrages froids, analytiques ou stratégiques."
        ],
        pastIns: "La fermeté progressive de son visage évoque un passé axé sur l'effort concret de terrain, les sports de plein air et la valorisation du travail honnête.",
        presentIns: "Ses joues pleines et ses rides de rire marquées reflètent un cycle d'échange bienfaisant, trouvant sa joie à encadrer et soutenir les projets partagés.",
        futureIns: "En structurant sa zone intellectuelle (lecture stratégique, planification et carnets d'idées), Carlos combinera exécution solide et vision managériale pour devenir un mentor d'exception."
      }
    }
  ]
};
