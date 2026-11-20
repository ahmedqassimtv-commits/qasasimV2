import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis, { scroll } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Message from './components/Message'
import Track from './components/Track'
import OnOff from './components/OnOff'
import Hall from './components/Hall'
import Articles from './components/Articles'
import { initReveal } from './lib/reveal'
import { Videos, Socials, Footer } from './components/Lower'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  useLenis()

  // حركة ظهور النصوص بالشريط الليموني — بعد ما الخطوط تحمل (عشان تقسيم السطور يبقى صح)
  useEffect(() => {
    if (!ready) return
    let stop
    document.fonts.ready.then(() => { stop = initReveal(); requestAnimationFrame(() => ScrollTrigger.refresh()) })
    return () => stop?.()
  }, [ready])

  const done = () => {
    setLoading(false)
    setReady(true)
    scroll.lenis?.start()
    ScrollTrigger.refresh()
  }

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Nav ready={ready} />
      <main>
        <Hero />
        <Message />
        <Track />
        <OnOff />
        <Videos />
        <Articles />
        <Hall />
        <Socials />
      </main>
      <Footer />
      <div className="landscape">
        <p>لف الموبايل من فضلك،<br /><span className="serif">التجربة دي بالطول.</span></p>
      </div>
    </>
  )
}
