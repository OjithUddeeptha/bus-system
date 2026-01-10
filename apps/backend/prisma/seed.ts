import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const routesData = [
    { routeNumber: '001', routePath: 'Mahanuwara ↔ Colombo', startCity: 'Kandy', endCity: 'Colombo' },
    { routeNumber: '001/2', routePath: 'Warakapola ↔ Colombo', startCity: 'Warakapola', endCity: 'Colombo' },
    { routeNumber: '001/245', routePath: 'Migamuwa ↔ Mahanuwara', startCity: 'Negombo', endCity: 'Kandy' },
    { routeNumber: '001/744', routePath: 'Padiyapelella ↔ Colombo', startCity: 'Padiyapelella', endCity: 'Colombo' },
    { routeNumber: '001/744-3', routePath: 'Rikillagaskada ↔ Colombo', startCity: 'Rikillagaskada', endCity: 'Colombo' },
    { routeNumber: '001-1', routePath: 'Kegalla ↔ Colombo', startCity: 'Kegalle', endCity: 'Colombo' },
    { routeNumber: '001-1/245', routePath: 'Migamuwa ↔ Kegalla ↔ Colombo', startCity: 'Negombo', endCity: 'Colombo', stops: ['Kegalle'] },
    { routeNumber: '001-2', routePath: 'Mawanella ↔ Colombo', startCity: 'Mawanella', endCity: 'Colombo' },
    { routeNumber: '001-3', routePath: 'Warakapola ↔ Colombo', startCity: 'Warakapola', endCity: 'Colombo' },
    { routeNumber: '001-4', routePath: 'Galapitimada ↔ Colombo', startCity: 'Galapitimada', endCity: 'Colombo' },
    { routeNumber: '002', routePath: 'Colombo ↔ Matara', startCity: 'Colombo', endCity: 'Matara' },
    { routeNumber: '002/1', routePath: 'Mahanuwara ↔ Matara', startCity: 'Kandy', endCity: 'Matara' },
    { routeNumber: '002/17', routePath: 'Gampaha ↔ Katunayaka ↔ Matara', startCity: 'Gampaha', endCity: 'Matara', stops: ['Katunayake'] },
    { routeNumber: '002/187', routePath: 'Matara ↔ Matara (Loop)', startCity: 'Matara', endCity: 'Matara', description: 'Loop / Variant' },
    { routeNumber: '002/353', routePath: 'Panakaduwa ↔ Colombo', startCity: 'Panakaduwa', endCity: 'Colombo' },
    { routeNumber: '002/368', routePath: 'Colombo ↔ Urubokka', startCity: 'Colombo', endCity: 'Urubokka' },
    { routeNumber: '002/4-3', routePath: 'Anuradhapura ↔ Matara', startCity: 'Anuradhapura', endCity: 'Matara' },
    { routeNumber: '002/48', routePath: 'Kaduruwela ↔ Matara', startCity: 'Kaduruwela', endCity: 'Matara' },
    { routeNumber: '002/8', routePath: 'Matale ↔ Matara', startCity: 'Matale', endCity: 'Matara' },
    { routeNumber: '002-1', routePath: 'Colombo ↔ Galle', startCity: 'Colombo', endCity: 'Galle' },
    { routeNumber: '002-10', routePath: 'Deyiyandara ↔ Colombo', startCity: 'Deyiyandara', endCity: 'Colombo' },
    { routeNumber: '002-11', routePath: 'Deyiyandara ↔ Colombo (Variant)', startCity: 'Deyiyandara', endCity: 'Colombo' },
    { routeNumber: '002-3', routePath: 'Ambalangoda ↔ Colombo', startCity: 'Ambalangoda', endCity: 'Colombo' },
    { routeNumber: '002-4', routePath: 'Yatiyana ↔ Colombo', startCity: 'Yatiyana', endCity: 'Colombo' },
    { routeNumber: '002-6', routePath: 'Deyiyandara ↔ Colombo (Via Hakmana)', startCity: 'Deyiyandara', endCity: 'Colombo' },
    { routeNumber: '002-8', routePath: 'Mitiyagoda ↔ Colombo', startCity: 'Mitiyagoda', endCity: 'Colombo' },
    { routeNumber: '002-9', routePath: 'Deyiyandara ↔ Colombo (Express)', startCity: 'Deyiyandara', endCity: 'Colombo' },
    { routeNumber: '003', routePath: 'Colombo ↔ Embilipitiya', startCity: 'Colombo', endCity: 'Embilipitiya' },
    { routeNumber: '003_AVI', routePath: 'Colombo ↔ Avissawella', startCity: 'Colombo', endCity: 'Avissawella' },
    { routeNumber: '003/363', routePath: 'Colombo ↔ Walasmulla', startCity: 'Colombo', endCity: 'Walasmulla' },
    { routeNumber: '003/461-5', routePath: 'Colombo ↔ Kolonna', startCity: 'Colombo', endCity: 'Kolonna' },
    { routeNumber: '003/497', routePath: 'Colombo ↔ Suriyawewa', startCity: 'Colombo', endCity: 'Suriyawewa' },
    { routeNumber: '003/608', routePath: 'Colombo ↔ Panawala', startCity: 'Colombo', endCity: 'Panawala' },
    { routeNumber: '003/610', routePath: 'Colombo ↔ Urubokka', startCity: 'Colombo', endCity: 'Urubokka' },
    { routeNumber: '003-1', routePath: 'Amithirigala ↔ Colombo', startCity: 'Amithirigala', endCity: 'Colombo' },
    { routeNumber: '003-8', routePath: 'Embilipitiya ↔ Colombo', startCity: 'Embilipitiya', endCity: 'Colombo' },
    { routeNumber: '004', routePath: 'Wennappuwa ↔ Moratuwa', startCity: 'Wennappuwa', endCity: 'Moratuwa' },
    { routeNumber: '004_HAL', routePath: 'Halawatha ↔ Colombo', startCity: 'Chilaw', endCity: 'Colombo' },
    { routeNumber: '004_SEW', routePath: 'Sewanagala ↔ Colombo', startCity: 'Sewanagala', endCity: 'Colombo' },
    { routeNumber: '004_PUT', routePath: 'Puththalama ↔ Colombo', startCity: 'Puttalam', endCity: 'Colombo' },
    { routeNumber: '004_GAL', routePath: 'Galkissa ↔ Colombo', startCity: 'Mount Lavinia', endCity: 'Colombo' },
    { routeNumber: '004_ANU', routePath: 'Anuradhapura ↔ Colombo', startCity: 'Anuradhapura', endCity: 'Colombo' },
    { routeNumber: '004_ANU_MAT', routePath: 'Anuradhapura ↔ Matara', startCity: 'Anuradhapura', endCity: 'Matara', stops: ['Colombo'] },
];

async function main() {
    console.log('Seeding routes...');

    for (const route of routesData) {
        const exists = await prisma.route.findUnique({
            where: { routeNumber: route.routeNumber }
        });

        if (!exists) {
            await prisma.route.create({
                data: {
                    routeNumber: route.routeNumber,
                    routePath: route.routePath,
                    startCity: route.startCity,
                    endCity: route.endCity,
                    stops: route.stops || [],
                    distance: 100 + Math.random() * 200, // Mock distance
                    price: 300 + Math.random() * 500, // Mock price
                }
            });
            console.log(`Created route ${route.routeNumber}`);
        } else {
            // Update if exists (to apply new stops/names)
            await prisma.route.update({
                where: { routeNumber: route.routeNumber },
                data: {
                    routePath: route.routePath,
                    startCity: route.startCity,
                    endCity: route.endCity,
                    stops: route.stops || []
                }
            });
            console.log(`Updated route ${route.routeNumber}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
