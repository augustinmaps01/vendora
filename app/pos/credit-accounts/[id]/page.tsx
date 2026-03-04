"use client"

import { useState, useEffect, useCallback, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Phone,
    Mail,
    User,
    Calendar,
    MapPin,
    History,
    AlertCircle,
    Banknote,
    Plus,
    CheckCircle2,
    Loader2,
} from "lucide-react"
import { creditService } from "@/services"
import type { ApiCredit } from "@/services"
import Swal from "sweetalert2"

// Types for UI display
interface CreditAccount {
    id: number
    customer: {
        id: number
        name: string
        phone?: string
        email?: string
        address?: string
        memberSince?: string
    }
    totalAmount: number
    paidAmount: number
    remainingBalance: number
    creditLimit?: number
    dueDate?: string
    status: 'active' | 'overdue' | 'paid' | 'defaulted'
    createdAt: string
    notes?: string
}

function mapApiCredit(c: ApiCredit): CreditAccount {
    const status: CreditAccount["status"] =
        c.status === "active" || c.status === "overdue" || c.status === "paid" || c.status === "defaulted"
            ? c.status
            : "active"

    return {
        id: c.id,
        customer: {
            id: c.customer?.id ?? c.customer_id,
            name: c.customer?.name ?? `Customer #${c.customer_id}`,
            phone: c.customer?.phone ?? undefined,
            email: c.customer?.email ?? undefined,
            address: c.customer?.address ?? undefined,
        },
        totalAmount: Number(c.amount) || 0,
        paidAmount: Number(c.paid_amount) || 0,
        remainingBalance: Number(c.balance) || 0,
        creditLimit: c.credit_limit ? Number(c.credit_limit) : undefined,
        dueDate: c.due_date ?? undefined,
        status,
        createdAt: c.created_at,
        notes: c.notes ?? undefined,
    }
}

