'use client'

import { Heading, Container, Image, Box, Text, Center, Flex, Spacer, Link, VStack, Tag, TagLabel } from "@chakra-ui/react"

// Custom component that displays an image with text and a button
const ImageWithTextAndButton = ({ imageUrl, heading, text}: { imageUrl: string, heading: string, text: string }) => {
    return (
      <Box position="relative" overflow="hidden" w="100%" maxH="50lvh" rounded={10}>
        <Image
            src={imageUrl}
            alt="Homepage Image"
            objectFit="cover"
            zIndex="-1"
            w="100%" 
            h="130%"
            // position="absolute"
            // top="50%"
            // left="50%"
             transform="translate(0, -20%)"
            aspectRatio={16 / 9}
        />
        <Box position="absolute" top="0" left="0" w="full" h="full" bg="rgba(0, 0, 0, 0.5)" zIndex="0">  
          {/* Semi-transparent overlay, adjust z to cover the image but avoid to cover the menu in nav */}
        </Box>
        <Box position="absolute" top="50%" left="50%" w="80%" transform="translate(-50%, -50%)">
            <Center>
            <Heading size="2xl" color="White" mb={8}>
                {heading}
            </Heading>
            </Center>
            <Center>
                <Text color="White" fontSize="large">
                    {text}
                </Text>
            </Center>
        </Box>
      </Box>
    )
}

export default function UserClient({ 
    facilities 
}: { 
    facilities: {
        facility_id: string;
        facility_photo: string;
        facility_name: string;
        facility_location: string;
        sports_category: string;
        facility_status: boolean;
        overall_rating: number;
    }[]
}) {
    //console.log(facilities)
    return (
        <Container maxW="90lvw" mt={5}>
            <Flex mb={5}>
                <ImageWithTextAndButton 
                    imageUrl='/userpage-image.jpg'
                    heading='Welcome to USM Sports Booking'
                    text='Find your perfect sports spot on USM!'
                />
                <Spacer />
            </Flex>
            <Flex mb={3}>
                <Text as="b" fontSize="x-large">Sports Facilities</Text>
            </Flex>
            <VStack spacing={3}>
                {facilities.map((facility: any, index: number) => (
                    <Link key={index} href={'/facility?facility_id='+facility.facility_id} w="full" p={4} borderWidth="1px" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }}>
                    <Flex>
                        <Image src={facility.facility_photo} fallbackSrc='no-image.png' alt="Facility Image" w="25lvw" aspectRatio={16/9} rounded={10} mr={5}/>
                        <Flex flexDir='column' justifyContent={'flex-start'}>
                            <Text as="b" fontSize="large">{facility.facility_name}</Text>
                            <Text as="b">{facility.facility_location}</Text>
                            <Text>{facility.sports_category}</Text>
                            <Text textColor={(facility.facility_status? "green": "red")}>{(facility.facility_status? "Active": "Inactive")}</Text>
                        </Flex>
                        <Spacer />
                        <Text>Rating<Tag placeContent='center' ml={1} bgColor={facility.overall_rating >= 7 ? 'green' : facility.overall_rating >= 3.5 ? 'orange' : 'red'} borderRadius="full" textColor="white" w="4rem"><TagLabel>{facility.overall_rating.toFixed(1)}</TagLabel></Tag></Text>
                    </Flex>
                    </Link>
                ))}
            </VStack>
        </Container>
    )
}