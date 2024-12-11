"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GiftIcon, ArrowRight } from "lucide-react";
import { Container } from "~/components/ui/Container";
import { Text } from "~/components/ui/Text";
import { Button } from "~/components/ui/Button";
import { FirstTimeSetup } from "~/components/FirstTimeSetup";
import type { BudgetPreference } from "~/types/gift-list";

const STORAGE_KEYS = {
  SETUP_COMPLETED: 'hasCompletedSetup',
  BUDGET_PREFERENCES: 'budgetPreferences',
};

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    const setupCompleted = localStorage.getItem(STORAGE_KEYS.SETUP_COMPLETED);
    setHasCompletedSetup(!!setupCompleted);
    
    // Show setup dialog if setup=true query param is present
    if (searchParams.get('setup') === 'true') {
      setShowFirstTimeSetup(true);
    }
  }, [searchParams]);

  const handleSetupComplete = (preferences: BudgetPreference) => {
    localStorage.setItem(STORAGE_KEYS.SETUP_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEYS.BUDGET_PREFERENCES, JSON.stringify(preferences));
    router.push('/groups');
  };

  return (
    <>
      <Container>
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <GiftIcon className="w-16 h-16 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Text variant="h1" className="text-4xl sm:text-5xl font-bold">
                Welcome to Gift List
              </Text>
              <Text className="text-foreground-secondary text-lg sm:text-xl">
                Your personal gift management assistant. Keep track of gifts, budgets, and make every occasion special.
              </Text>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => hasCompletedSetup ? router.push('/groups') : setShowFirstTimeSetup(true)}
                className="gap-2 text-lg px-8 py-6"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto w-full"
          >
            {[
              {
                title: "Organize Groups",
                description: "Create gift groups for different occasions and events"
              },
              {
                title: "Track Budgets",
                description: "Set and monitor budgets for individuals or groups"
              },
              {
                title: "Smart Analytics",
                description: "Get insights into your gift-giving patterns"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-background-secondary/50 border border-border/50"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground-secondary">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>

      <FirstTimeSetup 
        isOpen={showFirstTimeSetup} 
        onComplete={handleSetupComplete}
        onClose={() => setShowFirstTimeSetup(false)}
      />
    </>
  );
}
