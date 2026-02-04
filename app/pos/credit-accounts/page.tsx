"use client"

import { useState, useMemo, useEffect } from "react"
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
    Search,
    Plus,
    DollarSign,
    Users,
    TrendingUp,
    AlertCircle,
    Wallet,
    CheckCircle2,
    CreditCard,
    FileText,
    Banknote,
} from "lucide-react"
import { CreditAccountsDataTable } from "@/components/pos/CreditAccountsDataTable"
import { CreditAccountCards } from "@/components/pos/CreditAccountCards"

// Types
interface Payment {
    id: number
    amount: number
    paymentDate: string
    method: 'cash' | 'card' | 'bank'
    notes?: string
    receivedBy?: string
}

interface PurchasedItem {
    id: number
    name: string
    quantity: number
    unitPrice: number
    total: number
    date: string
    status: 'pending' | 'partial' | 'paid'
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
    installmentPlan?: {
        frequency: 'weekly' | 'monthly' | 'custom'
        amount: number
        nextDue: string
    }
    payments: Payment[]
    items: PurchasedItem[]
    status: 'active' | 'overdue' | 'paid' | 'defaulted'
    createdAt: string
    lastPaymentDate?: string
}

// Mock data with more details including paid amounts per item
const mockAccounts: CreditAccount[] = [
    {
        id: 1,
        customer: {
            id: 1,
            name: "Juan Dela Cruz",
            phone: "+63 912 345 6789",
            email: "juan@email.com",
            address: "123 Main St, Quezon City",
            memberSince: "2025-06-15"
        },
        totalAmount: 15000,
        paidAmount: 5000,
        remainingBalance: 10000,
        creditLimit: 20000,
        dueDate: "2026-02-15",
        installmentPlan: {
            frequency: 'monthly',
            amount: 2500,
            nextDue: "2026-02-01"
        },
        payments: [
            { id: 1, amount: 3000, paymentDate: "2026-01-05", method: 'cash', notes: "Initial payment", receivedBy: "Staff A" },
            { id: 2, amount: 2000, paymentDate: "2026-01-20", method: 'bank', notes: "Partial payment", receivedBy: "Staff B" },
        ],
        items: [
            { id: 1, name: "Premium Rice 25kg", quantity: 2, unitPrice: 1500, total: 3000, date: "2026-01-01", status: 'paid', paidAmount: 3000 },
            { id: 2, name: "Cooking Oil 5L", quantity: 3, unitPrice: 450, total: 1350, date: "2026-01-01", status: 'paid', paidAmount: 1350 },
            { id: 3, name: "Sugar 1kg (x10)", quantity: 10, unitPrice: 75, total: 750, date: "2026-01-05", status: 'partial', paidAmount: 650 },
            { id: 4, name: "Canned Goods Bundle", quantity: 1, unitPrice: 2400, total: 2400, date: "2026-01-10", status: 'pending', paidAmount: 0 },
            { id: 5, name: "Household Items", quantity: 1, unitPrice: 7500, total: 7500, date: "2026-01-15", status: 'pending', paidAmount: 0 },
        ],
        status: 'active',
        createdAt: "2026-01-01",
        lastPaymentDate: "2026-01-20"
    },
    {
        id: 2,
        customer: {
            id: 2,
            name: "Maria Santos",
            phone: "+63 923 456 7890",
            address: "456 Oak Ave, Makati",
            memberSince: "2025-08-20"
        },
        totalAmount: 8500,
        paidAmount: 8500,
        remainingBalance: 0,
        dueDate: "2026-01-25",
        payments: [
            { id: 3, amount: 8500, paymentDate: "2026-01-25", method: 'cash', receivedBy: "Staff A" },
        ],
        items: [
            { id: 6, name: "Grocery Bundle", quantity: 1, unitPrice: 5000, total: 5000, date: "2026-01-15", status: 'paid', paidAmount: 5000 },
            { id: 7, name: "Personal Care Items", quantity: 1, unitPrice: 3500, total: 3500, date: "2026-01-15", status: 'paid', paidAmount: 3500 },
        ],
        status: 'paid',
        createdAt: "2026-01-15",
        lastPaymentDate: "2026-01-25"
    },
    {
        id: 3,
        customer: {
            id: 3,
            name: "Pedro Reyes",
            phone: "+63 934 567 8901",
            address: "789 Pine Rd, Pasig",
            memberSince: "2025-03-10"
        },
        totalAmount: 12000,
        paidAmount: 3000,
        remainingBalance: 9000,
        creditLimit: 15000,
        dueDate: "2026-01-20",
        installmentPlan: {
            frequency: 'weekly',
            amount: 1500,
            nextDue: "2026-02-03"
        },
        payments: [
            { id: 4, amount: 3000, paymentDate: "2026-01-10", method: 'card', receivedBy: "Staff C" },
        ],
        items: [
            { id: 8, name: "Electronics Bundle", quantity: 1, unitPrice: 8000, total: 8000, date: "2026-01-05", status: 'partial', paidAmount: 3000 },
            { id: 9, name: "Accessories", quantity: 1, unitPrice: 4000, total: 4000, date: "2026-01-05", status: 'pending', paidAmount: 0 },
        ],
        status: 'overdue',
        createdAt: "2026-01-05",
        lastPaymentDate: "2026-01-10"
    },
]

