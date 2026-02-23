// INÍCIO DO ARQUIVO modulos/login.js - v0.0.89
Vue.component('tela-login', {
    template: `
    <div class="container animate__animated animate__fadeIn" style="display: flex; flex-direction: column; justify-content: center; min-height: 95vh;">
        
        <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 4rem; margin-bottom: 5px;">🍕</div>
            <h1 style="margin: 0; letter-spacing: 3px; font-weight: 900; color: white;">PIZZA MASTER</h1>
            <p style="color: var(--text-sec); margin: 5px 0; font-size: 0.9rem; letter-spacing: 1px;">SISTEMA DE GESTÃO</p>
        </div>

        <div v-if="etapa === 'padrao'" class="card animate__animated animate__fadeIn" style="padding: 25px; background: #1A1A1A; border: 1px solid #333;">
            <label style="display: block; margin-bottom: 8px; color: #888; font-weight: bold; font-size: 0.8rem; text-align: center;">USUÁRIO</label>
            <input type="text" v-model="nomeUsuario" placeholder="Seu nome" class="input-nativo" />

            <label style="display: block; margin-bottom: 8px; color: #888; font-weight: bold; font-size: 0.8rem; text-align: center;">PIN DE ACESSO</label>
            <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" v-model="pin" placeholder="****" class="input-nativo" style="letter-spacing: 10px; font-size: 1.8rem; text-align: center;" @keyup.enter="verificarLogin" />

            <button @click="verificarLogin" class="btn" style="background: var(--cor-primaria); color: #121212; margin-top: 10px; height: 55px; font-size: 1.2rem;">
                ENTRAR
            </button>
            
            <button @click="etapa = 'recuperacao'" style="width: 100%; background: none; border: none; color: #888; margin-top: 20px; font-size: 0.9rem; cursor: pointer; text-decoration: underline;">
                Esqueci a minha senha
            </button>
        </div>

        <div v-if="etapa === 'primeiroAcesso'" class="card animate__animated animate__fadeInRight" style="padding: 25px; background: #1A1A1A; border-top: 4px solid #00E676;">
            <h3 style="color: #00E676; text-align: center; margin-top: 0;">Criar Credenciais</h3>
            <p style="color: #CCC; text-align: center; font-size: 0.85rem; margin-bottom: 20px;">Preencha os seus dados completos para registar o seu acesso no sistema.</p>

            <label class="label-ia">NOME COMPLETO</label>
            <input type="text" v-model="nomeCompleto" placeholder="Ex: João da Silva Santos" class="input-nativo" style="text-align: left; font-size: 1rem; letter-spacing: 0;" />

            <label class="label-ia">NOVO PIN (4 DÍGITOS)</label>
            <input type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" v-model="novoPin" placeholder="****" class="input-nativo" style="letter-spacing: 10px; font-size: 1.8rem;" />

            <label class="label-ia">DATA DE NASCIMENTO</label>
            <input type="date" v-model="dataNascimento" class="input-nativo" />

            <div style="background: rgba(255, 171, 0, 0.1); padding: 15px; border-radius: 8px; border: 1px dashed #FFAB00; margin-top: 15px;">
                <button @click="lerTermo" style="width: 100%; background: none; border: none; color: #FFAB00; font-weight: bold; margin-bottom: 10px; cursor: pointer; text-decoration: underline;">
                    <i class="fas fa-file-contract"></i> LER TERMO DE RESPONSABILIDADE
                </button>
                <label style="display: flex; align-items: center; gap: 10px; color: white; font-size: 0.85rem;">
                    <input type="checkbox" v-model="aceitouTermo" style="transform: scale(1.3);"> 
                    Li e aceito os termos do sistema.
                </label>
            </div>

            <button @click="salvarNovoPerfil" class="btn" style="background: #00E676; color: #121212; margin-top: 15px; height: 55px; font-size: 1.1rem;">
                SALVAR E ENTRAR
            </button>
        </div>

        <div v-if="etapa === 'recuperacao'" class="card animate__animated animate__fadeInLeft" style="padding: 25px; background: #1A1A1A; border-top: 4px solid #FF5252;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: #FF5252; margin: 0;">Recuperar Senha</h3>
                <button @click="etapa = 'padrao'" style="background: none; border: none; color: #888; font-size: 1.2rem;"><i class="fas fa-times"></i></button>
            </div>
            
            <p style="color: #CCC; font-size: 0.9rem; margin-bottom: 20px;">
                O Gerente irá autorizar o reset da sua senha no painel.
            </p>

            <input type="text" v-model="nomeRecuperacao" placeholder="Seu primeiro nome" class="input-nativo" />

            <button @click="solicitarReset" class="btn" style="background: #FF5252; color: #FFF; height: 55px;">
                ENVIAR SOLICITAÇÃO
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            etapa: 'padrao',
            nomeUsuario: '',
            pin: '',
            usuarioTemp: null,
            nomeCompleto: '',
            novoPin: '',
            dataNascimento: '',
            aceitouTermo: false,
            nomeRecuperacao: ''
        };
    },
    methods: {
        verificarLogin() {
            this.$root.vibrar(30);
            const nomeDigitado = this.nomeUsuario.trim().toLowerCase();
            const user = this.$root.equipe.find(x => x.nome.toLowerCase() === nomeDigitado && x.pin === this.pin);
            
            if (user) {
                if (user.pin === '1234') {
                    this.usuarioTemp = user;
                    this.nomeCompleto = user.nomeCompleto || '';
                    this.dataNascimento = user.nascimento || '';
                    this.etapa = 'primeiroAcesso';
                    this.pin = '';
                } else {
                    this.logarUsuario(user);
                }
            } else {
                this.$root.vibrar([100, 50, 100]);
                this.pin = '';
                Swal.fire({ icon: 'error', title: 'Inválido', timer: 1500, showConfirmButton: false, background: '#1E1E1E' });
            }
        },
        lerTermo() {
            const nomePreenchido = this.nomeCompleto.trim() || "[SEU NOME COMPLETO AQUI]";
            const textoTermo = `
                <div style="text-align: justify; font-size: 0.85rem; line-height: 1.5;">
                    Eu, <b>${nomePreenchido}</b>, declaro que compreendo as minhas responsabilidades operacionais ao utilizar o sistema PiZZA Master.<br><br>
                    Comprometo-me a realizar as contagens de estoque, produção e registo de limpeza com a máxima atenção e veracidade. Declaro também que o desenvolvedor e administrador do sistema (Gabriel) está inteiramente isento de qualquer responsabilidade civil, legal ou financeira decorrente de erros de digitação, falhas no envio de pedidos de compras pelo WhatsApp, perdas de estoque ou uso indevido da plataforma por minha parte.<br><br>
                    Tenho ciência de que todas as minhas ações no aplicativo são registradas no log de auditoria do sistema em tempo real.
                </div>
            `;
            Swal.fire({
                title: 'Termo de Responsabilidade',
                html: textoTermo,
                background: '#1E1E1E',
                color: '#FFF',
                confirmButtonColor: '#FFAB00'
            });
        },
        salvarNovoPerfil() {
            if (this.novoPin.length !== 4) {
                Swal.fire({ icon: 'warning', text: 'O PIN deve ter 4 números.', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            if (!this.nomeCompleto.trim() || !this.dataNascimento) {
                Swal.fire({ icon: 'warning', text: 'Preencha nome completo e data.', background: '#1E1E1E', color: '#FFF' });
                return;
            }
            if (!this.aceitouTermo) {
                Swal.fire({ icon: 'error', title: 'Atenção', text: 'É obrigatório ler e aceitar o Termo de Responsabilidade.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            const idx = this.$root.equipe.findIndex(u => u.id === this.usuarioTemp.id);
            this.$root.equipe[idx].pin = this.novoPin;
            this.$root.equipe[idx].nomeCompleto = this.nomeCompleto;
            this.$root.equipe[idx].nascimento = this.dataNascimento;
            this.$root.equipe[idx].termoAceito = true;
            this.$root.equipe[idx].dataTermoAceito = new Date().toLocaleString('pt-BR');

            // SINCRONIZA USUÁRIO NO FIREBASE
            db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true });
            this.$root.salvarMemoriaLocal();
            
            Swal.fire({ icon: 'success', title: 'Registado!', timer: 1500, showConfirmButton: false, background: '#1E1E1E' }).then(() => {
                this.logarUsuario(this.$root.equipe[idx]);
                this.etapa = 'padrao';
                this.novoPin = '';
                this.aceitouTermo = false;
            });
        },
        solicitarReset() {
            const u = this.$root.equipe.find(x => x.nome.toLowerCase() === this.nomeRecuperacao.trim().toLowerCase());
            if (u) {
                this.$root.pedidosResetSenha.push({ id: Date.now(), idUsuario: u.id, nome: u.nome, dataStr: new Date().toLocaleDateString('pt-BR') });
                this.$root.salvarMemoriaLocal();
                Swal.fire({ icon: 'success', title: 'Enviado', text: 'Aguarde a gerência autorizar.', background: '#1E1E1E', color: '#FFF' });
                this.etapa = 'padrao';
                this.nomeRecuperacao = '';
            } else {
                Swal.fire({ icon: 'error', text: 'Usuário não encontrado.', background: '#1E1E1E', color: '#FFF' });
            }
        },
        logarUsuario(u) {
            this.$root.usuario = u;
            this.$root.vibrar([50, 50]);
            this.$root.registrarHistorico('Acesso', 'Login');
            this.$root.mudarTela('tela-dashboard');
        }
    },
    mounted() {
        if (!document.getElementById('css-log')) {
            const style = document.createElement('style');
            style.id = 'css-log';
            style.innerHTML = `
                .input-nativo { width: 100%; padding: 15px; border-radius: 8px; border: 1px solid #444; background: #2C2C2C; color: white; font-size: 1.1rem; box-sizing: border-box; margin-bottom: 15px; text-align: center; }
                .label-ia { color: #AAA; font-size: 0.75rem; font-weight: bold; margin-bottom: 5px; display: block; letter-spacing: 1px; }
            `;
            document.head.appendChild(style);
        }
    }
});
// FIM DO ARQUIVO modulos/login.js
