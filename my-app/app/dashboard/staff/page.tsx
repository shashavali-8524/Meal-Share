// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Coffee, UtensilsCrossed, Cookie, Soup } from "lucide-react"
// import axios from 'axios'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"


// type QR = {
//   id: string
//   floor: string
//   mealType: string
//   redeemed: boolean
// }

// export default function StaffDashboard() {
//   const [availableQRs, setAvailableQRs] = useState<QR[]>([
//     { id: "1", floor: "First Floor", mealType: "Breakfast", redeemed: false },
//     { id: "2", floor: "Ground Floor", mealType: "Lunch", redeemed: false },
//     { id: "3", floor: "First Floor", mealType: "Dinner", redeemed: false },
//   ])

//   const [redeemedQRs, setRedeemedQRs] = useState<QR[]>([])
//   const [selectedQR, setSelectedQR] = useState<QR | null>(null)
//   const [qrImage, setQrImage] = useState<string | null>(null)  // State to store the QR image

//   const handleRedeem = async (qr: QR) => {
//     setAvailableQRs(availableQRs.filter((q) => q.id !== qr.id))
//     setRedeemedQRs([...redeemedQRs, { ...qr, redeemed: true }])
  
//     try {
//       // build the URL with query params if needed, or pass them via headers
//       const response = await axios.post(`${API_URL}/staff/fetchQRsByTime`, null, {
//         headers: {
//           'x-floor': qr.floor,
//           'x-mealtime': qr.mealType.toLowerCase(),
//         },
//         responseType: 'blob',
//       })
  
//       const url = URL.createObjectURL(response.data)
//       setQrImage(url)
//     } catch (err) {
//       console.error('bro messed up fetching redeemed qr:', err)
//     }
//   }

//   const mealIcons = {
//     Breakfast: Coffee,
//     Lunch: UtensilsCrossed,
//     Snacks: Cookie,
//     Dinner: Soup,
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       <Card>
//         <CardHeader>
//           <CardTitle>Available QRs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {availableQRs.map((qr) => {
//               const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
//               return (
//                 <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <Icon className="w-6 h-6" />
//                     <div>
//                       <Badge variant="outline">{qr.floor}</Badge>
//                       <Badge variant="outline" className="ml-2">
//                         {qr.mealType}
//                       </Badge>
//                     </div>
//                   </div>
//                   <Button onClick={() => handleRedeem(qr)}>Redeem</Button>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Redeemed QRs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {redeemedQRs.map((qr) => {
//               const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
//               return (
//                 <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <Icon className="w-6 h-6" />
//                     <div>
//                       <Badge variant="outline">{qr.floor}</Badge>
//                       <Badge variant="outline" className="ml-2">
//                         {qr.mealType}
//                       </Badge>
//                     </div>
//                   </div>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button variant="outline" onClick={() => setSelectedQR(qr)}>
//                         View QR
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>QR Code</DialogTitle>
//                       </DialogHeader>
//                       <div className="flex flex-col items-center">
//                         {qrImage ? (
//                           <img src={qrImage} alt="QR Code" className="w-48 h-48" />
//                         ) : (
//                           <p>No QR Code available</p>
//                         )}
//                         <p className="mt-4">Floor: {selectedQR?.floor}</p>
//                         <p>Meal: {selectedQR?.mealType}</p>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Coffee, UtensilsCrossed, Cookie, Soup } from "lucide-react"
// import axios from 'axios'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// type QR = {
//   id: string
//   floor: string
//   mealType: string
//   redeemed: boolean
// }

// export default function StaffDashboard() {
//   const [availableQRs, setAvailableQRs] = useState<QR[]>([
//     { id: "1", floor: "First Floor", mealType: "Breakfast", redeemed: false },
//     { id: "2", floor: "Ground Floor", mealType: "Lunch", redeemed: false },
//     { id: "3", floor: "First Floor", mealType: "Dinner", redeemed: false },
//   ])
//   const [redeemedQRs, setRedeemedQRs] = useState<QR[]>([])
//   const [selectedQR, setSelectedQR] = useState<QR | null>(null)
//   const [qrImage, setQrImage] = useState<string | null>(null)

//   const handleRedeem = async (qr: QR) => {
//     setAvailableQRs(prev => prev.filter(q => q.id !== qr.id))
//     setRedeemedQRs(prev => [...prev, { ...qr, redeemed: true }])

//     try {
//       // Instead of fetching from the backend, just use a default image
//       setQrImage("/Permanent_QR.png")
//     } catch (err) {
//       console.error('Error while setting the default QR:', err)
//     }
//   }

