import { TERMOS_TECNICOS, INTENCOES, CAMPOS_FILTRO, FUNCOES_ORCAMENTO } from '@/data/thesaurus/termosAgente'
import { filtrarDespesas, getServidores, getContratos, getReceitas } from './portalApi'
import type { TipoIntencao } from '@/data/thesaurus/termosAgente'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_MODEL = 'deepseek-chat'

export interface MensagemHistorico {
  role: 'user' | 'assistant'
  text: string
}

export interface RespostaAgente {
  mensagem: string
  intencao?: TipoIntencao | null
  filtros?: Record<string, string>
  linkDetalhe?: string
  resumoDados?: string
}

function montarSystemPrompt(): string {
  const termosFormatados = Object.entries(TERMOS_TECNICOS)
    .map(([tecnico, cidadao]) => `  "${tecnico}" = "${cidadao}"`)
    .join('\n')

  const funcoesFormatadas = FUNCOES_ORCAMENTO.map(
    (f) => `  ${f.nome} (sinônimos: ${f.sinonimos.join(', ')})`,
  ).join('\n')

  const camposFormatados = Object.entries(CAMPOS_FILTRO)
    .map(([cat, campos]) => {
      const lista = Object.entries(campos)
        .map(([k, v]) => `    - ${k}: ${v}`)
        .join('\n')
      return `  ${cat}:\n${lista}`
    })
    .join('\n')

  return `Você é um assistente de transparência pública do Portal da Transparência do Maranhão (MA).
Seu objetivo é ajudar cidadãos a consultar dados públicos usando linguagem simples e acessível.

CATEGORIAS DE DADOS DISPONÍVEIS:
- despesas: gastos do governo estadual
- servidores: funcionários públicos e salários
- contratos: contratos com empresas (licitações)
- receitas: arrecadação de impostos e transferências

GLOSSÁRIO (termos técnicos → linguagem cidadã):
${termosFormatados}

ÁREAS ORÇAMENTÁRIAS (função):
${funcoesFormatadas}

FILTROS DISPONÍVEIS POR CATEGORIA:
${camposFormatados}

INTENÇÕES RECONHECIDAS:
- despesas: ${INTENCOES.despesas.join(', ')}
- servidores: ${INTENCOES.servidores.join(', ')}
- contratos: ${INTENCOES.contratos.join(', ')}
- receitas: ${INTENCOES.receitas.join(', ')}

INSTRUÇÕES:
1. Identifique a intenção do usuário (despesas, servidores, contratos, receitas ou null se não souber).
2. Extraia filtros relevantes da pergunta (ano, funcao, etc.).
3. Para "funcao", mapeie sinônimos para o nome oficial (ex: "saúde" → "Saúde", "escola" → "Educação").
4. Responda SEMPRE em português, usando linguagem simples e acessível ao cidadão comum.
5. Nunca invente dados — use apenas os fornecidos no contexto de dados reais.
6. Se não souber responder, diga honestamente e sugira uma busca mais específica.

FORMATO DE RESPOSTA (JSON obrigatório):
{
  "mensagem": "texto da resposta em linguagem cidadã",
  "intencao": "despesas" | "servidores" | "contratos" | "receitas" | null,
  "filtros": { "campo": "valor" },
  "linkDetalhe": "/despesas" | "/servidores" | "/contratos" | "/receitas" | null
}

Retorne APENAS o JSON, sem markdown, sem bloco de código, sem texto extra.`
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function consultarDados(
  intencao: TipoIntencao,
  filtros: Record<string, string>,
): Promise<string> {
  try {
    if (intencao === 'despesas') {
      const resp = await filtrarDespesas({
        ano: filtros.ano ? Number(filtros.ano) : undefined,
        funcao: filtros.funcao,
        natureza: filtros.natureza,
        situacao: filtros.situacao,
        fornecedor: filtros.fornecedor,
      })
      const { resumo, meta } = resp
      return `Encontrei ${meta.total_registros.toLocaleString('pt-BR')} registros. Total pago: ${formatarMoeda(resumo.total_pago)}. Total comprometido: ${formatarMoeda(resumo.total_empenhado)}.`
    }

    if (intencao === 'servidores') {
      const resp = await getServidores(filtros.ano ? Number(filtros.ano) : undefined)
      return `Existem ${resp.resumo.total_servidores.toLocaleString('pt-BR')} servidores públicos ativos no cadastro.`
    }

    if (intencao === 'contratos') {
      const resp = await getContratos(filtros.ano ? Number(filtros.ano) : undefined)
      const { total_contratos, valor_total } = resp.resumo
      return `Encontrei ${total_contratos} contratos com valor total de ${formatarMoeda(valor_total)}.`
    }

    if (intencao === 'receitas') {
      const resp = await getReceitas(filtros.ano ? Number(filtros.ano) : undefined)
      const { total_arrecadado, total_previsto, percentual_execucao } = resp.resumo
      return `Arrecadação: ${formatarMoeda(total_arrecadado)} de ${formatarMoeda(total_previsto)} previstos (${percentual_execucao}% executado).`
    }
  } catch {
    // silencia — sem dados disponíveis
  }
  return ''
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: { content?: string }
  }>
}

export async function enviarMensagem(
  mensagemUsuario: string,
  historico: MensagemHistorico[] = [],
): Promise<RespostaAgente> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined

  if (!apiKey) {
    return {
      mensagem:
        'O assistente não está configurado. Adicione a chave VITE_DEEPSEEK_API_KEY no arquivo .env.',
      intencao: null,
    }
  }

  const messages = [
    { role: 'system', content: montarSystemPrompt() },
    ...historico.map((m) => ({ role: m.role, content: m.text })),
    { role: 'user', content: mensagemUsuario },
  ]

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek API error:', err)
      return {
        mensagem: 'Não consegui processar sua pergunta agora. Tente novamente em instantes.',
        intencao: null,
      }
    }

    const json: DeepSeekResponse = await response.json()
    const rawText = json.choices?.[0]?.message?.content ?? ''

    let parsed: RespostaAgente
    try {
      parsed = JSON.parse(rawText.trim())
    } catch {
      // modelo às vezes inclui markdown fence mesmo pedindo sem
      const match = rawText.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        return { mensagem: rawText || 'Não entendi sua pergunta. Pode reformular?', intencao: null }
      }
    }

    if (parsed.intencao && parsed.filtros !== undefined) {
      const resumoDados = await consultarDados(parsed.intencao as TipoIntencao, parsed.filtros ?? {})
      if (resumoDados) {
        parsed.resumoDados = resumoDados
        parsed.mensagem = `${parsed.mensagem}\n\n📊 ${resumoDados}`
      }
    }

    return parsed
  } catch (err) {
    console.error('Erro ao chamar DeepSeek:', err)
    return {
      mensagem: 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.',
      intencao: null,
    }
  }
}
