import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null, phone_verified: boolean | null }
    apiAvailable?: boolean | null
    onRegister?: (name: string, phoneNumber: string, password: string, image: string) => Promise<any>
    onLogin?: (phoneNumber: string, password: string) => Promise<any>
    onVerifySignin?: (code: string) => Promise<any>
    onResendOTP?: (phoneNumber: string) => Promise<any>
    onLogout?: () => Promise<any>
    onCheckApi?: () => Promise<any>
}
const TOKEN_KEY = 'Secret'
export const API_URL = 'http://192.168.188.53:5000'

export const AuthContext = createContext<AuthProps>({})

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

    const [apiAvailable, setApiAvailable] = useState<boolean | any>(null)

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

    // useEffect(() => {
    //     const pingAPI = async () => {
    //         try {
    //             const { data } = await axios.get(`${API_URL}`)
    //             if (data.success) {
    //                 setApiAvailable(true)
    //                 console.log(apiAvailable)
    //             }

    //         } catch (error) {
    //             setApiAvailable(false)
    //             console.log("API ERROR: ", error)
    //         }

    //         // if (token) {
    //         //     const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    //         //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //         //     setAuthState({
    //         //         token: token,
    //         //         authenticated: true,
    //         //         phone_verified: decodedToken.phone_number_verified
    //         //     })
    //         // }

    //     }

    //     pingAPI()
    // }, [])


    const register = async (name: string, phoneNumber: string, password: string, image: string) => {
        try {
            console.log(name + phoneNumber + password)
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, phone_number: phoneNumber, password, id_photo: image })

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


    const checkApi = async () => {
        const controller = new AbortController(); // Create an AbortController
        const signal = controller.signal;
        const timeout = setTimeout(() => controller.abort(), 15000); // Set timeout after 10 seconds

        try {

            const { data } = await axios.get(`${API_URL}`, { signal }); // Use signal for cancellation

            clearTimeout(timeout); // Clear timeout when request completes successfully

            console.log("CHECHAPI: ", data);
            if (data.success) {
                setApiAvailable(true);
                return { success: true };
            } else {
                setApiAvailable(false);
                return { success: false };
            }
        } catch (error) {
            clearTimeout(timeout); // Clear timeout if an error occurs
            console.log(error)
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: "connection timeout",
                    text2: "couldn't connect to the server."
                })
                setApiAvailable(false);
                return { error: true, msg: 'API request timed out' }; // Clearer error message
            } else {
                Toast.show({
                    type: 'error',
                    text1: "connection timeout",
                    text2: "couldn't connect to the server"
                })
                setApiAvailable(false);
                return { error: true, msg: (error as any).response.data.msg }; // Maintain original error handling
            }
        } finally {
            controller.abort(); // Release resources even if request completes before timeout
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

            if (data.success) {
                const decodedToken = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString())
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
        setAuthState({
            token: "",
            authenticated: false,
            phone_verified: false
        })
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
        onCheckApi: checkApi,
        authState,
        apiAvailable
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
