"use client"

import { useState, use } from "react"
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
    CreditCard,
    History,
    ShoppingBag,
    Receipt,
    AlertCircle,
    Banknote,
    DollarSign,
    FileText,
    Plus,
    CheckCircle2,
    Clock,
    Package,
} from "lucide-react"

// Types
interface Payment {
    id: number
    amount: number
    paymentDate: string
    method: 'cash' | 'card' | 'bank'
    notes?: string
    receivedBy?: string
    referenceNo?: string
}

interface PurchasedItem {
    id: number
    name: string
    quantity: number
    unitPrice: number
    total: number
    date: string
    status: 'pending' | 'partial' | 'paid'
    invoiceNo?: string
    paidAmount?: number
}

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
    payments: Payment[]
    items: PurchasedItem[]
    status: 'active' | 'overdue' | 'paid' | 'defaulted'
    createdAt: string
    lastPaymentDate?: string
}

// Mock data
const mockAccounts: Record<string, CreditAccount> = {
    "1": {
        id: 1,
        customer: {
            id: 1,
            name: "Juan Dela Cruz",
            phone: "+63 912 345 6789",
            email: "juan@email.com",
            address: "123 Main St, Barangay San Antonio, Quezon City",
            memberSince: "2025-06-15"
        },
        totalAmount: 15000,
        paidAmount: 5000,
        remainingBalance: 10000,
        creditLimit: 20000,
        dueDate: "2026-02-15",
        payments: [
            { id: 1, amount: 3000, paymentDate: "2026-01-05", method: 'cash', notes: "Initial payment", receivedBy: "Maria Santos", referenceNo: "PAY-2026-0001" },
            { id: 2, amount: 2000, paymentDate: "2026-01-20", method: 'bank', notes: "Partial payment via BDO", receivedBy: "Pedro Reyes", referenceNo: "PAY-2026-0015" },
        ],
        items: [
            { id: 1, name: "Premium Rice 25kg", quantity: 2, unitPrice: 1500, total: 3000, date: "2026-01-01", status: 'paid', invoiceNo: "INV-0001", paidAmount: 3000 },
            { id: 2, name: "Cooking Oil 5L", quantity: 3, unitPrice: 450, total: 1350, date: "2026-01-01", status: 'paid', invoiceNo: "INV-0001", paidAmount: 1350 },
            { id: 3, name: "Sugar 1kg (x10)", quantity: 10, unitPrice: 75, total: 750, date: "2026-01-05", status: 'partial', invoiceNo: "INV-0008", paidAmount: 650 },
            { id: 4, name: "Canned Goods Bundle", quantity: 1, unitPrice: 2400, total: 2400, date: "2026-01-10", status: 'pending', invoiceNo: "INV-0012", paidAmount: 0 },
            { id: 5, name: "Household Items", quantity: 1, unitPrice: 7500, total: 7500, date: "2026-01-15", status: 'pending', invoiceNo: "INV-0018", paidAmount: 0 },
        ],
        status: 'active',
        createdAt: "2026-01-01",
        lastPaymentDate: "2026-01-20"
    },
    "2": {
        id: 2,
        customer: {
            id: 2,
            name: "Maria Santos",
            phone: "+63 923 456 7890",
            address: "456 Oak Avenue, Makati City",
            memberSince: "2025-08-20"
        },
        totalAmount: 8500,
        paidAmount: 8500,
        remainingBalance: 0,
        dueDate: "2026-01-25",
        payments: [
            { id: 3, amount: 8500, paymentDate: "2026-01-25", method: 'cash', receivedBy: "Staff A", referenceNo: "PAY-2026-0022" },
        ],
        items: [
            { id: 6, name: "Grocery Bundle", quantity: 1, unitPrice: 5000, total: 5000, date: "2026-01-15", status: 'paid', invoiceNo: "INV-0015", paidAmount: 5000 },
            { id: 7, name: "Personal Care Items", quantity: 1, unitPrice: 3500, total: 3500, date: "2026-01-15", status: 'paid', invoiceNo: "INV-0015", paidAmount: 3500 },
        ],
        status: 'paid',
        createdAt: "2026-01-15",
        lastPaymentDate: "2026-01-25"
    },
    "3": {
        id: 3,
        customer: {
            id: 3,
            name: "Pedro Reyes",
            phone: "+63 934 567 8901",
            address: "789 Pine Road, Pasig City",
            memberSince: "2025-03-10"
        },
        totalAmount: 12000,
        paidAmount: 3000,
        remainingBalance: 9000,
        creditLimit: 15000,
        dueDate: "2026-01-20",
        payments: [
            { id: 4, amount: 3000, paymentDate: "2026-01-10", method: 'card', receivedBy: "Staff C", referenceNo: "PAY-2026-0010" },
        ],
        items: [
            { id: 8, name: "Electronics Bundle", quantity: 1, unitPrice: 8000, total: 8000, date: "2026-01-05", status: 'partial', invoiceNo: "INV-0005", paidAmount: 3000 },
            { id: 9, name: "Accessories", quantity: 1, unitPrice: 4000, total: 4000, date: "2026-01-05", status: 'pending', invoiceNo: "INV-0005", paidAmount: 0 },
        ],
        status: 'overdue',
        createdAt: "2026-01-05",
        lastPaymentDate: "2026-01-10"
    },
}

