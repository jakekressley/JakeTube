import styles from './page.module.css'
import { getVideos } from './utilities/firebase/functions'
import Image from 'next/image'
import Link from 'next/link'


export default async function Home() {
  const videos = await getVideos()
  console.log(videos)
  return (
    <main className={styles.main}>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`}>
            <Image src={`/thumbnail.png`} alt='video' width={120} height={80} className={styles.thumbnail} />
          </Link>
        ))
      }
    </main>
  )
}
