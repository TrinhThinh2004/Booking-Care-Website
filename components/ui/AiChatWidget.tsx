'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth/authStore'
import {
    MessageCircle, X, Send, Loader2, Brain, Stethoscope,
    AlertTriangle, Shield, Clock, ChevronRight, UserCheck, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AiResult {
    summary: string
    specialty: { id?: number; name: string; image?: string }
    urgency: 'low' | 'medium' | 'high'
    doctors: any[]
}

interface ChatMessage {
    role: 'user' | 'ai'
    content: string
    result?: AiResult
}

const urgencyMap = {
    low: { label: 'Thấp', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', desc: 'Tư vấn thông thường' },
    medium: { label: 'Trung bình', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', desc: 'Nên khám sớm' },
    high: { label: 'Cao', color: 'bg-red-100 text-red-700', dot: 'bg-red-500', desc: 'Cần khám ngay' },
}

export function AiChatWidget() {
    const { user } = useAuthStore()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isLoading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: text }])
        setIsLoading(true)

        try {
            const res = await fetch('/api/ai-consult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: text, userId: user?.id }),
            })
            const data = await res.json()

            if (!data.success) throw new Error(data.message)

            // Nếu câu hỏi không liên quan y tế → hiển thị thông báo từ chối
            if (data.data.is_medical === false) {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'ai',
                        content: data.data.summary || 'Xin lỗi, tôi chỉ hỗ trợ tư vấn về triệu chứng y tế và sức khỏe. Vui lòng mô tả triệu chứng của bạn để tôi có thể giúp đỡ! 🏥',
                    },
                ])
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: 'ai', content: data.data.summary, result: data.data },
                ])
            }
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                { role: 'ai', content: err.message || 'Có lỗi xảy ra, vui lòng thử lại.' },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Floating Chat Button */}
            <button
                id="ai-chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen
                    ? 'bg-gray-700 hover:bg-gray-800 rotate-0'
                    : 'bg-linear-to-br from-[#92D7EE] to-[#92D7EE] hover:from-[#6fc1d6] hover:to-[#6fc1d6]'
                    }`}
                style={{ boxShadow: isOpen ? undefined : '0 4px 25px rgba(14, 165, 233, 0.4)' }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6 text-white" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-sky-400 opacity-30 animate-ping" />
                    </>
                )}
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '520px' }}>
                    {/* Header */}
                    <div className="bg-linear-to-r from-[#92D7EE] to-[#92D7EE] px-5 py-4 flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm">Tư vấn AI</h3>
                            <p className="text-white/70 text-xs">Mô tả triệu chứng để được tư vấn</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-white/70 text-xs">Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                        {/* Welcome message */}
                        {messages.length === 0 && !isLoading && (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-linear-to-br from-[#EAF8FB] to-[#EAF8FB] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-7 h-7 text-[#92D7EE]" />
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Xin chào! 👋</p>
                                <p className="text-xs text-gray-500 mb-4">Hãy mô tả triệu chứng của bạn, tôi sẽ gợi ý chuyên khoa và bác sĩ phù hợp.</p>
                                {/* Quick suggestions */}
                                <div className="space-y-2">
                                    {['Đau đầu, chóng mặt', 'Đau ngực, khó thở', 'Ho kéo dài, sốt'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); inputRef.current?.focus() }}
                                            className="block w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-100 text-xs text-gray-600 hover:border-sky-200 hover:bg-sky-50 transition-colors"
                                        >
                                            💡 {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === 'user'
                                        ? 'bg-linear-to-br from-[#92D7EE] to-[#92D7EE] text-white rounded-br-md'
                                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                    {/* AI Result Cards */}
                                    {msg.result && (
                                        <div className="mt-3 space-y-2">
                                            {/* Specialty */}
                                            <div className="flex items-center gap-2 bg-sky-50 rounded-lg px-3 py-2">
                                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white flex items-center justify-center">
                                                    {msg.result.specialty?.image ? (
                                                        <img
                                                            src={msg.result.specialty.image}
                                                            alt={msg.result.specialty.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Stethoscope className="w-4 h-4 text-[#92D7EE]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-sky-500 font-medium uppercase tracking-wide">Chuyên khoa</p>
                                                    <p className="text-xs font-semibold text-[#0f6d75]">{msg.result.specialty?.name}</p>
                                                </div>
                                            </div>

                                            {/* Urgency */}
                                            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${urgencyMap[msg.result.urgency]?.color || 'bg-gray-100 text-gray-700'}`}>
                                                {msg.result.urgency === 'high' ? <AlertTriangle className="w-4 h-4 shrink-0" /> :
                                                    msg.result.urgency === 'medium' ? <Clock className="w-4 h-4 shrink-0" /> :
                                                        <Shield className="w-4 h-4 shrink-0" />}
                                                <div>
                                                    <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">Mức độ khẩn cấp</p>
                                                    <p className="text-xs font-semibold">{urgencyMap[msg.result.urgency]?.label} — {urgencyMap[msg.result.urgency]?.desc}</p>
                                                </div>
                                            </div>

                                            {/* Doctors */}
                                            {msg.result.doctors?.length > 0 && (
                                                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5">
                                                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                                                        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Bác sĩ đề xuất</p>
                                                    </div>
                                                    {msg.result.doctors.map((doc: any) => {
                                                        const avatarSrc = doc.image ?? doc.user?.image ?? doc.user?.avatar ?? doc.avatar
                                                        return (
                                                            <div
                                                                key={doc.id}
                                                                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-sky-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                                                                onClick={() => {
                                                                    if (!user) {
                                                                        toast.error('Vui lòng đăng nhập để đặt lịch')
                                                                        router.push('/login')
                                                                        return
                                                                    }
                                                                    const getLocalDateString = (date: Date) => {
                                                                        const offset = date.getTimezoneOffset() * 60000
                                                                        const local = new Date(date.getTime() - offset)
                                                                        return local.toISOString().split('T')[0]
                                                                    }
                                                                    const today = getLocalDateString(new Date())
                                                                    const specialtyId = doc.specialty?.id ?? doc.specialtyId
                                                                    if (specialtyId) {
                                                                        router.push(`/specialties/${specialtyId}?doctorId=${doc.id}&date=${today}`)
                                                                    } else {
                                                                        router.push(`/doctors/${doc.id}/booking`)
                                                                    }
                                                                    setIsOpen(false)
                                                                }}
                                                            >
                                                                <div className="w-8 h-8 bg-linear-to-br from-[#92D7EE] to-[#92D7EE] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                                                                    {avatarSrc ? (
                                                                        <img
                                                                            src={avatarSrc}
                                                                            alt={`BS. ${doc.user?.firstName ?? ''} ${doc.user?.lastName ?? ''}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-xs font-bold">{doc.user?.firstName?.charAt(0) || 'B'}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-semibold text-gray-800 truncate">
                                                                        BS. {doc.user?.lastName} {doc.user?.firstName}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-500 truncate">
                                                                        {doc.clinic?.name || doc.specialty?.name} • {doc.yearsOfExperience} năm KN
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-0.5 text-sky-600 shrink-0">
                                                                    <span className="text-[10px] font-medium">Đặt lịch</span>
                                                                    <ChevronRight className="w-3 h-3" />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#92D7EE]" />
                                        <span>Đang phân tích...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 bg-white shrink-0">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Mô tả triệu chứng..."
                                rows={1}
                                className="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#92D7EE] focus:border-transparent max-h-20"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 rounded-xl bg-linear-to-br from-[#92D7EE] to-[#92D7EE] text-white flex items-center justify-center shrink-0 hover:from-[#6fc1d6] hover:to-[#6fc1d6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
