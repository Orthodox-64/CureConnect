import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Apple, Sun, Droplet, Dumbbell } from "lucide-react";

const tips = [
  {
    icon: <Apple className="w-8 h-8 text-green-500" />,
    title: "Eat a Healthy Diet",
    description:
      "Focus on fruits, vegetables, whole grains, and lean proteins. Limit processed foods and red meat.",
  },
  {
    icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
    title: "Stay Physically Active",
    description:
      "Aim for at least 30 minutes of physical activity daily to maintain a healthy weight and strengthen immunity.",
  },
  {
    icon: <Droplet className="w-8 h-8 text-teal-500" />,
    title: "Avoid Tobacco & Limit Alcohol",
    description:
      "Tobacco use and excessive alcohol intake are leading causes of cancer. Avoid or reduce both.",
  },
  {
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    title: "Protect Yourself from the Sun",
    description:
      "Use sunscreen, wear protective clothing, and avoid tanning beds to reduce skin cancer risk.",
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-pink-500" />,
    title: "Get Regular Screenings",
    description:
      "Early detection through screenings like mammograms and colonoscopies can save lives.",
  },
];

export default function CancerHealthTips() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-8 text-center">
        🌸 Cancer Prevention & Health Tips
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="bg-white shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              {tip.icon}
              <h2 className="text-xl font-semibold mt-4 text-gray-800">
                {tip.title}
              </h2>
              <p className="text-gray-600 mt-2">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-10 text-center">
        💖 Remember: Small daily habits create lasting health.
      </p>
    </div>
  );
}
