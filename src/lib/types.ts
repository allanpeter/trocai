export type StickerStatus = 'have' | 'duplicate' | 'need'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  city: string | null
  state: string | null
  avatar_url: string | null
  bio: string | null
  rating: number
  trades_count: number
  created_at: string
}

export interface Album {
  id: string
  name: string
  year: number
  total_stickers: number
  cover_url: string | null
}

export interface Sticker {
  id: string
  album_id: string
  number: number
  name: string | null
  team: string | null
  is_rare: boolean
}

export interface UserSticker {
  id: string
  user_id: string
  sticker_id: string
  status: StickerStatus
  quantity: number
  updated_at: string
}

export interface Chat {
  id: string
  user1_id: string
  user2_id: string
  last_message_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Rating {
  id: string
  rater_id: string
  rated_id: string
  trade_id: string | null
  score: number
  comment: string | null
  created_at: string
}

/** Returned by the find_matches() Postgres RPC */
export interface MatchResult {
  user_id: string
  username: string
  city: string | null
  state: string | null
  avatar_url: string | null
  rating: number
  trades_count: number
  they_have_you_need: number
  you_have_they_need: number
  overlap_score: number
}

/** Chat with the other user's profile joined */
export interface ChatWithProfile extends Chat {
  other_user: Profile
  last_message: string | null
  unread_count: number
}
