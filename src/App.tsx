import { useState, useRef, useEffect } from 'react';
import { Terminal, BookOpen, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-react';
import { HomeHero } from './components/HomeHero';
import { PortalTabs } from './components/PortalTabs';
import { AuthForm } from './components/AuthForm';
import { PreviewStudio } from './components/PreviewStudio';
import { DotFlowBackground } from './components/DotFlowBackground';
import { DeepScriptLogo } from './components/DeepScriptLogo';
import { RubricStudioSlides } from './components/RubricStudioSlides';
import {
  DownloadSection,
  FeaturesSection,
  DocsSection,
  ChangelogSection,
  BlogSection,
  PricingSection,
  UseCasesSection,
  AboutSection,
  PrivacySection,
  TermsSection,
} from './components/HomeSections';
import { apiService } from './services/api';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { SessionTimeoutModal } from './components/SessionTimeoutModal';

interface UserAuth {
  role: 'coordinator' | 'admin';
  name: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  isVerified?: boolean;
  id?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'coordinator' | 'admin'>('coordinator');
  const [coordSubTab, setCoordSubTab] = useState<'register' | 'login'>('register');
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSectionModal, setActiveSectionModal] = useState<
    'features' | 'download' | 'docs' | 'changelog' | 'blog' | 'pricing' | 'cases' | 'about' | 'privacy' | 'terms' | null
  >(null);
  const authSectionRef = useRef<HTMLDivElement>(null);

  // Escape key handler to close the active section modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSectionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getModalTitle = () => {
    switch (activeSectionModal) {
      case 'features': return 'Core Engine Architecture & Features';
      case 'download': return 'Desktop App & Engine CLI Downloads';
      case 'docs': return 'Developer & Coordinator Documentation';
      case 'changelog': return 'Release Changelog & Product Updates';
      case 'blog': return 'AI Vision & Pedagogy Insights';
      case 'pricing': return 'Evaluation Tiers & Licensing';
      case 'cases': return 'Academic & Institutional Case Studies';
      case 'about': return 'About DeepScript Vision Platform';
      case 'privacy': return 'Privacy Policy & Data Protection';
      case 'terms': return 'Terms of Service & Usage Agreements';
      default: return 'System Information';
    }
  };

  // Load session from localStorage on initial render
  const [auth, setAuth] = useState<UserAuth | null>(() => {
    const saved = localStorage.getItem('deepscript_auth');
    if (saved) {
      try {
        const lastActive = localStorage.getItem('deepscript_last_active');
        if (lastActive) {
          const elapsed = Date.now() - parseInt(lastActive, 10);
          if (elapsed > 20 * 60 * 1000) {
            localStorage.removeItem('deepscript_auth');
            localStorage.removeItem('deepscript_last_active');
            return null;
          }
        }
        return JSON.parse(saved);
      } catch (_e) {
        return null;
      }
    }
    return null;
  });

  // Sync auth state to localStorage & manage history entry
  useEffect(() => {
    if (auth) {
      localStorage.setItem('deepscript_auth', JSON.stringify(auth));
      if (window.history.state?.loggedIn !== true) {
        window.history.pushState({ loggedIn: true }, '');
      }
    } else {
      localStorage.removeItem('deepscript_auth');
    }
  }, [auth]);

  // 20-minute inactivity session timeout hook for Admin and Coordinator panels
  const {
    showWarning: showTimeoutWarning,
    showExpired: showTimeoutExpired,
    secondsRemaining: timeoutSecondsRemaining,
    extendSession: extendTimeoutSession,
    dismissExpiredModal: dismissTimeoutExpiredModal
  } = useSessionTimeout({
    isLoggedIn: !!auth,
    onLogout: () => {
      handleLogout();
    },
    onSessionExpired: () => {
      setCoordSubTab('login');
    }
  });

  const handleDismissTimeoutExpired = () => {
    dismissTimeoutExpiredModal();
    setShowLoginOverlay(true);
    setCoordSubTab('login');
  };

  // States for updating mobile number in coordinator profile modal
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [newMobile, setNewMobile] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('+91');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpSending, setMobileOtpSending] = useState(false);
  const [mobileOtpVerifying, setMobileOtpVerifying] = useState(false);
  const [mobileUpdateError, setMobileUpdateError] = useState('');
  const [mobileUpdateSuccess, setMobileUpdateSuccess] = useState('');
  const [mobileOtpCountdown, setMobileOtpCountdown] = useState(0);

  // Mobile Update OTP Countdown timer
  useEffect(() => {
    let intervalId: any;
    if (mobileOtpCountdown > 0) {
      intervalId = setInterval(() => {
        setMobileOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mobileOtpCountdown]);

  // Reset update states when modal closes or user session changes
  useEffect(() => {
    if (!showProfileModal) {
      setIsEditingMobile(false);
      setNewMobile('');
      setNewCountryCode('+91');
      setMobileOtp('');
      setMobileOtpSent(false);
      setMobileOtpSending(false);
      setMobileOtpVerifying(false);
      setMobileUpdateError('');
      setMobileUpdateSuccess('');
      setMobileOtpCountdown(0);
    } else if (auth && auth.mobile) {
      setNewMobile(auth.mobile);
      setNewCountryCode(auth.countryCode || '+91');
    }
  }, [showProfileModal, auth]);

  // Intercept back button and page close / refresh
  useEffect(() => {
    const handlePopState = (_event: PopStateEvent) => {
      if (auth) {
        // Stay on page by pushing state back
        window.history.pushState({ loggedIn: true }, '');
        const confirmLogout = window.confirm("Are you sure you want to log out and return to the home page?");
        if (confirmLogout) {
          setAuth(null);
          localStorage.removeItem('deepscript_active_view');
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (auth) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to exit? Your active workspace session will close.';
        return e.returnValue;
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [auth]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const handleScrollToAuth = () => {
    setActiveTab('coordinator');
    setCoordSubTab('register'); // Go to registration on Get Started
    if (authSectionRef.current) {
      authSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignInClick = () => {
    setActiveTab('coordinator');
    setCoordSubTab('login'); // Pre-set to login
    setShowLoginOverlay(true); // Fade in dedicated overlay
  };

  const clearWorkspaceSessionState = () => {
    try {
      const persistentKeys = [
        'deepscript_auth',
        'deepscript_registered_coordinators',
        'deepscript_revertedResults',
        'deepscript_coordinator_assignments',
        'deepscript_evaluation_timing_settings',
        'deepscript_coordinators_cache'
      ];

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('deepscript_') && !persistentKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage for session-scoped popups & tokens
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('deepscript_')) {
          sessionStorage.removeItem(key);
        }
      });

      // Purge IndexedDB cached question paper and model answer files
      const dbName = "DeepScriptDB";
      const req = indexedDB.open(dbName, 1);
      req.onsuccess = (e) => {
        const db = (e.target as any).result;
        if (db && db.objectStoreNames.contains("files")) {
          const tx = db.transaction("files", "readwrite");
          tx.objectStore("files").clear();
        }
      };
    } catch (_err) {
      console.warn('Error clearing workspace session state:', _err);
    }
  };

  const handleAuthSuccess = (
    role: 'coordinator' | 'admin',
    name: string,
    email?: string,
    mobile?: string,
    countryCode?: string,
    isVerified?: boolean,
    id?: string
  ) => {
    clearWorkspaceSessionState();
    localStorage.setItem('deepscript_last_active', String(Date.now()));
    setAuth({ role, name, email, mobile, countryCode, isVerified, id });
  };

  const handleLogout = () => {
    clearWorkspaceSessionState();
    localStorage.removeItem('deepscript_auth');
    localStorage.removeItem('deepscript_last_active');
    setAuth(null);
  };

  return (
    <div className="app-container" style={auth ? { height: '100vh', overflow: 'hidden' } : undefined}>
      <DotFlowBackground />
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="logo-container">
          <DeepScriptLogo size={42} />
          <div>
            <span className="logo-text">
              <span className="gta-text-gradient">DeepScript</span>
            </span>
          </div>
        </div>



        <nav className="nav-actions">
          
          <button 
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="btn-gta-secondary"
            style={{ 
              padding: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid var(--panel-border)'
            }}
            title={theme === 'dark' ? "Switch to White Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {auth ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className={`tab-btn ${auth.role === 'admin' ? 'active-admin' : 'active-coord'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--panel-border)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  boxShadow: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: auth.role === 'admin' ? 'var(--gta-pink)' : 'var(--gta-cyan)',
                  boxShadow: auth.role === 'admin' 
                    ? '0 0 8px var(--gta-pink)' 
                    : '0 0 8px var(--gta-cyan)'
                }}></div>
                {auth.role.toUpperCase()}: {auth.name.split(' ')[0]}
                <ChevronDown size={14} color="var(--text-muted)" style={{ 
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} />
              </button>

              {showDropdown && (
                <>
                  <div 
                    onClick={() => setShowDropdown(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 998,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: 'var(--panel-bg-solid)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '12px',
                      padding: '8px',
                      minWidth: '180px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                      zIndex: 999,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      animation: 'slideIn 0.2s ease-out'
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfileModal(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} color="var(--text-muted)" />
                      View Profile
                    </button>
                    
                    <div style={{ height: '1px', background: 'var(--panel-border)', margin: '4px 0' }} />
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} color="#ef4444" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              className="btn-gta-secondary" 
              onClick={handleSignInClick}
              style={{ padding: '6px 16px', fontSize: '13px' }}
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Main Body */}
      {auth ? (
        // Logged-in AI Evaluation Workspace (Google AI Studio themed)
        <PreviewStudio 
          role={auth.role} 
          userName={auth.name} 
          isVerified={auth.isVerified}
          onOpenProfile={() => setShowProfileModal(true)}
          onLogout={handleLogout} 
          onVerifyStatusChange={(verified) => {
            setAuth(prev => prev ? { ...prev, isVerified: verified } : null);
          }}
        />
      ) : (
        // Landing & Registration / Login Homepage
        <main style={{ flex: 1, paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
          {/* Ambient Cyber Light Effects */}
          <div className="ambient-cyan"></div>
          
          {/* Hero Section */}
          <HomeHero onActionClick={handleScrollToAuth} />

          {/* Rubric Studio Showcase Slides */}
          <RubricStudioSlides />

          {/* Registration and Login Interactive Panel */}
          <div 
            ref={authSectionRef}
            style={{
              padding: '20px 20px',
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '40px',
              alignItems: 'center',
              marginTop: '10px'
            }}
          >
            {/* Left informational column */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
                <span className="badge badge-cyan">
                  🔐 SECURED CREDENTIAL PORTAL
                </span>
              </div>
              <h2 style={{ 
                fontSize: 'clamp(28px, 4vw, 42px)', 
                fontWeight: '800', 
                marginBottom: '20px',
                color: 'var(--text-primary)',
                letterSpacing: '-1px'
              }}>
                Access the Workspace. <br />
                Begin Evaluative Markup.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                Select your respective portal tab on the right to sign in as an administrator or register as a coordinator. 
                Coordinators require verification keys to access student workspaces and submit evaluated grades.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Terminal size={18} color="var(--gta-pink)" style={{ marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontWeight: 'bold', fontSize: '14px' }}>Automated Grade Ledger Sync</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Every approved question markup is automatically synchronized back to central LMS databases via administrative API pipelines.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <BookOpen size={18} color="var(--gta-cyan)" style={{ marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontWeight: 'bold', fontSize: '14px' }}>Custom Grading Rubric Vault</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Admins configure structural schemas, custom penalty rates, and handwriting confidence filters within the security perimeter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Form column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Tab Selector switcher */}
              <PortalTabs activeTab={activeTab} onChange={setActiveTab} />
              
              <AuthForm 
                activeTab={activeTab} 
                onAuthSuccess={handleAuthSuccess} 
                coordSubTab={coordSubTab}
                setCoordSubTab={setCoordSubTab}
                hideLogin={true}
              />
            </div>
          </div>

        </main>
      )}

      {/* Premium Multi-Column Brand Footer */}
      {!auth && (
        <footer style={{
          borderTop: '1px solid var(--panel-border)',
          background: 'var(--bg-dark)',
          padding: '60px 40px 30px',
          marginTop: '40px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          textAlign: 'left',
          position: 'relative',
          zIndex: 5
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '40px',
            marginBottom: '60px'
          }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '500', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
                Experience markup evolution
              </h3>
            </div>
            
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('download'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Download
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('features'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Features
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('docs'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Docs
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('changelog'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Changelog
                </a>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</span>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('blog'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Blog
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('pricing'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Pricing
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveSectionModal('cases'); }}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Use Cases
                </a>
              </div>
            </div>
          </div>

          {/* Giant Bold Wordmark Backdrop */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            userSelect: 'none',
            overflow: 'hidden',
            marginBottom: '30px'
          }}>
            <h1 style={{
              fontSize: 'clamp(64px, 11vw, 140px)',
              fontWeight: '800',
              margin: 0,
              lineHeight: '0.8',
              letterSpacing: '-4px',
              color: 'var(--text-primary)',
              opacity: 0.95
            }}>
              DeepScript
            </h1>
          </div>

          {/* Bottom Row */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            borderTop: '1px solid var(--panel-border)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <span className="gta-text-gradient">DeepScript</span> © {new Date().getFullYear()}
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveSectionModal('about'); }}
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                About DeepScript
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveSectionModal('privacy'); }}
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveSectionModal('terms'); }}
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gta-pink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      )}

      {/* Dedicated Full-Screen Coordinator Login Page Overlay */}
      {showLoginOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 5, 8, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {/* Overlay Click-to-Dismiss layer */}
          <div 
            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} 
            onClick={() => setShowLoginOverlay(false)}
          ></div>
          
          <div style={{ 
            position: 'relative', 
            zIndex: 1001, 
            width: '100%', 
            maxWidth: '440px', 
            padding: '20px',
            boxSizing: 'border-box',
            animation: 'slideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' 
          }}>
            {/* Auth Form card locked to login mode */}
            <AuthForm 
              activeTab="coordinator" 
              onAuthSuccess={(role, name, email, mobile, countryCode, isVerified, id) => {
                handleAuthSuccess(role, name, email, mobile, countryCode, isVerified, id);
                setShowLoginOverlay(false);
              }}
              coordSubTab="login"
              setCoordSubTab={(tab) => {
                // If they click Register Account, close overlay and scroll to the inline registration form
                if (tab === 'register') {
                  setShowLoginOverlay(false);
                  setTimeout(() => {
                    setCoordSubTab('register');
                    if (authSectionRef.current) {
                      authSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 150);
                }
              }}
              hideRegister={true}
              onClose={() => setShowLoginOverlay(false)}
            />
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && auth && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div 
            className={`glass-panel ${auth.role === 'admin' ? 'glass-panel-pink' : 'glass-panel-cyan'}`}
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              borderRadius: '16px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              textAlign: 'left'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: auth.role === 'admin' ? 'rgba(255, 42, 133, 0.1)' : 'rgba(0, 203, 214, 0.1)',
                  border: `1px solid ${auth.role === 'admin' ? 'var(--gta-pink)' : 'var(--gta-cyan)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={18} color={auth.role === 'admin' ? 'var(--gta-pink)' : 'var(--gta-cyan)'} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  User Profile
                </h3>
              </div>
            </div>

            {/* Profile Info Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Full Name
                </span>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {auth.name}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Portal Role
                </span>
                <div style={{ marginTop: '4px' }}>
                  <span 
                    className={`badge ${auth.role === 'admin' ? 'badge-pink' : 'badge-cyan'}`}
                    style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }}
                  >
                    {auth.role === 'admin' ? 'ROOT ADMINISTRATOR' : 'COORDINATOR'}
                  </span>
                </div>
              </div>

              {auth.email && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {auth.role === 'admin' ? 'Username' : 'Email Address'}
                  </span>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {auth.email}
                  </div>
                </div>
              )}

              {auth.role === 'coordinator' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Mobile Number
                    </span>
                    {!isEditingMobile && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingMobile(true);
                          setNewMobile(auth.mobile || '');
                          setNewCountryCode(auth.countryCode || '+91');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--gta-cyan)',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {!isEditingMobile ? (
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                      {auth.countryCode || '+91'} {auth.mobile || 'Not set'}
                    </div>
                  ) : (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* New Mobile Input */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          className="form-input form-input-cyan"
                          style={{ width: '80px', padding: '6px 8px', fontSize: '13px' }}
                          value={newCountryCode}
                          onChange={(e) => setNewCountryCode(e.target.value)}
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+61">+61 (AU)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Enter 10-digit number"
                          className="form-input form-input-cyan"
                          style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
                          value={newMobile}
                          onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        />
                        <button
                          type="button"
                          className="btn-gta-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                          disabled={mobileOtpSending || mobileOtpCountdown > 0 || !newMobile || newMobile.length < 10}
                          onClick={() => {
                            setMobileOtpSending(true);
                            setMobileUpdateError('');
                            setMobileUpdateSuccess('');
                            apiService.sendUpdateMobileOtp(auth.email!)
                              .then(() => {
                                setMobileOtpSending(false);
                                setMobileOtpSent(true);
                                setMobileOtpCountdown(30);
                                setMobileUpdateSuccess('OTP sent successfully to your email.');
                              })
                              .catch((err) => {
                                setMobileOtpSending(false);
                                setMobileUpdateError(err.message || 'Failed to send OTP.');
                              });
                          }}
                        >
                          {mobileOtpSending ? 'Sending...' : mobileOtpCountdown > 0 ? `Resend (${mobileOtpCountdown}s)` : 'Send OTP'}
                        </button>
                      </div>

                      {/* OTP Input (shows after sending) */}
                      {mobileOtpSent && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Enter Email Verification OTP
                          </span>
                          <input
                            type="text"
                            placeholder="Enter 4-digit code"
                            className="form-input form-input-cyan"
                            style={{ padding: '6px 12px', fontSize: '13px', width: '150px', letterSpacing: '2px', textAlign: 'center' }}
                            value={mobileOtp}
                            onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          type="button"
                          className="btn-gta-primary"
                          style={{ flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center' }}
                          disabled={mobileOtpVerifying || !mobileOtp || mobileOtp.length < 4 || newMobile.length < 10}
                          onClick={() => {
                            setMobileOtpVerifying(true);
                            setMobileUpdateError('');
                            setMobileUpdateSuccess('');
                            apiService.verifyAndUpdateMobile({
                              email: auth.email!,
                              otp: mobileOtp,
                              newMobile,
                              newCountryCode
                            })
                            .then((data) => {
                              setMobileOtpVerifying(false);
                              // Update session auth state
                              handleAuthSuccess('coordinator', data.user.name, data.user.email, data.user.mobile, data.user.countryCode);
                              setIsEditingMobile(false);
                              setMobileUpdateSuccess('Mobile number updated successfully!');
                              setTimeout(() => setMobileUpdateSuccess(''), 3000);
                            })
                            .catch((err) => {
                              setMobileOtpVerifying(false);
                              setMobileUpdateError(err.message || 'OTP verification failed.');
                            });
                          }}
                        >
                          {mobileOtpVerifying ? 'Verifying...' : 'Verify & Update'}
                        </button>
                        <button
                          type="button"
                          className="btn-gta-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                          onClick={() => {
                            setIsEditingMobile(false);
                            setMobileUpdateError('');
                            setMobileUpdateSuccess('');
                            setMobileOtp('');
                            setMobileOtpSent(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Feedback messages */}
                      {mobileUpdateError && (
                        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '2px' }}>
                          {mobileUpdateError}
                        </div>
                      )}
                      {mobileUpdateSuccess && (
                        <div style={{ fontSize: '12px', color: 'var(--gta-cyan)', marginTop: '2px' }}>
                          {mobileUpdateSuccess}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Admin Mobile Number rendering */
                auth.mobile && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Mobile Number
                    </span>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                      {auth.mobile}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="btn-gta-secondary"
              style={{ width: '100%', marginTop: '28px', justifyContent: 'center' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Informational Section Modals */}
      {activeSectionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme === 'dark' ? 'rgba(5, 5, 8, 0.75)' : 'rgba(241, 245, 249, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Backdrop Dismissal Layer */}
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
            onClick={() => setActiveSectionModal(null)}
          />
          
          {/* Modal Container */}
          <div 
            className={`glass-panel`}
            style={{
              width: '90%',
              maxWidth: '960px',
              maxHeight: '85vh',
              background: 'var(--panel-bg-solid)',
              border: '1px solid var(--panel-border)',
              borderRadius: '20px',
              position: 'relative',
              zIndex: 10000,
              boxShadow: theme === 'dark' ? '0 25px 60px rgba(0, 0, 0, 0.65)' : '0 15px 40px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 28px',
              borderBottom: '1px solid var(--panel-border)',
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="gta-text-gradient" style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {getModalTitle()}
                </span>
              </div>
              <button
                onClick={() => setActiveSectionModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '4px 8px',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 8px',
            }}>
              {activeSectionModal === 'features' && <FeaturesSection />}
              {activeSectionModal === 'download' && <DownloadSection />}
              {activeSectionModal === 'docs' && <DocsSection />}
              {activeSectionModal === 'changelog' && <ChangelogSection />}
              {activeSectionModal === 'blog' && <BlogSection />}
              {activeSectionModal === 'pricing' && <PricingSection />}
              {activeSectionModal === 'cases' && <UseCasesSection />}
              {activeSectionModal === 'about' && <AboutSection />}
              {activeSectionModal === 'privacy' && <PrivacySection />}
              {activeSectionModal === 'terms' && <TermsSection />}
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid var(--panel-border)',
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setActiveSectionModal(null)}
                className="btn-gta-secondary"
                style={{ padding: '8px 24px', fontSize: '13px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20-Minute Inactivity Session Timeout Warning & Expired Modals */}
      <SessionTimeoutModal
        showWarning={showTimeoutWarning}
        showExpired={showTimeoutExpired}
        secondsRemaining={timeoutSecondsRemaining}
        onExtendSession={extendTimeoutSession}
        onLogout={handleLogout}
        onDismissExpired={handleDismissTimeoutExpired}
        role={auth?.role || 'coordinator'}
      />
    </div>
  );
}

export default App;
