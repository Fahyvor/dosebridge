import React, { useState } from 'react';
import { useDoseBridge } from '../store/useDoseBridge';
import { RbacRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    authUser,
    authRole,
    isAuthenticated,
    authLoading,
    authError,
    login,
    register,
    switchRole,
    quickSignIn,
    logout,
  } = useDoseBridge();

  const [mode, setMode] = useState<'profile' | 'login' | 'register'>(
    isAuthenticated ? 'profile' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regRole, setRegRole] = useState<RbacRole>('PATIENT');
  const [accessCode, setAccessCode] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
      setActionSuccess('Signed in successfully!');
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    } catch {
      // Handled in Redux
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    try {
      await register({
        email,
        password,
        name,
        role: regRole,
        accessCode: accessCode.trim() || undefined,
      });
      setActionSuccess(`Account created as ${regRole}!`);
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    } catch {
      // Handled in Redux
    }
  };

  const handleQuickSwitch = async (roleType: 'patient' | 'caregiver' | 'clinician') => {
    try {
      await quickSignIn(roleType);
      setActionSuccess(`Switched active account`);
      setTimeout(() => setActionSuccess(null), 2000);
    } catch {
      // Handled
    }
  };

  const handleRoleChange = async (newRole: RbacRole) => {
    try {
      await switchRole(newRole);
      setActionSuccess(`Role updated to ${newRole}`);
      setTimeout(() => setActionSuccess(null), 2000);
    } catch {
      // Handled
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f2ede4]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
              Authentication & Role-Based Access (RBAC)
            </span>
            <h2 id="auth-modal-title" className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              {mode === 'profile'
                ? 'Active Account & Privileges'
                : mode === 'login'
                ? 'Sign In to DoseBridge'
                : 'Create Healthcare Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] text-xs font-semibold text-[#78716c] hover:text-[#1c1917]"
          >
            Close
          </button>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] text-[#14532d] text-xs font-medium">
            {actionSuccess}
          </div>
        )}
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[#991b1b] text-xs font-medium">
            {authError}
          </div>
        )}

        {/* MODE: PROFILE / ACTIVE RBAC SESSION */}
        {mode === 'profile' && authUser && (
          <div className="mt-5 space-y-6">
            {/* User Overview Box */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                  Signed In Identity
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1c1917] mt-0.5">
                  {authUser.name}
                </h3>
                <p className="text-xs text-[#57534e] mt-0.5">{authUser.email}</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-lg font-mono text-xs font-bold tracking-wide uppercase bg-[#1e3a2f] text-[#fcfbf9]">
                  {authRole}
                </span>
                <span className="text-[10px] text-[#78716c] block mt-1">RBAC Authority</span>
              </div>
            </div>

            {/* RBAC Privilege Scope Explanation */}
            <div className="p-4 rounded-2xl bg-white border border-[#e7e2d8] space-y-2 text-xs">
              <span className="font-bold text-[#1c1917] uppercase tracking-wider text-[11px] block">
                Privileges for {authRole}:
              </span>
              {authRole === 'PATIENT' && (
                <ul className="space-y-1.5 text-[#57534e]">
                  <li>• Log and confirm personal daily doses</li>
                  <li>• Request medication refills and review remaining pill supply</li>
                  <li>• Access plain-language educational health library monographs</li>
                  <li>• View family care bulletins posted for Eleanor</li>
                </ul>
              )}
              {authRole === 'CAREGIVER' && (
                <ul className="space-y-1.5 text-[#57534e]">
                  <li>• Monitor loved one&apos;s real-time adherence trail</li>
                  <li>• Confirm or verify doses on behalf of patient</li>
                  <li>• Post and manage family care bulletins & reminders</li>
                  <li>• Link family members via secure 6-character Care Circle code</li>
                </ul>
              )}
              {authRole === 'CLINICIAN' && (
                <ul className="space-y-1.5 text-[#57534e]">
                  <li>• Prescribe and modify medications (dosage, frequency, food rules)</li>
                  <li>• Discontinue or delete prescriptions with medical oversight</li>
                  <li>• Update clinical diagnoses, allergies, and emergency handoffs</li>
                  <li>• Full compliance audit and multi-patient management</li>
                </ul>
              )}
              {authRole === 'ADMIN' && (
                <ul className="space-y-1.5 text-[#57534e]">
                  <li>• Unrestricted system administration & RBAC policy assignment</li>
                  <li>• Access all patient records and audit trails</li>
                </ul>
              )}
            </div>

            {/* Switch Active RBAC Role */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#44403c] block">
                Switch Role for Current Account (Live RBAC Re-authorization):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                      authRole === r
                        ? 'bg-[#1e3a2f] text-white border-[#1e3a2f] shadow-xs'
                        : 'bg-[#faf8f5] text-[#57534e] border-[#e7e2d8] hover:bg-[#f2ede4]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Tap Demo Switcher */}
            <div className="space-y-2 pt-2 border-t border-[#f2ede4]">
              <span className="text-xs font-semibold text-[#44403c] block">
                Quick-Switch Seeded RBAC Accounts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('patient')}
                  className="p-3 rounded-xl border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1c1917]">Eleanor Vance</div>
                  <div className="text-[11px] text-[#78716c]">Role: PATIENT</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('caregiver')}
                  className="p-3 rounded-xl border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1c1917]">David Vance</div>
                  <div className="text-[11px] text-[#78716c]">Role: CAREGIVER</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('clinician')}
                  className="p-3 rounded-xl border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1c1917]">Dr. Sarah Chen</div>
                  <div className="text-[11px] text-[#78716c]">Role: CLINICIAN</div>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#f2ede4]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#1e3a2f] font-semibold hover:underline"
              >
                Sign In as Different User
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl border border-[#fecdd3] text-[#be123c] hover:bg-[#fff1f2] text-xs font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. eleanor@example.com or david@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: password123)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs text-[#57534e]">
              <span className="font-semibold text-[#1c1917]">Seeded Demo Credentials:</span>
              <div className="mt-1 font-mono text-[11px] space-y-0.5 text-[#78716c]">
                <div>• Patient: eleanor@example.com / password123</div>
                <div>• Caregiver: david@example.com / password123</div>
                <div>• Clinician: dr.chen@example.com / password123</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-[#1e3a2f] font-semibold hover:underline"
              >
                Need an account? Register here
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="px-6 py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Margaret Smith"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. margaret@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Password * (min. 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Role (RBAC Privilege Level) *
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as RbacRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium focus:outline-none"
              >
                <option value="PATIENT">Patient (Self Medication Care)</option>
                <option value="CAREGIVER">Caregiver (Support Loved One)</option>
                <option value="CLINICIAN">Clinician / Physician (Prescribing Access)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            {regRole === 'CAREGIVER' && (
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Patient Care Circle Code (Optional)
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DB-6821"
                  className="w-full px-3.5 py-2.5 font-mono rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#1e3a2f] font-semibold hover:underline"
              >
                Already have an account? Sign in
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="px-6 py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
