// INÍCIO DO ARQUIVO modulos/ajustes_equipe.js - v0.0.93
Vue.component('tela-ajustes-equipe', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #D50000;">👥 Equipe</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div v-if="modo === 'lista'">
            <button @click="abrirNovo" class="btn" style="background: #D50000; color: white; margin-bottom: 20px;">
                <i class="fas fa-user-plus"></i> ADICIONAR FUNCIONÁRIO
            </button>

            <div v-for="m in $root.equipe" :key="m.id" class="card" style="padding: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #444;">
                <div @click="editar(m)" style="flex: 1; cursor: pointer;">
                    <strong style="color: white; font-size: 1.1rem; display: block;">{{ m.nome }}</strong>
                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 5px; flex-wrap: wrap;">
                        <span style="background: #333; color: #AAA; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">{{ m.cargo }}</span>
                        <span v-if="m.pin === '1234'" style="background: #FFAB00; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">PENDENTE SETUP</span>
                        <span v-if="m.termoAceito" style="background: rgba(0,230,118,0.1); color: #00E676; border: 1px solid #00E676; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">
                            <i class="fas fa-file-signature"></i> TERMO OK
                        </span>
                    </div>
                </div>
                <div style="display: flex; gap: 15px;">
                    <button v-if="m.termoAceito" @click="gerarPDF(m)" style="background: none; border: none; color: #FFF; font-size: 1.2rem;"><i class="fas fa-file-pdf"></i></button>
                    <button @click="editar(m)" style="background: none; border: none; color: #00B0FF; font-size: 1.2rem;"><i class="fas fa-edit"></i></button>
                </div>
            </div>
        </div>

        <div v-else class="card animate__animated animate__fadeInUp" style="border-top: 4px solid #D50000; padding: 20px;">
            <h3 style="color: white; margin-top: 0;">{{ editandoId ? 'Editar Permissões' : 'Novo Funcionário' }}</h3>
            
            <label class="label-ia">Nome Curto (Login)</label>
            <input type="text" v-model="form.nome" placeholder="Ex: João" class="input-dark" style="margin-bottom: 15px;" />
            
            <label class="label-ia">Cargo / Função</label>
            <select v-model="form.cargo" class="input-dark" style="margin-bottom: 25px;">
                <option value="Pizzaiolo">Pizzaiolo</option>
                <option value="Atendente">Atendente</option>
                <option value="Gerente">Gerente</option>
            </select>

            <h4 style="color: #FF5252; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">Acessos Liberados</h4>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                <div v-for="(val, chave) in listaPermissoes" :key="chave" @click="form.permissoes[chave] = !form.permissoes[chave]" style="display: flex; align-items: center; gap: 15px; background: #222; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid #333;">
                    <div style="width: 40px; height: 22px; background: #444; border-radius: 20px; position: relative; transition: 0.3s;" :style="form.permissoes[chave] ? 'background: #00E676;' : ''">
                        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s;" :style="form.permissoes[chave] ? 'left: 21px;' : ''"></div>
                    </div>
                    <span style="color: #EEE; font-size: 0.9rem;">{{ val }}</span>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 25px;">
                <button @click="modo = 'lista'" class="btn" style="background: #444; color: white; flex: 1;">CANCELAR</button>
                <button @click="salvar" class="btn" style="background: #D50000; color: white; flex: 2;">SALVAR E GERAR PIN</button>
            </div>
            <button v-if="editandoId && editandoId !== $root.usuario.id" @click="apagar(editandoId)" class="btn" style="background: none; border: 1px dashed #FF5252; color: #FF5252; margin-top: 15px;">EXCLUIR FUNCIONÁRIO</button>
        </div>
    </div>
    `,
    data() {
        return {
            modo: 'lista',
            editandoId: null,
            form: {
                nome: '', cargo: 'Atendente', pin: '1234', 
                // Estes dados são deixados em branco para o funcionário preencher no 1º login
                nomeCompleto: '', nascimento: '', termoAceito: false, dataTermoAceito: '',
                permissoes: { admin: false, producao: false, pedidos: false, limpeza: true, gerenciar: false, historico: false, avisos: false, adicionar: false, remover: false },
                preferencias: { vibracao: true, biometriaAtiva: false, saudacaoZap: '', despedidaZap: 'Obrigado.' }
            },
            listaPermissoes: {
                admin: 'Admin (Acesso Total)', producao: 'Ver Produção', pedidos: 'Fazer Pedidos (Compras)', limpeza: 'Ver Limpeza',
                gerenciar: 'Gerenciar ERP', historico: 'Ver Auditoria', avisos: 'Mural Avisos', adicionar: 'Adicionar Itens', remover: 'Apagar Itens'
            }
        };
    },
    mounted() {
        db.collection("configuracoes").doc("equipe").onSnapshot((doc) => {
            if (doc.exists) {
                this.$root.equipe = doc.data().lista;
                this.$root.salvarMemoriaLocal();
            }
        });
        if (!document.getElementById('css-eqp')) {
            const style = document.createElement('style');
            style.id = 'css-eqp';
            style.innerHTML = `
                .input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; }
                .label-ia { color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }
            `;
            document.head.appendChild(style);
        }
    },
    methods: {
        voltar() {
            if (this.modo !== 'lista') this.modo = 'lista';
            else this.$root.mudarTela('tela-ajustes');
        },
        abrirNovo() {
            this.editandoId = null;
            this.form = {
                nome: '', cargo: 'Atendente', pin: '1234', nomeCompleto: '', nascimento: '', termoAceito: false, dataTermoAceito: '',
                permissoes: { admin: false, producao: false, pedidos: false, limpeza: true, gerenciar: false, historico: false, avisos: false, adicionar: false, remover: false },
                preferencias: { vibracao: true, biometriaAtiva: false, saudacaoZap: '', despedidaZap: 'Obrigado.' }
            };
            this.modo = 'form';
        },
        editar(m) {
            this.editandoId = m.id;
            this.form = JSON.parse(JSON.stringify(m));
            this.modo = 'form';
        },
        salvar() {
            if (!this.form.nome.trim()) return;
            this.$root.autorizarAcao('admin', () => {
                if (this.editandoId) {
                    const i = this.$root.equipe.findIndex(u => u.id === this.editandoId);
                    // Preserva os dados que o funcionário já preencheu caso você edite apenas as permissões
                    this.form.nomeCompleto = this.$root.equipe[i].nomeCompleto || '';
                    this.form.nascimento = this.$root.equipe[i].nascimento || '';
                    this.form.termoAceito = this.$root.equipe[i].termoAceito || false;
                    this.form.dataTermoAceito = this.$root.equipe[i].dataTermoAceito || '';
                    this.form.pin = this.$root.equipe[i].pin || '1234';
                    
                    this.$root.equipe[i] = { ...this.form };
                } else {
                    this.$root.equipe.push({ ...this.form, id: Date.now() });
                }
                
                db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true });
                this.$root.salvarMemoriaLocal();
                this.modo = 'lista';
                Swal.fire({ icon: 'success', title: 'Salvo!', text: 'A senha provisória é 1234', timer: 1500, showConfirmButton: false, background: '#1E1E1E' });
            });
        },
        apagar(id) {
            Swal.fire({ title: 'Excluir?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF' }).then((r) => {
                if (r.isConfirmed) {
                    this.$root.equipe = this.$root.equipe.filter(u => u.id !== id);
                    db.collection("configuracoes").doc("equipe").set({ lista: this.$root.equipe }, { merge: true });
                    this.$root.salvarMemoriaLocal();
                    this.modo = 'lista';
                }
            });
        },
        gerarPDF(m) {
            this.$root.vibrar(30);
            const tela = window.open('', '_blank');
            tela.document.write(`
                <html><head><title>Termo de Uso - ${m.nomeCompleto}</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="margin: 0;">PIZZA MASTER GESTÃO</h1>
                        <h3 style="margin: 5px 0; color: #555;">Termo de Isenção de Responsabilidade Operacional</h3>
                    </div>
                    <p style="text-align: justify; font-size: 1.1rem;">
                        Eu, <b>${m.nomeCompleto || m.nome}</b>, portador da data de nascimento <b>${m.nascimento || 'Não informada'}</b>, declaro que compreendo e aceito os termos operacionais ao utilizar o aplicativo de gestão da pizzaria.<br><br>
                        Comprometo-me a realizar as contagens de estoque, produção e registos com a máxima atenção. Declaro para os devidos fins legais que o desenvolvedor do aplicativo, <b>Gabriel</b>, está total e inteiramente isento de qualquer responsabilidade sobre erros de contagem, pedidos de compras incorretos gerados pelo app, perdas financeiras ou quebras de estoque na operação.<br><br>
                        Declaro ainda ter ciência de que o aplicativo é uma ferramenta de software independente e <b>não possui qualquer vínculo legal, societário ou trabalhista com a pizzaria</b>, servindo apenas como facilitador de cálculos e registos.<br><br>
                        Reconheço que todas as minhas interações no sistema são registadas digitalmente na Auditoria.
                    </p>
                    <br><br><br><br>
                    <div style="text-align: center; margin-top: 50px;">
                        ______________________________________________________________<br><br>
                        <b>${m.nomeCompleto || m.nome}</b><br>
                        <small>Assinatura Eletrônica registrada pelo sistema em: ${m.dataTermoAceito}</small><br>
                        <small>ID de Registo na Nuvem: ${m.id}</small>
                    </div>
                    <script>setTimeout(function(){ window.print(); window.close(); }, 1000);</script>
                </body></html>
            `);
            tela.document.close();
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_equipe.js
