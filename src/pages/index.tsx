/*Três formas de Consumir API dentro do React:
  - SPA
  - SSR
  - SSG
*/

import { GetStaticProps } from 'next'; // Tipagem da função, ou seja, como é seu formato, seu retorno, seus parâmetros, etc.

import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string,
  title: string, 
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string,
}

type HomeProps = {
  episodes: Episode[] // ou Array<Episode>
}

export default function Home(props: HomeProps) {
  return (
    <>
      <h1> Index </h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

// SSG 
export const getStaticProps: GetStaticProps =  async () => {
  //  const response = await api.get('/episodes?_limit=12&_sort=published_at&_order=desc'

  // const data = await response.data;

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title, 
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  return {
    props: {
      episodes,
    },
    revalidate:  60 * 60 * 8, // Número em segundos de quanto em quanto tempo eu quero gerar uma nova versão dessa página. Nesse caso, uma nova versão será gerada a cada 8h.
  }
}