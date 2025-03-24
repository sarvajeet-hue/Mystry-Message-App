"use client"

import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponseType'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React , {useCallback, useState} from 'react'
import { useForm } from 'react-hook-form'


const page = () => {

    const [messages , setMessages] = useState<Message[]>([])
    const [isLoading , setIsLoading] = useState(false)
    const [isSwitchLoading , setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = (messageId : string) => {
        setMessages(messages.filter((message) => message._id !== messageId ))
    }

    const {data : session} = useSession()
    console.log("data" , session)

    const form = useForm({
        resolver : zodResolver(acceptMessageSchema)
    })

    const {register , watch , setValue} = useForm()

    const acceptMessages = watch('acceptMessages')  //this term need to be learn

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try{
            const response = await axios.get<apiResponse>('/api/accept-message')
            setValue('acceptMessages' , response?.data?.isAcceptingMessages)
        }catch(error){      
            const axiosError = error as AxiosError<apiResponse>
            console.log("axiosError" , axiosError)
        }
        finally{
            setIsSwitchLoading(false)
        }
    } , [setValue])  // and this term we need to learn


    const fetchMessage = useCallback( async (refresh : boolean) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
    } , [])

  return (
    <div>Dashboard</div>
  )
}

export default page