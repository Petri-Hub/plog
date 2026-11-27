import type { Strings } from '@/types/i18n.types'

export const ptBr: Strings = {
  header: {
    subtitle: "petri's log",
    language: 'Idioma',
    theme: 'Modo escuro',
  },
  footer: {
    tagline: 'Um registro do que estou estudando, escrito enquanto eu aprendo. Por Petri.',
    blog: 'Este blog',
    home: 'Início',
    sitemap: 'Mapa do site',
    elsewhere: 'Em outros lugares',
    portfolio: 'Portfólio',
    built: 'Feito com Astro.',
    source: 'Código-fonte',
  },
  home: {
    title: 'Início',
    description: 'Meu blog técnico, em português e inglês, escrito enquanto aprendo.',
    note: 'escrito enquanto eu aprendo',
    heading: 'Um registro do que estou',
    words: ['estudando', 'construindo', 'quebrando', 'lendo'],
    subheading:
      'Engenharia de software, infraestrutura e meu homelab, explicados enquanto eu aprendo. Todo post em português e inglês.',
    highlights: 'Comece por aqui',
    highlightsNote: 'os posts que eu mostraria primeiro',
    recents: 'Todos os posts',
    recentsNote: 'do mais novo ao mais antigo',
    upcoming: 'Em breve',
    upcomingNote: 'a lista de tarefas deste blog',
  },
  upcoming: {
    analytics: {
      title: 'Métricas',
      text: 'Uma visão simples de quais posts as pessoas leem de verdade, pra eu saber o que escrever a seguir.',
    },
    newsletter: {
      title: 'Newsletter',
      text: 'Posts novos no seu e-mail, sem precisar ficar voltando aqui.',
    },
    comments: {
      title: 'Comentários',
      text: 'Me diga onde errei, logo abaixo de cada post. Markdown é bem-vindo.',
    },
    decentPosts: {
      title: 'Posts decentes',
      text: 'Tô trabalhando nisso. Tudo aí em cima foi treino.',
    },
    next: 'próximo',
    planned: 'planejado',
    someday: 'algum dia',
  },
  errors: {
    404: {
      title: 'Página não encontrada',
      heading: 'Parece que esta página não existe',
      description: 'Vamos voltar para a página inicial',
      back: 'Voltar',
    },
    500: {
      title: 'Erro',
      heading: 'Um erro aconteceu aqui',
      description: 'Vamos voltar para a página inicial',
      back: 'Voltar',
    },
  },
  search: {
    button: 'Buscar',
    label: 'Buscar posts',
    placeholder: 'Busque posts, tags, qualquer coisa…',
    close: 'Fechar busca',
    recent: 'Posts recentes',
    matches: 'Mais relevantes',
    resultOne: '1 resultado',
    resultMany: '{count} resultados',
    empty: 'Nada aqui. Nem o DNS.',
    emptyHint: 'Tente menos palavras, ou uma tag como #networks.',
    keyMove: 'para navegar',
    keyOpen: 'para abrir',
    keyClose: 'para fechar',
  },
  code: {
    copy: 'copiar',
    copied: 'copiado',
    failed: 'falha ao copiar',
  },
  post: {
    back: 'todos os posts',
    minutes: 'min de leitura',
    contents: 'neste post',
    tldr: 'TL;DR · sem tempo pra ler? pergunte ao Claude',
    tldrPrompt:
      'Leia o artigo em {url} e me entregue:\n1. Um TL;DR em duas ou três frases.\n2. Os pontos principais, numa lista curta.\n3. Comandos ou configurações que valem guardar.\n4. Uma pergunta que eu deveria saber responder depois de ler.\n5. O que eu perco lendo só este resumo, e por que vale a pena ler o post inteiro.\nSeja breve e responda em português.',
    newTab: '(abre em nova aba)',
    keepReading: 'Continue lendo',
    keepReadingNote: 'os posts ao lado deste',
    newer: '← mais novo',
    older: 'mais antigo →',
  },
  rss: {
    title: 'PLOG',
    description: 'Meu blog técnico, em português, escrito enquanto aprendo.',
  },
}