// Progress Bar Component for Payment Dialog
function ProgressBar({ value, max }: { value: number; max: number }) {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0

    return (
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${percentage === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                    percentage > 0 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-200'
                    }`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

// Custom hook to detect if screen is desktop (lg breakpoint: 1024px)
function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }

        // Check on mount
        checkIsDesktop()

        // Add resize listener
        window.addEventListener('resize', checkIsDesktop)

        return () => window.removeEventListener('resize', checkIsDesktop)
    }, [])

    return isDesktop
}

export default function CreditAccountsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [accounts] = useState<CreditAccount[]>(mockAccounts)
    const [selectedAccount, setSelectedAccount] = useState<CreditAccount | null>(null)
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentNotes, setPaymentNotes] = useState("")
    const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set())

    const isDesktop = useIsDesktop()

    // Toggle expanded state for an account (for cards view)
    const toggleExpanded = (accountId: number) => {
        setExpandedAccounts(prev => {
            const newSet = new Set(prev)
            if (newSet.has(accountId)) {
                newSet.delete(accountId)
            } else {
                newSet.add(accountId)
            }
            return newSet
        })
    }

    // Filter accounts for cards view (DataTable handles its own filtering)
    const filteredAccounts = useMemo(() => {
        return accounts.filter(account => {
            const matchesSearch =
                account.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.customer.phone?.includes(searchQuery) ||
                account.customer.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === "all" || account.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [accounts, searchQuery, statusFilter])

    // Statistics
    const stats = useMemo(() => {
        const totalAccounts = accounts.length
        const activeAccounts = accounts.filter(a => a.status === 'active').length
        const overdueAccounts = accounts.filter(a => a.status === 'overdue').length
        const totalOutstanding = accounts.reduce((sum, a) => sum + a.remainingBalance, 0)

        return { totalAccounts, activeAccounts, overdueAccounts, totalOutstanding }
    }, [accounts])

    const handleAddPayment = (account: CreditAccount) => {
        setSelectedAccount(account)
        setPaymentAmount("")
        setPaymentMethod("")
        setPaymentNotes("")
        setIsAddPaymentOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Enhanced Header */}
            <div className="relative pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            Credit Accounts
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Manage customer credit, track balances, and record payments
                        </p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all duration-200 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        New Credit Account
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="group relative bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start justify-between gap-3">
                        <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Accounts</div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.totalAccounts}</div>
                            <div className="text-xs text-gray-400 mt-1">All time</div>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start justify-between gap-3">
                        <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Active</div>
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.activeAccounts}</div>
                            <div className="text-xs text-gray-400 mt-1">On track</div>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start justify-between gap-3">
                        <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</div>
                            <div className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{stats.overdueAccounts}</div>
                            <div className="text-xs text-red-400 mt-1">Needs attention</div>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-100 to-red-50 text-red-600 flex items-center justify-center shadow-sm">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="group relative bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start justify-between gap-3">
                        <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding</div>
                            <div className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">₱{stats.totalOutstanding.toLocaleString()}</div>
                            <div className="text-xs text-gray-400 mt-1">To collect</div>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                            <Wallet className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                        placeholder="Search by customer name, phone, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-300 focus:ring-purple-200 transition-all"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="defaulted">Defaulted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Responsive Layout: DataTable for Desktop, Cards for Mobile/Tablet */}
            {isDesktop ? (
                <CreditAccountsDataTable
                    accounts={accounts}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onAddPayment={handleAddPayment}
                />
            ) : (
                <CreditAccountCards
                    accounts={filteredAccounts}
                    expandedAccounts={expandedAccounts}
                    onToggleExpanded={toggleExpanded}
                    onAddPayment={handleAddPayment}
                />
            )}

            {/* Add Payment Dialog */}
            <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Record Payment</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Add a payment for {selectedAccount?.customer.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        {/* Balance Summary */}
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Balance</span>
                                <span className="text-2xl font-bold text-purple-600">
                                    ₱{selectedAccount?.remainingBalance.toLocaleString()}
                                </span>
                            </div>
                            <ProgressBar
                                value={selectedAccount?.paidAmount || 0}
                                max={selectedAccount?.totalAmount || 1}
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span>Paid: ₱{selectedAccount?.paidAmount.toLocaleString()}</span>
                                <span>Total: ₱{selectedAccount?.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Pending Items Preview */}
                        {selectedAccount && selectedAccount.items.filter(i => i.status !== 'paid').length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unpaid Items</Label>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {selectedAccount.items.filter(i => i.status !== 'paid').map(item => (
                                        <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300 truncate flex-1">{item.name}</span>
                                            <span className="text-orange-600 font-medium ml-2">
                                                ₱{(item.total - (item.paidAmount || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="paymentAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Payment Amount (₱)
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="paymentAmount"
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="pl-9 h-11 text-lg font-semibold border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enter the amount to apply to the remaining balance
                            </p>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="w-4 h-4" />
                                            Cash
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="card">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Card
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="bank">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Bank Transfer
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="paymentNotes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="paymentNotes"
                                placeholder="Add any notes about this payment..."
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="h-11 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddPaymentOpen(false)}
                            className="border-gray-200 hover:bg-gray-50 dark:bg-gray-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all duration-200 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
                            disabled={!paymentAmount || !paymentMethod}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
