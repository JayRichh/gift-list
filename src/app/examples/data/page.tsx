"use client";

import { useEffect, useState } from "react";

import { ExampleContainer, ExampleSection } from "~/components/ExampleSection";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { CodePreview } from "~/components/ui/CodePreview";
import { Form } from "~/components/ui/Form";
import { Select } from "~/components/ui/Select";

const hookCode = `// Custom hook for local storage
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}`;

const formCode = `import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Form component with validation
export function FormExample() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        {...form.register('email')}
        error={form.errors.email?.message}
      />
      <FormField
        label="Password"
        type="password"
        {...form.register('password')}
        error={form.errors.password?.message}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}`;

const selectCode = `import { Select } from '~/components/ui/Select';
import { useState } from 'react';

export function DataSelectExample() {
  const [selected, setSelected] = useState('');
  
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  return (
    <div className="space-y-4">
      <Select
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder="Select an option"
      />
      {selected && (
        <div className="p-4 bg-background-secondary rounded-lg">
          Selected: {options.find(opt => opt.value === selected)?.label}
        </div>
      )}
    </div>
  );
}`;

const storageCode = `import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/Button';

export function LocalStorageExample() {
  const [count, setCount] = useState(0);

  // Load initial value from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('count');
    if (stored) setCount(parseInt(stored));
  }, []);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('count', newCount.toString());
  };

  const reset = () => {
    setCount(0);
    localStorage.removeItem('count');
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">Count: {count}</div>
      <div className="flex gap-4">
        <Button onClick={increment}>Increment</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}`;

function DataSelectExample() {
  const [selected, setSelected] = useState("");

  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  return (
    <div className="space-y-4">
      <Select
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder="Select an option"
      />
      {selected && (
        <div className="p-4 bg-background-secondary rounded-lg">
          Selected: {options.find((opt) => opt.value === selected)?.label}
        </div>
      )}
    </div>
  );
}

function LocalStorageExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("count");
    if (stored) setCount(parseInt(stored));
  }, []);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());
  };

  const reset = () => {
    setCount(0);
    localStorage.removeItem("count");
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">Count: {count}</div>
      <div className="flex gap-4">
        <Button onClick={increment}>Increment</Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default function DataExamplesPage() {
  return (
    <ExampleContainer
      _category="data"
      title="Data & Forms"
      description="Examples of form handling, data management, and state persistence."
    >
      <ExampleSection
        id="forms"
        category="data"
        title="Form Validation"
        description="Form with built-in validation and error handling using React Hook Form and Zod."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={formCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <Form />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="state"
        category="data"
        title="Data Selection"
        description="Interactive data selection with state management using React hooks."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent>
              <CodePreview code={selectCode} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <DataSelectExample />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="storage"
        category="data"
        title="Local Storage"
        description="Persisting data with browser local storage and custom hooks."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={storageCode} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent>
                <CodePreview code={hookCode} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <LocalStorageExample />
            </CardContent>
          </Card>
        </div>
      </ExampleSection>
    </ExampleContainer>
  );
}
