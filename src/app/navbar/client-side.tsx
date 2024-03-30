'use client'
import { type User } from '@supabase/supabase-js'
import { Box, Flex, Text, Button, Link } from '@chakra-ui/react'

export default function NavAction({ user }: { user: User | null }) {
    return (user == null)?(
        // Not logged in
        <Flex bg="white" shadow="base" p={4} align="center" justify="space-between">
            <Link href='/' fontSize="2xl" fontWeight="bold" style={{textDecoration:'none'}}>USM Sports Booking</Link>
            <Box>
                <Button fontSize="sm" bg="white" borderWidth="2px" textColor="#970bf5" borderColor="#970bf5" mr={4} w="6rem" rounded="90" _hover={{ bg: "#970bf5", color:"white"}}>
                    <Link href="/login" style={{textDecoration:'none'}}>Login</Link>
                </Button>
                {/* <Button fontSize="sm" bg="#970bf5" textColor="white" w="6rem" rounded="90" _hover={{ bg: "#bb88f9"}}>Sign up</Button> */}
            </Box>
        </Flex>
    ):
    (
        // Logged in
        <Flex bg="white" shadow="base" p={4} align="center" justify="space-between">
            <Text fontSize="2xl" fontWeight="bold">USM Sports Booking</Text>
            <Flex mr={6}>
                <Text borderRightColor="#970bf5" borderRightWidth={3} pr={2}>{user.email}</Text>
                {/* <Box as="form" action="/auth/signout" method="post">
                    <Link>Logout</Link>
                </Box> */}
                <Box as="form" action="/auth/signout" method="post" ml={2}>
                    <Link as="button" type="submit">
                        Logout
                    </Link>
                </Box>
            </Flex>
        </Flex>
    )
}