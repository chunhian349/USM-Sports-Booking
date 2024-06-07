'use client'

import { Center, Container, Flex, Heading, Spacer, Text, VStack, Box, Tag, TagLabel } from "@chakra-ui/react"

export default function FacilityReviews({
    reviewData, overall_rating
}: {
    reviewData: { review_id: string, review_rating: number, review_comment: string, review_created_at: string }[],
    overall_rating: number
}) {

    return (
        <Container maxWidth="90lvw" mt={5}>
            <Flex mb={5}>
                <Heading>Reviews</Heading>
                <Spacer />
                <Center>
                    <Text fontWeight='bold' fontSize='lg' mr={2}>Overall Rating:</Text>
                    <Tag placeContent='center' bgColor={overall_rating >= 7 ? 'green' : overall_rating >= 3.5 ? 'orange' : 'red'} textColor="white" size='lg'>
                        <TagLabel>{overall_rating.toFixed(1)}</TagLabel>
                    </Tag>
                </Center>
            </Flex>

            {reviewData.length === 0 ? (
                <Text h="10lvh" fontStyle='italic' fontSize='lg' textColor='gray'>(No reviews available)</Text>
            ) : (
                <VStack align="start" h="50lvh" overflow="scroll">
                {
                    reviewData.map((review, index) => {
                        return (
                            <Box key={index} borderColor={"grey"} borderWidth={1} boxShadow={"lg"} p={3} w="100%" rounded="10">
                                <Text fontWeight='bold'>Rating: {review.review_rating}</Text>
                                {
                                    review.review_comment ? 
                                    <Text whiteSpace='pre'>{review.review_comment}</Text> : 
                                    <Text fontStyle='italic' textColor='gray'>(This comment is empty)</Text>
                                }
                                <Text textColor='gray' fontSize='small'>{(new Date(review.review_created_at)).toLocaleString('en-MY')}</Text>
                            </Box>
                        )
                    })
                }
                </VStack>
            )}
            
        </Container>
    )
}