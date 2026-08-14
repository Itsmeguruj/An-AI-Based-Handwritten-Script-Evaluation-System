import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  UserPlus, 
  ShieldAlert, 
  Key, 
  Mail, 
  Landmark, 
  User, 
  Loader2, 
  Sparkles, 
  Building, 
  Lock, 
  Phone,
  X,
  Check
} from 'lucide-react';

const getBrowserName = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown Browser";
};

interface AuthFormProps {
  activeTab: 'coordinator' | 'admin';
  onAuthSuccess: (role: 'coordinator' | 'admin', name: string, email?: string, mobile?: string, countryCode?: string, isVerified?: boolean, id?: string) => void;
  coordSubTab: 'register' | 'login';
  setCoordSubTab: (tab: 'register' | 'login') => void;
  hideRegister?: boolean;
  hideLogin?: boolean;
  onClose?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  activeTab, 
  onAuthSuccess, 
  coordSubTab, 
  setCoordSubTab,
  hideRegister = false,
  hideLogin = false,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Coordinator registration state
  const [coordName, setCoordName] = useState('');
  const [coordEmail, setCoordEmail] = useState('');
  const [coordMobile, setCoordMobile] = useState('');
  const [coordInstitution, setCoordInstitution] = useState('');
  const [coordDept, setCoordDept] = useState('');
  const [coordUsername, setCoordUsername] = useState('');
  const [coordPass, setCoordPass] = useState('');
  const [coordConfirmPass, setCoordConfirmPass] = useState('');

