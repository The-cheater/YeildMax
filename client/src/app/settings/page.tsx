'use client'

import { useState } from 'react'
import { Header } from "@/components/layout/Header"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from '@/contexts/AuthContext'
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    yield: true,
    security: true
  })
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  })

  const handleSaveProfile = () => {
    // Save profile changes
    console.log('Saving profile:', profile)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Account <span className="primary-gradient">Settings</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your account preferences and security settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="yield-card border-green-500/20">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    {[
                      { icon: User, label: "Profile", active: true },
                      { icon: Bell, label: "Notifications", active: false },
                      { icon: Shield, label: "Security", active: false },
                      { icon: Palette, label: "Appearance", active: false },
                      { icon: Globe, label: "Language", active: false },
                    ].map((item, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          item.active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-400" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-green-400" />
                      </div>
                      <Button variant="outline" className="border-green-500/50 text-green-400">
                        Change Avatar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-white/5 border-green-500/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-white/5 border-green-500/20 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-green-500 hover:bg-green-600 text-black font-bold"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-green-400" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                      { key: 'yield', label: 'Yield Alerts', description: 'Get notified about yield changes' },
                      { key: 'security', label: 'Security Alerts', description: 'Important security notifications' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/3 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{item.label}</h4>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="yield-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/3 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-white font-medium">API Key</h4>
                          <p className="text-gray-400 text-sm">For programmatic access</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="border-green-500/50 text-green-400"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value="ym_1234567890abcdef"
                          readOnly
                          className="bg-white/5 border-green-500/20 text-white font-mono"
                        />
                        <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="border-green-500/50 text-green-400">
                        Change Password
                      </Button>
                      <Button variant="outline" className="border-green-500/50 text-green-400">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
