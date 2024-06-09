'use client'

import { Text, Button, Heading, Container, FormLabel, FormControl, Input, Alert, AlertIcon, Center } from '@chakra-ui/react';
import { useFormStatus, useFormState } from 'react-dom';
import { RequestResetPassword } from './actions';

const initialState = { isActionSuccess: false, message: '' }

function ResetRequestButton({formAction}: {formAction: (payload: FormData) => void}) {
    const { pending } = useFormStatus()
    return <Button type="submit" formAction={formAction} w="6rem" rounded="50" color="white" bg="#970bf5" _hover={{ bg: "#8709dc"}} _active={{bg:"#7808c4"}} isLoading={pending}>Submit</Button>
}

export default function ResetRequest(){
    const [formState, formAction] = useFormState(RequestResetPassword, initialState)
    
    return(
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="gray.400" rounded={20}> 
            <Heading mb="50px" alignSelf="center">Forgot Password</Heading>
            
            <form>
                <FormControl isRequired mb={5} w={["90%", "20rem", "20rem"]}>
                    <FormLabel htmlFor='email'>Enter Email:</FormLabel>
                    <Input id='email' name="email" type="email" borderWidth={2} borderColor="gray.400" placeholder='Enter your email'/>
                </FormControl>
                <Center>
                    <ResetRequestButton formAction={formAction}/>
                </Center>
            </form>

            <Center mt={3} w={["90%", "20rem", "20rem"]}>
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
            </Center>
        </Container>
    )
}