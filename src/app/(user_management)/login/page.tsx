'use client'

import { FormControl, FormLabel, Input, Container, Button, Heading, Link, Center, Text, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { login } from './actions'
import { useState } from 'react'
import { useFormStatus, useFormState } from 'react-dom'
const initialState = { isActionSuccess: false, message: ''}

function LoginButton({formAction}: {formAction: (payload: FormData) => void}) {
  const { pending } = useFormStatus()
  return <Button type="submit" formAction={formAction} w="6rem" rounded="50" color="white" bg="#970bf5" _hover={{ bg: "#8709dc"}} _active={{bg:"#7808c4"}} isLoading={pending}>Login</Button>
}

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loginState, loginFormAction] =  useFormState(login, initialState)

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="gray.400" rounded={20}>
      <Heading mb={10}>Login</Heading>

      <form>
        <FormControl isRequired mb={5} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" borderWidth={2} borderColor="gray.400" placeholder='Enter email' />   
        </FormControl>
        <FormControl isRequired mb={3} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <InputGroup>
            <Input id="password" name="password" type={show ? "text" : "password"} borderWidth={2} borderColor="gray.400" placeholder='Enter password' />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <VStack mb={5} w={["90%", "20rem", "22rem"]}>
          <Text mr={1}>{'Forgot Password? '}<Link href='/reset_request' color='blue'>Reset Password</Link></Text>
          <Text color='red'>{loginState.message}</Text> 
        </VStack>

        <Center>
          <LoginButton formAction={loginFormAction} />
        </Center>
        
      </form>
    </Container>
  )
}