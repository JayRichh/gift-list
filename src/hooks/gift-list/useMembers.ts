'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { Member } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'

export function useMembers(groupId?: string) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user || !groupId) {
      setMembers([])
      setLoading(false)
      return
    }

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*, groups!inner(*)')
          .eq('groups.user_id', user.id)
          .eq('group_id', groupId)
          .order('created_at', { ascending: true })

        if (error) throw error

        setMembers(data.map(member => ({
          id: member.id,
          groupId: member.group_id,
          name: member.name,
          slug: member.slug,
          createdAt: member.created_at,
          updatedAt: member.updated_at
        })))
      } catch (err) {
        console.error('Error fetching members:', err)
        setError('Failed to load members')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()

    // Subscribe to changes
    const subscription = supabase
      .channel('members_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'members',
          filter: `group_id=eq.${groupId}`
        }, 
        () => {
          fetchMembers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, groupId])

  const createMember = async (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Must be logged in to create members')

    try {
      const { data: newMember, error } = await supabase
        .from('members')
        .insert({
          name: data.name,
          slug: data.slug,
          group_id: data.groupId
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: newMember.id,
        groupId: newMember.group_id,
        name: newMember.name,
        slug: newMember.slug,
        createdAt: newMember.created_at,
        updatedAt: newMember.updated_at
      }
    } catch (err) {
      console.error('Error creating member:', err)
      throw new Error('Failed to create member')
    }
  }

  const updateMember = async (id: string, data: Partial<Omit<Member, 'id' | 'groupId' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) throw new Error('Must be logged in to update members')

    try {
      const { data: updatedMember, error } = await supabase
        .from('members')
        .update({
          name: data.name,
          slug: data.slug
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: updatedMember.id,
        groupId: updatedMember.group_id,
        name: updatedMember.name,
        slug: updatedMember.slug,
        createdAt: updatedMember.created_at,
        updatedAt: updatedMember.updated_at
      }
    } catch (err) {
      console.error('Error updating member:', err)
      throw new Error('Failed to update member')
    }
  }

  const deleteMember = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete members')

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting member:', err)
      throw new Error('Failed to delete member')
    }
  }

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember
  }
}
