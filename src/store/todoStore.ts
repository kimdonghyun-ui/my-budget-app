import { create } from 'zustand';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoResponse, TodoPostResponse } from '@/types/todo';
import { fetchApi } from '@/lib/fetchApi';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTodos: () => Promise<void>;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (id: number, input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchApi<TodoResponse>('/todos', { method: 'GET' });
      
      set({ todos: response.data.sort((a, b) => 
        new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime()
      )});
    } catch (error) {
      set({ error: '할 일 목록을 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (input: CreateTodoInput) => {
    set({ isLoading: true });
    console.log(input);
    try {
      const response = await fetchApi<TodoPostResponse>('/todos', {
        method: 'POST',
        body: JSON.stringify({ data: input }),
      });
      set(state => ({
        todos: [response.data, ...state.todos]
      }));
    } catch (error) {
      set({ error: '할 일 추가에 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTodo: async (id: number, input: UpdateTodoInput) => {
    set({ isLoading: true });
    try {
      const response = await fetchApi<TodoPostResponse>(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: input }),
      });
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? response.data : todo
        )
      }));
    } catch (error) {
      set({ error: '할 일 수정에 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTodo: async (id: number) => {
    set({ isLoading: true });
    try {
      await fetchApi(`/todos/${id}`, { method: 'DELETE' });
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }));
    } catch (error) {
      set({ error: '할 일 삭제에 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error: string | null) => set({ error }),
})); 