<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PulseNews AI - El TikTok de las Noticias</title>
    <!-- Tailwind CSS para un diseño moderno y rápido -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons para iconos hermosos y limpios -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* Deshabilitar scrollbars pero mantener funcionalidad de scroll */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        /* Efecto de snap para simular deslizamiento de TikTok */
        .snap-y-mandatory {
            scroll-snap-type: y mandatory;
        }
        .snap-start {
            scroll-snap-align: start;
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col md:flex-row overflow-x-hidden">

    <!-- PANEL IZQUIERDO: Visualizador del Algoritmo de IA (Ocultable en móvil) -->
    <aside class="w-full md:w-96 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col gap-4 shrink-0">
        <div class="flex items-center gap-2">
            <div class="p-2 bg-red-500 rounded-lg animate-pulse">
                <i data-lucide="activity" class="w-6 h-6 text-white"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold tracking-tight">PulseNews <span class="text-red-500">AI</span></h1>
                <p class="text-xs text-slate-400">Algoritmo de recomendación en vivo</p>
            </div>
        </div>

        <!-- Buscador con Google Grounding -->
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-400">Rastrear la Web (Últimas 24h)</label>
            <div class="flex gap-2">
                <input id="search-input" type="text" placeholder="Ej. Lanzamiento espacial, tecnología..." class="w-full bg-slate-900 text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 text-slate-200">
                <button id="search-btn" class="bg-red-500 hover:bg-red-600 transition-colors px-3 py-2 rounded-lg text-white font-bold flex items-center justify-center">
                    <i data-lucide="search" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- Gráfico de intereses del algoritmo -->
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col gap-3">
            <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <i data-lucide="brain" class="w-4 h-4 text-purple-400"></i> Tu ADN de Intereses
            </h3>
            <div id="interests-container" class="flex flex-col gap-3">
                <!-- Se genera dinámicamente con JS -->
            </div>
        </div>

        <!-- Terminal de decisiones en tiempo real -->
        <div class="bg-black p-3 rounded-lg border border-slate-800 font-mono text-xs text-green-400 h-32 overflow-y-auto no-scrollbar" id="ai-logs">
            <p class="text-slate-500">[Sistema] Algoritmo iniciado...</p>
            <p class="text-slate-500">[Sistema] Esperando interacción del usuario...</p>
        </div>
    </aside>

    <!-- PANEL CENTRAL: El Feed de videos/noticias tipo TikTok -->
    <main class="flex-1 flex justify-center items-center p-2 md:p-6 relative">
        <!-- Contenedor del Celular Virtual -->
        <div class="w-full max-w-md h-[80vh] md:h-[85vh] bg-black rounded-[40px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
            <!-- Cámara frontal del celular (notch) -->
            <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-center">
                <div class="w-3 h-3 bg-slate-900 rounded-full"></div>
            </div>

            <!-- Feed Deslizable de Noticias -->
            <div id="feed-container" class="flex-1 overflow-y-auto snap-y-mandatory no-scrollbar h-full">
                <!-- Las tarjetas de noticias se inyectan aquí mediante JS -->
                <div class="h-full flex items-center justify-center text-slate-400">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                        <p class="text-sm">Sintonizando últimas noticias del mundo...</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- CAJÓN DESLIZABLE DE COMENTARIOS (Simula red social) -->
    <div id="comments-drawer" class="fixed inset-0 bg-black/60 z-50 hidden transition-opacity duration-300 flex items-end justify-center">
        <div class="bg-slate-900 w-full max-w-md rounded-t-3xl p-5 max-h-[70vh] flex flex-col transform translate-y-full transition-transform duration-300">
            <div class="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 cursor-pointer" onclick="toggleComments(false)"></div>
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg text-white">Comentarios (<span id="comment-count">0</span>)</h3>
                <button class="text-slate-400 hover:text-white" onclick="toggleComments(false)">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <!-- Lista de comentarios -->
            <div id="comments-list" class="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4 text-sm pr-1">
                <!-- Inyectado dinámicamente -->
            </div>

            <!-- Formulario de comentarios -->
            <div class="flex gap-2 border-t border-slate-800 pt-3">
                <input id="new-comment-input" type="text" placeholder="Añade un comentario..." class="flex-1 bg-slate-800 rounded-full px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500">
                <button id="send-comment-btn" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white font-bold text-sm">
                    Publicar
                </button>
            </div>
        </div>
    </div>

    <!-- LOGICA DE CONTROL DE LA APLICACIÓN -->
    <script>
        // --- 1. CONFIGURACIÓN DEL ESTADO DE LA APP ---
        let currentNews = [];
        let currentActiveIndex = 0;
        let lastScrollTime = Date.now();
        let audioPlayer = new Audio();
        let isPlayingAudio = false;

        // Pesos iniciales del algoritmo para el usuario (Equitativo al inicio)
        let userInterests = {
            "Tecnología": 1.0,
            "Ciencia": 1.0,
            "Deportes": 1.0,
            "Entretenimiento": 1.0,
            "Política": 1.0,
            "Economía": 1.0
        };

        // Noticias semilla (Por si falla la API o para carga inicial rápida)
        const seedNews = [
            {
                id: "seed-1",
                category: "Tecnología",
                title: "La Inteligencia Artificial revoluciona la creación de contenido",
                summary: "Una nueva generación de modelos multimodales permite generar código, audio y video interactivo en tiempo real con solo describirlo en lenguaje natural.",
                time: "Hace 2 horas",
                likes: 12500,
                comments: [
                    { author: "TechGuy_99", text: "¡Esto es una locura absoluta! El futuro llegó demasiado rápido." },
                    { author: "DevMarta", text: "Ya no programaremos, seremos directores de IA." }
                ],
                isLiked: false,
                isSaved: false
            },
            {
                id: "seed-2",
                category: "Ciencia",
                title: "Astrónomos detectan una señal de radio repetitiva a mil millones de años luz",
                summary: "El telescopio espacial capta una ráfaga rápida de radio con un patrón perfectamente rítmico. Científicos descartan origen artificial pero investigan su extraña fuente.",
                time: "Hace 5 horas",
                likes: 8400,
                comments: [
                    { author: "AstroFisica", text: "Probablemente sea un magnetar con una rotación sumamente estable." },
                    { author: "IWantToBelieve", text: "¿Nadie más está pensando en aliens?" }
                ],
                isLiked: false,
                isSaved: false
            },
            {
                id: "seed-3",
                category: "Deportes",
                title: "Final de infarto en la copa continental define al nuevo campeón",
                summary: "Con un gol de chilena en el minuto 94, los debutantes del torneo logran una hazaña histórica al coronarse campeones frente al gran favorito de la liga.",
                time: "Hace 8 horas",
                likes: 24100,
                comments: [
                    { author: "GolDeOro", text: "¡El mejor gol de la década sin ninguna duda!" },
                    { author: "HaterTranquilo", text: "Puro golpe de suerte, el rival dominó todo el juego." }
                ],
                isLiked: false,
                isSaved: false
            }
        ];

        // --- 2. MOTOR DEL ALGORITMO DE RECOMENDACIÓN (Estilo TikTok) ---
        function renderInterests() {
            const container = document.getElementById('interests-container');
            container.innerHTML = '';
            
            // Colores temáticos para cada categoría
            const colors = {
                "Tecnología": "bg-blue-500",
                "Ciencia": "bg-purple-500",
                "Deportes": "bg-green-500",
                "Entretenimiento": "bg-pink-500",
                "Política": "bg-amber-500",
                "Economía": "bg-emerald-500"
            };

            // Encontrar el valor más alto para normalizar las barras
            const values = Object.values(userInterests);
            const maxVal = Math.max(...values, 1.0);

            Object.entries(userInterests).forEach(([category, val]) => {
                const percentage = Math.min((val / maxVal) * 100, 100);
                
                const item = document.createElement('div');
                item.className = "flex flex-col gap-1";
                item.innerHTML = `
                    <div class="flex justify-between text-xs font-semibold">
                        <span>${category}</span>
                        <span class="text-slate-400">${val.toFixed(2)} pts</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="${colors[category] || 'bg-slate-500'} h-full transition-all duration-500" style="width: ${percentage}%"></div>
                    </div>
                `;
                container.appendChild(item);
            });
        }

        function logAI(message) {
            const logsContainer = document.getElementById('ai-logs');
            const newLog = document.createElement('p');
            newLog.className = "text-green-400";
            newLog.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
            logsContainer.appendChild(newLog);
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }

        // Al cambiar de noticia, analizamos cuánto tiempo se quedó el usuario
        function trackInteractions(prevIndex) {
            const now = Date.now();
            const timeSpent = (now - lastScrollTime) / 1000; // Segundos transcurridos
            lastScrollTime = now;

            if (prevIndex < 0 || prevIndex >= currentNews.length) return;
            const newsItem = currentNews[prevIndex];
            const category = newsItem.category;

            logAI(`Interacción detectada para: "${newsItem.title.substring(0, 20)}..."`);
            logAI(`Tiempo de permanencia: ${timeSpent.toFixed(1)} segundos.`);

            // Regla 1: SKIP RÁPIDO (Menos de 3 segundos es desinterés directo)
            if (timeSpent < 3) {
                userInterests[category] = Math.max(0.1, userInterests[category] - 0.3);
                logAI(`⬇️ Reduciendo interés en ${category} (-0.30) por salto rápido.`);
            } 
            // Regla 2: INTERÉS SANO (Entre 3 y 15 segundos)
            else if (timeSpent >= 3 && timeSpent < 15) {
                userInterests[category] += 0.2;
                logAI(`⬆️ Incrementando interés en ${category} (+0.20) por lectura moderada.`);
            } 
            // Regla 3: SÚPER ENGANCHE (Más de 15 segundos)
            else {
                userInterests[category] += 0.5;
                logAI(`🔥 ¡Gran enganche en ${category}! Aumentando peso (+0.50).`);
            }

            renderInterests();
            reorderFeedBasedOnInterests();
        }

        // Reordenar dinámicamente las noticias que quedan por leer según las preferencias del usuario
        function reorderFeedBasedOnInterests() {
            if (currentActiveIndex >= currentNews.length - 1) return;

            // Conservamos las noticias ya vistas en su posición original
            const viewedNews = currentNews.slice(0, currentActiveIndex + 1);
            const remainingNews = currentNews.slice(currentActiveIndex + 1);

            // Ordenamos las restantes de mayor a menor interés según los puntos actuales del usuario
            remainingNews.sort((a, b) => {
                const interestA = userInterests[a.category] || 0;
                const interestB = userInterests[b.category] || 0;
                return interestB - interestA;
            });

            // Combinamos las listas de nuevo
            currentNews = [...viewedNews, ...remainingNews];
            logAI(`🧬 Algoritmo recalculado. Próximo contenido adaptado.`);
        }

        // --- 3. CONECTIVIDAD CON LA API (Gemini Serverless) ---
        async function fetchNews(query = "") {
            logAI(`Buscando noticias reales de última hora en internet...`);
            try {
                const url = query ? `/api/get-news?query=${encodeURIComponent(query)}` : `/api/get-news`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("Error de conexión");
                const data = await response.json();
                
                if (data && data.length > 0) {
                    currentNews = data;
                    logAI(`¡Éxito! Se cargaron ${data.length} noticias reales optimizadas por IA.`);
                } else {
                    throw new Error("No se devolvieron noticias válidas");
                }
            } catch (err) {
                logAI(`⚠️ Error al conectar con el servidor. Cargando noticias locales semilla.`);
                currentNews = JSON.parse(JSON.stringify(seedNews)); // Copia profunda de las semillas
            }
            
            currentActiveIndex = 0;
            lastScrollTime = Date.now();
            renderFeed();
        }

        // --- 4. RENDERIZADO DEL FEED TIPO TIKTOK ---
        function renderFeed() {
            const feed = document.getElementById('feed-container');
            feed.innerHTML = '';

            if (currentNews.length === 0) {
                feed.innerHTML = `
                    <div class="h-full flex items-center justify-center text-slate-400">
                        <p class="text-sm">No hay noticias disponibles en este momento.</p>
                    </div>
                `;
                return;
            }

            currentNews.forEach((news, idx) => {
                const card = document.createElement('div');
                card.className = "h-full w-full shrink-0 snap-start relative flex flex-col justify-end p-6 bg-slate-950 border-b border-slate-900";
                
                // Color de fondo temático con degradado para simular un ambiente vivo
                const bgGradients = {
                    "Tecnología": "from-blue-950/70 via-slate-950 to-black",
                    "Ciencia": "from-purple-950/70 via-slate-950 to-black",
                    "Deportes": "from-green-950/70 via-slate-950 to-black",
                    "Entretenimiento": "from-pink-950/70 via-slate-950 to-black",
                    "Política": "from-amber-950/70 via-slate-950 to-black",
                    "Economía": "from-emerald-950/70 via-slate-950 to-black"
                };
                const gradient = bgGradients[news.category] || "from-slate-900 via-slate-950 to-black";

                card.innerHTML = `
                    <!-- Degradado dinámico de fondo -->
                    <div class="absolute inset-0 bg-gradient-to-t ${gradient} z-0"></div>

                    <!-- Contenido de la Noticia -->
                    <div class="relative z-10 flex flex-col gap-3 w-full pr-14 pb-4">
                        <!-- Categoría y Hora -->
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500 text-white">
                                ${news.category}
                            </span>
                            <span class="text-xs text-slate-400">${news.time || 'Hace poco'}</span>
                        </div>

                        <!-- Titular de la Noticia -->
                        <h2 class="text-xl font-bold leading-tight text-white tracking-tight drop-shadow-md">
                            ${news.title}
                        </h2>

                        <!-- Resumen dinámico -->
                        <p class="text-sm text-slate-300 leading-relaxed line-clamp-4">
                            ${news.summary}
                        </p>
                    </div>

                    <!-- BARRA LATERAL DE INTERACCIONES (Likes, comentarios, voz) -->
                    <div class="absolute right-4 bottom-10 z-10 flex flex-col items-center gap-5">
                        <!-- Botón de Like -->
                        <button onclick="handleLike(${idx})" class="group flex flex-col items-center gap-1 focus:outline-none">
                            <div class="w-12 h-12 rounded-full ${news.isLiked ? 'bg-red-500 text-white' : 'bg-slate-900/80 text-slate-300'} flex items-center justify-center border border-slate-800 backdrop-blur-md transition-all group-active:scale-90">
                                <i data-lucide="heart" class="w-6 h-6 ${news.isLiked ? 'fill-current' : ''}"></i>
                            </div>
                            <span class="text-xs font-semibold text-slate-400">${formatNumber(news.likes + (news.isLiked ? 1 : 0))}</span>
                        </button>

                        <!-- Botón de Comentarios -->
                        <button onclick="openComments(${idx})" class="group flex flex-col items-center gap-1 focus:outline-none">
                            <div class="w-12 h-12 rounded-full bg-slate-900/80 text-slate-300 flex items-center justify-center border border-slate-800 backdrop-blur-md transition-all group-active:scale-90">
                                <i data-lucide="message-circle" class="w-6 h-6"></i>
                            </div>
                            <span class="text-xs font-semibold text-slate-400">${news.comments ? news.comments.length : 0}</span>
                        </button>

                        <!-- Botón de Audio Lectura (IA TTS) -->
                        <button onclick="toggleAudio(${idx})" class="group flex flex-col items-center gap-1 focus:outline-none">
                            <div id="audio-btn-${idx}" class="w-12 h-12 rounded-full bg-slate-900/80 text-slate-300 flex items-center justify-center border border-slate-800 backdrop-blur-md transition-all group-active:scale-90">
                                <i data-lucide="volume-2" class="w-6 h-6"></i>
                            </div>
                            <span class="text-xs font-semibold text-slate-400">Escuchar</span>
                        </button>

                        <!-- Guardar Noticia -->
                        <button onclick="handleSave(${idx})" class="group flex flex-col items-center gap-1 focus:outline-none">
                            <div class="w-12 h-12 rounded-full ${news.isSaved ? 'bg-amber-500 text-white' : 'bg-slate-900/80 text-slate-300'} flex items-center justify-center border border-slate-800 backdrop-blur-md transition-all group-active:scale-90">
                                <i data-lucide="bookmark" class="w-6 h-6 ${news.isSaved ? 'fill-current' : ''}"></i>
                            </div>
                        </button>
                    </div>
                `;
                feed.appendChild(card);
            });

            // Re-inicializar iconos de Lucide cargados dinámicamente
            lucide.createIcons();
            setupScrollTracking();
        }

        // --- 5. INTERACCIONES DE USUARIO ---
        function formatNumber(num) {
            return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
        }

        function handleLike(index) {
            const news = currentNews[index];
            news.isLiked = !news.isLiked;
            
            // Recompensa del algoritmo: Dar like aumenta sustancialmente el peso
            if (news.isLiked) {
                userInterests[news.category] += 0.4;
                logAI(`💖 Le diste Me Gusta a una noticia de ${news.category}. Subiendo interés (+0.40).`);
            } else {
                userInterests[news.category] = Math.max(0.1, userInterests[news.category] - 0.4);
                logAI(`💔 Quitaste Me Gusta a ${news.category}. Reduciendo peso (-0.40).`);
            }
            renderInterests();
            renderFeed();
            // Mantener el scroll en su posición actual para evitar saltos molestos
            scrollToIndex(index);
        }

        function handleSave(index) {
            const news = currentNews[index];
            news.isSaved = !news.isSaved;

            if (news.isSaved) {
                userInterests[news.category] += 0.3;
                logAI(`💾 Noticia guardada. Fortaleciendo afinidad con ${news.category} (+0.30).`);
            }
            renderInterests();
            renderFeed();
            scrollToIndex(index);
        }

        // --- 6. SISTEMA DE AUDIO INTELIGENTE (TTS) ---
        async function toggleAudio(index) {
            const news = currentNews[index];
            const btn = document.getElementById(`audio-btn-${index}`);

            if (isPlayingAudio) {
                audioPlayer.pause();
                isPlayingAudio = false;
                btn.innerHTML = `<i data-lucide="volume-2" class="w-6 h-6"></i>`;
                lucide.createIcons();
                logAI(`Lectura de voz pausada.`);
                return;
            }

            logAI(`Iniciando locución de la noticia con IA de voz de Google...`);
            btn.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>`;

            try {
                // Solicitamos el archivo de audio procesado al backend
                const response = await fetch(`/api/get-audio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: `Categoría: ${news.category}. Titular: ${news.title}. Resumen: ${news.summary}` })
                });

                if (!response.ok) throw new Error("Fallo en generación de voz");
                
                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);
                
                audioPlayer.src = audioUrl;
                audioPlayer.play();
                isPlayingAudio = true;
                
                btn.innerHTML = `<i data-lucide="volume-x" class="w-6 h-6 text-red-500"></i>`;
                lucide.createIcons();
                logAI(`🔊 Reproduciendo audio de la noticia.`);

                audioPlayer.onended = () => {
                    isPlayingAudio = false;
                    btn.innerHTML = `<i data-lucide="volume-2" class="w-6 h-6"></i>`;
                    lucide.createIcons();
                    logAI(`Locución finalizada.`);
                };

            } catch (err) {
                logAI(`⚠️ Error al generar audio. Usando lector nativo del dispositivo.`);
                // Alternativa nativa en caso de fallo de red
                const utterance = new SpeechSynthesisUtterance(`${news.title}. ${news.summary}`);
                utterance.lang = 'es-ES';
                window.speechSynthesis.speak(utterance);
                
                btn.innerHTML = `<i data-lucide="volume-x" class="w-6 h-6 text-red-500"></i>`;
                lucide.createIcons();
                isPlayingAudio = true;

                utterance.onend = () => {
                    isPlayingAudio = false;
                    btn.innerHTML = `<i data-lucide="volume-2" class="w-6 h-6"></i>`;
                    lucide.createIcons();
                };
            }
        }

        // --- 7. CONTROL DE COMENTARIOS ---
        let activeCommentNewsIndex = null;

        function openComments(index) {
            activeCommentNewsIndex = index;
            const news = currentNews[index];
            document.getElementById('comment-count').innerText = news.comments ? news.comments.length : 0;
            
            const list = document.getElementById('comments-list');
            list.innerHTML = '';

            if (news.comments && news.comments.length > 0) {
                news.comments.forEach(c => {
                    const el = document.createElement('div');
                    el.className = "bg-slate-800 p-3 rounded-xl flex flex-col gap-1";
                    el.innerHTML = `
                        <span class="font-bold text-xs text-red-400">@${c.author}</span>
                        <p class="text-slate-200 text-sm">${c.text}</p>
                    `;
                    list.appendChild(el);
                });
            } else {
                list.innerHTML = `<p class="text-slate-500 text-center py-6">No hay comentarios. ¡Sé el primero!</p>`;
            }

            toggleComments(true);
        }

        function toggleComments(show) {
            const drawer = document.getElementById('comments-drawer');
            const inner = drawer.firstElementChild;
            if (show) {
                drawer.classList.remove('hidden');
                setTimeout(() => {
                    inner.classList.remove('translate-y-full');
                }, 10);
            } else {
                inner.classList.add('translate-y-full');
                setTimeout(() => {
                    drawer.classList.add('hidden');
                }, 300);
            }
        }

        document.getElementById('send-comment-btn').addEventListener('click', () => {
            const input = document.getElementById('new-comment-input');
            const text = input.value.trim();
            if (!text || activeCommentNewsIndex === null) return;

            const news = currentNews[activeCommentNewsIndex];
            if (!news.comments) news.comments = [];
            
            news.comments.push({
                author: "Tú",
                text: text
            });

            // Guardar comentario premia la categoría
            userInterests[news.category] += 0.3;
            logAI(`💬 Comentaste en ${news.category}. Subiendo interés (+0.30).`);

            input.value = '';
            openComments(activeCommentNewsIndex);
            renderInterests();
            renderFeed();
        });

        // --- 8. DETECCIÓN DE SCROLL (Gesto de TikTok) ---
        function setupScrollTracking() {
            const feed = document.getElementById('feed-container');
            let isScrolling;

            feed.removeEventListener('scroll', handleScrollDebounce);
            feed.addEventListener('scroll', handleScrollDebounce);
        }

        function handleScrollDebounce() {
            const feed = document.getElementById('feed-container');
            const cardHeight = feed.clientHeight;
            const newIndex = Math.round(feed.scrollTop / cardHeight);

            if (newIndex !== currentActiveIndex && newIndex >= 0 && newIndex < currentNews.length) {
                // Detener cualquier audio que se esté reproduciendo
                if (isPlayingAudio) {
                    audioPlayer.pause();
                    isPlayingAudio = false;
                }
                
                trackInteractions(currentActiveIndex);
                currentActiveIndex = newIndex;
            }
        }

        function scrollToIndex(index) {
            const feed = document.getElementById('feed-container');
            const cardHeight = feed.clientHeight;
            feed.scrollTo({
                top: index * cardHeight,
                behavior: 'smooth'
            });
        }

        // --- 9. BÚSQUEDA INTEGRADA CON GOOGLE GROUNDING ---
        document.getElementById('search-btn').addEventListener('click', () => {
            const input = document.getElementById('search-input');
            const query = input.value.trim();
            fetchNews(query);
        });

        // --- 10. INICIALIZACIÓN DE LA APLICACIÓN ---
        window.onload = () => {
            lucide.createIcons();
            renderInterests();
            fetchNews(); // Carga las noticias iniciales reales
        };
    </script>
</body>
</html>
