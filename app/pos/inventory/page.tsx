"use client"

import { useEffect, useRef, useState } from "react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  PackageOpen,
  Package,
  Barcode,
  Camera,
  Image as ImageIcon,
  X,
  FileText,
  DollarSign,
  Boxes,
  Tags,
  Plus,
  TrendingDown,
  AlertTriangle
} from "lucide-react"

// Default layout component
function DesktopInventoryLayout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isActiveProduct, setIsActiveProduct] = useState(true)
  const [isEcommerceProduct, setIsEcommerceProduct] = useState(true)
  const [isBulkPricing, setIsBulkPricing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageName, setImageName] = useState("")
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraNotice, setCameraNotice] = useState("")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  const unitOptions = ["Pc", "Pack", "Box", "Kg", "L"]
  const categoryOptions = ["Beverages", "Grocery", "Hardware", "General"]

  const inventoryItems = [
    { id: 1, name: "Premium Rice 5kg", sku: "GR-1001", current: 18, min: 10, max: 50, status: "ok" },
    { id: 2, name: "Cooking Oil 1L", sku: "GR-1002", current: 45, min: 20, max: 100, status: "ok" },
    { id: 3, name: "White Sugar 1kg", sku: "GR-1004", current: 5, min: 15, max: 60, status: "low" },
    { id: 4, name: "Mineral Water 1L", sku: "BV-2001", current: 80, min: 50, max: 150, status: "ok" },
    { id: 5, name: "Cola 1.5L", sku: "BV-2002", current: 2, min: 20, max: 80, status: "critical" },
  ]

  useEffect(() => {
    let mounted = true
    const detectCamera = async () => {
      if (!navigator?.mediaDevices?.enumerateDevices) {
        if (mounted) setHasCamera(false)
        return
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const found = devices.some((device) => device.kind === "videoinput")
        if (mounted) setHasCamera(found)
      } catch {
        if (mounted) setHasCamera(false)
      }
    }
    detectCamera()

    return () => {
      mounted = false
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  useEffect(() => {
    if (!imagePreview) return
    let active = true
    const img = new Image()
    img.onload = () => {
      if (active) setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = imagePreview
    return () => {
      active = false
    }
  }, [imagePreview])

  useEffect(() => {
    let active = true
    let stream: MediaStream | null = null
    const videoEl = videoRef.current

    const startCamera = async () => {
      if (!isCameraOpen) return
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraNotice("Camera access is not supported. Please upload from Gallery.")
        setIsCameraOpen(false)
        return
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        if (videoEl) {
          videoEl.srcObject = stream
          await videoEl.play()
        }
      } catch {
        setCameraNotice("Unable to access camera. Please upload from Gallery.")
        setIsCameraOpen(false)
      }
    }

    startCamera()

    return () => {
      active = false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (videoEl) {
        videoEl.srcObject = null
      }
    }
  }, [isCameraOpen])

  const handleImageSelect = (file?: File | null) => {
    if (!file) return
    setCameraNotice("")
    const nextUrl = URL.createObjectURL(file)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(nextUrl)
    setImageName(file.name)
  }

  const handleCapture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = canvasRef.current ?? document.createElement("canvas")
    canvasRef.current = canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" })
      handleImageSelect(file)
      setIsCameraOpen(false)
    }, "image/jpeg", 0.9)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">Track stock levels and manage inventory</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          onClick={() => setIsAddProductOpen(true)}
        >
          <PackageOpen className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">156</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <PackageOpen className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">8</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">3</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min/Max
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{item.current} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.min} / {item.max}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === "ok" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
                    )}
                    {item.status === "low" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
                    )}
                    {item.status === "critical" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {inventoryItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
              </div>
              <div>
                {item.status === "ok" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">In Stock</Badge>
                )}
                {item.status === "low" && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Low Stock</Badge>
                )}
                {item.status === "critical" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Critical</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Current Stock</p>
                <p className="text-lg font-bold text-gray-900">{item.current}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Min / Max</p>
                <p className="text-sm font-semibold text-gray-900">{item.min} / {item.max}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>
            </div>

            {item.status === "low" || item.status === "critical" ? (
              <div className={`mt-3 p-2 rounded-lg flex items-center gap-2 ${
                item.status === "critical" ? "bg-red-50" : "bg-yellow-50"
              }`}>
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${
                  item.status === "critical" ? "text-red-600" : "text-yellow-600"
                }`} />
                <p className={`text-xs ${
                  item.status === "critical" ? "text-red-700" : "text-yellow-700"
                }`}>
                  {item.status === "critical"
                    ? `Only ${item.current} units left! Restock urgently.`
                    : `Stock running low. Consider restocking soon.`
                  }
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Dialog
        open={isAddProductOpen}
        onOpenChange={(open) => {
          setIsAddProductOpen(open)
          if (!open) {
            setIsCameraOpen(false)
            setCameraNotice("")
          }
        }}
      >
        <DialogContent size="4xl" showCloseButton={false} className="max-h-[90vh] overflow-hidden rounded-3xl border-white/10 bg-[#241a3a] text-white p-0">
          <div className="flex max-h-[90vh] flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-lg font-semibold">Add New Product</DialogTitle>
                  <p className="text-xs text-white/60 mt-1">Fill in the essentials to add this product to inventory.</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                <section className="space-y-4 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Basic information</h3>
                    <span className="text-[11px] text-white/50">Required fields marked *</span>
                  </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Product Name *</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <Package className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter product name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">SKU *</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <Tags className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="e.g., GR-1001"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <p className="text-xs text-white/70">Barcode (optional)</p>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                            <Barcode className="h-4 w-4 text-white/50" />
                            <Input
                              className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Scan or enter barcode"
                            />
                          </div>
                          <Button className="h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 p-0">
                            <Barcode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                </section>

                <section className="space-y-4 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                  <h3 className="text-sm font-semibold">Media</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className={`rounded-2xl border-2 border-dashed p-4 text-center transition ${
                          hasCamera
                            ? "border-purple-400/60 bg-purple-500/10 hover:border-purple-300 hover:bg-purple-500/15"
                            : "border-white/10 bg-white/5"
                        }`}
                        type="button"
                        onClick={() => {
                          if (hasCamera) {
                            setCameraNotice("")
                            setIsCameraOpen(true)
                          } else {
                            setCameraNotice("No camera detected. Please upload from Gallery.")
                          }
                        }}
                      >
                        <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${hasCamera ? "bg-purple-600/20" : "bg-white/10"}`}>
                          <Camera className={`h-5 w-5 ${hasCamera ? "text-purple-200" : "text-white/40"}`} />
                        </div>
                        <p className={`mt-2 text-sm font-medium ${hasCamera ? "text-purple-200" : "text-white/60"}`}>Camera</p>
                        <p className="text-xs text-white/50">Take a photo</p>
                      </button>
                      <button
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition hover:bg-white/10"
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <ImageIcon className="h-5 w-5 text-white/60" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-white/80">Gallery</p>
                        <p className="text-xs text-white/50">Upload image</p>
                      </button>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                  />
                  {isCameraOpen ? (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1b132d]/95 p-4 sm:static sm:z-auto sm:bg-transparent sm:p-0">
                      <div className="w-full max-w-md sm:max-w-none rounded-2xl border border-white/10 bg-[#201836] p-4 space-y-3 sm:w-full sm:rounded-2xl sm:bg-black/40">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-white">Camera preview</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => setIsCameraOpen(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <Button
                            variant="outline"
                            className="border-white/20 bg-white/5 text-white hover:bg-white/15 sm:hidden"
                            onClick={() => setIsCameraOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCapture}>
                            Capture Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {cameraNotice ? (
                    <p className="text-xs text-yellow-200 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                      {cameraNotice}
                    </p>
                  ) : null}
                  {imagePreview ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-3">
                    <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-black/40">
                      <NextImage
                        src={imagePreview}
                        alt="Selected product"
                        fill
                        sizes="100vw"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm text-white">Selected image</p>
                          <p className="text-xs text-white/60 truncate">{imageName}</p>
                          {imageSize ? (
                            <p className="text-xs text-white/50">
                              {imageSize.width} × {imageSize.height}
                            </p>
                          ) : null}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/15"
                          onClick={() => {
                            if (imagePreview) {
                              URL.revokeObjectURL(imagePreview)
                            }
                            setImagePreview(null)
                            setImageName("")
                            setImageSize(null)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="space-y-3 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                    <h3 className="text-sm font-semibold">Description</h3>
                    <div className="flex items-start gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2">
                      <FileText className="mt-1 h-4 w-4 text-white/50" />
                      <Textarea
                        className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Add product details"
                        rows={4}
                      />
                    </div>
                </section>

                <section className="space-y-4 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                    <h3 className="text-sm font-semibold">Pricing</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Price (PHP) *</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <DollarSign className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="0.00"
                            inputMode="decimal"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Stock *</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <Boxes className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="0"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Cost (optional)</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <DollarSign className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="0.00"
                            inputMode="decimal"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Currency</p>
                        <Select defaultValue="PHP">
                          <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PHP">PHP</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                </section>

                <section className="space-y-4 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                    <h3 className="text-sm font-semibold">Inventory thresholds</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Min Stock (optional)</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <Boxes className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="0"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Max Stock (optional)</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3">
                          <Boxes className="h-4 w-4 text-white/50" />
                          <Input
                            className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="0"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                    </div>
                </section>

                <section className="space-y-4 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                    <h3 className="text-sm font-semibold">Classification</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Unit</p>
                        <Select defaultValue="Pc">
                          <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-white/70">Category</p>
                        <Select defaultValue="Beverages">
                          <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                </section>

                <section className="space-y-3 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.04] sm:p-4">
                    <h3 className="text-sm font-semibold">Visibility</h3>
                    <div className="flex items-center justify-between rounded-2xl border border-purple-500/40 bg-purple-500/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Active Product</p>
                        <p className="text-xs text-white/60">Controls product availability</p>
                      </div>
                      <Switch checked={isActiveProduct} onCheckedChange={setIsActiveProduct} />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-purple-500/40 bg-purple-500/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Add to E-Commerce?</p>
                        <p className="text-xs text-white/60">Show this product on the store page</p>
                      </div>
                      <Switch checked={isEcommerceProduct} onCheckedChange={setIsEcommerceProduct} />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">Bulk Pricing</p>
                        <p className="text-xs text-white/60">Set different prices for quantities</p>
                      </div>
                      <Switch checked={isBulkPricing} onCheckedChange={setIsBulkPricing} />
                    </div>
                </section>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-white/10 bg-[#241a3a] px-6 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex border-white/20 bg-white/5 text-white hover:bg-white/15"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function InventoryPage() {
  return <DesktopInventoryLayout />
}
