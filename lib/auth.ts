import { supabase } from "./supabase"

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (error) return null
    return data
}

export async function signOut() {
    await supabase.auth.signOut()
}
