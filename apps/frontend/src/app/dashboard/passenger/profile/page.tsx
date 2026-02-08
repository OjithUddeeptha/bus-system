'use client';
import { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/api';
import Image from 'next/image';
import { FaUserCircle, FaEnvelope, FaPhone, FaWallet, FaStar, FaSave, FaUser, FaCamera, FaEdit } from 'react-icons/fa';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    walletBalance: number;
    loyaltyPoints: number;
    phoneNumber?: string;
    profileImage?: string;
    preferences?: any;
}

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phoneNumber: '',
            role: '',
            walletBalance: 0,
            loyaltyPoints: 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phoneNumber: Yup.string().matches(/^\+?[0-9\s-]+$/, 'Invalid phone number').nullable(),
        }),
        onSubmit: async (values) => {
            try {
                setErrorMsg('');
                setSuccessMsg('');
                const res = await api.patch('/users/profile', {
                    name: values.name,
                    phoneNumber: values.phoneNumber,
                });
                setSuccessMsg('Profile updated successfully!');
                formik.setValues((prev) => ({
                    ...prev,
                    name: res.data.name,
                    phoneNumber: res.data.phoneNumber || '',
                }));
                setIsEditing(false); // Close edit mode on success
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (error) {
                console.error(error);
                setErrorMsg('Failed to update profile.');
            }
        },
    });

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            const data = res.data;
            formik.setValues({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                role: data.role || '',
                walletBalance: data.walletBalance || 0,
                loyaltyPoints: data.loyaltyPoints || 0,
            });
            setProfileImage(data.profileImage || null);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            setErrorMsg('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await api.post('/users/profile/upload', formData);
                setProfileImage(res.data.url);
                setSuccessMsg('Profile photo updated!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (error) {
                console.error('Upload failed', error);
                setErrorMsg('Failed to upload image.');
            }
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaUserCircle className="text-indigo-400" />
                My Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Summary */}
                <div className="space-y-6">
                    {/* User Card */}
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-full border-4 border-indigo-500 shadow-lg overflow-hidden flex items-center justify-center bg-gray-700">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                        unoptimized={!profileImage.startsWith('http')}
                                    />
                                ) : (
                                    <span className="text-5xl font-bold text-gray-400">
                                        {formik.values.name ? formik.values.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition shadow-lg"
                            >
                                <FaCamera className="text-white text-sm" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <h2 className="text-2xl font-bold">{formik.values.name}</h2>
                        <span className="mt-2 bg-indigo-900 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-700 uppercase tracking-wide font-semibold">
                            {formik.values.role}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-750 p-6 rounded-xl border border-gray-700 flex items-center justify-between shadow-lg">
                            <div>
                                <p className="text-gray-400 text-sm font-medium uppercase">Wallet Balance</p>
                                <p className="text-2xl font-bold text-white mt-1">LKR {formik.values.walletBalance.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center text-yellow-500 text-xl">
                                <FaWallet />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-gray-800 to-gray-750 p-6 rounded-xl border border-gray-700 flex items-center justify-between shadow-lg">
                            <div>
                                <p className="text-gray-400 text-sm font-medium uppercase">Loyalty Points</p>
                                <p className="text-2xl font-bold text-white mt-1">{formik.values.loyaltyPoints}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-500 text-xl">
                                <FaStar />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                            <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
                            >
                                <FaEdit /> {isEditing ? 'Cancel Editing' : 'Edit Details'}
                            </button>
                        </div>

                        {successMsg && (
                            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200">
                                {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaUser className="text-gray-500" /> Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        disabled={!isEditing}
                                        {...formik.getFieldProps('name')}
                                        value={formik.values.name || ''}
                                        className={`w-full border rounded-lg p-3 shadow-sm transition-all ${isEditing ? 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'}`}
                                        placeholder="Enter your name"
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-red-400 text-sm">{formik.errors.name}</div>
                                    ) : null}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaPhone className="text-gray-500" /> Phone Number
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        disabled={!isEditing}
                                        {...formik.getFieldProps('phoneNumber')}
                                        value={formik.values.phoneNumber || ''}
                                        className={`w-full border rounded-lg p-3 shadow-sm transition-all ${isEditing ? 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'}`}
                                        placeholder="+94 77 123 4567"
                                    />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                        <div className="text-red-400 text-sm">{formik.errors.phoneNumber}</div>
                                    ) : null}
                                </div>

                                {/* Email (Read-only) */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaEnvelope className="text-gray-500" /> Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formik.values.email || ''}
                                        disabled
                                        className="w-full bg-gray-700 text-gray-400 border border-gray-600 rounded-lg p-3 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-6 animate-fade-in">
                                    <button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <FaSave />
                                        {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
