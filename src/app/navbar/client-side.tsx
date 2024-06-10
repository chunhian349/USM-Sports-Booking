'use client'

import { Box, Flex, Text, Button, Link, Container, Menu, MenuList, MenuButton, MenuItem, Heading, Spacer, ButtonGroup } from '@chakra-ui/react'

export default function NavAction({user_id, user_email, user_type} : {user_id: string, user_email: string, user_type : string }) {
    
    // Not logged in
    if (user_id == '') {
        return (
            <Flex bg="gray.200" shadow="base" h="10svh" alignItems='center'>
                <Heading ml='5.5lvw' fontSize={{sm:"md", md: "2xl", lg:"4xl",}}>
                    <Link href='/' style={{textDecoration:'none'}}>USM Sports Booking</Link>
                </Heading>
                <Spacer />
                <ButtonGroup gap={2} mr='5.5lvw'>
                    <Button fontSize="md" bg="#970bf5" textColor="white" borderWidth={2} borderColor="#970bf5" w="6rem" rounded="20" _hover={{ bg: "#7808c4"}} _active={{bg: '#5a0693'}} >
                        <Link href="/login" style={{textDecoration:'none'}}>Login</Link>
                    </Button>
                    <Button fontSize="md" bg="white" textColor="#970bf5" borderWidth={2} borderColor="#970bf5" w="6rem" rounded="20" _hover={{ bg: "#970bf5", color:"white"}} _active={{bg: 'white', color:"#970bf5"}}>
                    <Link href="/register" style={{textDecoration:'none'}}>Register</Link>
                    </Button>
                </ButtonGroup>
            </Flex>
        )
    }

    // Logged in 
    return (
        <Flex bg="gray.200" shadow="base" h="10svh" alignItems='center'>
            <Heading ml='5.5lvw' fontSize={{sm:"md", md: "2xl", lg:"4xl",}}>
                <Link href='/' style={{textDecoration:'none'}}>USM Sports Booking</Link>
            </Heading>
            <Spacer />
            <Flex mr='5.5lvw'>
                {user_type == 'admin' || user_type == 'facility manager' ? (
                    <Link href='/account' fontSize={{sm:"xs", md:"medium", lg:"large"}} borderRightColor="#970bf5" borderRightWidth={3} pr={2} style={{textDecoration:'none'}}>
                        {user_email}
                    </Link>
                ) : (
                    <Menu>
                        <MenuButton fontSize={{sm:"xs", md:"medium", lg:"large"}} borderRightColor="#970bf5" borderRightWidth={3} pr={2}>
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
                )}

                <Box as="form" action="/auth/signout" method="post" ml={2}>
                    <Link as="button" type="submit" fontSize={{sm:"xs", lg:"large"}} style={{textDecoration:'none'}}>
                        Logout
                    </Link>
                </Box>
            </Flex>
        </Flex>
    )
}