Vue.component('tela-ajustes-perfil', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #4CAF50;"><i class="fas fa-user-cog"></i> Meu Perfil</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #4CAF50; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Dados Pessoais</h4>
            <div class="form-grupo">
                <label>Nome de Usuário</label>
                <input type="text" v-model="usuarioEditavel.nome" class="input-dark">
            </div>
            <div class="form-grupo">
                <label>Nova Senha (deixe em branco para não alterar)</label>
                <input type="password" v-model="novaSenha" class="input-dark">
            </div>
            <div class="form-grupo-inline">
                <div class="form-grupo">
                    <label>Nome Completo</label>
                    <input type="text" :value="$root.usuario.nomeCompleto" class="input-dark" readonly>
                </div>
                <div class="form-grupo">
                    <label>Data de Nascimento</label>
                    <input type="text" :value="$root.usuario.dataNascimento" class="input-dark" readonly>
                </div>
            </div>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #03A9F4; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Preferências do WhatsApp</h4>
            <div class="form-grupo">
                <label>Saudação Padrão</label>
                <select v-model="usuarioEditavel.preferencias.saudacaoZap" class="input-dark">
                    <option v-for="(s, i) in usuarioEditavel.preferencias.saudacoesCustomizadas" :key="'s' + i" :value="s">{{ s }}</option>
                </select>
                <div class="custom-message-list">
                    <div v-for="(s, i) in usuarioEditavel.preferencias.saudacoesCustomizadas" :key="'s' + i" class="custom-message-item">
                        <span>{{ s }}</span>
                        <button @click="rmSaudacao(i)" class="btn-delete-aviso"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="add-custom-message">
                    <input type="text" v-model="novaSaudacao" placeholder="Nova Saudação" class="input-dark">
                    <button @click="addSaudacao" class="btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="form-grupo">
                <label>Despedida Padrão</label>
                <select v-model="usuarioEditavel.preferencias.despedidaZap" class="input-dark">
                    <option v-for="(d, i) in usuarioEditavel.preferencias.despedidasCustomizadas" :key="'d' + i" :value="d">{{ d }}</option>
                </select>
                <div class="custom-message-list">
                    <div v-for="(d, i) in usuarioEditavel.preferencias.despedidasCustomizadas" :key="'d' + i" class="custom-message-item">
                        <span>{{ d }}</span>
                        <button @click="rmDespedida(i)" class="btn-delete-aviso"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="add-custom-message">
                    <input type="text" v-model="novaDespedida" placeholder="Nova Despedida" class="input-dark">
                    <button @click="addDespedida" class="btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #FFC107; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;">Sistema</h4>
            <div class="setting-item">
                <span>Habilitar Vibração</span>
                <input type="checkbox" v-model="usuarioEditavel.preferencias.vibracao" style="transform: scale(1.5); cursor: pointer;">
            </div>
            <div class="setting-item">
                <span>Habilitar Sons</span>
                <input type="checkbox" v-model="usuarioEditavel.preferencias.sons" style="transform: scale(1.5); cursor: pointer;">
            </div>
        </div>

        <button @click="salvarPerfil" class="btn" style="background: #4CAF50; color: white; width: 100%; height: 50px;"><i class="fas fa-save"></i> SALVAR ALTERAÇÕES</button>
    </div>
    `,
    data() {
        return {
            usuarioEditavel: JSON.parse(JSON.stringify(this.$root.usuario)),
            novaSenha: '',
            novaSaudacao: '',
            novaDespedida: ''
        }
    },
    methods: {
        addSaudacao() {
            if (!this.novaSaudacao.trim()) return;
            this.usuarioEditavel.preferencias.saudacoesCustomizadas.push(this.novaSaudacao.trim());
            this.novaSaudacao = '';
        },
        rmSaudacao(index) {
            this.usuarioEditavel.preferencias.saudacoesCustomizadas.splice(index, 1);
        },
        addDespedida() {
            if (!this.novaDespedida.trim()) return;
            this.usuarioEditavel.preferencias.despedidasCustomizadas.push(this.novaDespedida.trim());
            this.novaDespedida = '';
        },
        rmDespedida(index) {
            this.usuarioEditavel.preferencias.despedidasCustomizadas.splice(index, 1);
        },
        salvarPerfil() {
            const userIndex = this.$root.equipe.findIndex(u => u.id === this.usuarioEditavel.id);
            if (userIndex === -1) return;

            // Atualiza os dados básicos
            this.$root.equipe[userIndex].nome = this.usuarioEditavel.nome;
            this.$root.equipe[userIndex].preferencias = this.usuarioEditavel.preferencias;

            // Lógica para nova senha (simplificada, idealmente usar Firebase Auth)
            if (this.novaSenha) {
                this.$root.equipe[userIndex].senha = this.novaSenha; // Em um app real, isso seria hasheado
            }

            // Salva toda a equipe no DB
            db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe })
                .then(() => {
                    this.$root.usuario = this.$root.equipe[userIndex]; // Atualiza o usuário logado
                    this.$root.registrarHistorico('Perfil', 'Atualização', 'Usuário atualizou suas informações de perfil.');
                    Swal.fire('Sucesso', 'Perfil atualizado com sucesso!', 'success');
                })
                .catch(err => {
                    console.error("Erro ao salvar perfil: ", err);
                    Swal.fire('Erro', 'Não foi possível salvar as alterações.', 'error');
                });
        }
    },
    mounted() {
        if (!this.usuarioEditavel.preferencias) {
            this.$set(this.usuarioEditavel, 'preferencias', {});
        }
        if (!this.usuarioEditavel.preferencias.saudacoesCustomizadas) {
            this.$set(this.usuarioEditavel.preferencias, 'saudacoesCustomizadas', ['Olá!', 'Opa, tudo bem?', `Oi, aqui é o ${this.usuarioEditavel.nome}`]);
        }
        if (!this.usuarioEditavel.preferencias.despedidasCustomizadas) {
            this.$set(this.usuarioEditavel.preferencias, 'despedidasCustomizadas', ['Obrigado.', 'Valeu!', 'Até mais.']);
        }
        if (!this.usuarioEditavel.preferencias.saudacaoZap) {
            this.$set(this.usuarioEditavel.preferencias, 'saudacaoZap', this.usuarioEditavel.preferencias.saudacoesCustomizadas[0]);
        }
        if (!this.usuarioEditavel.preferencias.despedidaZap) {
            this.$set(this.usuarioEditavel.preferencias, 'despedidaZap', this.usuarioEditavel.preferencias.despedidasCustomizadas[0]);
        }

        if (!document.getElementById('css-perfil')) {
            const style = document.createElement('style');
            style.id = 'css-perfil';
            style.innerHTML = `
                .form-grupo { margin-bottom: 15px; }
                .form-grupo label { display: block; color: #888; font-size: 0.8rem; margin-bottom: 5px; }
                .form-grupo-inline { display: flex; gap: 15px; }
                .form-grupo-inline .form-grupo { flex: 1; }
                .setting-item { display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; padding: 15px; border-radius: 8px; margin-bottom: 10px; }
                .setting-item span { color: #CCC; }
            `;
            document.head.appendChild(style);
        }
    }
});
