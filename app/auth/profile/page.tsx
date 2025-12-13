"use client";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

// --- ID types ---
type IdCardType = 'AADHAR' | 'PAN' | 'PASSPORT' | '';

// --- Indian State/District data ---
import { data } from "@/Data/India-State-District";

interface DistrictData {
    SNo: number;
    StateCode: number;
    StateName: string;
    DistrictLGDCode: number;
    "DistrictName(InEnglish)": string;
    Hierarchy: string;
    ShortNameOfDistrict: string;
}

interface PayloadData {
    fullName: string | FormDataEntryValue | null;
    email: string | FormDataEntryValue | null;
    phone: string | FormDataEntryValue | null;
    gender: string | FormDataEntryValue | null;
    dateOfBirth: string | FormDataEntryValue | null;
    addressLine1: string | FormDataEntryValue | null;
    addressLine2: string | FormDataEntryValue | null;
    city: string | FormDataEntryValue | null;
    state: string | FormDataEntryValue | null;
    pincode: string | FormDataEntryValue | null;
    idType: string | FormDataEntryValue | null;
    idNumber: string | FormDataEntryValue | null;
    kycVerified?: boolean;
}

type StatesMap = Record<string, string[]>;

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();

    // --- Form states ---
    const [loading, setLoading] = useState(false);
    const [selectedIdType, setSelectedIdType] = useState<IdCardType>('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [kycVerified, setKycVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [selectedIdNumber, setSelectedIdNumber] = useState("");


    // --- Wait for Clerk user ---

    const defaultFullName = user?.fullName || "";
    const defaultEmail = user?.primaryEmailAddress?.emailAddress || "";
    const defaultPhone = user?.primaryPhoneNumber?.phoneNumber || "";

    // --- Prepare state -> district mapping ---
    const statesMap: StatesMap = useMemo(() => {
        const map: StatesMap = {};
        (data as DistrictData[]).forEach(item => {
            const stateName = item.StateName;
            const districtName = item["DistrictName(InEnglish)"];
            if (!map[stateName]) map[stateName] = [];
            if (!map[stateName].includes(districtName)) map[stateName].push(districtName);
        });
        return map;
    }, []);
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }



    const availableCities = selectedState ? statesMap[selectedState] || [] : [];

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedCity('');
    };
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value);

    // --- Simulate OTP verification for KYC ---
    const handleKycVerify = () => {
        if (!selectedIdType || !user) {
            toast.error("Please select ID type and enter your details first.");
            return;
        }
        // Simulate sending OTP
        setOtpSent(true);
        toast.success("OTP sent to your registered email/phone (simulate)");
    };
    const handelResendOTP = () => {
        toast.success("OTP Resend Successfully!");
    }
    const handleOtpSubmit = () => {
        if (otpCode === "123456") { // Simulated OTP
            setKycVerified(true);
            toast.success("KYC Verified Successfully!");
        } else {
            toast.error("Invalid OTP. Try again.");
        }
    };

    // --- Form submit ---
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!kycVerified) {
            toast.error("Please verify your KYC before submitting the form.");
            return;
        }

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const getValue = (name: string) => formData.get(name);

        const payload: PayloadData = {
            fullName: getValue('fullName'),
            email: getValue('email'),
            phone: getValue('phone'),
            gender: getValue('gender'),
            dateOfBirth: getValue('dateOfBirth'),
            addressLine1: getValue('addressLine1'),
            addressLine2: getValue('addressLine2'),
            city: selectedCity,
            state: selectedState,
            pincode: getValue('pincode'),
            idType: getValue('idType'),
            idNumber: getValue('idNumber'),
            kycVerified,
        };

        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(`Profile save failed: ${errorData.message || res.statusText}`);
                setLoading(false);
                return;
            }

            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error("Unexpected error occurred.");
            setLoading(false);
        }
    }

    const inputClasses = "p-3 border border-gray-300 text-sm rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150";
    const buttonBaseClasses = "p-3 rounded-lg text-white font-semibold transition duration-300";

    return (
        <div className="p-10 max-w-3xl mx-auto -my-5 sm:my-10 shadow-xl rounded-xl bg-white">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2 w-full ">
                <div className="flex justify-between items-center  w-full">
                    <Image src="/irctc_logo_2.png" alt="govt logo" width={1980} height={230} className="w-[6vh] relative  sm:static  sm:w-[8vh] sm:h-[8vh]" />
                    { }
                    <Image src="/logo3.png" alt="govt logo" width={1980} height={230} className="w-[4vh] h-[6vh] bg-amber-300" />
                </div>
                <span className="text-[3.2vh] sm:text-3xl">Complete Your Profile Setup</span>
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">Fields marked with (*) are required.</p>

            <form onSubmit={handleSubmit} className="grid gap-8">
                {/* BASIC INFO */}
                <section>
                    <h3 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-500 pb-2 mb-4">Basic Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input className={inputClasses} name="fullName" placeholder="* Full Name" required defaultValue={defaultFullName} />
                        <input className={inputClasses} name="email" type="email" placeholder="* Email Address" required defaultValue={defaultEmail} />
                        <input className={inputClasses} name="phone" type="tel" placeholder="* Phone Number" required defaultValue={defaultPhone} />
                        <select className={inputClasses} name="gender" defaultValue="">
                            <option value="" disabled>Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <input className={inputClasses} name="dateOfBirth" type="date" title="Date of Birth" />
                    </div>
                </section>

                {/* ADDRESS DETAILS */}
                <section>
                    <h3 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-500 pb-2 mb-4">Address Details</h3>
                    <div className="grid gap-4">
                        <input className={inputClasses} name="addressLine1" placeholder="* Address Line 1" required />
                        <input className={inputClasses} name="addressLine2" placeholder="Address Line 2 (Optional)" />
                        <div className="grid sm:grid-cols-3 gap-4">
                            <select className={inputClasses} name="state" value={selectedState} onChange={handleStateChange} required>
                                <option value="" disabled>Select State</option>
                                {Object.keys(statesMap).map(stateName => (
                                    <option key={stateName} value={stateName}>{stateName}</option>
                                ))}
                            </select>
                            <select className={inputClasses} name="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedState || availableCities.length === 0} required>
                                <option value="" disabled>Select City/District</option>
                                {availableCities.map(cityName => (
                                    <option key={cityName} value={cityName}>{cityName}</option>
                                ))}
                            </select>
                            <input className={inputClasses} name="pincode" placeholder="Pincode" />
                        </div>
                        <small className="block mt-1 text-sm text-gray-500">
                            Note: State and City/District are selected from the official list.
                        </small>
                    </div>
                </section>
                {/* KYC / IDENTITY */}
                <section>
                    <div className="flex justify-between mb-10 mt-10">
                        <Image src="/uidai-logo.png" alt="govt logo" width={1980} height={230} className="w-[25vh] h-[6vh] sm:w-[30vh] sm:h-[7vh] " />
                        <Image src="/aadhaar-logo.png" alt="govt logo" width={1980} height={230} className="w-[8vh] h-[6vh] sm:w-[10vh] sm:h-[7vh] " />
                    </div>

                    <div>
                        <Image
                            src="https://contents.irctc.co.in/en/Web_alerts_700x90.jpeg"
                            alt="alert"
                            width={700}
                            height={90}
                            className="w-full h-auto object-contain"
                        />

                    </div>

                    <h3 className="text-xl mt-3 font-bold text-indigo-700 border-b-2 border-indigo-500 pb-2 mb-4 flex items-center gap-3">
                        Identity Verification (KYC)

                        {/* Verified Status Badge */}
                        {kycVerified && (
                            <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Verified
                            </span>
                        )}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">

                        {/* ID Selection + ID Number */}
                        <div className={`${kycVerified ? "col-span-2" : ""}`}>
                            <div className="grid grid-cols-2 gap-4 mb-4 ">



                                <select

                                    className={inputClasses}
                                    name="idType"
                                    value={selectedIdType}
                                    onChange={(e) => {
                                        setSelectedIdType(e.target.value as IdCardType);
                                        setSelectedIdNumber("");
                                        setOtpSent(false);
                                        setKycVerified(false);
                                    }}
                                    disabled={kycVerified}
                                    required
                                >
                                    <option value="" disabled>Select ID Type *</option>
                                    <option value="AADHAR">Aadhaar Card</option>
                                    <option value="PAN">PAN Card</option>
                                    <option value="PASSPORT">Passport</option>
                                </select>


                                {/* ID Number */}
                                {selectedIdType && (
                                    <input
                                        className={inputClasses}
                                        name="idNumber"
                                        type="text"
                                        placeholder={`${selectedIdType} Number *`}
                                        value={selectedIdNumber}
                                        onChange={(e) => setSelectedIdNumber(e.target.value)}
                                        disabled={kycVerified}
                                        required
                                    />
                                )}
                            </div>

                            {/* Send OTP Button */}
                            {!kycVerified && !otpSent && (
                                <button
                                    type="button"
                                    className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700 w-full`}
                                    onClick={() => {
                                        if (!selectedIdType || !selectedIdNumber) {
                                            toast.error("Enter ID Type and ID Number first");
                                            return;
                                        }
                                        setOtpSent(true);
                                        toast.success("OTP sent successfully");
                                    }}
                                >
                                    Send OTP & Verify Identity
                                </button>
                            )}
                        </div>

                        {/* OTP Input */}
                        {otpSent && !kycVerified && (
                            <div className="col-span-2 sm:col-span-1 border border-dashed border-gray-400 p-4 rounded-lg bg-white">
                                <p className="text-sm text-gray-700 mb-2 font-medium">
                                    OTP sent to your registered mobile/email.
                                </p>

                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter 6-digit OTP"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        maxLength={6}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className={`${buttonBaseClasses} bg-green-600 hover:bg-green-700 whitespace-nowrap`}
                                        onClick={() => {
                                            if (otpCode.length === 0) {
                                                toast.error("Please enter OTP");
                                                return;
                                            }

                                            if (otpCode.length < 6) {
                                                toast.error("Please enter the full 6-digit OTP");
                                                return;
                                            }

                                            if (otpCode !== "123456") {
                                                toast.error("Invalid OTP");
                                                return;
                                            }

                                            setKycVerified(true);
                                            toast.success("KYC Verified Successfully!");
                                        }}
                                    >
                                        Verify OTP
                                    </button>

                                </div>

                                <small className="block mt-2 text-red-500 cursor-pointer hover:underline" onClick={handelResendOTP}>
                                    Resend OTP
                                </small>
                            </div>
                        )}

                        {/* KYC Note */}
                        <div className="mt-3">
                            <small className="col-span-2 text-sm text-gray-600 leading-relaxed">
                                <span className="font-medium text-gray-700">Security Note:</span>
                                We require KYC verification
                                <span className="font-medium text-gray-700"> (via OTP linked to your official ID)</span>
                                to comply with mandatory government travel and identification regulations.
                            </small>

                        </div>


                    </div>
                </section>



                <button
                    type="submit"
                    disabled={loading || !kycVerified}
                    className={`${buttonBaseClasses} ${loading || !kycVerified ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? "Saving Profile..." : "Save & Continue to Home"}
                </button>
            </form>
        </div>
    );
}
