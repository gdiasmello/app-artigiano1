// modulos/ajustes_perfil.js - v0.0.23

Vue.component('tela-ajustes-perfil', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #FFF;">👤 Meu Perfil</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card">
            <p style="color: var(--text-sec); font-size: 0.85rem; margin-top: 0;">Atualize o seu PIN de acesso e a sua data de aniversário.</p>
            
            <label style="color:#CCC; font-size:0.8rem;">Como gosta de ser chamado?</label>
            <input type="text" v-model="meuPerfil.nome" style="width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; margin-bottom:15px; box-sizing: border-box;">

            <label style="color:#CCC; font-size:0.8rem;">Novo PIN de Acesso (4 dígitos)</label>
            <input type="number" v-model="meuPerfil.pin" style="width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; margin-bottom:15px; box-sizing: border-box;">

            <label style="color:#CCC; font-size:0.8rem;">Data de Aniversário 🎂</label>
            <input type="date" v-model="meuPerfil.nascimento" style="width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; margin-bottom:20px; box-sizing: border-box;">

            <button class="btn" style="background: var(--cor-primaria); color: #121212;" @click="salvarMeuPerfil">
                <i class="fas fa-save"></i> SALVAR ALTERAÇÕES
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            meuPerfil: { nome: '', pin: '', nascimento: '' }
        };
    },
    mounted() {
        if (this.$root.usuario) {
            this.meuPerfil.nome = this.$root.usuario.nome || '';
            this.meuPerfil.pin = this.$root.usuario.pin || '';
            this.meuPerfil.nascimento = this.$root.usuario.nascimento || '';
        }
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-ajustes');
        },
        salvarMeuPerfil() {
            this.$root.vibrar(30);
            if(!this.meuPerfil.nome || !this.meuPerfil.pin) { 
                this.$root.vibrar([100, 50, 100]); // Erro
                Swal.fire({ icon: 'error', title: 'Atenção', text: 'Nome e PIN são obrigatórios.', background: '#1E1E1E', color: '#FFF' }); 
                return; 
            }
            
            // Verifica se o PIN mudou para avisar na auditoria
            let pinMudou = this.$root.usuario.pin !== String(this.meuPerfil.pin);

            this.$root.usuario.nome = this.meuPerfil.nome;
            this.$root.usuario.pin = String(this.meuPerfil.pin);
            this.$root.usuario.nascimento = this.meuPerfil.nascimento;

            if(this.$root.equipe) {
                const index = this.$root.equipe.findIndex(u => u.id === this.$root.usuario.id);
                if(index !== -1) {
                    this.$root.equipe[index].nome = this.meuPerfil.nome;
                    this.$root.equipe[index].pin = this.$root.usuario.pin;
                    this.$root.equipe[index].nascimento = this.meuPerfil.nascimento;
                }
            }

            // Regista na Auditoria
            this.$root.registrarHistorico('Perfil Atualizado', 'Ajustes', pinMudou ? 'PIN de acesso foi alterado.' : 'Apenas dados básicos alterados.');

            this.$root.vibrar([50, 50, 50]); // Sucesso
            Swal.fire({ icon: 'success', title: 'Salvo!', text: 'Seu perfil foi atualizado com segurança offline.', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' }).then(() => {
                this.$root.mudarTela('tela-ajustes');
            });
        }
    }
});
