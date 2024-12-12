'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { Member } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'

export function useAllMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setMembers([])
      setLoading(false)
      return
    }

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select(`
            *,
            groups!inner(*)
          `)
          .eq('groups.user_id', user.id)
          .order('name', { ascending: true })

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
        console.error('Error fetching all members:', err)
        setError('Failed to load members')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()

    // Subscribe to changes
    const subscription = supabase
      .channel('all_members_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'members'
        }, 
        () => {
          fetchMembers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const getMemberById = (id: string) => {
    return members.find(member => member.id === id)
  }

  const getMembersByGroupId = (groupId: string) => {
    return members.filter(member => member.groupId === groupId)
  }

  return {
    members,
    loading,
    error,
    getMemberById,
    getMembersByGroupId
  }
}
