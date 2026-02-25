/**
 * Sistema de Tutoriais e Novidades v1.0
 * Gerencia onboarding e changelogs.
 */

const NOVIDADES_VERSAO = {
    '2.20.0': {
        titulo: 'Atualização Sazonal & Logs',
        itens: [
            { icone: 'fa-calendar-alt', texto: 'Produtos Sazonais: Defina validade para pizzas temporárias.' },
            { icone: 'fa-file-alt', texto: 'Logs do Sistema: Agora em Ajuda e Suporte para facilitar diagnósticos.' },
            { icone: 'fa-boxes', texto: 'Gestão Avançada: Defina estoque mínimo, peso unitário e pedidos simplificados.' },
            { icone: 'fa-plus-circle', texto: 'Novas Rotas: Crie locais de armazenamento direto no cadastro.' }
        ]
    }
};

const TUTORIAIS_TELAS = {
    'tela-gestao-produtos': [
        { alvo: '.form-grupo select', texto: 'Comece escolhendo se é Insumo ou Limpeza.' },
        { alvo: '.btn-plus', texto: 'Use este botão para criar novos locais de armazenamento na hora.' },
        { alvo: 'input[type="checkbox"]', texto: 'Marque "Sazonal" para produtos temporários.' }
    ]
};

Vue.mixin({
    data() {
        return {
            mostrarNovidadesModal: false,
            novidadesAtuais: null,
            tutorialAtivo: null,
            passoTutorial: 0
        };
    },
    mounted() {
        // Verifica Novidades da Versão
        if (this.$root && this.$root.versaoApp) {
            const versaoSalva = localStorage.getItem('pizza_master_versao_vista');
            if (versaoSalva !== this.$root.versaoApp) {
                this.mostrarNovidades();
            }
        }
    },
    methods: {
        mostrarNovidades(forcar = false) {
            const versao = this.$root.versaoApp;
            if (NOVIDADES_VERSAO[versao] || forcar) {
                this.novidadesAtuais = NOVIDADES_VERSAO[versao] || { titulo: 'Versão ' + versao, itens: [] };
                this.mostrarNovidadesModal = true;
                
                // Injeta o modal no DOM se não existir
                if (!document.getElementById('modal-novidades')) {
                    this.criarModalNovidades();
                }
            }
        },
        fecharNovidades() {
            this.mostrarNovidadesModal = false;
            const modal = document.getElementById('modal-novidades');
            if (modal) modal.style.display = 'none';
            localStorage.setItem('pizza_master_versao_vista', this.$root.versaoApp);
        },
        criarModalNovidades() {
            const div = document.createElement('div');
            div.id = 'modal-novidades';
            div.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); z-index: 9999; display: flex;
                justify-content: center; align-items: center; padding: 20px;
            `;
            
            let html = `
                <div class="animate__animated animate__zoomIn" style="background: #1E1E1E; width: 100%; max-width: 400px; border-radius: 15px; border: 1px solid #00E676; overflow: hidden;">
                    <div style="background: #00E676; padding: 20px; text-align: center;">
                        <i class="fas fa-gift" style="font-size: 3rem; color: #121212;"></i>
                        <h2 style="margin: 10px 0 0 0; color: #121212;">O que há de novo?</h2>
                        <p style="margin: 0; color: #121212; font-weight: bold;">Versão ${this.$root.versaoApp}</p>
                    </div>
                    <div style="padding: 20px;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
            `;
            
            const novidades = NOVIDADES_VERSAO[this.$root.versaoApp] || { itens: [] };
            novidades.itens.forEach(item => {
                html += `
                    <li style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start;">
                        <div style="background: #333; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas ${item.icone}" style="color: #00E676;"></i>
                        </div>
                        <p style="margin: 0; color: #DDD; font-size: 0.9rem; line-height: 1.4;">${item.texto}</p>
                    </li>
                `;
            });

            html += `
                        </ul>
                        <button id="btn-fechar-novidades" style="width: 100%; padding: 15px; background: #00E676; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                            ENTENDI, VAMOS LÁ!
                        </button>
                    </div>
                </div>
            `;
            
            div.innerHTML = html;
            document.body.appendChild(div);
            
            document.getElementById('btn-fechar-novidades').onclick = () => {
                this.fecharNovidades();
            };
        }
    }
});
