import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Article from '../../components/Article'
import { listCases, getCase, type CaseFront } from '../../lib/content'
import { articleSchema, breadcrumbs } from '../../lib/seo'

type Props = { mdx: MDXRemoteSerializeResult; meta: CaseFront }

export default function CasePage({ mdx, meta }: Props) {
  return (
    <>
      <SEO
        title={`${meta.client} — ${meta.industry}`}
        description={meta.description}
        canonical={`https://strategicsync.com/work/${meta.slug}`}
        jsonLd={[
          articleSchema({ title: meta.client, description: meta.description, slug: meta.slug, date: meta.date, author: 'Strategic Sync', type: 'work' }),
          breadcrumbs([{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }, { name: meta.client, href: `/work/${meta.slug}` }]),
        ]}
      />
      <Navbar />
      <Article title={meta.client} kicker={`Case · ${meta.industry}`} date={meta.date} readingTime="5 min read" author="Strategic Sync">
        <div className="not-prose grid grid-cols-3 gap-6 mb-12 border-y border-rule py-8">
          <div><div className="kicker mb-2">Outcome</div><div className="serif text-3xl text-accent">{meta.metric}</div><div className="kicker mt-1">{meta.metricLabel}</div></div>
          <div><div className="kicker mb-2">Stack</div><div className="body-s">{meta.stack.join(', ')}</div></div>
          <div><div className="kicker mb-2">Date</div><div className="body-s">{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div></div>
        </div>
        <MDXRemote {...mdx} />
      </Article>
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cases = await listCases()
  return { paths: cases.map((c) => ({ params: { slug: c.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const c = await getCase(params!.slug as string)
  if (!c) return { notFound: true }
  const mdx = await serialize(c.content)
  const { content, ...meta } = c as any
  return { props: { mdx, meta } }
}
