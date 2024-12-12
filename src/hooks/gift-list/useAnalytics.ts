'use client'

import { useState, useEffect } from 'react'
import { createClient } from '~/lib/supabase/client'
import type { BudgetAnalytics, GiftAnalytics } from '~/types/gift-list'
import { useAuth } from '~/contexts/auth'
import { giftListApi } from '~/services/gift-list-api'

export function useAnalytics() {
  const [budgetAnalytics, setBudgetAnalytics] = useState<BudgetAnalytics | null>(null)
  const [giftAnalytics, setGiftAnalytics] = useState<GiftAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setBudgetAnalytics(null)
      setGiftAnalytics(null)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        const [budgetResponse, giftResponse] = await Promise.all([
          giftListApi.getBudgetAnalytics(),
          giftListApi.getGiftAnalytics()
        ])

        if (budgetResponse.success && giftResponse.success) {
          setBudgetAnalytics(budgetResponse.data)
          setGiftAnalytics(giftResponse.data)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Subscribe to relevant changes
    const subscription = supabase
      .channel('analytics_changes')
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
    budgetAnalytics,
    giftAnalytics,
    loading,
    error
  }
}
