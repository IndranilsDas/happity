"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import PopularCategories from "@/components/popular-categories"
import WagamamaPromo from "@/components/wagamama-promo"
import CommunitySection from "@/components/community-section"
import ActivityProvider from "@/components/activity-provider"
import LocationsList from "@/components/locations-list"
import JoinConversation from "@/components/join-conversation"
import PndSupport from "@/components/pnd-support"
import HappityAwards from "@/components/happity-awards"
import Newsletter from "@/components/newsletter"
import FeaturedActivities from "@/components/featured-activities"
import { searchActivities } from "@/lib/data"
import SearchResults from "@/components/search-results"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (location: string, age: string, day: string) => {
    setIsSearching(true)
    // In a real app, we would combine these filters
    // For demo, we'll just search by location
    if (location) {
      const results = searchActivities(location)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleDirectSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    const results = searchActivities(query)
    setSearchResults(results)
  }

  return (
    <main>
      <Hero onSearch={handleSearch} onDirectSearch={handleDirectSearch} />

      {isSearching ? (
        <SearchResults results={searchResults} query={searchQuery} onClearSearch={() => setIsSearching(false)} />
      ) : (
        <>
          <FeaturedActivities />
          <PopularCategories />
          <WagamamaPromo />
          <CommunitySection />
          <ActivityProvider />
          <LocationsList />
          <JoinConversation />
          <PndSupport />
          <HappityAwards />
          <Newsletter />
        </>
      )}
    </main>
  )
}

