"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Heart, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function HomePage() {
  const t = useI18n()
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 text-balance leading-tight">
            {t('hero.title')} <span className="text-primary">{t('hero.highlight')}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty px-2">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 py-3">
              <Link href="/create">{t('hero.start_cause')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 bg-transparent">
              <Link href="/causes">{t('hero.view_causes')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">{t('features.why_choose_title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4">
            {t('features.why_choose_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('features.transparent.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('features.transparent.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('features.community_verified.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('features.community_verified.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('features.fast_secure.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('features.fast_secure.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('features.local_impact.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('features.local_impact.description')}</CardDescription>
              </CardContent>
            </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">{t('how_it_works.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t('how_it_works.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                          <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('how_it_works.step1.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step1.description')}</p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('how_it_works.step2.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step2.description')}</p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('how_it_works.step3.title')}</h3>
                <p className="text-muted-foreground">{t('how_it_works.step3.description')}</p>
              </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
              <section className="container mx-auto px-4 py-12 md:py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">{t('cta.ready_title')}</h2>
            <p className="text-muted-foreground mb-6 md:mb-8 px-4">
              {t('cta.ready_description')}
            </p>
            <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 py-3">
              <Link href="/create">{t('cta.start_cause')}</Link>
            </Button>
          </div>
        </section>

      {/* Footer */}
              <footer className="border-t border-border bg-muted">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{t('header.title')}</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">{t('footer.powered_by')}</p>
            </div>
          </div>
        </footer>
    </div>
  )
}
