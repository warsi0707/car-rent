'use client'

import CarInput from "@/components/CarInput";
import { createCar } from "@/server/car";
import { useRouter } from "next/navigation";
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
  currency: '',
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

export default function page() {
  const router = useRouter()
  const [carData, setCarData] = useState(initialCarData)
  const [countryid, setCountryid] = useState(0)
  const [stateid, setStateid] = useState(0)
  const [cityid, setCityid] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['year', 'seats', 'doors', 'mileageKm', 'pricePerDay'];
    
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

  useEffect(()=>{
    if(!carData.name) return;
    const slug = carData.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setCarData(prev=>({
      ...prev,
      slug
    }))
  },[carData.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!carData.slug) {
      toast.error("Please enter a car name (slug is auto-generated)");
      return;
    }
    if (carData.year < 1980) {
      toast.error("Year must be 1980 or later");
      return;
    }
    if (!carData.name || !carData.brand || !carData.model) {
      toast.error("Please fill in Name, Brand, and Model");
      return;
    }
    
    try {
      console.log("Submitting car data:", carData);
      const res = await createCar(carData);
      console.log("Car created:", res);
      if(res && res.success){
        setCarData(initialCarData) // Reset form after successful creation
        router.push('/cars')
        toast.success(res.message || "Car created successfully")
      }else{
        toast.error(res.message || "Failed to create car")
      }
    } catch (error) {
      console.error("Error creating car:", error);
      toast.error("Error creating car")
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create Car</h1>
          <p className="text-sm text-slate-600">
            Add a new vehicle to your fleet with complete details and pricing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Save Car
          </button>
        </div>
      </div>

      <div id="create-car-form" className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
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
                  
                </select>
              </div>
            </div>
          </section>

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
                  style={{
                    border: "10px"
                  }}
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

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Media</h2>
            <p className="mt-1 text-sm text-slate-500">Add images and highlight features.</p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image URLs</label>
                <textarea
                value={carData.images}
                onChange={handleChange}
                name="images"
                  rows={4}
                  placeholder="Paste image URLs separated by commas"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Features</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Sunroof, Bluetooth, Rear camera"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
          </section>

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
              
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