//   const mealIcons = {
//     Breakfast: Coffee,
//     Lunch: UtensilsCrossed,
//     Snacks: Cookie,
//     Dinner: Soup,
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       <Card>
//         <CardHeader>
//           <CardTitle>Available QRs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {availableQRs.map((qr) => {
//               const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
//               return (
//                 <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <Icon className="w-6 h-6" />
//                     <div>
//                       <Badge variant="outline">{qr.floor}</Badge>
//                       <Badge variant="outline" className="ml-2">{qr.mealType}</Badge>
//                     </div>
//                   </div>
//                   <Button onClick={() => handleRedeem(qr)}>Redeem</Button>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Redeemed QRs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {redeemedQRs.map((qr) => {
//               const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
//               return (
//                 <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <Icon className="w-6 h-6" />
//                     <div>
//                       <Badge variant="outline">{qr.floor}</Badge>
//                       <Badge variant="outline" className="ml-2">{qr.mealType}</Badge>
//                     </div>
//                   </div>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button variant="outline" onClick={() => setSelectedQR(qr)}>View QR</Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>QR Code</DialogTitle>
//                       </DialogHeader>
//                       <div className="flex flex-col items-center">
//                         {qrImage ? (
//                           <img src={qrImage} alt="QR Code" className="w-48 h-48" />
//                         ) : (
//                           <p>No QR Code available</p>
//                         )}
//                         <p className="mt-4">Floor: {selectedQR?.floor}</p>
//                         <p>Meal: {selectedQR?.mealType}</p>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Coffee, UtensilsCrossed, Cookie, Soup } from "lucide-react"
import axios from 'axios'
import { useAuth } from "@/components/auth-provider"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

type QR = {
  id: string
  floor: string
  mealType: string
  redeemed: boolean
}

export default function StaffDashboard() {
  const { user } = useAuth()
  const [availableQRs, setAvailableQRs] = useState<QR[]>([])
  const [redeemedQRs, setRedeemedQRs] = useState<QR[]>([])
  const [selectedQR, setSelectedQR] = useState<QR | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailableQRs()
  }, [])

  const fetchAvailableQRs = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff/getAvailableQRs`)
      setAvailableQRs(response.data.qrs)
    } catch (err) {
      console.error('Error fetching QRs:', err)
    }
  }

  const handleRedeem = async (qr: QR) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/staff/fetchQRsByTime`, null, {
        headers: {
          'x-floor': qr.floor,
          'x-mealtime': qr.mealType.toLowerCase(),
        },
        responseType: 'blob',
      })

      const url = URL.createObjectURL(response.data)
      setQrImage(url)
      setSelectedQR(qr)
      
      // Update UI
      setAvailableQRs(prev => prev.filter(q => q.id !== qr.id))
      setRedeemedQRs(prev => [...prev, { ...qr, redeemed: true }])
    } catch (err) {
      console.error('Error redeeming QR:', err)
    }
  }

  const mealIcons = {
    Breakfast: Coffee,
    Lunch: UtensilsCrossed,
    Snacks: Cookie,
    Dinner: Soup,
  }

  if (!user || user.role !== 'staff') {
    return <div>Access Denied. Staff only area.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Available QRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableQRs.length === 0 ? (
              <p className="text-center text-muted-foreground">No QRs available</p>
            ) : (
              availableQRs.map((qr) => {
                const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
                return (
                  <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Icon className="w-6 h-6" />
                      <div>
                        <Badge variant="outline">{qr.floor}</Badge>
                        <Badge variant="outline" className="ml-2">{qr.mealType}</Badge>
                      </div>
                    </div>
                    <Button onClick={() => handleRedeem(qr)}>Redeem</Button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redeemed QRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {redeemedQRs.length === 0 ? (
              <p className="text-center text-muted-foreground">No redeemed QRs</p>
            ) : (
              redeemedQRs.map((qr) => {
                const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
                return (
                  <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Icon className="w-6 h-6" />
                      <div>
                        <Badge variant="outline">{qr.floor}</Badge>
                        <Badge variant="outline" className="ml-2">{qr.mealType}</Badge>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedQR(qr)}>
                          View QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center">
                          {qrImage ? (
                            <img src={qrImage} alt="QR Code" className="w-48 h-48" />
                          ) : (
                            <p>No QR Code available</p>
                          )}
                          <p className="mt-4">Floor: {selectedQR?.floor}</p>
                          <p>Meal: {selectedQR?.mealType}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}