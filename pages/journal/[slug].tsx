import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Article from '../../components/Article'
import { listJournal, getJournalPost, type JournalFront } from '../../lib/content'
import { articleSchema, breadcrumbs } from '../../lib/seo'

type Props = { mdx: MDXRemoteSerializeResult; meta: JournalFront }

export default function JournalPost({ mdx, meta }: Props) {
  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={`https://strategicsync.com/journal/${meta.slug}`}
        jsonLd={[
          articleSchema({ title: meta.title, description: meta.description, slug: meta.slug, date: meta.date, author: meta.author, type: 'journal' }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Journal', href: '/journal' }, { name: meta.title, href: `/journal/${meta.slug}` }]),
        ]}
      />
      <Navbar />
      <Article title={meta.title} kicker={meta.kicker} date={meta.date} readingTime={meta.readingTime} author={meta.author}>
        <MDXRemote {...mdx} />
      </Article>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listJournal()
  if (posts.length === 0) return { paths: [], fallback: false }
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const p = await getJournalPost(params!.slug as string)
  if (!p) return { notFound: true }
  const mdx = await serialize(p.content)
  const { content, ...meta } = p as any
  return { props: { mdx, meta } }
}
