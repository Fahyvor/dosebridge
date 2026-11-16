import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EducationalArticle } from '../../types';
import { api } from '../../services/api';

interface EducationState {
  articles: EducationalArticle[];
  activeArticle: EducationalArticle | null;
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: EducationState = {
  articles: [],
  activeArticle: null,
  selectedCategory: 'all',
  searchQuery: '',
  loading: false,
  error: null,
};

export const fetchArticles = createAsyncThunk(
  'education/fetchArticles',
  async (category: string | undefined, { rejectWithValue }) => {
    try {
      const data = await api.getResources(category);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch educational articles';
      return rejectWithValue(message);
    }
  }
);

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    setActiveArticle(state, action: PayloadAction<EducationalArticle | null>) {
      state.activeArticle = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        if (!state.activeArticle && action.payload.length > 0) {
          state.activeArticle = action.payload[0];
        }
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveArticle, setSelectedCategory, setSearchQuery } = educationSlice.actions;
export default educationSlice.reducer;
