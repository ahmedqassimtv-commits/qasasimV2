import { useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis, { scroll } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Message from './components/Message'
import Track from './components/Track'
import OnOff from './components/OnOff'
import Hall from './components/Hall'
import { Videos, Socials, Footer } from './components/Lower'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  useLenis()

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
