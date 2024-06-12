import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null }
    onRegister?: (phoneNumber: string, name: string, password: string) => Promise<any>
    onLogin?: (phoneNumber: string, password: string) => Promise<any>
    onLogout?: () => Promise<any>
}
const TOKEN_KEY = 'auth-jwt'
export const API_URL = 'http://192.168.137.1:5000'

const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null
        authenticated: boolean | null
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
      const loadToken = async () => {
        const token =  await SecureStore.getItemAsync(TOKEN_KEY)

        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setAuthState({
                token: token,
                authenticated: true
            })
        }
        
      }

      loadToken()
    }, [])
    
    
    const register = async (name: string, phoneNumber: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/auth/register`, {name, phone_number: phoneNumber, password})
            // return await axios.get(`${API_URL}`)
        } catch (error) {
            return {error: true, msg: (error as any).response.data.msg}
        }
    }

    const login = async (phoneNumber: string, password: string) => {
        try {
            const {data }= await axios.post(`${API_URL}/auth/login`, {phone_number: phoneNumber, password})
            // console.log(data)
            setAuthState({
                token: data.token,
                authenticated: true
            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

            await SecureStore.setItemAsync(TOKEN_KEY, data.token)

            return data

        } catch (error) {
            return {error: true, msg: (error as any).response.data}
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)

        axios.defaults.headers.common['Authorization'] = ''

        setAuthState({
            token: null, 
            authenticated: false
        })
    }
    
    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
