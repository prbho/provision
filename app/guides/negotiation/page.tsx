// app/guides/negotiation/page.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Handshake,
  HeartHandshake,
  Percent,
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NegotiationStrategies() {
  const [propertyPrice, setPropertyPrice] = useState(50000000)
  const [negotiationTactic, setNegotiationTactic] = useState<
    'leverage' | 'timing' | 'concessions' | 'relationship'
  >('leverage')

  const tactics = [
    {
      id: 'leverage',
      title: 'Leverage Points',
      icon: TrendingUp,
      description: 'Use market data and property issues as leverage',
      strategies: [
        'Highlight repair needs and estimated costs',
        'Compare with recent neighborhood sales',
        'Use inspection report findings',
        "Mention property's time on market",
      ],
    },
    {
      id: 'timing',
      title: 'Timing Strategies',
      icon: Clock,
      description: 'Use timing to your advantage',
      strategies: [
        'Negotiate at month-end for motivated sellers',
        'Consider seasonal market trends',
        "Use seller's moving timeline",
        'Weekend vs weekday offers',
      ],
    },
    {
      id: 'concessions',
      title: 'Creative Concessions',
      icon: DollarSign,
      description: 'Non-price negotiation tactics',
      strategies: [
        'Request furniture or appliances included',
        'Ask for closing cost assistance',
        'Flexible closing dates',
        'Repair credits instead of price reduction',
      ],
    },
    {
      id: 'relationship',
      title: 'Relationship Building',
      icon: Users,
      description: 'Build rapport with sellers',
      strategies: [
        'Personal letter to seller',
        'Meet in person if possible',
        'Show genuine interest in property',
        "Respect seller's emotional attachment",
      ],
    },
  ]

  const phrases = [
    { phrase: 'Based on the inspection report...', use: 'When citing issues' },
    {
      phrase: 'Considering current market trends...',
      use: 'When justifying offer',
    },
    { phrase: 'Could we explore...', use: 'Soft opening for negotiation' },
    {
      phrase: "What's most important to you?",
      use: 'Understanding seller priorities',
    },
    { phrase: 'Would you consider...', use: 'Making alternative proposals' },
    { phrase: 'To make this work for both of us...', use: 'Win-win framing' },
  ]

  const commonMistakes = [
    {
      mistake: 'Starting too low',
      impact: 'Offends seller, kills negotiation',
    },
    {
      mistake: 'Emotional attachment showing',
      impact: 'Loses negotiating power',
    },
    { mistake: 'Not doing proper research', impact: 'Missing leverage points' },
    { mistake: 'Talking too much', impact: 'Reveals your position' },
    { mistake: 'Deadline pressure', impact: 'Makes poor decisions' },
    {
      mistake: "Ignoring seller's needs",
      impact: 'Misses win-win opportunities',
    },
  ]

  const calculateSavings = (tactic: string) => {
    switch (tactic) {
      case 'aggressive':
        return propertyPrice * 0.15
      case 'moderate':
        return propertyPrice * 0.1
      case 'conservative':
        return propertyPrice * 0.05
      default:
        return propertyPrice * 0.08
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50/30 to-white">
      {/* Hero */}
      <section className="relative py-16 bg-linear-to-r from-brand/10 via-brand/5 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-brand/10 text-brand border-brand/20">
              Master the Art of Deal-Making
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Property Negotiation Strategies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn proven tactics to negotiate better prices and terms on
              Nigerian real estate.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '8-15%', label: 'Average Savings', icon: Percent },
              {
                value: '3-5 Rounds',
                label: 'Typical Negotiations',
                icon: Handshake,
              },
              {
                value: '72 Hours',
                label: 'Average Response Time',
                icon: Clock,
              },
              { value: '92%', label: 'Success Rate', icon: TrendingUp },
            ].map((stat, index) => (
              <Card key={index} className="text-center border-brand/20">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 mb-4">
                    <stat.icon className="h-6 w-6 text-brand" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Strategies */}
          <div className="lg:col-span-2">
            {/* Tactic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {tactics.map((tactic) => (
                <button
                  key={tactic.id}
                  onClick={() =>
                    setNegotiationTactic(
                      tactic.id as
                        | 'leverage'
                        | 'timing'
                        | 'concessions'
                        | 'relationship'
                    )
                  }
                  className={`p-6 rounded-xl border text-left transition-all ${
                    negotiationTactic === tactic.id
                      ? 'border-brand bg-brand/5'
                      : 'border-gray-200 hover:border-brand/30'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-brand/10">
                      <tactic.icon className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {tactic.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tactic.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tactic.strategies.map((strategy, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Selected Tactic Details */}
            <Card className="border-brand/20 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-brand" />
                  {tactics.find((t) => t.id === negotiationTactic)?.title} -
                  Detailed Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-brand/5 border border-brand/20">
                    <h4 className="font-bold text-gray-900 mb-2">
                      When to Use This Strategy
                    </h4>
                    <p className="text-gray-700">
                      {negotiationTactic === 'leverage' &&
                        'Best used when you have strong market data or the property has verifiable issues.'}
                      {negotiationTactic === 'timing' &&
                        'Effective when sellers have time constraints or during slow market periods.'}
                      {negotiationTactic === 'concessions' &&
                        'Ideal when price is firm but seller may be flexible on other terms.'}
                      {negotiationTactic === 'relationship' &&
                        'Crucial for emotional sellers or unique properties with sentimental value.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">
                      Example Negotiation Script
                    </h4>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-gray-700 italic">
                        &quot;I really appreciate you taking the time to discuss
                        the property. Based on the recent comparable sales in
                        the area and considering the repairs needed that we
                        identified during inspection, would you be open to
                        discussing an offer of [amount]? This reflects both the
                        market value and accounts for the upcoming
                        maintenance.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tools & Phrases */}
          <div className="space-y-8">
            {/* Negotiation Calculator */}
            <Card className="border-brand/20">
              <CardHeader>
                <CardTitle>Negotiation Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Property Asking Price
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-brand">
                        ₦{(propertyPrice / 1000000).toFixed(0)}M
                      </div>
                      <input
                        type="range"
                        min="1000000"
                        max="500000000"
                        step="1000000"
                        value={propertyPrice}
                        onChange={(e) =>
                          setPropertyPrice(Number(e.target.value))
                        }
                        className="flex-1 [&::-webkit-slider-thumb]:bg-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: 'Aggressive',
                        savings: '10-15%',
                        tactic: 'aggressive',
                      },
                      {
                        label: 'Moderate',
                        savings: '5-10%',
                        tactic: 'moderate',
                      },
                      {
                        label: 'Conservative',
                        savings: '2-5%',
                        tactic: 'conservative',
                      },
                    ].map((strategy) => (
                      <div
                        key={strategy.tactic}
                        className="text-center p-4 rounded-lg border border-brand/20"
                      >
                        <div className="font-bold text-gray-900">
                          {strategy.label}
                        </div>
                        <div className="text-sm text-brand font-medium mt-1">
                          {strategy.savings}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          ₦
                          {(
                            calculateSavings(strategy.tactic) / 1000000
                          ).toFixed(1)}
                          M
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Power Phrases */}
            <Card className="border-brand/20">
              <CardHeader>
                <CardTitle>Power Phrases</CardTitle>
                <CardDescription>
                  What to say during negotiation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phrases.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-brand/20 hover:border-brand transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {item.phrase}
                      </div>
                      <div className="text-sm text-gray-600">
                        Use: {item.use}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card className="border-brand/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonMistakes.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-amber-50 border border-amber-200"
                    >
                      <h4 className="font-medium text-amber-900 mb-1">
                        {item.mistake}
                      </h4>
                      <p className="text-sm text-amber-800">{item.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="p-6 rounded-xl bg-linear-to-r from-brand/10 to-brand/5 border border-brand/20">
              <div className="text-center">
                <HeartHandshake className="h-12 w-12 text-brand mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Need Negotiation Support?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our experts can negotiate on your behalf
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-brand hover:bg-brand/90 text-white">
                    Hire Negotiation Expert
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-brand text-brand hover:bg-brand/5"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Negotiation Workshop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
