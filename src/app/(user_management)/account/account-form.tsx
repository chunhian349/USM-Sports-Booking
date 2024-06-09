'use client'

import { FormControl, FormLabel, Input, Container, Button, Heading, Center, VStack, Alert, AlertIcon, Text } from '@chakra-ui/react'
import { useFormStatus, useFormState } from 'react-dom'
import { UpdateProfile } from './page'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const initialState = { isActionSuccess: false, message: ''}

function UpdateProfileButton({formAction}: {formAction: (payload: FormData) => void}) {
    const { pending } = useFormStatus()
    return <Button type="submit" formAction={formAction} w="10rem" bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc"}} isLoading={pending}>Update Profile</Button>
}

export default function AccountForm({ 
    userData 
}: { 
    userData : {
        user_id: string;
        email: string;
        full_name: string;
        phone_num: string;
        user_type: string;
    }
}) {
    const [formState, formAction] = useFormState(UpdateProfile, initialState)
    const router = useRouter()

    useEffect(() => {
      if (formState.isActionSuccess) {
          router.refresh()
      }
    }, [formState, router])

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} mt="5lvh" borderWidth={2} borderColor="gray.400" rounded={20}>
      <Heading mb={5}>Profile</Heading>

      <form>
        <FormControl mb={3} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" defaultValue={userData.email} _disabled={{textColor:'black', borderWidth:"2", borderColor:"gray.400"}} disabled />   
        </FormControl>
        <FormControl mb={3} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor="user_type">User Type:</FormLabel>
          <Input id="user_type" name="user_type" type="user_type" defaultValue={userData.user_type} _disabled={{textColor:'black', borderWidth:"2", borderColor:"gray.400"}} disabled/>
        </FormControl >
        <FormControl isRequired mb={3} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor="fullname">Full Name:</FormLabel>
          <Input id="fullname" name="fullname" defaultValue={userData.full_name} borderWidth={2} borderColor="gray.400" />
        </FormControl>
        <FormControl isRequired mb={5} w={["90%", "20rem", "20rem"]}>
          <FormLabel htmlFor='phonenum'>Phone Number:</FormLabel>
          <Input id='phonenum' name='phonenum' defaultValue={userData.phone_num} borderWidth={2} borderColor="gray.400" />
        </FormControl>
        <FormControl>
          <FormLabel hidden htmlFor='userid'>User ID:</FormLabel>
          <Input hidden id='userid' name='userid' defaultValue={userData.user_id} />
        </FormControl>

        <VStack w={["90%", "20rem", "20rem"]} mb={3}>
          {/* formState changed after submit, show result of form submission (success/failed) */}
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
            <UpdateProfileButton formAction={formAction} />
        </Center>
      </form>
    </Container>
  )
}