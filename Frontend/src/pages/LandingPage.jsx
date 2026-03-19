import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CertificateBadge from '../components/CertificateBadge';
import MainUiLayerModule from '../components/MainUiLayerModule';
import { api } from '../context/api';
import { useAuth } from '../context/AuthContext';

const featureCopy = [
  'Build production AI apps with step-by-step mentoring',
  'Practice in-browser with interactive coding modules',
  'Earn verified completion certificates and portfolio projects',
];

const faqs = [
  {
    q: 'Can I explore courses without creating an account?',
    a: 'Yes. Guest mode lets you browse course details and curriculum before signing up.',
  },
  {
    q: 'How does enrollment work for free and paid courses?',
    a: 'Free courses enroll instantly. Paid courses require saved payment details for secure checkout.',
  },
  {
    q: 'What login options are available?',
    a: 'Continue with Google, X, Facebook, or email and password from the auth page.',
  },
  {
    q: 'Do admins have access to user data?',
    a: 'Admins can monitor operations and view user records, but personal account edits remain user-controlled.',
  },
];

const fallbackCourses = [
  { title: 'Prompt Engineering Mastery', author: 'Ari Khan', level: 'Beginner' },
  { title: 'AI Agent Workflows', author: 'Nadia Iqbal', level: 'Intermediate' },
  { title: 'LLM App Deployment', author: 'Bilal Raza', level: 'Advanced' },
  { title: 'AI-assisted System Design', author: 'Sana Aziz', level: 'Intermediate' },
  { title: 'Reasoning and Tool Use', author: 'Hamza Tariq', level: 'Advanced' },
  { title: 'Model Evaluation in Practice', author: 'Mehak Ali', level: 'Intermediate' },
];

