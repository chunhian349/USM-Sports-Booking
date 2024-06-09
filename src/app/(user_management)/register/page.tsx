'use client'

import { FormControl, FormLabel, Input, Container, Button, Heading, Center, Text, InputGroup, InputRightElement, VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { signup } from './actions'
import { useState } from 'react'
import { useFormStatus, useFormState } from 'react-dom'

// Initial form state
const initialState = { isActionSuccess: false, message: ''}

// Create custom component to track form status for button loading
function SignUpButton({formAction}: {formAction: (payload: FormData) => void}) {
  const { pending } = useFormStatus()
  return <Button type="submit" formAction={formAction} w="6rem" rounded="50" color="white" bg="#970bf5" _hover={{ bg: "#8709dc"}} _active={{bg:"#7808c4"}} isLoading={pending}>Sign up</Button>
}

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  
  // Define signup function as form action, link to a form state
  const [signupState, signupFormAction] = useFormState(signup, initialState)

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="gray.400" rounded={20}>
      <Heading mb={10}>Register</Heading>

      <form>
        <FormControl isRequired mb={5} w={["90%", "20rem", "22rem"]}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" borderWidth={2} borderColor="gray.400" placeholder='eg: example@usm.my' />   
        </FormControl>

        <FormControl isRequired mb={3} w={["90%", "20rem", "22rem"]}>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <InputGroup>
            <Input id="password" name="password" type={show ? "text" : "password"} borderWidth={2} borderColor="gray.400" placeholder='eg: Password@123' />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <VStack mb={5} w={["90%", "20rem", "22rem"]} spacing={2}>
          <Alert status='info'>
            <AlertIcon />
            <Text fontSize='xs'>Password should be minimum of 8 characters with the combination of uppercase letters, lowercase letters, digits, and special characters (!@#$%^&*-_).</Text>
          </Alert>
          
          {/* formState changed after submit, show result of form submission (success/failed) */}
          {(signupState == initialState) ? null : signupState.isActionSuccess ? (
            <Alert status='success'>
              <AlertIcon />
              <Text color='green' fontSize='sm'>{signupState.message}</Text>
            </Alert>
          ) : (
            <Alert status='error'>
              <AlertIcon />
              <Text color='red' fontSize='sm'>{signupState.message}</Text>
            </Alert>
          )}
        </VStack>

        <Center>
          <SignUpButton formAction={signupFormAction} />
        </Center>
      </form>
    </Container>
  )
}