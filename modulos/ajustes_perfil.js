// INÍCIO DO ARQUIVO modulos/ajustes_perfil.js - v1.0.8
Vue.component('tela-ajustes-perfil', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00B0FF;">👤 Meu Perfil</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="border-top: 4px solid #00B0FF; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: white; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">Credenciais de Acesso</h3>
            
            <label class="label-ia">Nome Curto (Usado para o Login)</label>
            <input type="text" v-model="form.nome" class="input-dark" style="margin-bottom: 15px;">

            <label class="label-ia">Nome Completo</label>
            <input type="text" v-model="form.nomeCompleto" class="input-dark" style="margin-bottom: 15px;">

            <label class="label-ia">Sua Senha / PIN (Exatamente 4 dígitos)</label>
            <input type="password" inputmode="numeric" maxlength="4" v-model="form.pin" class="input-dark" style="letter-spacing: 10px; font-size: 1.5rem; text-align: center; font-weight: bold;">
        </div>

        <div class="card" style="border-top: 4px solid #25D366; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: white; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">Mensagens do WhatsApp</h3>
            
            <label class="label-ia">Saudação (Ex: Aqui é o Gabriel!)</label>
            <input type="text" v-model="form.preferencias.saudacaoZap" class="input-dark" style="margin-bottom: 15px;">

            <label class="label-ia">Despedida (Ex: Fico no aguardo, obrigado!)</label>
            <input type="text" v-model="form.preferencias.despedidaZap" class="input-dark">
        </div>

        <button @click="salvarPerfil" class="btn" style="background: #00B0FF; color: #121212; font-weight: bold; height: 55px; font-size: 1.1rem; box-shadow: 0 5px 15px rgba(0, 176, 255, 0.3);">
            <i class="fas fa-save" style="margin-right: 8px;"></i> SALVAR ALTERAÇÕES
        </button>
    </div>
    `,
    data() {
        return {
            form: {
                nome: '', 
                nomeCompleto: '', 
                pin: '',
                preferencias: { saudacaoZap: '', despedidaZap: '' }
            }
        };
    },
    watch: {
        // 🟢 MAGIA AQUI: O formulário só é preenchido no momento EXATO em que o utilizador abre esta tela
        '$root.viewAtual'(novaTela) {
            if (novaTela === 'tela-ajustes-perfil') {
                this.carregarDados();
            }
        }
    },
    mounted() {
        // Se der F5 na página e o utilizador já existir, carrega os dados com segurança
        if (this.$root.usuario) {
            this.carregarDados();
        }

        if (!document.getElementById('css-perfil-v108')) {
            const style = document.createElement('style'); 
            style.id = 'css-perfil-v108';
            style.innerHTML = `
                .input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none; transition: 0.2s; } 
                .input-dark:focus { border-color: #00B0FF; } 
                .label-ia { color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }
            `;
            document.head.appendChild(style);
        }
    },
    methods: {
        carregarDados() {
            // 🟢 TRAVA DE SEGURANÇA: Aborta a leitura se não houver login
            if (!this.$root.usuario) return; 

            this.form.nome = this.$root.usuario.nome || '';
            this.form.nomeCompleto = this.$root.usuario.nomeCompleto || '';
            this.form.pin = this.$root.usuario.pin || '';
            this.form.preferencias.saudacaoZap = this.$root.usuario.preferencias?.saudacaoZap || '';
            this.form.preferencias.despedidaZap = this.$root.usuario.preferencias?.despedidaZap || 'Obrigado.';
        },
        salvarPerfil() {
            if (!this.form.nome.trim() || this.form.pin.length !== 4) {
                Swal.fire({ icon: 'warning', title: 'Atenção', text: 'O nome é obrigatório e o PIN tem de ter exatos 4 números.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.vibrar(30);

            const idx = this.$root.equipe.findIndex(u => u.id === this.$root.usuario.id);
            if (idx !== -1) {
                this.$root.equipe[idx].nome = this.form.nome.trim();
                this.$root.equipe[idx].nomeCompleto = this.form.nomeCompleto.trim();
                this.$root.equipe[idx].pin = this.form.pin;
                
                if (!this.$root.equipe[idx].preferencias) this.$root.equipe[idx].preferencias = {};
                this.$root.equipe[idx].preferencias.saudacaoZap = this.form.preferencias.saudacaoZap;
                this.$root.equipe[idx].preferencias.despedidaZap = this.form.preferencias.despedidaZap;

                this.$root.usuario = this.$root.equipe[idx];

                db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true });
                this.$root.salvarMemoriaLocal();

                Swal.fire({ icon: 'success', title: 'Perfil Atualizado!', text: 'As suas novas credenciais já estão ativas.', timer: 2000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' }).then(() => {
                    this.$root.mudarTela('tela-ajustes');
                });
            }
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_perfil.js
