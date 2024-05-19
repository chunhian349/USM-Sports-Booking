'use client'
import { Container, Flex, Box, Spacer, Text, Link, Stack } from "@chakra-ui/react"

export default function Footer() {
    return (
        <Stack 
            as="footer"
            bg="white"
            justifyContent="space-between"
            py={2}
            shadow='xs'
            spacing='10px'
            borderWidth={0}
            borderColor='gray.300'
            h='5svh'
        >
            <Box ml="5svw">
                <Text>USM Sport Booking © 2024</Text>
            </Box>
        </Stack>
    )
}