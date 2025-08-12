import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * SEO component for optimizing pages for search engines and social sharing
 */
export default function SEO({
  title = 'SmartApply | ATS Resume Checker',
  description = 'Optimize your resume for ATS systems with AI-powered analysis. Get instant feedback and improve your chances of landing interviews.',
  canonical,
  ogImage = '/og-image.png',
  noindex = false,
}: SEOProps) {
  const router = useRouter();
  const pageUrl = canonical || `${process.env.APP_URL}${router.asPath}`;
  const siteUrl = process.env.APP_URL || 'https://smartapply.ai';
  
  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        'name': 'SmartApply',
        'url': siteUrl,
        'logo': {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#logo`,
          'inLanguage': 'en-US',
          'url': `${siteUrl}/logo.png`,
          'contentUrl': `${siteUrl}/logo.png`,
          'width': 512,
          'height': 512,
          'caption': 'SmartApply'
        },
        'image': {
          '@id': `${siteUrl}/#logo`
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        'url': siteUrl,
        'name': 'SmartApply',
        'description': 'AI-Powered ATS Resume Checker',
        'publisher': {
          '@id': `${siteUrl}/#organization`
        },
        'inLanguage': 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        'url': pageUrl,
        'name': title,
        'isPartOf': {
          '@id': `${siteUrl}/#website`
        },
        'description': description,
        'inLanguage': 'en-US'
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'SmartApply ATS Resume Checker',
        'operatingSystem': 'Web',
        'applicationCategory': 'BusinessApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      }
    ]
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* No index if specified */}
      {noindex && <meta name="robots" content="noindex" />}
      
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
