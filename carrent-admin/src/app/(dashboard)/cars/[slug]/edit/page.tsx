'use client'

import CarInput from "@/components/CarInput";
import { getCar, updateCar } from "@/server/car";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";

const initialCarData = {
  name: '',
  slug: '',
  brand: '',
  model: '',
  year: 0,
  category: '',
  fuelType: '',
  transmission: '',
  seats: 0,
  doors: 0,
  color: '',
  mileageKm: 0,
  pricePerDay: 0,
  currency: 'INR',
  location: {
    city: '',
    state: '',
    country: '',
    addressLine: '',
    latitude: 0,
    longitude: 0,
  },
  features: [],
  images: [],
  description: '',
  status: 'available',
  isActive: true,
} 

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  const [carData, setCarData] = useState(initialCarData)
  const [countryid, setCountryid] = useState(0)
  const [stateid, setStateid] = useState(0)
  const [cityid, setCityid] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isModified, setIsModified] = useState(false)

  // Fetch car data on mount
  useEffect(() => {
    if (!slug) return;

    const fetchCar = async () => {
      try {
        setLoading(true)
        const res = await getCar(slug)
        console.log(res)
        if (res?.car) {
          const car = res.car
          setCarData({
            name: car.name || '',
            slug: car.slug || '',
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || 0,
            category: car.category || '',
            fuelType: car.fuelType || '',
            transmission: car.transmission || '',
            seats: car.seats || 0,
            doors: car.doors || 0,
            color: car.color || '',
            mileageKm: car.mileageKm || 0,
            pricePerDay: car.pricePerDay || 0,
            currency: car.currency || 'INR',
            location: {
              city: car.location?.city || '',
              state: car.location?.state || '',
              country: car.location?.country || '',
              addressLine: car.location?.addressLine || '',
              latitude: car.location?.lat || 0,
              longitude: car.location?.lng || 0,
            },
            features: car.features || [],
            images: car.images || [],
            description: car.description || '',
            status: car.status || 'available',
            isActive: car.isActive !== undefined ? car.isActive : true,
          })
        } else {
          toast.error('Car not found')
        }
      } catch (error) {
        console.error('Error fetching car:', error)
        toast.error('Failed to load car details')
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['year', 'seats', 'doors', 'mileageKm', 'pricePerDay'];
    
    setIsModified(true)

    if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1];
      const numericLocationFields = ['latitude', 'longitude'];
      const parsedValue = numericLocationFields.includes(locationKey) ? parseFloat(value) || 0 : value;
      setCarData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationKey]: parsedValue,
        }
      }))
    } else if (name === 'features' || name === 'images') {
      setCarData(prev => ({
        ...prev,
        [name]: value.split(',').map((item: string) => item.trim()),
      }))
    } else if (name === 'isActive') {
      setCarData(prev => ({
        ...prev,
        isActive: (e.target as HTMLInputElement).checked,
      }))
    } else if (numericFields.includes(name)) {
      setCarData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }))
    } else {
      setCarData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!carData.name || !carData.brand || !carData.model) {
      toast.error("Please fill in Name, Brand, and Model");
      return;
    }
    if (carData.year < 1980) {
      toast.error("Year must be 1980 or later");
      return;
    }
    
    try {
      setSubmitting(true)
      console.log("Updating car data:", carData);
      const res = await updateCar(slug, carData);
      console.log("Car updated:", res);
      if(res && res.success){
        setIsModified(false)
        toast.success(res.message || "Car updated successfully")
        router.push(`/cars/${slug}`)
      }else{
        toast.error(res?.message || "Failed to update car")
      }
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error("Error updating car")
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          </div>
          <p className="text-sm font-medium text-slate-600">Loading car details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Car</h1>
          <p className="mt-1 text-sm text-slate-600">
            Update vehicle details, pricing, and availability information.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(`/cars/${slug}`)}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !isModified}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
              submitting || !isModified
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {isModified && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>}
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div id="edit-car-form" className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Column - Main Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
            <p className="mt-1 text-sm text-slate-500">Core details for identifying the car.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <CarInput
                name="name"
                type="text"
                placeholder="Honda City ZX"
                lable="Car name"
                value={carData.name}
                onChange={handleChange}
              />
              <CarInput
                name="slug"
                type="text"
                placeholder="slug-slug"
                lable="Slug"
                value={carData.slug}
                onChange={handleChange}
              />
              <CarInput
                name="brand"
                type="text"
                placeholder="Honda"
                lable="Brand"
                value={carData.brand}
                onChange={handleChange}
              />
              <CarInput
                name="model"
                type="text"
                placeholder="City"
                lable="Model"
                value={carData.model}
                onChange={handleChange}
              />
              <CarInput
                name="year"
                type="number"
                placeholder="2024"
                lable="Year"
                value={carData.year}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select name="category" value={carData.category} onChange={handleChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                  <option value="">Select category</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="muv">MUV</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                  <option value="van">Van</option>
                  <option value="pickup">Pickup</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>
          </section>

          {/* Specs & Performance */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Specs & Performance</h2>
            <p className="mt-1 text-sm text-slate-500">Technical details for the listing.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Fuel type</label>
                <select name="fuelType" value={carData.fuelType} onChange={handleChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                  <option value="">Select fuel</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="lpg">LPG</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Transmission</label>
                <select name="transmission" value={carData.transmission} onChange={handleChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                  <option value="">Select transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <CarInput
                name="seats"
                type="number"
                placeholder="5"
                lable="Seats"
                value={carData.seats}
                onChange={handleChange}
              />
              <CarInput
                name="doors"
                type="number"
                placeholder="4"
                lable="Doors"
                value={carData.doors}
                onChange={handleChange}
              />
              <CarInput
                name="color"
                type="text"
                placeholder="White"
                lable="Color"
                value={carData.color}
                onChange={handleChange}
              />
              <CarInput
                name="mileageKm"
                type="number"
                placeholder="12000"
                lable="Mileage (km)"
                value={carData?.mileageKm}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
            <p className="mt-1 text-sm text-slate-500">Set rental price and currency.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <CarInput
                name="pricePerDay"
                type="number"
                placeholder="3000"
                lable="Price per day"
                value={carData.pricePerDay}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Currency</label>
                <select name="currency" value={carData.currency} onChange={handleChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Location</h2>
            <p className="mt-1 text-sm text-slate-500">Where the car is available.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Country</label>
                <CountrySelect
                  value={countryid}
                  onChange={(e: any) => {
                    const countryName = e.name;
                    setCountryid(e.id);
                    setStateid(0);
                    setCityid(0);
                    setIsModified(true)
                    setCarData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        country: countryName,
                        state: '',
                        city: '',
                      }
                    }))
                  }}
                  placeHolder="Select a country"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">State</label>
                <StateSelect
                  countryid={countryid}
                  value={stateid}
                  onChange={(e: any) => {
                    const stateName = e.name;
                    setStateid(e.id);
                    setCityid(0);
                    setIsModified(true)
                    setCarData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        state: stateName,
                        city: '',
                      }
                    }))
                  }}
                  placeHolder="Select a state"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City</label>
                <CitySelect
                  countryid={countryid}
                  stateid={stateid}
                  value={cityid}
                  onChange={(e: any) => {
                    const cityName = e.name;
                    setCityid(e.id);
                    setIsModified(true)
                    setCarData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        city: cityName,
                      }
                    }))
                  }}
                  placeHolder="Select a city"
                />
              </div>

              <CarInput
                name="location.addressLine"
                type="text"
                placeholder="123 Main Street"
                lable="Address"
                value={carData.location.addressLine}
                onChange={handleChange}
              />
              <CarInput
                name="location.latitude"
                type="text"
                placeholder="19.0760"
                lable="Latitude"
                value={carData.location.latitude}
                onChange={handleChange}
              />
              <CarInput
                name="location.longitude"
                type="text"
                placeholder="72.8777"
                lable="Longitude"
                value={carData.location.longitude}
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Media */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Media</h2>
            <p className="mt-1 text-sm text-slate-500">Add images and highlight features.</p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image URLs</label>
                <textarea
                  value={typeof carData.images === 'string' ? carData.images : carData.images.join(', ')}
                  onChange={handleChange}
                  name="images"
                  rows={4}
                  placeholder="Paste image URLs separated by commas"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              {Array.isArray(carData.images) && carData.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">Image Preview:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {carData.images.slice(0, 4).map((img: string, idx: number) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                        <img src={img} alt={`Car ${idx + 1}`} className="h-full w-full object-cover" onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Features</label>
                <textarea
                  value={typeof carData.features === 'string' ? carData.features : carData.features.join(', ')}
                  onChange={handleChange}
                  name="features"
                  rows={4}
                  placeholder="e.g. Sunroof, Bluetooth, Rear camera"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                value={carData.description}
                onChange={handleChange}
                name="description"
                rows={5}
                placeholder="Share any extra details about the car."
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </section>

          {/* Status */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Status</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Availability</label>
                <select name="status" value={carData.status} onChange={handleChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={carData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                />
                <label htmlFor="isActive" className="cursor-pointer text-sm font-medium text-slate-700">
                  Active on platform
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
