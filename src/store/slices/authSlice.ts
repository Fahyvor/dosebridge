import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, RbacRole } from '../../types';
import { api, getStoredToken, setStoredToken } from '../../services/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: RbacRole;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialToken = getStoredToken();

const initialState: AuthState = {
  user: {
    id: 'usr-eleanor',
    email: 'eleanor@example.com',
    name: 'Eleanor Vance',
    role: 'PATIENT',
    patientId: 'pat-1',
    caregiverId: null,
  },
  token: initialToken,
  role: 'PATIENT',
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.login(email, password);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    payload: { email: string; password: string; name: string; role?: RbacRole; accessCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.register(payload);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

export const checkCurrentUser = createAsyncThunk(
  'auth/checkCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getMe();
      return res.user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Session expired';
      return rejectWithValue(msg);
    }
  }
);

export const switchUserRole = createAsyncThunk(
  'auth/switchUserRole',
  async (newRole: RbacRole, { rejectWithValue }) => {
    try {
      const res = await api.switchRole(newRole);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to switch role';
      return rejectWithValue(msg);
    }
  }
);

export const quickSignInAs = createAsyncThunk(
  'auth/quickSignInAs',
  async (roleType: 'patient' | 'caregiver' | 'clinician', { dispatch }) => {
    const creds = {
      patient: { email: 'eleanor@example.com', password: 'password123' },
      caregiver: { email: 'david@example.com', password: 'password123' },
      clinician: { email: 'dr.chen@example.com', password: 'password123' },
    }[roleType];

    const res = await dispatch(loginUser(creds)).unwrap();
    return res;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = 'PATIENT';
      state.isAuthenticated = false;
      state.error = null;
      api.logout();
    },
    clearAuthError(state) {
      state.error = null;
    },
    setLocalRole(state, action: PayloadAction<RbacRole>) {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // checkCurrentUser
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(checkCurrentUser.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        setStoredToken(null);
      })

      // switchUserRole
      .addCase(switchUserRole.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      });
  },
});

export const { logout, clearAuthError, setLocalRole } = authSlice.actions;
export default authSlice.reducer;
