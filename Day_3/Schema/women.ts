import { SanityDocument } from 'next-sanity';
import { defineField, defineType } from 'sanity';

export const women = defineType({
    name: 'women',
    title: 'Women',
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
        // defineField({
        //     name: 'mainImage',
        //     title: 'Main Image',
        //     type: 'image',
        //     options: {
        //         hotspot: true,
        //     },
        //     validation: (Rule) => Rule.required(),
        // }),
        defineField({
            name: 'sideImages',
            title: 'Side Images',
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
            name: 'sizes',
            title: 'Available Sizes',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'category',
            title: 'Women,s Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Dress', value: 'dress' },
                    { title: 'Tops', value: 'tshirt' },
                    { title: 'Jacket', value: 'jacket' },
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
                    { title: 'Top Trending', value: 'topTrending' },
                    { title: 'Best Selling', value: 'bestSelling' },
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
