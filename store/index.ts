import { create } from 'zustand'
import type { Database } from '@/types/supabasetype'
type ProfileType = Database['public']['Tables']['profiles']['Row']

type StateType = {

  //ユーザー情報の状態管理
  user: ProfileType
  setUser: (payload: ProfileType) => void

  //選択している大学名の状態管理
  selectedUniversity: string
  setSelectedUniversity: (university: string) => void
}

const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id: '', email: '', name: '', introduce: '', avatar_url: '' }, selectedUniversity: '',
  // アップデート
  setUser: (payload) => set({ user: payload }),
  setSelectedUniversity: (university) => set({ selectedUniversity: university }),
}))

export default useStore

//ここでのuniversityは何を意味する？？