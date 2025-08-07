import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'All imp Links',
      count: '12',
      icon: '🎯',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50'
    },
    {
      title: 'Community Posts',
      count: '23',
      icon: '👥',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Gallery Photos',
      count: '45',
      icon: '📸',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Notifications',
      count: '8',
      icon: '📢',
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
  ];

  const quickActions = [
    {
      title: 'All imp Links',
      path: '/admin/hero',
      icon: '🎯',
      description: 'Manage links and important info',
      color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50'
    },
    {
      title: 'Scroller Content',
      path: '/admin/scroller',
      icon: '📜',
      description: 'Update scrolling texts and headlines',
      color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50'
    },
    {
      title: 'Gallery - Dignitaries',
      path: '/admin/photo',
      icon: '📸',
      description: 'Manage dignitaries and gallery images',
      color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    },
    {
      title: 'Sub-Dignitaries',
      path: '/admin/feature',
      icon: '⭐',
      description: 'Highlight featured personalities',
      color: 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50'
    },
    {
      title: 'Community Posts',
      path: '/admin/community',
      icon: '👥',
      description: 'Manage community engagement posts',
      color: 'border-green-200 hover:border-green-400 hover:bg-green-50'
    },
  ];

  const recentActivities = [
    {
      action: 'Updated All imp Links section',
      time: '2 hours ago',
      icon: '🎯',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      action: 'Added new Sub-Dignitary in feature section',
      time: '5 hours ago',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      action: 'Uploaded new images in Gallery',
      time: '1 day ago',
      icon: '📸',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      action: 'Published new community post',
      time: '2 days ago',
      icon: '👥',
      color: 'bg-green-100 text-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white rounded-full"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-4 border-white rotate-45"></div>
            <div className="absolute bottom-4 left-12 w-8 h-8 border-4 border-white rounded-full"></div>
            <div className="absolute bottom-8 right-16 w-10 h-10 border-4 border-white rotate-45"></div>
          </div>

          <div className="relative z-10 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">ATC Nagpur Dashboard</h1>
                <p className="text-xl opacity-90">Content Management Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-100">
              <span className="text-lg">🌟</span>
              <p className="text-lg">आदिवासी समुदायाचा विकास | Tribal Development Management</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.bgLight} ${stat.textColor}`}>
                    Active
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.count}</p>
                <div className={`mt-4 h-2 rounded-full ${stat.bgLight}`}>
                  <div className={`h-full rounded-full ${stat.color} w-3/4`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Go to Section</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`group block p-6 border-2 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg ${action.color}`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-xs font-semibold text-gray-500 group-hover:text-gray-700">
                    Manage <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <span className="text-white text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Updates</span>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Success</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🇮🇳</div>
              <h3 className="text-xl font-bold mb-2">Govt. Portal</h3>
              <p className="text-blue-100 text-sm">आदिवासी विकास विभाग</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><span>🏢</span> Department Status</h4>
                <p className="text-sm text-blue-100">All systems operational</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><span>👥</span> Community Reach</h4>
                <p className="text-sm text-blue-100">Serving across Maharashtra</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><span>🌱</span> Development Goals</h4>
                <p className="text-sm text-blue-100">Empowering tribal welfare</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-xl p-6 text-white text-center mt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-2xl">🌟</span>
            <h3 className="text-xl font-bold">जय महाराष्ट्र | Jai Maharashtra</h3>
            <span className="text-2xl">🌟</span>
          </div>
          <p className="text-green-100">
            समर्पित सेवा, पारदर्शकता आणि आदिवासी समुदायाचा विकास |
            Dedicated Service, Transparency, and Tribal Community Development
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
