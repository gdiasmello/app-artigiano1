// INÍCIO DO ARQUIVO modulos/ajustes_avisos.js - v1.1.1
Vue.component('tela-ajustes-avisos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #FFAB00;">📢 Mural de Avisos</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 4px solid #FFAB00; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: white; margin-top: 0;">Publicar Novo Aviso</h3>
            
            <label class="label-ia">Mensagem do Aviso</label>
            <textarea v-model="novoAviso.texto" rows="3" placeholder="Escreva o aviso para a equipe aqui..." class="input-dark" style="resize: none; margin-bottom: 15px;"></textarea>
            
            <label style="display: flex; align-items: center; gap: 10px; color: #FF5252; font-weight: bold; cursor: pointer; background: rgba(255, 82, 82, 0.1); padding: 12px; border-radius: 8px; border: 1px dashed #FF5252; margin-bottom: 20px;">
                <input type="checkbox" v-model="novoAviso.urgente" style="transform: scale(1.3);"> 
                <i class="fas fa-exclamation-triangle"></i> MARCAR COMO URGENTE
            </label>

            <label class="label-ia">Público-Alvo</label>
            <select v-model="novoAviso.publico" class="input-dark" style="margin-bottom: 15px;">
                <option value="Todos">Todos na Loja</option>
                <option value="Administrador">Apenas Admins</option>
                <option value="Gerente">Apenas Gerentes</option>
                <option value="Pizzaiolo">Apenas Pizzaiolos</option>
                <option value="Atendente">Apenas Atendentes</option>
            </select>
                
            <div style="background: #222; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <label class="label-ia" style="color: #FFAB00;"><i class="fas fa-clock"></i> Duração do Aviso</label>
                <select v-model="modoDuracao" class="input-dark" style="margin-bottom: 10px;">
                    <option value="fixo">Fixo (Não apaga sozinho)</option>
                    <option value="horas">Horas</option>
                    <option value="dias">Dias</option>
                    <option value="semanas">Semanas</option>
                    <option value="personalizado">Data Personalizada</option>
                </select>

                <div v-if="['horas', 'dias', 'semanas'].includes(modoDuracao)" style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" inputmode="numeric" v-model.number="qtdDuracao" class="input-dark" style="width: 80px; text-align: center;">
                    <span style="color: white; font-weight: bold;">{{ modoDuracao.charAt(0).toUpperCase() + modoDuracao.slice(1) }}</span>
                </div>

                <div v-if="modoDuracao === 'personalizado'">
                    <label class="label-ia">Escolha o dia e hora de encerramento:</label>
                    <input type="datetime-local" v-model="dataCustom" class="input-dark">
                </div>
            </div>

            <button @click="publicarAviso" class="btn" style="background: #FFAB00; color: #121212; font-weight: bold; width: 100%; height: 50px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-paper-plane"></i> POSTAR AVISO
            </button>
        </div>

        <h3 style="color: #AAA; margin-bottom: 15px;">Avisos Ativos na Loja</h3>
        
        <div v-if="$root.avisos.length === 0" style="text-align: center; color: #666; margin-top: 20px;">
            Nenhum aviso no mural neste momento.
        </div>

        <div v-for="aviso in $root.avisos" :key="aviso.id" class="card animate__animated animate__fadeIn" style="padding: 15px; margin-bottom: 10px; border-left: 4px solid;" :style="aviso.urgente ? 'border-color: #FF5252;' : 'border-color: #FFAB00;'" style="position: relative;">
            
            <button @click="apagarAviso(aviso.id)" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer;">
                <i class="fas fa-trash-alt"></i>
            </button>

            <div style="margin-right: 30px;">
                <span v-if="aviso.urgente" style="display: inline-block; background: #FF5252; color: #FFF; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-bottom: 8px;">
                    <i class="fas fa-exclamation-triangle"></i> URGENTE
                </span>
                
                <p style="color: white; font-size: 1rem; margin: 0 0 10px 0; line-height: 1.4;">{{ aviso.texto }}</p>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.75rem;">
                    <span style="background: #333; color: #FFAB00; padding: 4px 8px; border-radius: 4px; font-weight: bold;"><i class="fas fa-users"></i> Público: {{ aviso.publico }}</span>
                    <span style="background: #222; color: #AAA; padding: 4px 8px; border-radius: 4px;"><i class="fas fa-user-edit"></i> De: {{ aviso.autor }}</span>
                    <span :style="estaExpirado(aviso) ? 'background: rgba(255,82,82,0.1); color: #FF5252; border: 1px solid #FF5252;' : 'background: #222; color: #00E676;'" style="padding: 4px 8px; border-radius: 4px;">
                        <i class="fas fa-hourglass-half"></i> {{ formatarValidade(aviso) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            novoAviso: { texto: '', publico: 'Todos', urgente: false },
            modoDuracao: 'dias',
            qtdDuracao: 1,
            dataCustom: ''
        };
    },
    mounted() {
        if (!document.getElementById('css-avisos-v111')) {
            const style = document.createElement('style'); style.id = 'css-avisos-v111';
            style.innerHTML = `.input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none; } .input-dark:focus { border-color: #FFAB00; } .label-ia { color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }`;
            document.head.appendChild(style);
        }
    },
    methods: {
        publicarAviso() {
            if (!this.novoAviso.texto.trim()) {
                Swal.fire({ icon: 'warning', title: 'Escreva algo', text: 'O texto do aviso não pode estar vazio.', background: '#1E1E1E', color: '#FFF' });
                return;
            }

            this.$root.vibrar(30);
            
            let expTime = null;
            if (this.modoDuracao === 'horas') {
                expTime = Date.now() + (this.qtdDuracao * 60 * 60 * 1000);
            } else if (this.modoDuracao === 'dias') {
                expTime = Date.now() + (this.qtdDuracao * 24 * 60 * 60 * 1000);
            } else if (this.modoDuracao === 'semanas') {
                expTime = Date.now() + (this.qtdDuracao * 7 * 24 * 60 * 60 * 1000);
            } else if (this.modoDuracao === 'personalizado' && this.dataCustom) {
                expTime = new Date(this.dataCustom).getTime();
            }
            
            const avisoData = {
                id: Date.now(),
                texto: this.novoAviso.texto.trim(),
                publico: this.novoAviso.publico,
                urgente: this.novoAviso.urgente, // 🟢 Guarda a urgência na nuvem
                autor: this.$root.usuario.nome,
                dataStr: new Date().toLocaleDateString('pt-BR'),
                expiracao: expTime
            };

            this.$root.avisos.unshift(avisoData);
            this.salvarNuvem();

            // Regista no Histórico com o nível de urgência
            const nivel = this.novoAviso.urgente ? '🚨 URGENTE' : 'Normal';
            this.$root.registrarHistorico('Mural', 'Comunicação', `Criou aviso ${nivel} para: ${this.novoAviso.publico}`);

            this.novoAviso.texto = '';
            this.novoAviso.urgente = false;
            Swal.fire({ icon: 'success', title: 'Publicado!', text: 'O aviso já está ativo.', timer: 1500, showConfirmButton: false, background: '#1E1E1E' });
        },
        
        apagarAviso(id) {
            this.$root.vibrar(20);
            Swal.fire({ title: 'Apagar Aviso?', text: "Remover o aviso da loja?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#FF5252', background: '#1E1E1E', color: '#FFF' })
            .then((result) => {
                if (result.isConfirmed) {
                    this.$root.avisos = this.$root.avisos.filter(a => a.id !== id);
                    this.salvarNuvem();
                    this.$root.registrarHistorico('Mural', 'Comunicação', 'Apagou um aviso antigo via painel.');
                }
            });
        },
        
        salvarNuvem() {
            db.collection("configuracoes").doc("avisos").set({ lista: this.$root.avisos }, { merge: true });
            this.$root.salvarMemoriaLocal();
        },

        estaExpirado(aviso) {
            if (!aviso.expiracao) return false;
            return Date.now() > aviso.expiracao;
        },

        formatarValidade(aviso) {
            if (!aviso.expiracao) return "Fixo (Não expira)";
            if (this.estaExpirado(aviso)) return "Expirado (Oculto)";
            const dataExp = new Date(aviso.expiracao);
            return `Até ${dataExp.toLocaleDateString('pt-BR')} às ${dataExp.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_avisos.js
