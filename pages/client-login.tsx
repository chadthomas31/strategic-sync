import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FiLock,
  FiMail,
  FiUser,
  FiArrowRight,
  FiLogOut,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBarChart,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import SEO from '../components/SEO';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Project {
  name: string;
  progress: number;
  status: 'In Progress' | 'Completed';
}

interface Activity {
  text: string;
  time: string;
  icon: React.ReactNode;
}

interface Meeting {
  title: string;
  date: string;
  time: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const DEMO_EMAIL = 'demo@strategicsync.com';
const DEMO_PASSWORD = 'demo123';
const SESSION_KEY = 'ss_client_session';

const projects: Project[] = [
  { name: 'AI Chatbot Integration', progress: 75, status: 'In Progress' },
  { name: 'Website Redesign', progress: 100, status: 'Completed' },
  { name: 'Data Analytics Pipeline', progress: 30, status: 'In Progress' },
];

const activities: Activity[] = [
  {
    text: 'AI Chatbot Integration milestone approved',
    time: '2 hours ago',
    icon: <FiCheckCircle className="text-[#00f0ff]" />,
  },
  {
    text: 'New invoice #1042 generated',
    time: '5 hours ago',
    icon: <FiFileText className="text-[#ffd700]" />,
  },
  {
    text: 'Team message from Sarah K.',
    time: 'Yesterday',
    icon: <FiMessageSquare className="text-[#00f0ff]" />,
  },
  {
    text: 'Website Redesign marked complete',
    time: '2 days ago',
    icon: <FiCheckCircle className="text-green-400" />,
  },
  {
    text: 'Data Analytics Pipeline kicked off',
    time: '3 days ago',
    icon: <FiBarChart className="text-[#00f0ff]" />,
  },
];

const meetings: Meeting[] = [
  { title: 'Sprint Review - Chatbot', date: 'Mar 18, 2026', time: '10:00 AM' },
  { title: 'Analytics Pipeline Kick-off', date: 'Mar 20, 2026', time: '2:00 PM' },
];

// ---------------------------------------------------------------------------
// Animated section helper
// ---------------------------------------------------------------------------

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => (
  <div
    className={`
      bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
      ${hover ? 'transition-all duration-300 hover:border-[#00f0ff]/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{
        background: 'linear-gradient(90deg, #00f0ff, #00b8d4)',
      }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  </div>
);

const StatusBadge: React.FC<{ status: 'In Progress' | 'Completed' }> = ({ status }) => {
  const isComplete = status === 'Completed';
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        ${isComplete
          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
          : 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20'
        }
      `}
    >
      {isComplete ? <FiCheckCircle className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
      {status}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

const LoginForm: React.FC<{
  onLogin: (email: string) => void;
}> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
      }
      onLogin(email);
    } else {
      setError('Invalid credentials. Try demo@strategicsync.com / demo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 sm:p-10" hover={false}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00f0ff]/5 border border-[#00f0ff]/30 flex items-center justify-center"
            >
              <FiLock className="w-7 h-7 text-[#00f0ff]" />
            </motion.div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #00f0ff 0%, #ffffff 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Client Portal
            </h1>
            <p className="text-[#a0a0a0]">Sign in to access your dashboard</p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#606060] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#606060] focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all"
                />
              </div>
            </div>

            {/* Remember me / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border border-white/20 accent-[#00f0ff]"
                />
                <span className="text-sm text-[#a0a0a0]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-semibold text-black flex items-center justify-center gap-2 transition-shadow hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #00b8d4)',
              }}
            >
              Sign In
              <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Request access */}
          <p className="mt-8 text-center text-sm text-[#a0a0a0]">
            New client?{' '}
            <a
              href="#"
              className="text-[#ffd700] hover:text-[#ffd700]/80 font-medium transition-colors"
            >
              Request Access
            </a>
          </p>
        </GlassCard>

        {/* Demo hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-[#606060]"
        >
          Demo: demo@strategicsync.com / demo123
        </motion.p>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

const Dashboard: React.FC<{ email: string; onLogout: () => void }> = ({
  email,
  onLogout,
}) => {
  const userName = email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const quickActions = [
    { label: 'Book Consultation', icon: <FiCalendar className="w-5 h-5" />, href: '/booking' },
    { label: 'View Invoices', icon: <FiFileText className="w-5 h-5" />, href: '#' },
    { label: 'Message Team', icon: <FiMessageSquare className="w-5 h-5" />, href: '#' },
    { label: 'View Reports', icon: <FiBarChart className="w-5 h-5" />, href: '#' },
  ];

  return (
    <div className="min-h-screen px-4 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #00f0ff 0%, #ffffff 60%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome back, {userName}
              </h1>
              <p className="text-[#a0a0a0]">Here is an overview of your active projects.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#a0a0a0] hover:text-white hover:border-white/20 transition-all self-start"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Quick actions */}
        <AnimatedSection delay={0.1} className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="block"
              >
                <GlassCard className="p-5 text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff]">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-[#a0a0a0]">{action.label}</span>
                </GlassCard>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection delay={0.2}>
              <h2 className="text-xl font-semibold mb-4 text-white">Project Status</h2>
              <div className="space-y-4">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <GlassCard className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{project.name}</h3>
                        <StatusBadge status={project.status} />
                      </div>
                      <ProgressBar progress={project.progress} />
                      <p className="mt-2 text-xs text-[#a0a0a0]">{project.progress}% complete</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Recent activity */}
            <AnimatedSection delay={0.4}>
              <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
              <GlassCard className="divide-y divide-white/5" hover={false}>
                {activities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.text}</p>
                    </div>
                    <span className="text-xs text-[#606060] flex-shrink-0">{activity.time}</span>
                  </motion.div>
                ))}
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming meetings */}
            <AnimatedSection delay={0.3}>
              <h2 className="text-xl font-semibold mb-4 text-white">Upcoming Meetings</h2>
              <div className="space-y-4">
                {meetings.map((meeting, i) => (
                  <motion.div
                    key={meeting.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <GlassCard className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center flex-shrink-0">
                          <FiCalendar className="w-4 h-4 text-[#ffd700]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-sm">{meeting.title}</h3>
                          <p className="text-xs text-[#a0a0a0] mt-1">{meeting.date}</p>
                          <p className="text-xs text-[#00f0ff]">{meeting.time}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Account info */}
            <AnimatedSection delay={0.5}>
              <GlassCard className="p-5" hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#00b8d4] flex items-center justify-center text-black font-bold">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{userName}</p>
                    <p className="text-xs text-[#606060]">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Active client since Jan 2025
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClientLogin() {
  const [authedEmail, setAuthedEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const { email } = JSON.parse(stored);
        if (email) setAuthedEmail(email);
      } catch {
        // corrupted – ignore
      }
    }
    setReady(true);
  }, []);

  const handleLogin = (email: string) => {
    setAuthedEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedEmail(null);
  };

  // Avoid hydration mismatch by waiting for client-side check
  if (!ready) return null;

  return (
    <>
      <SEO
        title="Client Portal | Strategic Sync"
        description="Access the Strategic Sync client portal to manage your AI projects, view invoices, and track consultation history."
        path="/client-login"
      />

      <div className="bg-[#0a0a0a] text-white min-h-screen relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,240,255,0.06) 0%, transparent 70%)',
          }}
        />

        <AnimatePresence mode="wait">
          {authedEmail ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <Dashboard email={authedEmail} onLogout={handleLogout} />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <LoginForm onLogin={handleLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
