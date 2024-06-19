'use client'

import { Box, Center, Container, Heading, Text, VStack, StatGroup, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, Spacer, Select, Image, HStack } from "@chakra-ui/react"
import 'chart.js/auto'
import { useState } from "react"
import { Line, Bar } from "react-chartjs-2";

function LineChart({title, label, xLabels, yData, color} : {title: string, label: string, xLabels: string[], yData: number[], color: string}) {
    const data = {
        labels: xLabels,
        datasets: [
          {
            label: label,
            data: yData,
            fill: false,
            borderColor: color,
            tension: 0.1,
          },
        ],
      };

    return (
        <Box w='48%' alignSelf='start' bg='white' p={3} rounded={5} boxShadow='lg'>
            <Text fontWeight='bold'>{title}</Text>
            <Line data={data} />
        </Box>
    )
}

function BarChart({title, label, xLabels, yData} : {title: string, label: string, xLabels: string[], yData: number[]}) {
    const data = {
        labels: xLabels,
        datasets: [
          {
            label: label,
            data: yData,
            fill: false,
            borderWidth: 2,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            tension: 0.1,
          },
        ],
      };

    return (
        <Box w='80%' alignSelf='start' bg='white' p={3} rounded={5} boxShadow='lg'>
            <Text fontWeight='bold'>{title}</Text>
            <Bar data={data} />
        </Box>
    )
}

// Dummy data for LineChart
const xLabels = ['January', 'February', 'March', 'April', 'May', 'June']
const bookings: {[facility: string]: number[]} = {
    'Kompleks Badminton': [153, 149, 180, 121, 136, 139],
    'Kompleks Sukan - Ping Pong': [78, 48, 54, 58, 72, 46],
    'Kompleks Tenis': [80, 91, 102, 109, 92, 131]
}
const sales: {[facility: string]: number[]} = {
    'Kompleks Badminton': [1750, 1625, 1920, 1468, 1500, 1575],
    'Kompleks Sukan - Ping Pong': [880, 608, 780, 622, 838, 547],
    'Kompleks Tenis': [868, 928, 1110, 1195, 913, 1278]
}
const users: {[facility: string]: number[]} = {
    'Kompleks Badminton': [65, 59, 80, 81, 56, 55],
    'Kompleks Sukan - Ping Pong': [38, 28, 36, 34, 37, 27],
    'Kompleks Tenis': [38, 39, 37, 40, 45, 43]
}

// total bookings, sales, users of all facilities per month (index 0: sum of all month, then 1: January, 2: Febuary, so on)
const totalBookings: number[] = Array(xLabels.length + 1).fill(0);
const totalSales: number[] = Array(xLabels.length + 1).fill(0);
const totalUsers: number[] = Array(xLabels.length + 1).fill(0);

for (const facility in bookings) {
    const facilityBooking = bookings[facility]
    const facilitySales = sales[facility]
    const facilityUsers = users[facility]

    for (let i = 0; i < facilityBooking.length; i++) {
        totalBookings[i + 1] += facilityBooking[i]
        totalSales[i + 1] += facilitySales[i]
        totalUsers[i + 1] += facilityUsers[i]
    }
}

for (let i = 1; i <= xLabels.length; i++) {
    totalBookings[0] += totalBookings[i]
    totalSales[0] += totalSales[i]
    totalUsers[0] += totalUsers[i]
}

const avgBookings = parseInt((totalBookings[0] / xLabels.length).toFixed(0))
const avgSales = parseFloat((totalSales[0] / xLabels.length).toFixed(2))
const avgUsers = parseInt((totalUsers[0] / xLabels.length).toFixed(0))

// Timeslot usage dummy data
const timeslotXLabels = Array(14).fill(0).map((_, i) => `${i + 8}:00`)
const bookingsPerTimeslot : {[facility: string]: number[]} = {
    'Kompleks Badminton': [108, 100, 146, 148, 104, 70, 120, 132, 136, 100, 108, 164, 168, 152],
    'Kompleks Sukan - Ping Pong': [20, 24, 30, 34, 36, 10, 28, 32, 36, 24, 16, 18, 20, 14],
    'Kompleks Tenis': [40, 56, 62, 64, 58, 16, 38, 36, 54, 52, 24, 26, 18, 16]
}

