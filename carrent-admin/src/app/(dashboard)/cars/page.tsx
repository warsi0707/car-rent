import CarHome from '@/pages/CarHome'
import { getCars } from '@/server/car'

export default async function page() {
    const res = await getCars()
    return (
        <CarHome cars={res.cars} />
    )
}
