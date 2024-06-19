'use client'

import { useEffect, useState } from 'react';
import { Container, Button, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Alert, AlertIcon, Center, VStack, Text } from '@chakra-ui/react';
import { ResetPassword } from './actions';
import { useFormStatus, useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

const initialState = { isActionSuccess: false, message: '' }

function ResetPasswordButton({formAction}: {formAction: (payload: FormData) => void}) {
    const { pending } = useFormStatus()
    return <Button type="submit" formAction={formAction} w="6rem" rounded="50" color="white" bg="#970bf5" _hover={{ bg: "#8709dc"}} _active={{bg:"#7808c4"}} isLoading={pending}>Submit</Button>
}

export default function ResetPasswordPage() {
    const [show, setShow] = useState(false);
    const [formState, formAction] = useFormState(ResetPassword, initialState);
    const router = useRouter();

    useEffect(() => {
        if (formState.isActionSuccess) {
            router.push('/');
        }
    }, [formState, router])
    
    return(
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={3} borderColor="purple.600" rounded={20}>   
            <Heading mb="50px" alignSelf="center">Reset Password</Heading>
            
            <form>
                <FormControl isRequired mb={5} w={["90%", "20rem", "20rem"]}>
                    <FormLabel htmlFor='newPassword'>Enter New Password:</FormLabel>
                    <InputGroup size='md'>
                        <Input id='newPassword' name="newPassword" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}} type={show ? 'text' : 'password'} placeholder='Enter new password' />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <VStack mb={5} w={["90%", "20rem", "20rem"]} spacing={2}>
                    <Alert status='info'>
                        <AlertIcon />
                        <Text fontSize='xs'>Password should be minimum of 8 characters with the combination of uppercase letters, lowercase letters, digits, and special characters (!@#$%^&*-_).</Text>
                    </Alert>

                    {(formState == initialState) ? null : formState.isActionSuccess ? (
                        <Alert status='success'>
                        <AlertIcon />
                        <Text color='green' fontSize='sm'>{formState.message}</Text>
                        </Alert>
                    ) : (
                        <Alert status='error'>
                        <AlertIcon />
                        <Text color='red' fontSize='sm'>{formState.message}</Text>
                        </Alert>
                    )}
                </VStack>

                <Center>
                    <ResetPasswordButton formAction={formAction} />
                </Center>
            </form>
        </Container>  
    )
}