'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { Gift, GiftStatus } from '~/types/gift-list'
import type { Database } from '~/lib/supabase/types'
import { useAuth } from '~/contexts/auth'

type GiftRow = Database['public']['Tables']['gifts']['Row']

export function useGifts(memberId?: string) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setGifts([])
      setLoading(false)
      return
    }

    const fetchGifts = async () => {
      try {
        let query = supabase
          .from('gifts')
          .select(`
            *,
            members!inner(
              *,
              groups!inner(*)
            )
          `)
          .eq('members.groups.user_id', user.id)
          .order('created_at', { ascending: true })

        if (memberId) {
          query = query.eq('member_id', memberId)
        }

        const { data, error } = await query

        if (error) throw error

        setGifts(data.map((gift: GiftRow) => ({
          id: gift.id,
          memberId: gift.member_id,
          name: gift.name,
          notes: gift.description || undefined,
          cost: gift.cost,
          status: gift.status,
          tags: gift.tags || [],
          priority: gift.priority || undefined,
          createdAt: gift.created_at,
          updatedAt: gift.updated_at
        })))
      } catch (err) {
        console.error('Error fetching gifts:', err)
        setError('Failed to load gifts')
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()

    // Subscribe to changes
    const subscription = supabase
      .channel('gifts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'gifts',
          filter: memberId ? `member_id=eq.${memberId}` : undefined
        }, 
        () => {
          fetchGifts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, memberId])

  const createGift = async (data: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Must be logged in to create gifts')

    try {
      const { data: newGift, error } = await supabase
        .from('gifts')
        .insert({
          member_id: data.memberId,
          name: data.name,
          description: data.notes,
          cost: data.cost,
          status: data.status,
          tags: data.tags,
          priority: data.priority && data.priority <= 3 ? data.priority : undefined // Ensure priority is 1-3
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: newGift.id,
        memberId: newGift.member_id,
        name: newGift.name,
        notes: newGift.description || undefined,
        cost: newGift.cost,
        status: newGift.status,
        tags: newGift.tags || [],
        priority: newGift.priority || undefined,
        createdAt: newGift.created_at,
        updatedAt: newGift.updated_at
      }
    } catch (err) {
      console.error('Error creating gift:', err)
      throw new Error('Failed to create gift')
    }
  }

  const updateGift = async (id: string, data: Partial<Omit<Gift, 'id' | 'memberId' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) throw new Error('Must be logged in to update gifts')

    try {
      const { data: updatedGift, error } = await supabase
        .from('gifts')
        .update({
          name: data.name,
          description: data.notes,
          cost: data.cost,
          status: data.status,
          tags: data.tags,
          priority: data.priority && data.priority <= 3 ? data.priority : undefined // Ensure priority is 1-3
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: updatedGift.id,
        memberId: updatedGift.member_id,
        name: updatedGift.name,
        notes: updatedGift.description || undefined,
        cost: updatedGift.cost,
        status: updatedGift.status,
        tags: updatedGift.tags || [],
        priority: updatedGift.priority || undefined,
        createdAt: updatedGift.created_at,
        updatedAt: updatedGift.updated_at
      }
    } catch (err) {
      console.error('Error updating gift:', err)
      throw new Error('Failed to update gift')
    }
  }

  const deleteGift = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete gifts')

    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting gift:', err)
      throw new Error('Failed to delete gift')
    }
  }

  return {
    gifts,
    loading,
    error,
    createGift,
    updateGift,
    deleteGift
  }
}
