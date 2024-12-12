'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { Gift } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'

export function usePlannedGifts() {
  const [plannedGifts, setPlannedGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setPlannedGifts([])
      setLoading(false)
      return
    }

    const fetchPlannedGifts = async () => {
      try {
        const { data, error } = await supabase
          .from('gifts')
          .select(`
            *,
            members!inner(
              *,
              groups!inner(*)
            )
          `)
          .eq('members.groups.user_id', user.id)
          .eq('status', 'planned')
          .order('priority', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true })

        if (error) throw error

        setPlannedGifts(data.map(gift => ({
          id: gift.id,
          memberId: gift.member_id,
          name: gift.name,
          notes: gift.description,
          cost: gift.cost,
          status: gift.status,
          tags: gift.tags || [],
          priority: gift.priority || undefined,
          createdAt: gift.created_at,
          updatedAt: gift.updated_at
        })))
      } catch (err) {
        console.error('Error fetching planned gifts:', err)
        setError('Failed to load planned gifts')
      } finally {
        setLoading(false)
      }
    }

    fetchPlannedGifts()

    // Subscribe to changes
    const subscription = supabase
      .channel('planned_gifts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'gifts',
          filter: `status=eq.planned`
        }, 
        () => {
          fetchPlannedGifts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const updateGiftStatus = async (giftId: string, status: Gift['status']) => {
    if (!user) throw new Error('Must be logged in to update gifts')

    try {
      const { error } = await supabase
        .from('gifts')
        .update({ status })
        .eq('id', giftId)

      if (error) throw error
    } catch (err) {
      console.error('Error updating gift status:', err)
      throw new Error('Failed to update gift status')
    }
  }

  const updateGiftPriority = async (giftId: string, priority?: number) => {
    if (!user) throw new Error('Must be logged in to update gifts')

    try {
      const { error } = await supabase
        .from('gifts')
        .update({ priority })
        .eq('id', giftId)

      if (error) throw error
    } catch (err) {
      console.error('Error updating gift priority:', err)
      throw new Error('Failed to update gift priority')
    }
  }

  return {
    plannedGifts,
    loading,
    error,
    updateGiftStatus,
    updateGiftPriority
  }
}
