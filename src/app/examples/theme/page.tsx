"use client";

import { Moon, Sun } from "lucide-react";

import { useState } from "react";

import { ExampleContainer, ExampleSection } from "~/components/ExampleSection";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { CodePreview } from "~/components/ui/CodePreview";

const themeCode = `// app/globals.css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}`;

const toggleCode = `import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/Button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}`;

const colorCode = `// tailwind.config.ts
import { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
    },
  },
};

export default config;`;

const gradientCode = `// Gradient utilities with Tailwind CSS
export function GradientExamples() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Basic gradients */}
      <div className="h-24 bg-gradient-to-r from-primary to-accent rounded-lg" />
      <div className="h-24 bg-gradient-to-br from-secondary to-primary rounded-lg" />
      
      {/* Glass effect with gradient */}
      <div className="h-24 glass bg-gradient-to-tr from-accent/20 to-secondary/20 rounded-lg" />
      
      {/* Animated gradient */}
      <div className="h-24 animate-gradient bg-gradient-to-r from-primary via-accent to-secondary rounded-lg" />
    </div>
  );
}`;

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function ColorSystem() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-primary text-primary-foreground rounded-lg">Primary</div>
      <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">Secondary</div>
      <div className="p-4 bg-accent text-accent-foreground rounded-lg">Accent</div>
      <div className="p-4 bg-muted text-muted-foreground rounded-lg">Muted</div>
      <div className="p-4 bg-background text-foreground rounded-lg border">Background</div>
      <div className="p-4 bg-background-secondary text-foreground rounded-lg">
        Background Secondary
      </div>
    </div>
  );
}

function GradientExamples() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-gradient-to-r from-primary to-accent rounded-lg" />
      <div className="h-24 bg-gradient-to-br from-secondary to-primary rounded-lg" />
      <div className="h-24 glass bg-gradient-to-tr from-accent/20 to-secondary/20 rounded-lg" />
      <div className="h-24 animate-gradient bg-gradient-to-r from-primary via-accent to-secondary rounded-lg" />
    </div>
  );
}

export default function ThemePage() {
  return (
    <ExampleContainer
      _category="theme"
      title="Theming"
      description="Examples of theme customization, dark mode, and color system."
    >
      <ExampleSection
        id="darkmode"
        category="theme"
        title="Dark Mode Toggle"
        description="Toggle between light and dark mode with CSS variables and Tailwind."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={toggleCode} />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={themeCode} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <ThemeToggle />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="colors"
        category="theme"
        title="Color System"
        description="Semantic color system with CSS variables and Tailwind configuration."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={colorCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <ColorSystem />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="gradients"
        category="theme"
        title="Gradient Examples"
        description="Various gradient styles and animations using Tailwind utilities."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={gradientCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <GradientExamples />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>
    </ExampleContainer>
  );
}
