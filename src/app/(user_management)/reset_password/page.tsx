'use client'

import Head from 'next/head';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Container, Box, Button, CircularProgress, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Alert, AlertIcon, Flex, Center } from '@chakra-ui/react';

export default function ResetPasswordPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [show, setShow] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        resetPassword();
    };

    const resetPassword = async () => {           
        const { data, error } = await supabase.auth
            .updateUser({ password: newPassword })
        
        console.log("password reset")
        setSubmitted(true);
        setNewPassword('');
        setIsLoading(false);
    }
    
    
    return(
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="grey.300" rounded={20}>   
            <Head>
                <title>Reset Password</title>
            </Head>
            <Heading mb="50px" alignSelf="center">Reset Password</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={5} w={'20rem'}>
                    <FormLabel htmlFor='newPassword'>Enter New Password:</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)}}
                            type={show ? 'text' : 'password'}
                            placeholder='Enter password' 
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
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
                <Alert status='success'>
                    <AlertIcon />
                    Password updated successfully!
                </Alert>
            ):(
                null
            )}
        </Container>  
    )
}