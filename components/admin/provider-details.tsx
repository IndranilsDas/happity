"use client"

import React from "react"
import type { Provider } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ProviderDetailsProps {
  provider: Provider
}

export default function ProviderDetails({ provider }: ProviderDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provider Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{provider.name}</h3>
          <p className="text-sm text-muted-foreground">{provider.location}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Activities</h4>
            <p>{provider.activities}</p>
          </div>
          <div>
            <h4 className="font-medium">Rating</h4>
            <p>{provider.rating}</p>
          </div>
        </div>
        {provider.description && (
          <div>
            <h4 className="font-medium">Description</h4>
            <p>{provider.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}