export default function CreditAccountDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const accountId = resolvedParams.id

    const [account, setAccount] = useState<CreditAccount | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentNotes, setPaymentNotes] = useState("")
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'payments'>('overview')

    const fetchAccount = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await creditService.getById(accountId)
            setAccount(mapApiCredit(data))
        } catch (err: any) {
            console.error("Failed to load credit account:", err)
            setError(err?.response?.data?.message || err?.message || "Failed to load credit account.")
        } finally {
            setIsLoading(false)
        }
    }, [accountId])

    useEffect(() => {
        fetchAccount()
    }, [fetchAccount])

    const handleSubmitPayment = async () => {
        if (!account || !paymentAmount || !paymentMethod) return

        const amount = Math.round(parseFloat(paymentAmount))
        if (isNaN(amount) || amount <= 0) {
            Swal.fire({ icon: "error", title: "Invalid Amount", text: "Please enter a valid payment amount." })
            return
        }
        if (amount > account.remainingBalance) {
            Swal.fire({ icon: "error", title: "Amount Too High", text: `Payment cannot exceed remaining balance of ₱${account.remainingBalance.toLocaleString()}.` })
            return
        }

        setIsSubmittingPayment(true)
        try {
            const method = paymentMethod === "bank" ? "online" : paymentMethod as "cash" | "card" | "online"
            await creditService.recordPayment(account.id, { amount, method })

            Swal.fire({
                icon: "success",
                title: "Payment Recorded",
                text: `₱${amount.toLocaleString()} payment recorded for ${account.customer.name}.`,
                timer: 2000,
                showConfirmButton: false,
            })

            setIsAddPaymentOpen(false)
            fetchAccount() // Refresh data
        } catch (err: any) {
            console.error("Failed to record payment:", err)
            const message = err?.response?.data?.message || err?.message || "Failed to record payment."
            Swal.fire({ icon: "error", title: "Payment Failed", text: message })
        } finally {
            setIsSubmittingPayment(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] gap-3 text-gray-500 dark:text-[#b4b4d0]">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="text-sm font-medium">Loading credit account...</span>
            </div>
        )
    }

    if (error || !account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-[#9898b8] mb-3" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {error ? "Error Loading Account" : "Account Not Found"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-[#b4b4d0] mb-4">
                    {error || "This credit account doesn't exist."}
                </p>
                <Button asChild size="sm">
                    <Link href="/pos/credit-accounts">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back
                    </Link>
                </Button>
            </div>
        )
    }

    const getStatusBadge = (status: CreditAccount['status']) => {
        const variants = {
            active: { className: "bg-blue-50 text-blue-700", text: "Active" },
            paid: { className: "bg-emerald-50 text-emerald-700", text: "Paid" },
            overdue: { className: "bg-red-50 text-red-700", text: "Overdue" },
            defaulted: { className: "bg-gray-100 text-gray-700 dark:text-[#e0e0f0]", text: "Defaulted" },
        }
        const config = variants[status]
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.className}`}>
                {config.text}
            </span>
        )
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="space-y-4 pb-6">
            {/* Compact Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/pos/credit-accounts')}
                        className="h-8 w-8 rounded-full border border-gray-200 dark:border-[#2d1b69]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{account.customer.name}</h1>
                            {getStatusBadge(account.status)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[#b4b4d0]">{account.customer.phone}</p>
                    </div>
                </div>
                {account.remainingBalance > 0 && (
                    <Button
                        size="sm"
                        onClick={() => setIsAddPaymentOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 h-8"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Payment
                    </Button>
                )}
            </div>

            {/* Compact Summary */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 bg-white dark:bg-[#13132a] rounded-lg border border-gray-100 dark:border-[#2d1b69] text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-[#b4b4d0]">Total:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₱{account.totalAmount.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#2d1b69] hidden sm:block" />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-[#b4b4d0]">Paid:</span>
                    <span className="font-semibold text-emerald-600">₱{account.paidAmount.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#2d1b69] hidden sm:block" />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-[#b4b4d0]">Balance:</span>
                    <span className={`font-bold ${account.remainingBalance > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                        ₱{account.remainingBalance.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-[#2d1b69]">
                <nav className="flex gap-4">
                    {[
                        { id: 'overview', label: 'Overview', icon: User },
                        { id: 'payments', label: 'Payment History', icon: History },
                    ].map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-1.5 py-2 px-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 dark:text-[#b4b4d0] hover:text-gray-700 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-100 dark:border-[#2d1b69] p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-[#b4b4d0]">
                                    <User className="w-4 h-4 text-gray-400 dark:text-[#9898b8]" />
                                    <span>{account.customer.name}</span>
                                </div>
                                {account.customer.phone && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#b4b4d0]">
                                        <Phone className="w-4 h-4 text-gray-400 dark:text-[#9898b8]" />
                                        <span>{account.customer.phone}</span>
                                    </div>
                                )}
                                {account.customer.email && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#b4b4d0]">
                                        <Mail className="w-4 h-4 text-gray-400 dark:text-[#9898b8]" />
                                        <span>{account.customer.email}</span>
                                    </div>
                                )}
                                {account.customer.address && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#b4b4d0] sm:col-span-2">
                                        <MapPin className="w-4 h-4 text-gray-400 dark:text-[#9898b8] flex-shrink-0" />
                                        <span>{account.customer.address}</span>
                                    </div>
                                )}
                                {account.customer.memberSince && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#b4b4d0]">
                                        <Calendar className="w-4 h-4 text-gray-400 dark:text-[#9898b8]" />
                                        <span>Member since {formatDate(account.customer.memberSince)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-100 dark:border-[#2d1b69] p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Credit Details</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Total Credit</span>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">₱{account.totalAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Total Paid</span>
                                    <div className="text-lg font-bold text-emerald-600">₱{account.paidAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Remaining</span>
                                    <div className={`text-lg font-bold ${account.remainingBalance > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                        ₱{account.remainingBalance.toLocaleString()}
                                    </div>
                                </div>
                                {account.creditLimit && (
                                    <div>
                                        <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Credit Limit</span>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">₱{account.creditLimit.toLocaleString()}</div>
                                    </div>
                                )}
                                {account.dueDate && (
                                    <div>
                                        <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Due Date</span>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(account.dueDate)}</div>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Created</span>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(account.createdAt)}</div>
                                </div>
                            </div>
                            {account.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2d1b69]">
                                    <span className="text-gray-500 dark:text-[#b4b4d0] text-xs">Notes</span>
                                    <p className="text-sm text-gray-700 dark:text-[#e0e0f0] mt-1">{account.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="bg-white dark:bg-[#13132a] p-8 text-center rounded-lg border border-dashed border-gray-200 dark:border-[#2d1b69]">
                        <Banknote className="w-10 h-10 text-gray-300 dark:text-[#9898b8] mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-[#b4b4d0]">
                            Payment history is tracked in the credit balance above.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-[#9898b8] mt-1">
                            Paid: ₱{account.paidAmount.toLocaleString()} of ₱{account.totalAmount.toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            {/* Add Payment Dialog */}
            <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Balance: ₱{account.remainingBalance.toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="paymentAmount" className="text-sm">Amount (₱)</Label>
                            <Input
                                id="paymentAmount"
                                type="number"
                                placeholder="0.00"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm">Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="paymentNotes" className="text-sm">Notes (optional)</Label>
                            <Input
                                id="paymentNotes"
                                placeholder="Add notes..."
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)} size="sm">
                            Cancel
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={!paymentAmount || !paymentMethod || isSubmittingPayment}
                            onClick={handleSubmitPayment}
                            size="sm"
                        >
                            {isSubmittingPayment ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                            )}
                            {isSubmittingPayment ? "Processing..." : "Record Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
