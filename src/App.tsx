import { useEffect, useRef, useState } from 'react'
import './main.scss'
import clsx from 'clsx'

interface ILink {
  label: string
  img: string
}

const LINKS: ILink[] = [
  {
    label: 'Ikari no Kyuba',
    img: '1.jpg',
  },
  {
    label: 'I Am Cuba',
    img: '2.jpg',
  },
  {
    label: 'Je suis Cuba',
    img: '3.jpg',
  },
  {
    label: 'Soy Cuba',
    img: '4.jpg',
  },
  {
    label: 'Eu Sou Cuba',
    img: '5.jpg',
  },
  {
    label: '我是古巴',
    img: '6.jpg',
  },
  {
    label: 'Είμαι η Κούβα',
    img: '7.jpg',
  },
]

const getImageUrl = (x: string) => {
  return new URL(`/src/assets/img/${x}`, import.meta.url).href
}

const App = () => {
  const reqFrame = useRef(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lerpMousePos, setLerpMousePos] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState(-1)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    })

    return () => {
      window.removeEventListener('mousemove', () => {})
    }
  }, [])

  useEffect(() => {
    const handleReqAnim = () => {
      setLerpMousePos({
        x: lerpMousePos.x + (mousePos.x - lerpMousePos.x) * 0.2,
        y: lerpMousePos.y + (mousePos.y - lerpMousePos.y) * 0.2,
      })

      reqFrame.current = requestAnimationFrame(handleReqAnim)
    }

    reqFrame.current = requestAnimationFrame(handleReqAnim)

    return () => cancelAnimationFrame(reqFrame.current)
  }, [mousePos, lerpMousePos])

  const getTransformCursor = (posX: number, posY: number) => {
    const newPosX = (posX / windowSize.width) * 90 * 2 - 90
    const newPosY = (posY / windowSize.height) * 45 * 2 - 45

    return `translate(${newPosX}%, ${newPosY}%)`
  }

  const getTransformImg = (posX: number, posY: number) => {
    const scaleX = 1 + Math.abs((posX / windowSize.width) * 0.8 - 0.4)
    const scaleY = 1 + Math.abs((posX / windowSize.width) * 0.5 - 0.25)
    const rotateX = -10 + (posY / windowSize.height) * 10 * 2
    const rotateY = -60 + (posX / windowSize.width) * 60 * 2

    return `translate3d(-50%, -50%, 0) scale3d(${scaleX}, ${scaleY}, 1) rotateX(${rotateX}deg) rotateY(${-rotateY}deg)`
  }

  const handleLinkMouseEnter = (index: number) => {
    setHoveredLinkIndex(index)
  }

  const handleLinkMouseLeave = () => {
    setHoveredLinkIndex(-1)
  }

  return (
    <main>
      <div
        className="cursor"
        style={{
          transform: getTransformCursor(lerpMousePos.x, lerpMousePos.y),
        }}
      >
        {LINKS.map((link, index) => (
          <img
            key={index}
            src={getImageUrl(link.img)}
            alt=""
            className={clsx(hoveredLinkIndex === index && 'isActive')}
            style={{
              transform: getTransformImg(lerpMousePos.x, lerpMousePos.y),
            }}
          />
        ))}
      </div>
      <div className="menu">
        <nav>
          <ul>
            {LINKS.map((link, index) => (
              <li
                key={index}
                onMouseEnter={() => handleLinkMouseEnter(index)}
                onMouseLeave={() => handleLinkMouseLeave()}
              >
                <a href="#">
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}

export default App
