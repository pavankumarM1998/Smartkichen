import React, { useState } from 'react';
import { DollarSign, TrendingUp, Gift, Users } from 'lucide-react';

export default function MonetizationPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const premiumPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      period: 'Free Forever',
      description: 'Perfect for home cooks',
      features: [
        '✅ 5 recipe generations per day',
        '✅ Basic pantry management',
        '✅ Simple meal planning',
        '❌ Voice guidance',
        '❌ Advanced AI features',
        '❌ Ad-free experience'
      ],
      color: 'from-gray-100 to-gray-50',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$4.99',
      period: 'per month',
      description: 'For cooking enthusiasts',
      features: [
        '✅ Unlimited recipe generations',
        '✅ Advanced pantry tracking',
        '✅ Weekly meal planning',
        '✅ AI voice guidance',
        '✅ Cuisine converter',
        '❌ Premium recipe collection',
        '❌ Affiliate commissions'
      ],
      color: 'from-purple-100 to-blue-50',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'For food creators',
      features: [
        '✅ Everything in Pro',
        '✅ Premium recipe collection',
        '✅ Nutritionist consultations',
        '✅ Priority support',
        '✅ Affiliate program access',
        '✅ Ad-free experience',
        '✅ Early feature access'
      ],
      color: 'from-yellow-100 to-orange-50',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      popular: true
    }
  ];

  const affiliateProgram = [
    {
      title: 'Grocery Partnerships',
      description: 'Earn commission from grocery delivery links',
      earnings: '$0.05-0.15 per click'
    },
    {
      title: 'Kitchen Equipment',
      description: 'Recommend cooking tools and gadgets',
      earnings: '5-10% commission'
    },
    {
      title: 'Recipe Books',
      description: 'Link to cookbooks and recipe guides',
      earnings: '10-15% commission'
    },
    {
      title: 'Meal Kit Services',
      description: 'Promote meal kit subscriptions',
      earnings: '$1-5 per signup'
    }
  ];

  const adsOptions = [
    {
      type: 'Banner Ads',
      placement: 'Top and bottom of pages',
      revenue: '$5-15 per 1000 impressions'
    },
    {
      type: 'Sponsored Recipes',
      placement: 'Premium recipe collection',
      revenue: '$500-2000 per placement'
    },
    {
      type: 'Native Ads',
      placement: 'In recipe recommendations',
      revenue: '$10-50 per 1000 impressions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Monetization & Plans</h1>
          </div>
          <p className="text-lg text-gray-600">Flexible pricing options and earning opportunities</p>
        </div>

        {/* Pricing Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {premiumPlans.map(plan => (
              <div
                key={plan.id}
                className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                  plan.highlighted ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                <div className={`bg-gradient-to-r ${plan.color} p-6 relative`}>
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-700 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-sm">/{plan.period}</span>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition ${plan.buttonColor}`}
                  >
                    {plan.price === '$0' ? 'Start Free' : 'Subscribe Now'}
                  </button>
                </div>

                <div className="bg-white p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-lg mt-0.5">{feature.startsWith('✅') ? '✅' : '❌'}</span>
                        {feature.replace(/[✅❌]/g, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate Program */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Affiliate Program
            </h2>
            <p className="text-gray-600 mb-8">Earn money by promoting products and services to our users</p>

            <div className="grid md:grid-cols-2 gap-6">
              {affiliateProgram.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <p className="text-green-600 font-semibold text-sm">💰 {item.earnings}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">Join Now</p>
                <p className="text-sm text-green-800">Apply to become an affiliate partner and start earning.</p>
                <button className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                  Apply Now
                </button>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-2">Track Earnings</p>
                <p className="text-sm text-blue-800">Real-time dashboard to monitor clicks, conversions, and earnings.</p>
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Advertising Opportunities */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Gift className="w-8 h-8 text-purple-600" />
              Advertising Opportunities
            </h2>
            <p className="text-gray-600 mb-8">Multiple ways to reach our engaged audience of food enthusiasts</p>

            <div className="grid md:grid-cols-3 gap-6">
              {adsOptions.map((option, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{option.type}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Placement:</span> {option.placement}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Revenue:</span> {option.revenue}
                    </p>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition text-sm">
                    Learn More
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
              <p className="font-semibold text-purple-900 mb-2">For Advertisers & Partners</p>
              <p className="text-sm text-purple-800 mb-4">Contact our sales team to discuss custom advertising packages and partnerships.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded transition">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Revenue Sharing */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Community Revenue Sharing
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recipe Creator Program</h3>
                <p className="text-gray-600 mb-4">Premium users who share their recipes can earn a share of revenue from ads served on their content.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Earn from recipe views</li>
                  <li>✓ Share in ad revenue (40% split)</li>
                  <li>✓ Monthly payouts</li>
                  <li>✓ Track your earnings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Referral Program</h3>
                <p className="text-gray-600 mb-4">Invite friends and earn rewards or commission on their subscriptions.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ $5 credit per referral</li>
                  <li>✓ 20% commission on subscriptions</li>
                  <li>✓ Unlimited earning potential</li>
                  <li>✓ Real-time tracking</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition">
                Join Creator Program
              </button>
              <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition">
                View Referral Rewards
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel anytime without penalties. Your access continues until the end of your billing period.'
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Yes! Annual plans are 20% cheaper than monthly billing. Contact support for more details.'
              },
              {
                q: 'How are affiliate commissions paid?',
                a: 'Commissions are calculated monthly and paid via PayPal, bank transfer, or store credit.'
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Absolutely! You can change your plan anytime. Upgrades take effect immediately, downgrades at the next billing cycle.'
              },
              {
                q: 'Is there a free trial for Pro or Premium?',
                a: 'Yes, all premium plans include a 7-day free trial. No credit card required to start.'
              }
            ].map((item, idx) => (
              <details key={idx} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {item.q}
                </summary>
                <p className="mt-3 text-gray-600 text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
