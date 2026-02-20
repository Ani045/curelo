
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

const ImageUpload = ({ label, currentImage, onImageChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result;
                // Basic check - if file is > 200kb, compress it
                if (file.size > 200 * 1024) {
                    const img = new Image();
                    img.src = result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_WIDTH = 1200;

                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressed = canvas.toDataURL('image/jpeg', 0.7);
                        onImageChange(compressed);
                    };
                } else {
                    onImageChange(result);
                }
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
    const params = useParams();
    const slug = params['*'];
    const navigate = useNavigate();
    const { data, updateSection, updateSectionAndSave, setActivePage, activePageSlug, getAllPages, activeTemplate, updatePageTemplate, saveToServer, loading } = useCMS();
    const [localData, setLocalData] = useState(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tagInputs, setTagInputs] = useState({}); // Stores raw string values for comma-separated inputs

    // Set active page on mount or slug change
    useEffect(() => {
        if (loading) return; // Wait for CMS data to load

        if (slug) {
            const pages = getAllPages();
            if (pages.some(p => p.slug === slug)) {
                setActivePage(slug);
            } else {
                navigate('/admin');
            }
        }
    }, [slug, setActivePage, getAllPages, navigate, loading]);

    // Update local data when the active page in context changes
    useEffect(() => {
        setLocalData(data);
    }, [data, activePageSlug]);

    // Sync localData if data changes externally (or on first load if async, though here it's synchronous)
    // But mostly we want to verify dirtiness
    useEffect(() => {
        if (!localData) return;

        let sectionKey = activeTab;
        if (activeTab === 'packages') sectionKey = 'mostBookedPackages';
        if (activeTab === 'formSettings') sectionKey = 'formData';

        const activeSectionData = data[sectionKey];
        const localSectionData = localData[sectionKey];

        // Simple deep compare
        const dirty = JSON.stringify(activeSectionData) !== JSON.stringify(localSectionData);
        setIsDirty(dirty);
    }, [localData, data, activeTab]);



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

    const handleTagInputChange = (index, field, rawValue) => {
        // Update local input state immediately for smooth typing
        setTagInputs(prev => ({ ...prev, [`${index}_${field}`]: rawValue }));

        // Parse and update the actual package data
        const tags = rawValue.split(',').map(t => t.trim()).filter(t => t !== '');
        updateLocalPackage(index, field, tags);
    };

    const getTagInputValue = (index, field, currentTags) => {
        const key = `${index}_${field}`;
        if (tagInputs[key] !== undefined) return tagInputs[key];
        return (currentTags || []).join(', ');
    };

    const handleTemplateChange = (e) => {
        updatePageTemplate(slug || 'home', e.target.value);
    };

    const handleSaveAndPublish = async () => {
        let sectionKey = activeTab;
        if (activeTab === 'packages') sectionKey = 'mostBookedPackages';
        if (activeTab === 'formSettings') sectionKey = 'formData';

        const result = await updateSectionAndSave(sectionKey, localData[sectionKey]);
        setSaving(false);

        if (result.success) {
            setTagInputs({}); // Clear tag inputs to resync with fresh data
            alert('Changes saved and published to server successfully!');
        } else {
            alert('Failed to save and publish: ' + result.error);
        }
    };

    const renderSaveButton = () => (
        <div className="flex justify-end items-center gap-4 mb-6 sticky top-0 z-10 bg-gray-50 pt-4 pb-2">
            <button
                onClick={handleSaveAndPublish}
                disabled={saving || !isDirty}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${saving || !isDirty
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                    }`}
                title={isDirty ? "Save and publish changes to the server" : "No unsaved changes"}
            >
                {saving ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving & Publishing...
                    </>
                ) : (
                    <>Save & Publish</>
                )}
            </button>
        </div>
    );


    if (!localData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-400 animate-pulse">Loading Page Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">CMS Admin Dashboard</h1>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-blue-200">Editing Page: <span className="font-mono bg-blue-800 px-2 py-0.5 rounded text-white">{slug || 'home'}</span></p>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-200 text-sm">Template:</span>
                                <select
                                    value={activeTemplate}
                                    onChange={handleTemplateChange}
                                    className="bg-blue-800 text-white text-sm px-2 py-0.5 rounded border border-blue-700 outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    <option value="default">Default</option>
                                    <option value="minimal">Minimal</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-blue-700 cursor-pointer"
                    >
                        <span>←</span> Back to Dashboard
                    </button>
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
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'whyChooseUs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('whyChooseUs')}
                    >
                        Why Choose Us
                    </button>
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'faqs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('faqs')}
                    >
                        FAQs
                    </button>
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'contact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        Contact Info
                    </button>
                    <button
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'formSettings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('formSettings')}
                    >
                        Form Settings
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                                        <input
                                            type="text"
                                            name="formTitle"
                                            value={localData.hero.formTitle || ''}
                                            onChange={handleHeroChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">USPs Section Title</label>
                                        <input
                                            type="text"
                                            name="uspsTitle"
                                            value={localData.hero.uspsTitle || ''}
                                            onChange={handleHeroChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">USP Points (Icons & Text)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(localData.hero.usps || []).map((usp, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded border">
                                            <h4 className="font-bold text-gray-700 mb-3">USP {index + 1}</h4>
                                            <ImageUpload
                                                label="Icon"
                                                currentImage={usp.icon}
                                                onImageChange={(base64) => {
                                                    const newUsps = [...localData.hero.usps];
                                                    newUsps[index].icon = base64;
                                                    updateLocalSection('hero', { usps: newUsps });
                                                }}
                                            />
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={usp.title}
                                                    onChange={(e) => {
                                                        const newUsps = [...localData.hero.usps];
                                                        newUsps[index].title = e.target.value;
                                                        updateLocalSection('hero', { usps: newUsps });
                                                    }}
                                                    className="w-full p-2 border rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Section Header</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={localData.mostBookedPackages.title}
                                            onChange={handlePackageSectionChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            value={localData.mostBookedPackages.subtitle}
                                            onChange={handlePackageSectionChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
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
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Original Price</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.originalPrice}
                                                        onChange={(e) => updateLocalPackage(index, 'originalPrice', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount Price</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.price}
                                                        onChange={(e) => updateLocalPackage(index, 'price', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Includes (# Params)</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.includes}
                                                        onChange={(e) => updateLocalPackage(index, 'includes', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Report Time</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.reportTime}
                                                        onChange={(e) => updateLocalPackage(index, 'reportTime', e.target.value)}
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Main Parameters (Comma separated)</label>
                                                    <input
                                                        type="text"
                                                        value={getTagInputValue(index, 'tags', pkg.tags)}
                                                        onChange={(e) => handleTagInputChange(index, 'tags', e.target.value)}
                                                        placeholder="HbA1c, Lipid, Liver, Kidney"
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Extra Parameters (Comma separated, shown in +X More)</label>
                                                    <input
                                                        type="text"
                                                        value={getTagInputValue(index, 'extraTags', pkg.extraTags)}
                                                        onChange={(e) => handleTagInputChange(index, 'extraTags', e.target.value)}
                                                        placeholder="Infection, Thyroid"
                                                        className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'whyChooseUs' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Section Header</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={localData.whyChooseUs.title}
                                            onChange={(e) => updateLocalSection('whyChooseUs', { title: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input
                                            type="text"
                                            value={localData.whyChooseUs.subtitle}
                                            onChange={(e) => updateLocalSection('whyChooseUs', { subtitle: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Features</h3>
                                <div className="space-y-4">
                                    {localData.whyChooseUs.features.map((feature, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded border">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon Name (react-icons)</label>
                                                    <input
                                                        type="text"
                                                        value={feature.icon}
                                                        onChange={(e) => {
                                                            const newFeatures = [...localData.whyChooseUs.features];
                                                            newFeatures[index].icon = e.target.value;
                                                            updateLocalSection('whyChooseUs', { features: newFeatures });
                                                        }}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => {
                                                            const newFeatures = [...localData.whyChooseUs.features];
                                                            newFeatures[index].title = e.target.value;
                                                            updateLocalSection('whyChooseUs', { features: newFeatures });
                                                        }}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                    <input
                                                        type="text"
                                                        value={feature.description}
                                                        onChange={(e) => {
                                                            const newFeatures = [...localData.whyChooseUs.features];
                                                            newFeatures[index].description = e.target.value;
                                                            updateLocalSection('whyChooseUs', { features: newFeatures });
                                                        }}
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

                    {activeTab === 'faqs' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Section Header</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={localData.faqs.title}
                                            onChange={(e) => updateLocalSection('faqs', { title: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input
                                            type="text"
                                            value={localData.faqs.subtitle}
                                            onChange={(e) => updateLocalSection('faqs', { subtitle: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <ImageUpload
                                            label="FAQ Section Image"
                                            currentImage={localData.faqs.image}
                                            onImageChange={(base64) => updateLocalSection('faqs', { image: base64 })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">FAQ Items</h3>
                                    <button
                                        onClick={() => {
                                            const newItems = [...localData.faqs.items, { question: '', answer: '' }];
                                            updateLocalSection('faqs', { items: newItems });
                                        }}
                                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                                    >
                                        + Add FAQ
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {localData.faqs.items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded border">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-bold text-gray-700">FAQ {index + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        const newItems = localData.faqs.items.filter((_, i) => i !== index);
                                                        updateLocalSection('faqs', { items: newItems });
                                                    }}
                                                    className="text-red-500 text-xs hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                                                    <input
                                                        type="text"
                                                        value={item.question}
                                                        onChange={(e) => {
                                                            const newItems = [...localData.faqs.items];
                                                            newItems[index].question = e.target.value;
                                                            updateLocalSection('faqs', { items: newItems });
                                                        }}
                                                        className="w-full p-2 border rounded text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                                                    <textarea
                                                        rows="3"
                                                        value={item.answer}
                                                        onChange={(e) => {
                                                            const newItems = [...localData.faqs.items];
                                                            newItems[index].answer = e.target.value;
                                                            updateLocalSection('faqs', { items: newItems });
                                                        }}
                                                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (with +91)</label>
                                        <input
                                            type="text"
                                            value={localData.contact?.phone || ''}
                                            onChange={(e) => updateLocalSection('contact', { phone: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="+91 806 977 0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (digits only)</label>
                                        <input
                                            type="text"
                                            value={localData.contact?.whatsapp || ''}
                                            onChange={(e) => updateLocalSection('contact', { whatsapp: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="918069770000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Default Message</label>
                                        <textarea
                                            rows="2"
                                            value={localData.contact?.whatsappMessage || ''}
                                            onChange={(e) => updateLocalSection('contact', { whatsappMessage: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'formSettings' && (
                        <div className="space-y-8">
                            {renderSaveButton()}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Form Data</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cities (One per line)</label>
                                    <textarea
                                        rows="10"
                                        value={(localData.formData?.cities || []).join('\n')}
                                        onChange={(e) => {
                                            const cities = e.target.value.split('\n').map(c => c.trim()).filter(c => c !== '');
                                            updateLocalSection('formData', { cities });
                                        }}
                                        className="w-full p-3 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Delhi&#10;Noida&#10;Gurgaon..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2 italic">Add one city name per line. Empty lines will be removed.</p>
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
