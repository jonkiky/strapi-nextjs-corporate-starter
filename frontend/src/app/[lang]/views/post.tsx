import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import { postRenderer } from '@/app/[lang]/utils/post-renderer';
import Image from 'next/image';

interface Article {
    id: number;
    attributes: {
        title: string;
        description: string;
        slug: string;
        cover: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        authors_bios: {
            data: Array<{
                id: number;
                attributes: {
                    name: string;
                    email: string;
                    createdAt: string;
                    updatedAt: string;
                };
            }> | null;
        } | null;
        blocks: any[];
        publishedAt: string;
    };
}

export default function Post({ data }: { data: Article }) {
    const { title, description, publishedAt, cover, authors_bios } = data.attributes;
    const authorsBios = authors_bios?.data;
    const imageUrl = getStrapiMedia(cover.data?.attributes.url);

    return (
        <article className="space-y-8 dark:bg-black dark:text-gray-50">
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt="article cover image"
                    width={400}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg"
                />
            )}
            <div className="space-y-6">
                <h1 className="leading-tight text-5xl font-bold ">{title}</h1>
                <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
                    <div className="flex items-center md:space-x-2">
                        {authorsBios && authorsBios.length > 0 ? (
                          authorsBios.map((authorBio) => {
                            const { id, attributes } = authorBio;
                            const { name, email, } = attributes;
                            const authorImgUrl = getStrapiMedia(attributes.avatar.data.attributes.url);
                            return (
                              <span key={id} className="author-info">
                                {authorImgUrl && (
                                      <Image
                                    src={authorImgUrl}
                                    alt="article cover image"
                                    width={400}
                                    height={400}
                                />
                                    )}
                                <p className="text-md dark:text-violet-400">
                                  {name}
                                </p>
                              </span>
                            );
                          })
                        ) : (
                          <span>No authors available</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
                    <div className="flex items-center md:space-x-2">
                        <p className="text-md dark:text-violet-400">
                           {formatDate(publishedAt)}
                        </p>
                    </div>
                </div>
                 
            </div>

            <div className="dark:text-gray-100">
                <p>{description}</p>

                {data.attributes.blocks.map((section: any, index: number) => postRenderer(section, index))}
            </div>
        </article>
    );
}
