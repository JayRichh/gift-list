'use client'

import { useState, useEffect } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { BudgetAnalytics } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'
import { giftListApi } from '~/services/gift-list-api'

export function useBudgetAnalytics() {
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        const { data, success } = await giftListApi.getBudgetAnalytics()
        if (success) {
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Error fetching budget analytics:', err)
        setError('Failed to load budget analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Subscribe to relevant changes
    const subscription = supabase
      .channel('budget_analytics_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'gifts'
        }, 
        () => {
          fetchAnalytics()
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'groups'
        },
        () => {
          fetchAnalytics()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    analytics,
    loading,
    error
  }
}