  // Pre-registration verification states
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);

  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpInput, setMobileOtpInput] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileCountdown, setMobileCountdown] = useState(0);
  const [mobileError, setMobileError] = useState('');
  const [mobileSending, setMobileSending] = useState(false);
  const [mobileVerifying, setMobileVerifying] = useState(false);

  // Country Code Selection
  const [countryCode, setCountryCode] = useState('+91');
  const [regPhoneFocused, setRegPhoneFocused] = useState(false);
  const [loginPhoneFocused, setLoginPhoneFocused] = useState(false);

  // Coordinator login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [coordLoginPass, setCoordLoginPass] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [smsToast, setSmsToast] = useState<{ visible: boolean; message: string; code: string } | null>(null);

  // Admin login state
  const [adminId, setAdminId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let intervalId: any;
    if (otpSent && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [otpSent, countdown]);

  // Email OTP countdown timer
  useEffect(() => {
    let intervalId: any;
    if (emailCountdown > 0) {
      intervalId = setInterval(() => {
        setEmailCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [emailCountdown]);

  // Mobile OTP countdown timer
  useEffect(() => {
    let intervalId: any;
    if (mobileCountdown > 0) {
      intervalId = setInterval(() => {
        setMobileCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mobileCountdown]);

  const handleSendRegisterOtp = (type: 'email' | 'mobile') => {
    const value = type === 'email' ? coordEmail : coordMobile;
    if (!value) {
      setError(`Please enter a valid ${type === 'email' ? 'email address' : 'mobile number'} first.`);
      return;
    }

    if (type === 'email' && !value.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (type === 'email') {
      setEmailSending(true);
      setEmailError('');
    } else {
      setMobileSending(true);
      setMobileError('');
    }

    apiService.sendRegisterOtp(value, type)
      .then(() => {
        if (type === 'email') {
          setEmailSending(false);
          setEmailOtpSent(true);
          setEmailCountdown(30);
          setSmsToast({
            visible: true,
            message: `Verification code sent to your email: ${value}. Please check your inbox.`,
            code: ''
          });
        }
      })
      .catch((err) => {
        if (type === 'email') {
          setEmailSending(false);
          setEmailError(err.message || 'Failed to send verification OTP.');
        } else {
          setMobileSending(false);
          setMobileError(err.message || 'Failed to send verification OTP.');
        }
      });
  };

  const handleVerifyRegisterOtp = (type: 'email' | 'mobile') => {
    const value = type === 'email' ? coordEmail : coordMobile;
    const otp = type === 'email' ? emailOtpInput : mobileOtpInput;

    if (!otp) {
      if (type === 'email') setEmailError('Please enter the email OTP.');
      else setMobileError('Please enter the mobile OTP.');
      return;
    }

    if (type === 'email') {
      setEmailVerifying(true);
      setEmailError('');
    } else {
      setMobileVerifying(true);
      setMobileError('');
    }

    apiService.verifyRegisterOtp(value, otp, type)
      .then(() => {
        if (type === 'email') {
          setEmailVerifying(false);
          setEmailVerified(true);
          setSmsToast(null);
        } else {
          setMobileVerifying(false);
          setMobileVerified(true);
          setSmsToast(null);
        }
      })
      .catch((err) => {
        if (type === 'email') {
          setEmailVerifying(false);
          setEmailError(err.message || 'Incorrect OTP.');
        } else {
          setMobileVerifying(false);
          setMobileError(err.message || 'Incorrect OTP.');
        }
      });
  };

  const handleCoordinatorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!coordName || !coordEmail || !coordMobile || !coordInstitution || !coordDept || !coordUsername || !coordPass) {
      setError('Please fill in all required fields.');
      return;
    }

    const usernameHasUppercase = /[A-Z]/.test(coordUsername);
    const usernameHasNumber = /[0-9]/.test(coordUsername);
    if (!usernameHasUppercase || !usernameHasNumber) {
      setError('Username must contain at least 1 uppercase letter and at least 1 digit/number.');
      return;
    }

    const passwordHasUppercase = /[A-Z]/.test(coordPass);
    const passwordHasNumber = /[0-9]/.test(coordPass);
    const passwordHasSpecial = /[^A-Za-z0-9]/.test(coordPass);
    if (!passwordHasUppercase || !passwordHasNumber || !passwordHasSpecial) {
      setError('Password must contain at least 1 uppercase letter, at least 1 number, and at least 1 special character.');
      return;
    }

    if (!emailVerified) {
      setError('Please verify your email address first.');
      return;
    }



    if (coordPass !== coordConfirmPass) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    apiService.register({
      name: coordName,
      email: coordEmail,
      mobile: coordMobile,
      countryCode,
      institution: coordInstitution,
      department: coordDept,
      username: coordUsername,
      verificationCode: 'OTP_VERIFIED',
      password: coordPass
    })
    .then((data) => {
      setLoading(false);
      apiService.createLog({
        action: `Registered new coordinator account`,
        actorRole: 'coordinator',
        actorName: data.user.name,
        browser: getBrowserName()
      }).catch(err => console.error("Logging failed:", err));
      onAuthSuccess('coordinator', data.user.name, data.user.email, coordMobile, countryCode, data.user.isVerified, data.user._id);
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!loginIdentifier || !coordLoginPass) {
      setError('Please enter both your email/mobile number and password.');
      return;
    }

    const isEmailInput = loginIdentifier.includes('@');

    setLoading(true);
    apiService.initiateLogin({
      mobile: isEmailInput ? '' : loginIdentifier,
      countryCode: '',
      emailOrMobile: loginIdentifier,
      password: coordLoginPass
    })
    .then((data) => {
      setLoading(false);
      setOtpSent(true);
      setCountdown(30);
      setSmsToast({
        visible: true,
        message: data.message || 'OTP sent successfully to your registered email.',
        code: ''
      });
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  };

  const handleVerifyOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpInput) {
      setError('Please enter the verification OTP.');
      return;
    }

    const isEmailInput = loginIdentifier.includes('@');

    setLoading(true);
    apiService.verifyLogin({
      mobile: isEmailInput ? '' : loginIdentifier,
      countryCode: '',
      emailOrMobile: loginIdentifier,
      otp: otpInput
    })
    .then((data) => {
      setLoading(false);
      apiService.createLog({
        action: `Logged in to coordinator portal`,
        actorRole: 'coordinator',
        actorName: data.user.name,
        browser: getBrowserName()
      }).catch(err => console.error("Logging failed:", err));
      onAuthSuccess('coordinator', data.user.name, data.user.email, data.user.mobile, data.user.countryCode, data.user.isVerified, data.user._id);
      setSmsToast(null);
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminId || !adminKey || !adminPass) {
      setError('Please fill in all required authentication fields.');
      return;
    }

    if (adminKey.length < 4) {
      setError('Security key is invalid. Must be at least 4 characters.');
      return;
    }

    setLoading(true);
    apiService.verifyAdminLogin({
      adminId,
      password: adminPass,
      securityKey: adminKey
    })
    .then(() => {
      setLoading(false);
      apiService.createLog({
        action: `Logged in to admin portal`,
        actorRole: 'admin',
        actorName: 'Admin',
        browser: getBrowserName()
      }).catch(err => console.error("Logging failed:", err));
      onAuthSuccess('admin', 'System Administrator', adminId);
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  };

  return (
    <div 
      className={`glass-panel ${activeTab === 'coordinator' ? 'glass-panel-cyan' : 'glass-panel-pink'}`}
      style={{
        padding: '24px',
        width: '100%',
        maxWidth: hideRegister ? '440px' : '580px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5,
        boxShadow: activeTab === 'coordinator' 
          ? '0 10px 40px -10px rgba(0, 203, 214, 0.12)' 
          : '0 10px 40px -10px rgba(255, 42, 133, 0.12)',
        overflow: 'hidden'
      }}
    >
      {/* Integrated circular close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--panel-border)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10
          }}
          className="close-btn-hover"
          title="Close Login Portal"
        >
          <X size={16} />
        </button>
      )}
      {/* Dynamic Tab Header Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: activeTab === 'coordinator' ? 'var(--gta-gradient-2)' : 'var(--gta-gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        } as any}>
          {activeTab === 'coordinator' ? (
            hideRegister ? <Key size={20} color="#fff" /> : (hideLogin ? <UserPlus size={20} color="#fff" /> : (coordSubTab === 'register' ? <UserPlus size={20} color="#fff" /> : <Key size={20} color="#fff" />))
          ) : (
            <ShieldAlert size={20} color="#fff" />
          )}
        </div>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
            {activeTab === 'coordinator' 
              ? (hideRegister ? 'COORDINATOR LOGIN' : (hideLogin ? 'COORDINATOR REGISTRATION' : (coordSubTab === 'register' ? 'COORDINATOR REGISTRATION' : 'COORDINATOR OTP LOGIN'))) 
              : 'ADMIN SECURITY PORTAL'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {activeTab === 'coordinator' 
              ? (hideRegister ? 'Access student evaluation workspace by verifying OTP' : (hideLogin ? 'Request workspace coordinator credentials' : (coordSubTab === 'register' ? 'Request workspace coordinator credentials' : 'Access student evaluation workspace by verifying OTP'))) 
              : 'Secure secondary authentication bypass layer'}
          </p>
        </div>
      </div>

      {/* Switcher tabs for Coordinator (Register vs OTP Login) */}
      {activeTab === 'coordinator' && !hideRegister && !hideLogin && (
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0, 0, 0, 0.25)', 
          border: '1px solid var(--panel-border)', 
          padding: '3px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <button
            type="button"
            onClick={() => {
              setCoordSubTab('register');
              setOtpSent(false);
              setError('');
            }}
            style={{
              flex: 1,
              background: coordSubTab === 'register' ? 'var(--btn-secondary-bg-hover)' : 'transparent',
              color: coordSubTab === 'register' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
          >
            Register Account
          </button>
          <button
            type="button"
            onClick={() => {
              setCoordSubTab('login');
              setOtpSent(false);
              setError('');
            }}
            style={{
              flex: 1,
              background: coordSubTab === 'login' ? 'var(--btn-secondary-bg-hover)' : 'transparent',
              color: coordSubTab === 'login' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
          >
            Coordinator Login
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <strong>Authentication Error: </strong> {error}
        </div>
      )}

      {activeTab === 'coordinator' ? (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{
            display: (hideRegister || hideLogin) ? 'block' : 'flex',
            width: (hideRegister || hideLogin) ? '100%' : '200%',
            transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transform: (hideRegister || hideLogin)
              ? 'none'
              : (coordSubTab === 'register' ? 'translateX(0%)' : 'translateX(-50%)')
          }}>
            {/* PANEL 1: REGISTER */}
            {!hideRegister && (
              <div style={{ width: hideLogin ? '100%' : '50%', paddingRight: hideLogin ? '0px' : '12px', flexShrink: 0, boxSizing: 'border-box' }}>
              <form onSubmit={handleCoordinatorRegister}>
                <div className="registration-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="text"
                        placeholder="Rajesh Kumar"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordName}
                        onChange={(e) => setCoordName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Username</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        placeholder="rajesh_kumar"
                        className="form-input"
                        style={{ paddingLeft: '42px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordUsername}
                        onChange={(e) => setCoordUsername(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ''))}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Email Address</label>
                      {emailVerified && <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}><Check size={11} /> Verified</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          type="email"
                          placeholder="rajesh.kumar@gecm.ac.in"
                          className="form-input"
                          style={{ paddingLeft: '42px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                          value={coordEmail}
                          onChange={(e) => { setCoordEmail(e.target.value); setEmailOtpSent(false); setEmailOtpInput(''); setEmailError(''); }}
                          disabled={loading || emailVerified}
                          required
                        />
                      </div>
                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={() => handleSendRegisterOtp('email')}
                          disabled={emailSending || emailCountdown > 0 || !coordEmail}
                          className="btn-gta-secondary"
                          style={{
                            padding: '0 12px', fontSize: '11px', fontWeight: '700',
                            borderRadius: '6px', cursor: emailSending || emailCountdown > 0 ? 'default' : 'pointer',
                            whiteSpace: 'nowrap', height: '42px', flexShrink: 0,
                            background: emailCountdown > 0 ? 'rgba(0,203,214,0.08)' : 'var(--gta-gradient-2)',
                            color: emailCountdown > 0 ? 'var(--gta-cyan)' : '#fff',
                            border: emailCountdown > 0 ? '1px solid var(--panel-border-cyan)' : 'none',
                            opacity: !coordEmail ? 0.4 : 1, transition: 'all 0.2s'
                          }}
                        >
                          {emailSending ? 'Sending…' : emailCountdown > 0 ? `${emailCountdown}s` : 'Send OTP'}
                        </button>
                      )}
                    </div>
                    {emailError && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
                    {emailOtpSent && !emailVerified && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="_ _ _ _"
                          className="form-input"
                          style={{ flex: 1, padding: '8px 14px', fontSize: '15px', letterSpacing: '8px', fontWeight: '700', textAlign: 'center' }}
                          value={emailOtpInput}
                          onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          disabled={emailVerifying}
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => handleVerifyRegisterOtp('email')}
                          disabled={emailVerifying || emailOtpInput.length < 4}
                          style={{
                            padding: '8px 14px', fontSize: '12px', fontWeight: '700',
                            background: 'var(--gta-gradient-1)', color: '#fff',
                            border: 'none', borderRadius: '7px', cursor: 'pointer', flexShrink: 0,
                            opacity: emailOtpInput.length < 4 ? 0.5 : 1
                          }}
                        >
                          {emailVerifying ? '…' : <><Check size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />Verify</>}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Mobile Number</label>
                    <div
                      className="form-input"
                      style={{
                        display: 'flex', alignItems: 'center',
                        padding: '0 10px',
                        borderColor: regPhoneFocused ? 'var(--gta-cyan)' : 'var(--panel-border)',
                        boxShadow: regPhoneFocused ? '0 0 4px rgba(0, 203, 214, 0.15)' : 'none',
                        borderRadius: '8px', transition: 'all 0.3s'
                      }}
                    >
                      <Phone size={14} color="var(--text-muted)" style={{ marginRight: '6px', flexShrink: 0 }} />
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={loading}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <option value="+91" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+91</option>
                        <option value="+1" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+1</option>
                        <option value="+44" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+44</option>
                        <option value="+61" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+61</option>
                        <option value="+81" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+81</option>
                        <option value="+49" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+49</option>
                        <option value="+33" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+33</option>
                        <option value="+86" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+86</option>
                        <option value="+7" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+7</option>
                        <option value="+971" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+971</option>
                        <option value="+65" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+65</option>
                        <option value="+55" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+55</option>
                        <option value="+27" style={{ background: "var(--panel-bg-solid)", color: "var(--text-primary)" }}>+27</option>
                      </select>
                      <div style={{ width: '1px', height: '14px', background: 'var(--panel-border)', margin: '0 6px', flexShrink: 0 }}></div>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={coordMobile}
                        onChange={(e) => setCoordMobile(e.target.value.replace(/\D/g, ''))}
                        onFocus={() => setRegPhoneFocused(true)}
                        onBlur={() => setRegPhoneFocused(false)}
                        disabled={loading}
                        required
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', flex: 1, padding: '12px 0', fontSize: '14px', outline: 'none', minWidth: 0 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Institution</label>
                    <div style={{ position: 'relative' }}>
                      <Landmark size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="text"
                        placeholder="GECM"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordInstitution}
                        onChange={(e) => setCoordInstitution(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Department</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="text"
                        placeholder="CSE"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordDept}
                        onChange={(e) => setCoordDept(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordPass}
                        onChange={(e) => setCoordPass(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                        value={coordConfirmPass}
                        onChange={(e) => setCoordConfirmPass(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>

                {!emailVerified ? (
                  <div style={{ fontSize: '11.5px', color: 'var(--gta-cyan)', textAlign: 'center', marginTop: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
                    * Email OTP verification required to enable registration
                  </div>
                ) : null}
                <button 
                  type="submit" 
                  className="btn-gta-primary"
                  style={{ 
                    width: '100%', 
                    marginTop: '8px', 
                    justifyContent: 'center',
                    opacity: !emailVerified ? 0.5 : 1,
                    cursor: !emailVerified ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading || !emailVerified}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinning" />
                      PROVISIONING COORDINATOR...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      REGISTER
                    </>
                  )}
                </button>
              </form>
            </div>
            )}

            {/* PANEL 2: OTP LOGIN */}
            {!hideLogin && (
              <div style={{ width: hideRegister ? '100%' : '50%', paddingLeft: hideRegister ? '0px' : '12px', flexShrink: 0, boxSizing: 'border-box' }}>
              <form onSubmit={otpSent ? handleVerifyOtpAndLogin : handleSendOtp}>
                
                {/* Floating animated key verification indicator */}
                {otpSent && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', animation: 'slideIn 0.3s ease-out' }}>
                    <div className="glowing-pulsar" style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '50%', 
                      background: 'rgba(0, 203, 214, 0.1)', 
                      border: '1px solid var(--gta-cyan)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Key size={20} color="var(--gta-cyan)" style={{ animation: 'bounce 2s infinite ease-in-out' }} />
                    </div>
                  </div>
                )}

                {!otpSent ? (
                  <>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontSize: '13px' }}>Username</label>
                      <div 
                        className="form-input" 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '0 12px', 
                          borderColor: loginPhoneFocused ? 'var(--gta-cyan)' : 'var(--panel-border)',
                          boxShadow: loginPhoneFocused ? '0 0 4px rgba(0, 203, 214, 0.15)' : 'none',
                          borderRadius: '8px',
                          transition: 'all 0.3s',
                          marginTop: '8px'
                        }}
                      >
                        <User size={16} color="var(--text-muted)" style={{ marginRight: '8px', flexShrink: 0 }} />

                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          onFocus={() => setLoginPhoneFocused(true)}
                          onBlur={() => setLoginPhoneFocused(false)}
                          disabled={loading}
                          required
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            width: '100%',
                            padding: '14px 0',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontSize: '13px' }}>Password</label>
                      <div style={{ position: 'relative', marginTop: '8px' }}>
                        <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                        <input
                          type="password"
                          className="form-input"
                          style={{ paddingLeft: '48px', width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
                          value={coordLoginPass}
                          onChange={(e) => setCoordLoginPass(e.target.value)}
                          disabled={loading}
                          required
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                        Enter your coordinator password and registered email or mobile number
                      </span>
                    </div>
                  </>
                ) : (
                  <div>
                    {smsToast && smsToast.visible && (
                      <div style={{
                        background: 'rgba(0, 203, 214, 0.06)',
                        border: '1px solid rgba(0, 203, 214, 0.25)',
                        borderRadius: '10px',
                        padding: '14px',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        animation: 'slideIn 0.3s ease-out'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={14} color="var(--gta-cyan)" />
                          <strong style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--gta-cyan)' }}>
                            Verification Dispatched
                          </strong>
                        </div>
                        <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {smsToast.message}
                        </p>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label" style={{ fontSize: '13px' }}>Verification OTP Code</label>
                    <div style={{ position: 'relative', marginTop: '8px' }}>
                      <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
                      <input
                        type="text"
                        placeholder="Enter 4-Digit Code"
                        className="form-input"
                        style={{ paddingLeft: '48px', width: '100%', letterSpacing: '3px', fontWeight: 'bold' }}
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    {/* OTP Timer / Resend Control */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Sent to: <strong>{loginIdentifier}</strong>
                      </span>
                      {countdown > 0 ? (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--gta-cyan)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            padding: 0
                          }}
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  {otpSent && (
                    <button
                      type="button"
                      className="btn-gta-secondary"
                      style={{ padding: '12px 18px', fontSize: '14px' }}
                      onClick={() => {
                        setOtpSent(false);
                        setOtpInput('');
                        setError('');
                      }}
                      disabled={loading}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-gta-secondary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '14px', padding: '12px 24px' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinning" />
                        {otpSent ? 'AUTHORIZING OTP...' : 'SENDING OTP...'}
                      </>
                    ) : (
                      <>
                        {otpSent ? <Sparkles size={18} /> : <Mail size={18} />}
                        {otpSent ? 'VERIFY' : 'SEND VERIFICATION OTP'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            )}
          </div>
        </div>
      ) : (
        /* ADMIN LOGIN FORM */
        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label">Admin ID</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
              <input
                type="text"
                className="form-input form-input-pink"
                style={{ paddingLeft: '48px', width: '100%' }}
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
              <input
                type="password"
                className="form-input form-input-pink"
                style={{ paddingLeft: '48px', width: '100%' }}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Secondary Security Key</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '18px' }} />
              <input
                type="password"
                className="form-input form-input-pink"
                style={{ paddingLeft: '48px', width: '100%' }}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px' }}>
              Enter hardware vault secondary validation code
            </span>
          </div>

          <button
            type="submit"
            className="btn-gta-primary"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinning" />
                AUTHORIZING ENCRYPTED BYPASS...
              </>
            ) : (
              <>
                <ShieldAlert size={18} />
                DECRYPT AND ACCESS ROOT
              </>
            )}
          </button>
        </form>
      )}



      {/* Spinner and slide-in animations injected inline */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes slideIn {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .close-btn-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: var(--gta-pink) !important;
          border-color: rgba(255, 42, 133, 0.25) !important;
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};
