const CACHE_NAME = 'pizza-master-v4-cache-fix';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.js',
  '/manifest.json',
  
  // Módulos de Interface
  '/modulos/login.js',
  '/modulos/dashboard.js',
  '/modulos/massa.js',
  '/modulos/sacolao.js',
  '/modulos/insumos.js',
  '/modulos/gelo.js',
  '/modulos/limpeza.js',
  '/modulos/historico.js',
  '/modulos/erros.js',

  // Módulos de IA
  '/modulos/ia.js',
  '/modulos/ia_equipe.js',
  '/modulos/ia_calendario.js',
  '/modulos/ia_clima.js',
  '/modulos/ia_massa.js',
  '/modulos/ia_sacolao.js',
  '/modulos/ia_limpeza.js',
  '/modulos/ia_insumos.js',
  '/modulos/ia_memoria.js',
  '/modulos/ia_checklist.js',
  '/modulos/execucao_checklist.js',
  '/modulos/ia_resolucao.js',

  // Módulos de Ajustes
  '/modulos/ajustes.js',
  '/modulos/ajustes_perfil.js',
  '/modulos/ajustes_loja.js',
  '/modulos/ajustes_equipe.js',
  '/modulos/gestao_produtos.js',
  '/modulos/ajustes_sugestoes.js',
  '/modulos/ajustes_avisos.js',
  '/modulos/ajustes_ajuda.js',
  '/modulos/ajustes_rotas.js',
  '/modulos/logs_sistema.js',
  '/modulos/ajustes_checklists.js',
  '/modulos/tutorial_system.js',

  // CDNs Externos (Cache First para velocidade)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
];

// Instalação: Baixa os arquivos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Baixando arquivos para o celular...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação: Serve do cache se tiver, senão busca na rede
self.addEventListener('fetch', (event) => {
  // Não cacheia chamadas para API do Gemini ou Firestore (dados dinâmicos)
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se encontrar
      if (response) {
        return response;
      }
      // Senão, busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Opcional: Cachear novas requisições dinamicamente (cuidado com dados sensíveis)
        return networkResponse;
      }).catch(() => {
        // Fallback offline (opcional)
      });
    })
  );
});
