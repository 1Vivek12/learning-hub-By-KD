import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: true }
  });

  if (!course) {
    return { title: 'Course Not Found | Learning Hub' };
  }

  const title = course.titleEn;
  const description = course.descShortEn;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: course.thumbnail ? [course.thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: course.thumbnail ? [course.thumbnail] : [],
    },
    alternates: {
      canonical: `/courses/${course.slug}`
    }
  };
}

export default async function CourseLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: true }
  });

  if (!course) return <>{children}</>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.titleEn,
    description: course.descShortEn,
    provider: {
      '@type': 'Organization',
      name: 'Learning Hub',
      sameAs: process.env.NEXT_PUBLIC_APP_URL || 'https://learninghub.io'
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'INR',
      category: course.categoryId
    },
    ...(course.instructor && {
      author: {
        '@type': 'Person',
        name: course.instructor.name
      }
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
