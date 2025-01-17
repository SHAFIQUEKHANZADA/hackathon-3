export const office = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Product Title',
            type: 'string',
            validation: (Rule) => Rule.required().min(3).max(150),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: (doc: SanityDocument) => {
                    const randomSuffix = Math.floor(Math.random() * 1000000000);
                    if (doc.title) {
                        return `${doc.title.replace(/\s+/g, '-').toLowerCase()}-${randomSuffix}`;
                    }
                    return randomSuffix.toString();
                },
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
            readOnly: true,
            initialValue: ({ document }) => {
                const categoryCode = document?.category?.slice(0, 2).toUpperCase() || 'F';  
                const randomId = Math.floor(100000000 + Math.random() * 900000000);  
                return `${categoryCode}${randomId}`;
            },
            validation: (Rule) => Rule.required(),
        }),        
        defineField({
            name: 'overview',
            title: 'Product Overview',
            type: 'string',
        }),
        defineField({
            name: 'productdetails',
            type: 'array',
            title: 'Product Details',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                    fields: [
                        {
                            type: 'text',
                            name: 'alt',
                            title: 'Alternative text',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'additionalInformation',
            type: 'array',
            title: 'Additional Information',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                    fields: [
                        {
                            type: 'text',
                            name: 'alt',
                            title: 'Alternative text',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'productReviews',
            type: 'object',
            title: 'Product Reviews',
            fields: [
                {
                    name: 'averageRating',
                    type: 'number',
                    title: 'Average Rating',
                    validation: (Rule) => Rule.min(0).max(5),
                },
                {
                    name: 'totalReviews',
                    type: 'number',
                    title: 'Total Reviews',
                },
                {
                    name: 'reviews',
                    type: 'array',
                    title: 'Individual Reviews',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                {
                                    name: 'reviewername',
                                    type: 'string',
                                    title: 'Reviewer Name',
                                  
                                },
                                {
                                    name: 'rating',
                                    type: 'number',
                                    title: 'Rating',
                                    validation: (Rule) => Rule.min(1).max(5),
                                },
                                {
                                    name: 'comment',
                                    type: 'text',
                                    title: 'Comment',
                                },
                            ],
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'images',
            title: 'Image Collection',
            type: 'array',
            of: [
                {
                    type: 'image',
                    fields: [
                        {
                            type: 'text',
                            name: 'alt',
                            title: 'Alternative text',
                        },
                    ],
                },
            ],
            options: {
                layout: 'grid',
            },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Men', value: 'men' },
                    { title: 'Women', value: 'women' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subcategory',
            title: 'Sub Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Pants', value: 'pants' },
                    { title: 'Shirt', value: 'shirt' },
                    { title: 'Tops', value: 'tops' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'stockStatus',
            title: 'Stock Status',
            type: 'string',
            options: {
                list: [
                    { title: 'In Stock', value: 'inStock' },
                    { title: 'Out of Stock', value: 'outOfStock' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'sale',
            title: 'On Sale',
            type: 'boolean',
        }),
        defineField({
            name: 'salePrice',
            title: 'Sale Price',
            type: 'number',
            validation: (Rule) =>
                Rule.custom((salePrice, context) => {
                    const { sale, price } = context.parent as { sale: boolean; price: number };
                    if (sale && (salePrice === undefined || salePrice >= price)) {
                        return 'Sale price must be less than the original price.';
                    }
                    return true;
                }),
            hidden: ({ parent }) => !(parent as { sale: boolean })?.sale,
        }),
        defineField({
            name: 'specialTag',
            title: 'Special Tag',
            type: 'string',
            options: {
                list: [
                    { title: 'New Arrival', value: 'newarrival' },
                    { title: 'Best Seller', value: 'bestSeller' },
                    { title: 'Featured', value: 'featured' },
                    { title: 'Special Offer', value: 'specialoffer' },
                ],
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title, category, media } = selection;
            return {
                title,
                subtitle: `${category}`,
                media,
            };
        },
    },
});