export default function FacilityDashboard() {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0)
    const [selectedFacility, setSelectedFacility] = useState('Kompleks Badminton')

    return (
        <Container maxW='100lvw' flexDir='row' px={0} bg='gray.50'>
            <Center>
            {/* <Heading mt={3}>Dashboard</Heading> */}
            <VStack spacing={5} alignSelf='center' w='90%' my={3}>
                <Box position="relative" overflow="hidden" w="100%" maxH="30lvh" rounded={10} mt={3}>
                    <Image
                        src={'/dashboard.jpg'}
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
                    <Box position="absolute" top="0" left="0" w="full" h="full" bg="rgba(0, 0, 0, 0.4)" zIndex="0">  
                    {/* Semi-transparent overlay, adjust z to cover the image but avoid to cover the menu in nav */}
                    </Box>
                    <Box position="absolute" top="50%" left="50%" w="80%" transform="translate(-50%, -50%)">
                        <Center>
                        <Heading size="2xl" color="White" mb={8}>
                            Sports Facilities Dashboard
                        </Heading>
                        </Center>
                        <Center>
                            <Text color="White" fontSize="large">
                                View the overview of the sports facilities, bookings, sales and users.
                            </Text>
                        </Center>
                    </Box>
                </Box>

                <Flex w='100%'>
                    <Text fontWeight='bold' fontSize='2xl'>Overview</Text>
                    <Spacer />
                    <Box>
                        <Select variant="outline" bg='white' borderColor='gray.400' onChange={(e)=>setSelectedMonthIndex(parseInt(e.currentTarget.value))}>
                            <option value={0}>All</option>
                            <option value={6}>June</option>
                            <option value={5}>May</option>
                            <option value={4}>April</option>
                            <option value={3}>March</option>
                            <option value={2}>February</option>
                            <option value={1}>January</option>
                        </Select>
                    </Box>
                </Flex>

                <StatGroup w="100%" gap={3} textAlign='start'>
                    <Stat py={2} px={4} borderBottomWidth={3} borderColor="blue.300" boxShadow="lg" rounded={10} bg='white'>
                        <StatLabel>Number of Bookings</StatLabel>
                        <StatNumber>{totalBookings[selectedMonthIndex]}</StatNumber>
                        <StatHelpText>
                            {
                                (selectedMonthIndex == 0) ? null : 
                                <StatArrow type={totalBookings[selectedMonthIndex] > avgBookings ? "increase" : "decrease"} />
                            }
                            Average: {avgBookings}
                        </StatHelpText>
                    </Stat>

                    <Stat py={2} px={4} borderBottomWidth={3} borderColor="orange.300" boxShadow="lg" rounded={10} bg='white'>
                        <StatLabel>Sales (RM)</StatLabel>
                        <StatNumber>{totalSales[selectedMonthIndex]}</StatNumber>
                        <StatHelpText>
                            {
                                (selectedMonthIndex == 0) ? null : 
                                <StatArrow type={totalSales[selectedMonthIndex] > avgSales ? "increase" : "decrease"} />
                            }
                            Average: {avgSales}
                        </StatHelpText>
                    </Stat>

                    <Stat py={2} px={4} borderBottomWidth={3} borderColor="green.300" boxShadow="lg" rounded={10} bg='white'>
                        <StatLabel>Number of Users</StatLabel>
                        <StatNumber>{totalUsers[selectedMonthIndex]}</StatNumber>
                        <StatHelpText>
                            {
                                (selectedMonthIndex == 0) ? null : 
                                <StatArrow type={totalUsers[selectedMonthIndex] > avgBookings ? "increase" : "decrease"} />
                            }
                            Average: {avgUsers}
                        </StatHelpText>
                    </Stat>
                </StatGroup>

                <HStack alignSelf='start' spacing={5}>
                    <Text fontWeight='bold' fontSize='xl' whiteSpace='nowrap'>Sports Facilities:</Text>
                    <Select variant="outline" bg='white' borderColor='gray.400' onChange={(e)=>setSelectedFacility(e.currentTarget.value)}>
                        <option value='Kompleks Badminton'>Kompleks Badminton</option>
                        <option value='Kompleks Sukan - Ping Pong'>Kompleks Sukan - Ping Pong</option>
                        <option value='Kompleks Tenis'>Kompleks Tenis</option>
                    </Select>
                </HStack>

                <Flex w='100%'>
                    <LineChart title="Monthly Bookings" label="Number of Booking" color="blue" xLabels={xLabels} yData={bookings[selectedFacility]}/>
                    <Spacer />
                    <LineChart title="Monthly Sales" label="Sales (RM)" color="orange" xLabels={xLabels} yData={sales[selectedFacility]} />
                </Flex>

                <Center w='100%'>
                    <LineChart title="Monthly Users" label="Number of Users" color="green" xLabels={xLabels} yData={users[selectedFacility]} />
                </Center>
                
                <Center w='100%'>
                    <BarChart title="Timeslot Usage" label="Number of Booking" xLabels={timeslotXLabels} yData={bookingsPerTimeslot[selectedFacility]} />
                </Center>

            </VStack>
            </Center>
        </Container>
    )
}