/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
// import { useRouter } from "next/router"
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import { usePlayer } from "../../contexts/PlayerContext";

import styles from "./episode.module.scss"

type Episode = {
  id: string,
  title: string, 
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string,
  description: string,
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode } : EpisodeProps) {
    //const router = useRouter();
    const { play } = usePlayer();

    return (
        //<h1>{router.query.slug}</h1>

        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
               
                <Image
                    width={700} 
                    height={160} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{__html: episode.description}}
            />
        </div>
        // dangerouslySetInnerHTML: É uma propriedade usada para forçar o React a converter e rendendizar o conteúdo em formato HTML.
    )
}

// Método para lidar com paginas estáticas e dinâmicas.
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
    })

    const paths = data.map( episode => {
        return {
            params: {
                slug: episode.id, 
            }
        }
    })

    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => { // ctx = contexto
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)
    
    const episode = {
        id: data.id,
        title: data.title, 
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // Recarregar a página a cada 24 horas.
    }
}