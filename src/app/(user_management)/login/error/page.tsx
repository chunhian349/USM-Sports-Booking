'use client' // Error components must be Client Components
 
import { Button, Heading, Link, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
 
export default function Error({
    searchParams, 
} : {
    searchParams?: {
        error_message: string
    }
}) {
//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error(error)
//   }, [error])
 
  return (
    <>
      <Text>Error during login: {searchParams?.error_message}</Text>
      <Button>
        <Link href='/login'>
            Try again
        </Link>
      </Button>
    </>
  )
}