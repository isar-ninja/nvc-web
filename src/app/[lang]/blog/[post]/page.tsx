import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { BlogPost, blogPosts } from "@/lib/blog-data";
import { remark } from "remark";
import html from "remark-html";

export default async function Component(params: any) {
  const { post: slug } = await params.params;
  const post: BlogPost = blogPosts.find((post) => post.slug === slug)!;

  async function getContent(md: string) {
    const processedContent = await remark().use(html).process(md);
    return processedContent.toString();
  }

  const ModernLayout = () => (
    <article className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground">{post.subtitle}</p>

          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
          <Image
            src={post.heroImage || "/placeholder.svg"}
            alt="Hero image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {post.content.map(async (item, index) => {
          switch (item.type) {
            case "paragraph":
              const contentHtml = await getContent(item.text);
              return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
            case "heading":
              return (
                <h2 key={index} className="text-2xl font-semibold mt-12 mb-6">
                  {item.text}
                </h2>
              );
            case "image":
              return (
                <figure key={index} className="my-12">
                  <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-4">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            default:
              return null;
          }
        })}
      </div>
    </article>
  );

  return (
    <div className="w-full mt-12 min-h-screen bg-background">
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <ModernLayout />
      </div>
    </div>
  );
}
