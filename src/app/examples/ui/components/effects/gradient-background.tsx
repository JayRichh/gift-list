"use client";

import { ComponentExample } from "../types";

export const gradientBackgroundCode = `export function GradientExamples() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Vibrant gradient */}
      <div className="group h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Vibrant Gradient</h3>
          <p className="text-blue-100">Smooth transitions between colors</p>
        </div>
      </div>

      {/* Multi-color gradient */}
      <div className="group h-40 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Multi-color</h3>
          <p className="text-pink-100">Three-color gradient blend</p>
        </div>
      </div>

      {/* Glass effect */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/90 to-pink-600/90 backdrop-blur-sm" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Glass Effect</h3>
          <p className="text-purple-100">Frosted glass with gradient</p>
        </div>
      </div>

      {/* Animated gradient */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 animate-gradient bg-[length:200%_200%]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Animated</h3>
          <p className="text-violet-100">Smooth flowing animation</p>
        </div>
      </div>

      {/* Mesh pattern */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_12px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_12px)]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Mesh Pattern</h3>
          <p className="text-indigo-100">Geometric overlay design</p>
        </div>
      </div>

      {/* Spotlight effect */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.5)_120%)]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Spotlight</h3>
          <p className="text-purple-100">Radial spotlight effect</p>
        </div>
      </div>
    </div>
  );
}`;

export function GradientExamples() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Vibrant gradient */}
      <div className="group h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Vibrant Gradient</h3>
          <p className="text-blue-100">Smooth transitions between colors</p>
        </div>
      </div>

      {/* Multi-color gradient */}
      <div className="group h-40 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Multi-color</h3>
          <p className="text-pink-100">Three-color gradient blend</p>
        </div>
      </div>

      {/* Glass effect */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/90 to-pink-600/90 backdrop-blur-sm" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Glass Effect</h3>
          <p className="text-purple-100">Frosted glass with gradient</p>
        </div>
      </div>

      {/* Animated gradient */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 animate-gradient bg-[length:200%_200%]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Animated</h3>
          <p className="text-violet-100">Smooth flowing animation</p>
        </div>
      </div>

      {/* Mesh pattern */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_12px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_12px)]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Mesh Pattern</h3>
          <p className="text-indigo-100">Geometric overlay design</p>
        </div>
      </div>

      {/* Spotlight effect */}
      <div className="group h-40 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.5)_120%)]" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Spotlight</h3>
          <p className="text-purple-100">Radial spotlight effect</p>
        </div>
      </div>
    </div>
  );
}

export const gradientBackgroundMeta: ComponentExample = {
  id: "gradient-background",
  title: "Gradient Examples",
  description:
    "Beautiful gradient styles and effects using Tailwind utilities. Features vibrant colors, glass effects, animated gradients, mesh patterns, and spotlight effects.",
  code: gradientBackgroundCode,
  component: <GradientExamples />,
  meta: {
    features: [
      "Vibrant multi-color gradients",
      "Glass effect with backdrop blur",
      "Smooth animated gradients",
      "Geometric mesh patterns",
      "Spotlight and overlay effects",
      "Interactive hover states",
    ],
  },
};
