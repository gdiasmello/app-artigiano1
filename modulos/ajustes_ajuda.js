/**
 * Ajuda v2.0.5
 */
Vue.component('tela-ajustes-ajuda', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: var(--cor-primaria);"><i class="fas fa-question-circle"></i> Central de Ajuda</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <div v-for="(secao, index) in ajuda" :key="secao.titulo" class="card" style="padding: 20px; border-left: 4px solid var(--cor-primaria);">
                <h4 @click="toggleSecao(index)" style="color: white; margin-top: 0; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <i :class="['fas', secao.icone]" :style="{ color: 'var(--cor-primaria)' }"></i>
                    {{ secao.titulo }}
                    <i :class="['fas', secao.expandido ? 'fa-chevron-up' : 'fa-chevron-down']" style="margin-left: auto; color: #AAA;"></i>
                </h4>
                
                <div v-if="secao.expandido" class="animate__animated animate__fadeIn" style="margin-top: 15px;">
                    <div v-for="item in secao.itens" :key="item.q" style="margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                        <strong style="color: #EEE; font-size: 0.95rem; display: block; margin-bottom: 5px;">{{ item.q }}</strong>
                        <p style="color: #888; font-size: 0.85rem; margin: 0; line-height: 1.5;">{{ item.a }}</p>
                    </div>
                </div>
            </div>

            <!-- Botão de Contato com Desenvolvedor -->
            <div class="card" style="padding: 25px; text-align: center; background: rgba(37, 211, 102, 0.05); border: 1px dashed #25D366;">
                <i class="fab fa-whatsapp" style="font-size: 3rem; color: #25D366; margin-bottom: 15px;"></i>
                <h3 style="color: white; margin-top: 0;">Ainda tem dúvidas?</h3>
                <p style="color: #AAA; margin-bottom: 20px;">Fale diretamente com o desenvolvedor do PiZZA Master para suporte técnico ou sugestões.</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button @click="contatarDesenvolvedor" class="btn" style="background: #25D366; color: white; font-weight: bold;">
                        <i class="fab fa-whatsapp"></i> FALAR COM O DESENVOLVEDOR
                    </button>

                    <button @click="$root.mudarTela('tela-ajustes-sugestoes')" class="btn" style="background: #1A1A1A; color: #FFD600; border: 1px solid #FFD600;">
                        <i class="fas fa-lightbulb"></i> RELATAR BUG OU SUGESTÃO
                    </button>

                    <button @click="$root.mostrarNovidades(true)" class="btn" style="background: #1A1A1A; color: #00E676; border: 1px solid #00E676;">
                        <i class="fas fa-star"></i> VER NOVIDADES DA VERSÃO
                    </button>

                    <button v-if="$root.usuario && ($root.usuario.permissoes.admin || $root.usuario.cargo === 'Gerente')" @click="$root.mudarTela('tela-logs')" class="btn" style="background: #1A1A1A; color: #FFAB00; border: 1px solid #FFAB00;">
                        <i class="fas fa-file-alt"></i> LOGS DO SISTEMA
                    </button>
                </div>
            </div>

        </div>
    </div>
    `,
    data() {
        return {
            ajuda: [
                {
                    titulo: "🚪 1. Porta de Entrada (Login)",
                    icone: "fa-door-open",
                    itens: [
                        { q: "Como funciona?", a: "O funcionário digita seu Nome e PIN de 4 dígitos. É o cofre da pizzaria." },
                        { q: "Esqueci a Senha", a: "Digite seu nome e clique em 'Esqueci meu PIN'. Um alerta silencioso é enviado ao painel do Gerente para aprovação." }
                    ],
                    expandido: false
                },
                {
                    titulo: "📊 2. Centro de Comando (Dashboard)",
                    icone: "fa-chart-line",
                    itens: [
                        { q: "Permissões Cirúrgicas", a: "Cada cargo vê apenas o que precisa. Pizzaiolos veem Produção; Atendentes veem Insumos; Gerentes veem tudo." },
                        { q: "Mural da IA", a: "O 'Cérebro' posta alertas automáticos sobre clima (chuva/frio) e feriados para preparar a equipe." },
                        { q: "Alertas de Segurança", a: "Pedidos de reset de senha aparecem em destaque vermelho apenas para o Gerente." }
                    ],
                    expandido: false
                },
                {
                    titulo: "👨‍🍳 3. Módulo de Produção (Cozinha)",
icone: "fa-pizza-slice",
                    itens: [
                        { q: "A Rotina", a: "O Pizzaiolo informa apenas quantas massas prontas existem na geladeira." },
                        { q: "Matemática Preditiva", a: "A IA calcula: Meta do Dia + 30% se for Feriado + Ajuste de Clima (Chuva = Mais Delivery)." },
                        { q: "Tradução para Batidas", a: "O sistema não diz 'faça 60 massas', mas sim 'Faça 2 batidas exatas', padronizando a receita e evitando erros." }
                    ],
                    expandido: false
                },
                {
                    titulo: "📦 4. MANUAL DE LOGÍSTICA E IA: Insumos, Limpeza e Gelo",
                    icone: "fa-boxes",
                    itens: [
                        { q: "🥫 BLOCO DE INSUMOS (O Funil Exato)", a: "Engloba produtos caros e de alto giro (Frios, Secos, Embalagens). A contagem é exata e matemática." },
                        { q: "Contagem de Insumos", a: "O funcionário digita a quantidade exata em prateleira (Ex: 'Temos 15 Caixas de 35cm')." },
                        { q: "IA nos Insumos: Cálculo de Reposição", a: "Cruza estoque atual com 'Meta Ideal'. Se meta é 100 e temos 15, IA sugere 85 na lista de compras." },
                        { q: "IA nos Insumos: Previsão de Demanda", a: "Monitora clima e feriados. Chuva forte = delivery alto. IA sugere aumentar meta de Embalagens para evitar falta." },

                        { q: "🧽 BLOCO DE LIMPEZA (O Checklist Visual)", a: "Engloba produtos de manutenção (Detergente, Lixívia, Papel Toalha, Esponjas). Contagem visual e ultrarrápida." },
                        { q: "Contagem de Limpeza", a: "O funcionário marca um quadradinho (X) se o item estiver no fim." },
                        { q: "O Carrinho Invisível (Limpeza)", a: "Itens marcados vão para um 'Carrinho Invisível' e esperam a contagem de Insumos para um pedido único." },
                        { q: "IA na Limpeza: Auditor de Desperdício", a: "Memoriza padrão de consumo. Se Lixívia é pedida a cada 3 dias (média 15 dias), IA alerta Gerente sobre consumo anormal." },

                        { q: "🧊 BLOCO DE GELO (O Sensor de Clima)", a: "O Gelo é o produto mais sensível de uma operação de bebidas. Se faltar num dia de calor, as reclamações disparam; se sobrar muito no frio, ocupa espaço vital no freezer." },
                        { q: "Contagem de Gelo", a: "Pode ser feita de forma visual (sacos cheios) ou exata. O funcionário digita quantos sacos de gelo restam no freezer principal." },
                        { q: "IA no Gelo: Meteorologista Particular", a: "Conectado a um satélite meteorológico configurado para sua cidade (Londrina). Lê a temperatura real do momento." },
                        { q: "IA no Gelo: Gatilho Térmico", a: "Se a temperatura ultrapassar 27°C (ou for fim de semana/dia de festa), o painel fica Azul Piscante e dobra a meta de gelo automaticamente." },
                        { q: "IA no Gelo: Aviso no Mural", a: "Mensagem urgente no Dashboard para toda a equipe: 'Alerta de Calor (Acima de 27°C)! O consumo de bebidas vai disparar hoje. Reforcem o estoque de Gelo e abasteçam as geladeiras de refrigerante agora!'" },

                        { q: "Resumo da Operação Integrada", a: "Enquanto a equipe foca apenas em dizer o que está a ver na prateleira, a IA do PiZZA Master faz o trabalho pesado: calcula a matemática, prevê o movimento pela chuva, audita o desperdício de sabão e mede a temperatura da cidade para garantir que a cerveja e o refrigerante saiam sempre trincando!" }
                    ],
                    expandido: false
                },
                {
                    titulo: "⚙️ 5. Gestão (Painel do Gerente)",
                    icone: "fa-cogs",
                    itens: [
                        { q: "Catálogo ERP", a: "Onde se define produtos, metas, unidades e setores." },
                        { q: "Olhinho Mágico", a: "Permite ao gerente ver o PIN de qualquer funcionário ou aprovar resets." },
                        { q: "Auditoria", a: "O sistema 'dedo-duro'. Registra cada clique, login e alteração com data e hora." },
                        { q: "Rotas", a: "Organiza a lista de contagem pela ordem física da loja (ex: Geladeira 1 -> Estoque Seco)." }
                    ],
                    expandido: false
                },
                {
                    titulo: "🧠 6. IA e Modo Offline",
                    icone: "fa-brain",
                    itens: [
                        { q: "Escudo de Memória", a: "Se a internet cair, o sistema salva tudo no celular e sincroniza quando a conexão voltar." },
                        { q: "Proteção Contra Falhas", a: "Em caso de erro grave, um escudo vermelho oferece a opção segura de 'Reparar e Reiniciar' para não parar a operação." }
                    ],
                    expandido: false
                },
                {
                    titulo: "🍕 7. MANUAL DE PRODUÇÃO DE MASSA - ARTIGIANO",
                    icone: "fa-pizza-slice",
                    itens: [
                        { q: "Produto", a: "Massa de Pizza de Longa Fermentação" },
                        { q: "Peso da Bolinha", a: "220g" },
                        { q: "Armazenamento", a: "6 bolinhas por bandeja" },
                        { q: "1. RECEITAS POR LOTE (Quantidades Exatas)", a: "" },
                        { q: "LOTE: 15 MASSAS", a: "Farinha: 2.000 g | Água LÍQUIDA (70%): 873 g | Gelo (30%): 374 g | Levain: 90 g | Sal: 60 g (Total de Água: 1.247 g)" },
                        { q: "LOTE: 30 MASSAS", a: "Farinha: 4.000 g | Água LÍQUIDA (70%): 1.746 g | Gelo (30%): 748 g | Levain: 180 g | Sal: 120 g (Total de Água: 2.494 g)" },
                        { q: "LOTE: 45 MASSAS", a: "Farinha: 6.000 g | Água LÍQUIDA (70%): 2.619 g | Gelo (30%): 1.123 g | Levain: 270 g | Sal: 180 g (Total de Água: 3.742 g)" },
                        { q: "LOTE: 60 MASSAS", a: "Farinha: 8.000 g | Água LÍQUIDA (70%): 3.492 g | Gelo (30%): 1.497 g | Levain: 360 g | Sal: 240 g (Total de Água: 4.989 g)" },
                        { q: "LOTE: 75 MASSAS", a: "Farinha: 10.000 g | Água LÍQUIDA (70%): 4.366 g | Gelo (30%): 1.871 g | Levain: 450 g | Sal: 300 g (Total de Água: 6.237 g)" },
                        { q: "LOTE: 90 MASSAS", a: "Farinha: 12.000 g | Água LÍQUIDA (70%): 5.239 g | Gelo (30%): 2.245 g | Levain: 540 g | Sal: 360 g (Total de Água: 7.484 g)" },
                        { q: "LOTE: 110 MASSAS", a: "Farinha: 14.000 g | Água LÍQUIDA (70%): 6.112 g | Gelo (30%): 2.620 g | Levain: 630 g | Sal: 420 g (Total de Água: 8.732 g)" },
                        { q: "2. PROCEDIMENTO OPERACIONAL PADRÃO (POP)", a: "" },
                        { q: "Passo 1: Mise en Place (Preparação)", a: "Pesar todos os ingredientes com precisão. Separar a água líquida do gelo. Verificar se o Levain está no ponto de uso." },
                        { q: "Passo 2: Primeira Mistura (Base Gelada)", a: "Na masseira, adicione Água Líquida, Gelo, Sal e metade da Farinha. Bater até homogêneo." },
                        { q: "Passo 3: Desenvolvimento da Massa", a: "Adicione o restante da Farinha e o Levain. Bater até o 'ponto de cera' (massa lisa, brilhante, desgrudando da cuba)." },
                        { q: "Passo 4: Descanso e Higiene", a: "Retire a massa, cubra com Perflex. Limpe a masseira." },
                        { q: "Passo 5: Corte e Modelagem", a: "Corte a massa em porções de 220g. Boleie e organize 6 massas por bandeja." },
                        { q: "3. ALIMENTAÇÃO DO LEVAIN", a: "Regra Geral: Reposição 1 por 1 (1:1) sobre a isca. Exemplo: Se a receita pede 360g de Levain, retire 360g, adicione 180g de Água e 180g de Farinha no balde." }
                    ],
                    expandido: false
                }
            ]
        };
    },
    methods: {
        contatarDesenvolvedor() {
            const numero = "43984544686";
            const msg = encodeURIComponent("Olá! Sou usuário do PiZZA Master e preciso de ajuda com o aplicativo.");
            window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
        },
        toggleSecao(index) {
            this.ajuda[index].expandido = !this.ajuda[index].expandido;
        }
    }
});

