import { GoogleGenAI, Type } from "@google/genai";

const IA_Resolucao = {
    async resolverErro(contexto, root) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                tipo: { 
                    type: Type.STRING, 
                    description: "Tipo da resolução: CORRECAO, PROPORCAO, CONVERSAO, CHATBOT" 
                },
                titulo: { type: Type.STRING },
                mensagem: { type: Type.STRING },
                icone: { type: Type.STRING, description: "Ícone FontAwesome (ex: fa-check-circle)" },
                cor: { type: Type.STRING, description: "Cor hexadecimal para o botão de ação" },
                sugestao: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING, description: "Texto do botão de ação" },
                        acao: {
                            type: Type.OBJECT,
                            properties: {
                                tipo: { type: Type.STRING, description: "ADD_ITEM, UPDATE_QUANTITY" },
                                produtoId: { type: Type.STRING },
                                quantidade: { type: Type.NUMBER },
                                unidade: { type: Type.STRING }
                            },
                            required: ["tipo"]
                        }
                    },
                    required: ["label", "acao"]
                }
            },
            required: ["tipo", "titulo", "mensagem", "icone", "cor", "sugestao"]
        };

        const prompt = `
            Você é a IA do PiZZA Master, um ERP inteligente para pizzarias.
            Seu objetivo é resolver erros de entrada de dados dos funcionários.
            
            BANCO DE PRODUTOS ATUAL:
            ${JSON.stringify(root.bancoProdutos.map(p => ({ id: p.id, nome: p.nome, unidade: p.unidade, categoria: p.categoria })))}
            
            CONTEXTO DO ERRO:
            ${JSON.stringify(contexto)}
            
            REGRAS:
            1. Se o item não for encontrado, busque o mais similar ou um sinônimo no banco de produtos.
            2. Se a quantidade for absurda (ex: 50kg de fermento para 10kg de farinha), sugira a correção baseada em proporções reais de pizzaria (fermento costuma ser 1% a 3% da farinha).
            3. Se a unidade for incompatível (ex: "caixas" para molho que é em "litros"), converta usando bom senso (ex: 1 caixa de molho = 12 litros).
            4. Se for uma descrição vaga, tente identificar o produto.
            
            Responda APENAS o JSON estruturado.
        `;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            return JSON.parse(response.text);
        } catch (e) {
            console.error("Erro na IA de Resolução:", e);
            return null;
        }
    }
};

window.IA_Resolucao = IA_Resolucao;
export default IA_Resolucao;
