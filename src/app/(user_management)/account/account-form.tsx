'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { FormControl, FormLabel, Input, Container, Button, Heading, Flex, Spacer } from '@chakra-ui/react'

export default function AccountForm({ user }: { user: User}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState('')
  const [phonenum, setPhonenum] = useState('')
  const [usertype, setUserType] = useState(getUserTypeFromEmail(user.email as string))

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('User')
        .select(`full_name, phone_num, user_type`)
        .eq('user_id', user.id) 
        .single();

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setPhonenum(data.phone_num)
        setUserType(data.user_type)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  function getUserTypeFromEmail(email: string) {
    const emailDomain = email.split('@')

    if (emailDomain[1].endsWith('student.usm.my')){
      return 'Student'
    }
    else if (emailDomain[1].endsWith('usm.my')){
      return 'Staff'
    }
    else {
      return 'Private'
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)

      const { error } = await supabase.from('User').upsert({
        user_id: user.id as string,
        full_name: fullname,
        phone_num: phonenum,
        user_type: usertype
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      console.log(error)
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="grey.300" rounded={20}>
      <Heading mb={10}>Account Profile</Heading>

      <form>
        <FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" value={user.email} disabled />   
        </FormControl>
        <FormControl mb={5}>
          <FormLabel htmlFor="user_type">User type:</FormLabel>
          <Input id="user_type" name="user_type" type="user_type" value={usertype} disabled/>
        </FormControl>
        <FormControl isRequired mb={5}>
          <FormLabel htmlFor="user_type">Full Name:</FormLabel>
          <Input id="user_type" name="user_type" type="user_type" value={fullname} onChange={(e) => {setFullname(e.target.value)}} />
        </FormControl>
        <FormControl isRequired mb={5}>
          <FormLabel htmlFor="user_type">Phone Number:</FormLabel>
          <Input id="user_type" name="user_type" type="user_type" value={phonenum} onChange={(e) => {setPhonenum(e.target.value)}}/>
        </FormControl>
        <Flex>
          <Spacer></Spacer>
          <Button type="submit" formAction={updateProfile} w="10rem" mr={5} bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc"}} disabled={loading}>
            {loading ? 'Loading...' : 'Update Profile'}
          </Button>
          <Spacer></Spacer>
        </Flex>
      </form>
    </Container>
  )
}