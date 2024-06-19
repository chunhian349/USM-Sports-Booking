'use client'

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
        <Box position="absolute" top="0" left="0" w="full" h="full" bg="rgba(220, 220, 220, 0.5)" zIndex="0">  
          {/* Semi-transparent overlay, adjust z to cover the image but avoid to cover the menu in nav */}
        </Box>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
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

export default function ManagerClient({ 
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
                    buttonLink='/dashboard'
                />
            </Flex>
            <Flex mb={3}>
                <Text as="b" fontSize="x-large">Manage Your Sports Facilities</Text>
            </Flex>
            {(facilities.length === 0) ? (
                <Heading fontSize='2xl' fontStyle='italic' textColor='gray'>(You have not add any sports facility yet)</Heading>
            ): (
                <VStack spacing={3}>
                    {facilities.map((facility: any, index: number) => (
                        <Link key={index} href={'/edit-facility/?facility_id='+ facility.facility_id} w="full" p={4} borderWidth="1px" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }} _active={{bgColor:'gray.200'}}>
                        <Flex>
                            <Image src={facility.facility_photo} fallbackSrc='no-image.png' alt="Facility Image" w="25lvw" aspectRatio={16/9} rounded={10} mr={5}/>
                            <Flex flexDir='column' justifyContent={'flex-start'}>
                                <Text as="b" fontSize="large">{facility.facility_name}</Text>
                                <Text as="b">{facility.facility_location}</Text>
                                <Text>{facility.sports_category}</Text>
                                <Text textColor={(facility.facility_status? "green": "red")}>{(facility.facility_status? "Active": "Inactive")}</Text>
                            </Flex>
                            <Spacer />
                            <Text>
                                Rating
                                <Tag placeContent='center' ml={1} bgColor={facility.overall_rating >= 7 ? 'green' : facility.overall_rating >= 3.5 ? 'orange' : 'red'} borderRadius="full" textColor="white" w="4rem">
                                    <TagLabel>{facility.overall_rating.toFixed(1)}</TagLabel>
                                </Tag>
                            </Text>
                        </Flex>
                        </Link>
                    ))}
                </VStack>
            )}
        </Container>
    )
}