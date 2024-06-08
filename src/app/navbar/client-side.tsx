'use client'

import { Box, Flex, Text, Button, Link, Container, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'

export default function NavAction({user_id, user_email, user_type} : {user_id: string, user_email: string, user_type : string }) {
    
    // Not logged in
    if (user_id == '') {
        return (
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
        )
    }

    // Facility Manager or Admin Navbar
    if (user_type == 'facility manager' || user_type == 'admin') {
        return (
            <Flex bg="white" shadow="base" p={4} align="center" justify="space-between" h="10svh">
                <Link href='/' fontWeight="bold" style={{textDecoration:'none'}} ml="4lvw">
                    <Text fontSize={{sm:"xs", lg:"2rem"}}>USM Sports Booking</Text>
                </Link>
                <Flex mr="4lvw">
                    <Text borderRightColor="#970bf5" borderRightWidth={3} pr={2} fontSize={{sm:"xs", lg:"large"}}>
                        <Link href='/account' style={{textDecoration:'none'}}>
                            {user_email}
                        </Link>
                    </Text>
                    <Box as="form" action="/auth/signout" method="post" ml={2}>
                        <Link as="button" type="submit" fontSize={{sm:"xs", lg:"large"}} style={{textDecoration:'none'}}>
                            Logout
                        </Link>
                    </Box>
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex bg="white" shadow="base" p={4} align="center" justify="space-between" h="10svh">
            <Link href='/' fontWeight="bold" style={{textDecoration:'none'}} ml="4lvw">
                <Text fontSize={{sm:"xs", lg:"2rem"}}>USM Sports Booking</Text>
            </Link>
            <Flex mr="4lvw">
                <Menu>
                    <MenuButton fontSize={{sm:"xs", lg:"large"}} borderRightColor="#970bf5" borderRightWidth={3} pr={2}>
                        {user_email}
                    </MenuButton>
                    <MenuList bg='white'>
                        <Link href='/account' style={{textDecoration:'none'}}>
                            <MenuItem>
                                Profile
                            </MenuItem>
                        </Link>
                        <Link href='/booking_history' style={{textDecoration:'none'}}>
                            <MenuItem>
                                Bookings History
                            </MenuItem>
                        </Link>
                        <Link href='/report_issue' textColor='red' style={{textDecoration:'none'}}>
                            <MenuItem>
                                Report Issue
                            </MenuItem>
                        </Link>
                    </MenuList>
                </Menu>
                <Box as="form" action="/auth/signout" method="post" ml={2}>
                    <Link as="button" type="submit" fontSize={{sm:"xs", lg:"large"}} style={{textDecoration:'none'}}>
                        Logout
                    </Link>
                </Box>
            </Flex>
        </Flex>
    )
}