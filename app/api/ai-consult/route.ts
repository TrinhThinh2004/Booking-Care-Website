import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import DB from '@/lib/database/models'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// POST /api/ai-consult
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { symptoms, userId } = body

        if (!symptoms || !symptoms.trim()) {
            return NextResponse.json(
                { success: false, message: 'Vui lòng nhập triệu chứng' },
                { status: 400 }
            )
        }

        // Fetch specialties for AI to match against
        const specialties = await DB.Specialty.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'image'],
        })
        const specialtyNames = specialties.map((s: any) => s.name).join(', ')

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `Bạn là trợ lý tư vấn y tế thông minh. Nhiệm vụ của bạn:
1. Xác định xem câu hỏi của người dùng có liên quan đến y tế/sức khỏe/triệu chứng bệnh hay không.
2. Nếu CÓ liên quan y tế → phân tích và đưa ra gợi ý chuyên khoa.
3. Nếu KHÔNG liên quan y tế → từ chối lịch sự.

Danh sách chuyên khoa có sẵn: ${specialtyNames}.

Trả về CHÍNH XÁC JSON format (không có markdown, không có backticks, chỉ JSON thuần):
{
  "is_medical": true hoặc false,
  "summary": "Nếu is_medical=true: mô tả tình trạng sức khỏe (2-3 câu). Nếu is_medical=false: lời từ chối lịch sự, nhắc người dùng chỉ hỗ trợ tư vấn y tế",
  "specialty": "Tên chuyên khoa phù hợp nhất (chỉ khi is_medical=true, nếu false thì để chuỗi rỗng)",
  "urgency": "low | medium | high (chỉ khi is_medical=true, nếu false thì để 'low')"
}

Quy tắc:
- is_medical = true nếu câu hỏi liên quan đến: triệu chứng bệnh, sức khỏe, thuốc, chấn thương, cơ thể, tâm lý, dinh dưỡng sức khỏe
- is_medical = false nếu câu hỏi về: nấu ăn, thời tiết, giải trí, công nghệ, chuyện phiếm, hoặc bất kỳ chủ đề nào không liên quan y tế
- specialty PHẢI là một trong: ${specialtyNames} (khi is_medical=true)
- urgency: "low" = tư vấn thông thường, "medium" = nên khám sớm, "high" = cần khám ngay
- Trả lời bằng tiếng Việt
- CHỈ trả về JSON, không thêm text nào khác

Câu hỏi của người dùng: ${symptoms}`

        const result = await model.generateContent(prompt)
        const aiText = result.response.text()

        let aiResult: { is_medical: boolean; summary: string; specialty: string; urgency: string }
        try {
            const cleaned = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            aiResult = JSON.parse(cleaned)
        } catch {
            aiResult = {
                is_medical: true,
                summary: 'Không thể phân tích triệu chứng. Vui lòng mô tả chi tiết hơn.',
                specialty: specialties[0]?.name || 'Tim mạch',
                urgency: 'low',
            }
        }

        // Nếu câu hỏi không liên quan y tế → từ chối, không lưu DB, không query doctors
        if (!aiResult.is_medical) {
            return NextResponse.json({
                success: true,
                message: 'Câu hỏi không liên quan y tế',
                data: {
                    is_medical: false,
                    summary: aiResult.summary || 'Xin lỗi, tôi chỉ hỗ trợ tư vấn về triệu chứng y tế và sức khỏe. Vui lòng mô tả triệu chứng của bạn để tôi có thể giúp đỡ.',
                },
            })
        }

        // Map specialty name to DB record
        const matchedSpecialty = specialties.find(
            (s: any) => s.name.toLowerCase() === aiResult.specialty.toLowerCase()
        ) || specialties.find(
            (s: any) => aiResult.specialty.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(aiResult.specialty.toLowerCase())
        )

        const specialtyId = matchedSpecialty?.id || specialties[0]?.id

        // Query doctors by specialty
        const doctors = await DB.Doctor.findAll({
            where: { specialtyId },
            limit: 3,
            order: [['yearsOfExperience', 'DESC']],
            include: [
                { model: DB.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: DB.Specialty, as: 'specialty', attributes: ['id', 'name', 'image'] },
                { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name', 'address'] },
            ],
        })

        // Save to DB
        const validUrgency = ['low', 'medium', 'high'].includes(aiResult.urgency)
            ? aiResult.urgency
            : 'low'

        const consultation = await DB.AiConsultation.create({
            userId: userId ? Number(userId) : null,
            symptoms: symptoms.trim(),
            aiResponse: JSON.stringify(aiResult),
            suggestedSpecialty: matchedSpecialty?.name || aiResult.specialty,
            urgencyLevel: validUrgency,
        })

        return NextResponse.json({
            success: true,
            message: 'Phân tích triệu chứng thành công',
            data: {
                is_medical: true,
                id: consultation.id,
                summary: aiResult.summary,
                specialty: matchedSpecialty || { name: aiResult.specialty },
                urgency: validUrgency,
                doctors,
            },
        })
    } catch (error: any) {
        console.error('AI Consult error:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi khi phân tích triệu chứng', error: error?.message || String(error) },
            { status: 500 }
        )
    }
}
