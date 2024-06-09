'use client'

import { Container, Heading, Text, Link, Button } from "@chakra-ui/react"

export default function ErrorPage({
  searchParams,
} : {
  searchParams?: {
      error: string
  }
}) {
  const errorMessage = searchParams?.error === undefined ? '' : searchParams.error
  console.log(errorMessage)

  if (errorMessage == '') {
    return (
      <Container maxW='90lvw' p={0}>
        <Heading mb={5}>Error</Heading>
        <Text mb={3}>Sorry, something went wrong</Text>
        <Button><Link style={{textDecoration: 'none'}}>Back to homepage</Link></Button>
      </Container>
    )
  }
  
  return (
    <Container maxW='90lvw' p={0}>
        <Heading mb={5}>Error</Heading>
        <Text mb={3}>Error message: {errorMessage}</Text>
        <Button><Link href="/" style={{textDecoration: 'none'}}>Back to homepage</Link></Button>
      </Container>
  )
}