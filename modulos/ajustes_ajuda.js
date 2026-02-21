// modulos/ajustes_ajuda.js - Manual do Sistema v0.0.37

Vue.component('tela-ajustes-ajuda', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FFF;">❓ Ajuda & Manual</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <p style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 20px;">
            Toque nos tópicos abaixo para entender como a inteligência do PiZZA Master funciona.
        </p>

        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 10px; border-left: 3px solid var(--cor-primaria);">
            <button @click="toggleAjuda(1)" style="width: 100%; padding: 15px; background: #2C2C2C; border: none; color: white; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><i class="fas fa-calculator" style="color: var(--cor-primaria); margin-right: 10px;"></i> Produção de Massa & GPS</span>
                <i :class="abaAberta === 1 ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
            <div v-show="abaAberta === 1" class="animate__animated animate__fadeIn" style="padding: 15px; font-size: 0.9rem; color: #CCC; background: #1A1A1A; border-top: 1px solid #333;">
                <p style="margin-top: 0;">A Calculadora prevê a massa exata para o próximo dia útil, ajustando metas sozinha:</p>
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 5px;"><b>Feriados:</b> Se houver um evento, a IA aplica a meta de Sexta-feira + 30%.</li>
                    <li style="margin-bottom: 5px;"><b>Chuva:</b> Corta 20% da produção se prever chuva forte à noite para evitar desperdício.</li>
                    <li style="margin-bottom: 5px;"><b>Aviso Diário (GPS):</b> O sistema usa o GPS para saber se você está na Pizzaria. Se estiver, o Mural pedirá que informe quantas massas sobraram hoje, preenchendo a calculadora automaticamente.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 10px; border-left: 3px solid #D50000;">
            <button @click="toggleAjuda(2)" style="width: 100%; padding: 15px; background: #2C2C2C; border: none; color: white; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><i class="fas fa-shopping-cart" style="color: #D50000; margin-right: 10px;"></i> Pedidos & Carrinho Inteligente</span>
                <i :class="abaAberta === 2 ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
            <div v-show="abaAberta === 2" class="animate__animated animate__fadeIn" style="padding: 15px; font-size: 0.9rem; color: #CCC; background: #1A1A1A; border-top: 1px solid #333;">
                <p style="margin-top: 0;">O sistema tem um <b>Carrinho de Compras Permanente</b> para os módulos de Insumos e Sacolão.</p>
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 5px;">Se algo acabar na quinta-feira, mas o dia de pedir for terça, digite "0" e clique em <b>Guardar Faltas na Lista</b>.</li>
                    <li style="margin-bottom: 5px;">A aplicação não esquecerá! O botão vermelho ficará no fundo da tela com os itens guardados, mesmo que você feche o app.</li>
                    <li>O sistema converte fatias ou quilos diretamente para a unidade de compra (Caixas/Fardos) antes de enviar para o WhatsApp do fornecedor.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 10px; border-left: 3px solid #00B0FF;">
            <button @click="toggleAjuda(3)" style="width: 100%; padding: 15px; background: #2C2C2C; border: none; color: white; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><i class="fas fa-snowflake" style="color: #00B0FF; margin-right: 10px;"></i> Gelo Smart & Clima</span>
                <i :class="abaAberta === 3 ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
            <div v-show="abaAberta === 3" class="animate__animated animate__fadeIn" style="padding: 15px; font-size: 0.9rem; color: #CCC; background: #1A1A1A; border-top: 1px solid #333;">
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 5px;">Se a temperatura da rua passar dos <b>27°C</b>, a IA sabe que o consumo de bebidas vai disparar.</li>
                    <li style="margin-bottom: 5px;">Ela emite um <b>Alerta Urgente no Mural</b> pedindo à equipa para garantir que a arca de gelo está na sua capacidade máxima (10 sacos).</li>
                    <li>Ao clicar no botão do aviso, a notificação é dada como concluída e desaparece.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 10px; border-left: 3px solid #9C27B0;">
            <button @click="toggleAjuda(4)" style="width: 100%; padding: 15px; background: #2C2C2C; border: none; color: white; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><i class="fas fa-user-shield" style="color: #9C27B0; margin-right: 10px;"></i> Permissões & Autorização (PIN)</span>
                <i :class="abaAberta === 4 ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
            <div v-show="abaAberta === 4" class="animate__animated animate__fadeIn" style="padding: 15px; font-size: 0.9rem; color: #CCC; background: #1A1A1A; border-top: 1px solid #333;">
                <p style="margin-top: 0;">A aplicação possui Segurança de Nível Empresarial:</p>
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 5px;">Existem cargos pré-definidos (Pizzaiolo, Atendente, Gerente) que libertam apenas os ecrãs necessários para o funcionário.</li>
                    <li style="margin-bottom: 5px;"><b>Bloqueio de Exclusão:</b> Se um utilizador sem permissão tentar apagar um aviso, um produto ou uma rota, a tela ficará bloqueada.</li>
                    <li>Para continuar a ação, um Gerente ou Administrador terá de digitar o seu próprio PIN de 4 dígitos no telemóvel do funcionário para autorizar a operação.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="padding: 0; overflow: hidden; border-left: 3px solid #E0E0E0;">
            <button @click="toggleAjuda(5)" style="width: 100%; padding: 15px; background: #2C2C2C; border: none; color: white; font-weight: bold; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span><i class="fas fa-history" style="color: #E0E0E0; margin-right: 10px;"></i> Auditoria, Vibração e Offline</span>
                <i :class="abaAberta === 5 ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
            <div v-show="abaAberta === 5" class="animate__animated animate__fadeIn" style="padding: 15px; font-size: 0.9rem; color: #CCC; background: #1A1A1A; border-top: 1px solid #333;">
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 5px;"><b>100% Offline:</b> Se a internet falhar na câmara frigorífica, não se preocupe. A app guarda tudo na memória interna do telemóvel instantaneamente.</li>
                    <li style="margin-bottom: 5px;"><b>Retorno Tátil:</b> O telemóvel vibra para confirmar ações. Se não gostar, pode desligar isto na secção "Meu Perfil".</li>
                    <li><b>Auditoria Global:</b> O Livro de Registos anota TUDO. Desde o momento do login, a lotes produzidos, até aos produtos exatos que foram pedidos pelo WhatsApp.</li>
                </ul>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            abaAberta: null
        };
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-ajustes');
        },
        toggleAjuda(aba) {
            this.$root.vibrar(15);
            this.abaAberta = this.abaAberta === aba ? null : aba;
        }
    }
});
