'use client'

import { type User } from '@supabase/supabase-js'
import { Heading, Container, Image, Box, Text, Button, Center, Flex, Spacer, Link, VStack, Tag, TagLabel } from "@chakra-ui/react"

// Custom component that displays an image with text and a button
const ImageWithTextAndButton = ({ imageUrl, heading, buttonText, buttonLink }: { imageUrl: string, heading: string, buttonText: string, buttonLink: string }) => {
    return (
      <Box position="relative" overflow="hidden" maxW="42.5lvw" rounded={10}>
        <Image
          src={imageUrl}
          alt="Homepage Image"
          objectFit="cover"
          zIndex="-1" // Place image behind content
          aspectRatio={16 / 9}
        />
        <Box position="absolute" top="0" left="0" w="full" h="full" bg="rgba(220, 220, 220, 0.5)" zIndex="1">  
          {/* Semi-transparent overlay */}
        </Box>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="2">
            <Center>
            <Heading as="h2" size="lg" color="black" mb={4}>
                {heading}
            </Heading>
            </Center>
            <Center>
            <Link href={buttonLink}>
                <Button bg="#970bf5" variant="solid" color="white" _hover={{ bg: "#7a00cc", color:"white"}}>
                    {buttonText}
                </Button>
            </Link>
            </Center>
        </Box>
      </Box>
    )
}

// Custom component that displays a sports facility card
// const FacilityCard = (
//         key: any, 
//         image_url: string,
//         facility_name: string,
//         facility_location: string,
//         sports_category: string,
//         facility_status: string,
//         overall_rating: number
//     ) => {
//     return (
//         <Box w="full" p={4} borderWidth="1px" rounded="md">
//             <Image src={image_url} fallbackSrc='no-image.png' alt="Facility Image" />
//             <Text as="b" fontSize="large">{facility_name}</Text>
//             <Text as="b">{facility_location}</Text>
//             <Text>{sports_category}</Text>
//             <Text textColor={(facility_status? "green": "red")}>{facility_status}</Text>
//         </Box>
//     )
// }

export default function ManagerClient(/*{ user }: { user: User }, */{ facilities }: { facilities: any[] }) {
    //console.log(facilities)
    return (
        <Container maxW="90lvw" mt={5}>
            <Flex mb={5}>
                <ImageWithTextAndButton 
                    imageUrl='/sports-facilities.jpg'
                    heading='Facility Management'
                    buttonText='Add New Sports Facility'
                    buttonLink='/add-facility'
                />
                <Spacer />
                <ImageWithTextAndButton 
                    imageUrl='/dashboard.jpg'
                    heading='Analytics Dashboard'
                    buttonText='View Analytics Dashboard' 
                    buttonLink='/'
                />
            </Flex>
            <Flex mb={3}>
                <Text as="b" fontSize="x-large">Manage Your Sports Facilities</Text>
            </Flex>
            <VStack spacing={3}>
                {facilities.map((facility: any, index: number) => (
                    <Link key={index} href={'/edit-facility/?facility_id='+ facility.facility_id} w="full" p={4} borderWidth="1px" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }}>
                    <Flex>
                        <Image src={facility.image_url} fallbackSrc='no-image.png' alt="Facility Image" w="25lvw" aspectRatio={16/9} rounded={10} mr={5}/>
                        <Flex flexDir='column' justifyContent={'flex-start'}>
                            <Text as="b" fontSize="large">{facility.facility_name}</Text>
                            <Text as="b">{facility.facility_location}</Text>
                            <Text>{facility.sports_category}</Text>
                            <Text textColor={(facility.facility_status? "green": "red")}>{(facility.facility_status? "Active": "Inactive")}</Text>
                        </Flex>
                        <Spacer />
                        <Text>Rating<Tag placeContent='center' ml={1} bgColor='#970bf5' borderRadius="full" textColor="white" w="4rem"><TagLabel>{facility.overall_rating == null? "n/a" : facility.overall_rating}</TagLabel></Tag></Text>
                    </Flex>
                    </Link>
                ))}
            </VStack>
        </Container>
    )
}