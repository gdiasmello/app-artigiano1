/**
 * Login v2.20.0
 * Segurança otimizada e fluxo de recuperação de PIN.
 */
Vue.component('tela-login', {
    template: `
    <div class="container" style="display: flex; flex-direction: column; justify-content: center; min-height: 90vh;">
        
        <div style="text-align: center; margin-bottom: 50px;">
            <i class="fas fa-pizza-slice" style="font-size: 5rem; color: var(--cor-primaria); margin-bottom: 20px; filter: drop-shadow(0px 4px 12px rgba(255, 171, 0, 0.4));"></i>
            <h1 style="margin: 0; color: white; font-size: 2.5rem; letter-spacing: 3px; font-weight: 900;">PiZZA <span style="color: var(--cor-primaria);">Master</span></h1>
            <p style="color: #666; margin-top: 8px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Intelligence ERP</p>
        </div>

        <div v-if="$root.carregandoDados" style="text-align: center; padding: 40px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h3 style="color: white; margin: 0;">Sincronizando Cérebro...</h3>
        </div>

        <div v-else-if="tela === 'login'" class="card" style="padding: 30px; border-top: 5px solid var(--cor-primaria);">
            <div style="margin-bottom: 25px;">
                <label style="color: #888; font-size: 0.75rem; font-weight: 800; margin-bottom: 10px; display: block; text-transform: uppercase;">USUÁRIO</label>
                <input type="text" v-model="usuarioDigitado" placeholder="Seu nome de login" class="input-dark" @keyup.enter="focarPin">
            </div>

            <div style="margin-bottom: 30px;">
                <label style="color: #888; font-size: 0.75rem; font-weight: 800; margin-bottom: 10px; display: block; text-transform: uppercase;">PIN DE ACESSO (4 DÍGITOS)</label>
                <input type="password" 
                       ref="pinInput"
                       inputmode="numeric" 
                       maxlength="4" 
                       v-model="pin" 
                       placeholder="****" 
                       class="input-dark" 
                       style="letter-spacing: 20px; text-align: center; font-size: 2rem; font-weight: 900; color: var(--cor-primaria);"
                       @keyup.enter="fazerLogin">
            </div>

            <button @click="fazerLogin" class="btn" style="background: var(--cor-primaria); color: #121212; height: 65px; font-size: 1.2rem;">
                ACESSAR SISTEMA <i class="fas fa-chevron-right"></i>
            </button>

            <div style="text-align: center; margin-top: 25px;">
                <button @click="tela = 'esqueci'" style="background: none; border: none; color: #555; font-size: 0.85rem; cursor: pointer; text-decoration: underline;">
                    Esqueci meu PIN de acesso
                </button>
            </div>
        </div>

        <!-- Tela Esqueci PIN -->
        <div v-else-if="tela === 'esqueci'" class="card animate__animated animate__fadeInUp" style="padding: 30px; border-top: 5px solid #FFAB00;">
            <h3 style="color: white; margin-top: 0;">Recuperar Acesso</h3>
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 25px;">Informe seus dados para solicitar o reset do PIN ao gerente.</p>
            
            <div style="margin-bottom: 20px;">
                <label class="label-form">NOME DE USUÁRIO</label>
                <input type="text" v-model="usuarioDigitado" class="input-dark">
            </div>
            <div style="margin-bottom: 25px;">
                <label class="label-form">DATA DE NASCIMENTO</label>
                <input type="date" v-model="dataNascimento" class="input-dark">
            </div>

            <button @click="pedirResetSenha" class="btn" style="background: #FFAB00; color: #121212; margin-bottom: 15px;">SOLICITAR RESET</button>
            <button @click="tela = 'login'" class="btn" style="background: none; border: 1px solid #333; color: #666;">VOLTAR</button>
        </div>

        <!-- Tela Trocar PIN Obrigatório -->
        <div v-else-if="tela === 'trocar'" class="card animate__animated animate__fadeInUp" style="padding: 30px; border-top: 5px solid #00E676;">
            <h3 style="color: white; margin-top: 0;">Segurança</h3>
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 25px;">Seu PIN foi resetado ou é o padrão. Por favor, crie um novo PIN de 4 dígitos.</p>
            
            <div style="margin-bottom: 25px;">
                <label class="label-form">NOVO PIN (4 DÍGITOS)</label>
                <input type="password" inputmode="numeric" maxlength="4" v-model="novoPin" class="input-dark" style="letter-spacing: 20px; text-align: center; font-size: 2rem; font-weight: 900;">
            </div>

            <button @click="salvarNovoPin" class="btn" style="background: #00E676; color: #121212;">DEFINIR NOVO PIN</button>
        </div>

        <div v-if="!$root.carregandoDados" style="text-align: center; margin-top: 50px; opacity: 0.4;">
            <p style="color: #AAA; font-size: 0.7rem; margin: 0; font-weight: bold; letter-spacing: 1px;">VERSÃO {{ $root.versaoApp }} | OFFLINE-FIRST ENABLED</p>
        </div>

    </div>
    `,
    data() { 
        return { 
            usuarioDigitado: '', 
            pin: '', 
            tela: 'login',
            dataNascimento: '',
            novoPin: '',
            usuarioLogadoTemp: null
        }; 
    },
    methods: {
        focarPin() {
            if (this.$refs.pinInput) this.$refs.pinInput.focus();
        },
        fazerLogin() {
            if (!this.usuarioDigitado || this.pin.length !== 4) {
                Swal.fire({ icon: 'warning', text: 'Informe o usuário e o PIN de 4 dígitos.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            const nome = this.usuarioDigitado.trim().toLowerCase();

            // Chave Mestra
            if ((nome === 'gabriel' && this.pin === '0000') || (nome === 'admin' && this.pin === '9999')) {
                this.$root.usuario = { id: 'master', nome: 'Administrador', cargo: 'Gerente', permissoes: { admin: true } };
                this.$root.mudarTela('tela-dashboard');
                return;
            }

            const user = this.$root.equipe.find(u => u.nome.toLowerCase() === nome);

            if (user && user.pin === this.pin) {
                if (user.precisaTrocarSenha) {
                    this.usuarioLogadoTemp = user;
                    this.tela = 'trocar';
                } else {
                    this.$root.usuario = user;
                    this.$root.mudarTela('tela-dashboard');
                }
            } else {
                this.$root.vibrar([100, 50, 100]);
                Swal.fire({ icon: 'error', title: 'Acesso Negado', text: 'Credenciais incorretas.', background: '#1E1E1E', color: '#FFF' });
                this.pin = '';
            }
        },
        salvarNovoPin() {
            if (this.novoPin.length !== 4) return;
            
            const uIdx = this.$root.equipe.findIndex(u => u.id === this.usuarioLogadoTemp.id);
            if (uIdx !== -1) {
                this.$root.equipe[uIdx].pin = this.novoPin;
                this.$root.equipe[uIdx].precisaTrocarSenha = false;
                
                db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe });
                
                this.$root.usuario = this.$root.equipe[uIdx];
                Swal.fire({ icon: 'success', title: 'PIN Atualizado!', text: 'Bem-vindo ao sistema.', background: '#1E1E1E' })
                    .then(() => this.$root.mudarTela('tela-dashboard'));
            }
        },
        pedirResetSenha() {
            if (!this.usuarioDigitado || !this.dataNascimento) {
                Swal.fire({ icon: 'info', text: 'Informe seu usuário e data de nascimento.', background: '#1E1E1E' });
                return;
            }
            
            const nome = this.usuarioDigitado.trim().toLowerCase();
            const user = this.$root.equipe.find(u => u.nome.toLowerCase() === nome);
            
            if (!user) {
                Swal.fire({ icon: 'error', text: 'Usuário não encontrado.', background: '#1E1E1E' });
                return;
            }

            // Verifica data de nascimento se estiver cadastrada
            if (user.dataNascimento && user.dataNascimento !== this.dataNascimento) {
                Swal.fire({ icon: 'error', title: 'Dados Incorretos', text: 'A data de nascimento não confere com nossos registros.', background: '#1E1E1E' });
                return;
            }

            Swal.fire({
                title: 'Resetar PIN?',
                text: `Enviar solicitação de reset para ${user.nome}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#FFAB00',
                background: '#1E1E1E', color: '#FFF'
            }).then((res) => {
                if (res.isConfirmed) {
                    const pedidos = this.$root.pedidosResetSenha || [];
                    if (pedidos.some(p => p.idUsuario === user.id)) {
                        Swal.fire({ icon: 'info', text: 'Já existe um pedido pendente para você.', background: '#1E1E1E' });
                        return;
                    }

                    pedidos.push({
                        id: Date.now().toString(),
                        idUsuario: user.id,
                        nome: user.nome,
                        dataStr: new Date().toLocaleDateString('pt-BR')
                    });

                    // Adiciona ao Mural de Avisos para Gerentes
                    const aviso = {
                        id: `reset_${user.id}_${Date.now()}`,
                        texto: `🚨 RESET DE PIN: O funcionário ${user.nome} solicitou redefinição de senha.`,
                        publico: 'Gerente',
                        urgente: true,
                        autor: 'SISTEMA IA',
                        dataStr: new Date().toLocaleDateString('pt-BR'),
                        isResetRequest: true,
                        idUsuario: user.id,
                        telaDestino: 'tela-ajustes-equipe'
                    };
                    this.$root.avisos.unshift(aviso);
                    db.collection("configuracoes").doc("avisos").set({ lista: this.$root.avisos });

                    db.collection("configuracoes").doc("loja").set({ pedidosResetSenha: pedidos }, { merge: true });
                    Swal.fire({ icon: 'success', title: 'Solicitado!', text: 'Aguarde a aprovação de um gerente.', background: '#1E1E1E' })
                        .then(() => this.tela = 'login');
                }
            });
        }
    }
});

