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
    label: 'Pesquisar posts',
    all: 'Tudo',
  },
  rss: {
    title: 'PLOG',
    description: 'Meu blog técnico, em português, escrito enquanto aprendo.',
  },
}
