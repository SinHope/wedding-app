import React from 'react'
import { useState, useContext, createContext, useEffect } from 'react'
import supabase from '../../config/supabaseClient'


const AppContext = createContext(null) //to create the context so that we can use the useContext

export function AppProvider({ children }) {
    const [session, setSession] = useState(null)

    async function getSession() {
        //retrieve a session
        const { data, error } = await supabase.auth.getSession()
        setSession(data.session)
    }

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        } else {
            setSession(null);
        }
    }

    useEffect(() => {
        getSession()

        // Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
        })

        return () => listener.subscription.unsubscribe()

    }, [])

    return (
        <AppContext.Provider value={{ session, setSession, logout }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}