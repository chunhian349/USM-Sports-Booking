'use client'
import { type User } from '@supabase/supabase-js'
import { Box, Flex, Text, Button, Link, Container } from '@chakra-ui/react'

export default function NavAction({ user }: { user: User | null }) {
    return (user == null)?(
        // Not logged in
        <Flex bg="white" shadow="base" p={4} align="center" justify="space-between" h="10svh">
            <Link href='/' fontWeight="bold" fontSize={{sm:"xs", lg:"2rem"}} style={{textDecoration:'none'}} ml="4lvw">USM Sports Booking</Link>
            <Box>
                <Link href="/login" style={{textDecoration:'none'}} mr="4lvw">
                    <Button fontSize="m" bg="white" borderWidth="2px" textColor="#970bf5" borderColor="#970bf5" w="6rem" rounded="90" _hover={{ bg: "#970bf5", color:"white"}}>
                        Login
                    </Button>
                </Link>
                {/* <Button fontSize="sm" bg="#970bf5" textColor="white" w="6rem" rounded="90" _hover={{ bg: "#bb88f9"}}>Sign up</Button> */}
            </Box>
        </Flex>
    ):
    (
        // Logged in
        <Flex bg="white" shadow="base" p={4} align="center" justify="space-between" h="10svh">
            <Link href='/' fontWeight="bold" style={{textDecoration:'none'}} ml="4lvw">
                <Text fontSize={{sm:"xs", lg:"2rem"}}>USM Sports Booking</Text>
            </Link>
            <Flex mr="4lvw">
                <Text borderRightColor="#970bf5" borderRightWidth={3} pr={2} fontSize={{sm:"xs", lg:"large"}}>
                    <Link href='/account'>
                        {user.email}
                    </Link>
                </Text>
                <Box as="form" action="/auth/signout" method="post" ml={2}>
                    <Link as="button" type="submit" fontSize={{sm:"xs", lg:"large"}}>
                        Logout
                    </Link>
                </Box>
            </Flex>
        </Flex>
    )
}