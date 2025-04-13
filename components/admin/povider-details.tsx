"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Provider } from "@/lib/types"

interface ProviderDetailsProps {
  provider: Provider
}

export default function ProviderDetails({ provider }: ProviderDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="rounded-md overflow-hidden border">
            <img
              src={provider.image || "/placeholder.svg"}
              alt={provider.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Provider Information</h3>
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd className="text-base">{provider.name}</dd>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd className="text-base">{provider.description}</dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                      <dd className="text-base">{provider.location}</dd>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Activities</dt>
                      <dd className="text-base">{provider.activities}</dd>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Rating</dt>
                      <dd className="flex items-center">
                        <span className="text-base mr-2">{provider.rating}</span>
                        <Badge variant="outline" className="bg-yellow-50">
                          {Array.from({ length: Math.floor(provider.rating) }).map((_, i) => (
                            <span key={i} className="text-yellow-500">
                              ★
                            </span>
                          ))}
                          {provider.rating % 1 > 0 && <span className="text-yellow-500">½</span>}
                        </Badge>
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
