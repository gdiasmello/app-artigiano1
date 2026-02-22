// INÍCIO DO ARQUIVO modulos/ajustes_perfil.js - v0.0.73
Vue.component('tela-ajustes-perfil', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00B0FF;">👤 Meu Perfil</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 3px solid #00B0FF; padding: 25px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-user-circle" style="font-size: 4.5rem; color: #00B0FF;"></i>
                <h3 style="margin: 10px 0 0 0; color: white;">{{ $root.usuario.nome }}</h3>
                <p style="margin: 5px 0 0 0; color: #888;">{{ $root.usuario.cargo }}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #333; margin: 25px 0;">

            <h4 style="color: #82B1FF; margin-top: 0;"><i class="fab fa-whatsapp" style="color: #00E676;"></i> Mensagens Automáticas</h4>
            <p style="font-size: 0.8rem; color: #AAA; margin-bottom: 15px; line-height: 1.4;">
                O sistema já diz "Bom dia / Boa tarde / Boa noite!" sozinho de acordo com a hora. Escreva abaixo a sua saudação e despedida.
            </p>

            <label class="label-ia">Sua Saudação</label>
            <input type="text" v-model="prefsLocal.saudacaoZap" placeholder="Ex: Aqui é o Gabriel da pizzaria." class="input-dark" style="margin-bottom: 15px;" />

            <label class="label-ia">Sua Despedida</label>
            <input type="text" v-model="prefsLocal.despedidaZap" placeholder="Ex: Obrigado!" class="input-dark" style="margin-bottom: 25px;" />


            <hr style="border: none; border-top: 1px solid #333; margin: 25px 0;">

            <h4 style="color: #82B1FF; margin-top: 0;"><i class="fas fa-sliders-h"></i> Preferências do Aparelho</h4>
            
            <label style="display: flex; justify-content: space-between; align-items: center; color: white; background: #222; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #333;">
                <span><i class="fas fa-fingerprint" style="color: #00B0FF; margin-right: 10px;"></i> Acesso Biométrico</span>
                <input type="checkbox" v-model="prefsLocal.biometriaAtiva" style="transform: scale(1.3);">
            </label>

            <label style="display: flex; justify-content: space-between; align-items: center; color: white; background: #222; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #333;">
                <span><i class="fas fa-mobile-alt" style="color: #FFAB00; margin-right: 10px;"></i> Vibração ao Tocar</span>
                <input type="checkbox" v-model="prefsLocal.vibracao" style="transform: scale(1.3);">
            </label>

            <button @click="salvarPerfil" class="btn" style="background: #00B0FF; color: #121212; font-size: 1.1rem; height: 55px;">
                SALVAR ALTERAÇÕES
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            prefsLocal: {
                saudacaoZap: '',
                despedidaZap: 'Obrigado.',
                biometriaAtiva: true,
                vibracao: true
            }
        };
    },
    mounted() {
        // Carrega as preferências do usuário atual para a tela
        if (this.$root.usuario && this.$root.usuario.preferencias) {
            this.prefsLocal = JSON.parse(JSON.stringify(this.$root.usuario.preferencias));
            
            // Se o usuário for antigo e não tiver essas chaves, criamos agora
            if (this.prefsLocal.saudacaoZap === undefined) this.prefsLocal.saudacaoZap = '';
            if (this.prefsLocal.despedidaZap === undefined) this.prefsLocal.despedidaZap = 'Obrigado.';
        }

        if (!document.getElementById('css-perfil-fix')) {
            const style = document.createElement('style'); style.id = 'css-perfil-fix';
            style.innerHTML = `
                .input-dark { width: 100% !important; padding: 15px !important; background: #2C2C2C !important; border: 1px solid #444 !important; border-radius: 8px !important; color: white !important; box-sizing: border-box !important; font-size: 1rem !important; margin: 0 !important; }
                .input-dark:focus { outline: none; border-color: #00B0FF !important; }
                .label-ia { color: #82B1FF; font-size: 0.85rem; font-weight: bold; margin-bottom: 8px; display: block; letter-spacing: 1px; }
            `;
            document.head.appendChild(style);
        }
    },
    methods: {
        salvarPerfil() {
            this.$root.vibrar(30);
            // Atualiza o objeto do usuário atual
            this.$root.usuario.preferencias = { ...this.prefsLocal };
            
            // Procura o usuário na lista da Equipe e atualiza no Banco de Dados
            const index = this.$root.equipe.findIndex(u => u.id === this.$root.usuario.id);
            if (index !== -1) {
                this.$root.equipe[index].preferencias = { ...this.prefsLocal };
                this.$root.salvarMemoriaLocal();
                Swal.fire({ icon: 'success', title: 'Perfil Salvo!', text: 'Suas mensagens do WhatsApp foram atualizadas.', timer: 2000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            }
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_perfil.js
