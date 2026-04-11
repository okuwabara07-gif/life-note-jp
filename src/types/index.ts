export type Category = { id: string; name: string; icon: string; color: string; type: 'expense' | 'income' }
export type Transaction = { id: string; user_id: string; amount: number; type: 'expense' | 'income'; category_id: string; note: string | null; date: string; created_at: string; category?: Category }
export type Habit = { id: string; user_id: string; name: string; icon: string; target_days: number; created_at: string }
export type HabitLog = { id: string; habit_id: string; user_id: string; date: string; created_at: string }
