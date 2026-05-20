import React, { useEffect, useRef, useState } from 'react';
import retropixFont from '../fonts/retropix/retropix.ttf';
import apricotsFont from '../fonts/apricots/apricot.regular.ttf';
import itcBauhausFont from '../fonts/itc-bauhaus/ITC Bauhaus Medium/ITC Bauhaus Medium.otf';
import edwardianFont from '../fonts/edwardian/Edwardian Script ITC Regular/Edwardian Script ITC Regular.ttf';
import strawberryFont from '../fonts/strawberry/Hello Strawberry.otf';
import leJourScriptFont from '../fonts/le_jour_script/Le Jour Script Personal Use Only.otf';
import rasputinFont from '../fonts/rasputin/Rasputin.otf';

const songSrc = '/Call it fate, call it karma - The Strokes (looped).mp3';

const fontFaces = `
  @font-face {
    font-family: 'Retropix';
    src: url('${retropixFont}') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Apricots';
    src: url('${apricotsFont}') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ITCBauhaus';
    src: url('${itcBauhausFont}') format('opentype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Edwardian';
    src: url('${edwardianFont}') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Strawberry';
    src: url('${strawberryFont}') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'LeJourScript';
    src: url('${leJourScriptFont}') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Rasputin';
    src: url('${rasputinFont}') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
`;

