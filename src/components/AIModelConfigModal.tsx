import React, { useState } from 'react';
import { X, Sparkles, Key, CheckCircle, AlertTriangle, ExternalLink, Cpu, RefreshCw, Zap } from 'lucide-react';
import { getSavedAIModelConfig, saveAIModelConfig, type AIModelConfig } from '../services/aiModels';

interface AIModelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: AIModelConfig) => void;
}

export const AIModelConfigModal: React.FC<AIModelConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<AIModelConfig>(() => getSavedAIModelConfig());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Connecting to model API endpoint...');

    try {
      if (config.provider === 'gemini') {
        if (!config.apiKey?.trim()) {
          throw new Error('Please enter a Google Gemini API key first.');
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.apiKey.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with OK' }] }]
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
        setTestStatus('success');
        setTestMessage('✓ Gemini 2.0 Flash is connected & ready for ultra-precision extraction!');
      } else if (config.provider === 'groq') {
        if (!config.apiKey?.trim()) {
          throw new Error('Please enter a Groq API key first.');
        }
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 5
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
        setTestStatus('success');
        setTestMessage('✓ Groq LPU engine connected successfully!');
      } else if (config.provider === 'openrouter') {
        if (!config.apiKey?.trim()) {
          throw new Error('Please enter an OpenRouter API key first.');
        }
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: config.modelId || 'google/gemini-2.0-flash-exp:free',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 5
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
        setTestStatus('success');
        setTestMessage('✓ OpenRouter model connected successfully!');
      } else {
        setTestStatus('success');
        setTestMessage('✓ Local Enhanced Neural Semantic Engine is active and offline-ready.');
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${e.message || 'Check network / API key'}`);
    }
  };

  const handleSave = () => {
    saveAIModelConfig(config);
    if (onConfigSaved) {
      onConfigSaved(config);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--panel-bg, #0f172a)',
        border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.12))',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        color: 'var(--text-primary, #f8fafc)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--panel-border, rgba(255, 255, 255, 0.08))',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 203, 214, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gta-cyan, #00cbd6)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>High-Precision AI Vision & Extraction Engine</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
                Configure free models for ultra-accurate paper OCR and rubric criteria generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #64748b)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Provider Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary, #cbd5e1)' }}>
              Select AI Engine / Model Provider
            </label>
            <select
              value={config.provider}
              onChange={(e) => {
                const provider = e.target.value as any;
                let modelId = 'gemini-2.0-flash';
                if (provider === 'groq') modelId = 'llama-3.3-70b-versatile';
                if (provider === 'openrouter') modelId = 'google/gemini-2.0-flash-exp:free';
                if (provider === 'local') modelId = 'deepscript-neural-local';
                setConfig(prev => ({ ...prev, provider, modelId }));
                setTestStatus('idle');
                setTestMessage('');
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.15))',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary, #fff)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="gemini">Google Gemini 2.0 Flash (Free AI Studio Tier — Recommended)</option>
              <option value="groq">Groq LPU (Llama 3.3 70B & Vision — Free Fast Engine)</option>
              <option value="openrouter">OpenRouter Free Models (Qwen 2.5-VL / Gemini Flash)</option>
              <option value="local">DeepScript Local Neural Semantic Engine (Offline Zero-Cost)</option>
            </select>
          </div>

          {/* Model ID Selection */}
          {config.provider === 'gemini' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)' }}>Gemini Model Version</label>
              <select
                value={config.modelId}
                onChange={(e) => setConfig(prev => ({ ...prev, modelId: e.target.value }))}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.15))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-primary, #fff)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fastest & Ultra-High Precision)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (High Context 1M Tokens)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
              </select>
            </div>
          )}

          {config.provider === 'openrouter' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)' }}>Free Model Choice</label>
              <select
                value={config.modelId}
                onChange={(e) => setConfig(prev => ({ ...prev, modelId: e.target.value }))}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.15))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-primary, #fff)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="google/gemini-2.0-flash-exp:free">Google Gemini 2.0 Flash (Free)</option>
                <option value="qwen/qwen-2.5-vl-72b-instruct:free">Qwen 2.5-VL 72B Vision-Language (Free)</option>
                <option value="meta-llama/llama-3.2-11b-vision-instruct:free">Meta Llama 3.2 11B Vision (Free)</option>
                <option value="deepseek/deepseek-r1:free">DeepSeek R1 Reasoning (Free)</option>
              </select>
            </div>
          )}

          {/* API Key Input */}
          {config.provider !== 'local' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary, #cbd5e1)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Key size={13} style={{ color: 'var(--gta-cyan, #00cbd6)' }} />
                  {config.provider === 'gemini' ? 'Google Gemini Free API Key' : `${config.provider.toUpperCase()} API Key`}
                </label>
                {config.provider === 'gemini' && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: 'var(--gta-cyan, #00cbd6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    Get Free Key <ExternalLink size={10} />
                  </a>
                )}
                {config.provider === 'groq' && (
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: 'var(--gta-cyan, #00cbd6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    Get Free Key <ExternalLink size={10} />
                  </a>
                )}
                {config.provider === 'openrouter' && (
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: 'var(--gta-cyan, #00cbd6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    Get Free Key <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder={config.provider === 'gemini' ? 'AIzaSy...' : 'Paste API Key...'}
                value={config.apiKey || ''}
                onChange={(e) => {
                  setConfig(prev => ({ ...prev, apiKey: e.target.value }));
                  setTestStatus('idle');
                  setTestMessage('');
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.15))',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary, #fff)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                {config.provider === 'gemini' && '🔒 Google AI Studio provides 15 free requests per minute with zero credit card required.'}
                {config.provider === 'groq' && '🔒 Groq provides ultra-fast free inference on open models.'}
                {config.provider === 'openrouter' && '🔒 OpenRouter provides access to multiple free tier vision and reasoning models.'}
              </span>
            </div>
          )}

          {/* Test Status Banner */}
          {testMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: testStatus === 'success' ? 'rgba(34, 197, 94, 0.12)' : (testStatus === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 203, 214, 0.12)'),
              border: `1px solid ${testStatus === 'success' ? 'rgba(34, 197, 94, 0.3)' : (testStatus === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 203, 214, 0.3)')}`,
              color: testStatus === 'success' ? '#4ade80' : (testStatus === 'error' ? '#f87171' : 'var(--gta-cyan, #00cbd6)')
            }}>
              {testStatus === 'success' ? <CheckCircle size={15} /> : (testStatus === 'error' ? <AlertTriangle size={15} /> : <RefreshCw size={15} className="spin" />)}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {config.provider !== 'local' && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                style={{
                  padding: '9px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.15))',
                  color: 'var(--text-primary, #fff)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={13} />
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--gta-cyan, #00cbd6), #0284c7)',
                border: 'none',
                color: '#000',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0, 203, 214, 0.25)'
              }}
            >
              <CheckCircle size={15} />
              Save & Apply Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
