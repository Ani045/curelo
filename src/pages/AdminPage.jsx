
import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

const ImageUpload = ({ label, currentImage, onImageChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 border rounded overflow-hidden shrink-0">
                    {currentImage ? (
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="flex items-center justify-center h-full text-xs text-gray-400">No Img</span>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
                />
            </div>
        </div>
    );
};

const AdminPage = () => {
    const { data, updateSection } = useCMS();
    const [localData, setLocalData] = useState(data);
    const [activeTab, setActiveTab] = useState('hero');
    const [isDirty, setIsDirty] = useState(false);

    // Sync localData if data changes externally (or on first load if async, though here it's synchronous)
    // But mostly we want to verify dirtiness
    useEffect(() => {
        const activeSectionData = data[activeTab === 'packages' ? 'mostBookedPackages' : activeTab];
        const localSectionData = localData[activeTab === 'packages' ? 'mostBookedPackages' : activeTab];

        // Simple deep compare
        const dirty = JSON.stringify(activeSectionData) !== JSON.stringify(localSectionData);
        setIsDirty(dirty);
    }, [localData, data, activeTab]);


    const handleSave = () => {
        const sectionKey = activeTab === 'packages' ? 'mostBookedPackages' : activeTab;
        updateSection(sectionKey, localData[sectionKey]);
    };

    const updateLocalSection = (section, updates) => {
        setLocalData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...updates }
        }));
    };

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        updateLocalSection('hero', { [name]: value });
    };

    const handleHeroImageChange = (name, base64) => {
        updateLocalSection('hero', { [name]: base64 });
    };

    const handleTestDetailsChange = (e) => {
        const { name, value } = e.target;
        updateLocalSection('testDetails', { [name]: value });
    };

    const handleTestImageChange = (base64) => {
        updateLocalSection('testDetails', { bannerImage: base64 });
    };

    const handlePackageSectionChange = (e) => {
        const { name, value } = e.target;
        updateLocalSection('mostBookedPackages', { [name]: value });
    };

    const handlePackageImageChange = (name, base64) => {
        updateLocalSection('mostBookedPackages', { [name]: base64 });
    };

    // Helper functions for nested updates in local state
    const updateLocalTestCard = (index, field, value) => {
        setLocalData(prev => {
            const newCards = [...prev.testDetails.cards];
            newCards[index] = { ...newCards[index], [field]: value };
            return {
                ...prev,
                testDetails: { ...prev.testDetails, cards: newCards }
            };
        });
    };

    const updateLocalPackage = (index, field, value) => {
        setLocalData(prev => {
            const newPackages = [...prev.mostBookedPackages.packages];
            newPackages[index] = { ...newPackages[index], [field]: value };
            return {
                ...prev,
                mostBookedPackages: { ...prev.mostBookedPackages, packages: newPackages }
            };
        });
    };

    const renderSaveButton = () => (
        <div className="flex justify-end mb-6 sticky top-0 z-10 bg-gray-50 pt-4 pb-2">
            <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isDirty
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isDirty ? 'Save Changes' : 'Saved'}
            </button>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-900 text-white p-6">
                    <h1 className="text-2xl font-bold">CMS Admin Dashboard</h1>
                    <p className="text-blue-200">Manage your website content</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'hero' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('hero')}
                    >
                        Hero Section
                    </button>
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'testDetails' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('testDetails')}
                    >
                        Test Details
                    </button>
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'packages' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('packages')}
                    >
                        Most Booked Packages
                    </button>
                </div>

                <div className="p-6 relative">
                    {activeTab === 'hero' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Banners</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ImageUpload
                                        label="Desktop Banner"
                                        currentImage={localData.hero.desktopBanner}
                                        onImageChange={(base64) => handleHeroImageChange('desktopBanner', base64)}
                                    />
                                    <ImageUpload
                                        label="Mobile Banner"
                                        currentImage={localData.hero.mobileBanner}
                                        onImageChange={(base64) => handleHeroImageChange('mobileBanner', base64)}
                                    />
                                    <ImageUpload
                                        label="Small Mobile Banner"
                                        currentImage={localData.hero.smallBanner}
                                        onImageChange={(base64) => handleHeroImageChange('smallBanner', base64)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Offer Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                                        <input
                                            type="text"
                                            name="offerTitle"
                                            value={localData.hero.offerTitle}
                                            onChange={handleHeroChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Subtitle</label>
                                        <input
                                            type="text"
                                            name="offerSubtitle"
                                            value={localData.hero.offerSubtitle}
                                            onChange={handleHeroChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                        <input
                                            type="text"
                                            name="offerPriceOriginal"
                                            value={localData.hero.offerPriceOriginal}
                                            onChange={handleHeroChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'testDetails' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Main Content</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        value={localData.testDetails.description}
                                        onChange={handleTestDetailsChange}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <ImageUpload
                                    label="Banner Image"
                                    currentImage={localData.testDetails.bannerImage}
                                    onImageChange={handleTestImageChange}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Info Cards</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {localData.testDetails.cards.map((card, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded border">
                                            <div className="mb-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={card.title || card.sub} // supporting both for safety
                                                    onChange={(e) => updateLocalTestCard(index, 'title', e.target.value)}
                                                    className="w-full p-2 border rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={card.value}
                                                    onChange={(e) => updateLocalTestCard(index, 'value', e.target.value)}
                                                    className="w-full p-2 border rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'packages' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Section Items</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <ImageUpload
                                        label="Mobile GIF"
                                        currentImage={localData.mostBookedPackages.mobileGif}
                                        onImageChange={(base64) => handlePackageImageChange('mobileGif', base64)}
                                    />
                                    <ImageUpload
                                        label="Desktop GIF"
                                        currentImage={localData.mostBookedPackages.desktopGif}
                                        onImageChange={(base64) => handlePackageImageChange('desktopGif', base64)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Packages</h3>
                                <div className="space-y-6">
                                    {localData.mostBookedPackages.packages.map((pkg, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded border">
                                            <h4 className="font-bold text-gray-700 mb-3">Package {index + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.title}
                                                        onChange={(e) => updateLocalPackage(index, 'title', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Original Price</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.originalPrice}
                                                        onChange={(e) => updateLocalPackage(index, 'originalPrice', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount Price</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.price}
                                                        onChange={(e) => updateLocalPackage(index, 'price', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Includes (# Params)</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.includes}
                                                        onChange={(e) => updateLocalPackage(index, 'includes', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Report Time</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.reportTime}
                                                        onChange={(e) => updateLocalPackage(index, 'reportTime', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