function App() {
  const layoutRef = useRef(null);
  const audioRef = useRef(null);
  const [isSongPlaying, setIsSongPlaying] = useState(true);
  const pointerTarget = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pointerCurrent = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    let animationFrame;

    const animateGlow = () => {
      const current = pointerCurrent.current;
      const target = pointerTarget.current;

      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      if (layoutRef.current) {
        layoutRef.current.style.setProperty('--mouse-x', `${current.x}px`);
        layoutRef.current.style.setProperty('--mouse-y', `${current.y}px`);
      }

      animationFrame = requestAnimationFrame(animateGlow);
    };

    animationFrame = requestAnimationFrame(animateGlow);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    audio.volume = 0.72;
    audio.muted = false;
    audio.defaultMuted = false;

    if (isSongPlaying) {
      const attemptSongStart = () => audio.play().catch(() => {
        // Browsers may block unmuted autoplay until the first user gesture.
        // Keep the UI in the intended default-on state and retry on interaction.
      });

      attemptSongStart();
      const retryTimer = window.setTimeout(attemptSongStart, 450);
      const laterRetryTimer = window.setTimeout(attemptSongStart, 1200);

      audio.addEventListener('canplay', attemptSongStart);
      document.addEventListener('visibilitychange', attemptSongStart);

      return () => {
        window.clearTimeout(retryTimer);
        window.clearTimeout(laterRetryTimer);
        audio.removeEventListener('canplay', attemptSongStart);
        document.removeEventListener('visibilitychange', attemptSongStart);
      };
    } else {
      audio.pause();
    }

    return undefined;
  }, [isSongPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !isSongPlaying) {
      return undefined;
    }

    const resumeSong = () => {
      audio.play().catch(() => {});
    };

    window.addEventListener('pointerdown', resumeSong, { once: true });
    window.addEventListener('keydown', resumeSong, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resumeSong);
      window.removeEventListener('keydown', resumeSong);
    };
  }, [isSongPlaying]);

  const handlePointerMove = (event) => {
    pointerTarget.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  return (
    <div className="layout" ref={layoutRef} onPointerMove={handlePointerMove}>
      <style>{fontFaces}</style>
      <audio ref={audioRef} src={songSrc} preload="auto" loop autoPlay playsInline />
      <span className="cursor-orb" aria-hidden="true" />
      <div className="page1">
        <button
          className={`tray-image ${isSongPlaying ? '' : 'is-stopped'}`}
          type="button"
          aria-label={isSongPlaying ? 'Pause background song' : 'Play background song'}
          aria-pressed={isSongPlaying}
          onClick={() => setIsSongPlaying((playing) => !playing)}
        >
          <img src="/phonogram.gif" alt="" />
          <span className="song-tooltip" role="tooltip">
            <span className="album-cover-slot" aria-hidden="true">
              <img src="/album.png" alt="" />
            </span>
            <span className="song-info">
              <span className="song-title">Call It Fate, Call It Karma</span>
              <span className="song-artist">The Strokes</span>
            </span>
          </span>
        </button>

        <figure className="profile-card" aria-label="Profile photo">
          <img src="/profile1.jpg" alt="Shreya Soni" />
        </figure>

        <div className="introduction">
          <div className="intro-content">
            <h1 className="name" aria-label="Shreya Soni">
              <span className="name-script">S</span>
              <span className="name-pixel">
                <span>HREYA</span>
                <span>ONI</span>
              </span>
            </h1>

            <div className="role" aria-label="Software Engineer">
              <span className="role-filled">SOFTWARE</span>
              <span className="role-outline" data-text="ENGINEER">ENGINEER</span>
            </div>

            <div className="focusedon">
              <span className="focused-label">focused roles :</span>
              <span className="role-loop" aria-live="polite">
                <button className="animated-role frontend" type="button">Frontend</button>
                <button className="animated-role backend" type="button">Backend</button>
                <button className="animated-role data-science" type="button">Data Science</button>
              </span>
            </div>
          </div>
        </div>

        <div className="gif">
          <img src="/v1.gif" alt="gif" />
        </div>
      </div>

      <section className="page2" aria-label="Second page">
        <nav className="page2-nav" aria-label="Portfolio sections">
          <a className="nav-bloom" href="#about-me">
            <span className="sticker-cloud" aria-hidden="true">
              <img className="sticker sticker-laptop" src="/laptop-bg.png" alt="" />
              <img className="sticker sticker-specs" src="/specs-bg.png" alt="" />
              <img className="sticker sticker-bass" src="/bass-bg.png" alt="" />
              <img className="sticker sticker-dragonfly" src="/dragonfly-bg.png" alt="" />
            </span>
            <span className="nav-word">about me</span>
          </a>
          <span className="nav-separator">|</span>
          <a className="nav-bloom nav-bloom-work" href="#work">
            <span className="sticker-cloud" aria-hidden="true">
              <img className="sticker sticker-addverb" src="/addverb-bg.png" alt="" />
              <img className="sticker sticker-bulb" src="/bulb-bg.png" alt="" />
              <img className="sticker sticker-dynamo100" src="/dynamo-bg.png" alt="" />
              <img className="sticker sticker-hand" src="/hand-bg.png" alt="" />
            </span>
            <span className="nav-word">work</span>
          </a>
          <span className="nav-separator">|</span>
          <a className="nav-bloom nav-bloom-projects" href="#projects">
            <span className="sticker-cloud" aria-hidden="true">
              <img className="sticker sticker-redis" src="/redis-bg.png" alt="" />
              <img className="sticker sticker-springboot" src="/springboot-bg.png" alt="" />
              <img className="sticker sticker-llm" src="/llm-bg.png" alt="" />
              <img className="sticker sticker-java" src="/java-bg.png" alt="" />
            </span>
            <span className="nav-word">projects</span>
          </a>
          <span className="nav-separator">|</span>
          <a className="nav-bloom nav-bloom-connect" href="#connect">
            <span className="sticker-cloud" aria-hidden="true">
              <img className="sticker sticker-linkedin" src="/linkedin-bg.png" alt="" />
              <img className="sticker sticker-leetcode" src="/leetcode-bg.png" alt="" />
              <img className="sticker sticker-github" src="/github-bg.png" alt="" />
              <img className="sticker sticker-email" src="/email-bg.png" alt="" />
              <img className="sticker sticker-instagram" src="/instagram-bg.png" alt="" />
            </span>
            <span className="nav-word">connect?</span>
          </a>
        </nav>

        <section className="about-section" id="about-me" aria-labelledby="about-heading">
          <img className="about-flowers" src="/flowers-bg.png" alt="" aria-hidden="true" />
          <h2 className="about-heading" id="about-heading">
            <span>ABOUT</span>
            <span>ME.</span>
          </h2>
          <div className="about-copy">
            <p>
              I’m a software developer who loves creating things, whether it’s a full-stack application, an AI-powered product, a clean UI, a piece of music, a drone, or occasionally, a short film.
            </p>
            <p>
              I’ve worked with modern technologies like the MERN stack, LLMs, and RAG, and I enjoy building products that are useful, thoughtful, and well-designed. Right now, I’m exploring different areas of tech to find the one path I truly want to go deep into and grow with.
            </p>
            <p>
              For me,{' '}
              <span className="rolling-phrase" aria-label="creativity is the common thread across everything I do">
                {['creativity', 'is', 'the', 'common', 'thread', 'across', 'everything', 'I', 'do'].map((word, index, words) => (
                  <React.Fragment key={word}>
                  <span className="rolling-word" data-word={word} style={{ '--roll-delay': `${index * 42}ms` }}>
                    <span>{word}</span>
                  </span>
                  {index < words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                ))}
              </span>
              . I love absorbing art in all forms, from music and design to cinema, which probably explains why I have a soft spot for the iconic chaos of Dabangg.
            </p>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-heading">
          <h2 className="about-heading work-heading" id="work-heading">
            <span>Work!</span>
          </h2>
          <div className="work-copy">
            <article className="work-card">
              <img className="work-logo" src="/addverb.png" alt="Addverb Technologies logo" />
              <div className="work-card-copy">
                <h3>
                  Addverb Technologies
                  <span>Jan/26 - Present</span>
                </h3>
                <p>Solution Software Engineer Intern</p>
              </div>
              <a className="work-card-arrow" href="https://addverb.com/" target="_blank" rel="noreferrer" aria-label="Open Addverb Technologies website">
                &#8599;
              </a>
            </article>
          </div>
        </section>

        <section className="projects-section" id="projects" aria-labelledby="projects-heading">
          <h2 className="about-heading projects-heading" id="projects-heading">
            <span>PROJECTS</span>
          </h2>
          <div className="projects-bento">
            <a className="project-card project-card-large" href="http://10.0.1.217:3000/" target="_blank" rel="noreferrer">
              <div className="project-card-front">
                <h3>Addverb AI Assistant- AskSyra</h3>
                <p>Tech Stack: Agent Orchestration, ChromaDB, FastAPI, LangChain, LLMs, Python, RAG, React.js, Vector Database</p>
              </div>
              <div className="project-card-back">
                <span><strong>LLM + RAG Architecture</strong>Engineered a local LLM pipeline leveraging RAG, dense embeddings, and vector similarity search over 200+ documents for low-latency, context-aware retrieval.</span>
                <span><strong>RFQ Pipeline</strong>Architected structured prompt pipelines with dynamic model routing for parsing and summarizing 900-1000 page RFQs.</span>
                <span><strong>Fine-Tuning</strong>Integrated model fine-tuning and MCP server tooling for automated BOM generation, achieving 90% efficiency gains.</span>
              </div>
            </a>
            {/*
            <button className="project-card project-card-wide" type="button" onClick={() => window.alert('no link for this project')}>
              <div className="project-card-front">
                <h3>High-Speed WES Routing System</h3>
                <p>Tech Stack: Async Processing, Distributed Systems, Java, LLD, RabbitMQ, Redis, Spring Boot</p>
              </div>
              <div className="project-card-back">
                <span><strong>Real-Time Routing Engine</strong>Engineered a low-latency WES pipeline capable of processing 6+ lakh TCP-based robotic feedback events every 200ms.</span>
                <span><strong>Distributed System Design</strong>Architected asynchronous Java microservices using Redis caching and RabbitMQ queues for deterministic conveyor decisions within 200-300ms sensor windows.</span>
                <span><strong>Load Balancing + Scheduling</strong>Implemented round-robin CPU load balancing and high-throughput event processing.</span>
              </div>
            </button>
            */}
            <a className="project-card" href="https://github.com/i-shreya/KoinX-Crypto-Tracker" target="_blank" rel="noreferrer">
              <div className="project-card-front">
                <h3>Crypto-Tracker</h3>
                <p>Tech Stack: Microservices, MongoDB, NATS, Node.js</p>
              </div>
              <div className="project-card-back">
                <span><strong>Distributed Architecture + Microservices</strong>Built a crypto-tracking platform using Node.js, MongoDB, and NATS with Pub/Sub-based inter-service communication and Worker services.</span>
                <span><strong>Backend Data Management</strong>Implemented MongoDB ingestion, storage, and retrieval pipelines for reliable historical cryptocurrency tracking.</span>
              </div>
            </a>
            <a className="project-card" href="https://backyard-farming-2-0.vercel.app/" target="_blank" rel="noreferrer">
              <div className="project-card-front">
                <h3>Backyard Farming2.0</h3>
                <p>Tech Stack: Clerk, Docker, Flask, Groq, MERN Stack, Python, Redux, TypeScript, Vite</p>
              </div>
              <div className="project-card-back">
                <span><strong>FrontEnd</strong>Built reusable and scalable UI components using React and TailwindCSS, reducing frontend code redundancy by 40%.</span>
                <span><strong>BackEnd & API Development</strong>Designed a secure backend with Node.js and Express.js, implementing JWT authentication and RESTful APIs.</span>
                <span><strong>AI Integration</strong>Added an AI-powered crop recommendation engine and chatbot, improving suggestion accuracy by 35%.</span>
              </div>
            </a>
          </div>
        </section>

        <section className="connect-section" id="connect" aria-labelledby="connect-heading">
          <h2 className="connect-heading" id="connect-heading">~ connect?~</h2>
          <div className="connect-content">
            <nav className="social-list" aria-label="Social links">
              <a className="social-link" href="https://www.linkedin.com/in/shreya-soni-ss23/" target="_blank" rel="noreferrer">
                <img src="/linkedin-bg.png" alt="" />
                <span>shreya-soni-ss23</span>
              </a>
              <a className="social-link" href="mailto:shreya.sonii@outlook.com" target="_blank" rel="noreferrer">
                <img src="/email-bg.png" alt="" />
                <span>shreya.sonii@outlook.com</span>
              </a>
              <a className="social-link" href="https://github.com/i-shreya" target="_blank" rel="noreferrer">
                <img src="/github-bg.png" alt="" />
                <span>i-shreya</span>
              </a>
              <a className="social-link" href="https://leetcode.com/u/shreyasonii/" target="_blank" rel="noreferrer">
                <img src="/leetcode-bg.png" alt="" />
                <span>shreyasonii</span>
              </a>
              <a className="social-link" href="https://www.instagram.com/i.shreyasoni/" target="_blank" rel="noreferrer">
                <img src="/instagram-bg.png" alt="" />
                <span>i.shreyasoni</span>
              </a>
            </nav>
            <img className="connect-phone" src="/telephone-bg.png" alt="" aria-hidden="true" />
          </div>
          <a className="resume-button" href="https://drive.google.com/drive/folders/1ubU18K9CZz7uW3kadAcS9nT6VTZoYRT4" target="_blank" rel="noreferrer">
            Download The Resume
          </a>
        </section>
      </section>
    </div>
  );
}

export default App;
