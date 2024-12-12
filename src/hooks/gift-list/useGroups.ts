'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { Group } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setGroups([])
      setLoading(false)
      return
    }

    const fetchGroups = async () => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        setGroups(data.map(group => ({
          id: group.id,
          name: group.name,
          slug: group.slug,
          description: group.description || undefined,
          budget: group.budget || 0,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        })))
      } catch (err) {
        console.error('Error fetching groups:', err)
        setError('Failed to load groups')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()

    // Subscribe to changes
    const subscription = supabase
      .channel('groups_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'groups',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchGroups()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const createGroup = async (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Must be logged in to create groups')

    try {
      const { data: newGroup, error } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
          budget: data.budget,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: newGroup.id,
        name: newGroup.name,
        slug: newGroup.slug,
        description: newGroup.description || undefined,
        budget: newGroup.budget || 0,
        createdAt: newGroup.created_at,
        updatedAt: newGroup.updated_at
      }
    } catch (err) {
      console.error('Error creating group:', err)
      throw new Error('Failed to create group')
    }
  }

  const updateGroup = async (id: string, data: Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) throw new Error('Must be logged in to update groups')

    try {
      const { data: updatedGroup, error } = await supabase
        .from('groups')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
          budget: data.budget
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: updatedGroup.id,
        name: updatedGroup.name,
        slug: updatedGroup.slug,
        description: updatedGroup.description || undefined,
        budget: updatedGroup.budget || 0,
        createdAt: updatedGroup.created_at,
        updatedAt: updatedGroup.updated_at
      }
    } catch (err) {
      console.error('Error updating group:', err)
      throw new Error('Failed to update group')
    }
  }

  const deleteGroup = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete groups')

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting group:', err)
      throw new Error('Failed to delete group')
    }
  }

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup
  }
}
