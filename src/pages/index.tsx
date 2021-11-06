// Três formas de Consumir API dentro do React:

// import { useEffect } from "react"

export default function Home(props) {

   
  //1. SPA (funciona em qualquer projeto React)

  /*
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])
  */

  console.log(props.episodes) // Dados foram carregados no Next.js e podem ser vistos no terminal onde o 'yarn dev' está sendo rodado. Para observar os dados no browser, adicionar <p>{JSON.stringify(props.episodes)}</p> no return da página.

  return (
    <>
      <h1> Index </h1>
    </>
  )
}

// 2. SSR (funciona apenas para Next.js)

/*
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    }
  }
}
*/


// 3. SSG (funciona apenas para Next.js)

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate:  60 * 60 * 8, // Número em segundos de quanto em quanto tempo eu quero gerar uma nova versão dessa página. Nesse caso, uma nova versão será gerada a cada 8h.
  }
}