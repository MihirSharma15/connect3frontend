export type UserInDb = {
        user_id: string
        name: string
        phonenumber: string
        hashed_password: string
        created_at: string
        remaining_connections: number
        is_verified: boolean
        invite_code: string
    }