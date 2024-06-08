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
  const [usertype, setUserType] = useState('')

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

  async function updateProfile() {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('User')
        .update({
        // user_id: user.id as string,
        full_name: fullname,
        phone_num: phonenum,
        // user_type: usertype
        })
        .eq('user_id', user.id)

      if (error) throw error

      alert('Profile updated!')
    } catch (error) {
      console.log(error)
      alert('Error updating the profile!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} my="10lvh" borderWidth={2} borderColor="#970bf5" rounded={20}>
      <Heading mb={10}>Profile</Heading>

      <form>
        <FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input id="email" name="email" type="email" value={user.email} disabled />   
        </FormControl>
        <FormControl mb={5}>
          <FormLabel htmlFor="user_type">User Type:</FormLabel>
          <Input id="user_type" name="user_type" type="user_type" value={usertype} disabled/>
        </FormControl>
        <FormControl isRequired mb={5}>
          <FormLabel>Full Name:</FormLabel>
          <Input value={fullname} onChange={(e) => {setFullname(e.target.value)}} />
        </FormControl>
        <FormControl isRequired mb={5}>
          <FormLabel>Phone Number:</FormLabel>
          <Input value={phonenum} onChange={(e) => {setPhonenum(e.target.value)}}/>
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