export default function CreditAccountDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const accountId = resolvedParams.id
    const account = mockAccounts[accountId]

    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentNotes, setPaymentNotes] = useState("")
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payments'>('transactions')

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-[#9898b8] mb-3" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Account Not Found</h2>
                <p className="text-sm text-gray-500 dark:text-[#b4b4d0] mb-4">This credit account doesn't exist.</p>
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

    const getItemStatusBadge = (status: PurchasedItem['status'], paidAmount?: number, total?: number) => {
        if (status === 'paid') {
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="w-3 h-3" />Paid</span>
        }
        if (status === 'partial') {
            return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">₱{paidAmount?.toLocaleString()}/{total?.toLocaleString()}</span>
        }
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" />Pending</span>
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

            {/* Compact Summary - Single Row */}
            <div className="flex items-center gap-4 p-3 bg-white dark:bg-[#13132a] rounded-lg border border-gray-100 dark:border-[#2d1b69] text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-[#b4b4d0]">Total:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₱{account.totalAmount.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#2d1b69]" />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-[#b4b4d0]">Paid:</span>
                    <span className="font-semibold text-emerald-600">₱{account.paidAmount.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
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
                        { id: 'transactions', label: 'Transactions', icon: ShoppingBag },
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
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-100 dark:border-[#2d1b69] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#1a1a35] border-b border-gray-100 dark:border-[#2d1b69]">
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-[#b4b4d0]">Item</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-[#b4b4d0]">Qty</th>
                                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 dark:text-[#b4b4d0]">Price</th>
                                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 dark:text-[#b4b4d0]">Total</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-[#b4b4d0]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-[#2d1b69]">
                                    {account.items.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`${index % 2 === 0 ? 'bg-white dark:bg-[#13132a]' : 'bg-gray-50/30 dark:bg-[#1a1a35]/50'} hover:bg-purple-50/30 dark:hover:bg-purple-900/20`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                <div className="text-xs text-gray-400 dark:text-[#9898b8]">{item.invoiceNo} • {formatDate(item.date)}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-[#b4b4d0]">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-[#b4b4d0]">₱{item.unitPrice.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">₱{item.total.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">
                                                {getItemStatusBadge(item.status, item.paidAmount, item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 dark:bg-[#1a1a35] border-t border-gray-200 dark:border-[#2d1b69]">
                                        <td colSpan={3} className="px-4 py-2.5 text-right text-sm font-medium text-gray-600 dark:text-[#b4b4d0]">Total:</td>
                                        <td className="px-4 py-2.5 text-right text-base font-bold text-gray-900 dark:text-white">₱{account.totalAmount.toLocaleString()}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="space-y-2">
                        {account.payments.length === 0 ? (
                            <div className="bg-white dark:bg-[#13132a] p-8 text-center rounded-lg border border-dashed border-gray-200 dark:border-[#2d1b69]">
                                <Banknote className="w-10 h-10 text-gray-300 dark:text-[#9898b8] mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-[#b4b4d0]">No payments recorded yet</p>
                            </div>
                        ) : (
                            account.payments.map((payment) => (
                                <div key={payment.id} className="bg-white dark:bg-[#13132a] p-3 rounded-lg border border-gray-100 dark:border-[#2d1b69] flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <Banknote className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-emerald-600">+₱{payment.amount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500 dark:text-[#b4b4d0]">{formatDate(payment.paymentDate)} • {payment.method}</div>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-gray-400 dark:text-[#9898b8]">
                                        <div>{payment.referenceNo}</div>
                                        {payment.receivedBy && <div>by {payment.receivedBy}</div>}
                                    </div>
                                </div>
                            ))
                        )}
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
                            disabled={!paymentAmount || !paymentMethod}
                            size="sm"
                        >
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