const techImages = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=400&q=80'
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pointer, setPointer] = useState({ x: 250, y: 250 });
  const [openFaq, setOpenFaq] = useState(0);
  const [courses, setCourses] = useState([]);
  const [enrollingId, setEnrollingId] = useState("");
  const [message, setMessage] = useState("");
  const { scrollYProgress } = useScroll();
  const certRotate = useTransform(scrollYProgress, [0, 1], [0, 420]);
  const certScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.95, 1.07, 1]);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            setIsVideoPlaying(true);
          } else {
            videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            setIsVideoPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    const timer = setTimeout(() => {
       if (videoRef.current) observer.observe(videoRef.current);
    }, 1000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handlePlayVideo = () => {
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    setIsVideoPlaying(true);
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setCourses([]);
      }
    };

    loadCourses();
  }, []);

  const onEnroll = async (course) => {
    if (!user) {
      navigate('/register');
      return;
    }

    setMessage("");
    setEnrollingId(course._id);
    try {
      await api.post(`/users/me/enroll/${course._id}`);
      setMessage(`Enrolled in ${course.title}. Go to profile to view your courses.`);
      navigate('/profile');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollingId("");
    }
  };

  const floatingWords = useMemo(
    () => [
      { x: '10%', y: '15%', text: 'Build' },
      { x: '42%', y: '33%', text: 'Ship' },
      { x: '70%', y: '58%', text: 'Upskill' },
    ],
    []
  );

  return (
    <div
      className="relative min-h-screen bg-transparent text-white overflow-x-hidden"
      onMouseMove={(e) => setPointer({ x: e.clientX, y: e.clientY })}
    >
      <motion.div
        className="pointer-events-none fixed z-20 w-64 h-64 rounded-full blur-3xl"
        animate={{ x: pointer.x - 120, y: pointer.y - 120 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120, mass: 0.6 }}
        style={{ background: 'radial-gradient(circle, rgba(253,92,54,0.23), rgba(253,92,54,0))' }}
      />

      <div className="relative z-10 border-b border-zinc-800/80 backdrop-blur-md bg-black/45 sticky top-0">
        <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-white text-black px-3 py-1 rounded-md text-sm font-bold tracking-wider">FUTURIA</span>
            <span className="text-zinc-400 text-sm font-mono hidden md:block">AI LEARNING STUDIO</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
            <a href="#courses" className="hover:text-white transition-colors">Course series</a>
            <a href="#mentors" className="hover:text-white transition-colors">How we teach</a>
            <a href="#faq" className="hover:text-white transition-colors">Questions</a>
          </nav>

          <div className="flex gap-2">
            <button onClick={() => navigate('/login')} className="border border-zinc-700 px-4 py-2 rounded-md text-sm hover:border-zinc-500">Log in</button>
            <button onClick={() => navigate('/register')} className="bg-[#fd5c36] hover:bg-[#ff6f4c] px-5 py-2 rounded-md text-sm font-semibold">Enroll for free</button>
          </div>
        </header>
      </div>

      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.92]">
              Develop
              <br />
              AI-Powered
              <br />
              Coding Skills
            </h1>
            <p className="mt-8 text-zinc-300 max-w-xl text-lg">
              Explore as a guest, register in seconds, and complete project-driven modules like top online learning platforms.
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-4 text-zinc-300">
              <li><span className="text-[#fd5c36] mr-2">•</span>10-course series</li>
              <li><span className="text-[#fd5c36] mr-2">•</span>25 practical tasks</li>
              <li><span className="text-[#fd5c36] mr-2">•</span>Capstone project</li>
              <li><span className="text-[#fd5c36] mr-2">•</span>Self-paced access</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            className="border border-[#fd5c36]/70 bg-zinc-950/35 backdrop-blur-[1px] p-4 rounded-sm shadow-[0_0_45px_rgba(253,92,54,0.16)]"
          >
            <div className="aspect-video rounded-sm border border-zinc-800 overflow-hidden bg-black relative group">
              <iframe 
                ref={videoRef}
                className="w-full h-full"
                src="https://www.youtube.com/embed/aircAruvnKk?enablejsapi=1&mute=1" 
                title="Intro Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              {!isVideoPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <button 
                    onClick={handlePlayVideo}
                    className="border border-zinc-500 bg-black/60 hover:bg-black/90 transition-colors px-6 py-3 rounded text-xl font-bold backdrop-blur-sm">
                    Watch intro
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-16">
        <MainUiLayerModule />
        <div className="mt-10">
          <CertificateBadge rotate={certRotate} scale={certScale} />
        </div>
      </section>

      <section id="courses" className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl font-black mb-10"
        >
          Course Series
        </motion.h2>

        {message && <p className="mb-4 text-sm text-[#fd5c36]">{message}</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(courses.length > 0 ? courses : fallbackCourses).map((course, idx) => (
            <motion.article
              key={course._id || course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-zinc-800 bg-zinc-950/55 hover:border-[#fd5c36]/60 transition-colors backdrop-blur-[1px]"
            >
              <div className="h-48 bg-zinc-900 overflow-hidden">
                <img 
                  src={techImages[idx % techImages.length]} 
                  alt={`${course.title} thumbnail`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-bold leading-tight">{course.title}</h3>
                <p className="text-zinc-400 mt-2">{course.author || 'Futuria Instructor'}</p>
                <div className="mt-5 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-zinc-500">{course.level || (course.price > 0 ? 'Paid' : 'Free')}</span>
                  <button
                    onClick={() => course._id ? onEnroll(course) : navigate('/register')}
                    disabled={enrollingId === course._id}
                    className="text-sm text-[#fd5c36] hover:text-[#ff8e73] disabled:opacity-60"
                  >
                    {enrollingId === course._id ? 'Enrolling...' : 'Enroll'}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 py-20 border-y border-zinc-900 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {floatingWords.map((word, idx) => (
            <motion.div
              key={word.text}
              initial={{ opacity: 0.1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.2 }}
              className="p-6 border border-zinc-800 bg-zinc-950/35 backdrop-blur-[1px]"
            >
              <p className="text-zinc-500 text-sm uppercase tracking-wider">{word.text}</p>
              <h3 className="mt-2 text-4xl font-black">{featureCopy[idx]}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="mentors" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-black leading-tight">Learn at your own pace with industry mentors</h2>
            <p className="mt-5 text-zinc-300 text-lg">Gain insights from practitioners building AI-assisted systems at leading companies.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-96">
            <div className="absolute right-0 top-8 w-64 h-80 border border-zinc-700 bg-[linear-gradient(150deg,rgba(27,27,27,0.86),rgba(253,92,54,0.72)_160%)] p-4 backdrop-blur-[1px]">
              <img src="https://i.pravatar.cc/112?img=60" alt="S. Rehman" className="w-28 h-28 rounded-full object-cover mx-auto" />
              <p className="mt-6 text-center text-xl font-bold">S. Rehman</p>
              <p className="text-zinc-300 mt-3 text-sm">Author of Practical ML Systems</p>
            </div>
            <div className="absolute left-8 bottom-0 w-72 h-80 border border-zinc-700 bg-black/70 p-4 shadow-[0_0_50px_rgba(253,92,54,0.14)] backdrop-blur-[1px]">
              <img src="https://i.pravatar.cc/112?img=68" alt="A. Farooq" className="w-28 h-28 rounded-full object-cover mx-auto" />
              <p className="mt-6 text-center text-xl font-bold">A. Farooq</p>
              <p className="text-zinc-300 mt-3 text-sm">AI Engineering Lead</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
        <h2 className="text-4xl font-black mb-8">Questions</h2>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={item.q} className="border border-zinc-800 bg-zinc-950/70">
              <button
                className="w-full px-5 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <span className="font-semibold">{item.q}</span>
                <span className="text-[#fd5c36]">{openFaq === idx ? '-' : '+'}</span>
              </button>
              {openFaq === idx && <p className="px-5 pb-5 text-zinc-400">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-zinc-900 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <CertificateBadge size={104} autoRotate />
            </div>
            <p className="text-zinc-400 text-sm">Earn a verified certificate after completing each guided track.</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Platform</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>Course catalog</li>
              <li>Interactive labs</li>
              <li>Learning dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Account</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>Guest mode</li>
              <li>Registered profile</li>
              <li>Admin management</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Get started</h4>
            <button onClick={() => navigate('/register')} className="bg-[#fd5c36] hover:bg-[#ff6f4c] text-white px-5 py-2 rounded-md text-sm font-semibold mb-3">Create account</button>
            <p className="text-zinc-500 text-sm">Continue with Google, X, Facebook, or email.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
