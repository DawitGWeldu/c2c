import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Buffer } from 'buffer';


interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null, phone_verified: boolean | null }
    onRegister?: ( name: string, phoneNumber: string, password: string) => Promise<any>
    onLogin?: (phoneNumber: string, password: string) => Promise<any>
    onVerifySignin?: (code: string) => Promise<any>
    onResendOTP?: (phoneNumber: string) => Promise<any>
    onLogout?: () => Promise<any>
}
const TOKEN_KEY = 'Secret'
export const API_URL = 'http://192.168.137.1:5000'

const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null
        authenticated: boolean | null
        phone_verified: boolean | null
    }>({
        token: null,
        authenticated: null,
        phone_verified: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)


            if (token) {
                const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                setAuthState({
                    token: token,
                    authenticated: true,
                    phone_verified: decodedToken.phone_number_verified
                })
            }

        }

        loadToken()
    }, [])


    const register = async (name: string, phoneNumber: string, password: string) => {
        try {
            console.log(name+phoneNumber+password)
            const {data} = await axios.post(`${API_URL}/auth/register`, { name, phone_number: phoneNumber, password })
            console.log(JSON.stringify(data))

            if (data.success) {
                setAuthState({
                    token: data.token,
                    authenticated: true,
                    phone_verified: false
                })
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                await SecureStore.setItemAsync(TOKEN_KEY, data.token)
                return data

            }
            return data
        } catch (error) {
            return { error: true, msg: (error as any).response.data.msg }
        }
    }

    const verifySignin = async (code: string) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/verifyPhoneNumber`, { otp: code })
            if (data.success) {
                setAuthState({
                    token: authState.token,
                    authenticated: true,
                    phone_verified: true
                })
                // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                // await SecureStore.setItemAsync(TOKEN_KEY, data.token)

            }
            // return await axios.get(`${API_URL}`)
        } catch (error) {
            return { error: true, msg: (error as any).response.data.msg }
        }
    }

    const resendOTP = async (phoneNumber: string) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/resendSMS`, { phone_number: phoneNumber })
            if (data.success) {
                // setAuthState({
                //     token: authState.token,
                //     authenticated: true,
                //     phone_verified: data.phone_number_verified
                // })
                // // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                // // await SecureStore.setItemAsync(TOKEN_KEY, data.token)
                return true
            } else {
                return false
            }
            // return await axios.get(`${API_URL}`)
        } catch (error) {
            return false
        }
    }



    const login = async (phoneNumber: string, password: string) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { phone_number: phoneNumber, password })

            // console.log(data)
            if (data.success) {
                const decodedToken = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString())
                // console.log(decodedToken)
                setAuthState({
                    token: data.token,
                    authenticated: true,
                    phone_verified: decodedToken.phone_number_verified
                })
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                await SecureStore.setItemAsync(TOKEN_KEY, data.token)
            }

            return data

        } catch (error) {
            return { error: true, msg: (error as any).response.data }
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)

        axios.defaults.headers.common['Authorization'] = ''

        setAuthState({
            token: null,
            authenticated: false,
            phone_verified: null
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onVerifySignin: verifySignin,
        onResendOTP: resendOTP,
        authState
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
