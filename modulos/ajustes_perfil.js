/**
 * Perfil do Usuário v1.0.8
 */
Vue.component('tela-ajustes-perfil', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #00B0FF;">👤 Meu Perfil</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #00B0FF;">
            <div style="margin-bottom: 20px;">
                <label class="label-form">NOME COMPLETO</label>
                <input type="text" v-model="form.nomeCompleto" class="input-dark">
            </div>
            <div style="margin-bottom: 20px;">
                <label class="label-form">NOME DE LOGIN (CURTO)</label>
                <input type="text" v-model="form.nome" class="input-dark">
            </div>
            <div style="margin-bottom: 20px;">
                <label class="label-form">DATA DE NASCIMENTO</label>
                <input type="date" v-model="form.dataNascimento" class="input-dark">
            </div>
            <div style="margin-bottom: 25px;">
                <label class="label-form">PIN DE ACESSO (4 DÍGITOS)</label>
                <input type="password" inputmode="numeric" maxlength="4" v-model="form.pin" class="input-dark" style="text-align: center; letter-spacing: 15px; font-size: 1.5rem; font-weight: 900;">
            </div>
            <button @click="salvar" class="btn" style="background: #00B0FF; color: #121212;">SALVAR ALTERAÇÕES</button>
        </div>
    </div>
    `,
    data() {
        return { form: { nome: '', nomeCompleto: '', pin: '', dataNascimento: '' } };
    },
    mounted() {
        if (this.$root.usuario) {
            this.form.nome = this.$root.usuario.nome;
            this.form.nomeCompleto = this.$root.usuario.nomeCompleto || '';
            this.form.pin = this.$root.usuario.pin;
            this.form.dataNascimento = this.$root.usuario.dataNascimento || '';
        }
    },
    methods: {
        salvar() {
            if (this.form.pin.length !== 4) return Swal.fire('Erro', 'O PIN deve ter 4 dígitos.', 'error');
            
            const idx = this.$root.equipe.findIndex(u => u.id === this.$root.usuario.id);
            if (idx !== -1) {
                this.$root.equipe[idx].nome = this.form.nome;
                this.$root.equipe[idx].nomeCompleto = this.form.nomeCompleto;
                this.$root.equipe[idx].pin = this.form.pin;
                this.$root.equipe[idx].dataNascimento = this.form.dataNascimento;
                this.$root.usuario = this.$root.equipe[idx];
                
                db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true });
                Swal.fire({ icon: 'success', title: 'Perfil Atualizado!', background: '#1E1E1E' });
            }
        }
    }
});
