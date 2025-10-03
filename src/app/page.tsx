"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Users, TrendingUp, Gift, CheckCircle, Menu, X } from "lucide-react";

interface UserPoints {
  allTime: number;
  weekly: number;
  maxAllTime: number;
  maxWeekly: number;
}

type ActiveSection = "about" | "event";

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("about");
  const [username, setUsername] = useState("");
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCheckPoints = async () => {
    if (!username.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/check-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserPoints({
          allTime: data.allTime,
          weekly: data.weekly,
          maxAllTime: data.maxAllTime,
          maxWeekly: data.maxWeekly
        });
      } else {
        // Handle errors - show user-friendly message
        alert(data.error || 'Failed to fetch points. Please try again.');
        setUserPoints(null);
      }
    } catch (error) {
      console.error('Error checking points:', error);
      alert('Failed to connect to the server. Please check your internet connection and try again.');
      setUserPoints(null);
    } finally {
      setIsLoading(false);
    }
  };

  const allTimeRewards = [
    { points: 10, reward: "$200 / 30 days contract" },
    { points: 25, reward: "$600 / 30 days contract" },
    { points: 50, reward: "$1,400 / 30 days contract" },
    { points: 75, reward: "$2,200 / 30 days contract" },
    { points: 100, reward: "$3,000 / 30 days contract" }
  ];

  const weeklyRewards = [
    { points: 10, reward: "$100 / 30 days contract" },
    { points: 30, reward: "$300 / 30 days contract" },
    { points: 50, reward: "$500 / 30 days contract" },
    { points: 80, reward: "$800 / 30 days contract" },
    { points: 100, reward: "$1,000 / 30 days contract" }
  ];

  const joinSteps = [
    "Activate your MEV Bot ($49.9 one-time)",
    "Invite new direct referrals activate contract (only their first contract counts)",
    "Only valid contracts count (terminated, 1-day & 7-day not eligible)",
    "Accumulate points until October 31",
    "Starting November 1, redeem your points for rewards",
    "Redeem as many times as you want if you have enough points"
  ];

  const termsConditions = [
    "Only new direct referrals activating their first contract will count",
    "Terminated contracts will not be counted",
    "Only 30-day (1pt) and 100-day (3pts) contracts are eligible",
    "Redemption available from 1st November 2025",
    "Redemption can be done multiple times if you have enough points",
    "Points valid until 7th November 2025, unused points will expire",
    "Rewards will be distributed as SMARTS contracts only (not cash/USDT)",
    "Redemption requests must be submitted through your leader / Marketers' PA"
  ];

  const renderAboutSection = () => (
    <div className="container mx-auto px-4 py-12">
      <Card className="bg-gray-900/50 border-gray-800 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl text-white flex items-center justify-center gap-3 mb-4">
            <Users className="text-[#06F29E]" />
            About Sandwich Society
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-gray-300 text-xl leading-relaxed text-center">
            Sandwich Society is a community under the SMARTS platform. We gather people passionate about MEV technology,
            sharing strategies, and helping each other grow. By joining, you get access to exclusive events, points, and rewards.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <CheckCircle className="text-[#06F29E] w-8 h-8 flex-shrink-0" />
              <span className="text-gray-300 text-lg">Community-driven and growth-focused</span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <TrendingUp className="text-[#06F29E] w-8 h-8 flex-shrink-0" />
              <span className="text-gray-300 text-lg">Focus on MEV trading & blockchain education</span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Gift className="text-[#06F29E] w-8 h-8 flex-shrink-0" />
              <span className="text-gray-300 text-lg">Monthly events with point-based rewards</span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Users className="text-[#06F29E] w-8 h-8 flex-shrink-0" />
              <span className="text-gray-300 text-lg">Open for new members anytime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventSection = () => (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Points Check Section */}
      <section>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-[#06F29E] text-center">
              Sandwich Point Redeem Festival
            </CardTitle>
            <CardDescription className="text-center text-gray-400 text-lg">
              Enter your Smarts username to check your points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button
                  onClick={handleCheckPoints}
                  disabled={isLoading || !username.trim()}
                  className="bg-[#06F29E] hover:bg-[#05d48a] text-black font-medium"
                >
                  {isLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Check Points
                </Button>
              </div>
            </div>

            {/* Points Display */}
            {userPoints && (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">All-Time Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-[#06F29E]">
                        {userPoints.allTime} pts
                      </div>
                      <Progress
                        value={(userPoints.allTime / userPoints.maxAllTime) * 100}
                        className="h-3 bg-gray-800"
                      />
                      <div className="text-sm text-gray-400">
                        {((userPoints.allTime / userPoints.maxAllTime) * 100).toFixed(1)}% of maximum
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Weekly Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-[#06F29E]">
                        {userPoints.weekly} pts
                      </div>
                      <Progress
                        value={(userPoints.weekly / userPoints.maxWeekly) * 100}
                        className="h-3 bg-gray-800"
                      />
                      <div className="text-sm text-gray-400">
                        {((userPoints.weekly / userPoints.maxWeekly) * 100).toFixed(1)}% of maximum
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Rewards Section */}
      <section>
        <h2 className="text-3xl font-bold text-white text-center mb-8">Redeemable Rewards</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* All-Time Rewards */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">All-Time Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTimeRewards.map((reward, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <Badge variant="outline" className="border-[#06F29E] text-[#06F29E] bg-[#06F29E]/10">
                      {reward.points} pts
                    </Badge>
                    <span className="text-gray-300">{reward.reward}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Rewards */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Weekly Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyRewards.map((reward, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <Badge variant="outline" className="border-[#06F29E] text-[#06F29E] bg-[#06F29E]/10">
                      {reward.points} pts
                    </Badge>
                    <span className="text-gray-300">{reward.reward}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Join Section */}
      <section>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">How to Join</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {joinSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="bg-[#06F29E] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 flex-1">{step}</p>
                </div>
              ))}
            </div>

            <Separator className="my-6 bg-gray-700" />

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
              <h4 className="text-white font-semibold mb-2">Point System:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>• 30-day contract = 1 pt</div>
                <div>• 100-day contract = 3 pts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Terms & Conditions */}
      <section>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {termsConditions.map((term, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/20 rounded-lg border border-gray-700/30">
                  <div className="bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 text-sm flex-1">{term}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                {/* Actual uploaded logo */}
                <img
                  src="/sandwich-society-logo.png?v=2"
                  alt="Sandwich Society Logo"
                  className="w-full h-full object-contain transition-all duration-500 opacity-0 absolute inset-0 z-10"
                  onLoad={(e) => {
                    // Show image when loaded successfully
                    const target = e.target as HTMLImageElement;
                    target.style.opacity = '1';
                    target.style.transform = 'scale(1)';
                    const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLDivElement;
                    if (fallback) {
                      fallback.style.opacity = '0';
                      setTimeout(() => fallback.style.display = 'none', 500);
                    }
                  }}
                  onError={(e) => {
                    // Hide broken image and ensure fallback shows
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLDivElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                      fallback.style.opacity = '1';
                    }
                  }}
                />

                {/* Perfect CSS replica of Sandwich Society logo */}
                <div className="fallback-logo absolute inset-0 flex items-center justify-center transition-opacity duration-500">
                  <div className="relative w-full h-full">
                    {/* Main circular design with multiple rings */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#06F29E] to-[#02b366] p-0.5 shadow-xl">
                      {/* Inner dark ring */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 p-0.5">
                        {/* Inner green ring */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#06F29E]/90 to-[#02b366]/90 p-0.5">
                          {/* Center circle */}
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center relative overflow-hidden">

                            {/* Background hexagon pattern effect */}
                            <div className="absolute inset-0 opacity-30" style={{
                              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 242, 158, 0.1) 1px, transparent 1px)`,
                              backgroundSize: '4px 4px'
                            }}></div>

                            {/* Stylized 3D "S" logo */}
                            <div className="relative w-5 h-5 flex items-center justify-center">
                              <div
                                className="text-[#06F29E] font-bold text-xs leading-none relative z-10"
                                style={{
                                  textShadow: `
                                    0 0 5px rgba(6, 242, 158, 0.8),
                                    0 0 10px rgba(6, 242, 158, 0.6),
                                    0 0 15px rgba(6, 242, 158, 0.4),
                                    2px 2px 0px rgba(0, 0, 0, 0.5)
                                  `,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                  fontWeight: '900',
                                  transform: 'perspective(10px) rotateX(5deg)',
                                  filter: 'brightness(1.3) contrast(1.2)'
                                }}
                              >
                                S
                              </div>

                              {/* 3D effect layers */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                  className="text-[#04a671] font-bold text-xs leading-none opacity-60"
                                  style={{
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontWeight: '900',
                                    transform: 'perspective(10px) rotateX(5deg) translate(1px, 1px)',
                                    filter: 'blur(0.5px)'
                                  }}
                                >
                                  S
                                </div>
                              </div>
                            </div>

                            {/* Inner glow effect */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#06F29E]/20 to-transparent blur-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Outer glow effects */}
                    <div className="absolute inset-0 rounded-full bg-[#06F29E]/20 blur-sm"></div>
                    <div className="absolute inset-0 rounded-full bg-[#06F29E]/10 blur-md animate-pulse"></div>

                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"
                           style={{ animationDuration: '3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold text-white">Sandwich Society</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveSection("about")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "about"
                    ? "bg-[#06F29E] text-black"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveSection("event")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "event"
                    ? "bg-[#06F29E] text-black"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Event
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setActiveSection("about");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                    activeSection === "about"
                      ? "bg-[#06F29E] text-black"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setActiveSection("event");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                    activeSection === "event"
                      ? "bg-[#06F29E] text-black"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Event
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {activeSection === "about" && renderAboutSection()}
        {activeSection === "event" && renderEventSection()}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2025 Sandwich Society - Part of SMARTS Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
