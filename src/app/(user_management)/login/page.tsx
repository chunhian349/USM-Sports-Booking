'use client'

import { FormControl, FormLabel, Input, Container, Button, Heading, Flex, Spacer } from '@chakra-ui/react'
import { login, signup } from './actions'
import { useState } from 'react'

function reset() {
  alert('Resetting password is not implemented yet.')
}

export default function LoginPage() {
  // Note: It seems that the code works without value and onChange props for the Input components, useState and handle functions might be unnecessary
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="grey.300" rounded={20}>
      <Heading mb={10}>Login</Heading>

      <form>
        <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" value={email} onChange={handleEmailChange} required />   
        </FormControl>
        <FormControl isRequired mb={5}>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <Input id="password" name="password" type="password" value={password} onChange={handlePasswordChange} required />
        </FormControl>
        <Flex>
          <Spacer></Spacer>
          <Button type="submit" formAction={login} w="6rem" mr={5} bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc"}}>Log in</Button>
          <Button type="submit" formAction={signup} w="6rem" rounded="50">Sign up</Button>
          <Spacer></Spacer>
        </Flex>
      </form>
    </Container>
  )
}