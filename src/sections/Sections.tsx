import { motion, useReducedMotion } from 'framer-motion';
import { about, certifications, education, EMAIL, experience, GITHUB_URL, LINKEDIN_URL, person, PHOTO_URL, platform, projects, skills } from '../content';
import { Fade, Wipe } from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import PlatformDiagram from '../components/PlatformDiagram';
import BrandIcon from '../components/BrandIcon';
import Count from '../components/Count';
import { brandFor } from '../lib/brands';

function Section({ id, title, lede, children, wide = false }: { id: string; title: string; lede?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section id={id} className={wide ? 'section section-wide' : 'section'}>
      <div className="section-inner">
        <aside className="section-side">
          <Wipe>
            <h2>{title}</h2>
          </Wipe>
          {lede && (
            <Fade delay={0.15}>
              <p className="lede">{lede}</p>
            </Fade>
          )}
        </aside>
        <div className="section-main">{children}</div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <Section id="about" title="About">
      <Fade>
        <div className="about-grid">
          <div className="about-text">
            {PHOTO_URL && <img className="about-photo" src={PHOTO_URL} alt={person.name} width={160} height={160} />}
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="facts">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt>
                  <Count value={f.value} />
                </dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Fade>
    </Section>
  );
}

export function Platform() {
  return (
    <Section id="platform" title={platform.title} lede={platform.intro} wide>
      <Fade>
        <PlatformDiagram />
      </Fade>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="timeline">
        {experience.map((job, i) => (
          <li key={job.company}>
            <Fade delay={i * 0.05}>
              <div className="job">
                <div className="job-when">{job.period}</div>
                <div className="job-body">
                  <h3>{job.company}</h3>
                  <p className="job-role">
                    {job.role}, {job.place}
                  </p>
                  <p className="job-summary">{job.summary}</p>
                  <ul>
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Fade>
          </li>
        ))}
      </ol>
      <Fade>
        <div className="edu">
          <div>
            <h3>Certifications</h3>
            <ul>
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Education</h3>
            <ul>
              {education.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </Fade>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" title="Projects" lede="Eight things I shipped that a resume line cannot hold." wide>
      <div className="projects">
        {projects.map((p, i) => (
          <Fade key={p.name} delay={(i % 2) * 0.08}>
            <TiltCard className="project">
              <div className="project-top">
                <span className="project-year">{p.year}</span>
                <span className="project-metric">
                  <b>
                    <Count value={p.metric.value} />
                  </b>
                  <small>{p.metric.label}</small>
                </span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t}>
                    <BrandIcon name={brandFor(t)} size={13} />
                    {t}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </Fade>
        ))}
      </div>
    </Section>
  );
}

export function Skills() {
  const reduce = useReducedMotion();
  return (
    <Section id="skills" title="Skills" lede="Grouped the way the work is actually done: by the problem each tool solves.">
      <div className="skills">
        {skills.map((g, gi) => (
          <motion.div
            key={g.group}
            className="skill-group"
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8% 0px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: gi * 0.03 } } }}
          >
            <h3>{g.group}</h3>
            <ul>
              {g.items.map((item) => (
                <motion.li key={item} variants={{ hidden: { opacity: 0, y: 8, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  <BrandIcon name={brandFor(item)} size={14} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="section-inner">
        <aside className="section-side">
          <Wipe>
            <h2>Contact</h2>
          </Wipe>
          <Fade delay={0.15}>
            <p className="lede">{person.availability}</p>
          </Fade>
        </aside>
        <div className="section-main">
          <Fade>
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <ul className="contact-links">
              <li>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  <BrandIcon name="github" size={15} />
                  GitHub
                </a>
                <span>{GITHUB_URL.replace('https://', '')}</span>
              </li>
              {LINKEDIN_URL && (
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  <span>{LINKEDIN_URL.replace('https://', '')}</span>
                </li>
              )}
              <li>
                <span className="contact-plain">{person.location}</span>
              </li>
            </ul>
          </Fade>
        </div>
      </div>
      <footer className="footer">
        <span>{person.name}</span>
        <span>Built with React, Three.js and Framer Motion</span>
      </footer>
    </section>
  );
}
