'use client'

import Head from 'next/head';
import { createClient } from "@/utils/supabase/client";
import React, { useState } from 'react';
import {
  CircularProgress,
  Button,
  Heading,
  Container,
  FormLabel,
  FormControl,
  Input,
  Alert,
  AlertIcon,
  Center,
} from '@chakra-ui/react';
  
export default function ResetRequest(){
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        await sendEmail();
    };
  
    async function sendEmail() {      
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(
                email, 
                {redirectTo: 'localhost:3000/reset_password',}
            );
        if(data){
            setSubmitted(true);
            setEmail('');
            setIsLoading(false);
        }
        else if(error){
            console.log(error);
            setIsLoading(false);
        }          
    }
    
    return(
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="grey.300" rounded={20}> 
            <Head>
                <title>Forgot Password</title>
            </Head>
            <Heading mb="50px" alignSelf="center">Forgot Password</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={5} w={"20rem"}>
                    <FormLabel htmlFor='email'>Enter Email:</FormLabel>
                    <Input name="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
                </FormControl>
                <Center>
                    <Button type='submit' colorScheme='purple' w="6.5rem" bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc"}}>
                        {isLoading ? (
                            <CircularProgress
                            isIndeterminate
                            size="24px"
                            color="white"
                            />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </Center>
            </form>
            {submitted ? (
                <Alert status='success' mt={5}>
                    <AlertIcon />
                    Please check your email for the password reset link.
                </Alert>
            ):(
                null
            )}
        </Container>
    )
}