class ImageUploadService {
    constructor() {
        this.providers = [
            // {
            //     name: 'ImgBB',
            //     upload: this.uploadToImgBB.bind(this),
            //     apiKey: process.env.NEXT_PUBLIC_IMGBB_API_KEY,
            //     maxSize: 32 * 1024 * 1024, // 32MB
            //     enabled: !!process.env.NEXT_PUBLIC_IMGBB_API_KEY
            // },
            {
                name: 'Cloudinary',
                upload: this.uploadToCloudinary.bind(this),
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                maxSize: 10 * 1024 * 1024, // 10MB for free tier
                enabled: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            },
            // {
            //     name: 'PostImages',
            //     upload: this.uploadToPostImages.bind(this),
            //     apiKey: null, // No API key required
            //     maxSize: 24 * 1024 * 1024, // 24MB
            //     enabled: true
            // },
            // {
            //     name: 'ImageKit',
            //     upload: this.uploadToImageKit.bind(this),
            //     apiKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
            //     maxSize: 25 * 1024 * 1024, // 25MB
            //     enabled: !!(process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY && process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)
            // }
        ];

        // Filter enabled providers
        this.enabledProviders = this.providers.filter(provider => provider.enabled);

        console.log(`ImageUploadService initialized with ${this.enabledProviders.length} providers:`,
            this.enabledProviders.map(p => p.name));
    }

    // Main upload method with fallback
    async uploadImage(file, onProgress = null) {
        if (!file) {
            throw new Error('No file provided');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        const errors = [];

        for (let i = 0; i < this.enabledProviders.length; i++) {
            const provider = this.enabledProviders[i];

            try {
                // Check file size against provider limit
                if (file.size > provider.maxSize) {
                    const sizeMB = (provider.maxSize / (1024 * 1024)).toFixed(0);
                    errors.push(`${provider.name}: File too large (max ${sizeMB}MB)`);
                    continue;
                }

                console.log(`Attempting upload with ${provider.name}...`);

                if (onProgress) {
                    onProgress({
                        provider: provider.name,
                        attempt: i + 1,
                        total: this.enabledProviders.length,
                        status: 'uploading'
                    });
                }

                const result = await provider.upload(file);

                console.log(`Successfully uploaded with ${provider.name}:`, result.url);

                if (onProgress) {
                    onProgress({
                        provider: provider.name,
                        attempt: i + 1,
                        total: this.enabledProviders.length,
                        status: 'success'
                    });
                }

                return {
                    url: result.url,
                    provider: provider.name,
                    deleteUrl: result.deleteUrl || null,
                    success: true
                };

            } catch (error) {
                console.error(`Upload failed with ${provider.name}:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);

                if (onProgress) {
                    onProgress({
                        provider: provider.name,
                        attempt: i + 1,
                        total: this.enabledProviders.length,
                        status: 'failed',
                        error: error.message
                    });
                }
            }
        }

        // All providers failed
        throw new Error(`All upload providers failed:\n${errors.join('\n')}`);
    }

    // ImgBB Upload
    // async uploadToImgBB(file) {
    //     const formData = new FormData();
    //     formData.append('image', file);
    //     formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

    //     const response = await fetch('https://api.imgbb.com/1/upload', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         const errorData = await response.json().catch(() => ({}));
    //         throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    //     }

    //     const data = await response.json();
    //     return {
    //         url: data.data.url,
    //         deleteUrl: data.data.delete_url
    //     };
    // }

    // Cloudinary Upload
    async uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            deleteUrl: null // Cloudinary requires API key for deletion
        };
    }

    // // PostImages Upload
    // async uploadToPostImages(file) {
    //     const formData = new FormData();
    //     formData.append('upload', file);

    //     const response = await fetch('https://postimages.org/json/rr', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         throw new Error(`HTTP ${response.status}`);
    //     }

    //     const data = await response.json();

    //     if (!data.status === 'OK' || !data.url) {
    //         throw new Error(data.error || 'Upload failed');
    //     }

    //     return {
    //         url: data.url,
    //         deleteUrl: null
    //     };
    // }

    // // ImageKit Upload
    // async uploadToImageKit(file) {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('fileName', file.name);
    //     formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);

    //     const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         const errorData = await response.json().catch(() => ({}));
    //         throw new Error(errorData.message || `HTTP ${response.status}`);
    //     }

    //     const data = await response.json();
    //     return {
    //         url: data.url,
    //         deleteUrl: null
    //     };
    // }

    // Get provider status
    getProviderStatus() {
        return this.enabledProviders.map(provider => ({
            name: provider.name,
            enabled: provider.enabled,
            maxSizeMB: Math.round(provider.maxSize / (1024 * 1024)),
            requiresApiKey: !!provider.apiKey
        }));
    }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();
export default imageUploadService;
