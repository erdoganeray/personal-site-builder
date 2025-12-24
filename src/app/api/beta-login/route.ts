import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()
        const betaPassword = process.env.BETA_PASSWORD

        if (!betaPassword) {
            return NextResponse.json(
                { error: 'Beta şifresi yapılandırılmamış' },
                { status: 500 }
            )
        }

        if (password.trim() !== betaPassword.trim()) {
            return NextResponse.json(
                { error: 'Geçersiz şifre' },
                { status: 401 }
            )
        }

        // Create response with success
        const response = NextResponse.json({ success: true })

        // Set cookie for beta access (valid for 7 days)
        response.cookies.set('beta-access', password, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch {
        return NextResponse.json(
            { error: 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}
